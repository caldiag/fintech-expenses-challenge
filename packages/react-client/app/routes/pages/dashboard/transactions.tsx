import { SortDirection } from "@app/types"
import { IconCurrencyDollar, IconUser } from "@tabler/icons-react"
import { useState } from "react"
import RecordTable from "~/components/data-display/record-table"
import { Button } from "~/components/ui/button"

export default function Transactions() {
  const [tableData, setTableData] = useState<any[]>([
    // {
    //   date: "Hoje",
    //   amount: 100,
    //   description: "Teste",
    //   category: "Teste",
    //   createdBy: "Caleb",
    // },
    // {
    //   date: "3 minutos atrás",
    //   amount: 200,
    //   description: "Teste",
    //   category: "Admin",
    //   createdBy: "Outro usuário",
    // },
  ])
  const [sortDirection, setSortDirection] = useState<SortDirection>(
    SortDirection.DESC
  )
  const [sortBy, setSortBy] = useState<string>("date")

  return (
    <div className="w-fill">
      <h3 className="mb-4 flex items-center gap-1">
        <IconCurrencyDollar size={18} /> Transactions
      </h3>
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
        setColumnSortDirection={(key, dir) => {
          setSortBy(key)
          setSortDirection(dir)
        }}
      />
    </div>
  )
}
