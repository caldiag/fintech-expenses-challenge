import { SortDirection } from "@app/types"
import { IconUser } from "@tabler/icons-react"
import { useEffect, useState } from "react"
import axiosClient from "~/auth/axios-client"
import RecordTable from "~/components/data-display/record-table"
import { Button } from "~/components/ui/button"
import { formatSmart } from "~/lib/utils/format-date"

export default function Transactions() {
  const [tableData, setTableData] = useState<any[]>([])
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [sortDirection, setSortDirection] = useState<SortDirection>(
    SortDirection.DESC
  )
  const [sortBy, setSortBy] = useState<string>("date")

  useEffect(() => {
    axiosClient
      .get("/transaction/all", { params: { page: currentPage } })
      .then((d) => {
        setTableData(
          d.data.transactions.map((transaction: any) =>
            parseTableData(transaction)
          )
        )
        setTotalPages(d.data.totalPages)
      })
  }, [currentPage])

  return (
    <div className="w-fill">
      <RecordTable
        data={tableData}
        columnKeys={[
          { key: "date", label: "Data" },
          { key: "amount", label: "Valor" },
          { key: "description", label: "Descrição" },
          { key: "category", label: "Categoria" },
          {
            key: "createdBy",
            label: "Criado por",
            customComponent: (children) => (
              <Button variant="ghost">
                <IconUser /> {children}
              </Button>
            ),
          },
        ]}
        sortableColumnKeys={["date", "amount", "description", "category"]}
        tableCaption="Transactions"
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        setColumnSortDirection={(key, dir) => {
          setSortBy(key)
          setSortDirection(dir)
        }}
      />
    </div>
  )
}

function parseTableData(data: any) {
  return {
    date: formatSmart(new Date(data.createdAt)),
    amount: data.amount + "," + data.amountCents,
    description: data.description,
    category: data.transactionCategory.name,
    createdBy: `${data.createdBy.firstName} ${data.createdBy.lastName}`,
  }
}
