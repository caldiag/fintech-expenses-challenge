import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { loadEnvFile } from 'node:process';
import { DataSource } from 'typeorm';

const envPath = resolve(import.meta.dirname, '../../.env');
if (existsSync(envPath)) {
  loadEnvFile(envPath);
}

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT || '5432', 10),
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: [import.meta.dirname + '/../**/entities/*.entity{.ts,.js}'],
  migrations: [import.meta.dirname + '/migrations/*{.ts,.js}'],
  migrationsRun: true,
  synchronize: false,
});
