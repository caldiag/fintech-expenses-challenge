import {
  IconBuilding,
  IconCurrencyDollar,
  IconGitCompare,
  IconHome,
  IconUsers,
} from "@tabler/icons-react"
import { useLocation, useNavigate } from "react-router"
import { Button } from "~/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { Separator } from "~/components/ui/separator"
import { AppRoutes } from "~/routes"
import Title from "../ui/title"

export default function Drawer() {
  const { pathname } = useLocation()
  const navigate = useNavigate()

  return (
    <Card className="z-2 h-screen max-w-65 shrink-0 rounded-none bg-sidebar">
      <CardHeader>
        <CardTitle>
          <Title
            Icon={() => (
              <IconGitCompare className="rounded-sm bg-orange-200 p-1 text-orange-700" />
            )}
            title="Fintech Expenses"
          />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Button
          onClick={() => navigate(AppRoutes.Summary)}
          className={
            buttonStyling +
            (pathname === AppRoutes.Summary
              ? " bg-sidebar-border opacity-100"
              : "")
          }
          size="lg"
          variant="ghost"
        >
          <IconHome /> Início
        </Button>
        <Button
          onClick={() => navigate(AppRoutes.Transactions)}
          className={
            buttonStyling +
            (pathname === AppRoutes.Transactions
              ? " bg-sidebar-border opacity-100"
              : "")
          }
          size="lg"
          variant="ghost"
        >
          <IconCurrencyDollar /> Transações
        </Button>
        <Button
          onClick={() => navigate(AppRoutes.Companies)}
          className={
            buttonStyling +
            (pathname === AppRoutes.Companies
              ? " bg-sidebar-border opacity-100"
              : "")
          }
          size="lg"
          variant="ghost"
        >
          <IconBuilding /> Empresas
        </Button>
        <Button
          onClick={() => navigate(AppRoutes.Contacts)}
          className={
            buttonStyling +
            (pathname === AppRoutes.Contacts
              ? " bg-sidebar-border opacity-100"
              : "")
          }
          size="lg"
          variant="ghost"
        >
          <IconUsers /> Contatos
        </Button>
        <Separator className="my-6" />
      </CardContent>
    </Card>
  )
}

const buttonStyling =
  "w-full cursor-pointer justify-start gap-2 opacity-65 hover:opacity-100 hover:bg-sidebar-border"
