import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Check,
  Clock3,
  MapPin,
  Radio,
  UserRound,
  Users,
} from "lucide-react";

const queueData = [
  {
    token: "#114",
    status: "Completed",
    completed: true,
  },
  {
    token: "#115",
    status: "Completed",
    completed: true,
  },
  {
    token: "#116",
    status: "Completed",
    completed: true,
  },
  {
    token: "#117",
    status: "Completed",
    completed: true,
  },
  {
    token: "#118",
    status: "In Progress",
    current: true,
  },
  {
    token: "#119",
    status: "Waiting",
  },
  {
    token: "#120",
    status: "Waiting",
  },
  {
    token: "#121",
    status: "Waiting",
  },
  {
    token: "#122",
    status: "Waiting",
  },
];

export default function LiveQueue() {
  const currentToken = 118;
  const yourPosition = 12;
  const estimatedWait = 35;
  const totalQueue = 26;

  return (
    <main className="min-h-full bg-[#f8faf9] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Page Header */}
        <div className="mb-5">
          <Link
            to="/dashboard"
            className="mb-3 inline-flex items-center gap-2 text-xs font-medium text-slate-500 hover:text-green-700"
          >
            <ArrowLeft size={15} />
            Back to Dashboard
          </Link>

          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <h1 className="text-xl font-bold text-[#10233f] sm:text-2xl">
                Live Queue
              </h1>

              <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                Track your position in the queue in real-time.
              </p>
            </div>

            <div className="inline-flex w-fit items-center gap-2 rounded-md border border-green-200 bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700">
              <span className="h-2 w-2 animate-pulse rounded-full bg-green-600" />
              Live Updates
            </div>
          </div>
        </div>

        {/* Centre Card */}
        <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="text-base font-bold text-[#10233f] sm:text-lg">
                ABC Procurement Centre
              </h2>

              <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
                <MapPin
                  size={14}
                  className="text-green-700"
                />
                XYZ Village, Ranchi, Jharkhand
              </div>
            </div>

            <div className="w-fit rounded-md border border-green-200 bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700">
              Token #124
            </div>
          </div>

          {/* Queue Stats */}
          <div className="mt-5 grid grid-cols-2 overflow-hidden rounded-lg border border-slate-200 sm:grid-cols-4">
            <QueueStat
              label="Currently Serving"
              value="#118"
            />

            <QueueStat
              label="Your Position"
              value="#12"
              valueClass="text-green-700"
              suffix="in the queue"
            />

            <QueueStat
              label="Estimated Wait Time"
              value="35 min"
            />

            <QueueStat
              label="Total in Queue"
              value="26"
              suffix="Farmers"
            />
          </div>
        </section>

        {/* Queue Progress */}
        <section className="mt-5 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="mb-5">
            <h2 className="text-sm font-bold text-[#10233f]">
              Queue Progress
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Tokens currently being processed at the centre.
            </p>
          </div>

          {/* Desktop Progress */}
          <div className="hidden overflow-x-auto pb-2 md:block">
            <div className="min-w-[700px] px-5">
              <div className="relative">
                {/* Line */}
                <div className="absolute left-0 right-0 top-3.5 h-px bg-slate-300" />

                <div className="relative flex justify-between">
                  {queueData.map((item) => (
                    <QueueToken
                      key={item.token}
                      token={item.token}
                      status={item.status}
                      completed={item.completed}
                      current={item.current}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Progress */}
          <div className="space-y-3 md:hidden">
            {queueData.map((item) => (
              <div
                key={item.token}
                className={`flex items-center justify-between rounded-lg border px-3 py-3 ${
                  item.current
                    ? "border-blue-200 bg-blue-50"
                    : item.completed
                    ? "border-green-100 bg-green-50"
                    : "border-slate-200 bg-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full ${
                      item.current
                        ? "bg-blue-600 text-white"
                        : item.completed
                        ? "bg-green-600 text-white"
                        : "border border-slate-300 bg-white text-slate-400"
                    }`}
                  >
                    {item.current ? (
                      <UserRound size={15} />
                    ) : item.completed ? (
                      <Check size={15} />
                    ) : (
                      <span className="text-xs">
                        {item.token.replace("#", "")}
                      </span>
                    )}
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-[#10233f]">
                      {item.token}
                    </p>

                    <p className="text-[11px] text-slate-500">
                      {item.status}
                    </p>
                  </div>
                </div>

                {item.current && (
                  <span className="rounded-full bg-blue-100 px-2.5 py-1 text-[10px] font-semibold text-blue-700">
                    You are here
                  </span>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Live Update */}
        <section className="mt-5 overflow-hidden rounded-xl border border-blue-100 bg-blue-50">
          <div className="grid md:grid-cols-[1fr_280px]">
            <div className="p-5 sm:p-6">
              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-white p-2.5 text-blue-600 shadow-sm">
                  <Radio size={20} />
                </div>

                <div>
                  <h2 className="text-sm font-bold text-blue-800">
                    Live Update
                  </h2>

                  <p className="mt-2 text-sm font-medium text-[#10233f]">
                    Token #118 is being served at Counter 2.
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-600">
                    Please wait for your turn. You will be notified
                    when your token is called.
                  </p>
                </div>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <div className="rounded-lg border border-blue-100 bg-white p-3">
                  <div className="flex items-center gap-2">
                    <Clock3
                      size={16}
                      className="text-blue-600"
                    />

                    <span className="text-xs font-medium text-slate-500">
                      Estimated Wait
                    </span>
                  </div>

                  <p className="mt-1 text-sm font-bold text-[#10233f]">
                    {estimatedWait} minutes
                  </p>
                </div>

                <div className="rounded-lg border border-blue-100 bg-white p-3">
                  <div className="flex items-center gap-2">
                    <Users
                      size={16}
                      className="text-blue-600"
                    />

                    <span className="text-xs font-medium text-slate-500">
                      Ahead of You
                    </span>
                  </div>

                  <p className="mt-1 text-sm font-bold text-[#10233f]">
                    {yourPosition - 1} farmers
                  </p>
                </div>
              </div>
            </div>

            {/* Queue Illustration */}
            <div className="hidden items-center justify-center border-l border-blue-100 bg-blue-100/40 p-6 md:flex">
              <QueueIllustration />
            </div>
          </div>
        </section>

        {/* Bottom Information */}
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <InfoCard
            title="Currently Serving"
            value={`Token #${currentToken}`}
            text="Counter 2 is currently processing this token."
          />

          <InfoCard
            title="Your Token"
            value="Token #124"
            text="You will receive a notification when your turn is near."
          />
        </div>
      </div>
    </main>
  );
}

function QueueStat({
  label,
  value,
  valueClass = "text-[#10233f]",
  suffix,
}) {
  return (
    <div className="border-b border-slate-200 px-4 py-4 text-center last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0">
      <p className="text-[10px] font-medium text-slate-500 sm:text-xs">
        {label}
      </p>

      <p
        className={`mt-2 text-xl font-bold ${valueClass} sm:text-2xl`}
      >
        {value}
      </p>

      {suffix && (
        <p className="mt-0.5 text-[9px] text-slate-500">
          {suffix}
        </p>
      )}
    </div>
  );
}

function QueueToken({
  token,
  status,
  completed,
  current,
}) {
  return (
    <div className="flex w-16 flex-col items-center text-center">
      <div
        className={`relative z-10 flex h-7 w-7 items-center justify-center rounded-full ${
          current
            ? "bg-blue-700 text-white ring-4 ring-blue-100"
            : completed
            ? "bg-green-600 text-white"
            : "border border-slate-300 bg-white text-slate-400"
        }`}
      >
        {current ? (
          <UserRound size={13} />
        ) : completed ? (
          <Check size={14} strokeWidth={3} />
        ) : (
          <span className="text-[9px]">
            {token.replace("#", "")}
          </span>
        )}
      </div>

      <p
        className={`mt-3 text-[10px] font-semibold ${
          current
            ? "text-blue-700"
            : completed
            ? "text-[#10233f]"
            : "text-slate-500"
        }`}
      >
        {token}
      </p>

      <p className="mt-0.5 text-[8px] text-slate-400">
        {status}
      </p>
    </div>
  );
}

function InfoCard({ title, value, text }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <p className="text-xs font-medium text-slate-500">
        {title}
      </p>

      <p className="mt-1 text-base font-bold text-[#10233f]">
        {value}
      </p>

      <p className="mt-1 text-xs leading-5 text-slate-500">
        {text}
      </p>
    </div>
  );
}

function QueueIllustration() {
  return (
    <div className="relative h-36 w-full max-w-[230px]">
      {/* Counter */}
      <div className="absolute right-3 top-5 h-24 w-28 rounded-lg border border-blue-200 bg-white shadow-sm">
        <div className="h-5 rounded-t-lg bg-blue-600" />

        <div className="flex h-16 items-end justify-center gap-2 pb-2">
          <div className="h-10 w-7 rounded-t-full bg-green-600" />
          <div className="h-12 w-7 rounded-t-full bg-yellow-500" />
        </div>
      </div>

      {/* Farmer 1 */}
      <div className="absolute bottom-3 left-8">
        <div className="mx-auto h-5 w-5 rounded-full bg-green-700" />
        <div className="mt-1 h-12 w-9 rounded-t-xl bg-green-600" />
      </div>

      {/* Farmer 2 */}
      <div className="absolute bottom-3 left-20">
        <div className="mx-auto h-5 w-5 rounded-full bg-orange-600" />
        <div className="mt-1 h-12 w-9 rounded-t-xl bg-yellow-500" />
      </div>

      {/* Chair */}
      <div className="absolute bottom-0 left-3 h-2 w-32 rounded-full bg-blue-300" />

      {/* Counter label */}
      <div className="absolute right-1 top-0 rounded bg-green-600 px-2 py-1 text-[8px] font-bold text-white">
        COUNTER 2
      </div>
    </div>
  );
}