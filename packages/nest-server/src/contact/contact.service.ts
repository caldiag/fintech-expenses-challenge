import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import CreateContactDTO from './dto/create-contact.dto.ts';
import { ContactEntity } from './entities/contact.entity.ts';

@Injectable()
export class ContactService {
  constructor(
    @InjectRepository(ContactEntity)
    private readonly contactRepository: Repository<ContactEntity>,
  ) {}

  async findAllContacts(): Promise<ContactEntity[]> {
    return await this.contactRepository.find({
      relations: { companies: true },
    });
  }

  async createContact(
    contact: CreateContactDTO,
    createdByUserId: string,
  ): Promise<ContactEntity> {
    const { companyIds = [], ...contactData } = contact;
    return await this.contactRepository.save({
      ...contactData,
      companies: companyIds.map((id) => ({ id })),
      createdBy: { id: createdByUserId },
    });
  }
}
