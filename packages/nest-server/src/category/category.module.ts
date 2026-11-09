import { Module } from '@nestjs/common';
import { CategoryEntity } from './entity/category.entity.js';

@Module({ providers: [], exports: [CategoryEntity] })
export class CategoryModule {}
