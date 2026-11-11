import { Currency, TransactionDirection } from "@app/types"

export type TransactionCategory = {
  id: string
  name: string
  icon: string
}

export type TransactionRole = {
  id: string
  name: string
  icon: string
}

export type TransactionFormValues = {
  currency: Currency
  transactionDirection: TransactionDirection
  amountDigits: string
  description: string
  transactionCategoryId: string
  roleId: string
  companyId: string
}

type TransactionRecord = {
  currency: Currency
  transactionDirection: TransactionDirection
  amount: number
  amountCents: number
  description: string
  transactionCategory: { id: string }
  role: { id: string }
  company: { id: string }
}

export const ADD_CATEGORY_VALUE = "__add-category__"

export const CATEGORY_ICON_OPTIONS = [
  { name: "IconTag", label: "Tag" },
  { name: "IconUser", label: "Pessoa" },
  { name: "IconHome", label: "Casa" },
  { name: "IconCar", label: "Carro" },
  { name: "IconShoppingBag", label: "Compras" },
  { name: "IconToolsKitchen2", label: "Alimentação" },
  { name: "IconBriefcase", label: "Trabalho" },
  { name: "IconDeviceMobile", label: "Tecnologia" },
  { name: "IconPlane", label: "Viagem" },
] as const

export type CategoryIconName = (typeof CATEGORY_ICON_OPTIONS)[number]["name"]

export function mapTransactionRecord(
  data: TransactionRecord
): TransactionFormValues {
  return {
    currency: data.currency,
    transactionDirection: data.transactionDirection,
    amountDigits: String(data.amount * 100 + data.amountCents),
    description: data.description,
    transactionCategoryId: data.transactionCategory.id,
    roleId: data.role.id,
    companyId: data.company.id,
  }
}

export function toTransactionPayload(values: TransactionFormValues) {
  const totalCents = Number.parseInt(values.amountDigits, 10)
  return {
    description: values.description.trim(),
    amount: Math.floor(totalCents / 100),
    amountCents: totalCents % 100,
    currency: values.currency,
    transactionDirection: values.transactionDirection,
    transactionCategoryId: values.transactionCategoryId,
    roleId: values.roleId,
    companyId: values.companyId,
  }
}
