import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Query,
} from '@nestjs/common';
import { UserContext } from '../auth/guard/context.decorator.ts';
import { CompanyService } from './company.service.ts';
import CreateCompanyDTO from './dto/create-company.dto.ts';
import GetCompaniesDTO from './dto/get-companies.dto.ts';
import { CompanyEntity } from './entities/company.entity.ts';

@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Get('all')
  async findAll(
    @Query() filters: GetCompaniesDTO,
    @Query('page') pageParam?: string,
  ) {
    const page = Number(pageParam ?? 0);
    if (!Number.isInteger(page) || page < 0) {
      throw new BadRequestException('Page must be a non-negative integer');
    }

    return await this.companyService.findAllCompanies(filters, page);
  }

  @Post('create')
  async create(
    @Body() company: CreateCompanyDTO,
    @UserContext() userId: string,
  ): Promise<CompanyEntity> {
    return await this.companyService.createCompany(company, userId);
  }
}
