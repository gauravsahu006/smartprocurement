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

function Dashboard() {
  return (
    <div className="mx-auto max-w-[1280px] px-4 py-5 sm:px-6 lg:px-7">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-lg font-extrabold text-blue-950 sm:text-xl">
            Centre Dashboard
          </h1>

          <p className="mt-1 text-[10px] text-slate-500 sm:text-xs">
            Overview of today's operations
          </p>
        </div>

        <button className="flex w-fit items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-[10px] font-semibold text-slate-700 shadow-sm">
          <CalendarDays className="h-3.5 w-3.5 text-slate-500" />
          05 Sep 2026
          <ChevronDown className="h-3 w-3 text-slate-400" />
        </button>
      </div>

      {/* Summary Cards */}
      <section className="mt-4 grid grid-cols-2 gap-3 xl:grid-cols-4">
        {/* Tokens */}
        <div className="rounded-lg border border-green-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-[9px] font-semibold text-slate-500">
              Total Tokens Today
            </p>

            <CheckCircle2 className="h-4 w-4 text-green-700" />
          </div>

          <p className="mt-2 text-2xl font-extrabold text-green-700">
            120
          </p>

          <button className="mt-1 text-[9px] font-bold text-green-700 hover:underline">
            View Details
          </button>
        </div>

        {/* Queue */}
        <div className="rounded-lg border border-blue-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-[9px] font-semibold text-slate-500">
              Currently in Queue
            </p>

            <Users className="h-4 w-4 text-blue-700" />
          </div>

          <p className="mt-2 text-2xl font-extrabold text-blue-700">
            12
          </p>

          <button className="mt-1 text-[9px] font-bold text-blue-700 hover:underline">
            View Queue
          </button>
        </div>

        {/* Procurement */}
        <div className="rounded-lg border border-orange-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-[9px] font-semibold text-slate-500">
              Procurement Done
            </p>

            <PackageCheck className="h-4 w-4 text-orange-600" />
          </div>

          <p className="mt-2 text-2xl font-extrabold text-orange-600">
            85
          </p>

          <button className="mt-1 text-[9px] font-bold text-orange-600 hover:underline">
            View Details
          </button>
        </div>

        {/* Payments */}
        <div className="rounded-lg border border-purple-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-[9px] font-semibold text-slate-500">
              Pending Payments
            </p>

            <Clock3 className="h-4 w-4 text-purple-700" />
          </div>

          <p className="mt-2 text-2xl font-extrabold text-purple-700">
            18
          </p>

          <button className="mt-1 text-[9px] font-bold text-purple-700 hover:underline">
            View Details
          </button>
        </div>
      </section>

      {/* Main Content */}
      <section className="mt-4 grid gap-3 lg:grid-cols-[1.55fr_0.85fr]">
        {/* Live Queue */}
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
                <QueueRow
                  token="#118"
                  farmer="Ramesh Mahto"
                  crop="Wheat"
                  status="In Progress"
                  wait="15 min"
                  active
                />

                <QueueRow
                  token="#119"
                  farmer="Mohan Oraon"
                  crop="Wheat"
                  status="In Progress"
                  wait="20 min"
                />

                <QueueRow
                  token="#120"
                  farmer="Sita Devi"
                  crop="Wheat"
                  status="Waiting"
                  wait="35 min"
                />

                <QueueRow
                  token="#121"
                  farmer="Birsa Tudu"
                  crop="Wheat"
                  status="Waiting"
                  wait="45 min"
                />

                <QueueRow
                  token="#122"
                  farmer="Pawan Kumar"
                  crop="Maize"
                  status="Waiting"
                  wait="50 min"
                />
              </tbody>
            </table>
          </div>

          <div className="mt-3 text-center">
            <button className="text-[9px] font-bold text-green-700 hover:underline">
              View Full Queue
            </button>
          </div>
        </div>

        {/* Today's Summary */}
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-blue-700" />

            <h2 className="text-[11px] font-extrabold text-blue-950">
              Today's Summary
            </h2>
          </div>

          <div className="mt-4 space-y-3">
            <SummaryRow
              label="Total Farmers Served"
              value="85"
            />

            <SummaryRow
              label="Total Quantity (Quintal)"
              value="425.5"
            />

            <SummaryRow
              label="Average Wait Time"
              value="32 min"
            />

            <SummaryRow
              label="Token Issued"
              value="120"
            />
          </div>

          <button className="mt-5 flex w-full items-center justify-center gap-2 rounded-md border border-green-600 py-2 text-[9px] font-bold text-green-700 transition hover:bg-green-50">
            <Eye className="h-3.5 w-3.5" />
            View Report
          </button>
        </div>
      </section>

      {/* Announcement */}
      <section className="mt-3 flex items-start gap-3 rounded-lg border border-blue-100 bg-blue-50 px-4 py-3">
        <BellRing className="mt-0.5 h-4 w-4 shrink-0 text-blue-700" />

        <div className="min-w-0">
          <p className="text-[9px] font-bold text-blue-900">
            Announcement
          </p>

          <p className="mt-0.5 text-[8px] leading-4 text-blue-800">
            Token #118 is in quality check. Please prepare for the next
            token.
          </p>
        </div>

        <button className="ml-auto text-xs text-blue-700">
          ×
        </button>
      </section>
    </div>
  );
}

// Queue Row
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
        active ? "bg-green-50/50" : ""
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

// Summary Row
function SummaryRow({ label, value }) {
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