import { SortDirection } from "@app/types"
import { useEffect, useState } from "react"
import axiosClient from "~/auth/axios-client"
import RecordTable from "~/components/data-display/record-table"
import { formatSmart } from "~/lib/utils/format-date"
import { getTablerIcon } from "~/lib/utils/tabler-icons"

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

export default function Contacts() {
  const [tableData, setTableData] = useState<any[]>([])
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [sortDirection, setSortDirection] = useState<SortDirection>(
    SortDirection.DESC
  )
  const [sortBy, setSortBy] = useState<string>("createdAt")

  useEffect(() => {
    axiosClient
      .get<ContactsResponse>("/contact/all", { params: { page: currentPage } })
      .then(({ data }) => {
        setTableData(
          data.contacts.map((contact) => ({
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
  }, [currentPage])

  return (
    <div className="w-fill">
      <RecordTable
        data={tableData}
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
        setColumnSortDirection={(key, direction) => {
          setSortBy(key)
          setSortDirection(direction)
        }}
      />
    </div>
  )
}
