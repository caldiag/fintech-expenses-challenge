import { Module } from '@nestjs/common';
import { CategoryEntity } from './entities/category.entity.ts';

@Module({ providers: [CategoryEntity], exports: [] })
export class CategoryModule {}
