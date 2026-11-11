import { useEffect, useState } from "react"
import { Pie, PieChart } from "recharts"
import axiosClient from "~/auth/axios-client"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "~/components/ui/chart"
import { useDashboardRefresh } from "~/hooks/use-dashboard-refresh"

type DashboardTotals = {
  totalInbound: number
  totalOutbound: number
}

const chartConfig = {
  inbound: { label: "Entradas", color: "#16805d" },
  outbound: { label: "Saídas", color: "#cf542f" },
} satisfies ChartConfig

const numberFormatter = new Intl.NumberFormat("pt-BR", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

export default function Totals() {
  const { refreshKey } = useDashboardRefresh()
  const [totals, setTotals] = useState<DashboardTotals | null>(null)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    let isCurrentRequest = true
    setHasError(false)

    axiosClient
      .get<DashboardTotals>("/dashboard/totals")
      .then(({ data }) => {
        if (isCurrentRequest) setTotals(data)
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
      <section className="col-span-2 rounded-md border bg-card p-5 text-card-foreground">
        <h2 className="text-base font-semibold">Saldo atual</h2>
        <p className="mt-4 text-sm text-muted-foreground" role="alert">
          Não foi possível carregar os totais.
        </p>
      </section>
    )
  }

  if (!totals) {
    return (
      <section
        aria-busy="true"
        className="grid min-h-72 w-full max-w-md place-items-center rounded-md border bg-card p-5 text-card-foreground"
      >
        <p className="text-sm text-muted-foreground">Carregando totais...</p>
      </section>
    )
  }

  const currentBalance = totals.totalInbound - totals.totalOutbound
  const chartData = [
    {
      key: "inbound",
      amount: totals.totalInbound,
      fill: "var(--color-inbound)",
    },
    {
      key: "outbound",
      amount: totals.totalOutbound,
      fill: "var(--color-outbound)",
    },
  ]

  return (
    <section
      aria-labelledby="totals-title"
      className="w-full max-w-md rounded-md border bg-card p-5 text-card-foreground"
    >
      <h2 id="totals-title" className="text-base font-semibold">
        Saldo atual
      </h2>

      <div className="relative mx-auto h-56 w-full max-w-72">
        <ChartContainer
          config={chartConfig}
          role="img"
          aria-label={`Entradas ${numberFormatter.format(totals.totalInbound)} e saídas ${numberFormatter.format(totals.totalOutbound)}`}
          className="aspect-auto h-full w-full"
        >
          <PieChart>
            <Pie
              data={chartData}
              dataKey="amount"
              nameKey="key"
              innerRadius={68}
              outerRadius={96}
              paddingAngle={3}
              strokeWidth={0}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  hideLabel
                  nameKey="key"
                  formatter={(value) => numberFormatter.format(Number(value))}
                />
              }
            />
          </PieChart>
        </ChartContainer>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center"
        >
          <span className="text-xs text-muted-foreground">Saldo</span>
          <span className="text-lg font-semibold tabular-nums">
            {numberFormatter.format(currentBalance)}
          </span>
        </div>
      </div>

      <ul className="grid grid-cols-2 gap-3">
        {[
          { key: "inbound" as const, amount: totals.totalInbound },
          { key: "outbound" as const, amount: totals.totalOutbound },
        ].map(({ key, amount }) => (
          <li key={key} className="min-w-0">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span
                aria-hidden="true"
                className="size-2 shrink-0 rounded-[2px]"
                style={{ backgroundColor: chartConfig[key].color }}
              />
              {chartConfig[key].label}
            </div>
            <p className="mt-1 truncate font-medium tabular-nums">
              {numberFormatter.format(amount)}
            </p>
          </li>
        ))}
      </ul>
    </section>
  )
}
