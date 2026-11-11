import { useRef, useState } from "react"
import { Select } from "@base-ui/react/select"
import { Currency } from "@app/types"
import {
  IconChevronDown,
  IconDeviceFloppy,
  IconPlus,
} from "@tabler/icons-react"
import {
  convertCurrencyAmount,
  currencies,
  formatCurrencyAmount,
  getCurrencyName,
  getCurrencySymbol,
  normalizeAmountDigits,
} from "~/lib/utils/currency"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog"
import { Button } from "../ui/button"
import { FieldGroup, FieldLabel, FieldLegend, FieldSet } from "../ui/field"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"
import { ButtonGroup } from "../ui/button-group"

export default function CreateTransactionDialog() {
  const [currency, setCurrency] = useState<Currency>(Currency.BRL)
  const [amountDigits, setAmountDigits] = useState("")
  const amountInputRef = useRef<HTMLInputElement>(null)
  const formattedAmount = formatCurrencyAmount(amountDigits, currency)

  return (
    <Dialog>
      <DialogTrigger>
        <Button variant="outline">
          <IconPlus /> Nova transação
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nova transação</DialogTitle>
        </DialogHeader>
        <FieldGroup>
          <FieldGroup>
            <FieldLegend>Informações básicas</FieldLegend>
            <FieldSet className="grid grid-cols-2">
              <div>
                <FieldLabel>Nome</FieldLabel>
                <Input placeholder="Nome" />
              </div>
              <div>
                <FieldLabel htmlFor="transaction-amount">Valor</FieldLabel>
                <ButtonGroup aria-label="Valor da transação" className="w-full">
                  <Select.Root
                    value={currency}
                    onValueChange={(value) => {
                      if (!value) return

                      const nextCurrency = value as Currency
                      setAmountDigits(
                        convertCurrencyAmount(
                          amountDigits,
                          currency,
                          nextCurrency
                        )
                      )
                      setCurrency(nextCurrency)
                    }}
                  >
                    <Select.Trigger
                      aria-label="Moeda"
                      data-slot="select-trigger"
                      className="flex h-7 w-20 shrink-0 items-center justify-between gap-1 rounded-md border border-input bg-input/20 px-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 md:text-xs/relaxed"
                    >
                      <Select.Value>{getCurrencySymbol(currency)}</Select.Value>
                      <Select.Icon>
                        <IconChevronDown className="size-3" />
                      </Select.Icon>
                    </Select.Trigger>
                    <Select.Portal>
                      <Select.Positioner
                        sideOffset={4}
                        className="z-50 outline-none"
                      >
                        <Select.Popup className="max-h-(--available-height) min-w-48 overflow-y-auto rounded-md border bg-popover p-1 text-popover-foreground shadow-md">
                          <Select.List>
                            {currencies.map((option) => (
                              <Select.Item
                                key={option}
                                value={option}
                                className="flex min-h-7 cursor-default items-center rounded-sm px-2 py-1 text-xs outline-none data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground"
                              >
                                <Select.ItemText>
                                  {option} - {getCurrencyName(option)}
                                </Select.ItemText>
                              </Select.Item>
                            ))}
                          </Select.List>
                        </Select.Popup>
                      </Select.Positioner>
                    </Select.Portal>
                  </Select.Root>
                  <Input
                    ref={amountInputRef}
                    id="transaction-amount"
                    type="text"
                    inputMode="numeric"
                    placeholder="0"
                    value={formattedAmount}
                    className="text-right"
                    onFocus={(event) => {
                      const end = event.currentTarget.value.length
                      event.currentTarget.setSelectionRange(end, end)
                    }}
                    onClick={(event) => {
                      const end = event.currentTarget.value.length
                      event.currentTarget.setSelectionRange(end, end)
                    }}
                    onChange={(event) => {
                      setAmountDigits(normalizeAmountDigits(event.target.value))
                      requestAnimationFrame(() => {
                        const input = amountInputRef.current
                        if (!input) return

                        const end = input.value.length
                        input.setSelectionRange(end, end)
                      })
                    }}
                  />
                </ButtonGroup>
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
    </Dialog>
  )
}
