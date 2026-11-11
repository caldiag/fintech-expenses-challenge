import { SortDirection } from "@app/types"
import { IconArrowUpRight } from "@tabler/icons-react"
import { useEffect, useState } from "react"
import axiosClient from "~/auth/axios-client"
import CompanyCustomCell from "~/components/data-display/custom-cell/company-custom-cell"
import RecordTable from "~/components/data-display/record-table"
import { Button } from "~/components/ui/button"
import { useDashboardRefresh } from "~/hooks/use-dashboard-refresh"
import { getTablerIcon } from "~/lib/utils/tabler-icons"

type Company = {
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
      .get<CompaniesResponse>("/company/all", {
        params: { page: currentPage },
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
  }, [currentPage, refreshKey])

  return (
    <div className="w-fill">
      <RecordTable
        data={tableData}
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
                onClick={() => {
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
        setColumnSortDirection={(key, dir) => {
          setSortBy(key)
          setSortDirection(dir)
        }}
      />
    </div>
  )
}
