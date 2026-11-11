import { PermissionKey, PermissionScope, PermissionSet } from '@app/types';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import type { TransactionEntity } from '../transaction/entities/transaction.entity.ts';
import { UserService } from '../user/user.service.ts';
import { PermissionSetEntity } from './entities/permission-set.entity.ts';
import { RoleEntity } from './entities/role.entity.ts';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(RoleEntity)
    private readonly roleRepository: Repository<RoleEntity>,
    @InjectRepository(PermissionSetEntity)
    private readonly permissionSetRepository: Repository<PermissionSetEntity>,
    private readonly userService: UserService,
    private readonly dataSource: DataSource,
  ) {}

  async findRoleById(id: string): Promise<RoleEntity | null> {
    return await this.roleRepository.findOne({ where: { id } });
  }

  async findAllRoles(): Promise<RoleEntity[]> {
    return await this.roleRepository.find({ order: { name: 'ASC' } });
  }

  async updateOrCreateRolePermissionSet(
    roleId: string,
    permissionSet: PermissionSet,
  ): Promise<void> {
    await this.permissionSetRepository.save({
      role: { id: roleId },
      ...permissionSet,
    });
  }

  async assignUserToRole(roleId: string, userId: string): Promise<void> {
    const role = await this.findRoleById(roleId);
    if (!role) {
      throw new Error('User not found');
    }
    await this.userService.updateUser(userId, { role });
  }

  async createRole(
    role: Pick<RoleEntity, 'name' | 'icon'>,
    permissionSet: PermissionSet,
  ): Promise<RoleEntity | null> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    let createdRole: RoleEntity | null = null;
    try {
      createdRole = await queryRunner.manager.save(RoleEntity, role);
      await queryRunner.manager.save(PermissionSetEntity, {
        ...permissionSet,
        role: { id: createdRole.id },
      });

      await queryRunner.commitTransaction();
      return await this.roleRepository.findOne({
        where: { id: createdRole.id },
      });
    } catch {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
    return null;
  }

  async validateUserPermissionScope(
    userId: string,
    permission: PermissionKey,
  ): Promise<PermissionScope> {
    const user = await this.userService.getUserById(userId);
    if (!user) throw new NotFoundException('User not found');
    return this.getUserPermissionScope(user, permission);
  }

  canAccessTransaction(
    user: Awaited<ReturnType<UserService['getUserById']>>,
    transaction: TransactionEntity,
    permission: PermissionKey,
  ): boolean {
    if (!user) return false;
    const scope = this.getUserPermissionScope(user, permission);
    if (scope === PermissionScope.ALL) return true;
    if (scope === PermissionScope.ROLE) {
      return Boolean(user.role && transaction.role.id === user.role.id);
    }
    return transaction.createdBy?.id === user.id;
  }

  private getUserPermissionScope(
    user: NonNullable<Awaited<ReturnType<UserService['getUserById']>>>,
    permission: PermissionKey,
  ): PermissionScope {
    const userPermission = user.permissionSet ?? user.role?.permissionSet;
    return userPermission?.[permission] ?? PermissionScope.OWN;
  }
}
