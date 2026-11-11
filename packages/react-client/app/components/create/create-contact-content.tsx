import {
  IconBuilding,
  IconCheck,
  IconChevronDown,
  IconDeviceFloppy,
} from "@tabler/icons-react"
import { useRef, useState } from "react"
import axiosClient from "~/auth/axios-client"
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar"
import { toast } from "~/components/ui/toast"
import { usePaginatedCompanies } from "~/hooks/use-paginated-companies"
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

export default function CreateContactContent({
  onCreated,
}: {
  onCreated: () => void
}) {
  const [name, setName] = useState("")
  const [avatarUrl, setAvatarUrl] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [selectedCompanyIds, setSelectedCompanyIds] = useState<string[]>([])
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

  function toggleCompany(companyId: string) {
    setSelectedCompanyIds((current) =>
      current.includes(companyId)
        ? current.filter((id) => id !== companyId)
        : [...current, companyId]
    )
  }

  function handleCompaniesScroll(event: React.UIEvent<HTMLDivElement>) {
    const { scrollTop, clientHeight, scrollHeight } = event.currentTarget
    if (scrollHeight - scrollTop - clientHeight < 48) {
      void loadNextCompanyPage()
    }
  }

  async function submitContact(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setIsSavingContact(true)
    try {
      await axiosClient.post("/contact/create", {
        name: name.trim(),
        avatarUrl: avatarUrl.trim() || null,
        email: email.trim(),
        phone: phone.trim() || null,
        companyIds: selectedCompanyIds,
      })
      toast.add({
        type: "success",
        title: "Sucesso",
        description: "Contato criado com sucesso.",
      })
      onCreated()
    } catch {
      setError("Não foi possível salvar o contato.")
    } finally {
      setIsSavingContact(false)
    }
  }

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Novo contato</DialogTitle>
      </DialogHeader>
      <form onSubmit={submitContact}>
        <FieldGroup>
          <FieldSet className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <FieldLabel htmlFor="contact-name">Nome</FieldLabel>
              <Input
                id="contact-name"
                placeholder="Nome do contato"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
              />
            </div>
            <div>
              <FieldLabel htmlFor="contact-email">E-mail</FieldLabel>
              <Input
                id="contact-email"
                type="email"
                placeholder="contato@exemplo.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </div>
            <div>
              <FieldLabel htmlFor="contact-phone">Telefone</FieldLabel>
              <Input
                id="contact-phone"
                type="tel"
                placeholder="(11) 99999-9999"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
              />
            </div>
            <div className="sm:col-span-2">
              <FieldLabel htmlFor="contact-avatar-url">
                URL do avatar
              </FieldLabel>
              <Input
                id="contact-avatar-url"
                type="url"
                placeholder="https://exemplo.com/avatar.jpg"
                value={avatarUrl}
                onChange={(event) => setAvatarUrl(event.target.value)}
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
          <Button type="submit" disabled={isSavingContact}>
            <IconDeviceFloppy />
            {isSavingContact ? "Salvando..." : "Salvar"}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  )
}
