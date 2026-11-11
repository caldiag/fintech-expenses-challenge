import { PermissionKey } from "@app/types"
import { IconCheck, IconChevronDown } from "@tabler/icons-react"
import { useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { usePaginatedContacts } from "~/hooks/use-paginated-contacts"
import { Button } from "../ui/button"
import { DialogContent, DialogHeader, DialogTitle } from "../ui/dialog"
import { FieldGroup, FieldLabel, FieldSet } from "../ui/field"
import { Input } from "../ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { useRecordForm } from "./hooks/use-record-form"
import { RecordFormFooter } from "./utils/record-form-footer"

type CompanyFormValues = {
  name: string
  websiteUrl: string
  areaCode: string
  email: string
  phone: string
  contactIds: string[]
}

type CompanyRecord = {
  name: string
  websiteUrl: string
  areaCode: string | null
  email: string | null
  phone: string | null
  contacts: { id: string }[]
  createdBy?: { id?: string; role?: { id?: string } | null } | null
  role?: { id?: string } | null
}

function mapCompanyRecord(data: CompanyRecord): CompanyFormValues {
  return {
    name: data.name,
    websiteUrl: data.websiteUrl,
    areaCode: data.areaCode ?? "",
    email: data.email ?? "",
    phone: data.phone ?? "",
    contactIds: data.contacts.map((contact: { id: string }) => contact.id),
  }
}

export default function CreateCompanyContent({
  onCreated,
  recordId,
}: {
  onCreated: () => void
  recordId?: string
}) {
  const { handleSubmit, register, reset, setValue, watch } =
    useForm<CompanyFormValues>({
      defaultValues: {
        name: "",
        websiteUrl: "",
        areaCode: "",
        email: "",
        phone: "",
        contactIds: [],
      },
    })
  const selectedContactIds = watch("contactIds")
  const [isContactsOpen, setIsContactsOpen] = useState(false)
  const contactsTriggerRef = useRef<HTMLButtonElement>(null)
  const {
    canDelete,
    canEdit,
    deleteRecord,
    error,
    isLoadingRecord,
    isSavingRecord,
    saveRecord,
  } = useRecordForm<CompanyRecord, CompanyFormValues>({
    recordId,
    endpoint: "/company",
    createEndpoint: "/company/create",
    updatePermission: PermissionKey.CompanyUpdateScope,
    deletePermission: PermissionKey.CompanyDeleteScope,
    reset,
    mapRecord: mapCompanyRecord,
    onCreated,
    messages: {
      loadError: "Não foi possível carregar a empresa.",
      saveError: "Não foi possível salvar a empresa.",
      deleteError: "Não foi possível excluir a empresa.",
      deleteConfirm: "Excluir esta empresa?",
      created: "Empresa criada com sucesso.",
      updated: "Empresa atualizada com sucesso.",
      deleted: "Empresa excluída com sucesso.",
    },
  })
  const {
    contacts,
    hasError: hasContactLoadError,
    isLoading: isLoadingContacts,
    loadNextPage: loadNextContactPage,
  } = usePaginatedContacts()
  function handleContactsScroll(event: React.UIEvent<HTMLDivElement>) {
    const { scrollTop, clientHeight, scrollHeight } = event.currentTarget
    if (scrollHeight - scrollTop - clientHeight < 48) {
      void loadNextContactPage()
    }
  }

  function toggleContact(contactId: string) {
    setValue(
      "contactIds",
      selectedContactIds.includes(contactId)
        ? selectedContactIds.filter((id) => id !== contactId)
        : [...selectedContactIds, contactId],
      { shouldDirty: true }
    )
  }

  async function submitCompany(values: CompanyFormValues) {
    await saveRecord({
      name: values.name.trim(),
      websiteUrl: values.websiteUrl.trim(),
      areaCode: values.areaCode.trim() || null,
      email: values.email.trim() || null,
      phone: values.phone.trim() || null,
      contactIds: values.contactIds,
    })
  }

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>
          {recordId ? "Editar empresa" : "Nova empresa"}
        </DialogTitle>
      </DialogHeader>
      <form onSubmit={handleSubmit(submitCompany)}>
        <FieldGroup>
          <FieldSet className="grid grid-cols-1 gap-3">
            <div>
              <FieldLabel htmlFor="company-name">Nome</FieldLabel>
              <Input
                {...register("name", { required: true })}
                id="company-name"
                placeholder="Nome da empresa"
                disabled={!canEdit}
                required
              />
            </div>
            <div>
              <FieldLabel htmlFor="company-website">Site</FieldLabel>
              <Input
                {...register("websiteUrl", { required: true })}
                id="company-website"
                type="url"
                placeholder="https://exemplo.com"
                disabled={!canEdit}
                required
              />
            </div>
          </FieldSet>
          <FieldSet className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <FieldLabel htmlFor="company-area-code">
                Código de área
              </FieldLabel>
              <Input
                {...register("areaCode")}
                id="company-area-code"
                type="tel"
                placeholder="11"
                disabled={!canEdit}
              />
            </div>
            <div>
              <FieldLabel htmlFor="company-phone">Telefone</FieldLabel>
              <Input
                {...register("phone")}
                id="company-phone"
                type="tel"
                placeholder="99999-9999"
                disabled={!canEdit}
              />
            </div>
            <div className="sm:col-span-2">
              <FieldLabel htmlFor="company-email">E-mail</FieldLabel>
              <Input
                {...register("email")}
                id="company-email"
                type="email"
                placeholder="contato@exemplo.com"
                disabled={!canEdit}
              />
            </div>
            <div className="sm:col-span-2">
              <FieldLabel htmlFor="company-contacts">Contatos</FieldLabel>
              <Popover open={isContactsOpen} onOpenChange={setIsContactsOpen}>
                <PopoverTrigger
                  render={
                    <Button
                      ref={contactsTriggerRef}
                      id="company-contacts"
                      type="button"
                      variant="outline"
                      className="w-full justify-between"
                      aria-haspopup="listbox"
                      aria-expanded={isContactsOpen}
                      disabled={!canEdit}
                    >
                      <span className="truncate">
                        {selectedContactIds.length
                          ? `${selectedContactIds.length} contato(s) selecionado(s)`
                          : isLoadingContacts
                            ? "Carregando contatos..."
                            : "Selecione os contatos"}
                      </span>
                      <IconChevronDown />
                    </Button>
                  }
                />
                <PopoverContent
                  anchor={contactsTriggerRef}
                  align="start"
                  className="max-h-64 w-(--anchor-width) gap-1 overflow-y-auto"
                  onScroll={handleContactsScroll}
                >
                  {contacts.length ? (
                    contacts.map((contact) => {
                      const isSelected = selectedContactIds.includes(contact.id)
                      return (
                        <Button
                          key={contact.id}
                          type="button"
                          variant="ghost"
                          className="w-full justify-between"
                          role="option"
                          aria-selected={isSelected}
                          disabled={!canEdit}
                          onClick={() => toggleContact(contact.id)}
                        >
                          {contact.name}
                          {isSelected && <IconCheck />}
                        </Button>
                      )
                    })
                  ) : (
                    <p className="px-2 py-1 text-muted-foreground">
                      {hasContactLoadError
                        ? "Não foi possível carregar os contatos."
                        : isLoadingContacts
                          ? "Carregando contatos..."
                          : "Nenhum contato disponível"}
                    </p>
                  )}
                  {contacts.length > 0 && isLoadingContacts && (
                    <p className="px-2 py-1 text-muted-foreground">
                      Carregando mais contatos...
                    </p>
                  )}
                  {contacts.length > 0 && hasContactLoadError && (
                    <p role="alert" className="px-2 py-1 text-destructive">
                      Não foi possível carregar mais contatos.
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
          loadingMessage="Carregando empresa..."
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
