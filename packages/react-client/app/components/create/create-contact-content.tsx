import { PermissionKey } from "@app/types"
import {
  IconBuilding,
  IconCheck,
  IconChevronDown,
  IconDeviceFloppy,
} from "@tabler/icons-react"
import { useEffect, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import axiosClient from "~/auth/axios-client"
import { useAuthContext } from "~/auth/hooks/useAuthContext"
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar"
import { toast } from "~/components/ui/toast"
import { usePaginatedCompanies } from "~/hooks/use-paginated-companies"
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

type ContactFormValues = {
  name: string
  avatarUrl: string
  email: string
  phone: string
  companyIds: string[]
}

export default function CreateContactContent({
  onCreated,
  recordId,
}: {
  onCreated: () => void
  recordId?: string
}) {
  const { authContext } = useAuthContext()
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
  const [editingRecord, setEditingRecord] = useState<any>()
  const [isLoadingRecord, setIsLoadingRecord] = useState(Boolean(recordId))
  const [isCompaniesOpen, setIsCompaniesOpen] = useState(false)
  const [isSavingContact, setIsSavingContact] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const companiesTriggerRef = useRef<HTMLButtonElement>(null)
  const {
    companies,
    hasError: hasCompanyLoadError,
    isLoading: isLoadingCompanies,
    loadNextPage: loadNextCompanyPage,
  } = usePaginatedCompanies()
  const canEdit =
    !recordId ||
    hasRecordScopeAccess(
      authContext?.permissionSet[PermissionKey.ContactUpdateScope],
      authContext,
      editingRecord
    )
  const canDelete =
    Boolean(recordId) &&
    hasRecordScopeAccess(
      authContext?.permissionSet[PermissionKey.ContactDeleteScope],
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
      .get(`/contact/${recordId}`)
      .then(({ data }) => {
        if (!active) return
        setEditingRecord(data)
        reset({
          name: data.name,
          avatarUrl: data.avatarUrl ?? "",
          email: data.email,
          phone: data.phone ?? "",
          companyIds: data.companies.map(
            (company: { id: string }) => company.id
          ),
        })
      })
      .catch(() => {
        if (active) setError("Não foi possível carregar o contato.")
      })
      .finally(() => {
        if (active) setIsLoadingRecord(false)
      })
    return () => {
      active = false
    }
  }, [recordId, reset])

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
    setError(null)
    setIsSavingContact(true)
    try {
      const payload = {
        name: values.name.trim(),
        avatarUrl: values.avatarUrl.trim() || null,
        email: values.email.trim(),
        phone: values.phone.trim() || null,
        companyIds: values.companyIds,
      }
      if (recordId) {
        await axiosClient.patch(`/contact/${recordId}`, payload)
      } else {
        await axiosClient.post("/contact/create", payload)
      }
      toast.add({
        type: "success",
        title: "Sucesso",
        description: recordId
          ? "Contato atualizado com sucesso."
          : "Contato criado com sucesso.",
      })
      onCreated()
    } catch {
      setError("Não foi possível salvar o contato.")
    } finally {
      setIsSavingContact(false)
    }
  }

  async function deleteContact() {
    if (!recordId || !window.confirm("Excluir este contato?")) return
    try {
      await axiosClient.delete(`/contact/${recordId}`)
      toast.add({
        type: "success",
        title: "Sucesso",
        description: "Contato excluído com sucesso.",
      })
      onCreated()
    } catch {
      setError("Não foi possível excluir o contato.")
    }
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
        <DialogFooter className="mt-4">
          {isLoadingRecord && <span>Carregando contato...</span>}
          {canDelete && (
            <Button type="button" variant="destructive" onClick={deleteContact}>
              Excluir
            </Button>
          )}
          {canEdit && (
            <Button type="submit" disabled={isSavingContact || isLoadingRecord}>
              <IconDeviceFloppy />
              {isSavingContact
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
