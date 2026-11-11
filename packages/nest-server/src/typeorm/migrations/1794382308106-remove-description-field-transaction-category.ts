import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveDescriptionFieldTransactionCategory1794382308106 implements MigrationInterface {
    name = 'RemoveDescriptionFieldTransactionCategory1794382308106'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction_category_entity" DROP COLUMN "description"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction_category_entity" ADD "description" character varying NOT NULL`);
    }

}
