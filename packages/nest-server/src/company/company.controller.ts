import { PermissionKey, PermissionScope } from '@app/types';
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { UserContext } from '../auth/guard/context.decorator.ts';
import { PermissionsService } from '../permissions/permissions.service.ts';
import { UserService } from '../user/user.service.ts';
import { CompanyService } from './company.service.ts';
import {
  CompanyPageResponseDTO,
  CompanyResponseDTO,
} from './dto/company-response.dto.ts';
import CreateCompanyDTO from './dto/create-company.dto.ts';
import GetCompaniesDTO from './dto/get-companies.dto.ts';
import { CompanyEntity } from './entities/company.entity.ts';

@Controller('company')
export class CompanyController {
  constructor(
    private readonly companyService: CompanyService,
    private readonly userService: UserService,
    private readonly permissionService: PermissionsService,
  ) {}

  @Get('all')
  async findAll(
    @UserContext() userId: string,
    @Query() query: GetCompaniesDTO,
  ): Promise<CompanyPageResponseDTO> {
    const { page: pageParam, ...filters } = query;
    const page = Number(pageParam ?? 0);
    if (!Number.isInteger(page) || page < 0) {
      throw new BadRequestException('Page must be a non-negative integer');
    }

    const user = await this.userService.getUserById(userId);
    if (!user) throw new BadRequestException('User not found');
    const readScope = await this.permissionService.validateUserPermissionScope(
      userId,
      PermissionKey.CompanyReadScope,
    );
    const scopedFilters = { ...filters };
    if (readScope === PermissionScope.OWN) scopedFilters.createdById = user.id;
    if (readScope === PermissionScope.ROLE) {
      if (!user.role) throw new ForbiddenException('A role is required');
      scopedFilters.createdByRoleId = user.role.id;
    }
    return this.companyService.findAllCompanies(scopedFilters, page);
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @UserContext() userId: string,
  ): Promise<CompanyResponseDTO> {
    const user = await this.userService.getUserById(userId);
    if (!user) throw new BadRequestException('User not found');
    const company = await this.companyService.findCompanyById(id);
    if (!company) throw new NotFoundException('Company not found');
    const scope = await this.permissionService.validateUserPermissionScope(
      userId,
      PermissionKey.CompanyReadScope,
    );
    if (!this.canAccess(scope, user.id, user.role?.id, company.createdBy)) {
      throw new ForbiddenException('Cannot read this company');
    }
    return company;
  }

  @Post('create')
  async create(
    @Body() company: CreateCompanyDTO,
    @UserContext() userId: string,
  ): Promise<CompanyResponseDTO> {
    const user = await this.userService.getUserById(userId);
    if (!user) throw new BadRequestException('User not found');
    const createScope =
      await this.permissionService.validateUserPermissionScope(
        userId,
        PermissionKey.CompanyCreateScope,
      );
    if (createScope === PermissionScope.ROLE && !user.role) {
      throw new ForbiddenException('A role is required');
    }
    return this.companyService.createCompany(company, userId);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() company: CreateCompanyDTO,
    @UserContext() userId: string,
  ): Promise<CompanyResponseDTO> {
    const user = await this.userService.getUserById(userId);
    if (!user) throw new BadRequestException('User not found');
    const existing = await this.companyService.findCompanyById(id);
    if (!existing) throw new NotFoundException('Company not found');
    const scope = await this.permissionService.validateUserPermissionScope(
      userId,
      PermissionKey.CompanyUpdateScope,
    );
    if (!this.canAccess(scope, user.id, user.role?.id, existing.createdBy)) {
      throw new ForbiddenException('Cannot update this company');
    }
    return this.companyService.updateCompany(id, company);
  }

  @Delete(':id')
  async delete(
    @Param('id') id: string,
    @UserContext() userId: string,
  ): Promise<void> {
    const user = await this.userService.getUserById(userId);
    if (!user) throw new BadRequestException('User not found');
    const company = await this.companyService.findCompanyById(id);
    if (!company) throw new NotFoundException('Company not found');
    const scope = await this.permissionService.validateUserPermissionScope(
      userId,
      PermissionKey.CompanyDeleteScope,
    );
    if (!this.canAccess(scope, user.id, user.role?.id, company.createdBy)) {
      throw new ForbiddenException('Cannot delete this company');
    }
    await this.companyService.deleteCompany(id);
  }

  private canAccess(
    scope: PermissionScope,
    userId: string,
    userRoleId: string | undefined,
    owner: CompanyEntity['createdBy'],
  ): boolean {
    if (scope === PermissionScope.ALL) return true;
    if (scope === PermissionScope.ROLE) {
      return Boolean(userRoleId && owner?.role?.id === userRoleId);
    }
    return owner?.id === userId;
  }
}
