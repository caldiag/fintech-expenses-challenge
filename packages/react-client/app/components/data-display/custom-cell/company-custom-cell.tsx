import { IconBuilding, type ReactNode } from "@tabler/icons-react"
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar"

export default function CompanyCustomCell({
  children,
  item,
}: {
  children: ReactNode
  item: any
}) {
  return (
    <div className="flex items-center gap-1">
      <Avatar className="h-4 w-4 rounded-none after:hidden">
        <AvatarImage
          src={
            "https://" +
            item.websiteUrl?.replace("https://", "").replace("http://", "") +
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
}
