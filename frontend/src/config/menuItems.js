import {
  LayoutDashboard,
  Building2,
  CreditCard,
  Users,
  Wallet,
  BarChart3,
  Ticket,
  Bell,
  Settings,
  LogOut,
  ArrowUpCircle,
  History
} from "lucide-react";


export const menuItems = [
  {
    name: "Dashboard",
    icon: LayoutDashboard,
    path: "/dashboard",
    roles: ["SUPER_ADMIN", "EMPLOYEE"]
  },
  {
    name: "Companies",
    icon: Building2,
    path: "/companies",
    roles: ["SUPER_ADMIN", "EMPLOYEE"]
  },
  {
    name: "Subscriptions",
    icon: CreditCard,
    path: "/subscriptions",
    roles: ["SUPER_ADMIN", "EMPLOYEE"]
  },
  {
    name: "Employees",
    icon: Users,
    path: "/employees",
    roles: ["SUPER_ADMIN"]
  },
  {
    name: "Support Tickets",
    icon: Ticket,
    path: "/tickets",
    roles: ["SUPER_ADMIN", "EMPLOYEE"]
  },
  {
    name: "Upgrade Requests",
    icon: ArrowUpCircle,
    path: "/upgrade-requests",
    roles: ["SUPER_ADMIN"]
  },
  {
    name: "Payment",
    icon: Wallet,
    path: "/payments",
    roles: ["SUPER_ADMIN", "EMPLOYEE"]
  },
  {
    name: "Audit Logs",
    icon: History,
    path: "/audit-logs",
    roles: ["SUPER_ADMIN"]
  },
  {
    name: "Settings",
    icon: Settings,
    path: "/profile",
    roles: ["SUPER_ADMIN", "EMPLOYEE"]
  },
];