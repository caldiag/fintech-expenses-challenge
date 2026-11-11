import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCompanyToTransaction1794384923841 implements MigrationInterface {
    name = 'AddCompanyToTransaction1794384923841'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction_entity" ADD "companyId" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "transaction_entity" ADD CONSTRAINT "FK_5384550055498a06caa6b07b47a" FOREIGN KEY ("companyId") REFERENCES "company_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction_entity" DROP CONSTRAINT "FK_5384550055498a06caa6b07b47a"`);
        await queryRunner.query(`ALTER TABLE "transaction_entity" DROP COLUMN "companyId"`);
    }

}
