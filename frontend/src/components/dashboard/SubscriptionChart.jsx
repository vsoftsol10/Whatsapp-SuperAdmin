import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";

const COLORS = [
  "#25D366",
  "#34D399",
  "#60A5FA",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
];

export default function SubscriptionChart({ data = [] }) {
  return (
    <div className="bg-white rounded-xl shadow p-5 border border-gray-200">
      <h2 className="text-lg font-semibold mb-4">
        Subscription Plans
      </h2>

      <div className="h-[300px]">
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="count"
                nameKey="plan"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {data.map((item, index) => (
                  <Cell
                    key={index}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>

              <Tooltip />

              <Legend />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-full items-center justify-center text-gray-400">
            No subscription data available
          </div>
        )}
      </div>
    </div>
  );
}