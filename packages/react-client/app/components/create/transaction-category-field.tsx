import { Select } from "@base-ui/react/select"
import { IconChevronDown, IconPlus } from "@tabler/icons-react"
import { useEffect, useRef, useState } from "react"
import axiosClient from "~/auth/axios-client"
import { toast } from "~/components/ui/toast"
import { getTablerIcon } from "~/lib/utils/tabler-icons"
import { Button } from "../ui/button"
import { ButtonGroup } from "../ui/button-group"
import { FieldLabel, FieldSet } from "../ui/field"
import { Input } from "../ui/input"
import { Popover, PopoverContent, PopoverTitle } from "../ui/popover"
import {
  ADD_CATEGORY_VALUE,
  CATEGORY_ICON_OPTIONS,
  type CategoryIconName,
  type TransactionCategory,
} from "./utils/transaction-form"

export function TransactionCategoryField({
  value,
  onChange,
  canEdit,
  isLoading,
  setError,
  setLoading,
}: {
  value: string
  onChange: (value: string) => void
  canEdit: boolean
  isLoading: boolean
  setError: React.Dispatch<React.SetStateAction<string | null>>
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
}) {
  const [categories, setCategories] = useState<TransactionCategory[]>([])
  const [isPopoverOpen, setIsPopoverOpen] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState("")
  const [newCategoryIcon, setNewCategoryIcon] =
    useState<CategoryIconName>("IconTag")
  const [isCreatingCategory, setIsCreatingCategory] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const selectedCategory = categories.find((category) => category.id === value)

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
        if (active) setLoading(false)
      }
    }

    void loadCategories()
    return () => {
      active = false
    }
  }, [setError, setLoading])

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
      onChange(category.id)
      setNewCategoryName("")
      setIsPopoverOpen(false)
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

  return (
    <FieldSet className="grid grid-cols-1 gap-3">
      <div>
        <FieldLabel htmlFor="transaction-category">Categoria</FieldLabel>
        <Select.Root
          value={value || null}
          onValueChange={(nextValue) => {
            if (nextValue === ADD_CATEGORY_VALUE) {
              setIsPopoverOpen(true)
              setError(null)
              return
            }
            onChange(nextValue ?? "")
            setError(null)
          }}
        >
          <Select.Trigger
            ref={triggerRef}
            id="transaction-category"
            disabled={!canEdit}
            className="flex h-8 w-full items-center justify-between gap-2 rounded-md border border-input bg-input/20 px-2 text-left text-xs outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30"
          >
            <Select.Value className="min-w-0 flex-1 text-left">
              {selectedCategory ? (
                <span className="flex min-w-0 items-center gap-2">
                  {(() => {
                    const CategoryIcon = getTablerIcon(selectedCategory.icon)
                    return <CategoryIcon className="size-4 shrink-0" />
                  })()}
                  <span className="truncate">{selectedCategory.name}</span>
                </span>
              ) : isLoading ? (
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
            <Select.Positioner sideOffset={4} className="z-50 outline-none">
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
        <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
          <PopoverContent anchor={triggerRef} align="start" className="w-80">
            <PopoverTitle>Nova categoria</PopoverTitle>
            <ButtonGroup
              aria-label="Ícone e nome da categoria"
              className="w-full gap-1"
            >
              <Select.Root
                value={newCategoryIcon}
                onValueChange={(icon) => {
                  if (icon) setNewCategoryIcon(icon as CategoryIconName)
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
                    <Select.Popup className="h-fit max-h-56 w-28 min-w-0 overflow-y-auto rounded-md border bg-popover p-1 text-popover-foreground shadow-md">
                      <Select.List className="grid grid-cols-3 gap-1">
                        {CATEGORY_ICON_OPTIONS.map((option) => {
                          const OptionIcon = getTablerIcon(option.name)
                          return (
                            <Select.Item
                              key={option.name}
                              value={option.name}
                              aria-label={option.label}
                              className="flex size-8 cursor-default items-center justify-center rounded-sm outline-none data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground"
                            >
                              <OptionIcon className="size-4" />
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
                onChange={(event) => setNewCategoryName(event.target.value)}
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
  )
}
