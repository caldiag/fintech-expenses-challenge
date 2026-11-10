import { useEffect } from "react"
import { type AxiosResponse } from "axios"
import { useNavigate } from "react-router"
import { useAuthContext } from "~/auth/hooks/useAuthContext"
import NoRole from "~/components/error/no-role"
import axiosClient from "~/auth/axios-client"
import type { AuthContext } from "~/types/AuthContext"

export default function Home() {
  const navigate = useNavigate()
  const { authContext, setAuthContext } = useAuthContext()

  useEffect(() => {
    checkLogin()
  }, [])

  function checkLogin(): void {
    axiosClient
      .get(`/login/me`)
      .then((d: AxiosResponse<AuthContext>) => {
        setAuthContext(d.data)
      })
      .catch(() => {
        navigate("/login")
      })
  }

  return authContext?.id && (!authContext.role ? <NoRole /> : null)
}
