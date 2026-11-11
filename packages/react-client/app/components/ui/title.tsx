import type { Icon } from "@tabler/icons-react"

export default function Title({ title, Icon }: { title: string; Icon?: Icon }) {
  return (
    <div className="flex items-center gap-2">
      {Icon && <Icon size={14} />}
      <h1>{title}</h1>
    </div>
  )
}
