import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, FindOptionsWhere, Like, Repository } from 'typeorm';
import CreateContactDTO from './dto/create-contact.dto.ts';
import GetContactsDTO from './dto/get-contacts.dto.ts';
import { ContactEntity } from './entities/contact.entity.ts';

@Injectable()
export class ContactService {
  constructor(
    @InjectRepository(ContactEntity)
    private readonly contactRepository: Repository<ContactEntity>,
  ) {}

  async findAllContacts(
    filters: GetContactsDTO,
    page: number,
  ): Promise<{
    contacts: ContactEntity[];
    total: number;
    totalPages: number;
  }> {
    const where: FindOptionsWhere<ContactEntity> = {
      ...((filters.createdById || filters.createdByRoleId) && {
        createdBy: {
          ...(filters.createdById && { id: filters.createdById }),
          ...(filters.createdByRoleId && {
            role: { id: filters.createdByRoleId },
          }),
        },
      }),
      ...(filters.fromDate &&
        filters.toDate && {
          createdAt: Between(
            new Date(filters.fromDate),
            new Date(filters.toDate),
          ),
        }),
      ...(filters.name && { name: Like(filters.name) }),
      ...(filters.avatarUrl && { avatarUrl: Like(filters.avatarUrl) }),
      ...(filters.email && { email: Like(filters.email) }),
      ...(filters.phone && { phone: Like(filters.phone) }),
      ...(filters.companyId && { companies: { id: filters.companyId } }),
    };
    const [contacts, total] = await this.contactRepository.findAndCount({
      where,
      relations: { companies: true, createdBy: true },
      order: { createdAt: 'DESC', id: 'DESC' },
      take: CONTACT_PAGE_SIZE,
      skip: page * CONTACT_PAGE_SIZE,
    });
    return {
      contacts,
      total,
      totalPages: Math.ceil(total / CONTACT_PAGE_SIZE),
    };
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

  async findContactById(id: string): Promise<ContactEntity | null> {
    return await this.contactRepository.findOne({
      where: { id },
      relations: { companies: true, createdBy: { role: true } },
    });
  }

  async updateContact(
    id: string,
    contact: CreateContactDTO,
  ): Promise<ContactEntity> {
    const { companyIds = [], ...contactData } = contact;
    return await this.contactRepository.save({
      id,
      ...contactData,
      companies: companyIds.map((companyId) => ({ id: companyId })),
    });
  }

  async deleteContact(id: string): Promise<void> {
    await this.contactRepository.softDelete(id);
  }
}

const CONTACT_PAGE_SIZE = 20;
