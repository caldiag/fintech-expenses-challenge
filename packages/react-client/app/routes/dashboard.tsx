import { Outlet } from "react-router"
import Drawer from "~/components/layout/drawer"
import NavigationBar from "~/components/layout/navigation-bar"
import { DashboardRefreshProvider } from "~/hooks/use-dashboard-refresh"

export default function Dashboard() {
  return (
    <DashboardRefreshProvider>
      <div className="flex">
        <Drawer />
        <div className="min-w-0 flex-1">
          <NavigationBar />
          <div className="m-3">
            <Outlet />
          </div>
        </div>
      </div>
    </DashboardRefreshProvider>
  )
}
