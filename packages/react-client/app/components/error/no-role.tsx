import { IconAlertTriangle } from "@tabler/icons-react"
import { Alert, AlertDescription, AlertTitle } from "../ui/alert"

export default function NoRole() {
  return (
    <div className="grid h-screen w-screen items-center justify-center gap-4">
      <Alert className="w-90">
        <IconAlertTriangle size={20} />
        <AlertTitle>Você não tem um setor definido ainda</AlertTitle>
        <AlertDescription>
          Entre em contato com o seu administrador para que um setor seja
          atribuído ao seu perfil.
        </AlertDescription>
      </Alert>
    </div>
  )
}
