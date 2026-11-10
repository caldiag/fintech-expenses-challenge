import { useState } from "react"

export type AuthContext = {
  id: string
  firstName: string
  lastName: string
  email: string
  role: string | null
}

export function useAuthContext() {
  const [authContext, setAuthContext] = useState<AuthContext>()

  return { authContext, setAuthContext }
}
