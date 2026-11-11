import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTransactionDirection1794419640666 implements MigrationInterface {
    name = 'AddTransactionDirection1794419640666'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."transactionDirection" AS ENUM('outbound', 'inbound')`);
        await queryRunner.query(`ALTER TABLE "transaction_entity" ADD "transactionDirection" "public"."transactionDirection" NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction_entity" DROP COLUMN "transactionDirection"`);
        await queryRunner.query(`DROP TYPE "public"."transactionDirection"`);
    }

}
