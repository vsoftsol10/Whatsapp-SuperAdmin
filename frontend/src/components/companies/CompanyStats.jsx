import { useEffect, useState } from "react";
import {
  Building2,
  CircleCheckBig,
  Clock3,
  CircleOff,
  CircleX
} from "lucide-react";
import api from "../../api/axios";

export default function CompanyStats() {

  const [stats, setStats] = useState({
    totalCompanies: 0,
    activeCompanies: 0,
    trialCompanies: 0,
    inactiveCompanies: 0,
    expiredCompanies: 0
  });

  const loadStats = async () => {

    try {

     const { data } = await api.get("/companies/stats");

      if (data.success) {
        setStats(data.stats);
      }

    } catch (error) {

      console.log(error);

    }

  };

  useEffect(() => {
    loadStats();
  }, []);

  const cards = [
    {
      title: "Total Companies",
      value: stats.totalCompanies,
      icon: Building2
    },
    {
      title: "Active",
      value: stats.activeCompanies,
      icon: CircleCheckBig
    },
    {
      title: "Trial",
      value: stats.trialCompanies,
      icon: Clock3
    },
    {
      title: "Inactive",
      value: stats.inactiveCompanies,
      icon: CircleOff
    },
    {
      title: "Expired",
      value: stats.expiredCompanies,
      icon: CircleX
    }
  ];

  return (

    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-5 mb-6">

      {cards.map((item) => {

        const Icon = item.icon;

        return (

          <div
            key={item.title}
            className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm hover:shadow-lg transition-all"
          >

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm font-medium text-gray-500">
                  {item.title}
                </p>

                <h2 className="mt-2 text-3xl font-bold text-gray-900">
                  {item.value}
                </h2>

              </div>

              <div className="w-12 h-12 rounded-xl bg-[#25D366]/10 flex items-center justify-center">

                <Icon
                  size={24}
                  className="text-[#25D366]"
                />

              </div>

            </div>

          </div>

        );

      })}

    </div>

  );

}