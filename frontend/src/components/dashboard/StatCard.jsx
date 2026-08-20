export default function StatCard({
  title,
  value,
  icon: Icon,
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md transition">

      <div className="flex items-center justify-between">

        <div>

          <p className="text-sm text-gray-500">
            {title}
          </p>

          <h2 className="mt-2 text-3xl font-bold text-gray-900">
            {value}
          </h2>

        </div>

        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-[#25D366]">

          <Icon size={22} />

        </div>

      </div>

    </div>
  );
}