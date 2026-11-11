import { Currency, PermissionKey, TransactionDirection } from "@app/types"
import { Select } from "@base-ui/react/select"
import { IconBuilding, IconChevronDown } from "@tabler/icons-react"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import axiosClient from "~/auth/axios-client"
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar"
import { usePaginatedCompanies } from "~/hooks/use-paginated-companies"
import { getTablerIcon } from "~/lib/utils/tabler-icons"
import { DialogContent, DialogHeader, DialogTitle } from "../ui/dialog"
import { FieldGroup, FieldLabel, FieldSet } from "../ui/field"
import { Textarea } from "../ui/textarea"
import { useRecordForm } from "./hooks/use-record-form"
import { TransactionAmountField } from "./transaction-amount-field"
import { TransactionCategoryField } from "./transaction-category-field"
import { RecordFormFooter } from "./utils/record-form-footer"
import {
  mapTransactionRecord,
  toTransactionPayload,
  type TransactionFormValues,
  type TransactionRole,
} from "./utils/transaction-form"

export default function CreateTransactionContent({
  onCreated,
  recordId,
}: {
  onCreated: () => void
  recordId?: string
}) {
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
  const {
    canDelete,
    canEdit,
    deleteRecord,
    error,
    isLoadingRecord,
    isSavingRecord,
    saveRecord,
    setError,
  } = useRecordForm({
    recordId,
    endpoint: "/transaction",
    createEndpoint: "/transaction/create",
    updatePermission: PermissionKey.TransactionUpdateScope,
    deletePermission: PermissionKey.TransactionDeleteScope,
    reset,
    mapRecord: mapTransactionRecord,
    onCreated,
    messages: {
      loadError: "Não foi possível carregar a transação.",
      saveError: "Não foi possível salvar a transação.",
      deleteError: "Não foi possível excluir a transação.",
      deleteConfirm: "Excluir esta transação?",
      created: "Transação criada com sucesso.",
      updated: "Transação atualizada com sucesso.",
      deleted: "Transação excluída com sucesso.",
    },
  })
  const currency = watch("currency")
  const transactionDirection = watch("transactionDirection")
  const amountDigits = watch("amountDigits")
  const selectedCategoryId = watch("transactionCategoryId")
  const selectedRoleId = watch("roleId")
  const selectedCompanyId = watch("companyId")
  const [roles, setRoles] = useState<TransactionRole[]>([])
  const {
    companies,
    hasError: hasCompanyLoadError,
    isLoading: isLoadingCompanies,
    loadNextPage: loadNextCompanyPage,
  } = usePaginatedCompanies()
  const [isLoadingCategories, setIsLoadingCategories] = useState(true)
  const [isLoadingRoles, setIsLoadingRoles] = useState(true)
  const selectedRole = roles.find((role) => role.id === selectedRoleId)
  const selectedCompany = companies.find(
    (company) => company.id === selectedCompanyId
  )
  useEffect(() => {
    let active = true

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

    void loadRoles()

    return () => {
      active = false
    }
  }, [setError])

  function handleCompaniesScroll(event: React.UIEvent<HTMLDivElement>) {
    const { scrollTop, clientHeight, scrollHeight } = event.currentTarget
    if (scrollHeight - scrollTop - clientHeight < 48) {
      void loadNextCompanyPage()
    }
  }

  async function submitTransaction(values: TransactionFormValues) {
    const totalCents = Number.parseInt(values.amountDigits, 10)
    if (!Number.isFinite(totalCents) || totalCents <= 0) {
      setError("Informe um valor válido.")
      return
    }

    setError(null)
    await saveRecord(toTransactionPayload(values))
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
          <TransactionAmountField
            control={control}
            currency={currency}
            amountDigits={amountDigits}
            setValue={setValue}
            canEdit={canEdit}
          />
          <TransactionCategoryField
            value={selectedCategoryId}
            onChange={(value) =>
              setValue("transactionCategoryId", value, { shouldDirty: true })
            }
            canEdit={canEdit}
            isLoading={isLoadingCategories}
            setError={setError}
            setLoading={setIsLoadingCategories}
          />
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
        <RecordFormFooter
          loadingMessage="Carregando transação..."
          isLoadingRecord={isLoadingRecord}
          canDelete={canDelete}
          onDelete={deleteRecord}
          canEdit={canEdit}
          isSaving={isSavingRecord}
          isSubmitDisabled={isLoadingCategories || isLoadingRecord}
          recordId={recordId}
        />
      </form>
    </DialogContent>
  )
}
