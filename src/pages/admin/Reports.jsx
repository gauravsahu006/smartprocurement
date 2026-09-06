import { useMemo, useState } from "react";
import {
  BarChart3,
  CalendarDays,
  CheckCircle2,
  Download,
  FileText,
  IndianRupee,
  PackageCheck,
  TrendingUp,
  Users,
  Wheat,
} from "lucide-react";

const monthlyData = [
  { month: "Apr", procurement: 312, farmers: 820, payments: 6.4 },
  { month: "May", procurement: 386, farmers: 1040, payments: 7.8 },
  { month: "Jun", procurement: 428, farmers: 1180, payments: 8.6 },
  { month: "Jul", procurement: 472, farmers: 1325, payments: 9.2 },
  { month: "Aug", procurement: 518, farmers: 1480, payments: 10.4 },
  { month: "Sep", procurement: 426, farmers: 1250, payments: 8.4 },
];

const cropData = [
  { crop: "Wheat", quantity: 245, percentage: 42 },
  { crop: "Rice", quantity: 178, percentage: 31 },
  { crop: "Maize", quantity: 112, percentage: 19 },
  { crop: "Other", quantity: 47, percentage: 8 },
];

const centreData = [
  {
    name: "ABC Procurement Centre",
    location: "Ranchi",
    farmers: 428,
    quantity: 126.5,
    completion: 92,
  },
  {
    name: "Krishi Seva Kendra",
    location: "Ranchi",
    farmers: 356,
    quantity: 104.8,
    completion: 88,
  },
  {
    name: "Green Field Centre",
    location: "Khunti",
    farmers: 294,
    quantity: 86.4,
    completion: 84,
  },
  {
    name: "Shakti Kendra",
    location: "Lohardaga",
    farmers: 246,
    quantity: 72.2,
    completion: 81,
  },
];

