import type { PermissionSet } from "@app/types"
import type { Role } from "./Role"

export type AuthContext = {
  id: string
  firstName: string
  lastName: string
  email: string
  role: Role | null
  permissionSet: PermissionSet
}
