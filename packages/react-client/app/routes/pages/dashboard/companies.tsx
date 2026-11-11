import { SortDirection } from "@app/types"
import { IconArrowUpRight } from "@tabler/icons-react"
import { useState } from "react"
import CompanyCustomCell from "~/components/data-display/custom-cell/company"
import RecordTable from "~/components/data-display/record-table"
import { Button } from "~/components/ui/button"
import { getTablerIcon } from "~/lib/utils/tabler-icons"

export default function Companies() {
  const [tableData, setTableData] = useState<any[]>([
    {
      name: "Netflix",
      websiteUrl: "netflix.com",
      email: "netflix@netflix.com",
      areaCode: "05528-001",
    },
  ])
  const [sortDirection, setSortDirection] = useState<SortDirection>(
    SortDirection.DESC
  )
  const [sortBy, setSortBy] = useState<string>("date")

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
        tableCaption="Transactions"
        setColumnSortDirection={(key, dir) => {
          setSortBy(key)
          setSortDirection(dir)
        }}
      />
    </div>
  )
}
