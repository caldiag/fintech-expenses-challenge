import { Outlet } from "react-router"
import Drawer from "~/components/layout/drawer"
import NavigationBar from "~/components/layout/navigation-bar"
import { DashboardRefreshProvider } from "~/hooks/use-dashboard-refresh"

export default function Dashboard() {
  return (
    <DashboardRefreshProvider>
      <div className="flex h-svh overflow-hidden">
        <Drawer />
        <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
          <NavigationBar />
          <div className="m-3 min-h-0 flex-1 overflow-y-auto">
            <Outlet />
          </div>
        </div>
      </div>
    </DashboardRefreshProvider>
  )
}
