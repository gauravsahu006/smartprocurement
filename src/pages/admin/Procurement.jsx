import { useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  Clock3,
  Eye,
  Filter,
  PackageCheck,
  Search,
  Scale,
  Wheat,
  XCircle,
} from "lucide-react";
import { supabase } from "../../lib/supabase";

const tabs = [
  "All",
  "Quality Check",
  "Weighing",
  "Completed",
  "Payment Pending",
  "Cancelled",
];

const statusClasses = {
  "Quality Check": "bg-blue-50 text-blue-700",
  Weighing: "bg-amber-50 text-amber-700",
  Completed: "bg-green-50 text-green-700",
  "Payment Pending": "bg-purple-50 text-purple-700",
  Cancelled: "bg-red-50 text-red-700",
};

const statusIcon = {
  "Quality Check": <Clock3 className="h-3.5 w-3.5" />,
  Weighing: <Scale className="h-3.5 w-3.5" />,
  Completed: <CheckCircle2 className="h-3.5 w-3.5" />,
  "Payment Pending": <PackageCheck className="h-3.5 w-3.5" />,
  Cancelled: <XCircle className="h-3.5 w-3.5" />,
};

function formatDate(date) {
  if (!date) return "-";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatCurrency(value) {
  if (!value || Number(value) <= 0) return "₹0";

  return `₹${Number(value).toLocaleString("en-IN", {
    maximumFractionDigits: 2,
  })}`;
}

function getProcurementStatus(procurement, payment) {
  const status = String(procurement?.status || "").toLowerCase();

  if (
    status === "cancelled" ||
    status === "canceled" ||
    status === "rejected"
  ) {
    return "Cancelled";
  }

  if (status === "completed") {
    return "Completed";
  }

  if (
    payment &&
    String(payment.status || "").toLowerCase() === "successful"
  ) {
    return "Completed";
  }

  if (
    status === "accepted" ||
    status === "payment" ||
    status === "payment_pending"
  ) {
    return "Payment Pending";
  }

  if (
    status === "quality_check" ||
    status === "quality"
  ) {
    return "Quality Check";
  }

  return "Weighing";
}

function AdminProcurement() {
  const [records, setRecords] = useState([]);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("All");
  const [selectedRecord, setSelectedRecord] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // --------------------------------------------------
  // FETCH PROCUREMENT DATA
  // --------------------------------------------------

  const fetchProcurements = async () => {
    try {
      setLoading(true);
      setError("");

      // 1. Get procurements
      const { data: procurements, error: procurementError } =
        await supabase
          .from("procurements")
          .select("*")
          .order("created_at", { ascending: false });

      if (procurementError) {
        throw procurementError;
      }

      if (!procurements || procurements.length === 0) {
        setRecords([]);
        return;
      }

      // --------------------------------------------------
      // 2. GET RELATED IDS
      // --------------------------------------------------

      const bookingIds = [
        ...new Set(
          procurements
            .map((item) => item.booking_id)
            .filter(Boolean)
        ),
      ];

      const farmerIds = [
        ...new Set(
          procurements
            .map((item) => item.farmer_id)
            .filter(Boolean)
        ),
      ];

      const centreIds = [
        ...new Set(
          procurements
            .map((item) => item.centre_id)
            .filter(Boolean)
        ),
      ];

      const cropIds = [
        ...new Set(
          procurements
            .map((item) => item.crop_id)
            .filter(Boolean)
        ),
      ];

      const procurementIds = procurements.map(
        (item) => item.id
      );

      // --------------------------------------------------
      // 3. FETCH ALL RELATED DATA
      // --------------------------------------------------

      const [
        bookingsResult,
        profilesResult,
        centresResult,
        cropsResult,
        weighmentsResult,
        qualityResult,
        paymentsResult,
      ] = await Promise.all([
        bookingIds.length
          ? supabase
              .from("bookings")
              .select("*")
              .in("id", bookingIds)
          : { data: [], error: null },

        farmerIds.length
          ? supabase
              .from("profiles")
              .select("id, full_name, role")
              .in("id", farmerIds)
          : { data: [], error: null },

        centreIds.length
          ? supabase
              .from("centres")
              .select("*")
              .in("id", centreIds)
          : { data: [], error: null },

        cropIds.length
          ? supabase
              .from("crops")
              .select("*")
              .in("id", cropIds)
          : { data: [], error: null },

        procurementIds.length
          ? supabase
              .from("weighments")
              .select("*")
              .in("procurement_id", procurementIds)
          : { data: [], error: null },

        procurementIds.length
          ? supabase
              .from("quality_checks")
              .select("*")
              .in("procurement_id", procurementIds)
          : { data: [], error: null },

        procurementIds.length
          ? supabase
              .from("payments")
              .select("*")
              .in("procurement_id", procurementIds)
          : { data: [], error: null },
      ]);

      // --------------------------------------------------
      // 4. CHECK ERRORS
      // --------------------------------------------------

      const results = [
        bookingsResult,
        profilesResult,
        centresResult,
        cropsResult,
        weighmentsResult,
        qualityResult,
        paymentsResult,
      ];

      const failedResult = results.find(
        (result) => result.error
      );

      if (failedResult?.error) {
        throw failedResult.error;
      }

      const bookings = bookingsResult.data || [];
      const profiles = profilesResult.data || [];
      const centres = centresResult.data || [];
      const crops = cropsResult.data || [];
      const weighments = weighmentsResult.data || [];
      const qualityChecks = qualityResult.data || [];
      const payments = paymentsResult.data || [];

      // --------------------------------------------------
      // 5. CREATE LOOKUP MAPS
      // --------------------------------------------------

      const bookingMap = new Map(
        bookings.map((item) => [item.id, item])
      );

      const profileMap = new Map(
        profiles.map((item) => [item.id, item])
      );

      const centreMap = new Map(
        centres.map((item) => [item.id, item])
      );

      const cropMap = new Map(
        crops.map((item) => [item.id, item])
      );

      // --------------------------------------------------
      // 6. MAP PROCUREMENT DATA
      // --------------------------------------------------

      const formattedRecords = procurements.map(
        (procurement) => {
          const booking =
            bookingMap.get(procurement.booking_id);

          const farmer =
            profileMap.get(procurement.farmer_id);

          const centre =
            centreMap.get(procurement.centre_id);

          const crop =
            cropMap.get(procurement.crop_id);

          const weighment =
            weighments.find(
              (item) =>
                item.procurement_id === procurement.id
            );

          const quality =
            qualityChecks.find(
              (item) =>
                item.procurement_id === procurement.id
            );

          const payment =
            payments.find(
              (item) =>
                item.procurement_id === procurement.id
            );

          const actualQuantity =
            weighment?.quantity ??
            procurement.quantity ??
            0;

          const bookedQuantity =
            booking?.quantity ??
            booking?.booked_quantity ??
            procurement.quantity ??
            0;

          const rate =
            payment?.rate_per_quintal ??
            procurement.rate_per_quintal ??
            0;

          const amount =
            payment?.total_amount ??
            Number(actualQuantity || 0) *
              Number(rate || 0);

          const status = getProcurementStatus(
            procurement,
            payment
          );

          return {
            id: `PR${String(procurement.id).padStart(
              6,
              "0"
            )}`,

            rawId: procurement.id,

            bookingId: booking?.id
              ? `BK${String(booking.id).padStart(
                  6,
                  "0"
                )}`
              : "-",

            rawBookingId: booking?.id,

            farmer:
              farmer?.full_name ||
              farmer?.name ||
              "Unknown Farmer",

            farmerId:
              procurement.farmer_id || "-",

            centre:
              centre?.name ||
              centre?.centre_name ||
              "Unknown Centre",

            crop:
              crop?.name ||
              crop?.crop_name ||
              "Unknown Crop",

            bookedQuantity: Number(
              bookedQuantity || 0
            ),

            actualQuantity: Number(
              actualQuantity || 0
            ),

            rate: Number(rate || 0),

            amount,

            moisture:
              quality?.moisture !== null &&
              quality?.moisture !== undefined
                ? `${quality.moisture}%`
                : "-",

            grade:
              quality?.quality ||
              quality?.grade ||
              "-",

            status,

            date: formatDate(
              procurement.created_at ||
                procurement.updated_at ||
                booking?.booking_date
            ),

            paymentStatus:
              payment?.status || null,

            paymentTransaction:
              payment?.transaction_id || null,

            remarks:
              quality?.remarks || "",

            rawProcurement: procurement,
            rawBooking: booking,
            rawFarmer: farmer,
            rawCentre: centre,
            rawCrop: crop,
            rawWeighment: weighment,
            rawQuality: quality,
            rawPayment: payment,
          };
        }
      );

      setRecords(formattedRecords);
    } catch (err) {
      console.error(
        "Admin procurement error:",
        err
      );

      setError(
        err?.message ||
          "Failed to load procurement data."
      );
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------------
  // INITIAL LOAD
  // --------------------------------------------------

  useEffect(() => {
    fetchProcurements();
  }, []);

  // --------------------------------------------------
  // FILTER
  // --------------------------------------------------

  const filteredRecords = useMemo(() => {
    const query = search
      .toLowerCase()
      .trim();

    return records.filter((record) => {
      const matchesTab =
        activeTab === "All" ||
        record.status === activeTab;

      const matchesSearch =
        !query ||
        record.id
          .toLowerCase()
          .includes(query) ||
        record.bookingId
          .toLowerCase()
          .includes(query) ||
        record.farmer
          .toLowerCase()
          .includes(query) ||
        record.farmerId
          .toLowerCase()
          .includes(query) ||
        record.centre
          .toLowerCase()
          .includes(query) ||
        record.crop
          .toLowerCase()
          .includes(query);

      return matchesTab && matchesSearch;
    });
  }, [records, activeTab, search]);

  // --------------------------------------------------
  // STATS
  // --------------------------------------------------

  const completed = records.filter(
    (record) => record.status === "Completed"
  ).length;

  const inProgress = records.filter(
    (record) =>
      record.status === "Quality Check" ||
      record.status === "Weighing"
  ).length;

  const paymentPending = records.filter(
    (record) =>
      record.status === "Payment Pending"
  ).length;

  const cancelled = records.filter(
    (record) => record.status === "Cancelled"
  ).length;

  const totalQuantity = records.reduce(
    (sum, record) =>
      sum + Number(record.actualQuantity || 0),
    0
  );

  const totalValue = records.reduce(
    (sum, record) =>
      sum + Number(record.amount || 0),
    0
  );

  // --------------------------------------------------
  // MARK COMPLETED
  // --------------------------------------------------

  const markCompleted = async (record) => {
    try {
      if (!record.rawId) return;

      const { error } = await supabase
        .from("procurements")
        .update({
          status: "completed",
        })
        .eq("id", record.rawId);

      if (error) {
        throw error;
      }

      setRecords((current) =>
        current.map((item) =>
          item.rawId === record.rawId
            ? {
                ...item,
                status: "Completed",
              }
            : item
        )
      );

      setSelectedRecord((current) =>
        current
          ? {
              ...current,
              status: "Completed",
            }
          : null
      );
    } catch (err) {
      console.error(
        "Complete procurement error:",
        err
      );

      alert(
        err?.message ||
          "Unable to update procurement."
      );
    }
  };

  // --------------------------------------------------
  // LOADING
  // --------------------------------------------------

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-green-700" />

          <p className="mt-4 text-sm font-semibold text-slate-600">
            Loading procurement data...
          </p>
        </div>
      </div>
    );
  }

  // --------------------------------------------------
  // ERROR
  // --------------------------------------------------

  if (error) {
    return (
      <div className="space-y-4">
        <div className="rounded-xl border border-red-200 bg-red-50 p-5">
          <div className="flex gap-3">
            <XCircle className="h-5 w-5 shrink-0 text-red-600" />

            <div>
              <p className="text-sm font-bold text-red-800">
                Procurement Error
              </p>

              <p className="mt-1 text-xs text-red-700">
                {error}
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={fetchProcurements}
          className="rounded-lg bg-green-700 px-4 py-2.5 text-xs font-bold text-white hover:bg-green-800"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-semibold text-green-700">
            Procurement Monitoring
          </p>

          <h1 className="mt-1 text-2xl font-extrabold text-blue-950 sm:text-3xl">
            Procurement Overview
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Monitor farmer procurement, quality checks,
            weighing and payments across all centres.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600 shadow-sm">
          <Filter className="h-4 w-4 text-green-700" />

          {records.length} Records
        </div>
      </div>

      {/* Stats */}

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {/* Total */}

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500">
              Total Procurement
            </p>

            <div className="rounded-lg bg-green-50 p-2 text-green-700">
              <PackageCheck className="h-5 w-5" />
            </div>
          </div>

          <p className="mt-3 text-2xl font-extrabold text-blue-950">
            {records.length}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Total records
          </p>
        </div>

        {/* Completed */}

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500">
              Completed
            </p>

            <div className="rounded-lg bg-green-50 p-2 text-green-700">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </div>

          <p className="mt-3 text-2xl font-extrabold text-green-700">
            {completed}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Successfully procured
          </p>
        </div>

        {/* In Progress */}

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500">
              In Progress
            </p>

            <div className="rounded-lg bg-blue-50 p-2 text-blue-700">
              <Clock3 className="h-5 w-5" />
            </div>
          </div>

          <p className="mt-3 text-2xl font-extrabold text-blue-700">
            {inProgress}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Quality & weighing
          </p>
        </div>

        {/* Quantity */}

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500">
              Total Quantity
            </p>

            <div className="rounded-lg bg-amber-50 p-2 text-amber-700">
              <Wheat className="h-5 w-5" />
            </div>
          </div>

          <p className="mt-3 text-2xl font-extrabold text-blue-950">
            {totalQuantity.toFixed(1)}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Quintal processed
          </p>
        </div>
      </div>

      {/* Total value */}

      <div className="rounded-xl border border-green-100 bg-green-50 p-4">
        <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-bold text-green-900">
              Total Procurement Value
            </p>

            <p className="mt-1 text-xs text-green-800">
              Calculated from procurement/payment records
            </p>
          </div>

          <p className="text-xl font-extrabold text-green-800">
            {formatCurrency(totalValue)}
          </p>
        </div>
      </div>

      {/* Payment pending */}

      {paymentPending > 0 && (
        <div className="flex flex-col gap-3 rounded-xl border border-purple-100 bg-purple-50 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-3">
            <PackageCheck className="mt-0.5 h-5 w-5 shrink-0 text-purple-700" />

            <div>
              <p className="text-sm font-bold text-purple-900">
                Payment Pending
              </p>

              <p className="mt-1 text-xs text-purple-800">
                {paymentPending} procurement{" "}
                {paymentPending === 1
                  ? "record is"
                  : "records are"}{" "}
                waiting for payment processing.
              </p>
            </div>
          </div>

          <button
            onClick={() =>
              setActiveTab("Payment Pending")
            }
            className="rounded-lg bg-purple-700 px-4 py-2 text-xs font-bold text-white hover:bg-purple-800"
          >
            View Pending
          </button>
        </div>
      )}

      {/* Filters */}

      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-4">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`whitespace-nowrap rounded-lg px-3.5 py-2 text-xs font-bold transition ${
                  activeTab === tab
                    ? "bg-green-700 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="relative w-full lg:max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search farmer, centre or procurement ID..."
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
                  Procurement
                </th>

                <th className="px-5 py-4 text-left text-xs font-bold text-slate-500">
                  Farmer
                </th>

                <th className="px-5 py-4 text-left text-xs font-bold text-slate-500">
                  Centre
                </th>

                <th className="px-5 py-4 text-left text-xs font-bold text-slate-500">
                  Crop
                </th>

                <th className="px-5 py-4 text-left text-xs font-bold text-slate-500">
                  Quantity
                </th>

                <th className="px-5 py-4 text-left text-xs font-bold text-slate-500">
                  Quality
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
              {filteredRecords.map((record) => (
                <tr
                  key={record.rawId}
                  className="border-b border-slate-100 last:border-0 hover:bg-slate-50"
                >
                  <td className="px-5 py-4">
                    <p className="text-sm font-bold text-blue-950">
                      {record.id}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {record.bookingId}
                    </p>
                  </td>

                  <td className="px-5 py-4">
                    <p className="text-sm font-semibold text-slate-800">
                      {record.farmer}
                    </p>

                    <p className="mt-1 max-w-[160px] truncate text-xs text-slate-500">
                      {record.farmerId}
                    </p>
                  </td>

                  <td className="px-5 py-4">
                    <p className="text-sm font-semibold text-slate-800">
                      {record.centre}
                    </p>
                  </td>

                  <td className="px-5 py-4">
                    <span className="inline-flex items-center gap-1.5 rounded-lg bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700">
                      <Wheat className="h-3.5 w-3.5" />

                      {record.crop}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <p className="text-sm font-semibold text-slate-800">
                      {record.actualQuantity > 0
                        ? `${record.actualQuantity} Qtl`
                        : `${record.bookedQuantity} Qtl`}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      Booked: {record.bookedQuantity} Qtl
                    </p>
                  </td>

                  <td className="px-5 py-4">
                    <p className="text-sm font-semibold text-slate-800">
                      {record.grade !== "-"
                        ? `Grade ${record.grade}`
                        : "-"}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      Moisture {record.moisture}
                    </p>
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-bold ${statusClasses[record.status]}`}
                    >
                      {statusIcon[record.status]}

                      {record.status}
                    </span>
                  </td>

                  <td className="px-5 py-4 text-right">
                    <button
                      onClick={() =>
                        setSelectedRecord(record)
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

        {filteredRecords.length === 0 && (
          <div className="px-5 py-12 text-center">
            <PackageCheck className="mx-auto h-10 w-10 text-slate-300" />

            <p className="mt-3 text-sm font-bold text-slate-600">
              No procurement records found
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Try changing your search or status filter.
            </p>
          </div>
        )}
      </div>

      {/* Mobile */}

      <div className="space-y-4 lg:hidden">
        {filteredRecords.map((record) => (
          <div
            key={record.rawId}
            className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-extrabold text-blue-950">
                  {record.id}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  {record.bookingId}
                </p>
              </div>

              <span
                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold ${statusClasses[record.status]}`}
              >
                {statusIcon[record.status]}

                {record.status}
              </span>
            </div>

            <div className="mt-4 space-y-3">
              <div>
                <p className="text-[10px] font-semibold text-slate-400">
                  Farmer
                </p>

                <p className="mt-1 text-sm font-bold text-slate-800">
                  {record.farmer}
                </p>

                <p className="text-[11px] text-slate-500">
                  {record.farmerId}
                </p>
              </div>

              <div>
                <p className="text-[10px] font-semibold text-slate-400">
                  Procurement Centre
                </p>

                <p className="mt-1 text-sm font-bold text-slate-800">
                  {record.centre}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-slate-50 p-3">
                  <p className="text-[10px] font-semibold text-slate-400">
                    Crop
                  </p>

                  <p className="mt-1 text-xs font-bold text-slate-800">
                    {record.crop}
                  </p>
                </div>

                <div className="rounded-lg bg-slate-50 p-3">
                  <p className="text-[10px] font-semibold text-slate-400">
                    Quantity
                  </p>

                  <p className="mt-1 text-xs font-bold text-slate-800">
                    {record.actualQuantity > 0
                      ? `${record.actualQuantity} Qtl`
                      : `${record.bookedQuantity} Qtl`}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-[10px] font-semibold text-slate-400">
                    Grade
                  </p>

                  <p className="mt-1 text-xs font-bold text-slate-800">
                    {record.grade}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] font-semibold text-slate-400">
                    Moisture
                  </p>

                  <p className="mt-1 text-xs font-bold text-slate-800">
                    {record.moisture}
                  </p>
                </div>
              </div>

              <div className="rounded-lg bg-green-50 p-3">
                <p className="text-[10px] font-semibold text-green-600">
                  Procurement Value
                </p>

                <p className="mt-1 text-sm font-extrabold text-green-800">
                  {formatCurrency(record.amount)}
                </p>
              </div>
            </div>

            <button
              onClick={() =>
                setSelectedRecord(record)
              }
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 py-2.5 text-xs font-bold text-blue-700 hover:bg-blue-50"
            >
              <Eye className="h-4 w-4" />

              View Procurement Details
            </button>
          </div>
        ))}

        {filteredRecords.length === 0 && (
          <div className="rounded-xl border border-slate-200 bg-white px-5 py-12 text-center">
            <PackageCheck className="mx-auto h-10 w-10 text-slate-300" />

            <p className="mt-3 text-sm font-bold text-slate-600">
              No procurement records found
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
              Procurement Monitoring
            </p>

            <p className="mt-1 text-xs leading-5 text-green-800">
              Admin can monitor procurement progress,
              actual weight, quality, payment and
              completion status across all procurement
              centres.
            </p>
          </div>
        </div>
      </div>

      {/* Details Modal */}

      {selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4 py-6">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-2xl">
            {/* Modal Header */}

            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <div>
                <h2 className="text-lg font-extrabold text-blue-950">
                  Procurement Details
                </h2>

                <p className="mt-0.5 text-xs text-slate-500">
                  {selectedRecord.id}
                </p>
              </div>

              <button
                onClick={() =>
                  setSelectedRecord(null)
                }
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-5 p-5">
              {/* Status */}

              <div className="flex items-center justify-between rounded-xl bg-slate-50 p-4">
                <div>
                  <p className="text-[11px] font-semibold text-slate-400">
                    Current Status
                  </p>

                  <span
                    className={`mt-2 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${statusClasses[selectedRecord.status]}`}
                  >
                    {statusIcon[selectedRecord.status]}

                    {selectedRecord.status}
                  </span>
                </div>

                <div className="text-right">
                  <p className="text-[11px] text-slate-400">
                    Date
                  </p>

                  <p className="mt-1 text-sm font-bold text-blue-950">
                    {selectedRecord.date}
                  </p>
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
                      {selectedRecord.farmer}
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] text-slate-400">
                      Farmer ID
                    </p>

                    <p className="mt-1 break-all text-sm font-bold text-slate-800">
                      {selectedRecord.farmerId}
                    </p>
                  </div>
                </div>
              </div>

              {/* Procurement */}

              <div>
                <p className="text-xs font-bold text-blue-950">
                  Procurement Information
                </p>

                <div className="mt-3 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[10px] text-slate-400">
                      Booking ID
                    </p>

                    <p className="mt-1 text-sm font-bold text-slate-800">
                      {selectedRecord.bookingId}
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] text-slate-400">
                      Centre
                    </p>

                    <p className="mt-1 text-sm font-bold text-slate-800">
                      {selectedRecord.centre}
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] text-slate-400">
                      Crop
                    </p>

                    <p className="mt-1 text-sm font-bold text-slate-800">
                      {selectedRecord.crop}
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] text-slate-400">
                      Booked Quantity
                    </p>

                    <p className="mt-1 text-sm font-bold text-slate-800">
                      {selectedRecord.bookedQuantity} Qtl
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] text-slate-400">
                      Actual Quantity
                    </p>

                    <p className="mt-1 text-sm font-bold text-green-700">
                      {selectedRecord.actualQuantity > 0
                        ? `${selectedRecord.actualQuantity} Qtl`
                        : "-"}
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] text-slate-400">
                      Rate
                    </p>

                    <p className="mt-1 text-sm font-bold text-slate-800">
                      {selectedRecord.rate > 0
                        ? `₹${selectedRecord.rate.toLocaleString(
                            "en-IN"
                          )} / Qtl`
                        : "-"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Quality */}

              <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
                <p className="text-xs font-bold text-blue-900">
                  Quality Check
                </p>

                <div className="mt-3 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[10px] text-blue-600">
                      Moisture
                    </p>

                    <p className="mt-1 text-sm font-bold text-blue-950">
                      {selectedRecord.moisture}
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] text-blue-600">
                      Grade
                    </p>

                    <p className="mt-1 text-sm font-bold text-blue-950">
                      {selectedRecord.grade !== "-"
                        ? `Grade ${selectedRecord.grade}`
                        : "-"}
                    </p>
                  </div>
                </div>

                {selectedRecord.remarks && (
                  <div className="mt-3 border-t border-blue-100 pt-3">
                    <p className="text-[10px] text-blue-600">
                      Remarks
                    </p>

                    <p className="mt-1 text-xs font-semibold text-blue-900">
                      {selectedRecord.remarks}
                    </p>
                  </div>
                )}
              </div>

              {/* Payment */}

              <div className="rounded-xl bg-green-50 p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold text-green-700">
                      Procurement Value
                    </p>

                    <p className="mt-1 text-xs text-green-800">
                      Based on actual quantity and rate
                    </p>
                  </div>

                  <p className="text-xl font-extrabold text-green-800">
                    {formatCurrency(
                      selectedRecord.amount
                    )}
                  </p>
                </div>

                {selectedRecord.paymentStatus && (
                  <div className="mt-3 border-t border-green-100 pt-3">
                    <p className="text-[10px] text-green-600">
                      Payment Status
                    </p>

                    <p className="mt-1 text-xs font-bold text-green-900">
                      {selectedRecord.paymentStatus}
                    </p>
                  </div>
                )}

                {selectedRecord.paymentTransaction && (
                  <div className="mt-2">
                    <p className="text-[10px] text-green-600">
                      Transaction ID
                    </p>

                    <p className="mt-1 break-all text-xs font-bold text-green-900">
                      {selectedRecord.paymentTransaction}
                    </p>
                  </div>
                )}
              </div>

              {/* Complete */}

              {selectedRecord.status !== "Completed" &&
                selectedRecord.status !== "Cancelled" && (
                  <button
                    onClick={() =>
                      markCompleted(selectedRecord)
                    }
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-green-700 py-2.5 text-xs font-bold text-white hover:bg-green-800"
                  >
                    <CheckCircle2 className="h-4 w-4" />

                    Mark Procurement Completed
                  </button>
                )}

              <button
                onClick={() =>
                  setSelectedRecord(null)
                }
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

export default AdminProcurement;