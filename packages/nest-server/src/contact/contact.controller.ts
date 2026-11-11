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
import { ContactService } from './contact.service.ts';
import {
  ContactPageResponseDTO,
  ContactResponseDTO,
} from './dto/contact-response.dto.ts';
import CreateContactDTO from './dto/create-contact.dto.ts';
import GetContactsDTO from './dto/get-contacts.dto.ts';
import { ContactEntity } from './entities/contact.entity.ts';

@Controller('contact')
export class ContactController {
  constructor(
    private readonly contactService: ContactService,
    private readonly userService: UserService,
    private readonly permissionService: PermissionsService,
  ) {}

  @Get('all')
  async findAll(
    @UserContext() userId: string,
    @Query() query: GetContactsDTO,
  ): Promise<ContactPageResponseDTO> {
    const { page: pageParam, ...filters } = query;
    const page = Number(pageParam ?? 0);
    if (!Number.isInteger(page) || page < 0) {
      throw new BadRequestException('Page must be a non-negative integer');
    }

    const user = await this.userService.getUserById(userId);
    if (!user) throw new BadRequestException('User not found');
    const readScope = await this.permissionService.validateUserPermissionScope(
      userId,
      PermissionKey.ContactReadScope,
    );
    const scopedFilters = { ...filters };
    if (readScope === PermissionScope.OWN) scopedFilters.createdById = user.id;
    if (readScope === PermissionScope.ROLE) {
      if (!user.role) throw new ForbiddenException('A role is required');
      scopedFilters.createdByRoleId = user.role.id;
    }
    return this.contactService.findAllContacts(scopedFilters, page);
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @UserContext() userId: string,
  ): Promise<ContactResponseDTO> {
    const user = await this.userService.getUserById(userId);
    if (!user) throw new BadRequestException('User not found');
    const contact = await this.contactService.findContactById(id);
    if (!contact) throw new NotFoundException('Contact not found');
    const scope = await this.permissionService.validateUserPermissionScope(
      userId,
      PermissionKey.ContactReadScope,
    );
    if (!this.canAccess(scope, user.id, user.role?.id, contact.createdBy)) {
      throw new ForbiddenException('Cannot read this contact');
    }
    return contact;
  }

  @Post('create')
  async create(
    @Body() contact: CreateContactDTO,
    @UserContext() userId: string,
  ): Promise<ContactResponseDTO> {
    const user = await this.userService.getUserById(userId);
    if (!user) throw new BadRequestException('User not found');
    const createScope =
      await this.permissionService.validateUserPermissionScope(
        userId,
        PermissionKey.ContactCreateScope,
      );
    if (createScope === PermissionScope.ROLE && !user.role) {
      throw new ForbiddenException('A role is required');
    }
    return this.contactService.createContact(contact, userId);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() contact: CreateContactDTO,
    @UserContext() userId: string,
  ): Promise<ContactResponseDTO> {
    const user = await this.userService.getUserById(userId);
    if (!user) throw new BadRequestException('User not found');
    const existing = await this.contactService.findContactById(id);
    if (!existing) throw new NotFoundException('Contact not found');
    const scope = await this.permissionService.validateUserPermissionScope(
      userId,
      PermissionKey.ContactUpdateScope,
    );
    if (!this.canAccess(scope, user.id, user.role?.id, existing.createdBy)) {
      throw new ForbiddenException('Cannot update this contact');
    }
    return this.contactService.updateContact(id, contact);
  }

  @Delete(':id')
  async delete(
    @Param('id') id: string,
    @UserContext() userId: string,
  ): Promise<void> {
    const user = await this.userService.getUserById(userId);
    if (!user) throw new BadRequestException('User not found');
    const contact = await this.contactService.findContactById(id);
    if (!contact) throw new NotFoundException('Contact not found');
    const scope = await this.permissionService.validateUserPermissionScope(
      userId,
      PermissionKey.ContactDeleteScope,
    );
    if (!this.canAccess(scope, user.id, user.role?.id, contact.createdBy)) {
      throw new ForbiddenException('Cannot delete this contact');
    }
    await this.contactService.deleteContact(id);
  }

  private canAccess(
    scope: PermissionScope,
    userId: string,
    userRoleId: string | undefined,
    owner: ContactEntity['createdBy'],
  ): boolean {
    if (scope === PermissionScope.ALL) return true;
    if (scope === PermissionScope.ROLE) {
      return Boolean(userRoleId && owner?.role?.id === userRoleId);
    }
    return owner?.id === userId;
  }
}
