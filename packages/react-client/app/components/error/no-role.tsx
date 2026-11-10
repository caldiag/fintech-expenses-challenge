import { Alert, AlertDescription, AlertTitle } from "../ui/alert"
import { IconAlertTriangle } from "@tabler/icons-react"

export default function NoRole() {
  return (
    <div className="grid h-screen w-screen items-center justify-center gap-4">
      <Alert className="w-90">
        <IconAlertTriangle size={20} />
        <AlertTitle>Você não tem uma função definida ainda</AlertTitle>
        <AlertDescription>
          Entre em contato com o seu administrador para que uma função seja
          atribuída ao seu perfil.
        </AlertDescription>
      </Alert>
    </div>
  )
}
