import { IconPlus } from "@tabler/icons-react"
import { useState } from "react"
import { useLocation } from "react-router"
import { AppRoutes } from "~/routes"
import { Button } from "../ui/button"
import { Dialog, DialogTrigger } from "../ui/dialog"
import CreateCompanyContent from "./create-company-content"
import CreateContactContent from "./create-contact-content"
import CreateTransactionContent from "./create-transaction-content"

export default function CreateDialog() {
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)

  function getContent() {
    switch (pathname) {
      case AppRoutes.Transactions:
        return <CreateTransactionContent onCreated={() => setOpen(false)} />
      case AppRoutes.Companies:
        return <CreateCompanyContent onCreated={() => setOpen(false)} />
      case AppRoutes.Contacts:
        return <CreateContactContent onCreated={() => setOpen(false)} />
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
