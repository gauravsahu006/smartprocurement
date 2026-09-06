import { useMemo, useState } from "react";
import {
  Banknote,
  CheckCircle2,
  Clock3,
  Download,
  Eye,
  Search,
  XCircle,
} from "lucide-react";

const paymentData = [
  {
    id: "TXN123456789",
    bookingId: "SP241124",
    farmer: "Rajesh Kumar",
    token: "#124",
    crop: "Wheat",
    quantity: 48.5,
    rate: 2125,
    amount: 103062.5,
    method: "Bank Transfer",
    date: "06 Sep 2026, 11:30 AM",
    status: "Successful",
  },
  {
    id: "TXN123456790",
    bookingId: "SP241125",
    farmer: "Ramesh Mahto",
    token: "#125",
    crop: "Wheat",
    quantity: 32,
    rate: 2125,
    amount: 68000,
    method: "Bank Transfer",
    date: "06 Sep 2026, 12:15 PM",
    status: "Pending",
  },
  {
    id: "TXN123456791",
    bookingId: "SP241126",
    farmer: "Sita Devi",
    token: "#126",
    crop: "Maize",
    quantity: 25,
    rate: 1900,
    amount: 47500,
    method: "UPI",
    date: "06 Sep 2026, 01:05 PM",
    status: "Successful",
  },
  {
    id: "TXN123456792",
    bookingId: "SP241120",
    farmer: "Mohan Oraon",
    token: "#120",
    crop: "Wheat",
    quantity: 40,
    rate: 2125,
    amount: 85000,
    method: "Bank Transfer",
    date: "05 Sep 2026, 02:20 PM",
    status: "Successful",
  },
  {
    id: "TXN123456793",
    bookingId: "SP241118",
    farmer: "Birsa Tudu",
    token: "#118",
    crop: "Maize",
    quantity: 28,
    rate: 1900,
    amount: 53200,
    method: "UPI",
    date: "05 Sep 2026, 03:10 PM",
    status: "Failed",
  },
];

