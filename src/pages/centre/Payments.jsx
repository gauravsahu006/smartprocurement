import { useEffect, useMemo, useState } from "react";
import {
  Banknote,
  CheckCircle2,
  Clock3,
  Download,
  Eye,
  Search,
  XCircle,
} from "lucide-react";
import { supabase } from "../../lib/supabase";

function Payments() {
  const [payments, setPayments] = useState([]);

  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");
  const [selectedPayment, setSelectedPayment] = useState(null);

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");

  const tabs = [
    "All",
    "Successful",
    "Pending",
    "Failed",
  ];

  // ==================================================
  // Local India Date
  // ==================================================
  const getLocalDate = () => {
    const now = new Date();

    const year = now.getFullYear();

    const month = String(
      now.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
      now.getDate()
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  // ==================================================
  // Format Date
  // ==================================================
  const formatDateTime = (dateValue) => {
    if (!dateValue) {
      return "—";
    }

    const date = new Date(dateValue);

    return date.toLocaleString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };

  // ==================================================
  // Fetch Payments
  // ==================================================
  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    setLoading(true);
    setError("");

    try {
      // ==================================================
      // 1. Get logged-in staff
      // ==================================================
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        console.error(
          "Payments user error:",
          userError
        );

        setError(
          "Please login again."
        );

        return;
      }

      console.log(
        "Payments logged-in staff:",
        user
      );

      // ==================================================
      // 2. Get staff assignment
      // ==================================================
      const {
        data: staffAssignment,
        error: staffError,
      } = await supabase
        .from("centre_staff")
        .select("centre_id")
        .eq("user_id", user.id)
        .single();

      if (
        staffError ||
        !staffAssignment
      ) {
        console.error(
          "Payments staff assignment error:",
          staffError
        );

        setError(
          "Unable to find your centre assignment."
        );

        return;
      }

      const centreId =
        staffAssignment.centre_id;

      console.log(
        "Payments centre:",
        centreId
      );

      // ==================================================
      // 3. Get bookings belonging to this centre
      // ==================================================
      const {
        data: bookingData,
        error: bookingError,
      } = await supabase
        .from("bookings")
        .select(`
          id,
          farmer_id,
          crop_id,
          token_number,
          booking_date,
          status
        `)
        .eq("centre_id", centreId)
        .order("booking_date", {
          ascending: false,
        });

      if (bookingError) {
        console.error(
          "Payments bookings error:",
          bookingError
        );

        setError(
          "Unable to load booking information."
        );

        return;
      }

      console.log(
        "Payments bookings:",
        bookingData
      );

      if (
        !bookingData ||
        bookingData.length === 0
      ) {
        setPayments([]);
        return;
      }

      // ==================================================
      // 4. Get booking IDs
      // ==================================================
      const bookingIds =
        bookingData.map(
          (booking) =>
            booking.id
        );

      // ==================================================
      // 5. Get procurements for these bookings
      // ==================================================
      const {
        data: procurementData,
        error: procurementError,
      } = await supabase
        .from("procurements")
        .select("*")
        .eq("centre_id", centreId)
        .in(
          "booking_id",
          bookingIds
        )
        .order("created_at", {
          ascending: false,
        });

      if (procurementError) {
        console.error(
          "Payments procurement error:",
          procurementError
        );

        setError(
          "Unable to load procurement information."
        );

        return;
      }

      console.log(
        "Payments procurements:",
        procurementData
      );

      if (
        !procurementData ||
        procurementData.length === 0
      ) {
        setPayments([]);
        return;
      }

      // ==================================================
      // 6. Get procurement IDs
      // ==================================================
      const procurementIds =
        procurementData.map(
          (procurement) =>
            procurement.id
        );

      // ==================================================
      // 7. Get payments
      // ==================================================
      const {
        data: paymentData,
        error: paymentError,
      } = await supabase
        .from("payments")
        .select("*")
        .in(
          "procurement_id",
          procurementIds
        )
        .order("created_at", {
          ascending: false,
        });

      if (paymentError) {
        console.error(
          "Payments fetch error:",
          paymentError
        );

        setError(
          "Unable to load payments."
        );

        return;
      }

      console.log(
        "Payments database data:",
        paymentData
      );

      // ==================================================
      // 8. Get farmer IDs
      // ==================================================
      const farmerIds = [
        ...new Set(
          procurementData
            .map(
              (item) =>
                item.farmer_id
            )
            .filter(Boolean)
        ),
      ];

      // ==================================================
      // 9. Get crop IDs
      // ==================================================
      const cropIds = [
        ...new Set(
          procurementData
            .map(
              (item) =>
                item.crop_id
            )
            .filter(Boolean)
        ),
      ];

      // ==================================================
      // 10. Fetch farmers
      // ==================================================
      let farmers = [];

      if (farmerIds.length > 0) {
        const {
          data: farmerData,
          error: farmerError,
        } = await supabase
          .from("profiles")
          .select("*")
          .in("id", farmerIds);

        if (farmerError) {
          console.error(
            "Payment farmers error:",
            farmerError
          );
        } else {
          farmers =
            farmerData || [];
        }
      }

      console.log(
        "Payment farmers:",
        farmers
      );

      // ==================================================
      // 11. Fetch crops
      // ==================================================
      let crops = [];

      if (cropIds.length > 0) {
        const {
          data: cropData,
          error: cropError,
        } = await supabase
          .from("crops")
          .select(
            "id, name"
          )
          .in(
            "id",
            cropIds
          );

        if (cropError) {
          console.error(
            "Payment crops error:",
            cropError
          );
        } else {
          crops =
            cropData || [];
        }
      }

      console.log(
        "Payment crops:",
        crops
      );

      // ==================================================
      // 12. Enrich payment data
      // ==================================================
      const enrichedPayments = [];

      for (const payment of
        paymentData || []) {
        const procurement =
          procurementData.find(
            (item) =>
              item.id ===
              payment.procurement_id
          );

        if (!procurement) {
          continue;
        }

        const booking =
          bookingData.find(
            (item) =>
              item.id ===
              procurement.booking_id
          );

        const farmer =
          farmers.find(
            (item) =>
              item.id ===
              procurement.farmer_id
          );

        const crop =
          crops.find(
            (item) =>
              item.id ===
              procurement.crop_id
          );

        // --------------------------------------------
        // Database payment status
        // --------------------------------------------
        let displayStatus =
          "Pending";

        if (
          payment.status ===
          "successful"
        ) {
          displayStatus =
            "Successful";
        } else if (
          payment.status ===
          "failed"
        ) {
          displayStatus =
            "Failed";
        } else {
          displayStatus =
            "Pending";
        }

        // --------------------------------------------
        // Quantity
        // --------------------------------------------
        const quantity =
          Number(
            payment.quantity ??
              procurement.quantity ??
              0
          );

        // --------------------------------------------
        // Rate
        // --------------------------------------------
        const rate =
          Number(
            payment.rate_per_quintal ??
              procurement.rate_per_quintal ??
              0
          );

        // --------------------------------------------
        // Amount
        // --------------------------------------------
        const amount =
          Number(
            payment.total_amount ??
              procurement.total_amount ??
              quantity * rate
          );

        enrichedPayments.push({
          ...payment,

          procurementData:
            procurement,

          bookingData:
            booking,

          farmerData:
            farmer,

          cropData:
            crop,

          id:
            payment.transaction_id ||
            `PAY-${payment.id}`,

          paymentId:
            payment.id,

          bookingId:
            booking
              ? `SP${String(
                  booking.id
                ).padStart(
                  6,
                  "0"
                )}`
              : "—",

          farmer:
            farmer?.full_name ||
            "Unknown Farmer",

          token:
            booking?.token_number !=
            null
              ? `#${booking.token_number}`
              : "—",

          crop:
            crop?.name ||
            "Unknown Crop",

          quantity,

          rate,

          amount,

          method:
            payment.payment_method ||
            payment.method ||
            "Bank Transfer",

          transactionId:
            payment.transaction_id ||
            "—",

          date:
            formatDateTime(
              payment.created_at
            ),

          status:
            displayStatus,
        });
      }

      console.log(
        "Enriched payments:",
        enrichedPayments
      );

      setPayments(
        enrichedPayments
      );
    } catch (err) {
      console.error(
        "Payments page error:",
        err
      );

      setError(
        "Something went wrong while loading payments."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==================================================
  // Filter
  // ==================================================
  const filteredPayments =
    useMemo(() => {
      const value =
        search
          .trim()
          .toLowerCase();

      return payments.filter(
        (payment) => {
          const matchesTab =
            activeTab === "All" ||
            payment.status ===
              activeTab;

          if (!value) {
            return matchesTab;
          }

          const matchesSearch =
            payment.farmer
              .toLowerCase()
              .includes(value) ||
            payment.bookingId
              .toLowerCase()
              .includes(value) ||
            payment.id
              .toLowerCase()
              .includes(value) ||
            payment.token
              .toLowerCase()
              .includes(value) ||
            payment.crop
              .toLowerCase()
              .includes(value);

          return (
            matchesTab &&
            matchesSearch
          );
        }
      );
    }, [
      payments,
      activeTab,
      search,
    ]);

  // ==================================================
  // Summary
  // ==================================================
  const totalAmount =
    payments.reduce(
      (total, payment) =>
        payment.status ===
        "Successful"
          ? total +
            payment.amount
          : total,
      0
    );

  const pendingAmount =
    payments.reduce(
      (total, payment) =>
        payment.status ===
        "Pending"
          ? total +
            payment.amount
          : total,
      0
    );

  const successfulCount =
    payments.filter(
      (payment) =>
        payment.status ===
        "Successful"
    ).length;

  const pendingCount =
    payments.filter(
      (payment) =>
        payment.status ===
        "Pending"
    ).length;

  // ==================================================
  // Create Payment
  // ==================================================
  const initiatePayment =
    async (payment) => {
      setActionLoading(true);
      setError("");

      try {
        console.log(
          "Creating payment for procurement:",
          payment.procurementData?.id
        );

        const {
          data,
          error: rpcError,
        } = await supabase.rpc(
          "create_payment",
          {
            p_procurement_id:
              payment
                .procurementData
                ?.id,

            p_rate_per_quintal:
              payment.rate,
          }
        );

        if (rpcError) {
          console.error(
            "Create payment RPC error:",
            rpcError
          );

          setError(
            rpcError.message ||
              "Unable to create payment."
          );

          return;
        }

        console.log(
          "Create payment result:",
          data
        );

        await fetchPayments();

        // Find updated payment
        const updatedPayment =
          payments.find(
            (item) =>
              item
                .procurementData
                ?.id ===
              payment
                .procurementData
                ?.id
          );

        if (updatedPayment) {
          setSelectedPayment(
            updatedPayment
          );
        } else {
          setSelectedPayment(null);
        }
      } catch (err) {
        console.error(
          "Initiate payment error:",
          err
        );

        setError(
          "Unable to initiate payment."
        );
      } finally {
        setActionLoading(false);
      }
    };

  // ==================================================
  // Mark Payment Successful
  // ==================================================
  const markPaymentSuccessful =
    async (payment) => {
      setActionLoading(true);
      setError("");

      try {
        const transactionId =
          `TEST-TXN-${String(
            payment.paymentId
          ).padStart(
            3,
            "0"
          )}`;

        console.log(
          "Marking payment successful:",
          payment.paymentId,
          transactionId
        );

        const {
          data,
          error: rpcError,
        } = await supabase.rpc(
          "mark_payment_successful",
          {
            p_payment_id:
              payment.paymentId,

            p_transaction_id:
              transactionId,
          }
        );

        if (rpcError) {
          console.error(
            "Mark payment RPC error:",
            rpcError
          );

          setError(
            rpcError.message ||
              "Unable to mark payment successful."
          );

          return;
        }

        console.log(
          "Mark payment successful result:",
          data
        );

        await fetchPayments();

        setSelectedPayment(null);
      } catch (err) {
        console.error(
          "Payment success error:",
          err
        );

        setError(
          "Unable to complete payment."
        );
      } finally {
        setActionLoading(false);
      }
    };

  return (
    <div className="mx-auto max-w-[1280px] px-4 py-5 sm:px-6 lg:px-7">

      {/* ==================================================
          Header
      ================================================== */}
      <div>
        <h1 className="text-lg font-extrabold text-blue-950 sm:text-xl">
          Payments
        </h1>

        <p className="mt-1 text-[10px] text-slate-500 sm:text-xs">
          Manage farmer payments and transaction records.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="mt-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-[9px] font-semibold text-red-700">
          {error}
        </div>
      )}

      {/* ==================================================
          Summary
      ================================================== */}
      <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">

        <SummaryCard
          icon={Banknote}
          label="Total Paid"
          value={`₹${totalAmount.toLocaleString(
            "en-IN",
            {
              maximumFractionDigits: 0,
            }
          )}`}
        />

        <SummaryCard
          icon={Clock3}
          label="Pending Amount"
          value={`₹${pendingAmount.toLocaleString(
            "en-IN",
            {
              maximumFractionDigits: 0,
            }
          )}`}
        />

        <SummaryCard
          icon={CheckCircle2}
          label="Successful"
          value={
            loading
              ? "..."
              : successfulCount
          }
        />

        <SummaryCard
          icon={Clock3}
          label="Pending Payments"
          value={
            loading
              ? "..."
              : pendingCount
          }
        />

      </div>

      {/* ==================================================
          Filters
      ================================================== */}
      <div className="mt-5 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">

        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">

          <div className="flex flex-wrap gap-2">

            {tabs.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() =>
                  setActiveTab(tab)
                }
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
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
              placeholder="Search farmer, booking or transaction..."
              className="h-9 w-full rounded-md border border-slate-200 bg-slate-50 pl-9 pr-3 text-[9px] outline-none focus:border-green-600 focus:bg-white"
            />

          </div>

        </div>
      </div>

      {/* ==================================================
          Desktop Table
      ================================================== */}
      <div className="mt-4 hidden overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm lg:block">

        {loading ? (
          <LoadingState />
        ) : (
          <>
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

                  {filteredPayments.map(
                    (payment) => (
                      <tr
                        key={
                          payment.paymentId
                        }
                        className="border-b border-slate-100 last:border-0"
                      >

                        <td className="px-4 py-3">

                          <p className="text-[9px] font-bold text-blue-950">
                            {payment.farmer}
                          </p>

                          <p className="mt-0.5 text-[8px] text-slate-500">
                            Token{" "}
                            {payment.token}
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
                          {payment.quantity}{" "}
                          Qtl
                        </td>

                        <td className="px-4 py-3">

                          <p className="text-[9px] font-extrabold text-blue-950">
                            ₹
                            {payment.amount.toLocaleString(
                              "en-IN",
                              {
                                minimumFractionDigits: 2,
                              }
                            )}
                          </p>

                          <p className="mt-0.5 text-[7px] text-slate-400">
                            ₹
                            {payment.rate.toLocaleString(
                              "en-IN"
                            )}{" "}
                            / Qtl
                          </p>

                        </td>

                        <td className="px-4 py-3 text-[8px] font-semibold text-slate-600">
                          {payment.method}
                        </td>

                        <td className="px-4 py-3">
                          <PaymentStatus
                            status={
                              payment.status
                            }
                          />
                        </td>

                        <td className="px-4 py-3">

                          <div className="flex justify-end gap-2">

                            <button
                              type="button"
                              onClick={() =>
                                setSelectedPayment(
                                  payment
                                )
                              }
                              className="flex items-center gap-1 rounded-md border border-slate-200 px-2.5 py-2 text-[8px] font-bold text-slate-600 hover:bg-slate-50"
                            >
                              <Eye className="h-3 w-3" />
                              View
                            </button>

                            {payment.status ===
                              "Pending" && (
                              <button
                                type="button"
                                disabled={
                                  actionLoading
                                }
                                onClick={() =>
                                  setSelectedPayment(
                                    payment
                                  )
                                }
                                className="rounded-md bg-green-700 px-2.5 py-2 text-[8px] font-bold text-white hover:bg-green-800 disabled:opacity-50"
                              >
                                Pay Now
                              </button>
                            )}

                            {payment.status ===
                              "Successful" && (
                              <button
                                type="button"
                                onClick={() =>
                                  window.print()
                                }
                                className="flex items-center gap-1 rounded-md bg-green-50 px-2.5 py-2 text-[8px] font-bold text-green-700 hover:bg-green-100"
                              >
                                <Download className="h-3 w-3" />
                                Receipt
                              </button>
                            )}

                          </div>

                        </td>

                      </tr>
                    )
                  )}

                </tbody>

              </table>

            </div>

            {filteredPayments.length ===
              0 && <EmptyState />}
          </>
        )}

      </div>

      {/* ==================================================
          Mobile Cards
      ================================================== */}
      <div className="mt-4 space-y-3 lg:hidden">

        {loading ? (
          <LoadingState />
        ) : (
          <>
            {filteredPayments.map(
              (payment) => (
                <div
                  key={
                    payment.paymentId
                  }
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
                        {payment.bookingId}{" "}
                        •{" "}
                        {payment.crop}
                      </p>

                    </div>

                    <PaymentStatus
                      status={
                        payment.status
                      }
                    />

                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3">

                    <InfoItem
                      label="Quantity"
                      value={`${payment.quantity} Qtl`}
                    />

                    <InfoItem
                      label="Amount"
                      value={`₹${payment.amount.toLocaleString(
                        "en-IN",
                        {
                          minimumFractionDigits: 2,
                        }
                      )}`}
                    />

                    <InfoItem
                      label="Payment Method"
                      value={
                        payment.method
                      }
                    />

                    <InfoItem
                      label="Date"
                      value={
                        payment.date
                      }
                    />

                  </div>

                  <div className="mt-4 flex gap-2">

                    <button
                      type="button"
                      onClick={() =>
                        setSelectedPayment(
                          payment
                        )
                      }
                      className="flex flex-1 items-center justify-center gap-1 rounded-md border border-slate-200 py-2 text-[8px] font-bold text-slate-600"
                    >
                      <Eye className="h-3 w-3" />
                      View Details
                    </button>

                    {payment.status ===
                      "Pending" && (
                      <button
                        type="button"
                        onClick={() =>
                          setSelectedPayment(
                            payment
                          )
                        }
                        className="flex-1 rounded-md bg-green-700 py-2 text-[8px] font-bold text-white"
                      >
                        Pay Now
                      </button>
                    )}

                    {payment.status ===
                      "Successful" && (
                      <button
                        type="button"
                        onClick={() =>
                          window.print()
                        }
                        className="flex flex-1 items-center justify-center gap-1 rounded-md bg-green-50 py-2 text-[8px] font-bold text-green-700"
                      >
                        <Download className="h-3 w-3" />
                        Receipt
                      </button>
                    )}

                  </div>

                </div>
              )
            )}

            {filteredPayments.length ===
              0 && <EmptyState />}
          </>
        )}

      </div>

      {/* ==================================================
          Information
      ================================================== */}
      <div className="mt-4 rounded-lg border border-blue-100 bg-blue-50 px-4 py-3">

        <p className="text-[9px] font-bold text-blue-900">
          Payment Information
        </p>

        <p className="mt-1 text-[8px] leading-4 text-blue-800">
          Verify the final quantity and procurement
          amount before initiating a farmer payment.
          Successful transactions can be viewed and
          printed as receipts.
        </p>

      </div>

      {/* ==================================================
          Details Modal
      ================================================== */}
      {selectedPayment && (
        <PaymentModal
          payment={
            selectedPayment
          }
          actionLoading={
            actionLoading
          }
          onClose={() =>
            setSelectedPayment(null)
          }
          onCreatePayment={() =>
            initiatePayment(
              selectedPayment
            )
          }
          onMarkSuccessful={() =>
            markPaymentSuccessful(
              selectedPayment
            )
          }
        />
      )}

    </div>
  );
}

// ==================================================
// Summary Card
// ==================================================
function SummaryCard({
  icon: Icon,
  label,
  value,
}) {
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

// ==================================================
// Payment Status
// ==================================================
function PaymentStatus({
  status,
}) {
  const config = {
    Successful: {
      className:
        "bg-green-50 text-green-700",
      icon: CheckCircle2,
    },

    Pending: {
      className:
        "bg-orange-50 text-orange-700",
      icon: Clock3,
    },

    Failed: {
      className:
        "bg-red-50 text-red-700",
      icon: XCircle,
    },
  };

  const current =
    config[status] ||
    config.Pending;

  const Icon =
    current.icon;

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[7px] font-bold ${current.className}`}
    >
      <Icon className="h-3 w-3" />
      {status}
    </span>
  );
}

// ==================================================
// Info Item
// ==================================================
function InfoItem({
  label,
  value,
}) {
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

// ==================================================
// Loading
// ==================================================
function LoadingState() {
  return (
    <div className="py-12 text-center">

      <div className="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-slate-200 border-t-green-700" />

      <p className="mt-3 text-[9px] font-semibold text-slate-500">
        Loading payments...
      </p>

    </div>
  );
}

// ==================================================
// Empty State
// ==================================================
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

// ==================================================
// Payment Modal
// ==================================================
function PaymentModal({
  payment,
  onClose,
  onCreatePayment,
  onMarkSuccessful,
  actionLoading,
}) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/40 px-4 py-6">

      <div className="max-h-[90vh] w-full max-w-[500px] overflow-y-auto rounded-xl bg-white shadow-xl">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">

          <div>

            <h2 className="text-sm font-extrabold text-blue-950">
              Payment Details
            </h2>

            <p className="mt-0.5 text-[8px] text-slate-500">
              {payment.bookingId}{" "}
              •{" "}
              {payment.farmer}
            </p>

          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1.5 text-slate-400 hover:bg-slate-50 hover:text-slate-700"
          >
            <XCircle className="h-4 w-4" />
          </button>

        </div>

        {/* Details */}
        <div className="grid grid-cols-2 gap-4 px-5 py-5">

          <InfoItem
            label="Farmer"
            value={
              payment.farmer
            }
          />

          <InfoItem
            label="Token"
            value={
              payment.token
            }
          />

          <InfoItem
            label="Crop"
            value={
              payment.crop
            }
          />

          <InfoItem
            label="Quantity"
            value={`${payment.quantity} Quintal`}
          />

          <InfoItem
            label="Rate"
            value={`₹${payment.rate.toLocaleString(
              "en-IN"
            )} / Qtl`}
          />

          <InfoItem
            label="Total Amount"
            value={`₹${payment.amount.toLocaleString(
              "en-IN",
              {
                minimumFractionDigits: 2,
              }
            )}`}
          />

          <InfoItem
            label="Payment Method"
            value={
              payment.method
            }
          />

          <InfoItem
            label="Transaction ID"
            value={
              payment.transactionId
            }
          />

          <InfoItem
            label="Date"
            value={
              payment.date
            }
          />

          <div>

            <p className="text-[7px] font-semibold text-slate-400">
              Status
            </p>

            <div className="mt-1">
              <PaymentStatus
                status={
                  payment.status
                }
              />
            </div>

          </div>

        </div>

        {/* Footer */}
        <div className="flex gap-2 border-t border-slate-100 px-5 py-4">

          <button
            type="button"
            onClick={onClose}
            disabled={
              actionLoading
            }
            className="flex-1 rounded-md border border-slate-200 py-2.5 text-[9px] font-bold text-slate-600 hover:bg-slate-50"
          >
            Close
          </button>

          {/* If payment does not exist / failed */}
          {payment.status ===
            "Failed" && (
            <button
              type="button"
              disabled={
                actionLoading
              }
              onClick={
                onCreatePayment
              }
              className="flex-1 rounded-md bg-green-700 py-2.5 text-[9px] font-bold text-white hover:bg-green-800 disabled:opacity-50"
            >
              {actionLoading
                ? "Processing..."
                : "Create Payment"}
            </button>
          )}

          {/* Pending */}
          {payment.status ===
            "Pending" && (
            <button
              type="button"
              disabled={
                actionLoading
              }
              onClick={
                onMarkSuccessful
              }
              className="flex-1 rounded-md bg-green-700 py-2.5 text-[9px] font-bold text-white hover:bg-green-800 disabled:opacity-50"
            >
              {actionLoading
                ? "Processing..."
                : "Mark Successful"}
            </button>
          )}

          {/* Successful */}
          {payment.status ===
            "Successful" && (
            <button
              type="button"
              onClick={() =>
                window.print()
              }
              className="flex flex-1 items-center justify-center gap-1 rounded-md bg-green-700 py-2.5 text-[9px] font-bold text-white hover:bg-green-800"
            >
              <Download className="h-3 w-3" />
              Print Receipt
            </button>
          )}

        </div>

      </div>
    </div>
  );
}

export default Payments;