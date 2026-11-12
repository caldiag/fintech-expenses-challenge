import type { SortDirection } from "@app/types"
import {
  IconArrowsSort,
  IconCubePlus,
  type TablerIcon,
} from "@tabler/icons-react"
import type { ReactNode } from "react"
import { Button } from "../ui/button"
import { ButtonGroup } from "../ui/button-group"
import { Empty, EmptyDescription, EmptyMedia, EmptyTitle } from "../ui/empty"
import { Spinner } from "../ui/spinner"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table"
import type {
  RecordTableFilter,
  RecordTableFilterDefinition,
} from "./record-table-filters"
import RecordTableFilters from "./record-table-filters"
import RecordTablePagination from "./record-table-pagination"
export type {
  RecordTableFilter,
  RecordTableFilterDefinition,
} from "./record-table-filters"

type RecordTableProps<TItem extends { id: string }> = {
  data: TItem[]
  columnKeys: {
    key: keyof TItem & string
    label: string
    customComponent?: (children: ReactNode, item: TItem) => ReactNode
    icon: TablerIcon
  }[]
  sortableColumnKeys: string[]
  tableCaption: string
  totalPages?: number
  currentPage?: number
  onPageChange?: (page: number) => void
  setColumnSortDirection: (columnKey: string, direction: SortDirection) => void
  filterableColumnKeys?: RecordTableFilterDefinition[]
  onFiltersChange?: (filters: RecordTableFilter[]) => void
  onRowClick?: (item: TItem) => void
  isLoading?: boolean
}

export default function RecordTable<TItem extends { id: string }>({
  data,
  columnKeys,
  sortableColumnKeys,
  tableCaption,
  totalPages = 1,
  currentPage = 0,
  onPageChange,
  setColumnSortDirection,
  filterableColumnKeys = [],
  onFiltersChange,
  onRowClick,
  isLoading = false,
}: RecordTableProps<TItem>) {
  return (
    <div>
      <div className="mb-2 flex w-full items-center justify-between gap-1">
        <div className="flex w-full items-center gap-1">
          <ButtonGroup>
            {filterableColumnKeys.length > 0 && (
              <RecordTableFilters
                filterableColumnKeys={filterableColumnKeys}
                onFiltersChange={onFiltersChange}
              />
            )}
            <Button variant="outline">
              <IconArrowsSort /> Ordenar
            </Button>
          </ButtonGroup>
        </div>
        {onPageChange && (
          <RecordTablePagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        )}
      </div>
      <div className="overflow-hidden border-b-1">
        <Table>
          <TableHeader>
            <TableRow>
              {columnKeys.map((columnKey) => {
                const Icon = columnKey.icon
                return (
                  <TableHead className="border-r-1" key={columnKey.key}>
                    <div className="flex items-center gap-1">
                      {<Icon size={12} />}
                      {columnKey.label}
                    </div>
                  </TableHead>
                )
              })}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={columnKeys.length}>
                  <div className="flex min-h-32 items-center justify-center">
                    <Spinner className="size-6" />
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              data.map((row, i) => {
                return (
                  <TableRow
                    key={row.id ?? i}
                    tabIndex={onRowClick ? 0 : undefined}
                    aria-label={
                      onRowClick ? `Abrir ${tableCaption}` : undefined
                    }
                    className={
                      onRowClick
                        ? "cursor-pointer hover:bg-muted/50"
                        : undefined
                    }
                    onClick={onRowClick ? () => onRowClick(row) : undefined}
                    onKeyDown={
                      onRowClick
                        ? (event) => {
                            if (
                              event.target === event.currentTarget &&
                              (event.key === "Enter" || event.key === " ")
                            ) {
                              event.preventDefault()
                              onRowClick(row)
                            }
                          }
                        : undefined
                    }
                  >
                    {columnKeys.map((columnKey) => (
                      <TableCell className="border-r-1" key={columnKey.key}>
                        {!columnKey.customComponent &&
                          (data[i][columnKey.key] as ReactNode)}
                        {columnKey.customComponent && (
                          <>
                            {columnKey.customComponent(
                              data[i][columnKey.key] as ReactNode,
                              data[i]
                            )}
                          </>
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                )
              })
            )}
            {!isLoading && !data.length && (
              <TableRow>
                <TableCell colSpan={columnKeys.length} className="text-center">
                  <Empty>
                    <EmptyMedia>
                      <IconCubePlus />
                    </EmptyMedia>
                    <EmptyTitle>Ainda não há nada aqui</EmptyTitle>
                    <EmptyDescription>
                      Clique em "Novo registro" no menu superior para adicionar
                      um registro
                    </EmptyDescription>
                  </Empty>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
