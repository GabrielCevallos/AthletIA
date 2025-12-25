import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: nodemailer.Transporter | null = null;

  constructor() {
    // Lazy init transporter using env variables. If not provided, will use console logging only.
    const host = process.env.SMTP_HOST;
    const port = process.env.SMTP_PORT
      ? Number(process.env.SMTP_PORT)
      : undefined;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    if (host && port && user && pass) {
      this.transporter = nodemailer.createTransport({
        host,
        port,
        secure: port === 465, // true for 465, false for other ports
        auth: { user, pass },
      });
    } else {
      this.logger.warn(
        'SMTP not configured (SMPT_HOST/PORT/USER/PASS). Emails will be logged to console.',
      );
    }
  }

  async sendVerificationEmail(to: string, link: string): Promise<void> {
    const subject = 'Verifica tu correo electrónico';
    const html = `<p>Hola,</p>
      <p>Por favor confirma tu correo haciendo clic en el siguiente enlace:</p>
      <p><a href="${link}">Verificar correo</a></p>
      <p>Si no solicitaste esto, ignora este correo.</p>`;

    if (!this.transporter) {
      this.logger.log(
        `Simulated send to ${to}: subject=${subject} link=${link}`,
      );
      return;
    }

    try {
      await this.transporter.sendMail({
        from: process.env.SMTP_FROM || 'no-reply@example.com',
        to,
        subject,
        html,
      });
      this.logger.log(`Verification email sent to ${to}`);
    } catch (e) {
      this.logger.error('Failed to send verification email', e);
      throw e;
    }
  }
}
