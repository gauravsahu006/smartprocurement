import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Activity,
  AlertCircle,
  ArrowUpRight,
  Building2,
  CalendarDays,
  CheckCircle2,
  Clock3,
  IndianRupee,
  Leaf,
  RefreshCw,
  Users,
} from "lucide-react";
import { supabase } from "../../lib/supabase";

// =========================================================
// DATE HELPERS
// =========================================================

function getIndiaDate() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
  }).format(new Date());
}

function getIndiaDayUtcRange() {
  const indiaDate = getIndiaDate();

  const start = new Date(`${indiaDate}T00:00:00+05:30`);
  const end = new Date(`${indiaDate}T23:59:59.999+05:30`);

  return {
    indiaDate,
    startUtc: start.toISOString(),
    endUtc: end.toISOString(),
  };
}

function formatDateTime(value) {
  if (!value) return "—";

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function formatRelativeTime(value) {
  if (!value) return "—";

  const diff = Date.now() - new Date(value).getTime();
  const minutes = Math.max(0, Math.floor(diff / 60000));

  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes} min ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;

  const days = Math.floor(hours / 24);
  return `${days} day${days > 1 ? "s" : ""} ago`;
}

function formatMoney(value) {
  const amount = Number(value || 0);

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function getFarmerName(profile, farmerId) {
  if (!profile) {
    return farmerId ? `Farmer ${String(farmerId).slice(0, 8)}` : "Unknown Farmer";
  }

  return (
    profile.full_name ||
    profile.name ||
    profile.farmer_name ||
    profile.display_name ||
    profile.username ||
    profile.email ||
    `Farmer ${String(farmerId || profile.id).slice(0, 8)}`
  );
}

function getCentreName(centre, centreId) {
  if (!centre) return centreId ? `Centre ${centreId}` : "Unknown Centre";

  return (
    centre.name ||
    centre.centre_name ||
    centre.title ||
    `Centre ${centreId}`
  );
}

function getCropName(crop, cropId) {
  if (!crop) return cropId ? `Crop ${cropId}` : "—";

  return crop.name || crop.crop_name || crop.title || `Crop ${cropId}`;
}

function getBookingQuantity(booking, weighmentByProcurementId) {
  const procurementId =
    booking.procurement_id || booking.procurementId || booking.id;

  const weighment = weighmentByProcurementId[procurementId];

  const quantity =
    weighment?.quantity ??
    booking.quantity ??
    booking.estimated_quantity ??
    booking.expected_quantity ??
    booking.qty;

  return quantity != null ? `${Number(quantity).toLocaleString("en-IN")} Qtl` : "—";
}

function normalizeStatus(status) {
  if (!status) return "Unknown";

  return String(status)
    .replaceAll("_", " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function isPendingPayment(payment) {
  const status = String(payment?.status || "").toLowerCase();
  return !["successful", "completed", "paid", "success"].includes(status);
}

// =========================================================
// MAIN COMPONENT
// =========================================================

function Dashboard() {
  const [dashboard, setDashboard] = useState({
    farmers: [],
    centres: [],
    bookings: [],
    payments: [],
    procurements: [],
    queueEntries: [],
    weighments: [],
    profilesById: {},
    centresById: {},
    cropsById: {},
  });

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const fetchDashboard = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);

      setError("");

      const { indiaDate, startUtc, endUtc } = getIndiaDayUtcRange();

      // -------------------------------------------------------
      // FETCH TABLES
      // -------------------------------------------------------
      //
      // We intentionally use select("*") here because your
      // existing project schema has already been created and
      // this avoids breaking the dashboard because of a guessed
      // optional column name.
      //
      const [
        farmersResult,
        centresResult,
        bookingsResult,
        paymentsResult,
        procurementsResult,
        queueResult,
      ] = await Promise.all([
        supabase
          .from("profiles")
          .select("*")
          .eq("role", "farmer"),

        supabase
          .from("centres")
          .select("*"),

        supabase
          .from("bookings")
          .select("*")
          .eq("booking_date", indiaDate)
          .order("created_at", { ascending: false }),

        supabase
          .from("payments")
          .select("*")
          .order("created_at", { ascending: false }),

        supabase
          .from("procurements")
          .select("*")
          .gte("created_at", startUtc)
          .lt("created_at", endUtc)
          .order("created_at", { ascending: false }),

        supabase
          .from("queue_entries")
          .select("*"),
      ]);

      const results = [
        farmersResult,
        centresResult,
        bookingsResult,
        paymentsResult,
        procurementsResult,
        queueResult,
      ];

      const failed = results.find((result) => result.error);

      if (failed?.error) {
        throw failed.error;
      }

      const farmers = farmersResult.data || [];
      const centres = centresResult.data || [];
      const bookings = bookingsResult.data || [];
      const payments = paymentsResult.data || [];
      const procurements = procurementsResult.data || [];
      const queueEntries = queueResult.data || [];

      // -------------------------------------------------------
      // RELATED DATA
      // -------------------------------------------------------

      const farmerIds = [
        ...new Set(
          [...bookings, ...procurements, ...payments]
            .map((item) => item.farmer_id)
            .filter(Boolean)
        ),
      ];

      const centreIds = [
        ...new Set(
          [...bookings, ...procurements, ...queueEntries]
            .map((item) => item.centre_id)
            .filter(Boolean)
        ),
      ];

      const cropIds = [
        ...new Set(
          bookings
            .map((item) => item.crop_id)
            .filter(Boolean)
        ),
      ];

      let relatedProfiles = [];
      let relatedCentres = [];
      let crops = [];
      let weighments = [];

      if (farmerIds.length > 0) {
        const { data, error: relatedFarmerError } = await supabase
          .from("profiles")
          .select("*")
          .in("id", farmerIds);

        if (relatedFarmerError) throw relatedFarmerError;
        relatedProfiles = data || [];
      }

      if (centreIds.length > 0) {
        const { data, error: centreError } = await supabase
          .from("centres")
          .select("*")
          .in("id", centreIds);

        if (centreError) throw centreError;
        relatedCentres = data || [];
      }

      if (cropIds.length > 0) {
        const { data, error: cropError } = await supabase
          .from("crops")
          .select("*")
          .in("id", cropIds);

        if (cropError) throw cropError;
        crops = data || [];
      }

      // Get weighments for today's procurements.
      const procurementIds = procurements
        .map((item) => item.id)
        .filter(Boolean);

      if (procurementIds.length > 0) {
        const { data, error: weighmentError } = await supabase
          .from("weighments")
          .select("*")
          .in("procurement_id", procurementIds);

        if (weighmentError) throw weighmentError;
        weighments = data || [];
      }

      const profilesById = Object.fromEntries(
        [...farmers, ...relatedProfiles].map((profile) => [
          profile.id,
          profile,
        ])
      );

      const centresById = Object.fromEntries(
        [...centres, ...relatedCentres].map((centre) => [
          centre.id,
          centre,
        ])
      );

      const cropsById = Object.fromEntries(
        crops.map((crop) => [crop.id, crop])
      );

      setDashboard({
        farmers,
        centres,
        bookings,
        payments,
        procurements,
        queueEntries,
        weighments,
        profilesById,
        centresById,
        cropsById,
      });
    } catch (err) {
      console.error("Admin dashboard fetch error:", err);
      setError(
        err?.message ||
          "Failed to load dashboard data from Supabase."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();

    const interval = setInterval(() => {
      fetchDashboard(true);
    }, 30000);

    return () => clearInterval(interval);
  }, [fetchDashboard]);

  // =========================================================
  // DERIVED DATABASE VALUES
  // =========================================================

  const {
    farmers,
    centres,
    bookings,
    payments,
    procurements,
    queueEntries,
    weighments,
    profilesById,
    centresById,
    cropsById,
  } = dashboard;

  const pendingPayments = useMemo(
    () => payments.filter(isPendingPayment),
    [payments]
  );

  const pendingPaymentAmount = useMemo(
    () =>
      pendingPayments.reduce(
        (sum, payment) =>
          sum +
          Number(
            payment.total_amount ??
              payment.amount ??
              payment.total ??
              0
          ),
        0
      ),
    [pendingPayments]
  );

  const activeQueueEntries = useMemo(
    () =>
      queueEntries.filter((entry) =>
        ["waiting", "called", "processing", "in_queue"].includes(
          String(entry.status || "").toLowerCase()
        )
      ),
    [queueEntries]
  );

  const activeQueueCentreIds = useMemo(
    () =>
      new Set(
        activeQueueEntries
          .map((entry) => entry.centre_id)
          .filter(Boolean)
      ),
    [activeQueueEntries]
  );

  const averageWaitMinutes = useMemo(() => {
    const waiting = queueEntries.filter((entry) =>
      ["waiting", "in_queue"].includes(
        String(entry.status || "").toLowerCase()
      )
    );

    if (!waiting.length) return 0;

    const total = waiting.reduce((sum, entry) => {
      const startedAt =
        entry.created_at ||
        entry.joined_at ||
        entry.entry_time ||
        entry.queued_at;

      if (!startedAt) return sum;

      const minutes = Math.max(
        0,
        Math.floor(
          (Date.now() - new Date(startedAt).getTime()) / 60000
        )
      );

      return sum + minutes;
    }, 0);

    return Math.round(total / waiting.length);
  }, [queueEntries]);

  const weighmentByProcurementId = useMemo(
    () =>
      Object.fromEntries(
        weighments.map((item) => [item.procurement_id, item])
      ),
    [weighments]
  );

  const completedProcurements = useMemo(
    () =>
      procurements.filter((item) =>
        ["completed", "complete"].includes(
          String(item.status || "").toLowerCase()
        )
      ),
    [procurements]
  );

  const completedQuantity = useMemo(
    () =>
      completedProcurements.reduce((sum, procurement) => {
        const weighment = weighmentByProcurementId[procurement.id];

        return (
          sum +
          Number(
            weighment?.quantity ??
              procurement.quantity ??
              procurement.total_quantity ??
              0
          )
        );
      }, 0),
    [completedProcurements, weighmentByProcurementId]
  );

  const recentBookings = useMemo(
    () => bookings.slice(0, 5),
    [bookings]
  );

  const recentActivities = useMemo(() => {
    const items = [];

    farmers
      .filter((item) => item.created_at)
      .slice()
      .sort(
        (a, b) =>
          new Date(b.created_at) - new Date(a.created_at)
      )
      .slice(0, 2)
      .forEach((farmer) => {
        items.push({
          id: `farmer-${farmer.id}`,
          title: "Farmer registered",
          description: getFarmerName(farmer, farmer.id),
          time: farmer.created_at,
          icon: Users,
        });
      });

    bookings
      .filter((item) => item.created_at)
      .slice(0, 3)
      .forEach((booking) => {
        items.push({
          id: `booking-${booking.id}`,
          title: "Booking created",
          description: `Booking #${booking.id} at ${getCentreName(
            centresById[booking.centre_id],
            booking.centre_id
          )}`,
          time: booking.created_at,
          icon: CalendarDays,
        });
      });

    procurements
      .filter((item) => item.created_at)
      .slice(0, 3)
      .forEach((procurement) => {
        items.push({
          id: `procurement-${procurement.id}`,
          title: "Procurement updated",
          description: `Procurement #${procurement.id} — ${normalizeStatus(
            procurement.status
          )}`,
          time: procurement.created_at,
          icon: CheckCircle2,
        });
      });

    payments
      .filter((item) => item.created_at)
      .slice(0, 3)
      .forEach((payment) => {
        items.push({
          id: `payment-${payment.id}`,
          title: "Payment update",
          description: `Payment #${payment.id} — ${normalizeStatus(
            payment.status
          )}`,
          time: payment.created_at,
          icon: IndianRupee,
        });
      });

    return items
      .sort((a, b) => new Date(b.time) - new Date(a.time))
      .slice(0, 5);
  }, [
    farmers,
    bookings,
    procurements,
    payments,
    centresById,
  ]);

  const stats = [
    {
      title: "Total Farmers",
      value: farmers.length.toLocaleString("en-IN"),
      change: "Database",
      icon: Users,
      note: "registered farmers",
    },
    {
      title: "Procurement Centres",
      value: centres.length.toLocaleString("en-IN"),
      change: "Database",
      icon: Building2,
      note: "available centres",
    },
    {
      title: "Today's Bookings",
      value: bookings.length.toLocaleString("en-IN"),
      change: "Today",
      icon: CalendarDays,
      note: "bookings today",
    },
    {
      title: "Pending Payments",
      value: formatMoney(pendingPaymentAmount),
      change: String(pendingPayments.length),
      icon: IndianRupee,
      note: "payments pending",
    },
  ];

  const todayLabel = new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  }).format(new Date());

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-semibold text-green-700">
            Admin Dashboard
          </p>

          <h1 className="mt-1 text-2xl font-extrabold text-blue-950 sm:text-3xl">
            Welcome back, Admin! 👋
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Live information from your Supabase database.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm">
            <CalendarDays className="h-4 w-4 text-green-700" />
            {todayLabel}
          </div> */}

          <button
            type="button"
            onClick={() => fetchDashboard(true)}
            disabled={refreshing}
            className="flex h-11 w-11 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-green-300 hover:text-green-700 disabled:cursor-not-allowed disabled:opacity-60"
            title="Refresh dashboard"
          >
            <RefreshCw
              className={`h-4 w-4 ${
                refreshing ? "animate-spin" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {/* Database error */}
      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />

          <div>
            <p className="font-bold">
              Dashboard data could not be loaded
            </p>

            <p className="mt-1 break-words text-xs">
              {error}
            </p>
          </div>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-500 shadow-sm">
          Loading live database data...
        </div>
      )}

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-green-50 text-green-700">
                  <Icon className="h-5 w-5" />
                </div>

                <span className="rounded-full bg-green-50 px-2.5 py-1 text-[11px] font-bold text-green-700">
                  {stat.change}
                </span>
              </div>

              <p className="mt-4 text-sm font-medium text-slate-500">
                {stat.title}
              </p>

              <div className="mt-1 flex items-end gap-2">
                <h2 className="text-2xl font-extrabold text-blue-950">
                  {stat.value}
                </h2>

                <span className="pb-1 text-[11px] text-slate-400">
                  {stat.note}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Grid */}
      <div className="grid gap-5 xl:grid-cols-[1.7fr_1fr]">
        {/* Live Overview */}
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-base font-extrabold text-blue-950">
                Live Procurement Overview
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Current activity calculated from database records.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs font-bold text-green-700">
              <span className="h-2 w-2 animate-pulse rounded-full bg-green-600" />
              Live
            </div>
          </div>

          <div className="grid gap-4 p-5 sm:grid-cols-3">
            <div className="rounded-lg bg-green-50 p-4">
              <div className="flex items-center gap-2 text-green-700">
                <Activity className="h-4 w-4" />
                <span className="text-xs font-bold">
                  Active Queues
                </span>
              </div>

              <p className="mt-2 text-2xl font-extrabold text-blue-950">
                {activeQueueCentreIds.size}
              </p>

              <p className="mt-1 text-[11px] text-slate-500">
                centres currently active
              </p>
            </div>

            <div className="rounded-lg bg-blue-50 p-4">
              <div className="flex items-center gap-2 text-blue-700">
                <Users className="h-4 w-4" />
                <span className="text-xs font-bold">
                  Farmers in Queue
                </span>
              </div>

              <p className="mt-2 text-2xl font-extrabold text-blue-950">
                {activeQueueEntries.length}
              </p>

              <p className="mt-1 text-[11px] text-slate-500">
                active queue entries
              </p>
            </div>

            <div className="rounded-lg bg-orange-50 p-4">
              <div className="flex items-center gap-2 text-orange-700">
                <Clock3 className="h-4 w-4" />
                <span className="text-xs font-bold">
                  Avg. Wait Time
                </span>
              </div>

              <p className="mt-2 text-2xl font-extrabold text-blue-950">
                {averageWaitMinutes} min
              </p>

              <p className="mt-1 text-[11px] text-slate-500">
                for currently waiting farmers
              </p>
            </div>
          </div>

          <div className="border-t border-slate-100 px-5 py-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-blue-950">
                  Today's Procurement
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Completed quantity from today's procurements.
                </p>
              </div>

              <span className="text-sm font-extrabold text-green-700">
                {completedProcurements.length} completed
              </span>
            </div>

            <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-green-600 transition-all"
                style={{
                  width: `${
                    procurements.length
                      ? Math.min(
                          100,
                          (completedProcurements.length /
                            procurements.length) *
                            100
                        )
                      : 0
                  }%`,
                }}
              />
            </div>

            <div className="mt-2 flex justify-between text-[11px] text-slate-500">
              <span>
                {completedQuantity.toLocaleString("en-IN")} Qtl completed
              </span>

              <span>
                {procurements.length.toLocaleString("en-IN")} procurements today
              </span>
            </div>
          </div>
        </div>

        {/* Alerts */}
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-5 py-4">
            <h2 className="text-base font-extrabold text-blue-950">
              System Alerts
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Alerts generated from current database data.
            </p>
          </div>

          <div className="space-y-3 p-5">
            {pendingPayments.length > 0 && (
              <div className="flex gap-3 rounded-lg border border-orange-100 bg-orange-50 p-3">
                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-orange-600" />

                <div>
                  <p className="text-xs font-bold text-orange-800">
                    Pending Payments
                  </p>

                  <p className="mt-1 text-[11px] leading-5 text-orange-700">
                    {pendingPayments.length} payment
                    {pendingPayments.length > 1 ? "s are" : " is"}{" "}
                    waiting for processing.
                  </p>
                </div>
              </div>
            )}

            {activeQueueEntries.length > 0 && (
              <div className="flex gap-3 rounded-lg border border-blue-100 bg-blue-50 p-3">
                <Users className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />

                <div>
                  <p className="text-xs font-bold text-blue-800">
                    Active Queue
                  </p>

                  <p className="mt-1 text-[11px] leading-5 text-blue-700">
                    {activeQueueEntries.length} farmer
                    {activeQueueEntries.length > 1 ? "s are" : " is"}{" "}
                    currently in active queues.
                  </p>
                </div>
              </div>
            )}

            {completedProcurements.length > 0 && (
              <div className="flex gap-3 rounded-lg border border-green-100 bg-green-50 p-3">
                <Leaf className="mt-0.5 h-5 w-5 shrink-0 text-green-700" />

                <div>
                  <p className="text-xs font-bold text-green-800">
                    Procurement Update
                  </p>

                  <p className="mt-1 text-[11px] leading-5 text-green-700">
                    {completedProcurements.length} procurement
                    {completedProcurements.length > 1 ? "s are" : " is"}{" "}
                    completed today.
                  </p>
                </div>
              </div>
            )}

            {!pendingPayments.length &&
              !activeQueueEntries.length &&
              !completedProcurements.length && (
                <div className="rounded-lg border border-slate-100 bg-slate-50 p-4 text-xs text-slate-500">
                  No active alerts from the current database records.
                </div>
              )}
          </div>
        </div>
      </div>

      {/* Bookings + Activity */}
      <div className="grid gap-5 xl:grid-cols-[1.7fr_1fr]">
        {/* Recent Bookings */}
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <div>
              <h2 className="text-base font-extrabold text-blue-950">
                Recent Bookings
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Today's latest bookings from Supabase.
              </p>
            </div>

            <span className="text-xs font-bold text-slate-400">
              {bookings.length} today
            </span>
          </div>

          {recentBookings.length > 0 ? (
            <>
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full min-w-[700px] text-left">
                  <thead className="bg-slate-50">
                    <tr className="text-[11px] font-bold uppercase tracking-wide text-slate-500">
                      <th className="px-5 py-3">Booking</th>
                      <th className="px-5 py-3">Farmer</th>
                      <th className="px-5 py-3">Centre</th>
                      <th className="px-5 py-3">Crop</th>
                      <th className="px-5 py-3">Status</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {recentBookings.map((booking) => {
                      const status = String(
                        booking.status || ""
                      ).toLowerCase();

                      return (
                        <tr
                          key={booking.id}
                          className="text-xs"
                        >
                          <td className="px-5 py-4 font-bold text-blue-950">
                            #{booking.id}
                          </td>

                          <td className="px-5 py-4 font-semibold text-slate-700">
                            {getFarmerName(
                              profilesById[booking.farmer_id],
                              booking.farmer_id
                            )}
                          </td>

                          <td className="px-5 py-4 text-slate-500">
                            {getCentreName(
                              centresById[booking.centre_id],
                              booking.centre_id
                            )}
                          </td>

                          <td className="px-5 py-4 text-slate-600">
                            {getCropName(
                              cropsById[booking.crop_id],
                              booking.crop_id
                            )}{" "}
                            ·{" "}
                            {getBookingQuantity(
                              booking,
                              weighmentByProcurementId
                            )}
                          </td>

                          <td className="px-5 py-4">
                            <span
                              className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
                                ["completed", "complete"].includes(
                                  status
                                )
                                  ? "bg-green-50 text-green-700"
                                  : [
                                      "processing",
                                      "quality_check",
                                      "weighing",
                                    ].includes(status)
                                  ? "bg-orange-50 text-orange-700"
                                  : "bg-blue-50 text-blue-700"
                              }`}
                            >
                              {normalizeStatus(booking.status)}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="divide-y divide-slate-100 md:hidden">
                {recentBookings.map((booking) => (
                  <div key={booking.id} className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-extrabold text-blue-950">
                          #{booking.id}
                        </p>

                        <p className="mt-1 text-sm font-bold text-slate-700">
                          {getFarmerName(
                            profilesById[booking.farmer_id],
                            booking.farmer_id
                          )}
                        </p>

                        <p className="mt-1 text-[11px] text-slate-500">
                          {getCentreName(
                            centresById[booking.centre_id],
                            booking.centre_id
                          )}
                        </p>
                      </div>

                      <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-bold text-blue-700">
                        {normalizeStatus(booking.status)}
                      </span>
                    </div>

                    <div className="mt-3 text-[11px] text-slate-500">
                      {getCropName(
                        cropsById[booking.crop_id],
                        booking.crop_id
                      )}{" "}
                      ·{" "}
                      {getBookingQuantity(
                        booking,
                        weighmentByProcurementId
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="p-8 text-center text-sm text-slate-500">
              No bookings found for today.
            </div>
          )}
        </div>

        {/* Activity */}
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-5 py-4">
            <h2 className="text-base font-extrabold text-blue-950">
              Recent Activity
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Latest database updates.
            </p>
          </div>

          {recentActivities.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {recentActivities.map((activity) => {
                const Icon = activity.icon;

                return (
                  <div
                    key={activity.id}
                    className="flex gap-3 p-4"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-green-50 text-green-700">
                      <Icon className="h-4 w-4" />
                    </div>

                    <div className="min-w-0">
                      <p className="text-xs font-bold text-blue-950">
                        {activity.title}
                      </p>

                      <p className="mt-1 text-[11px] leading-5 text-slate-500">
                        {activity.description}
                      </p>

                      <p className="mt-1 text-[10px] font-medium text-slate-400">
                        {formatRelativeTime(activity.time)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-6 text-center text-sm text-slate-500">
              No recent activity found.
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions intentionally disabled:
          The uploaded UI had navigation buttons but no database-backed
          action handlers/routes were supplied in the component.
          They should be connected only when those admin pages/routes exist.
      */}
    </div>
  );
}

export default Dashboard;
