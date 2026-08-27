import { useEffect, useState } from "react";
import {
  Building2,
  Users,
  Ticket,
  XCircle,
} from "lucide-react";

import StatCard from "../components/dashboard/StatCard";
import CompanyGrowthChart from "../components/dashboard/CompanyGrowthChart";
import SubscriptionChart from "../components/dashboard/SubscriptionChart";
import SupportTicketTable from "../components/dashboard/SupportTicketTable";
import PageLoader from "../components/common/PageLoader";

import { getDashboard } from "../api/dashboardApi";

export default function DashboardPage() {

  const [dashboard, setDashboard] = useState({
    totalCompanies: 0,
    totalEmployees: 0,
    totalTickets: 0,
    expiredCompanies: 0,
    companyGrowth: [],
    subscriptionStats: [],
    tickets: [],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const loadDashboard = async () => {

      try {

        const data = await getDashboard();

        console.log("Dashboard API:", data);

        setDashboard(data);

      } catch (error) {

        console.log(error.response?.data || error.message);

      } finally {

        setLoading(false);

      }

    };

    loadDashboard();

  }, []);

  if (loading) {
    return (
      <PageLoader variant="page" label="Loading dashboard..." />
    );
  }

  const stats = [
    {
      title: "Total Companies",
      value: dashboard.totalCompanies,
      icon: Building2,
    },
    {
      title: "Total Employees",
      value: dashboard.totalEmployees,
      icon: Users,
    },
    {
      title: "Total Tickets",
      value: dashboard.totalTickets,
      icon: Ticket,
    },
    {
      title: "Expired Companies",
      value: dashboard.expiredCompanies,
      icon: XCircle,
    },
  ];

  return (
    <div className="space-y-6">

      <div className="flex items-center justify-between">

        <div>

          <h1 className="text-3xl font-bold">
            Dashboard
          </h1>

          <p className="text-gray-500 mt-1">
            Monitor your CRM overview
          </p>

        </div>
{/* 
        <button className="rounded-lg bg-[#25D366] px-5 py-2 text-white hover:bg-green-600 transition">
          View Report
        </button> */}

      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => (
          <StatCard
            key={item.title}
            {...item}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">

        <CompanyGrowthChart
          data={dashboard.companyGrowth}
        />

        <SubscriptionChart
          data={dashboard.subscriptionStats}
        />

      </div>

      <SupportTicketTable
        tickets={dashboard.tickets}
      />

    </div>
  );
}
