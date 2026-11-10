import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleEntity } from './entities/role.entity.ts';
import { Repository } from 'typeorm';
import { PermissionSetEntity } from './entities/permission-set.entity.ts';
import { PermissionSet } from '@app/types';
import { UserService } from '../user/user.service.ts';
import { DataSource } from 'typeorm';

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
}
