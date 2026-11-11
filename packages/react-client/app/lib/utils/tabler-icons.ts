import * as TablerIcons from "@tabler/icons-react"
import { IconTag, type TablerIcon } from "@tabler/icons-react"

const tablerIcons = TablerIcons as unknown as Record<
  string,
  TablerIcon | undefined
>

export function getTablerIcon(iconName: string): TablerIcon {
  return tablerIcons[iconName] ?? IconTag
}
