import { Outlet } from "react-router"
import Drawer from "~/components/layout/drawer"
import NavigationBar from "~/components/layout/navigation-bar"

export default function Dashboard() {
  return (
    <div className="flex">
      <Drawer />
      <div className="min-w-0 flex-1 px-5 pt-18">
        <NavigationBar />
        <Outlet />
      </div>
    </div>
  )
}
