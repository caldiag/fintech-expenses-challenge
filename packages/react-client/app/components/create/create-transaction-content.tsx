import { Currency, PermissionKey, TransactionDirection } from "@app/types"
import { Select } from "@base-ui/react/select"
import {
  IconBuilding,
  IconChevronDown,
  IconDeviceFloppy,
  IconPlus,
} from "@tabler/icons-react"
import { useEffect, useRef, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import axiosClient from "~/auth/axios-client"
import { useAuthContext } from "~/auth/hooks/useAuthContext"
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar"
import { toast } from "~/components/ui/toast"
import { usePaginatedCompanies } from "~/hooks/use-paginated-companies"
import {
  convertCurrencyAmount,
  currencies,
  formatCurrencyAmount,
  getCurrencyName,
  getCurrencySymbol,
  normalizeAmountDigits,
} from "~/lib/utils/currency"
import { hasRecordScopeAccess } from "~/lib/utils/record-permissions"
import { getTablerIcon } from "~/lib/utils/tabler-icons"
import { Button } from "../ui/button"
import { ButtonGroup } from "../ui/button-group"
import {
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog"
import { FieldGroup, FieldLabel, FieldSet } from "../ui/field"
import { Input } from "../ui/input"
import { Popover, PopoverContent, PopoverTitle } from "../ui/popover"
import { Textarea } from "../ui/textarea"

type TransactionCategory = {
  id: string
  name: string
  icon: string
}

type TransactionRole = {
  id: string
  name: string
  icon: string
}

type TransactionFormValues = {
  currency: Currency
  transactionDirection: TransactionDirection
  amountDigits: string
  description: string
  transactionCategoryId: string
  roleId: string
  companyId: string
}

const ADD_CATEGORY_VALUE = "__add-category__"

const CATEGORY_ICON_OPTIONS = [
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

type CategoryIconName = (typeof CATEGORY_ICON_OPTIONS)[number]["name"]

export default function CreateTransactionContent({
  onCreated,
  recordId,
}: {
  onCreated: () => void
  recordId?: string
}) {
  const { authContext } = useAuthContext()
  const { control, handleSubmit, register, reset, setValue, watch } =
    useForm<TransactionFormValues>({
      defaultValues: {
        currency: Currency.BRL,
        transactionDirection: TransactionDirection.Outbound,
        amountDigits: "",
        description: "",
        transactionCategoryId: "",
        roleId: "",
        companyId: "",
      },
    })
  const currency = watch("currency")
  const transactionDirection = watch("transactionDirection")
  const amountDigits = watch("amountDigits")
  const selectedCategoryId = watch("transactionCategoryId")
  const selectedRoleId = watch("roleId")
  const selectedCompanyId = watch("companyId")
  const [editingRecord, setEditingRecord] = useState<any>()
  const [isLoadingRecord, setIsLoadingRecord] = useState(Boolean(recordId))
  const [categories, setCategories] = useState<TransactionCategory[]>([])
  const [roles, setRoles] = useState<TransactionRole[]>([])
  const {
    companies,
    hasError: hasCompanyLoadError,
    isLoading: isLoadingCompanies,
    loadNextPage: loadNextCompanyPage,
  } = usePaginatedCompanies()
  const [isLoadingCategories, setIsLoadingCategories] = useState(true)
  const [isLoadingRoles, setIsLoadingRoles] = useState(true)
  const [isCategoryPopoverOpen, setIsCategoryPopoverOpen] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState("")
  const [newCategoryIcon, setNewCategoryIcon] =
    useState<CategoryIconName>("IconTag")
  const [isCreatingCategory, setIsCreatingCategory] = useState(false)
  const [isSavingTransaction, setIsSavingTransaction] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const amountInputRef = useRef<HTMLInputElement>(null)
  const categorySelectTriggerRef = useRef<HTMLButtonElement>(null)
  const formattedAmount = formatCurrencyAmount(amountDigits, currency)
  const selectedCategory = categories.find(
    (category) => category.id === selectedCategoryId
  )
  const selectedRole = roles.find((role) => role.id === selectedRoleId)
  const selectedCompany = companies.find(
    (company) => company.id === selectedCompanyId
  )
  const canEdit =
    !recordId ||
    hasRecordScopeAccess(
      authContext?.permissionSet[PermissionKey.TransactionUpdateScope],
      authContext,
      editingRecord
    )
  const canDelete =
    Boolean(recordId) &&
    hasRecordScopeAccess(
      authContext?.permissionSet[PermissionKey.TransactionDeleteScope],
      authContext,
      editingRecord
    )

  useEffect(() => {
    if (!recordId) return
    let active = true
    setEditingRecord(undefined)
    setError(null)
    setIsLoadingRecord(true)
    axiosClient
      .get(`/transaction/${recordId}`)
      .then(({ data }) => {
        if (!active) return
        setEditingRecord(data)
        reset({
          currency: data.currency,
          transactionDirection: data.transactionDirection,
          amountDigits: String(data.amount * 100 + data.amountCents),
          description: data.description,
          transactionCategoryId: data.transactionCategory.id,
          roleId: data.role.id,
          companyId: data.company.id,
        })
      })
      .catch(() => {
        if (active) setError("Não foi possível carregar a transação.")
      })
      .finally(() => {
        if (active) setIsLoadingRecord(false)
      })
    return () => {
      active = false
    }
  }, [recordId, reset])

  useEffect(() => {
    let active = true

    async function loadCategories() {
      try {
        const response = await axiosClient.get<TransactionCategory[]>(
          "/transaction/category/all"
        )
        if (active) setCategories(response.data)
      } catch {
        if (active) setError("Não foi possível carregar as categorias.")
      } finally {
        if (active) setIsLoadingCategories(false)
      }
    }

    async function loadRoles() {
      try {
        const response = await axiosClient.get<TransactionRole[]>("/role/all")
        if (active) setRoles(response.data)
      } catch {
        if (active) setError("Não foi possível carregar os setores.")
      } finally {
        if (active) setIsLoadingRoles(false)
      }
    }

    void loadCategories()
    void loadRoles()

    return () => {
      active = false
    }
  }, [])

  function handleCompaniesScroll(event: React.UIEvent<HTMLDivElement>) {
    const { scrollTop, clientHeight, scrollHeight } = event.currentTarget
    if (scrollHeight - scrollTop - clientHeight < 48) {
      void loadNextCompanyPage()
    }
  }

  async function createCategory() {
    const name = newCategoryName.trim()
    if (!name) {
      setError("Informe o nome da categoria.")
      return
    }

    setError(null)
    setIsCreatingCategory(true)
    try {
      const response = await axiosClient.post<TransactionCategory>(
        "/transaction/category/create",
        { name, icon: newCategoryIcon }
      )
      const category = response.data
      setCategories((current) => [...current, category])
      setValue("transactionCategoryId", category.id, { shouldDirty: true })
      setNewCategoryName("")
      setIsCategoryPopoverOpen(false)
      toast.add({
        type: "success",
        title: "Sucesso",
        description: "Categoria criada com sucesso.",
      })
    } catch {
      setError("Não foi possível criar a categoria.")
    } finally {
      setIsCreatingCategory(false)
    }
  }

  async function submitTransaction(values: TransactionFormValues) {
    const totalCents = Number.parseInt(values.amountDigits, 10)
    if (!Number.isFinite(totalCents) || totalCents <= 0) {
      setError("Informe um valor válido.")
      return
    }

    setError(null)
    setIsSavingTransaction(true)
    try {
      const payload = {
        description: values.description.trim(),
        amount: Math.floor(totalCents / 100),
        amountCents: totalCents % 100,
        currency: values.currency,
        transactionDirection: values.transactionDirection,
        transactionCategoryId: values.transactionCategoryId,
        roleId: values.roleId,
        companyId: values.companyId,
      }
      if (recordId) {
        await axiosClient.patch(`/transaction/${recordId}`, payload)
      } else {
        await axiosClient.post("/transaction/create", payload)
      }
      toast.add({
        type: "success",
        title: "Sucesso",
        description: recordId
          ? "Transação atualizada com sucesso."
          : "Transação criada com sucesso.",
      })
      onCreated()
    } catch {
      setError("Não foi possível salvar a transação.")
    } finally {
      setIsSavingTransaction(false)
    }
  }

  async function deleteTransaction() {
    if (!recordId || !window.confirm("Excluir esta transação?")) return
    try {
      await axiosClient.delete(`/transaction/${recordId}`)
      toast.add({
        type: "success",
        title: "Sucesso",
        description: "Transação excluída com sucesso.",
      })
      onCreated()
    } catch {
      setError("Não foi possível excluir a transação.")
    }
  }

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>
          {recordId ? "Editar transação" : "Nova transação"}
        </DialogTitle>
      </DialogHeader>
      <form onSubmit={handleSubmit(submitTransaction)}>
        <FieldGroup>
          <FieldSet className="grid grid-cols-1 gap-3">
            <div>
              <FieldLabel htmlFor="transaction-company">Empresa</FieldLabel>
              <Select.Root
                value={selectedCompanyId || null}
                onValueChange={(value) => {
                  setValue("companyId", value ?? "", { shouldDirty: true })
                  setError(null)
                }}
              >
                <Select.Trigger
                  id="transaction-company"
                  disabled={!canEdit}
                  className="flex h-8 w-full items-center justify-between gap-2 rounded-md border border-input bg-input/20 px-2 text-xs outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30"
                >
                  <Select.Value className="min-w-0 flex-1 text-left">
                    {selectedCompany ? (
                      <span className="flex min-w-0 items-center gap-2">
                        <Avatar className="size-4 shrink-0 rounded-none after:hidden">
                          <AvatarImage
                            src={
                              "https://" +
                              selectedCompany.websiteUrl
                                .replace("https://", "")
                                .replace("http://", "") +
                              "/favicon.ico"
                            }
                            className="rounded-none"
                          />
                          <AvatarFallback className="rounded-none text-sm">
                            <IconBuilding />
                          </AvatarFallback>
                        </Avatar>
                        <span className="truncate">{selectedCompany.name}</span>
                      </span>
                    ) : isLoadingCompanies ? (
                      "Carregando empresas..."
                    ) : (
                      "Selecione uma empresa"
                    )}
                  </Select.Value>
                  <Select.Icon>
                    <IconChevronDown className="size-3" />
                  </Select.Icon>
                </Select.Trigger>
                <Select.Portal>
                  <Select.Positioner
                    sideOffset={4}
                    className="z-50 outline-none"
                  >
                    <Select.Popup
                      className="max-h-(--available-height) min-w-56 overflow-y-auto rounded-md border bg-popover p-1 text-popover-foreground shadow-md"
                      onScroll={handleCompaniesScroll}
                    >
                      <Select.List>
                        {companies.map((company) => (
                          <Select.Item
                            key={company.id}
                            value={company.id}
                            className="flex min-h-8 cursor-default items-center rounded-sm px-2 py-1 text-xs outline-none data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground"
                          >
                            <Select.ItemText>
                              <span className="flex min-w-0 items-center gap-2">
                                <Avatar className="size-4 shrink-0 rounded-none after:hidden">
                                  <AvatarImage
                                    src={
                                      "https://" +
                                      company.websiteUrl
                                        .replace("https://", "")
                                        .replace("http://", "") +
                                      "/favicon.ico"
                                    }
                                    className="rounded-none"
                                  />
                                  <AvatarFallback className="rounded-none text-sm">
                                    <IconBuilding />
                                  </AvatarFallback>
                                </Avatar>
                                <span className="truncate">{company.name}</span>
                              </span>
                            </Select.ItemText>
                          </Select.Item>
                        ))}
                      </Select.List>
                      {!companies.length && !isLoadingCompanies && (
                        <p className="px-2 py-1 text-muted-foreground">
                          {hasCompanyLoadError
                            ? "Não foi possível carregar as empresas."
                            : "Nenhuma empresa cadastrada"}
                        </p>
                      )}
                      {companies.length > 0 && isLoadingCompanies && (
                        <p className="px-2 py-1 text-muted-foreground">
                          Carregando mais empresas...
                        </p>
                      )}
                      {companies.length > 0 && hasCompanyLoadError && (
                        <p role="alert" className="px-2 py-1 text-destructive">
                          Não foi possível carregar mais empresas.
                        </p>
                      )}
                    </Select.Popup>
                  </Select.Positioner>
                </Select.Portal>
              </Select.Root>
            </div>
          </FieldSet>
          <FieldSet className="grid grid-cols-1 gap-3">
            <div>
              <FieldLabel htmlFor="transaction-description">
                Descrição
              </FieldLabel>
              <Textarea
                id="transaction-description"
                placeholder="Descrição da transação"
                {...register("description", { required: true })}
                disabled={!canEdit}
                required
              />
            </div>
          </FieldSet>
          <FieldSet className="grid grid-cols-1 gap-3">
            <div>
              <FieldLabel htmlFor="transaction-direction">Tipo</FieldLabel>
              <Select.Root
                value={transactionDirection}
                onValueChange={(value) => {
                  if (value) {
                    setValue(
                      "transactionDirection",
                      value as TransactionDirection,
                      { shouldDirty: true }
                    )
                  }
                }}
              >
                <Select.Trigger
                  id="transaction-direction"
                  disabled={!canEdit}
                  className="flex h-8 w-full items-center justify-between gap-2 rounded-md border border-input bg-input/20 px-2 text-xs outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30"
                >
                  <Select.Value>
                    {transactionDirection === TransactionDirection.Inbound
                      ? "Entrada"
                      : "Saída"}
                  </Select.Value>
                  <Select.Icon>
                    <IconChevronDown className="size-3" />
                  </Select.Icon>
                </Select.Trigger>
                <Select.Portal>
                  <Select.Positioner
                    sideOffset={4}
                    className="z-50 outline-none"
                  >
                    <Select.Popup className="min-w-40 rounded-md border bg-popover p-1 text-popover-foreground shadow-md">
                      <Select.List>
                        <Select.Item
                          value={TransactionDirection.Outbound}
                          className="flex min-h-8 cursor-default items-center rounded-sm px-2 py-1 text-xs outline-none data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground"
                        >
                          <Select.ItemText>Saída</Select.ItemText>
                        </Select.Item>
                        <Select.Item
                          value={TransactionDirection.Inbound}
                          className="flex min-h-8 cursor-default items-center rounded-sm px-2 py-1 text-xs outline-none data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground"
                        >
                          <Select.ItemText>Entrada</Select.ItemText>
                        </Select.Item>
                      </Select.List>
                    </Select.Popup>
                  </Select.Positioner>
                </Select.Portal>
              </Select.Root>
            </div>
          </FieldSet>
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
                      convertCurrencyAmount(
                        amountDigits,
                        currency,
                        nextCurrency
                      ),
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
                <Controller
                  control={control}
                  name="amountDigits"
                  rules={{
                    validate: (value) =>
                      Number.parseInt(value, 10) > 0 ||
                      "Informe um valor válido.",
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
                        field.onChange(
                          normalizeAmountDigits(event.target.value)
                        )
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
          <FieldSet className="grid grid-cols-1 gap-3">
            <div>
              <FieldLabel htmlFor="transaction-category">Categoria</FieldLabel>
              <Select.Root
                value={selectedCategoryId || null}
                onValueChange={(value) => {
                  if (value === ADD_CATEGORY_VALUE) {
                    setIsCategoryPopoverOpen(true)
                    setError(null)
                    return
                  }
                  setValue("transactionCategoryId", value ?? "", {
                    shouldDirty: true,
                  })
                  setError(null)
                }}
              >
                <Select.Trigger
                  ref={categorySelectTriggerRef}
                  id="transaction-category"
                  disabled={!canEdit}
                  className="flex h-8 w-full items-center justify-between gap-2 rounded-md border border-input bg-input/20 px-2 text-left text-xs outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30"
                >
                  <Select.Value className="min-w-0 flex-1 text-left">
                    {selectedCategory ? (
                      <span className="flex min-w-0 items-center gap-2">
                        {(() => {
                          const CategoryIcon = getTablerIcon(
                            selectedCategory.icon
                          )
                          return <CategoryIcon className="size-4 shrink-0" />
                        })()}
                        <span className="truncate">
                          {selectedCategory.name}
                        </span>
                      </span>
                    ) : isLoadingCategories ? (
                      "Carregando categorias..."
                    ) : (
                      "Selecione uma categoria"
                    )}
                  </Select.Value>
                  <Select.Icon>
                    <IconChevronDown className="size-3" />
                  </Select.Icon>
                </Select.Trigger>
                <Select.Portal>
                  <Select.Positioner
                    sideOffset={4}
                    className="z-50 outline-none"
                  >
                    <Select.Popup className="max-h-(--available-height) min-w-56 overflow-y-auto rounded-md border bg-popover p-1 text-popover-foreground shadow-md">
                      <Select.List>
                        <Select.Item
                          value={ADD_CATEGORY_VALUE}
                          disabled={!canEdit}
                          className="flex min-h-8 cursor-default items-center rounded-sm px-2 py-1 text-xs outline-none data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground"
                        >
                          <Select.ItemText>
                            <span className="flex items-center gap-2">
                              <IconPlus className="size-3.5" />
                              Adicionar categoria
                            </span>
                          </Select.ItemText>
                        </Select.Item>
                        {categories.map((category) => {
                          const CategoryIcon = getTablerIcon(category.icon)
                          return (
                            <Select.Item
                              key={category.id}
                              value={category.id}
                              className="flex min-h-8 cursor-default items-center rounded-sm px-2 py-1 text-xs outline-none data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground"
                            >
                              <Select.ItemText>
                                <span className="flex items-center gap-2">
                                  <CategoryIcon className="size-4" />
                                  {category.name}
                                </span>
                              </Select.ItemText>
                            </Select.Item>
                          )
                        })}
                      </Select.List>
                    </Select.Popup>
                  </Select.Positioner>
                </Select.Portal>
              </Select.Root>
              <Popover
                open={isCategoryPopoverOpen}
                onOpenChange={setIsCategoryPopoverOpen}
              >
                <PopoverContent
                  anchor={categorySelectTriggerRef}
                  align="start"
                  className="w-80"
                >
                  <PopoverTitle>Nova categoria</PopoverTitle>
                  <ButtonGroup
                    aria-label="Ícone e nome da categoria"
                    className="w-full"
                  >
                    <Select.Root
                      value={newCategoryIcon}
                      onValueChange={(value) => {
                        if (value) {
                          setNewCategoryIcon(value as CategoryIconName)
                        }
                      }}
                    >
                      <Select.Trigger
                        aria-label="Ícone da categoria"
                        disabled={!canEdit}
                        className="flex h-7 w-12 shrink-0 items-center justify-center gap-1 rounded-md border border-input bg-input/20 px-2 outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30"
                      >
                        {(() => {
                          const SelectedIcon = getTablerIcon(newCategoryIcon)
                          return <SelectedIcon className="size-4" />
                        })()}
                        <Select.Icon>
                          <IconChevronDown className="size-3" />
                        </Select.Icon>
                      </Select.Trigger>
                      <Select.Portal>
                        <Select.Positioner
                          sideOffset={4}
                          className="z-[60] outline-none"
                        >
                          <Select.Popup className="max-h-56 min-w-40 overflow-y-auto rounded-md border bg-popover p-1 text-popover-foreground shadow-md">
                            <Select.List>
                              {CATEGORY_ICON_OPTIONS.map((option) => {
                                const OptionIcon = getTablerIcon(option.name)
                                return (
                                  <Select.Item
                                    key={option.name}
                                    value={option.name}
                                    className="flex min-h-7 cursor-default items-center gap-2 rounded-sm px-2 py-1 text-xs outline-none data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground"
                                  >
                                    <OptionIcon className="size-4" />
                                    <Select.ItemText>
                                      {option.label}
                                    </Select.ItemText>
                                  </Select.Item>
                                )
                              })}
                            </Select.List>
                          </Select.Popup>
                        </Select.Positioner>
                      </Select.Portal>
                    </Select.Root>
                    <Input
                      autoFocus
                      aria-label="Nome da categoria"
                      placeholder="Nome da categoria"
                      value={newCategoryName}
                      disabled={!canEdit}
                      onChange={(event) =>
                        setNewCategoryName(event.target.value)
                      }
                      onKeyDown={(event) => {
                        if (event.key === "Enter") {
                          event.preventDefault()
                          void createCategory()
                        }
                      }}
                    />
                  </ButtonGroup>
                  <Button
                    type="button"
                    className="w-full"
                    disabled={!canEdit || isCreatingCategory}
                    onClick={() => void createCategory()}
                  >
                    <IconPlus />
                    {isCreatingCategory ? "Criando..." : "Criar categoria"}
                  </Button>
                </PopoverContent>
              </Popover>
            </div>
          </FieldSet>
          <FieldSet className="grid grid-cols-1 gap-3">
            <div>
              <FieldLabel htmlFor="transaction-role">Setor</FieldLabel>
              <Select.Root
                value={selectedRoleId}
                onValueChange={(value) => {
                  setValue("roleId", value ?? "", { shouldDirty: true })
                  setError(null)
                }}
              >
                <Select.Trigger
                  id="transaction-role"
                  disabled={!canEdit}
                  className="flex h-8 w-full items-center justify-between gap-2 rounded-md border border-input bg-input/20 px-2 text-xs outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30"
                >
                  <Select.Value className="min-w-0 flex-1 text-left">
                    {selectedRole ? (
                      <span className="flex min-w-0 items-center gap-2">
                        {(() => {
                          const RoleIcon = getTablerIcon(selectedRole.icon)
                          return <RoleIcon className="size-4 shrink-0" />
                        })()}
                        <span className="truncate">{selectedRole.name}</span>
                      </span>
                    ) : isLoadingRoles ? (
                      "Carregando setores..."
                    ) : (
                      "Selecione um setor"
                    )}
                  </Select.Value>
                  <Select.Icon>
                    <IconChevronDown className="size-3" />
                  </Select.Icon>
                </Select.Trigger>
                <Select.Portal>
                  <Select.Positioner
                    sideOffset={4}
                    className="z-50 outline-none"
                  >
                    <Select.Popup className="min-w-48 rounded-md border bg-popover p-2 text-popover-foreground shadow-md">
                      <Select.List>
                        {roles.map((role) => {
                          const RoleIcon = getTablerIcon(role.icon)
                          return (
                            <Select.Item
                              key={role.id}
                              value={role.id}
                              className="flex min-h-8 cursor-default items-center rounded-sm px-2 py-1 text-xs outline-none data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground"
                            >
                              <Select.ItemText>
                                <span className="flex items-center gap-2">
                                  <RoleIcon className="size-4" />
                                  {role.name}
                                </span>
                              </Select.ItemText>
                            </Select.Item>
                          )
                        })}
                      </Select.List>
                      {!roles.length && !isLoadingRoles && (
                        <p className="px-2 py-1 text-muted-foreground">
                          Nenhum setor cadastrado
                        </p>
                      )}
                    </Select.Popup>
                  </Select.Positioner>
                </Select.Portal>
              </Select.Root>
            </div>
          </FieldSet>
          {error && (
            <p role="alert" className="text-destructive">
              {error}
            </p>
          )}
        </FieldGroup>
        <DialogFooter className="mt-4">
          {isLoadingRecord && <span>Carregando transação...</span>}
          {canDelete && (
            <Button
              type="button"
              variant="destructive"
              onClick={deleteTransaction}
            >
              Excluir
            </Button>
          )}
          {canEdit && (
            <Button
              type="submit"
              disabled={
                isSavingTransaction || isLoadingCategories || isLoadingRecord
              }
            >
              <IconDeviceFloppy />
              {isSavingTransaction
                ? "Salvando..."
                : recordId
                  ? "Salvar alterações"
                  : "Salvar"}
            </Button>
          )}
        </DialogFooter>
      </form>
    </DialogContent>
  )
}
