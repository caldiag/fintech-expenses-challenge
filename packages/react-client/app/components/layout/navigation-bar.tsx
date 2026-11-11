import {
  IconChevronDown,
  IconRefresh,
  IconSearch,
  IconUser,
} from "@tabler/icons-react"
import { useLocation } from "react-router"
import { useAuthContext } from "~/auth/hooks/useAuthContext"
import { useDashboardRefresh } from "~/hooks/use-dashboard-refresh"
import { AppRoutes } from "~/routes"
import CreateDialog from "../create/create-dialog"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Button } from "../ui/button"
import { ButtonGroup } from "../ui/button-group"
import { Input } from "../ui/input"
import Title from "../ui/title"

export default function NavigationBar() {
  const { authContext } = useAuthContext()
  const { pathname } = useLocation()
  const { refreshView } = useDashboardRefresh()

  return (
    <div className="w-fill sticky top-0 z-1 mb-4 flex h-10 items-center justify-between gap-1 border-b-1 p-3 px-4">
      <div>
        <Title title={getNavbarTitle(pathname as AppRoutes)} />
      </div>
      <div className="flex gap-1">
        <ButtonGroup className="mr-6">
          <Input className="w-full bg-background" />
          <Button className="cursor-pointer bg-background" variant="outline">
            <IconSearch />
          </Button>
        </ButtonGroup>
        {pathname !== AppRoutes.Summary && <CreateDialog />}
        <Button
          className="cursor-pointer"
          variant="outline"
          onClick={refreshView}
        >
          <IconRefresh /> Atualizar visualização
        </Button>
        <ButtonGroup className="ml-6">
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
    </div>
  )
}

function getNavbarTitle(pathname: AppRoutes) {
  switch (pathname) {
    case AppRoutes.Dashboard:
      return "Resumo"
    case AppRoutes.Companies:
      return "Empresas"
    case AppRoutes.Transactions:
      return "Transações"
    case AppRoutes.Contacts:
      return "Contatos"
    case AppRoutes.Summary:
      return "Resumo"
    default:
      return ""
  }
}
