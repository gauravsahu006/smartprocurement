import { useEffect, useState } from "react";
import {
  BellRing,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Eye,
  FileText,
  PackageCheck,
  Users,
} from "lucide-react";
import { supabase } from "../../lib/supabase";

function Dashboard() {
  const [centre, setCentre] = useState(null);
  const [queueEntries, setQueueEntries] = useState([]);
  const [todayBookings, setTodayBookings] = useState([]);
  const [todayProcurements, setTodayProcurements] = useState([]);
  const [todayPayments, setTodayPayments] = useState([]);
  const [todayWeighments, setTodayWeighments] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // --------------------------------------------------
  // Get current date in India/local browser timezone
  // --------------------------------------------------
  const getLocalDate = () => {
    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  // --------------------------------------------------
  // Fetch Dashboard Data
  // --------------------------------------------------
  const fetchDashboardData = async () => {
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
        console.error("Dashboard user error:", userError);
        setError("Please login again.");
        return;
      }

      console.log("Dashboard logged-in staff:", user);

      // ==================================================
      // 2. Get staff centre assignment
      // ==================================================
      const { data: staffAssignment, error: staffError } =
        await supabase
          .from("centre_staff")
          .select("centre_id")
          .eq("user_id", user.id)
          .single();

      if (staffError || !staffAssignment) {
        console.error(
          "Dashboard staff assignment error:",
          staffError
        );

        setError(
          "Unable to find your centre assignment."
        );

        return;
      }

      console.log(
        "Dashboard staff assignment:",
        staffAssignment
      );

      const centreId = staffAssignment.centre_id;

      // ==================================================
      // 3. Get centre details
      // ==================================================
      const { data: centreData, error: centreError } =
        await supabase
          .from("centres")
          .select("*")
          .eq("id", centreId)
          .single();

      if (centreError || !centreData) {
        console.error(
          "Dashboard centre error:",
          centreError
        );

        setError(
          "Unable to load centre information."
        );

        return;
      }

      console.log(
        "Dashboard centre:",
        centreData
      );

      setCentre(centreData);

      // ==================================================
      // 4. Get today's date
      // ==================================================
      const today = getLocalDate();

      console.log(
        "Dashboard date:",
        today
      );

      // ==================================================
      // 5. Get today's bookings
      // ==================================================
      const {
        data: bookingsData,
        error: bookingsError,
      } = await supabase
        .from("bookings")
        .select("*")
        .eq("centre_id", centreId)
        .eq("booking_date", today)
        .order("token_number", {
          ascending: true,
        });

      if (bookingsError) {
        console.error(
          "Bookings error:",
          bookingsError
        );

        setTodayBookings([]);
      } else {
        console.log(
          "Today's bookings:",
          bookingsData
        );

        setTodayBookings(
          bookingsData || []
        );
      }

      // ==================================================
      // 6. Get active queue
      // ==================================================
      const {
        data: queueData,
        error: queueError,
      } = await supabase
        .from("queue_entries")
        .select(`
          *,
          booking:bookings(
            farmer_id,
            crop_id,
            booking_date,
            status
          )
        `)
        .eq("centre_id", centreId)
        .in("status", [
          "waiting",
          "called",
          "processing",
        ])
        .order("queue_position", {
          ascending: true,
        });

      if (queueError) {
        console.error(
          "Queue error:",
          queueError
        );

        setQueueEntries([]);
      } else {
        // ----------------------------------------------
        // Only today's queue
        // ----------------------------------------------
        const todaysQueue = (queueData || []).filter(
          (entry) =>
            entry.booking?.booking_date === today
        );

        console.log(
          "Today's active queue:",
          todaysQueue
        );

        if (todaysQueue.length > 0) {
          // --------------------------------------------
          // Get unique farmer IDs
          // --------------------------------------------
          const farmerIds = [
            ...new Set(
              todaysQueue
                .map(
                  (entry) =>
                    entry.booking?.farmer_id
                )
                .filter(Boolean)
            ),
          ];

          // --------------------------------------------
          // Get unique crop IDs
          // --------------------------------------------
          const cropIds = [
            ...new Set(
              todaysQueue
                .map(
                  (entry) =>
                    entry.booking?.crop_id
                )
                .filter(Boolean)
            ),
          ];

          // --------------------------------------------
          // Fetch farmer profiles
          // --------------------------------------------
          let farmers = [];

          if (farmerIds.length > 0) {
            const {
              data: farmerData,
              error: farmersError,
            } = await supabase
              .from("profiles")
              .select("id, full_name")
              .in("id", farmerIds);

            if (farmersError) {
              console.error(
                "Farmers fetch error:",
                farmersError
              );
            } else {
              farmers = farmerData || [];
            }
          }

          // --------------------------------------------
          // Fetch crops
          // --------------------------------------------
          let crops = [];

          if (cropIds.length > 0) {
            const {
              data: cropData,
              error: cropsError,
            } = await supabase
              .from("crops")
              .select("id, name")
              .in("id", cropIds);

            if (cropsError) {
              console.error(
                "Crops fetch error:",
                cropsError
              );
            } else {
              crops = cropData || [];
            }
          }

          console.log(
            "Queue farmers:",
            farmers
          );

          console.log(
            "Queue crops:",
            crops
          );

          // --------------------------------------------
          // Enrich queue
          // --------------------------------------------
          const enrichedQueue =
            todaysQueue.map((entry) => {
              const farmer =
                farmers.find(
                  (item) =>
                    item.id ===
                    entry.booking?.farmer_id
                );

              const crop =
                crops.find(
                  (item) =>
                    item.id ===
                    entry.booking?.crop_id
                );

              return {
                ...entry,

                farmer_name:
                  farmer?.full_name ||
                  "Unknown Farmer",

                crop_name:
                  crop?.name ||
                  "Unknown Crop",
              };
            });

          console.log(
            "Enriched queue:",
            enrichedQueue
          );

          setQueueEntries(
            enrichedQueue
          );
        } else {
          setQueueEntries([]);
        }
      }

      // ==================================================
      // 7. Get today's procurements
      //
      // IMPORTANT:
      // Do NOT filter using procurement.created_at.
      //
      // Instead:
      // Today's bookings -> booking IDs -> procurements
      // ==================================================

      const bookingIds = (
        bookingsData || []
      ).map(
        (booking) => booking.id
      );

      let procurementData = [];

      if (bookingIds.length > 0) {
        const {
          data,
          error: procurementError,
        } = await supabase
          .from("procurements")
          .select("*")
          .eq("centre_id", centreId)
          .in("booking_id", bookingIds)
          .order("updated_at", {
            ascending: false,
          });

        if (procurementError) {
          console.error(
            "Procurement error:",
            procurementError
          );
        } else {
          procurementData = data || [];
        }
      }

      console.log(
        "Today's procurements:",
        procurementData
      );

      setTodayProcurements(
        procurementData
      );

      // ==================================================
      // 8. Get today's payments
      //
      // Today's procurements -> procurement IDs
      // -> payments
      // ==================================================

      const procurementIds =
        procurementData.map(
          (procurement) =>
            procurement.id
        );

      let paymentData = [];

      if (procurementIds.length > 0) {
        const {
          data,
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
            "Payment error:",
            paymentError
          );
        } else {
          paymentData = data || [];
        }
      }

      console.log(
        "Today's payments:",
        paymentData
      );

      setTodayPayments(
        paymentData
      );

      // ==================================================
      // 9. Get weighments
      //
      // Quantity should come from actual weighing
      // ==================================================

      let weighmentData = [];

      if (procurementIds.length > 0) {
        const {
          data,
          error: weighmentError,
        } = await supabase
          .from("weighments")
          .select("*")
          .in(
            "procurement_id",
            procurementIds
          )
          .order("weighed_at", {
            ascending: false,
          });

        if (weighmentError) {
          console.error(
            "Weighment error:",
            weighmentError
          );
        } else {
          weighmentData =
            data || [];
        }
      }

      console.log(
        "Today's weighments:",
        weighmentData
      );
      setTodayWeighments(
  weighmentData
);
    } catch (err) {
      console.error(
        "Dashboard error:",
        err
      );

      setError(
        "Something went wrong while loading dashboard."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==================================================
  // Dashboard Calculations
  // ==================================================

  // Total tokens booked today
  const totalTokens =
    todayBookings.length;

  // Farmers currently in active queue
  const currentlyInQueue =
    queueEntries.length;

  // Completed procurements
  const procurementDone =
    todayProcurements.filter(
      (item) =>
        item.status === "completed"
    ).length;

  // --------------------------------------------------
  // Pending payments
  // --------------------------------------------------
  const pendingPayments =
    todayPayments.filter(
      (item) =>
        item.status === "pending"
    ).length;

  // --------------------------------------------------
  // Quantity
  //
  // Use actual weighment quantity.
  // Procurement table may not contain quantity.
  // --------------------------------------------------
const totalQuantity =
  todayWeighments.reduce(
    (total, weighment) =>
      total +
      Number(weighment.quantity || 0),
    0
  );
  return (
    <div className="mx-auto max-w-[1280px] px-4 py-5 sm:px-6 lg:px-7">

      {/* ==================================================
          Header
      ================================================== */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <h1 className="text-lg font-extrabold text-blue-950 sm:text-xl">
            Centre Dashboard
          </h1>

          <p className="mt-1 text-[10px] font-semibold text-green-700 sm:text-xs">
            {loading
              ? "Loading centre..."
              : centre?.name || "Centre"}
          </p>
        </div>

        <button
          type="button"
          className="flex w-fit items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-[10px] font-semibold text-slate-700 shadow-sm"
        >
          <CalendarDays className="h-3.5 w-3.5 text-slate-500" />

          {new Date().toLocaleDateString(
            "en-GB",
            {
              day: "2-digit",
              month: "short",
              year: "numeric",
            }
          )}

          <ChevronDown className="h-3 w-3 text-slate-400" />
        </button>
      </div>

      {/* ==================================================
          Error
      ================================================== */}
      {error && (
        <div className="mt-3 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-[10px] font-semibold text-red-700">
          {error}
        </div>
      )}

      {/* ==================================================
          Summary Cards
      ================================================== */}
      <section className="mt-4 grid grid-cols-2 gap-3 xl:grid-cols-4">

        {/* Total Tokens */}
        <div className="rounded-lg border border-green-200 bg-white p-4 shadow-sm">

          <div className="flex items-center justify-between">

            <p className="text-[9px] font-semibold text-slate-500">
              Total Tokens Today
            </p>

            <CheckCircle2 className="h-4 w-4 text-green-700" />

          </div>

          <p className="mt-2 text-2xl font-extrabold text-green-700">
            {loading
              ? "..."
              : totalTokens}
          </p>

          <button
            type="button"
            className="mt-1 text-[9px] font-bold text-green-700 hover:underline"
          >
            View Details
          </button>

        </div>

        {/* Currently In Queue */}
        <div className="rounded-lg border border-blue-200 bg-white p-4 shadow-sm">

          <div className="flex items-center justify-between">

            <p className="text-[9px] font-semibold text-slate-500">
              Currently in Queue
            </p>

            <Users className="h-4 w-4 text-blue-700" />

          </div>

          <p className="mt-2 text-2xl font-extrabold text-blue-700">
            {loading
              ? "..."
              : currentlyInQueue}
          </p>

          <button
            type="button"
            className="mt-1 text-[9px] font-bold text-blue-700 hover:underline"
          >
            View Queue
          </button>

        </div>

        {/* Procurement Done */}
        <div className="rounded-lg border border-orange-200 bg-white p-4 shadow-sm">

          <div className="flex items-center justify-between">

            <p className="text-[9px] font-semibold text-slate-500">
              Procurement Done
            </p>

            <PackageCheck className="h-4 w-4 text-orange-600" />

          </div>

          <p className="mt-2 text-2xl font-extrabold text-orange-600">
            {loading
              ? "..."
              : procurementDone}
          </p>

          <button
            type="button"
            className="mt-1 text-[9px] font-bold text-orange-600 hover:underline"
          >
            View Details
          </button>

        </div>

        {/* Pending Payments */}
        <div className="rounded-lg border border-purple-200 bg-white p-4 shadow-sm">

          <div className="flex items-center justify-between">

            <p className="text-[9px] font-semibold text-slate-500">
              Pending Payments
            </p>

            <Clock3 className="h-4 w-4 text-purple-700" />

          </div>

          <p className="mt-2 text-2xl font-extrabold text-purple-700">
            {loading
              ? "..."
              : pendingPayments}
          </p>

          <button
            type="button"
            className="mt-1 text-[9px] font-bold text-purple-700 hover:underline"
          >
            View Details
          </button>

        </div>
      </section>

      {/* ==================================================
          Main Content
      ================================================== */}
      <section className="mt-4 grid gap-3 lg:grid-cols-[1.55fr_0.85fr]">

        {/* ==================================================
            Live Queue
        ================================================== */}
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">

          <div className="flex items-center justify-between">

            <div>
              <h2 className="text-[11px] font-extrabold text-blue-950">
                Live Queue
              </h2>

              <p className="mt-0.5 text-[8px] text-slate-500">
                Farmers currently waiting at the centre
              </p>
            </div>

            <BellRing className="h-4 w-4 text-green-700" />

          </div>

          {/* Table */}
          <div className="mt-4 overflow-x-auto">

            <table className="w-full min-w-[600px]">

              <thead>
                <tr className="border-b border-slate-100 text-left">

                  <th className="pb-2 text-[8px] font-bold text-slate-500">
                    Token No.
                  </th>

                  <th className="pb-2 text-[8px] font-bold text-slate-500">
                    Farmer Name
                  </th>

                  <th className="pb-2 text-[8px] font-bold text-slate-500">
                    Crop
                  </th>

                  <th className="pb-2 text-[8px] font-bold text-slate-500">
                    Status
                  </th>

                  <th className="pb-2 text-right text-[8px] font-bold text-slate-500">
                    Est. Wait Time
                  </th>

                </tr>
              </thead>

              <tbody>

                {loading ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-6 py-8 text-center text-[9px] text-slate-500"
                    >
                      Loading queue...
                    </td>
                  </tr>
                ) : queueEntries.length === 0 ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-6 py-8 text-center text-[9px] text-slate-500"
                    >
                      No farmers currently in queue.
                    </td>
                  </tr>
                ) : (
                  queueEntries
                    .slice(0, 5)
                    .map((entry) => (
                      <QueueRow
                        key={entry.id}
                        token={`#${entry.token_number}`}
                        farmer={
                          entry.farmer_name
                        }
                        crop={
                          entry.crop_name
                        }
                        status={
                          entry.status ===
                          "processing"
                            ? "In Progress"
                            : entry.status ===
                              "called"
                            ? "Called"
                            : "Waiting"
                        }
                        wait="—"
                        active={
                          entry.status ===
                          "processing"
                        }
                      />
                    ))
                )}

              </tbody>
            </table>
          </div>

          <div className="mt-3 text-center">
            <button
              type="button"
              className="text-[9px] font-bold text-green-700 hover:underline"
            >
              View Full Queue
            </button>
          </div>

        </div>

        {/* ==================================================
            Today's Summary
        ================================================== */}
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">

          <div className="flex items-center gap-2">

            <FileText className="h-4 w-4 text-blue-700" />

            <h2 className="text-[11px] font-extrabold text-blue-950">
              Today's Summary
            </h2>

          </div>

          <div className="mt-4 space-y-3">

            {/* Farmers Served */}
            <SummaryRow
              label="Total Farmers Served"
              value={
                loading
                  ? "..."
                  : procurementDone
              }
            />

            {/* Quantity */}
            <SummaryRow
              label="Total Quantity (Quintal)"
              value={
                loading
                  ? "..."
                  : totalQuantity.toFixed(2)
              }
            />

            {/* Wait Time */}
            <SummaryRow
              label="Average Wait Time"
              value="32 min"
            />

            {/* Tokens */}
            <SummaryRow
              label="Token Issued"
              value={
                loading
                  ? "..."
                  : totalTokens
              }
            />

          </div>

          <button
            type="button"
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-md border border-green-600 py-2 text-[9px] font-bold text-green-700 transition hover:bg-green-50"
          >
            <Eye className="h-3.5 w-3.5" />
            View Report
          </button>

        </div>

      </section>

      {/* ==================================================
          Announcement
      ================================================== */}
      <section className="mt-3 flex items-start gap-3 rounded-lg border border-blue-100 bg-blue-50 px-4 py-3">

        <BellRing className="mt-0.5 h-4 w-4 shrink-0 text-blue-700" />

        <div className="min-w-0">

          <p className="text-[9px] font-bold text-blue-900">
            Announcement
          </p>

          <p className="mt-0.5 text-[8px] leading-4 text-blue-800">
            Live queue data is connected with Supabase.
          </p>

        </div>

        <button
          type="button"
          className="ml-auto text-xs text-blue-700"
        >
          ×
        </button>

      </section>

    </div>
  );
}

