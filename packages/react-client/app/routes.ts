import { type RouteConfig, index, route } from "@react-router/dev/routes"

export default [
  index("routes/home.tsx"),
  route("login", "routes/login.tsx"),
  route("dashboard", "routes/dashboard.tsx", [
    route("transactions", "routes/pages/dashboard/transactions.tsx"),
    route("transactions/:id", "routes/pages/dashboard/transactions.tsx", {
      id: "transaction-edit",
    }),
    route("companies", "routes/pages/dashboard/companies.tsx"),
    route("companies/:id", "routes/pages/dashboard/companies.tsx", {
      id: "company-edit",
    }),
    route("contacts", "routes/pages/dashboard/contacts.tsx"),
    route("contacts/:id", "routes/pages/dashboard/contacts.tsx", {
      id: "contact-edit",
    }),
    route("summary", "routes/pages/dashboard/summary.tsx"),
  ]),
] satisfies RouteConfig

export enum AppRoutes {
  Home = "/",
  Login = "/login",
  Dashboard = "/dashboard",
  Transactions = "/dashboard/transactions",
  Companies = "/dashboard/companies",
  Contacts = "/dashboard/contacts",
  Summary = "/dashboard/summary",
}
