import { useMemo, useState } from "react";
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

const initialQueue = [
  {
    token: 118,
    farmer: "Ramesh Mahto",
    crop: "Wheat",
    quantity: "42 Quintal",
    wait: "15 min",
    status: "Serving",
  },
  {
    token: 119,
    farmer: "Mohan Oraon",
    crop: "Wheat",
    quantity: "35 Quintal",
    wait: "20 min",
    status: "Waiting",
  },
  {
    token: 120,
    farmer: "Sita Devi",
    crop: "Wheat",
    quantity: "28 Quintal",
    wait: "35 min",
    status: "Waiting",
  },
  {
    token: 121,
    farmer: "Birsa Tudu",
    crop: "Wheat",
    quantity: "45 Quintal",
    wait: "45 min",
    status: "Waiting",
  },
  {
    token: 122,
    farmer: "Pawan Kumar",
    crop: "Maize",
    quantity: "30 Quintal",
    wait: "50 min",
    status: "Waiting",
  },
  {
    token: 123,
    farmer: "Suresh Kumar",
    crop: "Rice",
    quantity: "25 Quintal",
    wait: "60 min",
    status: "Waiting",
  },
];

function QueueManagement() {
  const [queue, setQueue] = useState(initialQueue);
  const [isPaused, setIsPaused] = useState(false);
  const [message, setMessage] = useState("");

  const currentToken = queue.find(
    (item) => item.status === "Serving"
  );

  const waitingQueue = useMemo(
    () => queue.filter((item) => item.status === "Waiting"),
    [queue]
  );

  const nextToken = waitingQueue[0];

  const callNextToken = () => {
    if (!nextToken) {
      setMessage("No farmers are waiting in the queue.");
      return;
    }

    setQueue((prev) =>
      prev.map((item) => {
        if (item.status === "Serving") {
          return {
            ...item,
            status: "Completed",
          };
        }

        if (item.token === nextToken.token) {
          return {
            ...item,
            status: "Serving",
          };
        }

        return item;
      })
    );

    setMessage(`Token #${nextToken.token} is now being served.`);
  };

  const completeCurrentToken = () => {
    if (!currentToken) {
      setMessage("There is no active token.");
      return;
    }

    setQueue((prev) =>
      prev.map((item) =>
        item.token === currentToken.token
          ? { ...item, status: "Completed" }
          : item
      )
    );

    setMessage(`Token #${currentToken.token} has been completed.`);
  };

  const skipCurrentToken = () => {
    if (!currentToken) {
      setMessage("There is no active token.");
      return;
    }

    setQueue((prev) =>
      prev.map((item) =>
        item.token === currentToken.token
          ? { ...item, status: "Skipped" }
          : item
      )
    );

    setMessage(`Token #${currentToken.token} has been skipped.`);
  };

  const announceNext = () => {
    if (!nextToken) {
      setMessage("No next token available.");
      return;
    }

    setMessage(`Announcement sent for Token #${nextToken.token}.`);
  };

  return (
    <div className="mx-auto max-w-[1280px] px-4 py-5 sm:px-6 lg:px-7">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-lg font-extrabold text-blue-950 sm:text-xl">
            Queue Management
          </h1>

          <p className="mt-1 text-[10px] text-slate-500 sm:text-xs">
            Manage and control the live farmer queue
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
                isPaused ? "bg-orange-500" : "bg-green-600"
              }`}
            />

            {isPaused ? "Queue Paused" : "Queue Live"}
          </span>

          <button
            onClick={() => setIsPaused(!isPaused)}
            className="flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 py-2 text-[9px] font-bold text-slate-600 shadow-sm hover:bg-slate-50"
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

      {/* Message */}
      {message && (
        <div className="mt-4 flex items-center gap-2 rounded-lg border border-green-100 bg-green-50 px-4 py-3 text-[10px] font-semibold text-green-700">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          {message}

          <button
            onClick={() => setMessage("")}
            className="ml-auto text-sm"
          >
            ×
          </button>
        </div>
      )}

      {/* Current Token */}
      <section className="mt-5 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
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
                #{currentToken?.token || "--"}
              </p>
            </div>

            <div className="text-center sm:text-right">
              <p className="text-xs font-extrabold text-blue-950">
                {currentToken?.farmer || "No active farmer"}
              </p>

              {currentToken && (
                <>
                  <p className="mt-1 text-[9px] text-slate-500">
                    {currentToken.crop} • {currentToken.quantity}
                  </p>

                  <div className="mt-2 flex items-center justify-center gap-1 text-[9px] font-bold text-green-700 sm:justify-end">
                    <Clock3 className="h-3 w-3" />
                    Serving now
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Current Actions */}
          <div className="mt-4 grid gap-2 sm:grid-cols-3">
            <button
              onClick={completeCurrentToken}
              className="flex items-center justify-center gap-2 rounded-md bg-green-700 px-3 py-2.5 text-[9px] font-bold text-white hover:bg-green-800"
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              Complete
            </button>

            <button
              onClick={skipCurrentToken}
              className="flex items-center justify-center gap-2 rounded-md border border-orange-300 px-3 py-2.5 text-[9px] font-bold text-orange-700 hover:bg-orange-50"
            >
              <SkipForward className="h-3.5 w-3.5" />
              Skip
            </button>

            <button
              onClick={announceNext}
              className="flex items-center justify-center gap-2 rounded-md border border-blue-300 px-3 py-2.5 text-[9px] font-bold text-blue-700 hover:bg-blue-50"
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
              #{nextToken?.token || "--"}
            </p>

            <p className="mt-2 text-xs font-bold text-blue-950">
              {nextToken?.farmer || "Queue is empty"}
            </p>

            {nextToken && (
              <p className="mt-1 text-[9px] text-slate-500">
                {nextToken.crop} • {nextToken.quantity}
              </p>
            )}
          </div>

          <button
            onClick={callNextToken}
            disabled={isPaused || !nextToken}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-md bg-blue-700 py-3 text-[10px] font-bold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Play className="h-3.5 w-3.5" />
            Call Next Token
          </button>
        </div>
      </section>

      {/* Queue Stats */}
      <section className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard
          label="Total in Queue"
          value={queue.filter((item) => item.status !== "Completed" && item.status !== "Skipped").length}
          icon={Users}
        />

        <StatCard
          label="Currently Serving"
          value={currentToken ? 1 : 0}
          icon={Play}
        />

        <StatCard
          label="Waiting"
          value={waitingQueue.length}
          icon={Clock3}
        />

        <StatCard
          label="Completed Today"
          value={queue.filter((item) => item.status === "Completed").length}
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
              {waitingQueue.map((item, index) => (
                <tr
                  key={item.token}
                  className="border-b border-slate-50 hover:bg-slate-50"
                >
                  <td className="py-3 text-[9px] font-extrabold text-blue-950">
                    #{index + 1}
                  </td>

                  <td className="py-3 text-[9px] font-extrabold text-green-700">
                    #{item.token}
                  </td>

                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100">
                        <UserRound className="h-3 w-3 text-slate-500" />
                      </div>

                      <span className="text-[9px] font-semibold text-slate-700">
                        {item.farmer}
                      </span>
                    </div>
                  </td>

                  <td className="py-3 text-[9px] text-slate-600">
                    {item.crop}
                  </td>

                  <td className="py-3 text-[9px] text-slate-600">
                    {item.quantity}
                  </td>

                  <td className="py-3 text-right text-[9px] font-bold text-slate-700">
                    {item.wait}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {waitingQueue.length === 0 && (
          <div className="py-10 text-center">
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
            Call the next token only after the current farmer's
            procurement process is completed.
          </p>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon: Icon }) {
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