import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Query,
} from '@nestjs/common';
import { UserContext } from '../auth/guard/context.decorator.ts';
import { ContactService } from './contact.service.ts';
import CreateContactDTO from './dto/create-contact.dto.ts';
import GetContactsDTO from './dto/get-contacts.dto.ts';
import { ContactEntity } from './entities/contact.entity.ts';

@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Get('all')
  async findAll(
    @Query() filters: GetContactsDTO,
    @Query('page') pageParam?: string,
  ) {
    const page = Number(pageParam ?? 0);
    if (!Number.isInteger(page) || page < 0) {
      throw new BadRequestException('Page must be a non-negative integer');
    }

    return await this.contactService.findAllContacts(filters, page);
  }

  @Post('create')
  async create(
    @Body() contact: CreateContactDTO,
    @UserContext() userId: string,
  ): Promise<ContactEntity> {
    return await this.contactService.createContact(contact, userId);
  }
}
