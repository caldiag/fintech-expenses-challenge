import { Command, CommandRunner } from 'nest-commander';
import { UserService } from '../../user/user.service.ts';
import { DEFAULT_ADMIN_ROLE_ID } from '../../permissions/constants/default-admin-role-id.ts';
import { DEFAULT_ADMIN_PERMISSION_SET } from '../../permissions/constants/default-permission-set.ts';
import { PermissionSet } from '@app/types';
import { PermissionsService } from '../../permissions/permissions.service.ts';

//ideally this all should happen inside transactions
@Command({
  name: 'seed-admin',
  description: 'Create admin user',
})
export class SeedAdmin extends CommandRunner {
  constructor(
    private readonly userService: UserService,
    private readonly permissionsService: PermissionsService,
  ) {
    super();
  }

  async run(): Promise<void> {
    const { ADMIN_SEED_EMAIL, ADMIN_SEED_PASSWORD } = process.env;
    if (!ADMIN_SEED_EMAIL || !ADMIN_SEED_PASSWORD) {
      throw new Error('No admin credentials found in environment variables');
    }
    if (ADMIN_SEED_EMAIL.length < 10 || ADMIN_SEED_PASSWORD.length < 10) {
      throw new Error('Invalid credentials for environment variables');
    }
    const user = await this.userService.createUser({
      firstName: 'Admin',
      lastName: 'Account',
      email: ADMIN_SEED_EMAIL,
      password: ADMIN_SEED_PASSWORD,
    });
    const existingRole = await this.permissionsService.findRoleById(
      DEFAULT_ADMIN_ROLE_ID,
    );
    if (existingRole) {
      //if for some reason the role exists but its permission set doesn't, we create it
      if (!existingRole.permissionSet) {
        await this.permissionsService.updateOrCreateRolePermissionSet(
          existingRole.id,
          DEFAULT_ADMIN_PERMISSION_SET,
        );
      }
      //assign user to that existing admin role and exit
      //this function should delete leftover permission sets if they were exclusive to that user
      await this.permissionsService.assignUserToRole(existingRole.id, user.id);
      return;
    }
    const permissionSet: PermissionSet = DEFAULT_ADMIN_PERMISSION_SET;
    //create new admin role
    const createdRole = await this.permissionsService.createRole(
      {
        name: 'Admin',
        icon: 'IconShield',
      },
      permissionSet,
    );
    if (!createdRole) {
      throw new Error('Failed to create role');
    }
    //assign user to that existing admin role and exit
    await this.permissionsService.assignUserToRole(createdRole.id, user.id);
    return;
  }
}
