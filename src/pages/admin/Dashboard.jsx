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
  Users,
} from "lucide-react";

const stats = [
  {
    title: "Total Farmers",
    value: "2,458",
    change: "+12.5%",
    icon: Users,
    note: "vs last month",
  },
  {
    title: "Procurement Centres",
    value: "24",
    change: "+2",
    icon: Building2,
    note: "this month",
  },
  {
    title: "Today's Bookings",
    value: "186",
    change: "+8.4%",
    icon: CalendarDays,
    note: "vs yesterday",
  },
  {
    title: "Pending Payments",
    value: "₹8.42L",
    change: "18",
    icon: IndianRupee,
    note: "payments pending",
  },
];

const bookings = [
  {
    id: "SP241124",
    farmer: "Rajesh Kumar",
    centre: "ABC Procurement Centre",
    crop: "Wheat",
    quantity: "48.5 Qtl",
    status: "Confirmed",
  },
  {
    id: "SP241125",
    farmer: "Ramesh Mahto",
    centre: "Krishi Seva Kendra",
    crop: "Wheat",
    quantity: "32 Qtl",
    status: "Processing",
  },
  {
    id: "SP241126",
    farmer: "Sita Devi",
    centre: "Green Field Centre",
    crop: "Maize",
    quantity: "25 Qtl",
    status: "Confirmed",
  },
  {
    id: "SP241127",
    farmer: "Mohan Oraon",
    centre: "Shakti Kendra",
    crop: "Rice",
    quantity: "35 Qtl",
    status: "Completed",
  },
];

const activities = [
  {
    title: "New farmer registered",
    description: "A new farmer account was created.",
    time: "10 min ago",
    icon: Users,
  },
  {
    title: "Booking completed",
    description: "Procurement booking SP241120 completed.",
    time: "32 min ago",
    icon: CheckCircle2,
  },
  {
    title: "Payment pending",
    description: "5 payments are waiting for processing.",
    time: "1 hour ago",
    icon: Clock3,
  },
];

