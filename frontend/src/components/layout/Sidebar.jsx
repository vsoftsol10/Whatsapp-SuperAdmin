
import { NavLink, useNavigate } from "react-router-dom";
import { menuItems } from "../../config/menuItems";
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
  ArrowUpCircle,
  History,
  LogOut
} from "lucide-react";

const role = localStorage.getItem("role");

export default function Sidebar() {
  const role = localStorage.getItem("role") || "SUPER_ADMIN";

  const user =
    role === "SUPER_ADMIN"
      ? JSON.parse(localStorage.getItem("admin") || "{}")
      : JSON.parse(localStorage.getItem("employee") || "{}");

  const navigate = useNavigate();

const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  localStorage.removeItem("admin");
  localStorage.removeItem("employee");

  navigate("/");
};


  return (
    <aside className="fixed top-0 left-0 flex h-screen w-72 flex-col bg-[#111827] text-white shadow-xl">

      {/* Logo */}

      <div className="flex h-20 items-center border-b border-gray-700 px-6">

        <div>

          <h1 className="text-2xl font-bold">
            <span className="text-[#25D366]">
              WhatsApp
            </span>
            CRM
          </h1>

          <p className="mt-1 text-xs text-gray-400">
            {role === "SUPER_ADMIN"
              ? "Super Admin Panel"
              : "Employee Panel"}
          </p>

        </div>

      </div>

      {/* Menu */}

      <div className="flex-1 overflow-y-auto px-4 py-5">

        <p className="mb-4 px-3 text-xs uppercase tracking-wider text-gray-400">
          Management
        </p>

        {menuItems
          .filter(item => item.roles.includes(role))
          .map(item => {

            const Icon = item.icon;

            return (

              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `mb-1 flex items-center gap-4 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-[#25D366] text-white shadow-lg"
                      : "text-gray-300 hover:bg-[#25D366] hover:text-white"
                  }`
                }
              >

                <Icon size={20} />

                <span>
                  {item.name}
                </span>

              </NavLink>

            );

          })}

      </div>

    </aside>
  );
}