function Payments() {
  const [payments, setPayments] = useState(paymentData);
  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");
  const [selectedPayment, setSelectedPayment] = useState(null);

  const filteredPayments = useMemo(() => {
    const value = search.toLowerCase();

    return payments.filter((payment) => {
      const matchesTab =
        activeTab === "All" || payment.status === activeTab;

      const matchesSearch =
        payment.farmer.toLowerCase().includes(value) ||
        payment.bookingId.toLowerCase().includes(value) ||
        payment.id.toLowerCase().includes(value) ||
        payment.token.toLowerCase().includes(value);

      return matchesTab && matchesSearch;
    });
  }, [payments, activeTab, search]);

  const totalAmount = payments.reduce(
    (total, payment) =>
      payment.status === "Successful"
        ? total + payment.amount
        : total,
    0
  );

  const pendingAmount = payments.reduce(
    (total, payment) =>
      payment.status === "Pending"
        ? total + payment.amount
        : total,
    0
  );

  const successfulCount = payments.filter(
    (payment) => payment.status === "Successful"
  ).length;

  const pendingCount = payments.filter(
    (payment) => payment.status === "Pending"
  ).length;

  const initiatePayment = (paymentId) => {
    setPayments((prev) =>
      prev.map((payment) =>
        payment.id === paymentId
          ? {
              ...payment,
              status: "Successful",
              date: "06 Sep 2026, 02:30 PM",
            }
          : payment
      )
    );
  };

  return (
    <div className="mx-auto max-w-[1280px] px-4 py-5 sm:px-6 lg:px-7">
      {/* Header */}
      <div>
        <h1 className="text-lg font-extrabold text-blue-950 sm:text-xl">
          Payments
        </h1>

        <p className="mt-1 text-[10px] text-slate-500 sm:text-xs">
          Manage farmer payments and transaction records.
        </p>
      </div>

      {/* Summary */}
      <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <SummaryCard
          icon={Banknote}
          label="Total Paid"
          value={`₹${totalAmount.toLocaleString("en-IN", {
            maximumFractionDigits: 0,
          })}`}
        />

        <SummaryCard
          icon={Clock3}
          label="Pending Amount"
          value={`₹${pendingAmount.toLocaleString("en-IN", {
            maximumFractionDigits: 0,
          })}`}
        />

        <SummaryCard
          icon={CheckCircle2}
          label="Successful"
          value={successfulCount}
        />

        <SummaryCard
          icon={Clock3}
          label="Pending Payments"
          value={pendingCount}
        />
      </div>

      {/* Filters */}
      <div className="mt-5 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2">
            {["All", "Successful", "Pending", "Failed"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`rounded-md px-3 py-2 text-[9px] font-bold transition ${
                  activeTab === tab
                    ? "bg-green-700 text-white"
                    : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="relative w-full lg:max-w-[280px]">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />

            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search farmer, booking or transaction..."
              className="h-9 w-full rounded-md border border-slate-200 bg-slate-50 pl-9 pr-3 text-[9px] outline-none focus:border-green-600 focus:bg-white"
            />
          </div>
        </div>
      </div>

      {/* Desktop Table */}
      <div className="mt-4 hidden overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm lg:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="px-4 py-3 text-left text-[8px] font-bold text-slate-500">
                  Farmer
                </th>
                <th className="px-4 py-3 text-left text-[8px] font-bold text-slate-500">
                  Booking
                </th>
                <th className="px-4 py-3 text-left text-[8px] font-bold text-slate-500">
                  Quantity
                </th>
                <th className="px-4 py-3 text-left text-[8px] font-bold text-slate-500">
                  Amount
                </th>
                <th className="px-4 py-3 text-left text-[8px] font-bold text-slate-500">
                  Method
                </th>
                <th className="px-4 py-3 text-left text-[8px] font-bold text-slate-500">
                  Status
                </th>
                <th className="px-4 py-3 text-right text-[8px] font-bold text-slate-500">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredPayments.map((payment) => (
                <tr
                  key={payment.id}
                  className="border-b border-slate-100 last:border-0"
                >
                  <td className="px-4 py-3">
                    <p className="text-[9px] font-bold text-blue-950">
                      {payment.farmer}
                    </p>

                    <p className="mt-0.5 text-[8px] text-slate-500">
                      Token {payment.token}
                    </p>
                  </td>

                  <td className="px-4 py-3">
                    <p className="text-[8px] font-semibold text-slate-700">
                      {payment.bookingId}
                    </p>

                    <p className="mt-0.5 text-[7px] text-slate-400">
                      {payment.date}
                    </p>
                  </td>

                  <td className="px-4 py-3 text-[9px] font-semibold text-slate-700">
                    {payment.quantity} Qtl
                  </td>

                  <td className="px-4 py-3">
                    <p className="text-[9px] font-extrabold text-blue-950">
                      ₹
                      {payment.amount.toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                      })}
                    </p>

                    <p className="mt-0.5 text-[7px] text-slate-400">
                      ₹{payment.rate.toLocaleString("en-IN")} / Qtl
                    </p>
                  </td>

                  <td className="px-4 py-3 text-[8px] font-semibold text-slate-600">
                    {payment.method}
                  </td>

                  <td className="px-4 py-3">
                    <PaymentStatus status={payment.status} />
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setSelectedPayment(payment)}
                        className="flex items-center gap-1 rounded-md border border-slate-200 px-2.5 py-2 text-[8px] font-bold text-slate-600 hover:bg-slate-50"
                      >
                        <Eye className="h-3 w-3" />
                        View
                      </button>

                      {payment.status === "Pending" && (
                        <button
                          onClick={() => initiatePayment(payment.id)}
                          className="rounded-md bg-green-700 px-2.5 py-2 text-[8px] font-bold text-white hover:bg-green-800"
                        >
                          Pay Now
                        </button>
                      )}

                      {payment.status === "Successful" && (
                        <button
                          onClick={() => window.print()}
                          className="flex items-center gap-1 rounded-md bg-green-50 px-2.5 py-2 text-[8px] font-bold text-green-700 hover:bg-green-100"
                        >
                          <Download className="h-3 w-3" />
                          Receipt
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredPayments.length === 0 && <EmptyState />}
      </div>

      {/* Mobile Cards */}
      <div className="mt-4 space-y-3 lg:hidden">
        {filteredPayments.map((payment) => (
          <div
            key={payment.id}
            className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="rounded-md bg-green-50 px-2 py-1 text-[8px] font-extrabold text-green-700">
                    {payment.token}
                  </span>

                  <p className="text-[10px] font-extrabold text-blue-950">
                    {payment.farmer}
                  </p>
                </div>

                <p className="mt-1 text-[8px] text-slate-500">
                  {payment.bookingId} • {payment.crop}
                </p>
              </div>

              <PaymentStatus status={payment.status} />
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <InfoItem
                label="Quantity"
                value={`${payment.quantity} Qtl`}
              />

              <InfoItem
                label="Amount"
                value={`₹${payment.amount.toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                })}`}
              />

              <InfoItem
                label="Payment Method"
                value={payment.method}
              />

              <InfoItem
                label="Date"
                value={payment.date}
              />
            </div>

            <div className="mt-4 flex gap-2">
              <button
                onClick={() => setSelectedPayment(payment)}
                className="flex flex-1 items-center justify-center gap-1 rounded-md border border-slate-200 py-2 text-[8px] font-bold text-slate-600"
              >
                <Eye className="h-3 w-3" />
                View Details
              </button>

              {payment.status === "Pending" && (
                <button
                  onClick={() => initiatePayment(payment.id)}
                  className="flex-1 rounded-md bg-green-700 py-2 text-[8px] font-bold text-white"
                >
                  Initiate Payment
                </button>
              )}

              {payment.status === "Successful" && (
                <button
                  onClick={() => window.print()}
                  className="flex flex-1 items-center justify-center gap-1 rounded-md bg-green-50 py-2 text-[8px] font-bold text-green-700"
                >
                  <Download className="h-3 w-3" />
                  Receipt
                </button>
              )}
            </div>
          </div>
        ))}

        {filteredPayments.length === 0 && <EmptyState />}
      </div>

      {/* Information */}
      <div className="mt-4 rounded-lg border border-blue-100 bg-blue-50 px-4 py-3">
        <p className="text-[9px] font-bold text-blue-900">
          Payment Information
        </p>

        <p className="mt-1 text-[8px] leading-4 text-blue-800">
          Verify the final quantity and procurement amount before
          initiating a farmer payment. Successful transactions can
          be viewed and printed as receipts.
        </p>
      </div>

      {/* Details Modal */}
      {selectedPayment && (
        <PaymentModal
          payment={selectedPayment}
          onClose={() => setSelectedPayment(null)}
          onPay={() => {
            initiatePayment(selectedPayment.id);

            setSelectedPayment((prev) => ({
              ...prev,
              status: "Successful",
            }));
          }}
        />
      )}
    </div>
  );
}

function SummaryCard({ icon: Icon, label, value }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-[8px] font-semibold text-slate-500">
          {label}
        </p>

        <Icon className="h-4 w-4 text-green-700" />
      </div>

      <p className="mt-2 text-base font-extrabold text-blue-950 sm:text-lg">
        {value}
      </p>
    </div>
  );
}

function PaymentStatus({ status }) {
  const config = {
    Successful: {
      className: "bg-green-50 text-green-700",
      icon: CheckCircle2,
    },
    Pending: {
      className: "bg-orange-50 text-orange-700",
      icon: Clock3,
    },
    Failed: {
      className: "bg-red-50 text-red-700",
      icon: XCircle,
    },
  };

  const current = config[status] || config.Pending;
  const Icon = current.icon;

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[7px] font-bold ${current.className}`}
    >
      <Icon className="h-3 w-3" />
      {status}
    </span>
  );
}

