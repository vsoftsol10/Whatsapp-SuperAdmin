import { useEffect, useState } from "react";
import PaymentTable from "../components/payment/PaymentTable";
import PaymentDetailsModal from "../components/payment/PaymentDetailsModal";
import { getPayments } from "../services/paymentService";

export default function PaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedPayment, setSelectedPayment] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  const loadPayments = async () => {
    try {
      setLoading(true);

      const data = await getPayments();

      setPayments(data.payments || []);
    } catch (error) {
      console.log(error);
      alert("Failed to load payments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPayments();
  }, []);

  const handleView = (payment) => {
    setSelectedPayment(payment);
    setOpenModal(true);
  };

  return (
    <div className="space-y-6">

      {/* Page Header */}

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

      {/* Payment Table */}

      <PaymentTable
        payments={payments}
        loading={loading}
        onView={handleView}
      />

      {/* Details Modal */}

      <PaymentDetailsModal
        open={openModal}
        payment={selectedPayment}
        onClose={() => {
          setOpenModal(false);
          setSelectedPayment(null);
        }}
      />

    </div>
  );
}