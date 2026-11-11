import { PermissionKey, PermissionScope } from '@app/types';
import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  InternalServerErrorException,
  Post,
} from '@nestjs/common';
import { UserContext } from '../auth/guard/context.decorator.ts';
import { UserService } from '../user/user.service.ts';
import { DEFAULT_ROLE_PERMISSION_SET } from './constants/default-permission-set.ts';
import CreateRoleDTO from './dto/create-role.dto.ts';
import { RoleEntity } from './entities/role.entity.ts';
import { PermissionsService } from './permissions.service.ts';

@Controller('role')
export class RoleController {
  constructor(
    private readonly permissionsService: PermissionsService,
    private readonly userService: UserService,
  ) {}

  @Get('all')
  async findAll(@UserContext() userId: string): Promise<RoleEntity[]> {
    const readScope = await this.permissionsService.validateUserPermissionScope(
      userId,
      PermissionKey.RoleReadScope,
    );

    if (readScope === PermissionScope.ALL) {
      return await this.permissionsService.findAllRoles();
    }

    const user = await this.userService.getUserById(userId);
    if (!user) return [];
    return user.role ? [user.role] : [];
  }

  @Post('create')
  async create(
    @Body() role: CreateRoleDTO,
    @UserContext() userId: string,
  ): Promise<RoleEntity> {
    const createScope =
      await this.permissionsService.validateUserPermissionScope(
        userId,
        PermissionKey.RoleCreateScope,
      );

    if (createScope !== PermissionScope.ALL) {
      throw new ForbiddenException('Insufficient permission to create roles');
    }

    const createdRole = await this.permissionsService.createRole(
      role,
      DEFAULT_ROLE_PERMISSION_SET,
    );
    if (!createdRole) {
      throw new InternalServerErrorException('Failed to create role');
    }

    return createdRole;
  }
}
