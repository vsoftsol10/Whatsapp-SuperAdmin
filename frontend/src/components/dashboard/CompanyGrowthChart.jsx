import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Building2, TrendingUp } from "lucide-react";

export default function CompanyGrowthChart({ data = [] }) {
  const totalCompanies = data.reduce(
    (sum, item) => sum + item.companies,
    0
  );

  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">

      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">

        <div className="flex items-center gap-3">

          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100">
            <Building2
              size={22}
              className="text-[#25D366]"
            />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Company Growth
            </h2>

            <p className="text-sm text-gray-500">
              Monthly company registrations
            </p>
          </div>

        </div>

        <div className="rounded-full bg-green-50 px-4 py-2">

          <div className="flex items-center gap-2">

            <TrendingUp
              size={16}
              className="text-[#25D366]"
            />

            <span className="text-sm font-semibold text-[#25D366]">
              {totalCompanies} Companies
            </span>

          </div>

        </div>

      </div>

      {/* Chart */}

      <div className="h-[340px] p-5">

        {data.length > 0 ? (

          <ResponsiveContainer width="100%" height="100%">

            <BarChart
              data={data}
              barCategoryGap={25}
              margin={{
                top: 20,
                right: 20,
                left: 0,
                bottom: 5,
              }}
            >

              <CartesianGrid
                strokeDasharray="4 4"
                vertical={false}
                stroke="#E5E7EB"
              />

              <XAxis
                dataKey="month"
                tick={{
                  fill: "#6B7280",
                  fontSize: 13,
                }}
                axisLine={false}
                tickLine={false}
              />

              <YAxis
                allowDecimals={false}
                tick={{
                  fill: "#6B7280",
                  fontSize: 13,
                }}
                axisLine={false}
                tickLine={false}
              />

              <Tooltip
                cursor={{
                  fill: "#F9FAFB",
                }}
                contentStyle={{
                  borderRadius: "12px",
                  border: "1px solid #E5E7EB",
                  boxShadow:
                    "0 10px 20px rgba(0,0,0,0.08)",
                }}
              />

              <Bar
                dataKey="companies"
                fill="#25D366"
                radius={[10, 10, 0, 0]}
                maxBarSize={45}
                animationDuration={800}
              />

            </BarChart>

          </ResponsiveContainer>

        ) : (

          <div className="flex h-full flex-col items-center justify-center">

            <Building2
              size={50}
              className="mb-4 text-gray-300"
            />

            <h3 className="text-lg font-semibold text-gray-600">
              No Company Data
            </h3>

            <p className="mt-2 text-sm text-gray-400">
              Company growth statistics will appear here.
            </p>

          </div>

        )}

      </div>

    </div>
  );
}