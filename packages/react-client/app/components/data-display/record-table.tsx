import type { SortDirection } from "@app/types"
import {
  IconArrowsSort,
  IconCubePlus,
  IconFilter,
  type TablerIcon,
} from "@tabler/icons-react"
import type { ReactNode } from "react"
import { Button } from "../ui/button"
import { ButtonGroup } from "../ui/button-group"
import { Empty, EmptyDescription, EmptyMedia, EmptyTitle } from "../ui/empty"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table"
import RecordTablePagination from "./record-table-pagination"

type RecordTableProps = {
  data: any[]
  columnKeys: {
    key: string
    label: string
    customComponent?: (children: ReactNode, item: any) => ReactNode
    icon: TablerIcon
  }[]
  sortableColumnKeys: string[]
  tableCaption: string
  totalPages?: number
  currentPage?: number
  onPageChange?: (page: number) => void
  setColumnSortDirection: (columnKey: string, direction: SortDirection) => void
}

export default function RecordTable({
  data,
  columnKeys,
  sortableColumnKeys,
  tableCaption,
  totalPages = 1,
  currentPage = 0,
  onPageChange,
  setColumnSortDirection,
}: RecordTableProps) {
  return (
    <div>
      <div className="mb-2 flex w-full items-center justify-between gap-1">
        <div className="flex w-full items-center gap-1">
          <ButtonGroup>
            <Button variant="outline">
              <IconFilter /> Filtros
            </Button>
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
            {data.map((row, i) => {
              return (
                <TableRow>
                  {columnKeys.map((columnKey) => (
                    <TableCell className="border-r-1" key={columnKey.key}>
                      {!columnKey.customComponent && data[i][columnKey.key]}
                      {columnKey.customComponent && (
                        <>
                          {columnKey.customComponent(
                            data[i][columnKey.key],
                            data[i]
                          )}
                        </>
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              )
            })}
            {!data.length && (
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
