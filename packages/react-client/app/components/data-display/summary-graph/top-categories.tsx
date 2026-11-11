import { useEffect, useState } from "react"
import axiosClient from "~/auth/axios-client"
import { useDashboardRefresh } from "~/hooks/use-dashboard-refresh"
import { getTablerIcon } from "~/lib/utils/tabler-icons"

type TopCategory = {
  name: string
  icon: string
  totalAmount: number
}

const numberFormatter = new Intl.NumberFormat("pt-BR", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

export default function TopCategories() {
  const { refreshKey } = useDashboardRefresh()
  const [categories, setCategories] = useState<TopCategory[] | null>(null)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    let isCurrentRequest = true
    setHasError(false)

    axiosClient
      .get<TopCategory[]>("/dashboard/top")
      .then(({ data }) => {
        if (isCurrentRequest) setCategories(data)
      })
      .catch(() => {
        if (isCurrentRequest) setHasError(true)
      })

    return () => {
      isCurrentRequest = false
    }
  }, [refreshKey])

  if (hasError) {
    return (
      <section className="rounded-md border bg-card p-5 text-card-foreground">
        <h2 className="text-base font-semibold">Top 3 categorias</h2>
        <p className="mt-4 text-sm text-muted-foreground" role="alert">
          Não foi possível carregar as categorias.
        </p>
      </section>
    )
  }

  if (!categories) {
    return (
      <section
        aria-busy="true"
        className="grid min-h-72 place-items-center rounded-md border bg-card p-5 text-card-foreground"
      >
        <p className="text-sm text-muted-foreground">
          Carregando categorias...
        </p>
      </section>
    )
  }

  return (
    <section
      aria-labelledby="top-categories-title"
      className="rounded-md border bg-card p-5 text-card-foreground"
    >
      <h2 id="top-categories-title" className="text-base font-semibold">
        Top 3 categorias
      </h2>

      {categories.length > 0 ? (
        <ol className="mt-3 divide-y">
          {categories.map((category, index) => {
            const CategoryIcon = getTablerIcon(category.icon)

            return (
              <li
                key={`${category.name}-${index}`}
                className="flex items-center justify-between gap-3 py-3 first:pt-1 last:pb-1"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <CategoryIcon
                    aria-hidden="true"
                    className="size-5 shrink-0 text-muted-foreground"
                    stroke={1.75}
                  />
                  <span className="truncate text-sm font-medium">
                    {category.name}
                  </span>
                </div>
                <span className="shrink-0 text-sm font-medium tabular-nums">
                  {numberFormatter.format(category.totalAmount)}
                </span>
              </li>
            )
          })}
        </ol>
      ) : (
        <p className="mt-4 text-sm text-muted-foreground">
          Ainda não há despesas por categoria.
        </p>
      )}
    </section>
  )
}
