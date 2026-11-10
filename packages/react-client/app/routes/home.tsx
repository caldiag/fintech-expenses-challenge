import { useEffect } from "react"
import axios, { type AxiosResponse } from "axios"
import { useNavigate } from "react-router"
import { serverUrl } from "~/lib/server-url"
import { type AuthContext, useAuthContext } from "~/auth/hooks/useAuthContext"

export default function Home() {
  const navigate = useNavigate()
  const { authContext, setAuthContext } = useAuthContext()

  useEffect(() => {
    checkLogin()
  }, [])

  function checkLogin(): void {
    //uses httpOnly cookies
    axios
      .get(`${serverUrl()}/login/me`, { withCredentials: true })
      .then((d: AxiosResponse<AuthContext>) => {
        setAuthContext(d.data)
      })
      .catch(() => {
        navigate("/login")
      })
  }

  return authContext?.id ? <div>Você está logado</div> : null
}
