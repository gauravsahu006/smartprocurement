import { useEffect, useMemo, useState } from "react";
import {
  BellRing,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Megaphone,
  Pause,
  Play,
  SkipForward,
  UserRound,
  Users,
} from "lucide-react";
import { supabase } from "../../lib/supabase";

function QueueManagement() {
  const [queue, setQueue] = useState([]);
  const [centre, setCentre] = useState(null);

  const [isPaused, setIsPaused] = useState(false);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // --------------------------------------------------
  // Fetch Queue
  // --------------------------------------------------

  const fetchQueue = async () => {
    setLoading(true);
    setError("");

    try {
      // 1. Get logged-in staff
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        setError("Please login again.");
        return;
      }

      console.log("Queue Management staff:", user);

      // 2. Get staff centre
      const {
        data: staffAssignment,
        error: staffError,
      } = await supabase
        .from("centre_staff")
        .select("centre_id")
        .eq("user_id", user.id)
        .single();

      if (staffError) {
        console.error(
          "Staff assignment error:",
          staffError
        );

        setError(
          "Unable to find your centre assignment."
        );

        return;
      }

      console.log(
        "Queue Management assignment:",
        staffAssignment
      );

      // 3. Get centre details
      const {
        data: centreData,
        error: centreError,
      } = await supabase
        .from("centres")
        .select("*")
        .eq("id", staffAssignment.centre_id)
        .single();

      if (centreError) {
        console.error(
          "Centre fetch error:",
          centreError
        );

        setError(
          "Unable to load centre information."
        );

        return;
      }

      setCentre(centreData);

      // 4. Get active queue
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
        .eq(
          "centre_id",
          staffAssignment.centre_id
        )
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
          "Queue fetch error:",
          queueError
        );

        setError(
          "Unable to load the queue."
        );

        return;
      }

      console.log(
        "Queue Management active queue:",
        queueData
      );

      // 5. Get farmer IDs
      const farmerIds = [
        ...new Set(
          (queueData || [])
            .map(
              (entry) =>
                entry.booking?.farmer_id
            )
            .filter(Boolean)
        ),
      ];

      // 6. Get crop IDs
      const cropIds = [
        ...new Set(
          (queueData || [])
            .map(
              (entry) =>
                entry.booking?.crop_id
            )
            .filter(Boolean)
        ),
      ];

      // 7. Fetch farmers
      let farmers = [];

      if (farmerIds.length > 0) {
        const {
          data: farmerData,
          error: farmerError,
        } = await supabase
          .from("profiles")
          .select("id, full_name")
          .in("id", farmerIds);

        if (farmerError) {
          console.error(
            "Farmer fetch error:",
            farmerError
          );
        } else {
          farmers = farmerData || [];
        }
      }

      // 8. Fetch crops
      let crops = [];

      if (cropIds.length > 0) {
        const {
          data: cropData,
          error: cropError,
        } = await supabase
          .from("crops")
          .select("id, name")
          .in("id", cropIds);

        if (cropError) {
          console.error(
            "Crop fetch error:",
            cropError
          );
        } else {
          crops = cropData || [];
        }
      }

      // 9. Combine queue + farmer + crop
      const enrichedQueue = (queueData || []).map(
        (entry) => {
          const farmer = farmers.find(
            (item) =>
              item.id ===
              entry.booking?.farmer_id
          );

          const crop = crops.find(
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
        }
      );

      console.log(
        "Queue Management enriched queue:",
        enrichedQueue
      );

      setQueue(enrichedQueue);
    } catch (err) {
      console.error(
        "Queue Management error:",
        err
      );

      setError(
        "Something went wrong while loading the queue."
      );
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------------
  // Initial Load
  // --------------------------------------------------

  useEffect(() => {
    fetchQueue();
  }, []);

  // --------------------------------------------------
  // Current Token
  // --------------------------------------------------
  //
  // Priority:
  // 1. Processing
  // 2. Called
  //
  // This ensures that if a processing token exists,
  // it remains the current token.
  // --------------------------------------------------

  const currentToken = useMemo(() => {
    const processingToken = queue.find(
      (item) =>
        item.status === "processing"
    );

    if (processingToken) {
      return processingToken;
    }

    const calledToken = queue.find(
      (item) =>
        item.status === "called"
    );

    return calledToken || null;
  }, [queue]);

  // --------------------------------------------------
  // Waiting Queue
  // --------------------------------------------------

  const waitingQueue = useMemo(
    () =>
      queue.filter(
        (item) =>
          item.status === "waiting"
      ),
    [queue]
  );

  const nextToken = waitingQueue[0] || null;

  // --------------------------------------------------
  // Current Token State
  // --------------------------------------------------

  const isCalled =
    currentToken?.status === "called";

  const isProcessing =
    currentToken?.status === "processing";

  // --------------------------------------------------
  // Call Next Farmer
  // --------------------------------------------------

  const callNextToken = async () => {
    if (isPaused) {
      setError(
        "Queue is paused. Resume the queue first."
      );
      return;
    }

    if (!centre?.id) {
      setError(
        "Centre information is not available."
      );
      return;
    }

    if (!nextToken) {
      setMessage(
        "No farmers are waiting in the queue."
      );
      return;
    }

    setActionLoading(true);
    setMessage("");
    setError("");

    try {
      console.log(
        "Calling next farmer for centre:",
        centre.id
      );

      const { data, error: rpcError } =
        await supabase.rpc(
          "call_next_farmer",
          {
            p_centre_id: centre.id,
          }
        );

      if (rpcError) {
        console.error(
          "Call next farmer error:",
          rpcError
        );

        setError(
          rpcError.message ||
            "Unable to call next farmer."
        );

        return;
      }

      console.log(
        "Call next farmer result:",
        data
      );

      setMessage(
        `Token #${nextToken.token_number} has been called.`
      );

      await fetchQueue();
    } catch (err) {
      console.error(
        "Call next error:",
        err
      );

      setError(
        "Something went wrong while calling the next farmer."
      );
    } finally {
      setActionLoading(false);
    }
  };

  // --------------------------------------------------
  // Start Processing
  // --------------------------------------------------

  const startProcessing = async () => {
    if (!currentToken) {
      setError(
        "There is no farmer to start processing."
      );
      return;
    }

    if (currentToken.status !== "called") {
      setError(
        "Only a called farmer can start processing."
      );
      return;
    }

    setActionLoading(true);
    setMessage("");
    setError("");

    try {
      console.log(
        "Starting processing for queue entry:",
        currentToken.id
      );

      console.log(
        "Current token status:",
        currentToken.status
      );

      const { data, error: rpcError } =
        await supabase.rpc(
          "start_processing",
          {
            p_queue_entry_id:
              currentToken.id,
          }
        );

      if (rpcError) {
        console.error(
          "Start processing error:",
          rpcError
        );

        setError(
          rpcError.message ||
            "Unable to start processing."
        );

        return;
      }

      console.log(
        "Start processing result:",
        data
      );

      setMessage(
        `Token #${currentToken.token_number} is now being processed.`
      );

      await fetchQueue();
    } catch (err) {
      console.error(
        "Start processing error:",
        err
      );

      setError(
        "Something went wrong while starting processing."
      );
    } finally {
      setActionLoading(false);
    }
  };

  // --------------------------------------------------
  // Skip Current Farmer
  // --------------------------------------------------

  const skipCurrentToken = async () => {
    if (!currentToken) {
      setError(
        "There is no active token."
      );
      return;
    }

    setActionLoading(true);
    setMessage("");
    setError("");

    try {
      console.log(
        "Skipping queue entry:",
        currentToken.id
      );

      const { data, error: rpcError } =
        await supabase.rpc(
          "skip_queue_entry",
          {
            p_queue_entry_id:
              currentToken.id,
          }
        );

      if (rpcError) {
        console.error(
          "Skip queue entry error:",
          rpcError
        );

        setError(
          rpcError.message ||
            "Unable to skip the farmer."
        );

        return;
      }

      console.log(
        "Skip queue result:",
        data
      );

      setMessage(
        `Token #${currentToken.token_number} has been skipped.`
      );

      await fetchQueue();
    } catch (err) {
      console.error(
        "Skip token error:",
        err
      );

      setError(
        "Something went wrong while skipping the farmer."
      );
    } finally {
      setActionLoading(false);
    }
  };

  // --------------------------------------------------
  // Announcement
  // --------------------------------------------------

  const announceNext = () => {
    if (!nextToken) {
      setMessage(
        "No next token available."
      );
      return;
    }

    setMessage(
      `Announcement prepared for Token #${nextToken.token_number}.`
    );
  };

  // --------------------------------------------------
  // Queue Stats
  // --------------------------------------------------

  const activeQueueCount = queue.length;

  const servingCount = queue.filter(
    (item) =>
      item.status === "processing" ||
      item.status === "called"
  ).length;

  const waitingCount =
    waitingQueue.length;

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (
    <div className="mx-auto max-w-[1280px] px-4 py-5 sm:px-6 lg:px-7">

      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <h1 className="text-lg font-extrabold text-blue-950 sm:text-xl">
            Queue Management
          </h1>

          <p className="mt-1 text-[10px] text-slate-500 sm:text-xs">
            {loading
              ? "Loading queue..."
              : centre?.name
                ? `${centre.name} • Manage and control the live farmer queue`
                : "Manage and control the live farmer queue"}
          </p>
        </div>

        <div className="flex items-center gap-2">

          <span
            className={`flex items-center gap-1.5 rounded-full px-3 py-2 text-[9px] font-bold ${
              isPaused
                ? "bg-orange-50 text-orange-700"
                : "bg-green-50 text-green-700"
            }`}
          >
            <span
              className={`h-2 w-2 rounded-full ${
                isPaused
                  ? "bg-orange-500"
                  : "bg-green-600"
              }`}
            />

            {isPaused
              ? "Queue Paused"
              : "Queue Live"}
          </span>

          <button
            onClick={() =>
              setIsPaused(!isPaused)
            }
            disabled={actionLoading}
            className="flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 py-2 text-[9px] font-bold text-slate-600 shadow-sm hover:bg-slate-50 disabled:opacity-50"
          >
            {isPaused ? (
              <>
                <Play className="h-3.5 w-3.5" />
                Resume
              </>
            ) : (
              <>
                <Pause className="h-3.5 w-3.5" />
                Pause
              </>
            )}
          </button>

        </div>
      </div>

      {/* Success Message */}
      {message && (
        <div className="mt-4 flex items-center gap-2 rounded-lg border border-green-100 bg-green-50 px-4 py-3 text-[10px] font-semibold text-green-700">

          <CheckCircle2 className="h-4 w-4 shrink-0" />

          {message}

          <button
            onClick={() =>
              setMessage("")
            }
            className="ml-auto text-sm"
          >
            ×
          </button>

        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mt-4 flex items-center gap-2 rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-[10px] font-semibold text-red-700">

          <span className="shrink-0">
            ⚠
          </span>

          {error}

          <button
            onClick={() =>
              setError("")
            }
            className="ml-auto text-sm"
          >
            ×
          </button>

        </div>
      )}

      {/* Current Token */}
      <section className="mt-5 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">

        {/* Currently Serving */}
        <div className="rounded-xl border border-green-200 bg-white p-5 shadow-sm">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-[9px] font-bold uppercase tracking-wide text-green-700">
                Currently Serving
              </p>

              <h2 className="mt-1 text-sm font-extrabold text-blue-950">
                Token in Service
              </h2>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-50 text-green-700">
              <Users className="h-5 w-5" />
            </div>

          </div>

          <div className="mt-5 flex flex-col items-center justify-between gap-5 rounded-lg bg-green-50 p-5 sm:flex-row">

            <div>
              <p className="text-[9px] font-semibold text-slate-500">
                Current Token
              </p>

              <p className="mt-1 text-5xl font-extrabold text-green-700">
                {loading
                  ? "..."
                  : `#${currentToken?.token_number || "--"}`}
              </p>
            </div>

            <div className="text-center sm:text-right">

              <p className="text-xs font-extrabold text-blue-950">
                {currentToken?.farmer_name ||
                  "No active farmer"}
              </p>

              {currentToken && (
                <>
                  <p className="mt-1 text-[9px] text-slate-500">
                    {currentToken.crop_name ||
                      "Unknown Crop"}
                  </p>

                  <div className="mt-2 flex items-center justify-center gap-1 text-[9px] font-bold text-green-700 sm:justify-end">

                    <Clock3 className="h-3 w-3" />

                    {isProcessing
                      ? "Processing now"
                      : "Called"}

                  </div>
                </>
              )}

            </div>

          </div>

          {/* Current Actions */}
          <div className="mt-4 grid gap-2 sm:grid-cols-3">

            {/* Start Processing */}
            <button
              type="button"
              onClick={startProcessing}
              disabled={
                loading ||
                actionLoading ||
                !currentToken ||
                !isCalled
              }
              className="flex items-center justify-center gap-2 rounded-md bg-green-700 px-3 py-2.5 text-[9px] font-bold text-white hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <CheckCircle2 className="h-3.5 w-3.5" />

              {actionLoading && isCalled
                ? "Processing..."
                : isProcessing
                  ? "Processing Started"
                  : "Start Processing"}
            </button>

            {/* Skip */}
            <button
              type="button"
              onClick={skipCurrentToken}
              disabled={
                loading ||
                actionLoading ||
                !currentToken
              }
              className="flex items-center justify-center gap-2 rounded-md border border-orange-300 px-3 py-2.5 text-[9px] font-bold text-orange-700 hover:bg-orange-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <SkipForward className="h-3.5 w-3.5" />

              Skip
            </button>

            {/* Announce */}
            <button
              type="button"
              onClick={announceNext}
              disabled={
                loading ||
                !nextToken
              }
              className="flex items-center justify-center gap-2 rounded-md border border-blue-300 px-3 py-2.5 text-[9px] font-bold text-blue-700 hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Megaphone className="h-3.5 w-3.5" />

              Announce Next
            </button>

          </div>
        </div>

        {/* Next Token */}
        <div className="rounded-xl border border-blue-200 bg-white p-5 shadow-sm">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-[9px] font-bold uppercase tracking-wide text-blue-700">
                Next in Queue
              </p>

              <h2 className="mt-1 text-sm font-extrabold text-blue-950">
                Next Token
              </h2>
            </div>

            <ChevronRight className="h-5 w-5 text-blue-600" />

          </div>

          <div className="mt-5 rounded-lg bg-blue-50 p-5 text-center">

            <p className="text-[9px] font-semibold text-slate-500">
              Next Token
            </p>

            <p className="mt-1 text-4xl font-extrabold text-blue-700">
              {loading
                ? "..."
                : `#${nextToken?.token_number || "--"}`}
            </p>

            <p className="mt-2 text-xs font-bold text-blue-950">
              {nextToken?.farmer_name ||
                "Queue is empty"}
            </p>

            {nextToken && (
              <p className="mt-1 text-[9px] text-slate-500">
                {nextToken.crop_name ||
                  "Unknown Crop"}
              </p>
            )}

          </div>

          <button
            type="button"
            onClick={callNextToken}
            disabled={
              isPaused ||
              loading ||
              actionLoading ||
              !nextToken
            }
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-md bg-blue-700 py-3 text-[10px] font-bold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Play className="h-3.5 w-3.5" />

            {actionLoading
              ? "Calling..."
              : "Call Next Token"}
          </button>

        </div>
      </section>

      {/* Queue Stats */}
      <section className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">

        <StatCard
          label="Total in Queue"
          value={
            loading
              ? "..."
              : activeQueueCount
          }
          icon={Users}
        />

        <StatCard
          label="Currently Serving"
          value={
            loading
              ? "..."
              : servingCount
          }
          icon={Play}
        />

        <StatCard
          label="Waiting"
          value={
            loading
              ? "..."
              : waitingCount
          }
          icon={Clock3}
        />

        <StatCard
          label="Completed / Skipped"
          value="—"
          icon={CheckCircle2}
        />

      </section>

      {/* Waiting Queue */}
      <section className="mt-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">

        <div className="flex items-center justify-between">

          <div>
            <h2 className="text-[11px] font-extrabold text-blue-950">
              Waiting Queue
            </h2>

            <p className="mt-0.5 text-[8px] text-slate-500">
              Farmers waiting for their turn
            </p>
          </div>

          <BellRing className="h-4 w-4 text-green-700" />

        </div>

        <div className="mt-4 overflow-x-auto">

          <table className="w-full min-w-[650px]">

            <thead>
              <tr className="border-b border-slate-100 text-left">

                <th className="pb-2 text-[8px] font-bold text-slate-500">
                  Position
                </th>

                <th className="pb-2 text-[8px] font-bold text-slate-500">
                  Token
                </th>

                <th className="pb-2 text-[8px] font-bold text-slate-500">
                  Farmer
                </th>

                <th className="pb-2 text-[8px] font-bold text-slate-500">
                  Crop
                </th>

                <th className="pb-2 text-[8px] font-bold text-slate-500">
                  Quantity
                </th>

                <th className="pb-2 text-right text-[8px] font-bold text-slate-500">
                  Est. Wait
                </th>

              </tr>
            </thead>

            <tbody>

              {loading ? (
                <tr>
                  <td
                    colSpan="6"
                    className="py-10 text-center text-[9px] text-slate-500"
                  >
                    Loading queue...
                  </td>
                </tr>
              ) : waitingQueue.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="py-10 text-center text-[9px] text-slate-500"
                  >
                    No farmers are waiting.
                  </td>
                </tr>
              ) : (
                waitingQueue.map(
                  (item, index) => (
                    <tr
                      key={item.id}
                      className="border-b border-slate-50 hover:bg-slate-50"
                    >

                      <td className="py-3 text-[9px] font-extrabold text-blue-950">
                        #{index + 1}
                      </td>

                      <td className="py-3 text-[9px] font-extrabold text-green-700">
                        #{item.token_number}
                      </td>

                      <td className="py-3">

                        <div className="flex items-center gap-2">

                          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100">
                            <UserRound className="h-3 w-3 text-slate-500" />
                          </div>

                          <span className="text-[9px] font-semibold text-slate-700">
                            {item.farmer_name}
                          </span>

                        </div>

                      </td>

                      <td className="py-3 text-[9px] text-slate-600">
                        {item.crop_name}
                      </td>

                      <td className="py-3 text-[9px] text-slate-600">
                        —
                      </td>

                      <td className="py-3 text-right text-[9px] font-bold text-slate-700">
                        —
                      </td>

                    </tr>
                  )
                )
              )}

            </tbody>

          </table>

        </div>

        {!loading &&
          waitingQueue.length === 0 && (
            <div className="py-5 text-center">
              <CheckCircle2 className="mx-auto h-8 w-8 text-green-600" />

              <p className="mt-2 text-xs font-bold text-blue-950">
                Queue is empty
              </p>

              <p className="mt-1 text-[9px] text-slate-500">
                There are no farmers waiting right now.
              </p>
            </div>
          )}

      </section>

      {/* Information */}
      <div className="mt-4 flex items-start gap-3 rounded-lg border border-blue-100 bg-blue-50 px-4 py-3">

        <BellRing className="mt-0.5 h-4 w-4 shrink-0 text-blue-700" />

        <div>
          <p className="text-[9px] font-bold text-blue-900">
            Queue Management Tip
          </p>

          <p className="mt-0.5 text-[8px] leading-4 text-blue-800">
            Call the next token first. After the farmer is
            called, use Start Processing to begin the
            procurement process.
          </p>
        </div>

      </div>
    </div>
  );
}

// --------------------------------------------------
// Stat Card
// --------------------------------------------------

function StatCard({
  label,
  value,
  icon: Icon,
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">

      <div className="flex items-center justify-between">

        <p className="text-[9px] font-semibold text-slate-500">
          {label}
        </p>

        <Icon className="h-4 w-4 text-green-700" />

      </div>

      <p className="mt-2 text-2xl font-extrabold text-blue-950">
        {value}
      </p>

    </div>
  );
}

export default QueueManagement;