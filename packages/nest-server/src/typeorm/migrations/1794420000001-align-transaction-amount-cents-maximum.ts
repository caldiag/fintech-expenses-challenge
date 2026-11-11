import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlignTransactionAmountCentsMaximum1794420000001 implements MigrationInterface {
  name = 'AlignTransactionAmountCentsMaximum1794420000001';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'UPDATE "transaction_entity" SET "amount" = "amount" + 1, "amountCents" = 0 WHERE "amountCents" = 100',
    );
    await queryRunner.query(
      'ALTER TABLE "transaction_entity" DROP CONSTRAINT "CHK_transaction_amount_cents_max"',
    );
    await queryRunner.query(
      'ALTER TABLE "transaction_entity" ADD CONSTRAINT "CHK_transaction_amount_cents_max" CHECK ("amountCents" <= 99)',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE "transaction_entity" DROP CONSTRAINT "CHK_transaction_amount_cents_max"',
    );
    await queryRunner.query(
      'ALTER TABLE "transaction_entity" ADD CONSTRAINT "CHK_transaction_amount_cents_max" CHECK ("amountCents" <= 100)',
    );
  }
}
