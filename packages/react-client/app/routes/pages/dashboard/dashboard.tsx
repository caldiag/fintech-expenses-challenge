import { Outlet } from "react-router"
import Drawer from "~/components/layout/drawer"
import NavigationBar from "~/components/layout/navigation-bar"

export default function Dashboard() {
  return (
    <div className="flex">
      <Drawer />
      <div className="px-5 pt-12">
        <NavigationBar />
        <Outlet />
      </div>
    </div>
  )
}
