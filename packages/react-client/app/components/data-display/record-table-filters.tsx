import { IconFilter, IconX } from "@tabler/icons-react"
import { useState } from "react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"

export type RecordTableFilter = {
  key: string
  operator: "equals" | "greaterThan" | "lessThan" | "between"
  value: string
  valueTo?: string
}

export type RecordTableFilterDefinition = {
  key: string
  label: string
  type: "text" | "dateRange" | "number" | "select"
  options?: { label: string; value: string }[]
}

type RecordTableFiltersProps = {
  filterableColumnKeys: RecordTableFilterDefinition[]
  onFiltersChange?: (filters: RecordTableFilter[]) => void
}

export default function RecordTableFilters({
  filterableColumnKeys,
  onFiltersChange,
}: RecordTableFiltersProps) {
  const [filters, setFilters] = useState<RecordTableFilter[]>([])
  const [selectedFilterKey, setSelectedFilterKey] = useState(
    filterableColumnKeys[0]?.key ?? ""
  )
  const [operator, setOperator] =
    useState<RecordTableFilter["operator"]>("equals")
  const [value, setValue] = useState("")
  const [valueTo, setValueTo] = useState("")
  const selectedFilter = filterableColumnKeys.find(
    (filter) => filter.key === selectedFilterKey
  )

  function updateFilters(nextFilters: RecordTableFilter[]) {
    setFilters(nextFilters)
    onFiltersChange?.(nextFilters)
  }

  function addFilter() {
    if (
      !selectedFilter ||
      !value ||
      (selectedFilter.type === "dateRange" && !valueTo)
    ) {
      return
    }

    const nextFilter: RecordTableFilter = {
      key: selectedFilter.key,
      operator:
        selectedFilter.type === "dateRange"
          ? "between"
          : selectedFilter.type === "number"
            ? operator
            : "equals",
      value,
      ...(selectedFilter.type === "dateRange" && { valueTo }),
    }
    updateFilters([
      ...filters.filter(
        (filter) =>
          filter.key !== nextFilter.key ||
          filter.operator !== nextFilter.operator
      ),
      nextFilter,
    ])
    setValue("")
    setValueTo("")
  }

  function getFilterLabel(filter: RecordTableFilter) {
    const definition = filterableColumnKeys.find(
      (column) => column.key === filter.key
    )
    const displayValue =
      definition?.type === "select"
        ? (definition.options?.find((option) => option.value === filter.value)
            ?.label ?? filter.value)
        : filter.value
    if (filter.operator === "between") {
      return `${definition?.label}: ${filter.value} - ${filter.valueTo}`
    }
    const operatorLabel =
      filter.operator === "greaterThan"
        ? ">"
        : filter.operator === "lessThan"
          ? "<"
          : "="
    return `${definition?.label} ${operatorLabel} ${displayValue}`
  }

  return (
    <Popover>
      <PopoverTrigger
        render={<Button variant="outline" />}
        aria-label="Filtros"
      >
        <IconFilter /> Filtros
        {filters.length > 0 && ` (${filters.length})`}
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="max-h-[80vh] w-[min(34rem,calc(100vw-1rem))] gap-3 overflow-y-auto"
      >
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Filtros</span>
          {filters.length > 0 && (
            <Button size="sm" variant="ghost" onClick={() => updateFilters([])}>
              Limpar
            </Button>
          )}
        </div>
        {filters.length > 0 && (
          <div className="flex flex-col gap-1 border-b pb-2">
            {filters.map((filter, index) => (
              <div
                className="flex min-w-0 items-center justify-between gap-2"
                key={`${filter.key}-${filter.operator}-${index}`}
              >
                <span className="truncate">{getFilterLabel(filter)}</span>
                <Button
                  size="icon-sm"
                  variant="ghost"
                  aria-label={`Remover filtro ${getFilterLabel(filter)}`}
                  onClick={() =>
                    updateFilters(filters.filter((_, i) => i !== index))
                  }
                >
                  <IconX size={14} />
                </Button>
              </div>
            ))}
          </div>
        )}
        <div className="grid grid-cols-[minmax(6rem,0.8fr)_minmax(0,1.4fr)] gap-3">
          <div
            aria-label="Colunas filtráveis"
            className="flex flex-col gap-1 border-r pr-2"
          >
            {filterableColumnKeys.map((filter) => (
              <Button
                key={filter.key}
                size="sm"
                variant={
                  selectedFilterKey === filter.key ? "secondary" : "ghost"
                }
                className="w-full justify-start text-left"
                aria-pressed={selectedFilterKey === filter.key}
                onClick={() => {
                  setSelectedFilterKey(filter.key)
                  setOperator("equals")
                  setValue("")
                  setValueTo("")
                }}
              >
                <span className="truncate">{filter.label}</span>
              </Button>
            ))}
          </div>
          <div className="flex min-w-0 flex-col gap-2">
            {selectedFilter?.type === "number" && (
              <div className="grid grid-cols-2 gap-1">
                <Button
                  size="sm"
                  variant={operator === "greaterThan" ? "secondary" : "outline"}
                  aria-pressed={operator === "greaterThan"}
                  onClick={() => setOperator("greaterThan")}
                >
                  Maior que
                </Button>
                <Button
                  size="sm"
                  variant={operator === "lessThan" ? "secondary" : "outline"}
                  aria-pressed={operator === "lessThan"}
                  onClick={() => setOperator("lessThan")}
                >
                  Menor que
                </Button>
              </div>
            )}
            {selectedFilter?.type === "select" && (
              <div
                aria-label={`Opções de ${selectedFilter.label}`}
                className="flex max-h-48 flex-col gap-1 overflow-y-auto rounded-md border p-1"
              >
                {selectedFilter.options?.map((option) => (
                  <Button
                    key={option.value}
                    size="sm"
                    variant={value === option.value ? "secondary" : "ghost"}
                    className="w-full justify-start text-left"
                    aria-pressed={value === option.value}
                    onClick={() => setValue(option.value)}
                  >
                    <span className="truncate">{option.label}</span>
                  </Button>
                ))}
                {!selectedFilter.options?.length && (
                  <p className="px-2 py-1 text-muted-foreground">
                    Nenhuma opção disponível
                  </p>
                )}
              </div>
            )}
            {selectedFilter?.type === "dateRange" && (
              <div className="grid grid-cols-2 gap-2">
                <Input
                  aria-label="Data inicial"
                  type="date"
                  value={value}
                  onChange={(event) => setValue(event.target.value)}
                />
                <Input
                  aria-label="Data final"
                  type="date"
                  value={valueTo}
                  onChange={(event) => setValueTo(event.target.value)}
                />
              </div>
            )}
            {(selectedFilter?.type === "text" ||
              selectedFilter?.type === "number") && (
              <Input
                aria-label={`Valor de ${selectedFilter.label}`}
                type={selectedFilter.type === "number" ? "number" : "text"}
                min={selectedFilter.type === "number" ? 0 : undefined}
                step={selectedFilter.type === "number" ? "0.01" : undefined}
                value={value}
                onChange={(event) => setValue(event.target.value)}
              />
            )}
            <Button
              size="sm"
              onClick={addFilter}
              disabled={
                !value || (selectedFilter?.type === "dateRange" && !valueTo)
              }
            >
              Adicionar filtro
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
