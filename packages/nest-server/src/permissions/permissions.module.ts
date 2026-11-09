import { Module } from '@nestjs/common';
import { PermissionsEntity } from './entities/permissions.entity.js';

@Module({ exports: [PermissionsEntity] })
export class PermissionsModule {}
