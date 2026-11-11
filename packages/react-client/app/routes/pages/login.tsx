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
import { Separator } from "~/components/ui/separator"
import { IconArrowRight } from "@tabler/icons-react"
import { Spinner } from "~/components/ui/spinner"
import { toast } from "~/components/ui/toast"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [isCreatingAccount, setIsCreatingAccount] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  async function handleSubmit(): Promise<void> {
    setIsLoading(true)
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
      return
    } catch (error) {
      setIsLoading(false)
      toast.add({
        type: "error",
        title: "Erro",
        description:
          "Ocorreu um erro. Verifique seu usuário e senha e tente novamente.",
      })
    }
  }

  return (
    <div className="flex justify-end">
      <div
        className="absolute h-screen w-screen"
        style={{
          zIndex: 1,
          background:
            "linear-gradient(90deg, rgba(255, 255, 255, 0) -20%, rgba(255, 255, 255, 1) 80%)",
        }}
      />
      <div className="absolute h-screen w-screen overflow-hidden">
        <img
          src="/assets/images/bg2.jpeg"
          className="object-cover opacity-50"
          alt="background"
        />
      </div>
      <Card className="z-2 h-screen min-w-105">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>Acesse sua conta</CardDescription>
          <CardAction>
            <Button
              variant="link"
              onClick={() => setIsCreatingAccount((prev) => !prev)}
            >
              {!isCreatingAccount ? <>Criar conta</> : <>Voltar para o login</>}
            </Button>
          </CardAction>
        </CardHeader>
        <Separator className="mb-5" />
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
            </FieldGroup>
          </FieldSet>
        </CardContent>
        <CardFooter className="mt-4 flex gap-2">
          <Field>
            <Button
              onClick={handleSubmit}
              disabled={isLoading}
              variant="default"
              className="cursor-pointer"
            >
              {isLoading && <Spinner />}
              {isCreatingAccount ? "Criar conta" : "Entrar"}
              <IconArrowRight />
            </Button>
          </Field>
          <Field>
            <Button className={"cursor-pointer"} variant="ghost">
              Esqueci minha senha
            </Button>
          </Field>
        </CardFooter>
        <div className="flex h-full items-end justify-center opacity-50">
          Caleb Durães
        </div>
      </Card>
    </div>
  )
}
