import { MigrationInterface, QueryRunner } from "typeorm";

export class TransactionsAddRoleRelation1794371276595 implements MigrationInterface {
    name = 'TransactionsAddRoleRelation1794371276595'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction_entity" ADD "roleId" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "transaction_entity" ADD CONSTRAINT "FK_6a34f2bf965ac0b3561c4335a05" FOREIGN KEY ("roleId") REFERENCES "role_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction_entity" DROP CONSTRAINT "FK_6a34f2bf965ac0b3561c4335a05"`);
        await queryRunner.query(`ALTER TABLE "transaction_entity" DROP COLUMN "roleId"`);
    }

}
