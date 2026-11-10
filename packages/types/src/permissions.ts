export enum PermissionScope {
  ALL = "ALL",
  ROLE = "ROLE",
  OWN = "OWN",
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
