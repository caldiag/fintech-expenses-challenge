import {
  IconCheck,
  IconChevronDown,
  IconDeviceFloppy,
} from "@tabler/icons-react"
import { useEffect, useRef, useState } from "react"
import axiosClient from "~/auth/axios-client"
import { Button } from "../ui/button"
import {
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog"
import { FieldGroup, FieldLabel, FieldSet } from "../ui/field"
import { Input } from "../ui/input"
import { Popover, PopoverContent } from "../ui/popover"

type ContactCompany = {
  id: string
  name: string
}

export default function CreateContactContent({
  onCreated,
}: {
  onCreated: () => void
}) {
  const [name, setName] = useState("")
  const [avatarUrl, setAvatarUrl] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [companies, setCompanies] = useState<ContactCompany[]>([])
  const [selectedCompanyIds, setSelectedCompanyIds] = useState<string[]>([])
  const [isCompaniesOpen, setIsCompaniesOpen] = useState(false)
  const [isLoadingCompanies, setIsLoadingCompanies] = useState(true)
  const [isSavingContact, setIsSavingContact] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const companiesTriggerRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    let active = true

    async function loadCompanies() {
      try {
        const response = await axiosClient.get<ContactCompany[]>("/company/all")
        if (active) setCompanies(response.data)
      } catch {
        if (active) setError("Não foi possível carregar as empresas.")
      } finally {
        if (active) setIsLoadingCompanies(false)
      }
    }

    void loadCompanies()

    return () => {
      active = false
    }
  }, [])

  function toggleCompany(companyId: string) {
    setSelectedCompanyIds((current) =>
      current.includes(companyId)
        ? current.filter((id) => id !== companyId)
        : [...current, companyId]
    )
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
                <PopoverContent
                  anchor={companiesTriggerRef}
                  align="start"
                  className="w-(--anchor-width) gap-1"
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
                          {company.name}
                          {isSelected && <IconCheck />}
                        </Button>
                      )
                    })
                  ) : (
                    <p className="px-2 py-1 text-muted-foreground">
                      {isLoadingCompanies
                        ? "Carregando empresas..."
                        : "Nenhuma empresa cadastrada"}
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
