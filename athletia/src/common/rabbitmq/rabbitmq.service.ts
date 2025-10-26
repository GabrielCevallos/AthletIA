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
    this.logger.log(`Connecting to RabbitMQ ${host}:${port}`);
    this.connection = await amqp.connect(url);
    this.channel = await this.connection.createConfirmChannel();
    const exchange = process.env.RABBITMQ_EXCHANGE || 'athletia';
    await this.channel.assertExchange(exchange, 'topic', { durable: true });
    this.logger.log('RabbitMQ connected and exchange asserted: ' + exchange);
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
