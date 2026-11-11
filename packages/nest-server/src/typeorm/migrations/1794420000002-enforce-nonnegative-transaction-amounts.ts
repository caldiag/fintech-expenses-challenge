import { MigrationInterface, QueryRunner } from 'typeorm';

export class EnforceNonnegativeTransactionAmounts1794420000002
  implements MigrationInterface
{
  name = 'EnforceNonnegativeTransactionAmounts1794420000002';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE "transaction_entity" DROP CONSTRAINT "CHK_transaction_amount_cents_max"',
    );
    await queryRunner.query(
      'ALTER TABLE "transaction_entity" ADD CONSTRAINT "CHK_transaction_amount_nonnegative" CHECK ("amount" >= 0)',
    );
    await queryRunner.query(
      'ALTER TABLE "transaction_entity" ADD CONSTRAINT "CHK_transaction_amount_cents_range" CHECK ("amountCents" BETWEEN 0 AND 99)',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE "transaction_entity" DROP CONSTRAINT "CHK_transaction_amount_cents_range"',
    );
    await queryRunner.query(
      'ALTER TABLE "transaction_entity" DROP CONSTRAINT "CHK_transaction_amount_nonnegative"',
    );
    await queryRunner.query(
      'ALTER TABLE "transaction_entity" ADD CONSTRAINT "CHK_transaction_amount_cents_max" CHECK ("amountCents" <= 99)',
    );
  }
}
