import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

// Use container-friendly defaults. In Docker Compose the DB host is typically the
// service name ("db"). Also allow DB_USERNAME or DB_USER to be provided.
const DB_HOST = process.env.DB_HOST || 'db';
const DB_PORT = parseInt(process.env.DB_PORT || '5432', 10);
const DB_USERNAME = process.env.DB_USERNAME || process.env.DB_USER || 'postgres';
const DB_PASSWORD = process.env.DB_PASSWORD || process.env.DB_PASS || 'postgres';
const DB_NAME = process.env.DB_NAME || 'athletia';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: DB_HOST,
  port: DB_PORT,
  username: DB_USERNAME,
  password: DB_PASSWORD,
  database: DB_NAME,
  entities: [__dirname + '../../../**/*.entity{.ts,.js}'],
  synchronize: true,
  dropSchema: true,
};
