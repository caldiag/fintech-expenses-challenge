import { MigrationInterface, QueryRunner } from "typeorm";

export class FixInheritedDates1794265059370 implements MigrationInterface {
    name = 'FixInheritedDates1794265059370'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_entity" ALTER COLUMN "createdAt" SET DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_entity" ALTER COLUMN "createdAt" DROP DEFAULT`);
    }

}
