import type { AxiosResponse } from "axios"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router"
import { AppRoutes } from "~/routes"
import type { AuthContext } from "~/types/AuthContext"
import axiosClient from "../axios-client"

export function useAuthContext() {
  const [authContext, setAuthContext] = useState<AuthContext>()
  const navigate = useNavigate()

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
        navigate(AppRoutes.Login)
      })
  }

  return { authContext, setAuthContext }
}
