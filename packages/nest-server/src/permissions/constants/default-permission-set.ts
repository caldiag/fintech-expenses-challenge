import type { PermissionSet } from '@app/types';
import { PermissionScope } from '@app/types';

export const DEFAULT_ROLE_PERMISSION_SET: PermissionSet = {
  transactionCreateScope: PermissionScope.OWN,
  transactionReadScope: PermissionScope.OWN,
  transactionUpdateScope: PermissionScope.OWN,
  transactionDeleteScope: PermissionScope.OWN,
  userCreateScope: PermissionScope.OWN,
  userReadScope: PermissionScope.OWN,
  userUpdateScope: PermissionScope.OWN,
  userDeleteScope: PermissionScope.OWN,
  roleCreateScope: PermissionScope.OWN,
  roleReadScope: PermissionScope.OWN,
  roleUpdateScope: PermissionScope.OWN,
  roleDeleteScope: PermissionScope.OWN,
};

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
