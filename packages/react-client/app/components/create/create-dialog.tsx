import { IconPlus } from "@tabler/icons-react"
import { useState } from "react"
import { useLocation } from "react-router"
import { useDashboardRefresh } from "~/hooks/use-dashboard-refresh"
import { AppRoutes } from "~/routes"
import { Button } from "../ui/button"
import { Dialog, DialogTrigger } from "../ui/dialog"
import CreateCompanyContent from "./create-company-content"
import CreateContactContent from "./create-contact-content"
import CreateTransactionContent from "./create-transaction-content"

export default function CreateDialog() {
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)
  const { refreshView } = useDashboardRefresh()

  function handleCreated() {
    setOpen(false)
    refreshView()
  }

  function getContent() {
    switch (pathname) {
      case AppRoutes.Transactions:
        return <CreateTransactionContent onCreated={handleCreated} />
      case AppRoutes.Companies:
        return <CreateCompanyContent onCreated={handleCreated} />
      case AppRoutes.Contacts:
        return <CreateContactContent onCreated={handleCreated} />
      default:
        return null
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button variant="outline" className="cursor-pointer">
            <IconPlus /> Novo registro
          </Button>
        }
      />
      {getContent()}
    </Dialog>
  )
}
