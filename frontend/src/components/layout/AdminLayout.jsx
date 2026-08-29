import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (

    <div className="min-h-screen overflow-x-hidden bg-gray-50">

      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="lg:ml-72">

        <Header onMenuClick={() => setSidebarOpen(true)} />

        <main className="px-4 pb-6 pt-20 sm:px-6 lg:px-8 lg:pt-24">

          <Outlet />

        </main>

      </div>

    </div>

  );

}
