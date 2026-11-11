import { useEffect, useState } from "react"
import type { AuthContext } from "~/types/AuthContext"
import axiosClient from "../axios-client"
import type { AxiosResponse } from "axios"
import { useNavigate } from "react-router"

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
        navigate("/login")
      })
  }

  return { authContext, setAuthContext }
}
