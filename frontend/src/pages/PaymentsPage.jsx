// import { useEffect, useState } from "react";
// import PaymentTable from "../components/payment/PaymentTable";
// import PaymentDetailsModal from "../components/payment/PaymentDetailsModal";
// import { getPayments } from "../services/paymentService";

// export default function PaymentsPage() {
//   const [payments, setPayments] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const [selectedPayment, setSelectedPayment] = useState(null);
//   const [openModal, setOpenModal] = useState(false);

//   const loadPayments = async () => {
//     try {
//       setLoading(true);

//       const data = await getPayments();

//       setPayments(data.payments || []);
//     } catch (error) {
//       console.log(error);
//       alert("Failed to load payments");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadPayments();
//   }, []);

//   const handleView = (payment) => {
//     setSelectedPayment(payment);
//     setOpenModal(true);
//   };

//   return (
//     <div className="space-y-6">

//       {/* Page Header */}

//       <div className="flex items-center justify-between">

//         <div>
//           <h1 className="text-3xl font-bold text-gray-900">
//             Payments
//           </h1>

//           <p className="mt-1 text-gray-500">
//             Manage and monitor all customer payments.
//           </p>
//         </div>

//       </div>

//       {/* Payment Table */}

//       <PaymentTable
//         payments={payments}
//         loading={loading}
//         onView={handleView}
//       />

//       {/* Details Modal */}

//       <PaymentDetailsModal
//         open={openModal}
//         payment={selectedPayment}
//         onClose={() => {
//           setOpenModal(false);
//           setSelectedPayment(null);
//         }}
//       />

//     </div>
//   );
// }
import { useEffect, useMemo, useState } from "react";
import { Filter, RotateCcw } from "lucide-react";

import PaymentTable from "../components/payment/PaymentTable";
import PaymentDetailsModal from "../components/payment/PaymentDetailsModal";
import PaymentStats from "../components/payment/PaymentStats";

import {
  getPayments,
  getPaymentStats,
} from "../services/paymentService";

export default function PaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    totalPayments: 0,
    paidPayments: 0,
    totalRevenue: 0,
    thisMonthPayment: 0,
  });

  const [statsLoading, setStatsLoading] = useState(true);

  const [selectedPayment, setSelectedPayment] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  // ========================================
  // Filters
  // ========================================

  const [paymentMethod, setPaymentMethod] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // ========================================
  // Load Payments
  // ========================================

  const loadPayments = async () => {
    try {
      setLoading(true);

      const data = await getPayments();

      setPayments(data.payments || []);
    } catch (error) {
      console.log("Failed to load payments:", error);
      alert("Failed to load payments");
    } finally {
      setLoading(false);
    }
  };

  // ========================================
  // Load Payment Statistics
  // ========================================

  const loadPaymentStats = async () => {
    try {
      setStatsLoading(true);

      const data = await getPaymentStats();

      if (data.success) {
        setStats(data.stats);
      }
    } catch (error) {
      console.log("Failed to load payment stats:", error);
    } finally {
      setStatsLoading(false);
    }
  };

  // ========================================
  // Load Data
  // ========================================

  useEffect(() => {
    loadPayments();
    loadPaymentStats();
  }, []);

  // ========================================
  // Filter Payments
  // ========================================

  const filteredPayments = useMemo(() => {
    return payments.filter((payment) => {

      // --------------------------------
      // Payment Method Filter
      // --------------------------------

      if (
        paymentMethod &&
        payment.paymentMethod !== paymentMethod
      ) {
        return false;
      }

      // --------------------------------
      // Date Filter
      // --------------------------------

      if (fromDate || toDate) {
        const paymentDate = new Date(payment.createdAt);

        // From Date
        if (fromDate) {
          const startDate = new Date(
            `${fromDate}T00:00:00`
          );

          if (paymentDate < startDate) {
            return false;
          }
        }

        // To Date
        if (toDate) {
          const endDate = new Date(
            `${toDate}T23:59:59`
          );

          if (paymentDate > endDate) {
            return false;
          }
        }
      }

      return true;
    });
  }, [
    payments,
    paymentMethod,
    fromDate,
    toDate,
  ]);

  // ========================================
  // Reset Filters
  // ========================================

  const handleResetFilters = () => {
    setPaymentMethod("");
    setFromDate("");
    setToDate("");
  };

  // ========================================
  // View Payment
  // ========================================

  const handleView = (payment) => {
    setSelectedPayment(payment);
    setOpenModal(true);
  };

  // ========================================
  // Close Modal
  // ========================================

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedPayment(null);
  };

  // ========================================
  // Check Active Filters
  // ========================================

  const hasActiveFilters =
    paymentMethod || fromDate || toDate;

  return (
    <div className="space-y-6">

      {/* ========================================
          Page Header
      ======================================== */}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Payments
          </h1>

          <p className="mt-1 text-gray-500">
            Manage and monitor all customer payments.
          </p>
        </div>
      </div>


      {/* ========================================
          Payment Stats
      ======================================== */}

      <PaymentStats
        stats={stats}
        loading={statsLoading}
      />


      {/* ========================================
          Payment Filters
      ======================================== */}

      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">

        <div className="flex flex-col gap-4 lg:flex-row lg:items-end">

          {/* Payment Method */}

          <div className="w-full lg:flex-1">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Payment Method
            </label>

            <select
              value={paymentMethod}
              onChange={(e) =>
                setPaymentMethod(e.target.value)
              }
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none transition focus:border-[#25D366] focus:ring-2 focus:ring-[#25D366]/20"
            >
              <option value="">
                All Methods
              </option>

              <option value="RAZORPAY">
                Razorpay
              </option>

              <option value="STRIPE">
                Stripe
              </option>

              <option value="CASH">
                Cash
              </option>

              <option value="BANK_TRANSFER">
                Bank Transfer
              </option>

              <option value="UPI">
                UPI
              </option>
            </select>
          </div>


          {/* From Date */}

          <div className="w-full lg:flex-1">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              From Date
            </label>

            <input
              type="date"
              value={fromDate}
              onChange={(e) =>
                setFromDate(e.target.value)
              }
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none transition focus:border-[#25D366] focus:ring-2 focus:ring-[#25D366]/20"
            />
          </div>


          {/* To Date */}

          <div className="w-full lg:flex-1">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              To Date
            </label>

            <input
              type="date"
              value={toDate}
              min={fromDate || undefined}
              onChange={(e) =>
                setToDate(e.target.value)
              }
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none transition focus:border-[#25D366] focus:ring-2 focus:ring-[#25D366]/20"
            />
          </div>


          {/* Reset Button */}

          <button
            type="button"
            onClick={handleResetFilters}
            disabled={!hasActiveFilters}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 lg:w-auto"
          >
            <RotateCcw size={16} />

            Reset Filters
          </button>

        </div>


        {/* Filter Result */}

        {hasActiveFilters && (
          <div className="mt-4 flex items-center gap-2 border-t border-gray-100 pt-4 text-sm text-gray-500">

            <Filter size={16} />

            <span>
              Showing{" "}
              <span className="font-semibold text-gray-700">
                {filteredPayments.length}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-gray-700">
                {payments.length}
              </span>{" "}
              payments
            </span>

          </div>
        )}

      </div>


      {/* ========================================
          Payment Table
      ======================================== */}

      <PaymentTable
        payments={filteredPayments}
        loading={loading}
        onView={handleView}
      />


      {/* ========================================
          Payment Details Modal
      ======================================== */}

      <PaymentDetailsModal
        open={openModal}
        payment={selectedPayment}
        onClose={handleCloseModal}
      />

    </div>
  );
}