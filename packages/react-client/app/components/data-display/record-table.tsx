import type { SortDirection } from "@app/types"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table"

export default function RecordTable(
  data: any[],
  columnKeys: string[],
  sortableColumnKeys: string[],
  tableCaption: string,
  setColumnOrderDirection: (columnKey: string, direction: SortDirection) => void
) {
  return (
    <Table>
      <TableCaption>{tableCaption}</TableCaption>
      <TableHeader>
        {sortableColumnKeys.map((columnKey) => (
          <TableHeader key={columnKey}>{columnKey}</TableHeader>
        ))}
      </TableHeader>
      <TableBody>
        {data.map((row) => {
          return (
            <TableRow>
              {columnKeys.map((columnKey) => (
                <TableCell key={columnKey}>{row[columnKey]}</TableCell>
              ))}
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}