function InfoItem({ label, value }) {
  return (
    <div>
      <p className="text-[7px] font-semibold text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-[9px] font-bold text-blue-950">
        {value}
      </p>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="py-10 text-center">
      <Banknote className="mx-auto h-8 w-8 text-slate-300" />

      <p className="mt-2 text-[10px] font-bold text-slate-600">
        No payments found
      </p>

      <p className="mt-1 text-[8px] text-slate-400">
        Try changing your search or filter.
      </p>
    </div>
  );
}

function PaymentModal({ payment, onClose, onPay }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/40 px-4 py-6">
      <div className="w-full max-w-[500px] rounded-xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <div>
            <h2 className="text-sm font-extrabold text-blue-950">
              Payment Details
            </h2>

            <p className="mt-0.5 text-[8px] text-slate-500">
              {payment.bookingId} • {payment.farmer}
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-md p-1.5 text-slate-400 hover:bg-slate-50 hover:text-slate-700"
          >
            <XCircle className="h-4 w-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 px-5 py-5">
          <InfoItem label="Farmer" value={payment.farmer} />
          <InfoItem label="Token" value={payment.token} />
          <InfoItem label="Crop" value={payment.crop} />
          <InfoItem
            label="Quantity"
            value={`${payment.quantity} Quintal`}
          />
          <InfoItem
            label="Rate"
            value={`₹${payment.rate.toLocaleString("en-IN")} / Qtl`}
          />
          <InfoItem
            label="Total Amount"
            value={`₹${payment.amount.toLocaleString("en-IN", {
              minimumFractionDigits: 2,
            })}`}
          />
          <InfoItem label="Payment Method" value={payment.method} />
          <InfoItem label="Transaction ID" value={payment.id} />
          <InfoItem label="Date" value={payment.date} />
          <div>
            <p className="text-[7px] font-semibold text-slate-400">
              Status
            </p>

            <div className="mt-1">
              <PaymentStatus status={payment.status} />
            </div>
          </div>
        </div>

        <div className="flex gap-2 border-t border-slate-100 px-5 py-4">
          <button
            onClick={onClose}
            className="flex-1 rounded-md border border-slate-200 py-2.5 text-[9px] font-bold text-slate-600 hover:bg-slate-50"
          >
            Close
          </button>

          {payment.status === "Pending" && (
            <button
              onClick={onPay}
              className="flex-1 rounded-md bg-green-700 py-2.5 text-[9px] font-bold text-white hover:bg-green-800"
            >
              Initiate Payment
            </button>
          )}

          {payment.status === "Successful" && (
            <button
              onClick={() => window.print()}
              className="flex flex-1 items-center justify-center gap-1 rounded-md bg-green-700 py-2.5 text-[9px] font-bold text-white hover:bg-green-800"
            >
              <Download className="h-3 w-3" />
              Download Receipt
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Payments;