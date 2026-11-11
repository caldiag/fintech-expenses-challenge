import { SortDirection, TransactionDirection } from "@app/types"
import { IconArrowDown, IconArrowUp } from "@tabler/icons-react"
import { useEffect, useState } from "react"
import axiosClient from "~/auth/axios-client"
import CompanyCustomCell from "~/components/data-display/custom-cell/company-custom-cell"
import RecordTable from "~/components/data-display/record-table"
import { useDashboardRefresh } from "~/hooks/use-dashboard-refresh"
import { formatSmart } from "~/lib/utils/format-date"
import { getTablerIcon } from "~/lib/utils/tabler-icons"

export default function Transactions() {
  const [tableData, setTableData] = useState<any[]>([])
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [sortDirection, setSortDirection] = useState<SortDirection>(
    SortDirection.DESC
  )
  const [sortBy, setSortBy] = useState<string>("date")
  const { refreshKey } = useDashboardRefresh()

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
  }, [currentPage, refreshKey])

  return (
    <div className="w-fill">
      <RecordTable
        data={tableData}
        columnKeys={[
          {
            key: "company",
            label: "Empresa",
            icon: getTablerIcon("IconBuilding"),
            customComponent: (children, item) => (
              <CompanyCustomCell children={children} item={item.company} />
            ),
          },
          {
            key: "amount",
            label: "Valor",
            icon: getTablerIcon("IconCurrencyDollar"),
          },
          {
            key: "transactionDirection",
            label: "Tipo",
            icon: getTablerIcon("IconArrowUpDown"),
            customComponent: (children, item) => (
              <div className="flex items-center gap-2">
                <div
                  className={`flex h-4 w-4 items-center justify-center rounded-lg ${item.transactionDirection === "Entrada" ? "bg-green-100 text-green-900" : "bg-red-100 text-red-900"}`}
                >
                  {item.transactionDirection === "Entrada" ? (
                    <IconArrowDown size={12} />
                  ) : (
                    <IconArrowUp size={12} />
                  )}
                </div>
                {children}
              </div>
            ),
          },
          {
            key: "category",
            label: "Categoria",
            icon: getTablerIcon("IconCategory"),
            customComponent: (children, item) => {
              const CategoryIcon = getTablerIcon(item.category?.icon)
              return (
                <div className="flex items-center gap-1">
                  <CategoryIcon size={12} />
                  {children}
                </div>
              )
            },
          },
          {
            key: "role",
            label: "Setor",
            icon: getTablerIcon("IconId"),
            customComponent: (children, item) => {
              const CategoryIcon = getTablerIcon(item.role.icon)
              return (
                <div className="flex items-center gap-1">
                  <CategoryIcon size={12} />
                  {item.role.name}
                </div>
              )
            },
          },
          {
            key: "date",
            label: "Data",
            icon: getTablerIcon("IconCalendarEvent"),
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
    transactionDirection:
      data.transactionDirection === TransactionDirection.Inbound
        ? "Entrada"
        : "Saída",
    date: formatSmart(new Date(data.createdAt)),
    amount: new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: data.currency,
    }).format(data.amount + data.amountCents / 100),
    category: data.transactionCategory.name,
    role: data.role,
    company: data.company.name,
  }
}
