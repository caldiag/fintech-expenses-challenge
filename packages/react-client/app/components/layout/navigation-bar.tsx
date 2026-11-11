import { IconRefresh, IconSearch, IconUser } from "@tabler/icons-react"
import { useAuthContext } from "~/auth/hooks/useAuthContext"
import CreateTransactionDialog from "../create/create-transaction-dialog"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Button } from "../ui/button"
import { ButtonGroup } from "../ui/button-group"
import { Input } from "../ui/input"

export default function NavigationBar() {
  const { authContext } = useAuthContext()

  return (
    <div className="absolute top-0 left-0 z-1 flex h-15 w-screen items-center justify-end gap-1 p-6">
      <ButtonGroup className="mr-4">
        <Input className="w-full bg-background" />
        <Button className="bg-background" variant="outline">
          <IconSearch />
        </Button>
      </ButtonGroup>
      <CreateTransactionDialog />
      <Button variant="outline">
        <IconRefresh />
      </Button>
      <ButtonGroup>
        <Button variant="outline">
          <Avatar className="h-4 w-4">
            <AvatarImage src="https://randomuser.me/api/portraits/men/75.jpg" />
            <AvatarFallback>
              <IconUser />
            </AvatarFallback>
          </Avatar>
          {authContext?.firstName} {authContext?.lastName}
        </Button>
      </ButtonGroup>
    </div>
  )
}
