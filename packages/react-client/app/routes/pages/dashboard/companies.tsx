import { SortDirection } from "@app/types"
import { IconArrowUpRight } from "@tabler/icons-react"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router"
import axiosClient from "~/auth/axios-client"
import CreateCompanyContent from "~/components/create/create-company-content"
import CompanyCustomCell from "~/components/data-display/custom-cell/company-custom-cell"
import RecordTable, {
  type RecordTableFilter,
} from "~/components/data-display/record-table"
import { Button } from "~/components/ui/button"
import { Dialog } from "~/components/ui/dialog"
import { useDashboardRefresh } from "~/hooks/use-dashboard-refresh"
import { getTablerIcon } from "~/lib/utils/tabler-icons"
import { AppRoutes } from "~/routes"

type Company = {
  id: string
  name: string
  websiteUrl: string
  email: string | null
  areaCode: string | null
}

type CompaniesResponse = {
  companies: Company[]
  totalPages: number
}

export default function Companies() {
  const navigate = useNavigate()
  const { id: companyId } = useParams()
  const [tableData, setTableData] = useState<any[]>([])
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [sortDirection, setSortDirection] = useState<SortDirection>(
    SortDirection.DESC
  )
  const [sortBy, setSortBy] = useState<string>("date")
  const [filters, setFilters] = useState<RecordTableFilter[]>([])
  const { refreshKey, refreshView } = useDashboardRefresh()

  useEffect(() => {
    const params: Record<string, string | number> = { page: currentPage }
    filters.forEach((filter) => {
      if (filter.key === "createdAt") {
        params.fromDate = filter.value
        params.toDate = `${filter.valueTo}T23:59:59.999Z`
      } else {
        params[filter.key] = filter.value
      }
    })

    axiosClient
      .get<CompaniesResponse>("/company/all", {
        params,
      })
      .then(({ data }) => {
        setTableData(
          data.companies.map((company) => ({
            ...company,
            email: company.email ?? "-",
            areaCode: company.areaCode ?? "-",
          }))
        )
        setTotalPages(data.totalPages)
      })
  }, [currentPage, filters, refreshKey])

  return (
    <div className="w-fill">
      <RecordTable
        data={tableData}
        onRowClick={(item) => navigate(`${AppRoutes.Companies}/${item.id}`)}
        columnKeys={[
          {
            key: "name",
            label: "Nome",
            icon: getTablerIcon("IconPencil"),
            customComponent: (children, item) => (
              <CompanyCustomCell children={children} item={item} />
            ),
          },
          { key: "email", label: "E-mail", icon: getTablerIcon("IconAt") },
          {
            key: "websiteUrl",
            label: "Site da empresa",
            icon: getTablerIcon("IconWorld"),
            customComponent: (children, item) => (
              <Button
                size="sm"
                onClick={(event) => {
                  event.stopPropagation()
                  window.open(
                    "http://" +
                      item.websiteUrl
                        .replace("http://", "")
                        .replace("https://", "")
                  )
                }}
                className="cursor-pointer"
                variant="link"
              >
                {children}
                <IconArrowUpRight />
              </Button>
            ),
          },
          {
            key: "areaCode",
            label: "CEP",
            icon: getTablerIcon("IconAddressBook"),
          },
        ]}
        sortableColumnKeys={["name", "email"]}
        tableCaption="Empresas"
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        filterableColumnKeys={[
          { key: "name", label: "Nome", type: "text" },
          { key: "email", label: "E-mail", type: "text" },
          { key: "websiteUrl", label: "Site da empresa", type: "text" },
          { key: "areaCode", label: "CEP", type: "text" },
          { key: "phone", label: "Telefone", type: "text" },
          { key: "createdAt", label: "Data de cadastro", type: "dateRange" },
        ]}
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
        open={Boolean(companyId)}
        onOpenChange={(open) => {
          if (!open) navigate(AppRoutes.Companies, { replace: true })
        }}
      >
        {companyId && (
          <CreateCompanyContent
            recordId={companyId}
            onCreated={() => {
              refreshView()
              navigate(AppRoutes.Companies, { replace: true })
            }}
          />
        )}
      </Dialog>
    </div>
  )
}
