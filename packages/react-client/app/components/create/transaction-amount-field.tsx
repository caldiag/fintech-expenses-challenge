import { Currency } from "@app/types"
import { Select } from "@base-ui/react/select"
import { IconChevronDown } from "@tabler/icons-react"
import { useRef } from "react"
import { Controller, type Control, type UseFormSetValue } from "react-hook-form"
import {
  convertCurrencyAmount,
  currencies,
  formatCurrencyAmount,
  getCurrencyName,
  getCurrencySymbol,
  normalizeAmountDigits,
} from "~/lib/utils/currency"
import { ButtonGroup } from "../ui/button-group"
import { FieldLabel, FieldSet } from "../ui/field"
import { Input } from "../ui/input"
import type { TransactionFormValues } from "./utils/transaction-form"

export function TransactionAmountField({
  control,
  currency,
  amountDigits,
  setValue,
  canEdit,
}: {
  control: Control<TransactionFormValues>
  currency: Currency
  amountDigits: string
  setValue: UseFormSetValue<TransactionFormValues>
  canEdit: boolean
}) {
  const amountInputRef = useRef<HTMLInputElement>(null)

  return (
    <FieldSet className="grid grid-cols-1 gap-3">
      <div>
        <FieldLabel htmlFor="transaction-amount">Valor</FieldLabel>
        <ButtonGroup aria-label="Valor da transação" className="w-full">
          <Select.Root
            value={currency}
            onValueChange={(value) => {
              if (!value) return
              const nextCurrency = value as Currency
              setValue(
                "amountDigits",
                convertCurrencyAmount(amountDigits, currency, nextCurrency),
                { shouldDirty: true }
              )
              setValue("currency", nextCurrency, { shouldDirty: true })
            }}
          >
            <Select.Trigger
              aria-label="Moeda"
              disabled={!canEdit}
              data-slot="select-trigger"
              className="flex h-7 w-20 shrink-0 items-center justify-between gap-1 rounded-md border border-input bg-input/20 px-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 md:text-xs/relaxed"
            >
              <Select.Value>{getCurrencySymbol(currency)}</Select.Value>
              <Select.Icon>
                <IconChevronDown className="size-3" />
              </Select.Icon>
            </Select.Trigger>
            <Select.Portal>
              <Select.Positioner sideOffset={4} className="z-50 outline-none">
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
          <Controller
            control={control}
            name="amountDigits"
            rules={{
              validate: (value) =>
                Number.parseInt(value, 10) > 0 || "Informe um valor válido.",
            }}
            render={({ field }) => (
              <Input
                {...field}
                ref={(element) => {
                  field.ref(element)
                  amountInputRef.current = element
                }}
                id="transaction-amount"
                type="text"
                inputMode="numeric"
                placeholder="0"
                value={formatCurrencyAmount(field.value, currency)}
                className="text-right"
                required
                disabled={!canEdit}
                onFocus={(event) => {
                  const end = event.currentTarget.value.length
                  event.currentTarget.setSelectionRange(end, end)
                }}
                onClick={(event) => {
                  const end = event.currentTarget.value.length
                  event.currentTarget.setSelectionRange(end, end)
                }}
                onChange={(event) => {
                  field.onChange(normalizeAmountDigits(event.target.value))
                  requestAnimationFrame(() => {
                    const input = amountInputRef.current
                    if (!input) return
                    const end = input.value.length
                    input.setSelectionRange(end, end)
                  })
                }}
              />
            )}
          />
        </ButtonGroup>
      </div>
    </FieldSet>
  )
}
