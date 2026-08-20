import { Check, Eye, Pencil, Trash2 } from "lucide-react";

export default function SubscriptionPlanCardView({
  plans,
  onView,
  onEdit,
  onDelete
}) {
  const getPlanStyle = (planName) => {
    const name = planName?.toLowerCase();

    if (name?.includes("trial")) {
      return "border-yellow-200 bg-yellow-50";
    }

    if (name?.includes("professional")) {
      return "border-green-200 bg-green-50";
    }

    if (name?.includes("enterprise")) {
      return "border-purple-200 bg-purple-50";
    }

    return "border-gray-200 bg-white";
  };

  if (plans.length === 0) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white py-16 text-center shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900">
          No Plans Found
        </h3>

        <p className="mt-2 text-sm text-gray-500">
          No subscription plans match your search.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
      {plans.map((plan) => (
        <div
          key={plan.id}
          className={`flex min-h-[460px] flex-col rounded-2xl border p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md ${getPlanStyle(plan.planName)}`}
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl font-semibold text-gray-900">
                  {plan.planName}
                </h2>

                {plan.isTrial && (
                  <span className="rounded-full bg-yellow-100 px-2.5 py-1 text-xs font-semibold text-yellow-700">
                    Free Trial
                  </span>
                )}
              </div>

              <p className="mt-2 text-sm text-gray-500">
                {plan.durationDays} days validity
              </p>
            </div>

            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                plan.status === "ACTIVE"
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              {plan.status}
            </span>
          </div>

          <div className="my-6 border-t border-gray-200"></div>

          <div>
            <p className="text-sm text-gray-500">
              Plan Price
            </p>

            <div className="mt-1 flex items-end gap-1">
              <span className="text-3xl font-bold text-gray-900">
                ₹{Number(plan.price || 0).toLocaleString("en-IN")}
              </span>

              <span className="mb-1 text-sm text-gray-500">
                / {plan.durationDays} days
              </span>
            </div>
          </div>

          <div className="my-6 grid grid-cols-2 gap-3">
            <LimitBox
              label="Users"
              value={plan.maxUsers}
            />

            <LimitBox
              label="Contacts"
              value={plan.maxContacts}
            />

            <LimitBox
              label="Campaigns"
              value={plan.maxCampaigns}
            />

            <LimitBox
              label="Bots"
              value={plan.maxBots}
            />
          </div>

          <div className="flex-1">
            <p className="mb-3 text-sm font-semibold text-gray-800">
              Included Features
            </p>

            {Array.isArray(plan.features) && plan.features.length > 0 ? (
              <div className="space-y-2.5">
                {plan.features.slice(0, 5).map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-2 text-sm text-gray-600"
                  >
                    <Check
                      size={17}
                      className="mt-0.5 shrink-0 text-green-600"
                    />

                    <span>{feature}</span>
                  </div>
                ))}

                {plan.features.length > 5 && (
                  <p className="pl-6 text-xs font-medium text-green-600">
                    +{plan.features.length - 5} more features
                  </p>
                )}
              </div>
            ) : (
              <p className="text-sm text-gray-400">
                No features added.
              </p>
            )}
          </div>

          <div className="mt-6 flex items-center gap-3 border-t border-gray-200 pt-5">
            <button
              type="button"
              onClick={() => onView(plan)}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
            >
              <Eye size={17} />
              View
            </button>

            <button
              type="button"
              onClick={() => onEdit(plan)}
              className="flex items-center justify-center rounded-xl border border-green-200 bg-green-50 p-2.5 text-green-700 transition hover:bg-green-100"
              title="Edit Plan"
            >
              <Pencil size={17} />
            </button>

            <button
              type="button"
              onClick={() => onDelete(plan)}
              className="flex items-center justify-center rounded-xl border border-red-200 bg-red-50 p-2.5 text-red-600 transition hover:bg-red-100"
              title="Delete Plan"
            >
              <Trash2 size={17} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

function LimitBox({ label, value }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white/80 px-3 py-3">
      <p className="text-xs text-gray-500">
        {label}
      </p>

      <p className="mt-1 text-base font-semibold text-gray-900">
        {value}
      </p>
    </div>
  );
}