// ==================================================
// Queue Row
// ==================================================
function QueueRow({
  token,
  farmer,
  crop,
  status,
  wait,
  active,
}) {
  return (
    <tr
      className={`border-b border-slate-50 ${
        active
          ? "bg-green-50/50"
          : ""
      }`}
    >

      <td className="py-2.5 text-[9px] font-bold text-green-700">
        {token}
      </td>

      <td className="py-2.5 text-[9px] font-medium text-slate-700">
        {farmer}
      </td>

      <td className="py-2.5 text-[9px] text-slate-600">
        {crop}
      </td>

      <td className="py-2.5">

        <span
          className={`rounded-full px-2 py-1 text-[7px] font-bold ${
            active
              ? "bg-green-100 text-green-700"
              : "bg-slate-100 text-slate-600"
          }`}
        >
          {status}
        </span>

      </td>

      <td className="py-2.5 text-right text-[9px] font-bold text-slate-700">
        {wait}
      </td>

    </tr>
  );
}

// ==================================================
// Summary Row
// ==================================================
function SummaryRow({
  label,
  value,
}) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-2.5">

      <span className="text-[9px] text-slate-500">
        {label}
      </span>

      <span className="text-[10px] font-extrabold text-blue-950">
        {value}
      </span>

    </div>
  );
}

export default Dashboard;