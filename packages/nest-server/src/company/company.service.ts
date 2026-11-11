import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, FindOptionsWhere, Like, Repository } from 'typeorm';
import CreateCompanyDTO from './dto/create-company.dto.ts';
import GetCompaniesDTO from './dto/get-companies.dto.ts';
import { CompanyEntity } from './entities/company.entity.ts';

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(CompanyEntity)
    private readonly companyRepository: Repository<CompanyEntity>,
  ) {}

  async findAllCompanies(
    filters: GetCompaniesDTO,
    page: number,
  ): Promise<{
    companies: CompanyEntity[];
    total: number;
    totalPages: number;
  }> {
    const where: FindOptionsWhere<CompanyEntity> = {
      ...(filters.createdById && { createdBy: { id: filters.createdById } }),
      ...(filters.fromDate &&
        filters.toDate && {
          createdAt: Between(
            new Date(filters.fromDate),
            new Date(filters.toDate),
          ),
        }),
      ...(filters.name && { name: Like(filters.name) }),
      ...(filters.websiteUrl && { websiteUrl: Like(filters.websiteUrl) }),
      ...(filters.areaCode && { areaCode: Like(filters.areaCode) }),
      ...(filters.email && { email: Like(filters.email) }),
      ...(filters.phone && { phone: Like(filters.phone) }),
    };
    const [companies, total] = await this.companyRepository.findAndCount({
      where,
      relations: { createdBy: true },
      order: { createdAt: 'DESC', id: 'DESC' },
      take: COMPANY_PAGE_SIZE,
      skip: page * COMPANY_PAGE_SIZE,
    });
    return {
      companies,
      total,
      totalPages: Math.ceil(total / COMPANY_PAGE_SIZE),
    };
  }

  async createCompany(
    company: CreateCompanyDTO,
    createdByUserId: string,
  ): Promise<CompanyEntity> {
    const { contactIds = [], ...companyData } = company;
    return await this.companyRepository.save({
      ...companyData,
      contacts: contactIds.map((id) => ({ id })),
      createdBy: { id: createdByUserId },
    });
  }
}

const COMPANY_PAGE_SIZE = 20;
