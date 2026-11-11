import { MigrationInterface, QueryRunner } from "typeorm";

export class MakeTransactionCategoryNotNullable1794371028388 implements MigrationInterface {
    name = 'MakeTransactionCategoryNotNullable1794371028388'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction_entity" DROP CONSTRAINT "FK_a9bfdd0fdb41c7fbd630df1b36b"`);
        await queryRunner.query(`ALTER TABLE "transaction_entity" ALTER COLUMN "transactionCategoryId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "permission_set_entity" ALTER COLUMN "transactionCreateScope" SET DEFAULT 'OWN'`);
        await queryRunner.query(`ALTER TABLE "permission_set_entity" ALTER COLUMN "transactionReadScope" SET DEFAULT 'OWN'`);
        await queryRunner.query(`ALTER TABLE "permission_set_entity" ALTER COLUMN "transactionUpdateScope" SET DEFAULT 'OWN'`);
        await queryRunner.query(`ALTER TABLE "permission_set_entity" ALTER COLUMN "transactionDeleteScope" SET DEFAULT 'OWN'`);
        await queryRunner.query(`ALTER TABLE "permission_set_entity" ALTER COLUMN "categoryCreateScope" SET DEFAULT 'OWN'`);
        await queryRunner.query(`ALTER TABLE "permission_set_entity" ALTER COLUMN "categoryReadScope" SET DEFAULT 'OWN'`);
        await queryRunner.query(`ALTER TABLE "permission_set_entity" ALTER COLUMN "categoryUpdateScope" SET DEFAULT 'OWN'`);
        await queryRunner.query(`ALTER TABLE "permission_set_entity" ALTER COLUMN "categoryDeleteScope" SET DEFAULT 'OWN'`);
        await queryRunner.query(`ALTER TABLE "permission_set_entity" ALTER COLUMN "userCreateScope" SET DEFAULT 'OWN'`);
        await queryRunner.query(`ALTER TABLE "permission_set_entity" ALTER COLUMN "userReadScope" SET DEFAULT 'OWN'`);
        await queryRunner.query(`ALTER TABLE "permission_set_entity" ALTER COLUMN "userUpdateScope" SET DEFAULT 'OWN'`);
        await queryRunner.query(`ALTER TABLE "permission_set_entity" ALTER COLUMN "userDeleteScope" SET DEFAULT 'OWN'`);
        await queryRunner.query(`ALTER TABLE "permission_set_entity" ALTER COLUMN "roleCreateScope" SET DEFAULT 'OWN'`);
        await queryRunner.query(`ALTER TABLE "permission_set_entity" ALTER COLUMN "roleReadScope" SET DEFAULT 'OWN'`);
        await queryRunner.query(`ALTER TABLE "permission_set_entity" ALTER COLUMN "roleUpdateScope" SET DEFAULT 'OWN'`);
        await queryRunner.query(`ALTER TABLE "permission_set_entity" ALTER COLUMN "roleDeleteScope" SET DEFAULT 'OWN'`);
        await queryRunner.query(`ALTER TABLE "transaction_entity" ADD CONSTRAINT "FK_a9bfdd0fdb41c7fbd630df1b36b" FOREIGN KEY ("transactionCategoryId") REFERENCES "transaction_category_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction_entity" DROP CONSTRAINT "FK_a9bfdd0fdb41c7fbd630df1b36b"`);
        await queryRunner.query(`ALTER TABLE "permission_set_entity" ALTER COLUMN "roleDeleteScope" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "permission_set_entity" ALTER COLUMN "roleUpdateScope" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "permission_set_entity" ALTER COLUMN "roleReadScope" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "permission_set_entity" ALTER COLUMN "roleCreateScope" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "permission_set_entity" ALTER COLUMN "userDeleteScope" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "permission_set_entity" ALTER COLUMN "userUpdateScope" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "permission_set_entity" ALTER COLUMN "userReadScope" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "permission_set_entity" ALTER COLUMN "userCreateScope" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "permission_set_entity" ALTER COLUMN "categoryDeleteScope" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "permission_set_entity" ALTER COLUMN "categoryUpdateScope" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "permission_set_entity" ALTER COLUMN "categoryReadScope" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "permission_set_entity" ALTER COLUMN "categoryCreateScope" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "permission_set_entity" ALTER COLUMN "transactionDeleteScope" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "permission_set_entity" ALTER COLUMN "transactionUpdateScope" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "permission_set_entity" ALTER COLUMN "transactionReadScope" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "permission_set_entity" ALTER COLUMN "transactionCreateScope" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "transaction_entity" ALTER COLUMN "transactionCategoryId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "transaction_entity" ADD CONSTRAINT "FK_a9bfdd0fdb41c7fbd630df1b36b" FOREIGN KEY ("transactionCategoryId") REFERENCES "transaction_category_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
