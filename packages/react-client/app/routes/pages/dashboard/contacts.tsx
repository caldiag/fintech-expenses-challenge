import { SortDirection } from "@app/types"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router"
import axiosClient from "~/auth/axios-client"
import CreateContactContent from "~/components/create/create-contact-content"
import RecordTable, {
  type RecordTableFilter,
} from "~/components/data-display/record-table"
import { Dialog } from "~/components/ui/dialog"
import { useDashboardRefresh } from "~/hooks/use-dashboard-refresh"
import { formatSmart } from "~/lib/utils/format-date"
import { getTablerIcon } from "~/lib/utils/tabler-icons"
import { AppRoutes } from "~/routes"

type Contact = {
  id: string
  name: string
  email: string
  phone: string | null
  companies: { id: string; name: string }[]
  createdAt: string
}

type ContactsResponse = {
  contacts: Contact[]
  total: number
  totalPages: number
}

type ContactTableRow = {
  id: string
  name: string
  email: string
  phone: string
  companies: string
  createdAt: string
}

export default function Contacts() {
  const navigate = useNavigate()
  const { id: contactId } = useParams()
  const [tableData, setTableData] = useState<ContactTableRow[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [sortDirection, setSortDirection] = useState<SortDirection>(
    SortDirection.DESC
  )
  const [sortBy, setSortBy] = useState<string>("createdAt")
  const [filters, setFilters] = useState<RecordTableFilter[]>([])
  const [companyOptions, setCompanyOptions] = useState<
    { label: string; value: string }[]
  >([])
  const { refreshKey, refreshView } = useDashboardRefresh()

  useEffect(() => {
    let active = true
    setIsLoading(true)
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
      .get<ContactsResponse>("/contact/all", { params })
      .then(({ data }) => {
        setTableData(
          data.contacts.map((contact) => ({
            id: contact.id,
            name: contact.name,
            email: contact.email,
            phone: contact.phone ?? "-",
            companies: contact.companies
              .map((company) => company.name)
              .join(", "),
            createdAt: formatSmart(new Date(contact.createdAt)),
          }))
        )
        setTotalPages(data.totalPages)
      })
      .finally(() => {
        if (active) setIsLoading(false)
      })

    return () => {
      active = false
    }
  }, [currentPage, filters, refreshKey])

  useEffect(() => {
    axiosClient
      .get<{ companies: { id: string; name: string }[]; totalPages: number }>(
        "/company/all",
        { params: { page: 0 } }
      )
      .then(async ({ data }) => {
        const remainingPages = await Promise.all(
          Array.from({ length: Math.max(0, data.totalPages - 1) }, (_, index) =>
            axiosClient.get<{ companies: { id: string; name: string }[] }>(
              "/company/all",
              { params: { page: index + 1 } }
            )
          )
        )
        setCompanyOptions(
          [
            ...data.companies,
            ...remainingPages.flatMap((page) => page.data.companies),
          ].map((company) => ({ label: company.name, value: company.id }))
        )
      })
  }, [refreshKey])

  return (
    <div className="w-fill">
      <RecordTable
        data={tableData}
        isLoading={isLoading}
        onRowClick={(item) => navigate(`${AppRoutes.Contacts}/${item.id}`)}
        columnKeys={[
          { key: "name", label: "Nome", icon: getTablerIcon("IconUser") },
          { key: "email", label: "E-mail", icon: getTablerIcon("IconAt") },
          {
            key: "phone",
            label: "Telefone",
            icon: getTablerIcon("IconPhone"),
          },
          {
            key: "companies",
            label: "Empresas",
            icon: getTablerIcon("IconBuilding"),
          },
          {
            key: "createdAt",
            label: "Data de cadastro",
            icon: getTablerIcon("IconCalendarEvent"),
          },
        ]}
        sortableColumnKeys={["name", "email", "createdAt"]}
        tableCaption="Contatos"
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        filterableColumnKeys={[
          { key: "name", label: "Nome", type: "text" },
          { key: "email", label: "E-mail", type: "text" },
          { key: "phone", label: "Telefone", type: "text" },
          { key: "createdAt", label: "Data de cadastro", type: "dateRange" },
          {
            key: "companyId",
            label: "Empresa",
            type: "select",
            options: companyOptions,
          },
        ]}
        onFiltersChange={(nextFilters) => {
          setCurrentPage(0)
          setFilters(nextFilters)
        }}
        setColumnSortDirection={(key, direction) => {
          setSortBy(key)
          setSortDirection(direction)
        }}
      />
      <Dialog
        open={Boolean(contactId)}
        onOpenChange={(open) => {
          if (!open) navigate(AppRoutes.Contacts, { replace: true })
        }}
      >
        {contactId && (
          <CreateContactContent
            recordId={contactId}
            onCreated={() => {
              refreshView()
              navigate(AppRoutes.Contacts, { replace: true })
            }}
          />
        )}
      </Dialog>
    </div>
  )
}
