import { Currency } from "@app/types"

export const currencies = Object.values(Currency)

const currencyNames = new Intl.DisplayNames(["pt-BR"], { type: "currency" })

export function getCurrencyName(currency: Currency) {
  return currencyNames.of(currency) ?? currency
}

export function getCurrencySymbol(currency: Currency) {
  return (
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency,
      currencyDisplay: "narrowSymbol",
    })
      .formatToParts(0)
      .find((part) => part.type === "currency")?.value ?? currency
  )
}

function getFractionDigits(currency: Currency) {
  return (
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency,
    }).resolvedOptions().maximumFractionDigits ?? 2
  )
}

export function formatCurrencyAmount(amountDigits: string, currency: Currency) {
  const fractionDigits = getFractionDigits(currency)
  const amount = Number(amountDigits || "0") / 10 ** fractionDigits

  return new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(amount)
}

export function convertCurrencyAmount(
  amountDigits: string,
  currentCurrency: Currency,
  nextCurrency: Currency
) {
  const currentAmount =
    Number(amountDigits || "0") / 10 ** getFractionDigits(currentCurrency)
  const nextAmountDigits = Math.round(
    currentAmount * 10 ** getFractionDigits(nextCurrency)
  )

  return String(nextAmountDigits)
}

export function normalizeAmountDigits(value: string) {
  return value
    .replace(/\D/g, "")
    .slice(0, 15)
    .replace(/^0+(?=\d)/, "")
}
