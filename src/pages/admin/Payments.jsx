import { useMemo, useState } from "react";
import {
  Banknote,
  CheckCircle2,
  Clock3,
  Download,
  Eye,
  Search,
  WalletCards,
  XCircle,
} from "lucide-react";

const initialPayments = [
  {
    id: "TXN123456789",
    procurementId: "PR241124",
    farmer: "Rajesh Kumar",
    farmerId: "FR10241",
    centre: "ABC Procurement Centre",
    crop: "Wheat",
    quantity: "48.2 Quintal",
    amount: 102425,
    method: "Bank Transfer (UPI)",
    date: "05 Sep 2026",
    time: "11:30 AM",
    status: "Successful",
  },
  {
    id: "TXN123456790",
    procurementId: "PR241120",
    farmer: "Mohan Oraon",
    farmerId: "FR10237",
    centre: "ABC Procurement Centre",
    crop: "Wheat",
    quantity: "39.6 Quintal",
    amount: 84150,
    method: "Bank Transfer",
    date: "05 Sep 2026",
    time: "12:15 PM",
    status: "Successful",
  },
  {
    id: "TXN123456791",
    procurementId: "PR241118",
    farmer: "Birsa Tudu",
    farmerId: "FR10235",
    centre: "Shakti Kendra",
    crop: "Maize",
    quantity: "27.6 Quintal",
    amount: 54648,
    method: "Bank Transfer",
    date: "06 Sep 2026",
    time: "10:45 AM",
    status: "Pending",
  },
  {
    id: "TXN123456792",
    procurementId: "PR241125",
    farmer: "Ramesh Mahto",
    farmerId: "FR10242",
    centre: "Krishi Seva Kendra",
    crop: "Wheat",
    quantity: "31.8 Quintal",
    amount: 67575,
    method: "Bank Transfer",
    date: "06 Sep 2026",
    time: "01:20 PM",
    status: "Pending",
  },
  {
    id: "TXN123456793",
    procurementId: "PR241110",
    farmer: "Suresh Kumar",
    farmerId: "FR10225",
    centre: "Green Field Centre",
    crop: "Rice",
    quantity: "30 Quintal",
    amount: 65490,
    method: "Bank Transfer",
    date: "04 Sep 2026",
    time: "03:10 PM",
    status: "Failed",
  },
  {
    id: "TXN123456794",
    procurementId: "PR241105",
    farmer: "Laxmi Devi",
    farmerId: "FR10220",
    centre: "Shakti Kendra",
    crop: "Maize",
    quantity: "22.5 Quintal",
    amount: 44550,
    method: "Bank Transfer",
    date: "03 Sep 2026",
    time: "11:40 AM",
    status: "Successful",
  },
];

