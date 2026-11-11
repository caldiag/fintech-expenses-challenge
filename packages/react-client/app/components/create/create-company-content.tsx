import {
  IconCheck,
  IconChevronDown,
  IconDeviceFloppy,
} from "@tabler/icons-react"
import { useRef, useState } from "react"
import axiosClient from "~/auth/axios-client"
import { usePaginatedContacts } from "~/hooks/use-paginated-contacts"
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

export default function CreateCompanyContent({
  onCreated,
}: {
  onCreated: () => void
}) {
  const [name, setName] = useState("")
  const [websiteUrl, setWebsiteUrl] = useState("")
  const [areaCode, setAreaCode] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [selectedContactIds, setSelectedContactIds] = useState<string[]>([])
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

  function handleContactsScroll(event: React.UIEvent<HTMLDivElement>) {
    const { scrollTop, clientHeight, scrollHeight } = event.currentTarget
    if (scrollHeight - scrollTop - clientHeight < 48) {
      void loadNextContactPage()
    }
  }

  function toggleContact(contactId: string) {
    setSelectedContactIds((current) =>
      current.includes(contactId)
        ? current.filter((id) => id !== contactId)
        : [...current, contactId]
    )
  }

  async function submitCompany(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setIsSavingCompany(true)
    try {
      await axiosClient.post("/company/create", {
        name: name.trim(),
        websiteUrl: websiteUrl.trim(),
        areaCode: areaCode.trim() || null,
        email: email.trim() || null,
        phone: phone.trim() || null,
        contactIds: selectedContactIds,
      })
      onCreated()
    } catch {
      setError("Não foi possível salvar a empresa.")
    } finally {
      setIsSavingCompany(false)
    }
  }

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Nova empresa</DialogTitle>
      </DialogHeader>
      <form onSubmit={submitCompany}>
        <FieldGroup>
          <FieldSet className="grid grid-cols-1 gap-3">
            <div>
              <FieldLabel htmlFor="company-name">Nome</FieldLabel>
              <Input
                id="company-name"
                placeholder="Nome da empresa"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
              />
            </div>
            <div>
              <FieldLabel htmlFor="company-website">Site</FieldLabel>
              <Input
                id="company-website"
                type="url"
                placeholder="https://exemplo.com"
                value={websiteUrl}
                onChange={(event) => setWebsiteUrl(event.target.value)}
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
                id="company-area-code"
                type="tel"
                placeholder="11"
                value={areaCode}
                onChange={(event) => setAreaCode(event.target.value)}
              />
            </div>
            <div>
              <FieldLabel htmlFor="company-phone">Telefone</FieldLabel>
              <Input
                id="company-phone"
                type="tel"
                placeholder="99999-9999"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
              />
            </div>
            <div className="sm:col-span-2">
              <FieldLabel htmlFor="company-email">E-mail</FieldLabel>
              <Input
                id="company-email"
                type="email"
                placeholder="contato@exemplo.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
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
          <Button type="submit" disabled={isSavingCompany}>
            <IconDeviceFloppy />
            {isSavingCompany ? "Salvando..." : "Salvar"}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  )
}
