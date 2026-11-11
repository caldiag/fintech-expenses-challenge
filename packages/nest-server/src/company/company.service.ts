import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import CreateCompanyDTO from './dto/create-company.dto.ts';
import { CompanyEntity } from './entities/company.entity.ts';

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(CompanyEntity)
    private readonly companyRepository: Repository<CompanyEntity>,
  ) {}

  async findAllCompanies(): Promise<CompanyEntity[]> {
    return await this.companyRepository.find();
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
