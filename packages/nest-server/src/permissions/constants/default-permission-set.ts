import { PermissionScope } from '@app/types';
import { PermissionSetEntity } from '../entities/permission-set.entity.ts';

export const DEFAULT_ADMIN_PERMISSION_SET = {
  transactionCreateScope: PermissionScope.ALL,
  transactionReadScope: PermissionScope.ALL,
  transactionUpdateScope: PermissionScope.ALL,
  transactionDeleteScope: PermissionScope.ALL,

  categoryCreateScope: PermissionScope.ALL,
  categoryReadScope: PermissionScope.ALL,
  categoryUpdateScope: PermissionScope.ALL,
  categoryDeleteScope: PermissionScope.ALL,

  userCreateScope: PermissionScope.ALL,
  userReadScope: PermissionScope.ALL,
  userUpdateScope: PermissionScope.ALL,
  userDeleteScope: PermissionScope.ALL,

  roleCreateScope: PermissionScope.ALL,
  roleReadScope: PermissionScope.ALL,
  roleUpdateScope: PermissionScope.ALL,
  roleDeleteScope: PermissionScope.ALL,
};
