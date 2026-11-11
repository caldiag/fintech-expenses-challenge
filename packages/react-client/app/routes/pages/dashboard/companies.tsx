import { SortDirection } from "@app/types"
import { IconBuilding, IconUser } from "@tabler/icons-react"
import { useState } from "react"
import RecordTable from "~/components/data-display/record-table"
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar"
import { Button } from "~/components/ui/button"

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
            customComponent: (children, item) => {
              return (
                <div className="flex items-center gap-1">
                  <Avatar className="h-4 w-4 rounded-none after:hidden">
                    <AvatarImage
                      src={
                        "https://" +
                        item.websiteUrl
                          .replace("https://", "")
                          .replace("http://", "") +
                        "/favicon.ico"
                      }
                      className="rounded-none"
                    />
                    <AvatarFallback className="rounded-none text-sm">
                      <IconBuilding />
                    </AvatarFallback>
                  </Avatar>
                  {children}
                </div>
              )
            },
          },
          { key: "email", label: "E-mail" },
          { key: "areaCode", label: "CEP" },
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
