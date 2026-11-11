import { createContext, useContext, useState, type ReactNode } from "react"

type DashboardRefreshContextValue = {
  refreshKey: number
  refreshView: () => void
}

const DashboardRefreshContext =
  createContext<DashboardRefreshContextValue | null>(null)

export function DashboardRefreshProvider({
  children,
}: {
  children: ReactNode
}) {
  const [refreshKey, setRefreshKey] = useState(0)

  function refreshView() {
    setRefreshKey((current) => current + 1)
  }

  return (
    <DashboardRefreshContext.Provider value={{ refreshKey, refreshView }}>
      {children}
    </DashboardRefreshContext.Provider>
  )
}

export function useDashboardRefresh() {
  const context = useContext(DashboardRefreshContext)
  if (!context) {
    throw new Error(
      "useDashboardRefresh must be used within DashboardRefreshProvider"
    )
  }

  return context
}
