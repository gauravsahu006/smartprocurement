import { useEffect, useMemo, useState } from "react";
import {
  Banknote,
  CheckCircle2,
  Clock3,
  Download,
  Eye,
  Loader2,
  Search,
  WalletCards,
  XCircle,
} from "lucide-react";

import { supabase } from "../../lib/supabase";

function AdminPayments() {
  const [payments, setPayments] = useState([]);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("All");
  const [selectedPayment, setSelectedPayment] = useState(null);

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");

  const tabs = ["All", "Successful", "Pending", "Failed"];

  // ---------------------------------------------------------
  // Helpers
  // ---------------------------------------------------------

  const formatAmount = (amount) => {
    const value = Number(amount || 0);

    return `₹${value.toLocaleString("en-IN", {
      maximumFractionDigits: 2,
    })}`;
  };

  const formatDate = (value) => {
    if (!value) return "—";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return String(value);
    }

    return new Intl.DateTimeFormat("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      timeZone: "Asia/Kolkata",
    }).format(date);
  };

  const formatTime = (value) => {
    if (!value) return "—";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return String(value);
    }

    return new Intl.DateTimeFormat("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      timeZone: "Asia/Kolkata",
    }).format(date);
  };

  const normalizeStatus = (status) => {
    const value = String(status || "").toLowerCase();

    if (
      value === "successful" ||
      value === "success" ||
      value === "completed" ||
      value === "paid"
    ) {
      return "Successful";
    }

    if (
      value === "pending" ||
      value === "processing" ||
      value === "initiated"
    ) {
      return "Pending";
    }

    if (
      value === "failed" ||
      value === "failure" ||
      value === "rejected"
    ) {
      return "Failed";
    }

    return "Pending";
  };

  const getPaymentMethod = (payment) => {
    return (
      payment.payment_method ||
      payment.method ||
      payment.mode ||
      payment.payment_type ||
      "Bank Transfer"
    );
  };

  // ---------------------------------------------------------
  // Fetch Payments
  // ---------------------------------------------------------

  const fetchPayments = async () => {
    try {
      setLoading(true);
      setError("");

      // 1. Payments
      const { data: paymentRows, error: paymentError } =
        await supabase
          .from("payments")
          .select("*")
          .order("created_at", { ascending: false });

      if (paymentError) {
        throw paymentError;
      }

      if (!paymentRows || paymentRows.length === 0) {
        setPayments([]);
        return;
      }

      // -----------------------------------------------------
      // Collect IDs
      // -----------------------------------------------------

      const farmerIds = [
        ...new Set(
          paymentRows
            .map((payment) => payment.farmer_id)
            .filter(Boolean)
        ),
      ];

      const procurementIds = [
        ...new Set(
          paymentRows
            .map((payment) => payment.procurement_id)
            .filter(Boolean)
        ),
      ];

      // -----------------------------------------------------
      // 2. Farmers
      // -----------------------------------------------------

      let profiles = [];

      if (farmerIds.length > 0) {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .in("id", farmerIds);

        if (error) {
          throw error;
        }

        profiles = data || [];
      }

      // -----------------------------------------------------
      // 3. Procurements
      // -----------------------------------------------------

      let procurements = [];

      if (procurementIds.length > 0) {
        const { data, error } = await supabase
          .from("procurements")
          .select("*")
          .in("id", procurementIds);

        if (error) {
          throw error;
        }

        procurements = data || [];
      }

      const procurementMap = new Map(
        procurements.map((item) => [String(item.id), item])
      );

      // -----------------------------------------------------
      // 4. Bookings
      // -----------------------------------------------------

      const bookingIds = [
        ...new Set(
          procurements
            .map((procurement) => procurement.booking_id)
            .filter(Boolean)
        ),
      ];

      let bookings = [];

      if (bookingIds.length > 0) {
        const { data, error } = await supabase
          .from("bookings")
          .select("*")
          .in("id", bookingIds);

        if (error) {
          throw error;
        }

        bookings = data || [];
      }

      const bookingMap = new Map(
        bookings.map((booking) => [String(booking.id), booking])
      );

      // -----------------------------------------------------
      // 5. Centres
      // -----------------------------------------------------

      const centreIds = [
        ...new Set(
          bookings
            .map((booking) => booking.centre_id)
            .filter(Boolean)
        ),
      ];

      let centres = [];

      if (centreIds.length > 0) {
        const { data, error } = await supabase
          .from("centres")
          .select("*")
          .in("id", centreIds);

        if (error) {
          throw error;
        }

        centres = data || [];
      }

      const centreMap = new Map(
        centres.map((centre) => [String(centre.id), centre])
      );

      // -----------------------------------------------------
      // 6. Crops
      // -----------------------------------------------------

      const cropIds = [
        ...new Set(
          bookings
            .map((booking) => booking.crop_id)
            .filter(Boolean)
        ),
      ];

      let crops = [];

      if (cropIds.length > 0) {
        const { data, error } = await supabase
          .from("crops")
          .select("*")
          .in("id", cropIds);

        if (error) {
          throw error;
        }

        crops = data || [];
      }

      const cropMap = new Map(
        crops.map((crop) => [String(crop.id), crop])
      );

      // -----------------------------------------------------
      // 7. Build UI records
      // -----------------------------------------------------

      const profileMap = new Map(
        profiles.map((profile) => [String(profile.id), profile])
      );

      const formattedPayments = paymentRows.map((payment) => {
        const procurement = procurementMap.get(
          String(payment.procurement_id)
        );

        const booking = procurement
          ? bookingMap.get(String(procurement.booking_id))
          : null;

        const centre = booking
          ? centreMap.get(String(booking.centre_id))
          : null;

        const crop = booking
          ? cropMap.get(String(booking.crop_id))
          : null;

        const farmer = payment.farmer_id
          ? profileMap.get(String(payment.farmer_id))
          : null;

        const paymentDate =
          payment.paid_at ||
          payment.payment_date ||
          payment.created_at;

        const amount =
          payment.total_amount ??
          payment.amount ??
          0;

        const quantity =
          payment.quantity ??
          procurement?.quantity ??
          booking?.quantity ??
          0;

        const transactionId =
          payment.transaction_id ||
          payment.id;

        const procurementDisplayId =
          procurement?.procurement_number ||
          procurement?.procurement_id ||
          `PR${String(payment.procurement_id || "").padStart(
            6,
            "0"
          )}`;

        const farmerId =
          farmer?.farmer_id ||
          farmer?.registration_id ||
          farmer?.farmer_code ||
          (payment.farmer_id
            ? `FR-${String(payment.farmer_id).slice(0, 8)}`
            : "—");

        return {
          id: String(transactionId),

          rawId: payment.id,

          procurementId: procurementDisplayId,

          farmer: farmer?.full_name || farmer?.name || "Unknown Farmer",

          farmerId,

          farmerUuid: payment.farmer_id,

          centre:
            centre?.name ||
            "Unknown Centre",

          centreId: booking?.centre_id,

          crop:
            crop?.name ||
            booking?.crop_name ||
            "—",

          quantity: Number(quantity || 0),

          amount: Number(amount || 0),

          method: getPaymentMethod(payment),

          date: formatDate(paymentDate),

          time: formatTime(paymentDate),

          status: normalizeStatus(payment.status),

          rawStatus: payment.status,

          createdAt: payment.created_at,

          paymentRow: payment,

          procurement,

          booking,
        };
      });

      setPayments(formattedPayments);
    } catch (err) {
      console.error("Admin payments error:", err);

      setError(
        err?.message ||
          "Unable to load payment records."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  // ---------------------------------------------------------
  // Filters
  // ---------------------------------------------------------

  const filteredPayments = useMemo(() => {
    const query = search.toLowerCase().trim();

    return payments.filter((payment) => {
      const matchesTab =
        activeTab === "All" ||
        payment.status === activeTab;

      if (!query) {
        return matchesTab;
      }

      const matchesSearch =
        payment.id.toLowerCase().includes(query) ||
        payment.procurementId
          .toLowerCase()
          .includes(query) ||
        payment.farmer
          .toLowerCase()
          .includes(query) ||
        payment.farmerId
          .toLowerCase()
          .includes(query) ||
        payment.centre
          .toLowerCase()
          .includes(query) ||
        payment.crop
          .toLowerCase()
          .includes(query);

      return matchesTab && matchesSearch;
    });
  }, [payments, activeTab, search]);

  // ---------------------------------------------------------
  // Stats
  // ---------------------------------------------------------

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

  // ---------------------------------------------------------
  // Initiate Payment
  // ---------------------------------------------------------

  const initiatePayment = async (payment) => {
    try {
      setActionLoading(true);
      setError("");

      /*
       * Existing DB flow:
       * payment status can be changed from pending -> successful.
       *
       * If your payments table uses another exact success status,
       * change "successful" below.
       */

      const { data, error } = await supabase
        .from("payments")
        .update({
          status: "successful",
        })
        .eq("id", payment.rawId)
        .select("*")
        .single();

      if (error) {
        throw error;
      }

      const updatedPayment = {
        ...payment,
        status: "Successful",
        rawStatus: data?.status || "successful",
        paymentRow: data || payment.paymentRow,
      };

      setPayments((currentPayments) =>
        currentPayments.map((item) =>
          item.rawId === payment.rawId
            ? updatedPayment
            : item
        )
      );

      setSelectedPayment(updatedPayment);
    } catch (err) {
      console.error("Payment update error:", err);

      setError(
        err?.message ||
          "Unable to update payment status."
      );
    } finally {
      setActionLoading(false);
    }
  };

  // ---------------------------------------------------------
  // Receipt
  // ---------------------------------------------------------

  const downloadReceipt = () => {
    window.print();
  };

  // ---------------------------------------------------------
  // Status UI
  // ---------------------------------------------------------

  const statusClasses = {
    Successful: "bg-green-50 text-green-700",
    Pending: "bg-amber-50 text-amber-700",
    Failed: "bg-red-50 text-red-700",
  };

  const statusIcons = {
    Successful: (
      <CheckCircle2 className="h-3.5 w-3.5" />
    ),

    Pending: (
      <Clock3 className="h-3.5 w-3.5" />
    ),

    Failed: (
      <XCircle className="h-3.5 w-3.5" />
    ),
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
          {new Intl.DateTimeFormat("en-IN", {
            day: "2-digit",
            month: "long",
            year: "numeric",
            timeZone: "Asia/Kolkata",
          }).format(new Date())}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4">
          <p className="text-xs font-bold text-red-800">
            Payment Error
          </p>

          <p className="mt-1 text-xs text-red-700">
            {error}
          </p>

          <button
            type="button"
            onClick={fetchPayments}
            className="mt-3 rounded-lg bg-red-600 px-3 py-2 text-xs font-bold text-white hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      )}

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
      {!loading && pendingPayments.length > 0 && (
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
            type="button"
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
                type="button"
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
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search transaction, farmer or centre..."
              className="h-10 w-full rounded-lg border border-slate-300 pl-9 pr-3 text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
            />
          </div>
        </div>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="flex min-h-[300px] items-center justify-center rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="text-center">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-green-700" />

            <p className="mt-3 text-sm font-bold text-blue-950">
              Loading payments...
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Fetching payment records from database.
            </p>
          </div>
        </div>
      ) : (
        <>
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
                      key={payment.rawId}
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
                          {payment.quantity} Quintal
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
                          type="button"
                          onClick={() =>
                            setSelectedPayment(payment)
                          }
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
                key={payment.rawId}
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
                        {payment.quantity} Quintal
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
                  type="button"
                  onClick={() =>
                    setSelectedPayment(payment)
                  }
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
        </>
      )}

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
                type="button"
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
                      {selectedPayment.quantity} Quintal
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
                  type="button"
                  disabled={actionLoading}
                  onClick={() =>
                    initiatePayment(selectedPayment)
                  }
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-green-700 py-2.5 text-xs font-bold text-white hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {actionLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-4 w-4" />
                      Initiate Payment
                    </>
                  )}
                </button>
              )}

              {/* Receipt */}
              {selectedPayment.status === "Successful" && (
                <button
                  type="button"
                  onClick={downloadReceipt}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-700 py-2.5 text-xs font-bold text-white hover:bg-blue-800"
                >
                  <Download className="h-4 w-4" />
                  Download Receipt
                </button>
              )}

              {/* Failed */}
              {selectedPayment.status === "Failed" && (
                <div className="rounded-lg bg-red-50 p-3 text-xs font-medium text-red-700">
                  This payment failed and requires attention.
                </div>
              )}

              <button
                type="button"
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