import { format, formatDistanceToNow, isToday, isYesterday } from "date-fns"
import { ptBR } from "date-fns/locale"

export function formatSmart(date: Date) {
  if (isToday(date))
    return formatDistanceToNow(date, { addSuffix: true, locale: ptBR })
  if (isYesterday(date)) return "ontem"
  return format(date, "dd 'de' MMM", { locale: ptBR })
}
