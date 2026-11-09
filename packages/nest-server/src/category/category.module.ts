import { Module } from '@nestjs/common';
import { CategoryEntity } from './entities/category.entity.js';

@Module({ providers: [], exports: [CategoryEntity] })
export class CategoryModule {}
