import {
  IconBookmark,
  IconBuilding,
  IconCurrencyDollar,
  IconHome,
  IconUsers,
} from "@tabler/icons-react"
import { useLocation, useNavigate } from "react-router"
import { Button } from "~/components/ui/button"
import { Card, CardContent } from "~/components/ui/card"
import { Separator } from "~/components/ui/separator"
import { Empty, EmptyDescription, EmptyMedia, EmptyTitle } from "../ui/empty"

export default function Drawer() {
  const { pathname } = useLocation()
  const navigate = useNavigate()

  return (
    <Card className="z-2 h-screen max-w-65 rounded-none bg-sidebar">
      <CardContent>
        <Button
          onClick={() => navigate("/dashboard")}
          className={
            buttonStyling +
            (pathname === "/dashboard" ? " bg-sidebar-border opacity-100" : "")
          }
          size="lg"
          variant="ghost"
        >
          <IconHome /> Início
        </Button>
        <Button
          onClick={() => navigate("/dashboard/transactions")}
          className={buttonStyling}
          size="lg"
          variant="ghost"
        >
          <IconCurrencyDollar /> Transações
        </Button>
        <Button
          onClick={() => navigate("/dashboard/companies")}
          className={buttonStyling}
          size="lg"
          variant="ghost"
        >
          <IconBuilding /> Empresas
        </Button>
        <Button
          onClick={() => navigate("/dashboard/contacts")}
          className={buttonStyling}
          size="lg"
          variant="ghost"
        >
          <IconUsers /> Contatos
        </Button>
        <Separator className="my-6" />
        <Empty className="opacity-60">
          <EmptyMedia variant="icon" className="bg-sidebar-border">
            <IconBookmark />
          </EmptyMedia>
          <EmptyTitle>Você ainda não tem favoritos</EmptyTitle>
          <EmptyDescription>
            Adicione empresas ou contatos à sua lista de favoritos e eles
            aparecerão aqui
          </EmptyDescription>
        </Empty>
      </CardContent>
    </Card>
  )
}

const buttonStyling =
  "w-full cursor-pointer justify-start gap-2 opacity-65 hover:opacity-100 hover:bg-sidebar-border"
