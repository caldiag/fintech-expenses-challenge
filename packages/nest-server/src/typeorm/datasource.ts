import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT || '5432', 10),
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: [import.meta.dirname + '/../**/entities/*.entity{.ts,.js}'],
  migrations: [import.meta.dirname + '/../migrations/*{.ts,.js}'],
  migrationsRun: true,
  synchronize: false,
});
