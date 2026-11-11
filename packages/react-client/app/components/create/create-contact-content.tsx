import { PermissionKey } from "@app/types"
import { IconBuilding, IconCheck, IconChevronDown } from "@tabler/icons-react"
import { useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar"
import { usePaginatedCompanies } from "~/hooks/use-paginated-companies"
import { Button } from "../ui/button"
import { DialogContent, DialogHeader, DialogTitle } from "../ui/dialog"
import { FieldGroup, FieldLabel, FieldSet } from "../ui/field"
import { Input } from "../ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { useRecordForm } from "./hooks/use-record-form"
import { RecordFormFooter } from "./utils/record-form-footer"

type ContactFormValues = {
  name: string
  avatarUrl: string
  email: string
  phone: string
  companyIds: string[]
}

function mapContactRecord(data: any): ContactFormValues {
  return {
    name: data.name,
    avatarUrl: data.avatarUrl ?? "",
    email: data.email,
    phone: data.phone ?? "",
    companyIds: data.companies.map((company: { id: string }) => company.id),
  }
}

export default function CreateContactContent({
  onCreated,
  recordId,
}: {
  onCreated: () => void
  recordId?: string
}) {
  const { handleSubmit, register, reset, setValue, watch } =
    useForm<ContactFormValues>({
      defaultValues: {
        name: "",
        avatarUrl: "",
        email: "",
        phone: "",
        companyIds: [],
      },
    })
  const selectedCompanyIds = watch("companyIds")
  const [isCompaniesOpen, setIsCompaniesOpen] = useState(false)
  const companiesTriggerRef = useRef<HTMLButtonElement>(null)
  const {
    canDelete,
    canEdit,
    deleteRecord,
    error,
    isLoadingRecord,
    isSavingRecord,
    saveRecord,
  } = useRecordForm({
    recordId,
    endpoint: "/contact",
    createEndpoint: "/contact/create",
    updatePermission: PermissionKey.ContactUpdateScope,
    deletePermission: PermissionKey.ContactDeleteScope,
    reset,
    mapRecord: mapContactRecord,
    onCreated,
    messages: {
      loadError: "Não foi possível carregar o contato.",
      saveError: "Não foi possível salvar o contato.",
      deleteError: "Não foi possível excluir o contato.",
      deleteConfirm: "Excluir este contato?",
      created: "Contato criado com sucesso.",
      updated: "Contato atualizado com sucesso.",
      deleted: "Contato excluído com sucesso.",
    },
  })
  const {
    companies,
    hasError: hasCompanyLoadError,
    isLoading: isLoadingCompanies,
    loadNextPage: loadNextCompanyPage,
  } = usePaginatedCompanies()
  function toggleCompany(companyId: string) {
    setValue(
      "companyIds",
      selectedCompanyIds.includes(companyId)
        ? selectedCompanyIds.filter((id) => id !== companyId)
        : [...selectedCompanyIds, companyId],
      { shouldDirty: true }
    )
  }

  function handleCompaniesScroll(event: React.UIEvent<HTMLDivElement>) {
    const { scrollTop, clientHeight, scrollHeight } = event.currentTarget
    if (scrollHeight - scrollTop - clientHeight < 48) {
      void loadNextCompanyPage()
    }
  }

  async function submitContact(values: ContactFormValues) {
    await saveRecord({
      name: values.name.trim(),
      avatarUrl: values.avatarUrl.trim() || null,
      email: values.email.trim(),
      phone: values.phone.trim() || null,
      companyIds: values.companyIds,
    })
  }

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>
          {recordId ? "Editar contato" : "Novo contato"}
        </DialogTitle>
      </DialogHeader>
      <form onSubmit={handleSubmit(submitContact)}>
        <FieldGroup>
          <FieldSet className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <FieldLabel htmlFor="contact-name">Nome</FieldLabel>
              <Input
                {...register("name", { required: true })}
                id="contact-name"
                placeholder="Nome do contato"
                disabled={!canEdit}
                required
              />
            </div>
            <div>
              <FieldLabel htmlFor="contact-email">E-mail</FieldLabel>
              <Input
                {...register("email", { required: true })}
                id="contact-email"
                type="email"
                placeholder="contato@exemplo.com"
                disabled={!canEdit}
                required
              />
            </div>
            <div>
              <FieldLabel htmlFor="contact-phone">Telefone</FieldLabel>
              <Input
                {...register("phone")}
                id="contact-phone"
                type="tel"
                placeholder="(11) 99999-9999"
                disabled={!canEdit}
              />
            </div>
            <div className="sm:col-span-2">
              <FieldLabel htmlFor="contact-avatar-url">
                URL do avatar
              </FieldLabel>
              <Input
                {...register("avatarUrl")}
                id="contact-avatar-url"
                type="url"
                placeholder="https://exemplo.com/avatar.jpg"
                disabled={!canEdit}
              />
            </div>
            <div className="sm:col-span-2">
              <FieldLabel htmlFor="contact-companies">Empresas</FieldLabel>
              <Popover open={isCompaniesOpen} onOpenChange={setIsCompaniesOpen}>
                <PopoverTrigger
                  render={
                    <Button
                      ref={companiesTriggerRef}
                      id="contact-companies"
                      type="button"
                      variant="outline"
                      className="w-full justify-between"
                      aria-haspopup="listbox"
                      aria-expanded={isCompaniesOpen}
                      disabled={!canEdit}
                    >
                      <span className="truncate">
                        {selectedCompanyIds.length
                          ? `${selectedCompanyIds.length} empresa(s) selecionada(s)`
                          : isLoadingCompanies
                            ? "Carregando empresas..."
                            : "Selecione as empresas"}
                      </span>
                      <IconChevronDown />
                    </Button>
                  }
                />
                <PopoverContent
                  anchor={companiesTriggerRef}
                  align="start"
                  className="max-h-64 w-(--anchor-width) gap-1 overflow-y-auto"
                  onScroll={handleCompaniesScroll}
                >
                  {companies.length ? (
                    companies.map((company) => {
                      const isSelected = selectedCompanyIds.includes(company.id)
                      return (
                        <Button
                          key={company.id}
                          type="button"
                          variant="ghost"
                          className="w-full justify-between"
                          role="option"
                          aria-selected={isSelected}
                          disabled={!canEdit}
                          onClick={() => toggleCompany(company.id)}
                        >
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
                          {isSelected && <IconCheck />}
                        </Button>
                      )
                    })
                  ) : (
                    <p className="px-2 py-1 text-muted-foreground">
                      {hasCompanyLoadError
                        ? "Não foi possível carregar as empresas."
                        : isLoadingCompanies
                          ? "Carregando empresas..."
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
                </PopoverContent>
              </Popover>
            </div>
          </FieldSet>
          {error && (
            <p role="alert" className="text-destructive">
              {error}
            </p>
          )}
        </FieldGroup>
        <RecordFormFooter
          loadingMessage="Carregando contato..."
          isLoadingRecord={isLoadingRecord}
          canDelete={canDelete}
          onDelete={deleteRecord}
          canEdit={canEdit}
          isSaving={isSavingRecord}
          isSubmitDisabled={isLoadingRecord}
          recordId={recordId}
        />
      </form>
    </DialogContent>
  )
}
