import SubscriptionPlanCard from "./SubscriptionPlanCard";

export default function SubscriptionPlanList({
  plans,
  onEdit,
  onDelete,
  role,
}) {
  if (plans.length === 0) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white py-20 text-center shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">No Subscription Plans</h2>
        <p className="mt-2 text-sm text-gray-500">Create your first plan to start managing company subscriptions.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
      {plans.map((plan) => (
        <SubscriptionPlanCard
          key={plan.id}
          plan={plan}
          onEdit={onEdit}
          onDelete={onDelete}
          role={role}
        />
      ))}
    </div>
  );
}