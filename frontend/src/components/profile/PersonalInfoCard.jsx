import {
  User,
  Mail,
  Phone,
  Hash,
  MapPin,
  Shield,
  CheckCircle,
} from "lucide-react";

export default function PersonalInfoCard() {
  const user = JSON.parse(localStorage.getItem("user"));
  const role = localStorage.getItem("role");

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">

      {/* Header */}

      <div className="px-6 py-5 border-b border-gray-200 flex items-center gap-3">

        <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">

          <User
            size={20}
            className="text-[#25D366]"
          />

        </div>

        <div>

          <h2 className="text-lg font-semibold">
            Personal Information
          </h2>

          <p className="text-sm text-gray-500">
            Your account details
          </p>

        </div>

      </div>

      {/* Body */}

      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">

        <InputField
          icon={<User size={18} />}
          label="Full Name"
          value={user?.name}
        />

        <InputField
          icon={<Hash size={18} />}
          label="Employee ID"
          value={user?.employeeId || "-"}
        />

        <InputField
          icon={<Mail size={18} />}
          label="Email"
          value={user?.email}
        />

        <InputField
          icon={<Phone size={18} />}
          label="Phone"
          value={user?.phone || "-"}
        />

        <InputField
          icon={<User size={18} />}
          label="Username"
          value={user?.username || "-"}
        />

        <InputField
          icon={<Shield size={18} />}
          label="Role"
          value={
            role === "SUPER_ADMIN"
              ? "Super Admin"
              : "Employee"
          }
        />

        <InputField
          icon={<CheckCircle size={18} />}
          label="Status"
          value={user?.status || "Active"}
        />

        <InputField
          icon={<Hash size={18} />}
          label="User ID"
          value={user?.id}
        />

      </div>

      {/* Address */}

      <div className="px-6 pb-6">

        <InputField
          icon={<MapPin size={18} />}
          label="Address"
          value={user?.address || "-"}
          full
        />

      </div>

    </div>
  );
}

function InputField({
  icon,
  label,
  value,
  full = false,
}) {
  return (
    <div className={full ? "w-full" : ""}>

      <label className="block text-sm font-medium text-gray-600 mb-2">

        {label}

      </label>

      <div className="relative">

        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">

          {icon}

        </div>

        <input
          readOnly
          value={value || "-"}
          className="
            w-full
            h-11
            pl-11
            pr-4
            rounded-xl
            border
            border-gray-300
            bg-gray-50
            text-gray-700
            outline-none
            cursor-default
          "
        />

      </div>

    </div>
  );
}