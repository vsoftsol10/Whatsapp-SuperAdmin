import {
  CreditCard,
  IndianRupee,
  CalendarDays,
} from "lucide-react";

export default function PaymentStats({ stats, loading }) {
  const cards = [
    {
      title: "Total Payments",
      value: stats.totalPayments,
      icon: CreditCard,
    },
    {
      title: "Total Revenue",
      value: `₹${Number(stats.totalRevenue || 0).toLocaleString("en-IN")}`,
      icon: IndianRupee,
    },
    {
      title: "This Month",
      value: `₹${Number(stats.thisMonthPayment || 0).toLocaleString("en-IN")}`,
      icon: CalendarDays,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 mb-6">

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
                  {loading ? "..." : item.value}
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