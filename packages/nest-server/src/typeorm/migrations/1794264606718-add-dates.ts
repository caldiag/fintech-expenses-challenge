import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddDates1794264606718 implements MigrationInterface {
  name = 'AddDates1794264606718';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "transaction_entity" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction_entity" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction_entity" ADD "deletedAt" TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "permission_set_entity" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "permission_set_entity" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "permission_set_entity" ADD "deletedAt" TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "role_entity" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "role_entity" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "role_entity" ADD "deletedAt" TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_entity" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_entity" ADD "deletedAt" TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "category_entity" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "category_entity" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "category_entity" ADD "deletedAt" TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "contact_entity" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "contact_entity" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "contact_entity" ADD "deletedAt" TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "company_entity" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "company_entity" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "company_entity" ADD "deletedAt" TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_entity" ADD CONSTRAINT "UQ_415c35b9b3b6fe45a3b065030f5" UNIQUE ("email")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_entity" DROP CONSTRAINT "UQ_415c35b9b3b6fe45a3b065030f5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "company_entity" DROP COLUMN "deletedAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "company_entity" DROP COLUMN "updatedAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "company_entity" DROP COLUMN "createdAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "contact_entity" DROP COLUMN "deletedAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "contact_entity" DROP COLUMN "updatedAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "contact_entity" DROP COLUMN "createdAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "category_entity" DROP COLUMN "deletedAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "category_entity" DROP COLUMN "updatedAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "category_entity" DROP COLUMN "createdAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_entity" DROP COLUMN "deletedAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_entity" DROP COLUMN "updatedAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "role_entity" DROP COLUMN "deletedAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "role_entity" DROP COLUMN "updatedAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "role_entity" DROP COLUMN "createdAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "permission_set_entity" DROP COLUMN "deletedAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "permission_set_entity" DROP COLUMN "updatedAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "permission_set_entity" DROP COLUMN "createdAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction_entity" DROP COLUMN "deletedAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction_entity" DROP COLUMN "updatedAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction_entity" DROP COLUMN "createdAt"`,
    );
  }
}
