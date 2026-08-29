import { X } from "lucide-react";
import PaymentStatusBadge from "./PaymentStatusBadge";

export default function PaymentDetailsModal({
  open,
  payment,
  onClose,
}) {
  if (!open || !payment) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

      <div className="flex max-h-[calc(100vh-2rem)] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-xl">

        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b px-4 py-4 sm:px-6">

          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Payment Details
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              View complete payment information
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 hover:bg-gray-100"
          >
            <X size={20} />
          </button>

        </div>

        {/* Body */}
        <div className="grid flex-1 grid-cols-1 gap-5 overflow-y-auto p-4 sm:grid-cols-2 sm:gap-6 sm:p-6">

          <InfoItem
            label="Payment ID"
            value={payment.paymentId}
          />

          <InfoItem
            label="Company"
            value={payment.companyName}
          />

          <InfoItem
            label="Owner"
            value={payment.ownerName}
          />

          <InfoItem
            label="Email"
            value={payment.email}
          />

          <InfoItem
            label="Phone"
            value={payment.phone}
          />

          <InfoItem
            label="Plan"
            value={payment.plan?.planName || "-"}
          />

          <InfoItem
            label="Amount"
            value={`₹${payment.amount}`}
          />

          <InfoItem
            label="Tax"
            value={`₹${payment.tax}`}
          />

          <InfoItem
            label="Discount"
            value={`₹${payment.discount}`}
          />

          <InfoItem
            label="Total Amount"
            value={`₹${payment.totalAmount}`}
          />

          <InfoItem
            label="Payment Method"
            value={payment.paymentMethod}
          />

          <InfoItem
            label="Gateway"
            value={payment.gateway || "-"}
          />

          <InfoItem
            label="Transaction ID"
            value={payment.transactionId || "-"}
          />

          <div>
            <p className="mb-2 text-sm text-gray-500">
              Payment Status
            </p>

            <PaymentStatusBadge
              status={payment.paymentStatus}
            />
          </div>

          <InfoItem
            label="Invoice Number"
            value={payment.invoiceNumber || "-"}
          />

          <InfoItem
            label="Paid Date"
            value={
              payment.paidAt
                ? new Date(payment.paidAt).toLocaleString()
                : "-"
            }
          />

        </div>

        {/* Footer */}

        <div className="flex shrink-0 justify-end border-t px-4 py-4 sm:px-6">

          <button
            onClick={onClose}
            className="rounded-xl bg-gray-900 px-5 py-2 text-white hover:bg-black"
          >
            Close
          </button>

        </div>

      </div>

    </div>
  );
}

function InfoItem({ label, value }) {
  return (
    <div>
      <p className="mb-1 text-sm text-gray-500">
        {label}
      </p>

      <p className="font-medium text-gray-900">
        {value}
      </p>
    </div>
  );
}
