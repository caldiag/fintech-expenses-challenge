import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContactController } from './contact.controller.ts';
import { ContactService } from './contact.service.ts';
import { ContactEntity } from './entities/contact.entity.ts';

@Module({
  imports: [TypeOrmModule.forFeature([ContactEntity])],
  providers: [ContactService],
  controllers: [ContactController],
})
export class ContactModule {}