function Dashboard() {
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
            Here's what's happening across the procurement system today.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm">
          <CalendarDays className="h-4 w-4 text-green-700" />
          06 September 2026
        </div>
      </div>

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
                Current system activity across all centres.
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
                <span className="text-xs font-bold">Active Queues</span>
              </div>

              <p className="mt-2 text-2xl font-extrabold text-blue-950">
                18
              </p>

              <p className="mt-1 text-[11px] text-slate-500">
                centres currently active
              </p>
            </div>

            <div className="rounded-lg bg-blue-50 p-4">
              <div className="flex items-center gap-2 text-blue-700">
                <Users className="h-4 w-4" />
                <span className="text-xs font-bold">Farmers in Queue</span>
              </div>

              <p className="mt-2 text-2xl font-extrabold text-blue-950">
                142
              </p>

              <p className="mt-1 text-[11px] text-slate-500">
                waiting across centres
              </p>
            </div>

            <div className="rounded-lg bg-orange-50 p-4">
              <div className="flex items-center gap-2 text-orange-700">
                <Clock3 className="h-4 w-4" />
                <span className="text-xs font-bold">Avg. Wait Time</span>
              </div>

              <p className="mt-2 text-2xl font-extrabold text-blue-950">
                34 min
              </p>

              <p className="mt-1 text-[11px] text-slate-500">
                across all centres
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
                  Progress towards today's target
                </p>
              </div>

              <span className="text-sm font-extrabold text-green-700">
                71%
              </span>
            </div>

            <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
              <div className="h-full w-[71%] rounded-full bg-green-600" />
            </div>

            <div className="mt-2 flex justify-between text-[11px] text-slate-500">
              <span>426 Qtl completed</span>
              <span>600 Qtl target</span>
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
              Items that need your attention.
            </p>
          </div>

          <div className="space-y-3 p-5">
            <div className="flex gap-3 rounded-lg border border-orange-100 bg-orange-50 p-3">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-orange-600" />

              <div>
                <p className="text-xs font-bold text-orange-800">
                  Pending Payments
                </p>

                <p className="mt-1 text-[11px] leading-5 text-orange-700">
                  18 farmer payments are waiting for processing.
                </p>
              </div>
            </div>

            <div className="flex gap-3 rounded-lg border border-blue-100 bg-blue-50 p-3">
              <Building2 className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />

              <div>
                <p className="text-xs font-bold text-blue-800">
                  Centre Capacity
                </p>

                <p className="mt-1 text-[11px] leading-5 text-blue-700">
                  3 centres are close to their daily capacity.
                </p>
              </div>
            </div>

            <div className="flex gap-3 rounded-lg border border-green-100 bg-green-50 p-3">
              <Leaf className="mt-0.5 h-5 w-5 shrink-0 text-green-700" />

              <div>
                <p className="text-xs font-bold text-green-800">
                  Procurement Update
                </p>

                <p className="mt-1 text-[11px] leading-5 text-green-700">
                  Today's procurement is progressing normally.
                </p>
              </div>
            </div>
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
                Latest farmer bookings across the system.
              </p>
            </div>

            <button className="flex items-center gap-1 text-xs font-bold text-blue-700 hover:text-blue-900">
              View All
              <ArrowUpRight className="h-3.5 w-3.5" />
            </button>
          </div>

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
                {bookings.map((booking) => (
                  <tr key={booking.id} className="text-xs">
                    <td className="px-5 py-4 font-bold text-blue-950">
                      {booking.id}
                    </td>

                    <td className="px-5 py-4 font-semibold text-slate-700">
                      {booking.farmer}
                    </td>

                    <td className="px-5 py-4 text-slate-500">
                      {booking.centre}
                    </td>

                    <td className="px-5 py-4 text-slate-600">
                      {booking.crop} · {booking.quantity}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
                          booking.status === "Completed"
                            ? "bg-green-50 text-green-700"
                            : booking.status === "Processing"
                              ? "bg-orange-50 text-orange-700"
                              : "bg-blue-50 text-blue-700"
                        }`}
                      >
                        {booking.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="divide-y divide-slate-100 md:hidden">
            {bookings.map((booking) => (
              <div key={booking.id} className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-extrabold text-blue-950">
                      {booking.id}
                    </p>

                    <p className="mt-1 text-sm font-bold text-slate-700">
                      {booking.farmer}
                    </p>

                    <p className="mt-1 text-[11px] text-slate-500">
                      {booking.centre}
                    </p>
                  </div>

                  <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-bold text-blue-700">
                    {booking.status}
                  </span>
                </div>

                <div className="mt-3 text-[11px] text-slate-500">
                  {booking.crop} · {booking.quantity}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Activity */}
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-5 py-4">
            <h2 className="text-base font-extrabold text-blue-950">
              Recent Activity
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Latest system updates.
            </p>
          </div>

          <div className="divide-y divide-slate-100">
            {activities.map((activity) => {
              const Icon = activity.icon;

              return (
                <div key={activity.title} className="flex gap-3 p-4">
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
                      {activity.time}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div>
          <h2 className="text-base font-extrabold text-blue-950">
            Quick Actions
          </h2>

          <p className="mt-1 text-xs text-slate-500">
            Quickly access important admin operations.
          </p>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <button className="flex items-center justify-between rounded-lg border border-slate-200 px-4 py-3 text-left transition hover:border-green-300 hover:bg-green-50">
            <div>
              <p className="text-xs font-bold text-blue-950">
                Manage Farmers
              </p>

              <p className="mt-1 text-[10px] text-slate-500">
                View farmer accounts
              </p>
            </div>

            <ArrowUpRight className="h-4 w-4 text-green-700" />
          </button>

          <button className="flex items-center justify-between rounded-lg border border-slate-200 px-4 py-3 text-left transition hover:border-green-300 hover:bg-green-50">
            <div>
              <p className="text-xs font-bold text-blue-950">
                Manage Centres
              </p>

              <p className="mt-1 text-[10px] text-slate-500">
                Centre operations
              </p>
            </div>

            <ArrowUpRight className="h-4 w-4 text-green-700" />
          </button>

          <button className="flex items-center justify-between rounded-lg border border-slate-200 px-4 py-3 text-left transition hover:border-green-300 hover:bg-green-50">
            <div>
              <p className="text-xs font-bold text-blue-950">
                View Payments
              </p>

              <p className="mt-1 text-[10px] text-slate-500">
                Payment monitoring
              </p>
            </div>

            <ArrowUpRight className="h-4 w-4 text-green-700" />
          </button>

          <button className="flex items-center justify-between rounded-lg border border-slate-200 px-4 py-3 text-left transition hover:border-green-300 hover:bg-green-50">
            <div>
              <p className="text-xs font-bold text-blue-950">
                View Reports
              </p>

              <p className="mt-1 text-[10px] text-slate-500">
                Analytics & reports
              </p>
            </div>

            <ArrowUpRight className="h-4 w-4 text-green-700" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;