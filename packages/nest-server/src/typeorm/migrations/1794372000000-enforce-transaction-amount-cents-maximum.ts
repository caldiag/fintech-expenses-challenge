import { MigrationInterface, QueryRunner } from 'typeorm';

export class EnforceTransactionAmountCentsMaximum1794372000000 implements MigrationInterface {
  name = 'EnforceTransactionAmountCentsMaximum1794372000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE "transaction_entity" ADD CONSTRAINT "CHK_transaction_amount_cents_max" CHECK ("amountCents" <= 100)',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE "transaction_entity" DROP CONSTRAINT "CHK_transaction_amount_cents_max"',
    );
  }
}
