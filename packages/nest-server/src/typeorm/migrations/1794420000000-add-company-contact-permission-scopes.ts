import { MigrationInterface, QueryRunner } from 'typeorm';

const permissionFields = [
  'companyCreateScope',
  'companyReadScope',
  'companyUpdateScope',
  'companyDeleteScope',
  'contactCreateScope',
  'contactReadScope',
  'contactUpdateScope',
  'contactDeleteScope',
];

export class AddCompanyContactPermissionScopes1794420000000 implements MigrationInterface {
  name = 'AddCompanyContactPermissionScopes1794420000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    for (const field of permissionFields) {
      await queryRunner.query(
        `ALTER TABLE "permission_set_entity" ADD "${field}" "public"."permission_scope" NOT NULL DEFAULT 'OWN'`,
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    for (const field of [...permissionFields].reverse()) {
      await queryRunner.query(
        `ALTER TABLE "permission_set_entity" DROP COLUMN "${field}"`,
      );
    }
  }
}
