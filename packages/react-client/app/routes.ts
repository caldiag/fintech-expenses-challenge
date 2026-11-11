import { type RouteConfig, index, route } from "@react-router/dev/routes"

export default [
  index("routes/home.tsx"),
  route("login", "routes/pages/login.tsx"),
  route("dashboard", "routes/pages/dashboard/dashboard.tsx", [
    route("transactions", "routes/pages/dashboard/transactions.tsx"),
    route("companies", "routes/pages/dashboard/companies.tsx"),
    route("contacts", "routes/pages/dashboard/contacts.tsx"),
  ]),
] satisfies RouteConfig
