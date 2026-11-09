import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCompanyAndContacts1794255754868 implements MigrationInterface {
    name = 'AddCompanyAndContacts1794255754868'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "contact_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "avatarUrl" character varying, "email" character varying NOT NULL, "phone" character varying, "createdById" uuid, CONSTRAINT "PK_586d1ef7e202a40435ea451b3fe" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "company_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "areaCode" character varying, "email" character varying, "phone" character varying, "createdById" uuid, CONSTRAINT "PK_ad727d0b2b2f9bc3f78fff1b19a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "company_entity_contacts_contact_entity" ("companyEntityId" uuid NOT NULL, "contactEntityId" uuid NOT NULL, CONSTRAINT "PK_ffe0f62c8e55aa6ce2356387182" PRIMARY KEY ("companyEntityId", "contactEntityId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_bf332a27384e1f8a7171bb714c" ON "company_entity_contacts_contact_entity"  ("companyEntityId") `);
        await queryRunner.query(`CREATE INDEX "IDX_4d553203404ce688fcfb38ae61" ON "company_entity_contacts_contact_entity"  ("contactEntityId") `);
        await queryRunner.query(`ALTER TABLE "contact_entity" ADD CONSTRAINT "FK_47dc62b621bf31329b0603debac" FOREIGN KEY ("createdById") REFERENCES "user_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "company_entity" ADD CONSTRAINT "FK_60bd315079d832a51ce552f349e" FOREIGN KEY ("createdById") REFERENCES "user_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "company_entity_contacts_contact_entity" ADD CONSTRAINT "FK_bf332a27384e1f8a7171bb714cf" FOREIGN KEY ("companyEntityId") REFERENCES "company_entity"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "company_entity_contacts_contact_entity" ADD CONSTRAINT "FK_4d553203404ce688fcfb38ae612" FOREIGN KEY ("contactEntityId") REFERENCES "contact_entity"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "company_entity_contacts_contact_entity" DROP CONSTRAINT "FK_4d553203404ce688fcfb38ae612"`);
        await queryRunner.query(`ALTER TABLE "company_entity_contacts_contact_entity" DROP CONSTRAINT "FK_bf332a27384e1f8a7171bb714cf"`);
        await queryRunner.query(`ALTER TABLE "company_entity" DROP CONSTRAINT "FK_60bd315079d832a51ce552f349e"`);
        await queryRunner.query(`ALTER TABLE "contact_entity" DROP CONSTRAINT "FK_47dc62b621bf31329b0603debac"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_4d553203404ce688fcfb38ae61"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_bf332a27384e1f8a7171bb714c"`);
        await queryRunner.query(`DROP TABLE "company_entity_contacts_contact_entity"`);
        await queryRunner.query(`DROP TABLE "company_entity"`);
        await queryRunner.query(`DROP TABLE "contact_entity"`);
    }

}
