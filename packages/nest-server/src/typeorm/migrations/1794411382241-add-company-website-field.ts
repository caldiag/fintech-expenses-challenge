import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCompanyWebsiteField1794411382241 implements MigrationInterface {
    name = 'AddCompanyWebsiteField1794411382241'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "company_entity" ADD "websiteUrl" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "company_entity" DROP COLUMN "websiteUrl"`);
    }

}
