import { useEffect, useState } from "react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import axiosClient from "~/auth/axios-client"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "~/components/ui/chart"
import { useDashboardRefresh } from "~/hooks/use-dashboard-refresh"

type DashboardPeriodDay = {
  date: string
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

export default function Period() {
  const { refreshKey } = useDashboardRefresh()
  const [period, setPeriod] = useState<DashboardPeriodDay[] | null>(null)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    let isCurrentRequest = true
    setHasError(false)

    axiosClient
      .get<DashboardPeriodDay[]>("/dashboard/period")
      .then(({ data }) => {
        if (isCurrentRequest) setPeriod(data)
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
        <h2 className="text-base font-semibold">Período</h2>
        <p className="mt-4 text-sm text-muted-foreground" role="alert">
          Não foi possível carregar o período.
        </p>
      </section>
    )
  }

  if (!period) {
    return (
      <section
        aria-busy="true"
        className="grid min-h-72 w-full place-items-center rounded-md border bg-card p-5 text-card-foreground"
      >
        <p className="text-sm text-muted-foreground">Carregando período...</p>
      </section>
    )
  }

  const chartData = period.map((day) => ({
    ...day,
    inbound: day.totalInbound,
    outbound: day.totalOutbound,
  }))
  const periodTotal = period.reduce(
    (total, day) => total + day.totalInbound + day.totalOutbound,
    0
  )

  return (
    <section
      aria-labelledby="period-title"
      className="w-full rounded-md border bg-card p-5 text-card-foreground"
    >
      <h2 id="period-title" className="text-base font-semibold">
        Período
      </h2>

      <ChartContainer
        config={chartConfig}
        role="img"
        aria-label={`Movimentações dos últimos 7 dias. Entradas e saídas totalizam ${numberFormatter.format(periodTotal)}`}
        className="mt-4 aspect-auto h-56 w-full"
      >
        <BarChart
          data={chartData}
          margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(value: string) => {
              const date = new Date(`${value}T12:00:00`)
              return date.toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "2-digit",
              })
            }}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            width={48}
            tickFormatter={(value: number) => numberFormatter.format(value)}
          />
          <ChartTooltip
            cursor={false}
            content={
              <ChartTooltipContent
                labelFormatter={(value) =>
                  new Date(`${value}T12:00:00`).toLocaleDateString("pt-BR")
                }
                formatter={(value) => numberFormatter.format(Number(value))}
              />
            }
          />
          <Bar
            dataKey="inbound"
            stackId="daily-total"
            fill="var(--color-inbound)"
            radius={[0, 0, 0, 0]}
          />
          <Bar
            dataKey="outbound"
            stackId="daily-total"
            fill="var(--color-outbound)"
            radius={[3, 3, 0, 0]}
          />
        </BarChart>
      </ChartContainer>

      <div
        aria-label="Legenda"
        className="mt-4 flex flex-col items-start gap-2 text-xs"
      >
        <p className="font-medium whitespace-nowrap tabular-nums">
          Últimos 7 dias – {numberFormatter.format(periodTotal)}
        </p>
        <ul className="flex items-center gap-3 text-muted-foreground">
          {[{ key: "inbound" as const }, { key: "outbound" as const }].map(
            ({ key }) => (
              <li key={key} className="flex items-center gap-1.5">
                <span
                  aria-hidden="true"
                  className="size-2 shrink-0 rounded-[2px]"
                  style={{ backgroundColor: chartConfig[key].color }}
                />
                {chartConfig[key].label}
              </li>
            )
          )}
        </ul>
      </div>
    </section>
  )
}
