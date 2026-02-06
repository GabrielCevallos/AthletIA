import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);

  constructor(private configService: ConfigService) {}

  async generateExerciseDescription(
    name: string,
    muscle?: string,
    equipment?: string,
  ): Promise<string> {
    const apiKey = this.configService.get<string>('OPENAI_API_KEY');

    this.logger.log(`Generating description for: ${name}`);
    this.logger.debug(`API Key present: ${!!apiKey}`);

    // If no API key or is default, use smart fallback
    if (!apiKey || apiKey === 'your_openai_api_key_here') {
      this.logger.warn('OPENAI_API_KEY not configured, using smart fallback');
      return this.generateSmartFallbackDescription(name, muscle, equipment);
    }

    try {
      // Usar una temperatura alta para asegurar variación en las respuestas
      const temperature = 0.8 + Math.random() * 0.4; // 0.8 a 1.2 para mayor creatividad

      // Estilos diferentes de prompts para mayor variedad
      const promptVariations = [
        {
          prompt: `Genera una descripción breve y práctica para el ejercicio: "${name}"${
            muscle ? ` que trabaja ${muscle}` : ''
          }${equipment ? ` utilizando ${equipment}` : ''}. Enfócate en técnica correcta, beneficios principales y cómo ejecutarlo sin lesiones.`,
          style: 'técnico'
        },
        {
          prompt: `Escribe una guía para principiantes sobre cómo realizar el ejercicio "${name}"${
            muscle ? ` para fortalecer ${muscle}` : ''
          }${equipment ? ` con ${equipment}` : ''}. Incluye pasos simples, errores comunes y tips para mejorar.`,
          style: 'principiante'
        },
        {
          prompt: `Como coach experimentado, describe cómo optimizar el ejercicio "${name}"${
            muscle ? ` orientado a ${muscle}` : ''
          }${equipment ? ` usando ${equipment}` : ''}. Menciona variantes avanzadas, progresión y cómo ajustarlo a diferentes niveles.`,
          style: 'avanzado'
        },
        {
          prompt: `Proporciona una descripción completa del ejercicio "${name}"${
            muscle ? ` para trabajo de ${muscle}` : ''
          }${equipment ? ` con ${equipment}` : ''}. Incluye anatomía involucrada, forma correcta, beneficios y recomendaciones de series/reps.`,
          style: 'anatómico'
        },
        {
          prompt: `Crea una descripción motivadora del ejercicio: "${name}"${
            muscle ? `, enfocado en ${muscle}` : ''
          }${equipment ? `, utilizando ${equipment}` : ''}. Destaca por qué es efectivo, qué resultados se pueden esperar y cómo mantener la consistencia.`,
          style: 'motivacional'
        }
      ];
      
      const selectedVariation = promptVariations[Math.floor(Math.random() * promptVariations.length)];
      this.logger.debug(`Selected prompt style: ${selectedVariation.style}`);

      const systemPrompts = [
        'Eres un entrenador personal certificado. Proporciona descripciones de ejercicios claras, basadas en evidencia y seguras. Máximo 500 caracteres.',
        'Eres un fisioterapeuta especializado en fitness. Describe ejercicios con enfoque en biomecánica y prevención de lesiones. Máximo 500 caracteres.',
        'Eres un coach de fitness con experiencia. Describe ejercicios de forma práctica y motivadora, con consejos aplicables. Máximo 500 caracteres.',
        'Eres un especialista en acondicionamiento físico. Proporciona descripciones detalladas y específicas de ejercicios. Máximo 500 caracteres.',
      ];

      const selectedSystemPrompt = systemPrompts[Math.floor(Math.random() * systemPrompts.length)];

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: selectedSystemPrompt,
            },
            {
              role: 'user',
              content: selectedVariation.prompt,
            },
          ],
          temperature,
          max_tokens: 300,
          top_p: 0.95,
          frequency_penalty: 0.8,
          presence_penalty: 0.8,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        this.logger.error('OpenAI API Error:', JSON.stringify(error));
        
        // Check for quota/billing errors
        if (error.error?.code === 'insufficient_quota' || 
            error.error?.type === 'insufficient_quota' ||
            error.error?.message?.includes('quota') ||
            error.error?.message?.includes('billing')) {
          this.logger.warn('OpenAI quota exceeded, using smart fallback');
          return this.generateSmartFallbackDescription(name, muscle, equipment);
        }
        
        throw new Error(
          error.error?.message || 'Error al generar descripción con OpenAI',
        );
      }

      const data = await response.json();
      let description = data.choices[0]?.message?.content || 'No se pudo generar la descripción';
      
      // Asegurar que no exceda 500 caracteres
      if (description.length > 500) {
        description = description.substring(0, 497) + '...';
      }
      
      this.logger.log(`Description generated successfully with OpenAI (${description.length} chars, style: ${selectedVariation.style})`);
      return description;
    } catch (error) {
      this.logger.error('AI Generation Error:', error.message);
      
      // Use smart fallback for any error
      this.logger.warn('Using smart fallback due to OpenAI error');
      return this.generateSmartFallbackDescription(name, muscle, equipment);
    }
  }

  private generateSmartFallbackDescription(
    name: string,
    muscle?: string,
    equipment?: string,
  ): string {
    const normalizedName = name.toLowerCase();
    const normalizedMuscle = muscle?.toLowerCase() || '';
    const normalizedEquipment = equipment?.toLowerCase() || '';

    // Detectar tipo de ejercicio basado en patrones
    let exerciseType = 'general';
    let primaryMuscle = normalizedMuscle;

    // Análisis por nombre de ejercicio
    if (normalizedName.includes('press') || normalizedName.includes('prensa')) {
      exerciseType = 'press';
      if (!primaryMuscle) primaryMuscle = normalizedName.includes('hombro') ? 'hombros' : 'pecho';
    } else if (normalizedName.includes('curl') || normalizedName.includes('flexión')) {
      exerciseType = 'curl';
      if (!primaryMuscle) primaryMuscle = 'bíceps';
    } else if (normalizedName.includes('squat') || normalizedName.includes('sentadilla')) {
      exerciseType = 'squat';
      if (!primaryMuscle) primaryMuscle = 'piernas';
    } else if (normalizedName.includes('deadlift') || normalizedName.includes('peso muerto')) {
      exerciseType = 'deadlift';
      if (!primaryMuscle) primaryMuscle = 'espalda';
    } else if (normalizedName.includes('row') || normalizedName.includes('remo')) {
      exerciseType = 'row';
      if (!primaryMuscle) primaryMuscle = 'espalda';
    } else if (normalizedName.includes('pull') || normalizedName.includes('jalón')) {
      exerciseType = 'pull';
      if (!primaryMuscle) primaryMuscle = 'espalda';
    } else if (normalizedName.includes('lunge') || normalizedName.includes('zancada')) {
      exerciseType = 'lunge';
      if (!primaryMuscle) primaryMuscle = 'piernas';
    } else if (normalizedName.includes('crunch') || normalizedName.includes('abdominal')) {
      exerciseType = 'core';
      if (!primaryMuscle) primaryMuscle = 'abdominales';
    }

    // Templates específicos por tipo de ejercicio
    const templates = {
      press: {
        intro: `${name} es un ejercicio compuesto fundamental para desarrollar fuerza y masa muscular en la parte superior del cuerpo.`,
        technique: `La ejecución correcta requiere mantener una postura estable, controlar el movimiento en ambas fases (concéntrica y excéntrica), y evitar arquear excesivamente la espalda. Es fundamental respirar correctamente: exhalar durante el empuje y inhalar al descender.`,
        benefits: `Este ejercicio es excelente para desarrollar ${primaryMuscle}, mejorando tanto la fuerza como la definición muscular. También activa músculos estabilizadores, contribuyendo a un desarrollo muscular equilibrado.`,
      },
      curl: {
        intro: `${name} es un ejercicio de aislamiento ideal para trabajar específicamente ${primaryMuscle}.`,
        technique: `Mantén los codos fijos a los costados del cuerpo y controla el movimiento en todo momento. Evita balancear el torso o usar impulso. La clave está en la contracción muscular controlada, no en el peso levantado.`,
        benefits: `Excelente para desarrollar y definir ${primaryMuscle}. Al ser un ejercicio de aislamiento, permite enfocarse completamente en el músculo objetivo, maximizando la conexión mente-músculo.`,
      },
      squat: {
        intro: `${name} es considerado el rey de los ejercicios para la parte inferior del cuerpo, siendo fundamental en cualquier programa de entrenamiento.`,
        technique: `Mantén la espalda recta, el core activado, y desciende hasta que los muslos estén paralelos al suelo o más abajo si tu movilidad lo permite. Las rodillas deben seguir la línea de los pies, evitando que se desplacen hacia adentro.`,
        benefits: `Trabaja de manera integral cuádriceps, glúteos, isquiotibiales y core. Además, estimula la liberación de hormonas anabólicas, favoreciendo el crecimiento muscular general. Es excelente para mejorar la fuerza funcional y el rendimiento atlético.`,
      },
      deadlift: {
        intro: `${name} es uno de los ejercicios más completos y efectivos para desarrollar fuerza general y masa muscular.`,
        technique: `La técnica es crucial: mantén la espalda neutral (no redondees la zona lumbar), activa el core, y levanta la barra manteniendo el peso cerca del cuerpo. El movimiento debe ser fluido, empujando con las piernas mientras extiendes las caderas.`,
        benefits: `Trabaja prácticamente todo el cuerpo: espalda baja, glúteos, isquiotibiales, cuádriceps, trapecios y antebrazos. Es excepcional para desarrollar fuerza funcional y mejorar la postura. Aumenta significativamente la densidad ósea.`,
      },
      row: {
        intro: `${name} es un ejercicio fundamental para desarrollar grosor y densidad en la espalda.`,
        technique: `Mantén la espalda recta durante todo el movimiento. Tira del peso hacia tu cuerpo usando la espalda, no solo los brazos. Concéntrate en juntar los omóplatos al final del movimiento. Controla tanto la fase concéntrica como la excéntrica.`,
        benefits: `Excelente para desarrollar los músculos de la espalda media y alta, mejorando la postura y equilibrando el desarrollo muscular. También trabaja los bíceps de forma secundaria.`,
      },
      pull: {
        intro: `${name} es un ejercicio clave para desarrollar anchura en la espalda y fuerza en la parte superior del cuerpo.`,
        technique: `Agarre firme, activación del core, y movimiento controlado son esenciales. Enfócate en usar los músculos de la espalda para iniciar el movimiento, no solo los brazos. Evita balancearte o usar impulso.`,
        benefits: `Desarrolla los dorsales, dando anchura a la espalda. También trabaja bíceps, antebrazos y mejora significativamente la fuerza de agarre. Es fundamental para lograr el físico en forma de V.`,
      },
      lunge: {
        intro: `${name} es un ejercicio unilateral excelente para desarrollar piernas fuertes y mejorar el equilibrio.`,
        technique: `Da un paso amplio hacia adelante o atrás, manteniendo el torso erguido. Desciende hasta que ambas rodillas formen ángulos de 90 grados. La rodilla delantera no debe sobrepasar la punta del pie.`,
        benefits: `Trabaja cuádriceps, glúteos e isquiotibiales de forma unilateral, ayudando a corregir desequilibrios musculares. Excelente para mejorar el equilibrio, la estabilidad y la fuerza funcional.`,
      },
      core: {
        intro: `${name} es un ejercicio efectivo para fortalecer y definir la musculatura abdominal.`,
        technique: `Mantén la zona lumbar pegada al suelo o controlada durante todo el movimiento. Evita jalar del cuello; el movimiento debe venir del core. Controla la respiración: exhala al contraer, inhala al relajar.`,
        benefits: `Fortalece el core, mejorando la estabilidad general del cuerpo y la postura. Un core fuerte es esencial para prevenir lesiones y mejorar el rendimiento en todos los demás ejercicios.`,
      },
      general: {
        intro: `${name} es un ejercicio efectivo que permite trabajar ${primaryMuscle || 'diferentes grupos musculares'} de manera controlada.`,
        technique: `Ejecuta el movimiento de forma controlada, manteniendo una postura correcta en todo momento. Concéntrate en la conexión mente-músculo, sintiendo cómo trabaja el músculo objetivo. La técnica siempre debe primar sobre el peso utilizado.`,
        benefits: `Este ejercicio contribuye al desarrollo muscular y la mejora de la fuerza${primaryMuscle ? ` en ${primaryMuscle}` : ''}. Incorporarlo en tu rutina ayudará a lograr un desarrollo muscular más completo y equilibrado.`,
      },
    };

    const template = templates[exerciseType] || templates.general;

    // Agregar información sobre el equipo si está disponible
    let equipmentInfo = '';
    if (normalizedEquipment && normalizedEquipment !== 'no especificado') {
      if (normalizedEquipment.includes('barra') || normalizedEquipment.includes('barbell')) {
        equipmentInfo = ` Se realiza utilizando barra, lo que permite trabajar con cargas pesadas y progresar constantemente.`;
      } else if (normalizedEquipment.includes('mancuerna') || normalizedEquipment.includes('dumbbell')) {
        equipmentInfo = ` Se ejecuta con mancuernas, permitiendo mayor rango de movimiento y trabajo unilateral para corregir desbalances.`;
      } else if (normalizedEquipment.includes('cable') || normalizedEquipment.includes('polea')) {
        equipmentInfo = ` Se realiza en polea/cable, proporcionando tensión constante durante todo el rango de movimiento.`;
      } else if (normalizedEquipment.includes('máquina') || normalizedEquipment.includes('machine')) {
        equipmentInfo = ` Se ejecuta en máquina, ofreciendo un movimiento guiado ideal para principiantes o para aislar el músculo.`;
      } else if (normalizedEquipment.includes('peso corporal') || normalizedEquipment.includes('bodyweight')) {
        equipmentInfo = ` No requiere equipo adicional, utilizando tu propio peso corporal, lo que lo hace accesible en cualquier lugar.`;
      } else {
        equipmentInfo = ` Se realiza utilizando ${equipment}.`;
      }
    }

    return `${template.intro}${equipmentInfo}\n\n${template.technique}\n\n${template.benefits}`;
  }
}
