import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSeed1794256391500 implements MigrationInterface {
    name = 'InitialSeed1794256391500'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."currency" AS ENUM('AED', 'AFN', 'ALL', 'AMD', 'AOA', 'ARS', 'AUD', 'AWG', 'AZN', 'BAM', 'BBD', 'BDT', 'BHD', 'BIF', 'BMD', 'BND', 'BOB', 'BOV', 'BRL', 'BSD', 'BTN', 'BWP', 'BYN', 'BZD', 'CAD', 'CDF', 'CHE', 'CHF', 'CHW', 'CLF', 'CLP', 'CNY', 'COP', 'COU', 'CRC', 'CUP', 'CVE', 'CZK', 'DJF', 'DKK', 'DOP', 'DZD', 'EGP', 'ERN', 'ETB', 'EUR', 'FJD', 'FKP', 'GBP', 'GEL', 'GHS', 'GIP', 'GMD', 'GNF', 'GTQ', 'GYD', 'HKD', 'HNL', 'HTG', 'HUF', 'IDR', 'ILS', 'INR', 'IQD', 'IRR', 'ISK', 'JMD', 'JOD', 'JPY', 'KES', 'KGS', 'KHR', 'KMF', 'KPW', 'KRW', 'KWD', 'KYD', 'KZT', 'LAK', 'LBP', 'LKR', 'LRD', 'LSL', 'LYD', 'MAD', 'MDL', 'MGA', 'MKD', 'MMK', 'MNT', 'MOP', 'MRU', 'MUR', 'MVR', 'MWK', 'MXN', 'MXV', 'MYR', 'MZN', 'NAD', 'NGN', 'NIO', 'NOK', 'NPR', 'NZD', 'OMR', 'PAB', 'PEN', 'PGK', 'PHP', 'PKR', 'PLN', 'PYG', 'QAR', 'RON', 'RSD', 'RUB', 'RWF', 'SAR', 'SBD', 'SCR', 'SDG', 'SEK', 'SGD', 'SHP', 'SLE', 'SOS', 'SRD', 'SSP', 'STN', 'SVC', 'SYP', 'SZL', 'THB', 'TJS', 'TMT', 'TND', 'TOP', 'TRY', 'TTD', 'TWD', 'TZS', 'UAH', 'UGX', 'USD', 'USN', 'UYI', 'UYU', 'UYW', 'UZS', 'VED', 'VES', 'VND', 'VUV', 'WST', 'XAD', 'XAF', 'XAG', 'XAU', 'XBA', 'XBB', 'XBC', 'XBD', 'XCD', 'XCG', 'XDR', 'XOF', 'XPD', 'XPF', 'XPT', 'XSU', 'XTS', 'XUA', 'XXX', 'YER', 'ZAR', 'ZMW', 'ZWG')`);
        await queryRunner.query(`CREATE TABLE "transaction_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "amount" integer NOT NULL, "amountCents" integer NOT NULL, "currency" "public"."currency" NOT NULL, "description" character varying NOT NULL, "categoryId" uuid, "createdById" uuid, CONSTRAINT "PK_6f9d7f02d8835ac9ef1f685a2e8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."permission_scope" AS ENUM('ALL', 'ROLE', 'OWN')`);
        await queryRunner.query(`CREATE TABLE "permission_set_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "transactionCreateScope" "public"."permission_scope" NOT NULL, "transactionReadScope" "public"."permission_scope" NOT NULL, "transactionUpdateScope" "public"."permission_scope" NOT NULL, "transactionDeleteScope" "public"."permission_scope" NOT NULL, "categoryCreateScope" "public"."permission_scope" NOT NULL, "categoryReadScope" "public"."permission_scope" NOT NULL, "categoryUpdateScope" "public"."permission_scope" NOT NULL, "categoryDeleteScope" "public"."permission_scope" NOT NULL, "userCreateScope" "public"."permission_scope" NOT NULL, "userReadScope" "public"."permission_scope" NOT NULL, "userUpdateScope" "public"."permission_scope" NOT NULL, "userDeleteScope" "public"."permission_scope" NOT NULL, "roleCreateScope" "public"."permission_scope" NOT NULL, "roleReadScope" "public"."permission_scope" NOT NULL, "roleUpdateScope" "public"."permission_scope" NOT NULL, "roleDeleteScope" "public"."permission_scope" NOT NULL, "roleId" uuid, "userId" uuid, CONSTRAINT "REL_f94cfa66fcaa598f2799eeedcf" UNIQUE ("roleId"), CONSTRAINT "REL_f15b3703db19dfb5bf5f2f2c63" UNIQUE ("userId"), CONSTRAINT "CHK_permission_set_exactly_one_owner" CHECK (("roleId" IS NOT NULL) <> ("userId" IS NOT NULL)), CONSTRAINT "PK_fcb7a4a94389ca6d31644b931d9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "role_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "icon" character varying NOT NULL, CONSTRAINT "PK_7bc1bd2364b6e9bf7c84b1e52e2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL, "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "email" character varying NOT NULL, "passwordHash" character varying NOT NULL, "roleId" uuid NOT NULL, CONSTRAINT "PK_b54f8ea623b17094db7667d8206" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "category_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" character varying NOT NULL, "icon" character varying NOT NULL, "createdById" uuid, CONSTRAINT "PK_1a38b9007ed8afab85026703a53" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "contact_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "avatarUrl" character varying, "email" character varying NOT NULL, "phone" character varying, "createdById" uuid, CONSTRAINT "PK_586d1ef7e202a40435ea451b3fe" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "company_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "areaCode" character varying, "email" character varying, "phone" character varying, "createdById" uuid, CONSTRAINT "PK_ad727d0b2b2f9bc3f78fff1b19a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "company_entity_contacts_contact_entity" ("companyEntityId" uuid NOT NULL, "contactEntityId" uuid NOT NULL, CONSTRAINT "PK_ffe0f62c8e55aa6ce2356387182" PRIMARY KEY ("companyEntityId", "contactEntityId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_bf332a27384e1f8a7171bb714c" ON "company_entity_contacts_contact_entity"  ("companyEntityId") `);
        await queryRunner.query(`CREATE INDEX "IDX_4d553203404ce688fcfb38ae61" ON "company_entity_contacts_contact_entity"  ("contactEntityId") `);
        await queryRunner.query(`ALTER TABLE "transaction_entity" ADD CONSTRAINT "FK_ed44524e7e60f910e6d5f419eee" FOREIGN KEY ("categoryId") REFERENCES "category_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "transaction_entity" ADD CONSTRAINT "FK_a98b391824b9b7327352be0a353" FOREIGN KEY ("createdById") REFERENCES "user_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "permission_set_entity" ADD CONSTRAINT "FK_f94cfa66fcaa598f2799eeedcf5" FOREIGN KEY ("roleId") REFERENCES "role_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "permission_set_entity" ADD CONSTRAINT "FK_f15b3703db19dfb5bf5f2f2c637" FOREIGN KEY ("userId") REFERENCES "user_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_entity" ADD CONSTRAINT "FK_95ab8e7157a5bb4bc0e51aefdd2" FOREIGN KEY ("roleId") REFERENCES "role_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "category_entity" ADD CONSTRAINT "FK_00252a51df78a7475f0b5675bfa" FOREIGN KEY ("createdById") REFERENCES "user_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
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
        await queryRunner.query(`ALTER TABLE "category_entity" DROP CONSTRAINT "FK_00252a51df78a7475f0b5675bfa"`);
        await queryRunner.query(`ALTER TABLE "user_entity" DROP CONSTRAINT "FK_95ab8e7157a5bb4bc0e51aefdd2"`);
        await queryRunner.query(`ALTER TABLE "permission_set_entity" DROP CONSTRAINT "FK_f15b3703db19dfb5bf5f2f2c637"`);
        await queryRunner.query(`ALTER TABLE "permission_set_entity" DROP CONSTRAINT "FK_f94cfa66fcaa598f2799eeedcf5"`);
        await queryRunner.query(`ALTER TABLE "transaction_entity" DROP CONSTRAINT "FK_a98b391824b9b7327352be0a353"`);
        await queryRunner.query(`ALTER TABLE "transaction_entity" DROP CONSTRAINT "FK_ed44524e7e60f910e6d5f419eee"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_4d553203404ce688fcfb38ae61"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_bf332a27384e1f8a7171bb714c"`);
        await queryRunner.query(`DROP TABLE "company_entity_contacts_contact_entity"`);
        await queryRunner.query(`DROP TABLE "company_entity"`);
        await queryRunner.query(`DROP TABLE "contact_entity"`);
        await queryRunner.query(`DROP TABLE "category_entity"`);
        await queryRunner.query(`DROP TABLE "user_entity"`);
        await queryRunner.query(`DROP TABLE "role_entity"`);
        await queryRunner.query(`DROP TABLE "permission_set_entity"`);
        await queryRunner.query(`DROP TYPE "public"."permission_scope"`);
        await queryRunner.query(`DROP TABLE "transaction_entity"`);
        await queryRunner.query(`DROP TYPE "public"."currency"`);
    }

}
