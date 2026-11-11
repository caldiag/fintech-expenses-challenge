import { Body, Controller, Post } from '@nestjs/common';
import { UserContext } from '../auth/guard/context.decorator.ts';
import CreateCompanyDTO from './dto/create-company.dto.ts';
import { CompanyEntity } from './entities/company.entity.ts';
import { CompanyService } from './company.service.ts';

@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Post('create')
  async create(
    @Body() company: CreateCompanyDTO,
    @UserContext() userId: string,
  ): Promise<CompanyEntity> {
    return await this.companyService.createCompany(company, userId);
  }
}
