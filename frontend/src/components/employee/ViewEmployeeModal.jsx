import { X, User, Mail, Phone, MapPin, BadgeCheck } from "lucide-react";

export default function ViewEmployeeModal({
  employee,
  open,
  onClose
}) {
  if (!open || !employee) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

      <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl">

        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-5">

          <div>

            <h2 className="text-xl font-bold text-gray-900">
              Employee Details
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              View employee information.
            </p>

          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 hover:bg-gray-100"
          >
            <X size={20} />
          </button>

        </div>

        <div className="grid grid-cols-1 gap-5 p-6 md:grid-cols-2">

          <InfoCard
            icon={<BadgeCheck size={18} />}
            label="Employee ID"
            value={employee.employeeId}
          />

          <InfoCard
            icon={<User size={18} />}
            label="Employee Name"
            value={employee.name}
          />

          <InfoCard
            icon={<User size={18} />}
            label="Username"
            value={employee.username}
          />

          <InfoCard
            icon={<Mail size={18} />}
            label="Email"
            value={employee.email}
          />

          <InfoCard
            icon={<Phone size={18} />}
            label="Phone"
            value={employee.phone}
          />

          <InfoCard
            icon={<BadgeCheck size={18} />}
            label="Status"
            value={employee.status}
          />

          <div className="md:col-span-2">

            <div className="rounded-xl border border-gray-200 p-4">

              <div className="mb-2 flex items-center gap-2">

                <MapPin
                  size={18}
                  className="text-green-600"
                />

                <p className="font-semibold text-gray-700">
                  Address
                </p>

              </div>

              <p className="text-sm text-gray-600">
                {employee.address || "-"}
              </p>

            </div>

          </div>

        </div>

        <div className="flex justify-end border-t border-gray-200 px-6 py-4">

          <button
            onClick={onClose}
            className="rounded-xl bg-[#25D366] px-6 py-2.5 font-medium text-white hover:bg-[#20bd5a]"
          >
            Close
          </button>

        </div>

      </div>

    </div>
  );
}

function InfoCard({
  icon,
  label,
  value
}) {
  return (
    <div className="rounded-xl border border-gray-200 p-4">

      <div className="mb-2 flex items-center gap-2 text-green-600">

        {icon}

        <p className="text-sm font-medium text-gray-600">
          {label}
        </p>

      </div>

      <p className="text-base font-semibold text-gray-900">
        {value || "-"}
      </p>

    </div>
  );
}