

import { useEffect, useState } from "react";
import { ArrowLeft, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import SubscriptionPlanList from "../components/subscriptionPlan/SubscriptionPlanList";
import AddSubscriptionPlanModal from "../components/subscriptionPlan/AddSubscriptionPlanModal";
import PageLoader from "../components/common/PageLoader";

import {
  getSubscriptionPlans,
  createSubscriptionPlan,
  updateSubscriptionPlan,
} from "../services/subscriptionPlanService";

export default function SubscriptionPlansPage() {
  const navigate = useNavigate();

  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [editPlan, setEditPlan] = useState(null);
  const role = localStorage.getItem("role");

  const loadPlans = async () => {
    try {
      setLoading(true);

      const data = await getSubscriptionPlans();

      setPlans(data.plans || []);
    } catch (error) {
      console.log(error);
      toast.error("Failed to load subscription plans");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPlans();
  }, []);

  const handleSavePlan = async (planData) => {
    try {
      if (editPlan) {
        await updateSubscriptionPlan(editPlan.id, planData);

        toast.success("Subscription plan updated successfully!");
      } else {
        await createSubscriptionPlan(planData);

        toast.success("Subscription plan created successfully");
      }

      setOpenModal(false);
      setEditPlan(null);

      loadPlans();
    } catch (error) {
      console.log(error);

      toast.error(
        error.response?.data?.message ||
        "Failed to save subscription plan"
      );
    }
  };

  const handleEdit = (plan) => {
    setEditPlan(plan);
    setOpenModal(true);
  };

  const handleCreatePlan = async (planData) => {
    try {
      await createSubscriptionPlan(planData);

      toast.success("Subscription plan created successfully!");

      setOpenModal(false);

      loadPlans();
    } catch (error) {
      console.log(error);

      toast.error(
        error.response?.data?.message ||
        "Failed to create subscription plan"
      );
    }
  };

  return (
    <div className="p-4 sm:p-6">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3 sm:items-center sm:gap-4">
          <button
            onClick={() => navigate("/subscriptions")}
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-gray-300 bg-white text-gray-700 shadow-sm transition hover:bg-gray-100"
          >
            <ArrowLeft size={22} />
          </button>

          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Subscription Plans
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Create and manage pricing plans for your WhatsApp CRM.
            </p>
          </div>
        </div>

        {/* Add Button */}
        {role === "SUPER_ADMIN" && (
          <button
            onClick={() => {
              setEditPlan(null);
              setOpenModal(true);
            }}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] px-5 py-3 text-white hover:bg-[#1fb85a] sm:w-auto"
          >
            <Plus size={18} />
            Add Plan
          </button>
        )}
      </div>

      {/* Plans */}
      {loading ? (
        <div className="py-20 text-center">
          <PageLoader label="Loading plans..." />
        </div>
      ) : (
        <SubscriptionPlanList
          plans={plans}
          onEdit={handleEdit}
          onDelete={() => { }}
          role={role}
        />
      )}

      {/* Add Subscription Plan Modal */}
      <AddSubscriptionPlanModal
        open={openModal}
        editPlan={editPlan}
        onClose={() => {
          setOpenModal(false);
          setEditPlan(null);
        }}
        onSubmit={handleSavePlan}
      />
    </div>
  );
}
