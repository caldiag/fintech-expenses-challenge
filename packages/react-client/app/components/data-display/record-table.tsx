import type { SortDirection } from "@app/types"
import { IconArrowsSort, IconCubePlus, IconFilter } from "@tabler/icons-react"
import type { ReactNode } from "react"
import { Button } from "../ui/button"
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
        <div className="flex items-center gap-1">
          <Button variant="ghost">
            <IconFilter /> Filtros
          </Button>
          <Button variant="ghost">
            <IconArrowsSort /> Ordenar
          </Button>
        </div>
        {onPageChange && (
          <RecordTablePagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        )}
      </div>
      <div className="overflow-hidden rounded-sm border-1 border-r-0">
        <Table>
          <TableHeader>
            <TableRow>
              {columnKeys.map((columnKey) => (
                <TableHead
                  className="h-8 border-r-1 bg-sidebar"
                  key={columnKey.key}
                >
                  {columnKey.label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row, i) => {
              return (
                <TableRow>
                  {columnKeys.map((columnKey) => (
                    <TableCell className="h-4 border-r-1" key={columnKey.key}>
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
