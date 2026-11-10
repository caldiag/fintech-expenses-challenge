import { useState } from "react"
import type { AuthContext } from "~/types/AuthContext"

export function useAuthContext() {
  const [authContext, setAuthContext] = useState<AuthContext>()

  return { authContext, setAuthContext }
}
