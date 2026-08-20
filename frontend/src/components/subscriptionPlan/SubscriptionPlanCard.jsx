import { useState, useRef, useEffect } from "react";
import {
  MoreVertical,
  Pencil,
  Trash2,
  Users,
  Contact,
  Megaphone,
  FileText,
  CalendarDays
} from "lucide-react";

export default function SubscriptionPlanCard({
  plan,
  onEdit,
  onDelete,
  role,
}) {
  const features = Array.isArray(plan.features) ? plan.features : [];
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      {plan.isTrial && (
        <span className="absolute right-14 top-5 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
          Free Trial
        </span>
      )}

      {/* 3-dot menu */}
      {role === "SUPER_ADMIN" && (
        <div className="absolute right-5 top-5" ref={menuRef}>
          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            className="flex h-8 w-8 items-center justify-center rounded-full text-gray-500 transition hover:bg-gray-100 hover:text-gray-700"
          >
            <MoreVertical size={18} />
          </button>

          {menuOpen && (
            <div className="absolute right-0 z-10 mt-1 w-36 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-lg">
              <button
                onClick={() => {
                  setMenuOpen(false);
                  onEdit(plan);
                }}
                className="flex w-full items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
              >
                <Pencil size={15} />
                Edit
              </button>

              <button
                onClick={() => {
                  setMenuOpen(false);
                  onDelete(plan);
                }}
                className="flex w-full items-center gap-2 px-4 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50"
              >
                <Trash2 size={15} />
                Delete
              </button>
            </div>
          )}
        </div>
      )}

      <div className="border-b border-gray-100 pb-5 pr-8">
        <h3 className="text-xl font-semibold text-gray-900">{plan.planName}</h3>

        <div className="mt-3 flex items-end gap-1">
          <span className="text-3xl font-bold text-gray-900">
            ₹{Number(plan.price || 0).toLocaleString("en-IN")}
          </span>

          <span className="mb-1 text-sm text-gray-500">
            / {plan.durationDays} days
          </span>
        </div>

        <span className={`mt-4 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${plan.status === "ACTIVE" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
          {plan.status}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 py-5">
        <LimitItem
          icon={<Users size={17} />}
          label="Users"
          value={plan.maxUsers}
        />

        <LimitItem
          icon={<Contact size={17} />}
          label="Customers"
          value={plan.maxCustomers}
        />

        <LimitItem
          icon={<Megaphone size={17} />}
          label="Campaigns"
          value={plan.maxCampaigns}
        />

        <LimitItem
          icon={<FileText size={17} />}
          label="Templates"
          value={plan.maxTemplates}
        />
      </div>

      <div className="border-t border-gray-100 pt-5">
        <div className="mb-3 flex items-center gap-2">
          <CalendarDays size={17} className="text-green-600" />
          <p className="text-sm font-semibold text-gray-800">Features</p>
        </div>

        {features.length > 0 ? (
          <div className="space-y-2">
            {features.slice(0, 5).map((feature, index) => (
              <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                <span className="h-1.5 w-1.5 rounded-full bg-green-500"></span>
                <span>{feature}</span>
              </div>
            ))}

            {features.length > 5 && (
              <p className="pt-1 text-xs font-medium text-green-600">
                +{features.length - 5} more features
              </p>
            )}
          </div>
        ) : (
          <p className="text-sm text-gray-400">No features added</p>
        )}
      </div>
    </div>
  );
}

function LimitItem({ icon, label, value }) {
  return (
    <div className="rounded-xl bg-gray-50 p-3">
      <div className="flex items-center gap-2 text-gray-500">
        {icon}
        <span className="text-xs">{label}</span>
      </div>

      <p className="mt-2 text-lg font-semibold text-gray-900">
        {value === -1 ? "Unlimited" : value}
      </p>
    </div>
  );
}