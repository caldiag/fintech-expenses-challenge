export enum PermissionScope {
  ALL = "ALL",
  ROLE = "ROLE",
  OWN = "OWN",
}

export enum PermissionKey {
  TransactionCreateScope = "transactionCreateScope",
  TransactionReadScope = "transactionReadScope",
  TransactionUpdateScope = "transactionUpdateScope",
  TransactionDeleteScope = "transactionDeleteScope",

  RoleCreateScope = "roleCreateScope",
  RoleReadScope = "roleReadScope",
  RoleUpdateScope = "roleUpdateScope",
  RoleDeleteScope = "roleDeleteScope",

  UserCreateScope = "userCreateScope",
  UserReadScope = "userReadScope",
  UserUpdateScope = "userUpdateScope",
  UserDeleteScope = "userDeleteScope",
}

export type PermissionSet = {
  transactionCreateScope: PermissionScope;
  transactionReadScope: PermissionScope;
  transactionUpdateScope: PermissionScope;
  transactionDeleteScope: PermissionScope;

  roleCreateScope: PermissionScope;
  roleReadScope: PermissionScope;
  roleUpdateScope: PermissionScope;
  roleDeleteScope: PermissionScope;

  userCreateScope: PermissionScope;
  userReadScope: PermissionScope;
  userUpdateScope: PermissionScope;
  userDeleteScope: PermissionScope;
};
