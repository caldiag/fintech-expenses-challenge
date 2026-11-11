import { PermissionScope } from "@app/types"
import type { AuthContext } from "~/types/AuthContext"

type ScopedRecord = {
  createdBy?: { id?: string; role?: { id?: string } | null } | null
  role?: { id?: string } | null
}

export function hasRecordScopeAccess(
  scope: PermissionScope | undefined,
  authContext: AuthContext | undefined,
  record: ScopedRecord | undefined
): boolean {
  if (!scope || !authContext || !record) return false
  if (scope === PermissionScope.ALL) return true
  if (scope === PermissionScope.ROLE) {
    const recordRoleId = record.role?.id ?? record.createdBy?.role?.id
    return Boolean(authContext.role?.id && recordRoleId === authContext.role.id)
  }
  return record.createdBy?.id === authContext.id
}
