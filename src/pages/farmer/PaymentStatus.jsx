import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Check,
  Download,
  IndianRupee,
  Info,
  Clock,
  XCircle,
} from "lucide-react";
import { supabase } from "../../lib/supabase";

function PaymentStatus() {
  const [payments, setPayments] = useState([]);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchPayments();
  }, []);

  async function fetchPayments() {
    try {
      setLoading(true);
      setError("");

      // ---------------------------------------------------
      // 1. Get logged-in farmer
      // ---------------------------------------------------

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) throw userError;

      if (!user) {
        setError("Please login first.");
        return;
      }

      console.log("Payment Status farmer:", user.id);

      // ---------------------------------------------------
      // 2. Fetch farmer procurements
      // ---------------------------------------------------

      const { data: procurementData, error: procurementError } =
        await supabase
          .from("procurements")
          .select("*")
          .eq("farmer_id", user.id)
          .order("created_at", { ascending: false });

      if (procurementError) {
        throw procurementError;
      }

      console.log("Farmer procurements:", procurementData);

      if (!procurementData || procurementData.length === 0) {
        setPayments([]);
        setSelectedPayment(null);
        return;
      }

      const procurementIds = procurementData.map(
        (procurement) => procurement.id
      );

      // ---------------------------------------------------
      // 3. Fetch payments
      // ---------------------------------------------------

      const { data: paymentData, error: paymentError } =
        await supabase
          .from("payments")
          .select("*")
          .in("procurement_id", procurementIds)
          .order("created_at", { ascending: false });

      if (paymentError) {
        throw paymentError;
      }

      console.log("Farmer payments:", paymentData);

      if (!paymentData || paymentData.length === 0) {
        setPayments([]);
        setSelectedPayment(null);
        return;
      }

      // ---------------------------------------------------
      // 4. Fetch centres
      // ---------------------------------------------------

      const centreIds = [
        ...new Set(
          procurementData
            .map((procurement) => procurement.centre_id)
            .filter(Boolean)
        ),
      ];

      let centreData = [];

      if (centreIds.length > 0) {
        const { data, error: centreError } =
          await supabase
            .from("centres")
            .select("*")
            .in("id", centreIds);

        if (centreError) {
          throw centreError;
        }

        centreData = data || [];
      }

      // ---------------------------------------------------
      // 5. Fetch crops
      // ---------------------------------------------------

      const cropIds = [
        ...new Set(
          procurementData
            .map((procurement) => procurement.crop_id)
            .filter(Boolean)
        ),
      ];

      let cropData = [];

      if (cropIds.length > 0) {
        const { data, error: cropError } =
          await supabase
            .from("crops")
            .select("*")
            .in("id", cropIds);

        if (cropError) {
          throw cropError;
        }

        cropData = data || [];
      }

      // ---------------------------------------------------
      // 6. Fetch weighments
      // ---------------------------------------------------

      const { data: weighmentData, error: weighmentError } =
        await supabase
          .from("weighments")
          .select("*")
          .in("procurement_id", procurementIds)
          .order("weighed_at", { ascending: false });

      if (weighmentError) {
        throw weighmentError;
      }

      // ---------------------------------------------------
      // 7. Merge all data
      // ---------------------------------------------------

      const mergedPayments = paymentData.map((payment) => {
        const procurement = procurementData.find(
          (item) => item.id === payment.procurement_id
        );

        const centre = centreData.find(
          (item) => item.id === procurement?.centre_id
        );

        const crop = cropData.find(
          (item) => item.id === procurement?.crop_id
        );

        const weighment = (weighmentData || []).find(
          (item) =>
            item.procurement_id === payment.procurement_id
        );

        return {
          ...payment,
          procurement,
          centre,
          crop,
          weighment,
        };
      });

      console.log(
        "Merged farmer payments:",
        mergedPayments
      );

      setPayments(mergedPayments);
      setSelectedPayment(mergedPayments[0] || null);
    } catch (err) {
      console.error("Payment Status error:", err);

      setError(
        err?.message ||
          "Unable to load payment details. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  // ---------------------------------------------------
  // Helpers
  // ---------------------------------------------------

  function formatAmount(amount) {
    const number = Number(amount || 0);

    return number.toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  function formatDate(date) {
    if (!date) return "—";

    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  }

  function getPaymentStatus(payment) {
    const status = String(
      payment?.status || ""
    ).toLowerCase();

    if (
      status === "successful" ||
      status === "success" ||
      status === "completed"
    ) {
      return "Success";
    }

    if (
      status === "pending" ||
      status === "processing"
    ) {
      return "Pending";
    }

    if (
      status === "failed" ||
      status === "rejected"
    ) {
      return "Failed";
    }

    return payment?.status || "Unknown";
  }

  function getStatusClasses(status) {
    if (status === "Success") {
      return "border-green-200 bg-green-50 text-green-700";
    }

    if (status === "Pending") {
      return "border-yellow-200 bg-yellow-50 text-yellow-700";
    }

    if (status === "Failed") {
      return "border-red-200 bg-red-50 text-red-700";
    }

    return "border-slate-200 bg-slate-50 text-slate-600";
  }

  // ---------------------------------------------------
  // Loading
  // ---------------------------------------------------

  if (loading) {
    return (
      <div className="space-y-5 p-8">
        <div>
          <h1 className="text-xl font-bold text-[#10233f]">
            Payment Status
          </h1>

          <p className="mt-1 text-xs text-slate-500">
            Track your payment details and history.
          </p>
        </div>

        <div className="flex min-h-[300px] items-center justify-center rounded-lg border border-slate-200 bg-white">
          <div className="text-center">
            <div className="mx-auto h-7 w-7 animate-spin rounded-full border-2 border-slate-200 border-t-[#087f3e]" />

            <p className="mt-3 text-xs text-slate-500">
              Loading payment details...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------
  // Error
  // ---------------------------------------------------

  if (error) {
    return (
      <div className="space-y-5 p-8">
        <div>
          <h1 className="text-xl font-bold text-[#10233f]">
            Payment Status
          </h1>

          <p className="mt-1 text-xs text-slate-500">
            Track your payment details and history.
          </p>
        </div>

        <div className="rounded-lg border border-red-200 bg-red-50 p-5">
          <div className="flex items-start gap-3">
            <XCircle
              size={18}
              className="mt-0.5 shrink-0 text-red-600"
            />

            <div>
              <p className="text-sm font-semibold text-red-800">
                Unable to load payment details
              </p>

              <p className="mt-1 text-xs text-red-700">
                {error}
              </p>

              <button
                type="button"
                onClick={fetchPayments}
                className="mt-4 rounded-md bg-red-600 px-4 py-2 text-xs font-semibold text-white hover:bg-red-700"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------
  // No payments
  // ---------------------------------------------------

  if (!selectedPayment) {
    return (
      <div className="space-y-5 p-8">
        <div>
          <h1 className="text-xl font-bold text-[#10233f]">
            Payment Status
          </h1>

          <p className="mt-1 text-xs text-slate-500">
            Track your payment details and history.
          </p>
        </div>

        <div className="flex min-h-[300px] items-center justify-center rounded-lg border border-slate-200 bg-white">
          <div className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
              <IndianRupee
                size={22}
                className="text-slate-400"
              />
            </div>

            <h2 className="mt-4 text-sm font-bold text-slate-700">
              No Payment Found
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Your payment details will appear here once a
              payment is created.
            </p>

            <Link
              to="/procurement"
              className="mt-5 inline-block rounded-md bg-[#087f3e] px-5 py-2.5 text-xs font-semibold text-white hover:bg-[#066b34]"
            >
              View Procurement Status
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------
  // Latest payment
  // ---------------------------------------------------

  const latestPayment = selectedPayment;

  const paymentStatus =
    getPaymentStatus(latestPayment);

  const centreName =
    latestPayment.centre?.name || "—";

  const cropName =
    latestPayment.crop?.name || "—";

  const quantity =
    latestPayment.weighment?.quantity ??
    latestPayment.quantity ??
    latestPayment.procurement?.quantity ??
    0;

  const rate =
    latestPayment.rate_per_quintal ??
    latestPayment.procurement?.rate_per_quintal ??
    0;

  const totalAmount =
    latestPayment.total_amount ??
    latestPayment.procurement?.total_amount ??
    Number(quantity) * Number(rate);

  const transactionId =
    latestPayment.transaction_id ||
    "Not generated yet";

  const paymentDate =
    latestPayment.payment_date ||
    latestPayment.created_at;

  return (
    <div className="space-y-5 p-8">
      {/* Page Header */}

      <div>
        <h1 className="text-xl font-bold text-[#10233f]">
          Payment Status
        </h1>

        <p className="mt-1 text-xs text-slate-500">
          Track your payment details and history.
        </p>
      </div>

      {/* Payment Top Section */}

      <div className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
        {/* Payment Details */}

        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <h2 className="mb-4 text-sm font-bold text-[#10233f]">
            Payment Details
          </h2>

          <div className="space-y-3">
            {/* Centre */}

            <div className="grid grid-cols-[125px_1fr] gap-3 text-xs">
              <span className="text-slate-500">
                Centre Name
              </span>

              <span className="font-semibold text-slate-800">
                {centreName}
              </span>
            </div>

            {/* Crop */}

            <div className="grid grid-cols-[125px_1fr] gap-3 text-xs">
              <span className="text-slate-500">
                Crop
              </span>

              <span className="font-semibold text-slate-800">
                {cropName}
              </span>
            </div>

            {/* Quantity */}

            <div className="grid grid-cols-[125px_1fr] gap-3 text-xs">
              <span className="text-slate-500">
                Quantity
              </span>

              <span className="font-semibold text-slate-800">
                {Number(quantity).toFixed(2)} Quintal
              </span>
            </div>

            {/* Rate */}

            <div className="grid grid-cols-[125px_1fr] gap-3 text-xs">
              <span className="text-slate-500">
                Rate (Per Quintal)
              </span>

              <span className="font-semibold text-slate-800">
                ₹ {formatAmount(rate)}
              </span>
            </div>

            {/* Total */}

            <div className="grid grid-cols-[125px_1fr] gap-3 text-xs">
              <span className="text-slate-500">
                Total Amount
              </span>

              <span className="font-semibold text-slate-800">
                ₹ {formatAmount(totalAmount)}
              </span>
            </div>

            {/* Payment Method */}

            <div className="grid grid-cols-[125px_1fr] gap-3 text-xs">
              <span className="text-slate-500">
                Payment Method
              </span>

              <span className="font-semibold text-slate-800">
                {latestPayment.payment_method ||
                  "Bank Transfer"}
              </span>
            </div>

            {/* Transaction */}

            <div className="grid grid-cols-[125px_1fr] gap-3 text-xs">
              <span className="text-slate-500">
                Transaction ID
              </span>

              <span className="break-all font-semibold text-slate-800">
                {transactionId}
              </span>
            </div>

            {/* Date */}

            <div className="grid grid-cols-[125px_1fr] gap-3 text-xs">
              <span className="text-slate-500">
                Payment Date
              </span>

              <span className="font-semibold text-slate-800">
                {formatDate(paymentDate)}
              </span>
            </div>
          </div>
        </div>

        {/* Payment Status */}

        {paymentStatus === "Success" ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-green-100 bg-green-50/60 p-6 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-600 text-white">
              <Check
                size={28}
                strokeWidth={3}
              />
            </div>

            <h2 className="mt-3 text-sm font-bold text-green-800">
              Payment Successful!
            </h2>

            <div className="mt-2 flex items-center text-xl font-bold text-green-700">
              <IndianRupee size={18} />

              {formatAmount(totalAmount)}
            </div>

            <p className="mt-1 text-xs text-slate-500">
              has been transferred successfully.
            </p>

            <button
              type="button"
              onClick={() => window.print()}
              className="mt-5 inline-flex w-full max-w-[180px] items-center justify-center gap-2 rounded-md bg-[#087f3e] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#066b34]"
            >
              <Download size={15} />
              Download Receipt
            </button>
          </div>
        ) : paymentStatus === "Pending" ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-yellow-100 bg-yellow-50/60 p-6 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-500 text-white">
              <Clock
                size={26}
                strokeWidth={3}
              />
            </div>

            <h2 className="mt-3 text-sm font-bold text-yellow-800">
              Payment Pending
            </h2>

            <div className="mt-2 flex items-center text-xl font-bold text-yellow-700">
              <IndianRupee size={18} />

              {formatAmount(totalAmount)}
            </div>

            <p className="mt-1 text-xs text-slate-500">
              Your payment is being processed.
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-lg border border-red-100 bg-red-50/60 p-6 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-600 text-white">
              <XCircle
                size={27}
                strokeWidth={3}
              />
            </div>

            <h2 className="mt-3 text-sm font-bold text-red-800">
              Payment Failed
            </h2>

            <div className="mt-2 flex items-center text-xl font-bold text-red-700">
              <IndianRupee size={18} />

              {formatAmount(totalAmount)}
            </div>

            <p className="mt-1 text-xs text-slate-500">
              Please contact the procurement centre.
            </p>
          </div>
        )}
      </div>

      {/* Payment History */}

      <div>
        <h2 className="mb-3 text-sm font-bold text-[#10233f]">
          Payment History
        </h2>

        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
          {/* Header */}

          <div className="hidden grid-cols-[1.1fr_1fr_1.2fr_1.2fr_0.7fr] border-b border-slate-200 bg-slate-50 px-4 py-3 text-xs font-semibold text-slate-600 md:grid">
            <span>Date</span>
            <span>Amount (₹)</span>
            <span>Method</span>
            <span>Transaction ID</span>
            <span>Status</span>
          </div>

          {/* History */}

          {payments.map((payment) => {
            const status =
              getPaymentStatus(payment);

            const amount =
              payment.total_amount ??
              payment.procurement?.total_amount ??
              Number(
                payment.quantity ||
                  payment.procurement?.quantity ||
                  0
              ) *
                Number(
                  payment.rate_per_quintal ||
                    payment.procurement
                      ?.rate_per_quintal ||
                    0
                );

            const date =
              payment.payment_date ||
              payment.created_at;

            return (
              <button
                key={payment.id}
                type="button"
                onClick={() =>
                  setSelectedPayment(payment)
                }
                className={`grid w-full gap-3 border-b border-slate-100 px-4 py-4 text-left text-xs transition hover:bg-slate-50 last:border-b-0 md:grid-cols-[1.1fr_1fr_1.2fr_1.2fr_0.7fr] md:items-center md:gap-0 ${
                  selectedPayment?.id === payment.id
                    ? "bg-slate-50"
                    : "bg-white"
                }`}
              >
                {/* Date */}

                <div>
                  <p className="font-semibold text-slate-800 md:hidden">
                    Date
                  </p>

                  <span className="text-slate-600">
                    {formatDate(date)}
                  </span>
                </div>

                {/* Amount */}

                <div>
                  <p className="font-semibold text-slate-800 md:hidden">
                    Amount
                  </p>

                  <span className="font-semibold text-slate-800">
                    {formatAmount(amount)}
                  </span>
                </div>

                {/* Method */}

                <div>
                  <p className="font-semibold text-slate-800 md:hidden">
                    Method
                  </p>

                  <span className="text-slate-600">
                    {payment.payment_method ||
                      "Bank Transfer"}
                  </span>
                </div>

                {/* Transaction */}

                <div>
                  <p className="font-semibold text-slate-800 md:hidden">
                    Transaction ID
                  </p>

                  <span className="break-all text-slate-600">
                    {payment.transaction_id ||
                      "Not generated"}
                  </span>
                </div>

                {/* Status */}

                <div>
                  <p className="font-semibold text-slate-800 md:hidden">
                    Status
                  </p>

                  <span
                    className={`inline-flex w-fit items-center rounded-md border px-3 py-1 text-[11px] font-semibold ${getStatusClasses(
                      status
                    )}`}
                  >
                    {status}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Information */}

      <div className="flex items-start gap-3 rounded-lg border border-blue-100 bg-blue-50 px-4 py-3">
        <Info
          size={17}
          className="mt-0.5 shrink-0 text-blue-600"
        />

        <div>
          <p className="text-xs font-semibold text-blue-900">
            Payment Information
          </p>

          <p className="mt-1 text-xs leading-5 text-blue-700">
            Your payment details are fetched directly from
            the procurement system. Keep the transaction ID
            for future reference.
          </p>
        </div>
      </div>

      {/* Bottom Actions */}

      <div className="flex flex-col gap-3 sm:flex-row">
        <Link
          to="/procurement"
          className="rounded-md border border-slate-200 bg-white px-5 py-2.5 text-center text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          View Procurement Status
        </Link>

        <Link
          to="/dashboard"
          className="rounded-md bg-[#087f3e] px-5 py-2.5 text-center text-xs font-semibold text-white transition hover:bg-[#066b34]"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}

export default PaymentStatus;