import { SortDirection, TransactionDirection } from "@app/types"
import { IconArrowDown, IconArrowUp } from "@tabler/icons-react"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router"
import axiosClient from "~/auth/axios-client"
import CreateTransactionContent from "~/components/create/create-transaction-content"
import CompanyCustomCell from "~/components/data-display/custom-cell/company-custom-cell"
import RecordTable, {
  type RecordTableFilter,
  type RecordTableFilterDefinition,
} from "~/components/data-display/record-table"
import { Dialog } from "~/components/ui/dialog"
import { useDashboardRefresh } from "~/hooks/use-dashboard-refresh"
import { formatSmart } from "~/lib/utils/format-date"
import { getTablerIcon } from "~/lib/utils/tabler-icons"
import { AppRoutes } from "~/routes"

export default function Transactions() {
  const navigate = useNavigate()
  const { id: transactionId } = useParams()
  const [tableData, setTableData] = useState<any[]>([])
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [sortDirection, setSortDirection] = useState<SortDirection>(
    SortDirection.DESC
  )
  const [sortBy, setSortBy] = useState<string>("date")
  const [filters, setFilters] = useState<RecordTableFilter[]>([])
  const [relationOptions, setRelationOptions] = useState<
    Record<string, { label: string; value: string }[]>
  >({ companyId: [], transactionCategoryId: [], roleId: [] })
  const { refreshKey, refreshView } = useDashboardRefresh()

  useEffect(() => {
    const params: Record<string, string | number> = { page: currentPage }
    filters.forEach((filter) => {
      if (filter.key === "createdAt") {
        params.fromDate = filter.value
        params.toDate = `${filter.valueTo}T23:59:59.999Z`
      } else if (filter.key === "amount") {
        params[
          filter.operator === "greaterThan"
            ? "amountGreaterThan"
            : "amountLessThan"
        ] = filter.value
      } else {
        params[filter.key] = filter.value
      }
    })

    axiosClient.get("/transaction/all", { params }).then((d) => {
      setTableData(
        d.data.transactions.map((transaction: any) =>
          parseTableData(transaction)
        )
      )
      setTotalPages(d.data.totalPages)
    })
  }, [currentPage, filters, refreshKey])

  useEffect(() => {
    Promise.all([
      axiosClient.get<{
        companies: { id: string; name: string }[]
        totalPages: number
      }>("/company/all", { params: { page: 0 } }),
      axiosClient.get<{ id: string; name: string }[]>(
        "/transaction/category/all"
      ),
      axiosClient.get<{ id: string; name: string }[]>("/role/all"),
    ]).then(async ([companyResponse, categoryResponse, roleResponse]) => {
      const remainingCompanyPages = await Promise.all(
        Array.from(
          { length: Math.max(0, companyResponse.data.totalPages - 1) },
          (_, index) =>
            axiosClient.get<{ companies: { id: string; name: string }[] }>(
              "/company/all",
              { params: { page: index + 1 } }
            )
        )
      )
      const companies = [
        ...companyResponse.data.companies,
        ...remainingCompanyPages.flatMap((response) => response.data.companies),
      ]
      setRelationOptions({
        companyId: companies.map((company) => ({
          label: company.name,
          value: company.id,
        })),
        transactionCategoryId: categoryResponse.data.map((category) => ({
          label: category.name,
          value: category.id,
        })),
        roleId: roleResponse.data.map((role) => ({
          label: role.name,
          value: role.id,
        })),
      })
    })
  }, [refreshKey])

  const filterableColumnKeys: RecordTableFilterDefinition[] = [
    {
      key: "transactionDirection",
      label: "Tipo",
      type: "select",
      options: [
        { label: "Entrada", value: TransactionDirection.Inbound },
        { label: "Saída", value: TransactionDirection.Outbound },
      ],
    },
    { key: "createdAt", label: "Data", type: "dateRange" },
    { key: "amount", label: "Valor", type: "number" },
    {
      key: "companyId",
      label: "Empresa",
      type: "select",
      options: relationOptions.companyId,
    },
    {
      key: "transactionCategoryId",
      label: "Categoria",
      type: "select",
      options: relationOptions.transactionCategoryId,
    },
    {
      key: "roleId",
      label: "Setor",
      type: "select",
      options: relationOptions.roleId,
    },
  ]

  return (
    <div className="w-fill">
      <RecordTable
        data={tableData}
        onRowClick={(item) => navigate(`${AppRoutes.Transactions}/${item.id}`)}
        columnKeys={[
          {
            key: "company",
            label: "Empresa",
            icon: getTablerIcon("IconBuilding"),
            customComponent: (children, item) => (
              <CompanyCustomCell
                children={item.company.name}
                item={item.company}
              />
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
        filterableColumnKeys={filterableColumnKeys}
        onFiltersChange={(nextFilters) => {
          setCurrentPage(0)
          setFilters(nextFilters)
        }}
        setColumnSortDirection={(key, dir) => {
          setSortBy(key)
          setSortDirection(dir)
        }}
      />
      <Dialog
        open={Boolean(transactionId)}
        onOpenChange={(open) => {
          if (!open) navigate(AppRoutes.Transactions, { replace: true })
        }}
      >
        {transactionId && (
          <CreateTransactionContent
            recordId={transactionId}
            onCreated={() => {
              refreshView()
              navigate(AppRoutes.Transactions, { replace: true })
            }}
          />
        )}
      </Dialog>
    </div>
  )
}

function parseTableData(data: any) {
  return {
    id: data.id,
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
    company: data.company,
  }
}
