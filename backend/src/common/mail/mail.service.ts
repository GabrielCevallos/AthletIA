import { Injectable, Logger } from '@nestjs/common';
import Mailjet from 'node-mailjet';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private client: any = null;
  private isConfigured = false;
  private senderEmail: string;

  constructor() {
    // Initialize Mailjet client using env variables
    const apiKey = process.env.MAILJET_API_KEY;
    const secretKey = process.env.MAILJET_SECRET_KEY;
    this.senderEmail = process.env.MAILJET_FROM_EMAIL || 'no-reply@athletia.com';

    if (apiKey && secretKey) {
      this.client = Mailjet.apiConnect(apiKey, secretKey);
      this.isConfigured = true;
      this.logger.log('Mailjet client initialized successfully');
    } else {
      this.logger.warn(
        'Mailjet not configured (MAILJET_API_KEY/MAILJET_SECRET_KEY not provided). Emails will be logged to console.',
      );
    }
  }

  async sendVerificationEmail(to: string, link: string): Promise<void> {
    const subject = 'Verifica tu correo electrónico';
    const html = `<p>Hola,</p>
      <p>Por favor confirma tu correo haciendo clic en el siguiente enlace:</p>
      <p><a href="${link}">Verificar correo</a></p>
      <p>Si no solicitaste esto, ignora este correo.</p>`;

    if (!this.isConfigured) {
      this.logger.log(
        `Simulated send to ${to}: subject=${subject} link=${link}`,
      );
      return;
    }

    try {
      const request = this.client
        .post('send', { version: 'v3.1' })
        .request({
          Messages: [
            {
              From: {
                Email: this.senderEmail,
                Name: 'Athletia',
              },
              To: [
                {
                  Email: to,
                },
              ],
              Subject: subject,
              HTMLPart: html,
            },
          ],
        });

      await request;
      this.logger.log(`Verification email sent to ${to}`);
    } catch (e) {
      this.logger.error('Failed to send verification email', e);
      throw e;
    }
  }

  async sendModeratorRequestEmail(
    adminEmail: string,
    requesterEmail: string,
    requesterId: string,
  ): Promise<void> {
    const subject = 'Nueva solicitud de moderador';
    const html = `<p>Hola Admin,</p>
      <p>El usuario <strong>${requesterEmail}</strong> (ID: ${requesterId}) ha solicitado ser moderador.</p>
      <p>Por favor revisa su perfil y gestiona los permisos en la plataforma.</p>`;

    if (!this.isConfigured) {
      this.logger.log(
        `Simulated moderator request email to ${adminEmail} for user ${requesterEmail}`,
      );
      return;
    }

    try {
      const request = this.client
        .post('send', { version: 'v3.1' })
        .request({
          Messages: [
            {
              From: {
                Email: this.senderEmail,
                Name: 'Athletia Admin',
              },
              To: [
                {
                  Email: adminEmail,
                },
              ],
              Subject: subject,
              HTMLPart: html,
            },
          ],
        });

      await request;
      this.logger.log(`Moderator request email sent to ${adminEmail}`);
    } catch (e) {
      this.logger.error(
        `Failed to send moderator request email to ${adminEmail}`,
        e,
      );
      // Log error but don't throw to avoid failing the user request if email fails
      this.logger.warn('Email notification failed, but user operation continues');
    }
  }
}
