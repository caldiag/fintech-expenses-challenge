import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionsModule } from '../permissions/permissions.module.ts';
import { UserModule } from '../user/user.module.ts';
import { ContactController } from './contact.controller.ts';
import { ContactService } from './contact.service.ts';
import { ContactEntity } from './entities/contact.entity.ts';

@Module({
  imports: [
    TypeOrmModule.forFeature([ContactEntity]),
    UserModule,
    PermissionsModule,
  ],
  providers: [ContactService],
  controllers: [ContactController],
})
export class ContactModule {}
