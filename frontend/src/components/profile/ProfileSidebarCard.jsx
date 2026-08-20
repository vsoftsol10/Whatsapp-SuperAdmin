import {
  ShieldCheck,
  UserCheck,
  Mail,
  Phone,
  Calendar,
} from "lucide-react";

export default function ProfileSidebarCard() {
  const user = JSON.parse(localStorage.getItem("user"));
  const role = localStorage.getItem("role");

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "U";

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">

      {/* Avatar */}

      <div className="flex flex-col items-center">

        <div className="w-24 h-24 rounded-full bg-[#25D366] text-white flex items-center justify-center text-3xl font-bold">

          {initials}

        </div>

        <h2 className="mt-5 text-2xl font-semibold text-gray-900">
          {user?.name}
        </h2>

        <p className="text-gray-500 mt-1">
          {user?.email}
        </p>

        <span className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-50 text-[#25D366] text-sm font-medium">

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

      {/* Divider */}

      <div className="border-t border-gray-200 my-6"></div>

      {/* Details */}

      <div className="space-y-4">

        <InfoRow
          icon={<Mail size={18} />}
          label="Email"
          value={user?.email}
        />

        <InfoRow
          icon={<Phone size={18} />}
          label="Phone"
          value={user?.phone || "-"}
        />

        <InfoRow
          icon={<Calendar size={18} />}
          label="Joined"
          value={formatDate(user?.createdAt)}
        />

      </div>

    </div>
  );
}

function InfoRow({ icon, label, value }) {
  return (
    <div className="flex items-start gap-3">

      <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center text-gray-600">

        {icon}

      </div>

      <div>

        <p className="text-xs uppercase tracking-wide text-gray-500">
          {label}
        </p>

        <p className="text-sm font-medium text-gray-900 mt-1 break-all">
          {value}
        </p>

      </div>

    </div>
  );
}