function AdminReports() {
  const [period, setPeriod] = useState("6 Months");

  const currentData = useMemo(() => {
    if (period === "3 Months") {
      return monthlyData.slice(-3);
    }

    if (period === "12 Months") {
      return [
        ...monthlyData,
        { month: "Oct", procurement: 492, farmers: 1360, payments: 9.1 },
        { month: "Nov", procurement: 536, farmers: 1510, payments: 10.8 },
        { month: "Dec", procurement: 584, farmers: 1640, payments: 11.7 },
      ];
    }

    return monthlyData;
  }, [period]);

  const maxProcurement = Math.max(
    ...currentData.map((item) => item.procurement)
  );

  const maxFarmers = Math.max(
    ...currentData.map((item) => item.farmers)
  );

  const downloadReport = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-semibold text-green-700">
            Reports & Analytics
          </p>

          <h1 className="mt-1 text-2xl font-extrabold text-blue-950 sm:text-3xl">
            System Analytics
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Track procurement performance, farmers, payments and centre activity.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <select
            value={period}
            onChange={(event) => setPeriod(event.target.value)}
            className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-xs font-semibold text-slate-700 outline-none focus:border-green-600"
          >
            <option>3 Months</option>
            <option>6 Months</option>
            <option>12 Months</option>
          </select>

          <button
            onClick={downloadReport}
            className="inline-flex h-10 items-center gap-2 rounded-lg bg-green-700 px-4 text-xs font-bold text-white hover:bg-green-800"
          >
            <Download className="h-4 w-4" />
            Export Report
          </button>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500">
              Total Farmers
            </p>

            <div className="rounded-lg bg-blue-50 p-2 text-blue-700">
              <Users className="h-5 w-5" />
            </div>
          </div>

          <p className="mt-3 text-2xl font-extrabold text-blue-950">
            2,458
          </p>

          <div className="mt-2 flex items-center gap-1 text-xs font-semibold text-green-700">
            <TrendingUp className="h-3.5 w-3.5" />
            12.8% growth
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500">
              Procurement
            </p>

            <div className="rounded-lg bg-green-50 p-2 text-green-700">
              <PackageCheck className="h-5 w-5" />
            </div>
          </div>

          <p className="mt-3 text-2xl font-extrabold text-blue-950">
            2,542 Qtl
          </p>

          <div className="mt-2 flex items-center gap-1 text-xs font-semibold text-green-700">
            <TrendingUp className="h-3.5 w-3.5" />
            9.4% increase
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500">
              Total Payments
            </p>

            <div className="rounded-lg bg-amber-50 p-2 text-amber-700">
              <IndianRupee className="h-5 w-5" />
            </div>
          </div>

          <p className="mt-3 text-2xl font-extrabold text-blue-950">
            ₹52.4L
          </p>

          <div className="mt-2 flex items-center gap-1 text-xs font-semibold text-green-700">
            <TrendingUp className="h-3.5 w-3.5" />
            11.2% growth
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500">
              Completion Rate
            </p>

            <div className="rounded-lg bg-purple-50 p-2 text-purple-700">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </div>

          <p className="mt-3 text-2xl font-extrabold text-blue-950">
            89.6%
          </p>

          <div className="mt-2 flex items-center gap-1 text-xs font-semibold text-green-700">
            <TrendingUp className="h-3.5 w-3.5" />
            4.6% improvement
          </div>
        </div>
      </div>

      {/* Procurement Trend */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-base font-extrabold text-blue-950">
              Procurement Trend
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Monthly procurement quantity in Quintals
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <BarChart3 className="h-4 w-4 text-green-700" />
            {period}
          </div>
        </div>

        <div className="mt-7 flex h-64 items-end gap-3 overflow-x-auto border-b border-slate-200 pb-0 sm:gap-5">
          {currentData.map((item) => {
            const height = Math.max(
              15,
              (item.procurement / maxProcurement) * 100
            );

            return (
              <div
                key={item.month}
                className="flex h-full min-w-[42px] flex-1 flex-col items-center justify-end"
              >
                <p className="mb-2 text-[10px] font-bold text-slate-600">
                  {item.procurement}
                </p>

                <div
                  className="w-full max-w-10 rounded-t-lg bg-green-600 transition-all hover:bg-green-700"
                  style={{ height: `${height}%` }}
                  title={`${item.procurement} Quintal`}
                />

                <p className="mt-2 text-[10px] font-semibold text-slate-500">
                  {item.month}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Two Column Analytics */}
      <div className="grid gap-6 xl:grid-cols-2">
        {/* Farmer Growth */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div>
            <h2 className="text-base font-extrabold text-blue-950">
              Farmer Registration
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Monthly active farmer registrations
            </p>
          </div>

          <div className="mt-7 space-y-4">
            {currentData.map((item) => {
              const width = (item.farmers / maxFarmers) * 100;

              return (
                <div key={item.month}>
                  <div className="mb-1.5 flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-600">
                      {item.month}
                    </span>

                    <span className="text-xs font-bold text-blue-950">
                      {item.farmers}
                    </span>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-blue-600"
                      style={{ width: `${width}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Crop Distribution */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div>
            <h2 className="text-base font-extrabold text-blue-950">
              Crop-wise Procurement
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Distribution of procured crops
            </p>
          </div>

          <div className="mt-6 space-y-5">
            {cropData.map((item) => (
              <div key={item.crop}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="rounded-lg bg-green-50 p-2 text-green-700">
                      <Wheat className="h-4 w-4" />
                    </div>

                    <div>
                      <p className="text-xs font-bold text-slate-800">
                        {item.crop}
                      </p>

                      <p className="text-[10px] text-slate-400">
                        {item.quantity} Quintal
                      </p>
                    </div>
                  </div>

                  <p className="text-xs font-extrabold text-blue-950">
                    {item.percentage}%
                  </p>
                </div>

                <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-green-600"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Centre Performance */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col justify-between gap-3 border-b border-slate-200 p-5 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-base font-extrabold text-blue-950">
              Centre Performance
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Procurement performance by centre
            </p>
          </div>

          <button
            onClick={downloadReport}
            className="inline-flex items-center gap-2 text-xs font-bold text-blue-700 hover:text-blue-900"
          >
            <FileText className="h-4 w-4" />
            Generate Report
          </button>
        </div>

        <div className="hidden overflow-x-auto lg:block">
          <table className="w-full min-w-[750px]">
            <thead>
              <tr className="bg-slate-50">
                <th className="px-5 py-3 text-left text-[11px] font-bold text-slate-500">
                  Centre
                </th>

                <th className="px-5 py-3 text-left text-[11px] font-bold text-slate-500">
                  Farmers Served
                </th>

                <th className="px-5 py-3 text-left text-[11px] font-bold text-slate-500">
                  Procurement
                </th>

                <th className="px-5 py-3 text-left text-[11px] font-bold text-slate-500">
                  Completion
                </th>
              </tr>
            </thead>

            <tbody>
              {centreData.map((centre) => (
                <tr
                  key={centre.name}
                  className="border-t border-slate-100"
                >
                  <td className="px-5 py-4">
                    <p className="text-sm font-bold text-slate-800">
                      {centre.name}
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      {centre.location}, Jharkhand
                    </p>
                  </td>

                  <td className="px-5 py-4 text-sm font-bold text-blue-950">
                    {centre.farmers}
                  </td>

                  <td className="px-5 py-4 text-sm font-bold text-blue-950">
                    {centre.quantity} Qtl
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-28 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full bg-green-600"
                          style={{
                            width: `${centre.completion}%`,
                          }}
                        />
                      </div>

                      <span className="text-xs font-bold text-green-700">
                        {centre.completion}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile */}
        <div className="space-y-3 p-4 lg:hidden">
          {centreData.map((centre) => (
            <div
              key={centre.name}
              className="rounded-xl border border-slate-200 p-4"
            >
              <p className="text-sm font-bold text-blue-950">
                {centre.name}
              </p>

              <p className="mt-1 text-xs text-slate-400">
                {centre.location}, Jharkhand
              </p>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-slate-50 p-3">
                  <p className="text-[10px] text-slate-400">
                    Farmers Served
                  </p>

                  <p className="mt-1 text-sm font-extrabold text-blue-950">
                    {centre.farmers}
                  </p>
                </div>

                <div className="rounded-lg bg-slate-50 p-3">
                  <p className="text-[10px] text-slate-400">
                    Procurement
                  </p>

                  <p className="mt-1 text-sm font-extrabold text-blue-950">
                    {centre.quantity} Qtl
                  </p>
                </div>
              </div>

              <div className="mt-3">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-semibold text-slate-400">
                    Completion Rate
                  </p>

                  <p className="text-xs font-bold text-green-700">
                    {centre.completion}%
                  </p>
                </div>

                <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-green-600"
                    style={{
                      width: `${centre.completion}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Report Info */}
      <div className="rounded-xl border border-green-100 bg-green-50 p-4">
        <div className="flex gap-3">
          <CalendarDays className="mt-0.5 h-5 w-5 shrink-0 text-green-700" />

          <div>
            <p className="text-sm font-bold text-green-900">
              Analytics Report
            </p>

            <p className="mt-1 text-xs leading-5 text-green-800">
              Use the period selector to review procurement trends,
              farmer registrations, crop distribution and centre
              performance. Export Report uses the browser print option
              to save the current report as PDF.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminReports;