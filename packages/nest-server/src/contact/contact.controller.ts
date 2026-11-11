import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserContext } from '../auth/guard/context.decorator.ts';
import CreateContactDTO from './dto/create-contact.dto.ts';
import { ContactEntity } from './entities/contact.entity.ts';
import { ContactService } from './contact.service.ts';

@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Get('all')
  async findAll(): Promise<ContactEntity[]> {
    return await this.contactService.findAllContacts();
  }

  @Post('create')
  async create(
    @Body() contact: CreateContactDTO,
    @UserContext() userId: string,
  ): Promise<ContactEntity> {
    return await this.contactService.createContact(contact, userId);
  }
}
