import {
  IconChevronDown,
  IconRefresh,
  IconSearch,
  IconUser,
} from "@tabler/icons-react"
import { useLocation } from "react-router"
import { useAuthContext } from "~/auth/hooks/useAuthContext"
import CreateDialog from "../create/create-dialog"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Button } from "../ui/button"
import { ButtonGroup } from "../ui/button-group"
import { Input } from "../ui/input"

export default function NavigationBar() {
  const { authContext } = useAuthContext()
  const { pathname } = useLocation()

  return (
    <div className="absolute top-0 left-0 z-1 flex h-15 w-screen items-center justify-end gap-1 p-4">
      <ButtonGroup className="mr-4">
        <Input className="w-full bg-background" />
        <Button className="cursor-pointer bg-background" variant="outline">
          <IconSearch />
        </Button>
      </ButtonGroup>
      {pathname !== "/dashboard" && <CreateDialog />}
      <Button variant="outline">
        <IconRefresh /> Atualizar visualização
      </Button>
      <ButtonGroup>
        <Button variant="outline" className="cursor-pointer">
          <Avatar className="h-4 w-4">
            <AvatarImage src="https://randomuser.me/api/portraits/men/75.jpg" />
            <AvatarFallback>
              <IconUser />
            </AvatarFallback>
          </Avatar>
          {authContext?.firstName}
        </Button>
        <Button variant="outline">
          <IconChevronDown />
        </Button>
      </ButtonGroup>
    </div>
  )
}
