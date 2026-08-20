import { ShieldCheck, UserCheck } from "lucide-react";

export default function AccountCard() {
  const user = JSON.parse(localStorage.getItem("user"));
  const role = localStorage.getItem("role");

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((word) => word[0])
        .join("")
        .toUpperCase()
    : "U";

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">

        {/* Left */}

        <div className="flex items-center gap-5">

          <div className="w-20 h-20 rounded-full bg-[#25D366] text-white flex items-center justify-center text-2xl font-semibold">

            {initials}

          </div>

          <div>

            <h2 className="text-2xl font-semibold text-gray-900">
              {user?.name}
            </h2>

            <p className="text-gray-500 mt-1">
              {user?.email}
            </p>

          </div>

        </div>

        {/* Right */}

        <span
          className="
            inline-flex
            items-center
            gap-2
            px-4
            py-2
            rounded-lg
            bg-green-50
            text-[#25D366]
            border
            border-green-100
            text-sm
            font-medium
            w-fit
          "
        >
          {role === "SUPER_ADMIN" ? (
            <>
              <ShieldCheck size={16} />
              Super Admin
            </>
          ) : (
            <>
              <UserCheck size={16} />
              Employee
            </>
          )}
        </span>

      </div>

    </div>
  );
}