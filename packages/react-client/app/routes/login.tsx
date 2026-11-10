import axios from "axios"
import { useState } from "react"
import { useNavigate } from "react-router"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardContent,
  CardFooter,
} from "~/components/ui/card"
import { FieldSet, FieldGroup, Field, FieldLabel } from "~/components/ui/field"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { serverUrl } from "~/lib/server-url"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [authError, setAuthError] = useState("")
  const [isCreatingAccount, setIsCreatingAccount] = useState(false)
  const navigate = useNavigate()

  async function handleSubmit(): Promise<void> {
    setAuthError("")
    // A successful response sets the authorization cookie.
    try {
      if (isCreatingAccount) {
        await axios.post(
          `${serverUrl()}/login/register`,
          { firstName, lastName, email, password },
          { withCredentials: true }
        )
        navigate("/")
        return
      }

      await axios.post(
        `${serverUrl()}/login`,
        { email, password },
        { withCredentials: true }
      )
      navigate("/")
    } catch (error) {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message
        : undefined
      setAuthError(
        typeof message === "string"
          ? message
          : "Não foi possível conectar. Tente novamente."
      )
    }
  }

  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <Card className="min-w-80">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>Acesse sua conta</CardDescription>
          <CardAction>
            <Button variant="link" className="cursor-pointer">
              Esqueci minha senha
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <FieldSet>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">E-mail</FieldLabel>
                <Input
                  type="email"
                  id="email"
                  autoComplete="off"
                  placeholder="Seu e-mail"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="password">Senha</FieldLabel>
                <Input
                  type="password"
                  id="password"
                  autoComplete="off"
                  placeholder="Senha"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Field>
              {isCreatingAccount && (
                <>
                  <FieldLabel htmlFor="firstName">Nome</FieldLabel>
                  <Field orientation="horizontal">
                    <Input
                      type="text"
                      id="firstName"
                      autoComplete="off"
                      placeholder="Nome"
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                    <Input
                      type="text"
                      id="lastName"
                      autoComplete="off"
                      placeholder="Sobrenome"
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </Field>
                </>
              )}
              {authError && <p role="alert">{authError}</p>}
            </FieldGroup>
          </FieldSet>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Field>
            <Button
              onClick={handleSubmit}
              variant="default"
              className="cursor-pointer"
            >
              {isCreatingAccount ? "Criar conta" : "Entrar"}
            </Button>
          </Field>
          <Button
            onClick={() => setIsCreatingAccount((prev) => !prev)}
            variant="link"
            className="cursor-pointer"
          >
            {!isCreatingAccount ? "Criar conta" : "Voltar para o login"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
