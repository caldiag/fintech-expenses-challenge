import { IconDeviceFloppy } from "@tabler/icons-react"
import { Button } from "../ui/button"
import {
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog"
import { FieldGroup, FieldLabel, FieldLegend, FieldSet } from "../ui/field"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"

export default function CreateCompanyContent() {
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Nova empresa</DialogTitle>
      </DialogHeader>
      <FieldGroup>
        <FieldGroup>
          <FieldLegend>Informações básicas</FieldLegend>
          <FieldSet className="grid grid-cols-2">
            <div>
              <FieldLabel>Nome</FieldLabel>
              <Input placeholder="Nome" />
            </div>
          </FieldSet>
          <FieldLabel>Descrição</FieldLabel>
          <Textarea placeholder="Descrição" />
        </FieldGroup>
      </FieldGroup>
      <DialogFooter>
        <Button>
          <IconDeviceFloppy /> Salvar
        </Button>
      </DialogFooter>
    </DialogContent>
  )
}