function AdminPayments() {
  const [payments, setPayments] = useState(initialPayments);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("All");
  const [selectedPayment, setSelectedPayment] = useState(null);

  const tabs = ["All", "Successful", "Pending", "Failed"];

  const filteredPayments = useMemo(() => {
    return payments.filter((payment) => {
      const matchesTab =
        activeTab === "All" || payment.status === activeTab;

      const query = search.toLowerCase();

      const matchesSearch =
        payment.id.toLowerCase().includes(query) ||
        payment.procurementId.toLowerCase().includes(query) ||
        payment.farmer.toLowerCase().includes(query) ||
        payment.farmerId.toLowerCase().includes(query) ||
        payment.centre.toLowerCase().includes(query);

      return matchesTab && matchesSearch;
    });
  }, [payments, activeTab, search]);

  const successfulPayments = payments.filter(
    (payment) => payment.status === "Successful"
  );

  const pendingPayments = payments.filter(
    (payment) => payment.status === "Pending"
  );

  const failedPayments = payments.filter(
    (payment) => payment.status === "Failed"
  );

  const totalPaid = successfulPayments.reduce(
    (sum, payment) => sum + payment.amount,
    0
  );

  const pendingAmount = pendingPayments.reduce(
    (sum, payment) => sum + payment.amount,
    0
  );

  const failedAmount = failedPayments.reduce(
    (sum, payment) => sum + payment.amount,
    0
  );

  const formatAmount = (amount) => {
    return `₹${amount.toLocaleString("en-IN")}`;
  };

  const statusClasses = {
    Successful: "bg-green-50 text-green-700",
    Pending: "bg-amber-50 text-amber-700",
    Failed: "bg-red-50 text-red-700",
  };

  const statusIcons = {
    Successful: <CheckCircle2 className="h-3.5 w-3.5" />,
    Pending: <Clock3 className="h-3.5 w-3.5" />,
    Failed: <XCircle className="h-3.5 w-3.5" />,
  };

  const initiatePayment = (id) => {
    setPayments((current) =>
      current.map((payment) =>
        payment.id === id
          ? {
              ...payment,
              status: "Successful",
              date: "07 Sep 2026",
              time: "02:15 AM",
            }
          : payment
      )
    );

    setSelectedPayment((current) =>
      current
        ? {
            ...current,
            status: "Successful",
            date: "07 Sep 2026",
            time: "02:15 AM",
          }
        : current
    );
  };

  const downloadReceipt = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-semibold text-green-700">
            Payment Monitoring
          </p>

          <h1 className="mt-1 text-2xl font-extrabold text-blue-950 sm:text-3xl">
            Payment Overview
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Monitor farmer payments, pending transactions and payment history.
          </p>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600 shadow-sm">
          07 September 2026
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500">
              Total Paid
            </p>

            <div className="rounded-lg bg-green-50 p-2 text-green-700">
              <Banknote className="h-5 w-5" />
            </div>
          </div>

          <p className="mt-3 text-xl font-extrabold text-blue-950 sm:text-2xl">
            {formatAmount(totalPaid)}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Successful payments
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500">
              Pending Amount
            </p>

            <div className="rounded-lg bg-amber-50 p-2 text-amber-700">
              <Clock3 className="h-5 w-5" />
            </div>
          </div>

          <p className="mt-3 text-xl font-extrabold text-amber-700 sm:text-2xl">
            {formatAmount(pendingAmount)}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Awaiting processing
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500">
              Successful
            </p>

            <div className="rounded-lg bg-green-50 p-2 text-green-700">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </div>

          <p className="mt-3 text-2xl font-extrabold text-green-700">
            {successfulPayments.length}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Transactions completed
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500">
              Failed
            </p>

            <div className="rounded-lg bg-red-50 p-2 text-red-600">
              <XCircle className="h-5 w-5" />
            </div>
          </div>

          <p className="mt-3 text-2xl font-extrabold text-red-600">
            {failedPayments.length}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            {formatAmount(failedAmount)} failed
          </p>
        </div>
      </div>

      {/* Pending Alert */}
      {pendingPayments.length > 0 && (
        <div className="flex flex-col gap-3 rounded-xl border border-amber-100 bg-amber-50 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-3">
            <Clock3 className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" />

            <div>
              <p className="text-sm font-bold text-amber-900">
                Pending Payments
              </p>

              <p className="mt-1 text-xs text-amber-800">
                {pendingPayments.length} payments worth{" "}
                {formatAmount(pendingAmount)} are waiting for processing.
              </p>
            </div>
          </div>

          <button
            onClick={() => setActiveTab("Pending")}
            className="rounded-lg bg-amber-600 px-4 py-2 text-xs font-bold text-white hover:bg-amber-700"
          >
            View Pending
          </button>
        </div>
      )}

      {/* Filters */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`whitespace-nowrap rounded-lg px-4 py-2 text-xs font-bold transition ${
                  activeTab === tab
                    ? "bg-green-700 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="relative w-full lg:max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search transaction, farmer or centre..."
              className="h-10 w-full rounded-lg border border-slate-300 pl-9 pr-3 text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
            />
          </div>
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm lg:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px]">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-5 py-4 text-left text-xs font-bold text-slate-500">
                  Transaction
                </th>

                <th className="px-5 py-4 text-left text-xs font-bold text-slate-500">
                  Farmer
                </th>

                <th className="px-5 py-4 text-left text-xs font-bold text-slate-500">
                  Centre
                </th>

                <th className="px-5 py-4 text-left text-xs font-bold text-slate-500">
                  Crop / Quantity
                </th>

                <th className="px-5 py-4 text-left text-xs font-bold text-slate-500">
                  Amount
                </th>

                <th className="px-5 py-4 text-left text-xs font-bold text-slate-500">
                  Date
                </th>

                <th className="px-5 py-4 text-left text-xs font-bold text-slate-500">
                  Status
                </th>

                <th className="px-5 py-4 text-right text-xs font-bold text-slate-500">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredPayments.map((payment) => (
                <tr
                  key={payment.id}
                  className="border-b border-slate-100 last:border-0 hover:bg-slate-50"
                >
                  <td className="px-5 py-4">
                    <p className="text-sm font-bold text-blue-950">
                      {payment.id}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {payment.procurementId}
                    </p>
                  </td>

                  <td className="px-5 py-4">
                    <p className="text-sm font-semibold text-slate-800">
                      {payment.farmer}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {payment.farmerId}
                    </p>
                  </td>

                  <td className="px-5 py-4">
                    <p className="text-sm font-semibold text-slate-800">
                      {payment.centre}
                    </p>
                  </td>

                  <td className="px-5 py-4">
                    <p className="text-sm font-semibold text-slate-800">
                      {payment.crop}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {payment.quantity}
                    </p>
                  </td>

                  <td className="px-5 py-4">
                    <p className="text-sm font-extrabold text-blue-950">
                      {formatAmount(payment.amount)}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {payment.method}
                    </p>
                  </td>

                  <td className="px-5 py-4">
                    <p className="text-sm font-semibold text-slate-800">
                      {payment.date}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {payment.time}
                    </p>
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-bold ${statusClasses[payment.status]}`}
                    >
                      {statusIcons[payment.status]}
                      {payment.status}
                    </span>
                  </td>

                  <td className="px-5 py-4 text-right">
                    <button
                      onClick={() => setSelectedPayment(payment)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-blue-700 hover:bg-blue-50"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredPayments.length === 0 && (
          <div className="px-5 py-12 text-center">
            <WalletCards className="mx-auto h-10 w-10 text-slate-300" />

            <p className="mt-3 text-sm font-bold text-slate-600">
              No payment records found
            </p>
          </div>
        )}
      </div>

      {/* Mobile Cards */}
      <div className="space-y-4 lg:hidden">
        {filteredPayments.map((payment) => (
          <div
            key={payment.id}
            className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-extrabold text-blue-950">
                  {payment.id}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  {payment.procurementId}
                </p>
              </div>

              <span
                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold ${statusClasses[payment.status]}`}
              >
                {statusIcons[payment.status]}
                {payment.status}
              </span>
            </div>

            <div className="mt-4 space-y-3">
              <div>
                <p className="text-[10px] font-semibold text-slate-400">
                  Farmer
                </p>

                <p className="mt-1 text-sm font-bold text-slate-800">
                  {payment.farmer}
                </p>

                <p className="text-[11px] text-slate-500">
                  {payment.farmerId}
                </p>
              </div>

              <div>
                <p className="text-[10px] font-semibold text-slate-400">
                  Centre
                </p>

                <p className="mt-1 text-sm font-bold text-slate-800">
                  {payment.centre}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-slate-50 p-3">
                  <p className="text-[10px] font-semibold text-slate-400">
                    Crop
                  </p>

                  <p className="mt-1 text-xs font-bold text-slate-800">
                    {payment.crop}
                  </p>
                </div>

                <div className="rounded-lg bg-slate-50 p-3">
                  <p className="text-[10px] font-semibold text-slate-400">
                    Quantity
                  </p>

                  <p className="mt-1 text-xs font-bold text-slate-800">
                    {payment.quantity}
                  </p>
                </div>
              </div>

              <div className="rounded-lg bg-green-50 p-3">
                <p className="text-[10px] font-semibold text-green-700">
                  Payment Amount
                </p>

                <p className="mt-1 text-lg font-extrabold text-green-800">
                  {formatAmount(payment.amount)}
                </p>
              </div>
            </div>

            <button
              onClick={() => setSelectedPayment(payment)}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 py-2.5 text-xs font-bold text-blue-700 hover:bg-blue-50"
            >
              <Eye className="h-4 w-4" />
              View Payment Details
            </button>
          </div>
        ))}

        {filteredPayments.length === 0 && (
          <div className="rounded-xl border border-slate-200 bg-white px-5 py-12 text-center">
            <WalletCards className="mx-auto h-10 w-10 text-slate-300" />

            <p className="mt-3 text-sm font-bold text-slate-600">
              No payment records found
            </p>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="rounded-xl border border-green-100 bg-green-50 p-4">
        <div className="flex gap-3">
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-700" />

          <div>
            <p className="text-sm font-bold text-green-900">
              Payment Monitoring
            </p>

            <p className="mt-1 text-xs leading-5 text-green-800">
              Admin can monitor successful, pending and failed payments
              and review transaction details for every farmer.
            </p>
          </div>
        </div>
      </div>

      {/* Details Modal */}
      {selectedPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4 py-6">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <div>
                <h2 className="text-lg font-extrabold text-blue-950">
                  Payment Details
                </h2>

                <p className="mt-0.5 text-xs text-slate-500">
                  {selectedPayment.id}
                </p>
              </div>

              <button
                onClick={() => setSelectedPayment(null)}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-5 p-5">
              {/* Status */}
              <div
                className={`rounded-xl p-4 ${
                  selectedPayment.status === "Successful"
                    ? "bg-green-50"
                    : selectedPayment.status === "Pending"
                      ? "bg-amber-50"
                      : "bg-red-50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[11px] font-semibold text-slate-500">
                      Payment Status
                    </p>

                    <span
                      className={`mt-2 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${statusClasses[selectedPayment.status]}`}
                    >
                      {statusIcons[selectedPayment.status]}
                      {selectedPayment.status}
                    </span>
                  </div>

                  <div className="text-right">
                    <p className="text-[11px] text-slate-500">
                      Amount
                    </p>

                    <p className="mt-1 text-xl font-extrabold text-blue-950">
                      {formatAmount(selectedPayment.amount)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Farmer */}
              <div>
                <p className="text-xs font-bold text-blue-950">
                  Farmer Information
                </p>

                <div className="mt-3 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[10px] text-slate-400">
                      Farmer Name
                    </p>

                    <p className="mt-1 text-sm font-bold text-slate-800">
                      {selectedPayment.farmer}
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] text-slate-400">
                      Farmer ID
                    </p>

                    <p className="mt-1 text-sm font-bold text-slate-800">
                      {selectedPayment.farmerId}
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] text-slate-400">
                      Crop
                    </p>

                    <p className="mt-1 text-sm font-bold text-slate-800">
                      {selectedPayment.crop}
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] text-slate-400">
                      Quantity
                    </p>

                    <p className="mt-1 text-sm font-bold text-slate-800">
                      {selectedPayment.quantity}
                    </p>
                  </div>
                </div>
              </div>

              {/* Transaction */}
              <div>
                <p className="text-xs font-bold text-blue-950">
                  Transaction Information
                </p>

                <div className="mt-3 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[10px] text-slate-400">
                      Transaction ID
                    </p>

                    <p className="mt-1 break-all text-sm font-bold text-slate-800">
                      {selectedPayment.id}
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] text-slate-400">
                      Procurement ID
                    </p>

                    <p className="mt-1 text-sm font-bold text-slate-800">
                      {selectedPayment.procurementId}
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] text-slate-400">
                      Centre
                    </p>

                    <p className="mt-1 text-sm font-bold text-slate-800">
                      {selectedPayment.centre}
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] text-slate-400">
                      Payment Method
                    </p>

                    <p className="mt-1 text-sm font-bold text-slate-800">
                      {selectedPayment.method}
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] text-slate-400">
                      Date
                    </p>

                    <p className="mt-1 text-sm font-bold text-slate-800">
                      {selectedPayment.date}
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] text-slate-400">
                      Time
                    </p>

                    <p className="mt-1 text-sm font-bold text-slate-800">
                      {selectedPayment.time}
                    </p>
                  </div>
                </div>
              </div>

              {/* Pending Action */}
              {selectedPayment.status === "Pending" && (
                <button
                  onClick={() => initiatePayment(selectedPayment.id)}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-green-700 py-2.5 text-xs font-bold text-white hover:bg-green-800"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  Initiate Payment
                </button>
              )}

              {/* Receipt */}
              {selectedPayment.status === "Successful" && (
                <button
                  onClick={downloadReceipt}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-700 py-2.5 text-xs font-bold text-white hover:bg-blue-800"
                >
                  <Download className="h-4 w-4" />
                  Download Receipt
                </button>
              )}

              {selectedPayment.status === "Failed" && (
                <div className="rounded-lg bg-red-50 p-3 text-xs font-medium text-red-700">
                  This payment failed and requires attention.
                </div>
              )}

              <button
                onClick={() => setSelectedPayment(null)}
                className="w-full rounded-lg bg-slate-100 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminPayments;