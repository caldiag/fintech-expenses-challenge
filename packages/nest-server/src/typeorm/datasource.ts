import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { loadEnvFile } from 'node:process';
import { DataSource } from 'typeorm';
import { CompanyEntity } from '../company/entities/company.entity.ts';
import { ContactEntity } from '../contact/entities/contact.entity.ts';
import { PermissionSetEntity } from '../permissions/entities/permission-set.entity.ts';
import { RoleEntity } from '../permissions/entities/role.entity.ts';
import { TransactionCategoryEntity } from '../transaction/entities/transaction-category.entity.ts';
import { TransactionEntity } from '../transaction/entities/transaction.entity.ts';
import { UserEntity } from '../user/entities/user.entity.ts';

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
  ssl: process.env.DATABASE_SSL === 'true' ? true : undefined,
  entities: [
    CompanyEntity,
    ContactEntity,
    PermissionSetEntity,
    RoleEntity,
    TransactionCategoryEntity,
    TransactionEntity,
    UserEntity,
  ],
  migrations: [import.meta.dirname + '/migrations/*{.ts,.js}'],
  migrationsRun: false,
  synchronize: false,
});
