
import { useEffect, useState } from "react";
import { getSubscriptionPlans } from "../services/subscriptionPlanService";
import { getSubscriptions, getSubscriptionStats } from "../services/subscriptionService";
import { sendSubscriptionReminder } from "../services/subscriptionReminderService";
import SubscriptionHeader from "../components/subscription/SubscriptionHeader";
import SubscriptionStats from "../components/subscription/SubscriptionStats";
import SubscriptionTable from "../components/subscription/SubscriptionTable";
import SubscriptionReminderModal from "../components/subscription/SubscriptionReminderModal";
import { toast } from "react-hot-toast";
import SubscriptionToolbar from "../components/subscription/SubscriptionToolbar";
import Pagination from "../components/common/Pagination";

export default function SubscriptionPage() {
  const [plans, setPlans] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubscription, setSelectedSubscription] = useState(null);
  const [sending, setSending] = useState(false);
  const [stats, setStats] = useState({});
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const loadData = async () => {
    try {
      const [plansData, subscriptionsData, statsData] = await Promise.all([
        getSubscriptionPlans(),
        getSubscriptions(),
        getSubscriptionStats()
      ]);

      setPlans(plansData.plans || []);
      setSubscriptions(subscriptionsData.subscriptions || []);
      setStats(statsData.stats || {});

    } catch (error) {
      console.log("Failed to load subscription data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter]);

  const handleNotify = (subscription) => {
    setSelectedSubscription(subscription);
  };

  const handleCloseReminder = () => {
    if (sending) return;
    setSelectedSubscription(null);
  };

  const handleSendReminder = async (data) => {
    if (!selectedSubscription) return;

    try {
      setSending(true);

      const response = await sendSubscriptionReminder(
        selectedSubscription.id,
        data
      );

      if (response.success) {
        toast.success("Reminder sent successfully!");

        setSelectedSubscription(null);

        await loadData();
      }
    } catch (error) {
      console.error("Failed to send reminder:", error);

      toast.error(
        error?.response?.data?.message ||
        "Failed to send reminder. Please try again."
      );
    } finally {
      setSending(false);
    }
  };

  // ---------------- SEARCH + FILTER ----------------

  const filteredSubscriptions = subscriptions.filter((subscription) => {

    const keyword = search.toLowerCase();

    const companyName =
      subscription.company?.companyName?.toLowerCase() || "";

    const companyEmail =
      subscription.company?.email?.toLowerCase() || "";

    const planName =
      subscription.plan?.planName?.toLowerCase() || "";

    const matchesSearch =
      companyName.includes(keyword) ||
      companyEmail.includes(keyword) ||
      planName.includes(keyword);

    const matchesStatus =
      statusFilter === "ALL" ||
      subscription.status?.toUpperCase() === statusFilter;

    return matchesSearch && matchesStatus;

  });

  // ---------------- PAGINATION ----------------

  const totalPages = Math.ceil(
    filteredSubscriptions.length / itemsPerPage
  );

  const startIndex =
    (currentPage - 1) * itemsPerPage;

  const paginatedSubscriptions =
    filteredSubscriptions.slice(
      startIndex,
      startIndex + itemsPerPage
    );

  return (
    <div className="min-h-screen space-y-6 bg-gray-50 p-6">
      <SubscriptionHeader />

      <SubscriptionStats stats={stats} />

      <SubscriptionToolbar
        search={search}
        setSearch={setSearch}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        view="table"
        setView={() => { }}
      />

      <SubscriptionTable
        subscriptions={paginatedSubscriptions}
        loading={loading}
        onNotify={handleNotify}
      />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
        totalItems={filteredSubscriptions.length}
        itemsPerPage={itemsPerPage}
        itemName="subscriptions"
      />

      {selectedSubscription && (
        <SubscriptionReminderModal
          subscription={selectedSubscription}
          onClose={handleCloseReminder}
          onSend={handleSendReminder}
          sending={sending}
        />
      )}
    </div>
  );
}

