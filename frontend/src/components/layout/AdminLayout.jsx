import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function AdminLayout() {

  return (

    <div className="min-h-screen bg-gray-50">

      <Sidebar />

      <div className="ml-72">

        <Header />

        <main className="px-8 pt-24">

          <Outlet />

        </main>

      </div>

    </div>

  );

}