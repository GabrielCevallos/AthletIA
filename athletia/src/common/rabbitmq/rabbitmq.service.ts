import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import * as amqp from 'amqplib';

@Injectable()
export class RabbitmqService implements OnModuleInit, OnModuleDestroy {
  private connection: amqp.Connection | null = null;
  private channel: amqp.ConfirmChannel | null = null;
  private readonly logger = new Logger(RabbitmqService.name);

  async onModuleInit() {
    await this.connect().catch((e) => {
      this.logger.warn('Could not connect to RabbitMQ on startup: ' + e.message);
    });
  }

  async connect(): Promise<void> {
    if (this.connection && this.channel) return;

    const host = process.env.RABBITMQ_HOST || 'rabbitmq';
    const port = process.env.RABBITMQ_PORT || '5672';
    const user = process.env.RABBITMQ_USER || 'guest';
    const pass = process.env.RABBITMQ_PASSWORD || 'guest';
    const url = `amqp://${user}:${pass}@${host}:${port}`;

    const maxAttempts = parseInt(process.env.RABBITMQ_CONNECT_RETRIES || '10', 10);
    const baseDelayMs = parseInt(process.env.RABBITMQ_CONNECT_DELAY_MS || '500', 10);

    this.logger.log(`Connecting to RabbitMQ ${host}:${port} (will retry up to ${maxAttempts} times)`);

    let attempt = 0;
    let lastErr: any = null;
    while (attempt < maxAttempts) {
      attempt += 1;
      try {
        this.connection = await amqp.connect(url);
        this.channel = await this.connection.createConfirmChannel();
        const exchange = process.env.RABBITMQ_EXCHANGE || 'athletia';
        await this.channel.assertExchange(exchange, 'topic', { durable: true });
        this.logger.log('RabbitMQ connected and exchange asserted: ' + exchange);
        // set up close handling
        this.connection.on('close', (err) => {
          this.logger.warn('RabbitMQ connection closed: ' + String(err));
          this.connection = null;
          this.channel = null;
        });
        return;
      } catch (e) {
        lastErr = e;
        this.logger.warn(`RabbitMQ connect attempt ${attempt} failed: ${e.message || e}.`);
        const delay = baseDelayMs * attempt; // linear backoff
        await new Promise((r) => setTimeout(r, delay));
      }
    }

    // All attempts failed
    throw lastErr || new Error('Failed to connect to RabbitMQ');
  }

  async publish(routingKey: string, message: object): Promise<void> {
    try {
      if (!this.channel) {
        await this.connect();
      }
      const exchange = process.env.RABBITMQ_EXCHANGE || 'athletia';
      const payload = Buffer.from(JSON.stringify(message));
      this.channel!.publish(exchange, routingKey, payload, { persistent: true });
      // use confirm channel to ensure delivery if desired; here we don't wait for callback
      this.logger.debug(`Published RMQ message to ${exchange} ${routingKey}`);
    } catch (e) {
      this.logger.error('Failed to publish RMQ message: ' + e.message);
      // swallow error so business logic is not blocked by MQ issues
    }
  }

  async onModuleDestroy() {
    try {
      await this.channel?.close();
      await this.connection?.close();
      this.logger.log('RabbitMQ connection closed');
    } catch (e) {
      this.logger.warn('Error closing RabbitMQ connection: ' + e.message);
    }
  }
}
