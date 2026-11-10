import { MigrationInterface, QueryRunner } from "typeorm";

export class RestructureRelationships1794269120643 implements MigrationInterface {
    name = 'RestructureRelationships1794269120643'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction_entity" DROP CONSTRAINT "FK_ed44524e7e60f910e6d5f419eee"`);
        await queryRunner.query(`ALTER TABLE "transaction_entity" RENAME COLUMN "categoryId" TO "transactionCategoryId"`);
        await queryRunner.query(`CREATE TABLE "transaction_category_entity" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" character varying NOT NULL, "icon" character varying NOT NULL, "createdById" uuid, CONSTRAINT "PK_562a7cd0630179d676ec868f3d1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "transaction_category_entity" ADD CONSTRAINT "FK_d08793666f335619c00042cfd83" FOREIGN KEY ("createdById") REFERENCES "user_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "transaction_entity" ADD CONSTRAINT "FK_a9bfdd0fdb41c7fbd630df1b36b" FOREIGN KEY ("transactionCategoryId") REFERENCES "transaction_category_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction_entity" DROP CONSTRAINT "FK_a9bfdd0fdb41c7fbd630df1b36b"`);
        await queryRunner.query(`ALTER TABLE "transaction_category_entity" DROP CONSTRAINT "FK_d08793666f335619c00042cfd83"`);
        await queryRunner.query(`DROP TABLE "transaction_category_entity"`);
        await queryRunner.query(`ALTER TABLE "transaction_entity" RENAME COLUMN "transactionCategoryId" TO "categoryId"`);
        await queryRunner.query(`ALTER TABLE "transaction_entity" ADD CONSTRAINT "FK_ed44524e7e60f910e6d5f419eee" FOREIGN KEY ("categoryId") REFERENCES "category_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
