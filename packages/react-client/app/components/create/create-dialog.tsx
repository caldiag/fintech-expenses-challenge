import { IconPlus } from "@tabler/icons-react"
import { useLocation } from "react-router"
import { AppRoutes } from "~/routes"
import { Button } from "../ui/button"
import { Dialog, DialogTrigger } from "../ui/dialog"
import CreateCompanyContent from "./create-company-content"
import CreateTransactionContent from "./create-transaction-content"

export default function CreateDialog() {
  const { pathname } = useLocation()

  function getContent() {
    switch (pathname) {
      case AppRoutes.Transactions:
        return <CreateTransactionContent />
      case AppRoutes.Companies:
        return <CreateCompanyContent />
      default:
        return null
    }
  }

  return (
    <Dialog>
      <DialogTrigger>
        <Button variant="outline" className="cursor-pointer">
          <IconPlus /> Novo registro
        </Button>
      </DialogTrigger>
      {getContent()}
    </Dialog>
  )
}
