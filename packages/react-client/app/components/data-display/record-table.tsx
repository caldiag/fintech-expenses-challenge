import type { SortDirection } from "@app/types"
import { IconCubePlus } from "@tabler/icons-react"
import type { ReactNode } from "react"
import { Empty, EmptyDescription, EmptyMedia, EmptyTitle } from "../ui/empty"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table"

type RecordTableProps = {
  data: any[]
  columnKeys: {
    key: string
    label: string
    customComponent?: (children: ReactNode) => ReactNode
  }[]
  sortableColumnKeys: string[]
  tableCaption: string
  setColumnSortDirection: (columnKey: string, direction: SortDirection) => void
}

export default function RecordTable({
  data,
  columnKeys,
  sortableColumnKeys,
  tableCaption,
  setColumnSortDirection,
}: RecordTableProps) {
  return (
    <div className="overflow-hidden rounded-sm border">
      <Table>
        <TableHeader>
          <TableRow>
            {columnKeys.map((columnKey) => (
              <TableHead key={columnKey.key}>{columnKey.label}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, i) => {
            return (
              <TableRow>
                {columnKeys.map((columnKey) => (
                  <TableCell key={columnKey.key}>
                    {!columnKey.customComponent && data[i][columnKey.key]}
                    {columnKey.customComponent && (
                      <>{columnKey.customComponent(data[i][columnKey.key])}</>
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
                    Clique em "Novo registro" no menu superior para adicionar um
                    registro
                  </EmptyDescription>
                </Empty>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
