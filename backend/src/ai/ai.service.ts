import { Injectable } from '@nestjs/common';

@Injectable()
export class AiService {
  async generateExerciseDescription(
    name: string,
    muscle?: string,
    equipment?: string,
  ): Promise<string> {
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey || apiKey === 'your_openai_api_key_here') {
      throw new Error(
        'OPENAI_API_KEY is not configured. Please add your OpenAI API key to the .env file.',
      );
    }

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content:
                'Eres un entrenador personal experto. Genera descripciones detalladas y útiles para ejercicios de fitness en español. Las descripciones deben ser concisas pero informativas, de 2-3 párrafos.',
            },
            {
              role: 'user',
              content: `Genera una descripción para el ejercicio: "${name}"${
                muscle ? ` para trabajar ${muscle}` : ''
              }${equipment ? ` utilizando ${equipment}` : ''}. La descripción debe incluir técnica, beneficios y recomendaciones.`,
            },
          ],
          temperature: 0.7,
          max_tokens: 300,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('OpenAI API Error:', error);
        throw new Error(
          error.error?.message || 'Error al generar descripción con OpenAI',
        );
      }

      const data = await response.json();
      return (
        data.choices[0]?.message?.content ||
        'No se pudo generar la descripción'
      );
    } catch (error) {
      console.error('AI Generation Error:', error);
      throw error;
    }
  }
}
