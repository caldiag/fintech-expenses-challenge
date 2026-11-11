import { MigrationInterface, QueryRunner } from "typeorm";

export class UniqueCategoryName1794375690650 implements MigrationInterface {
    name = 'UniqueCategoryName1794375690650'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction_category_entity" ADD CONSTRAINT "UQ_763a89d3fde248dfb4d5c440ebe" UNIQUE ("name")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction_category_entity" DROP CONSTRAINT "UQ_763a89d3fde248dfb4d5c440ebe"`);
    }

}
