import { PermissionKey } from "@app/types"
import {
  IconCheck,
  IconChevronDown,
  IconDeviceFloppy,
} from "@tabler/icons-react"
import { useEffect, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import axiosClient from "~/auth/axios-client"
import { useAuthContext } from "~/auth/hooks/useAuthContext"
import { toast } from "~/components/ui/toast"
import { usePaginatedContacts } from "~/hooks/use-paginated-contacts"
import { hasRecordScopeAccess } from "~/lib/utils/record-permissions"
import { Button } from "../ui/button"
import {
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog"
import { FieldGroup, FieldLabel, FieldSet } from "../ui/field"
import { Input } from "../ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"

type CompanyFormValues = {
  name: string
  websiteUrl: string
  areaCode: string
  email: string
  phone: string
  contactIds: string[]
}

export default function CreateCompanyContent({
  onCreated,
  recordId,
}: {
  onCreated: () => void
  recordId?: string
}) {
  const { authContext } = useAuthContext()
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
  const [editingRecord, setEditingRecord] = useState<any>()
  const [isLoadingRecord, setIsLoadingRecord] = useState(Boolean(recordId))
  const [isContactsOpen, setIsContactsOpen] = useState(false)
  const [isSavingCompany, setIsSavingCompany] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const contactsTriggerRef = useRef<HTMLButtonElement>(null)
  const {
    contacts,
    hasError: hasContactLoadError,
    isLoading: isLoadingContacts,
    loadNextPage: loadNextContactPage,
  } = usePaginatedContacts()
  const canEdit =
    !recordId ||
    hasRecordScopeAccess(
      authContext?.permissionSet[PermissionKey.CompanyUpdateScope],
      authContext,
      editingRecord
    )
  const canDelete =
    Boolean(recordId) &&
    hasRecordScopeAccess(
      authContext?.permissionSet[PermissionKey.CompanyDeleteScope],
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
      .get(`/company/${recordId}`)
      .then(({ data }) => {
        if (!active) return
        setEditingRecord(data)
        reset({
          name: data.name,
          websiteUrl: data.websiteUrl,
          areaCode: data.areaCode ?? "",
          email: data.email ?? "",
          phone: data.phone ?? "",
          contactIds: data.contacts.map(
            (contact: { id: string }) => contact.id
          ),
        })
      })
      .catch(() => {
        if (active) setError("Não foi possível carregar a empresa.")
      })
      .finally(() => {
        if (active) setIsLoadingRecord(false)
      })
    return () => {
      active = false
    }
  }, [recordId, reset])

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
    setError(null)
    setIsSavingCompany(true)
    try {
      const payload = {
        name: values.name.trim(),
        websiteUrl: values.websiteUrl.trim(),
        areaCode: values.areaCode.trim() || null,
        email: values.email.trim() || null,
        phone: values.phone.trim() || null,
        contactIds: values.contactIds,
      }
      if (recordId) {
        await axiosClient.patch(`/company/${recordId}`, payload)
      } else {
        await axiosClient.post("/company/create", payload)
      }
      toast.add({
        type: "success",
        title: "Sucesso",
        description: recordId
          ? "Empresa atualizada com sucesso."
          : "Empresa criada com sucesso.",
      })
      onCreated()
    } catch {
      setError("Não foi possível salvar a empresa.")
    } finally {
      setIsSavingCompany(false)
    }
  }

  async function deleteCompany() {
    if (!recordId || !window.confirm("Excluir esta empresa?")) return
    try {
      await axiosClient.delete(`/company/${recordId}`)
      toast.add({
        type: "success",
        title: "Sucesso",
        description: "Empresa excluída com sucesso.",
      })
      onCreated()
    } catch {
      setError("Não foi possível excluir a empresa.")
    }
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
        <DialogFooter className="mt-4">
          {isLoadingRecord && <span>Carregando empresa...</span>}
          {canDelete && (
            <Button type="button" variant="destructive" onClick={deleteCompany}>
              Excluir
            </Button>
          )}
          {canEdit && (
            <Button type="submit" disabled={isSavingCompany || isLoadingRecord}>
              <IconDeviceFloppy />
              {isSavingCompany
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
