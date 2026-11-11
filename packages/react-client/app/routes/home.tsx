import { useAuthContext } from "~/auth/hooks/useAuthContext"
import NoRole from "~/components/error/no-role"

export default function Home() {
  const { authContext } = useAuthContext()

  return authContext?.id && (!authContext.role ? <NoRole /> : null)
}
