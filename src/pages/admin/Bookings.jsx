import { useMemo, useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  Eye,
  MapPin,
  Search,
  UserRound,
  XCircle,
} from "lucide-react";

const initialBookings = [
  {
    id: "SP241124",
    farmer: "Rajesh Kumar",
    farmerId: "FR10241",
    centre: "ABC Procurement Centre",
    location: "Ranchi, Jharkhand",
    crop: "Wheat",
    quantity: "48.5 Quintal",
    date: "06 Sep 2026",
    time: "03:00 PM - 04:00 PM",
    token: "#124",
    status: "Upcoming",
  },
  {
    id: "SP241125",
    farmer: "Ramesh Mahto",
    farmerId: "FR10242",
    centre: "Krishi Seva Kendra",
    location: "Ranchi, Jharkhand",
    crop: "Wheat",
    quantity: "32 Quintal",
    date: "06 Sep 2026",
    time: "04:00 PM - 05:00 PM",
    token: "#125",
    status: "Upcoming",
  },
  {
    id: "SP241126",
    farmer: "Sita Devi",
    farmerId: "FR10243",
    centre: "Green Field Centre",
    location: "Khunti, Jharkhand",
    crop: "Maize",
    quantity: "25 Quintal",
    date: "06 Sep 2026",
    time: "05:00 PM - 06:00 PM",
    token: "#126",
    status: "Upcoming",
  },
  {
    id: "SP241120",
    farmer: "Mohan Oraon",
    farmerId: "FR10237",
    centre: "ABC Procurement Centre",
    location: "Ranchi, Jharkhand",
    crop: "Wheat",
    quantity: "40 Quintal",
    date: "05 Sep 2026",
    time: "11:00 AM - 12:00 PM",
    token: "#120",
    status: "Completed",
  },
  {
    id: "SP241118",
    farmer: "Birsa Tudu",
    farmerId: "FR10235",
    centre: "Shakti Kendra",
    location: "Lohardaga, Jharkhand",
    crop: "Maize",
    quantity: "28 Quintal",
    date: "05 Sep 2026",
    time: "10:00 AM - 11:00 AM",
    token: "#118",
    status: "Completed",
  },
  {
    id: "SP241115",
    farmer: "Pawan Kumar",
    farmerId: "FR10231",
    centre: "Krishi Seva Kendra",
    location: "Ranchi, Jharkhand",
    crop: "Rice",
    quantity: "35 Quintal",
    date: "04 Sep 2026",
    time: "02:00 PM - 03:00 PM",
    token: "#115",
    status: "Cancelled",
  },
];

function AdminBookings() {
  const [bookings, setBookings] = useState(initialBookings);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("All");
  const [selectedBooking, setSelectedBooking] = useState(null);

  const tabs = ["All", "Upcoming", "Completed", "Cancelled"];

  const filteredBookings = useMemo(() => {
    return bookings.filter((booking) => {
      const matchesTab =
        activeTab === "All" || booking.status === activeTab;

      const query = search.toLowerCase();

      const matchesSearch =
        booking.id.toLowerCase().includes(query) ||
        booking.farmer.toLowerCase().includes(query) ||
        booking.farmerId.toLowerCase().includes(query) ||
        booking.centre.toLowerCase().includes(query) ||
        booking.crop.toLowerCase().includes(query);

      return matchesTab && matchesSearch;
    });
  }, [bookings, activeTab, search]);

  const stats = {
    total: bookings.length,
    upcoming: bookings.filter(
      (booking) => booking.status === "Upcoming"
    ).length,
    completed: bookings.filter(
      (booking) => booking.status === "Completed"
    ).length,
    cancelled: bookings.filter(
      (booking) => booking.status === "Cancelled"
    ).length,
  };

  const cancelBooking = (id) => {
    setBookings((current) =>
      current.map((booking) =>
        booking.id === id
          ? { ...booking, status: "Cancelled" }
          : booking
      )
    );

    setSelectedBooking(null);
  };

  const statusClasses = {
    Upcoming: "bg-blue-50 text-blue-700",
    Completed: "bg-green-50 text-green-700",
    Cancelled: "bg-red-50 text-red-700",
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold text-green-700">
              Booking Management
            </p>

            <h1 className="mt-1 text-2xl font-extrabold text-blue-950 sm:text-3xl">
              All Bookings
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Monitor and manage farmer procurement bookings.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600 shadow-sm">
            <CalendarDays className="h-4 w-4 text-green-700" />
            06 September 2026
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold text-slate-500">
            Total Bookings
          </p>
          <p className="mt-2 text-2xl font-extrabold text-blue-950">
            {stats.total}
          </p>
          <p className="mt-1 text-xs text-slate-400">
            All system bookings
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold text-slate-500">
            Upcoming
          </p>
          <p className="mt-2 text-2xl font-extrabold text-blue-700">
            {stats.upcoming}
          </p>
          <p className="mt-1 text-xs text-slate-400">
            Active bookings
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold text-slate-500">
            Completed
          </p>
          <p className="mt-2 text-2xl font-extrabold text-green-700">
            {stats.completed}
          </p>
          <p className="mt-1 text-xs text-slate-400">
            Successfully completed
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold text-slate-500">
            Cancelled
          </p>
          <p className="mt-2 text-2xl font-extrabold text-red-600">
            {stats.cancelled}
          </p>
          <p className="mt-1 text-xs text-slate-400">
            Cancelled bookings
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`whitespace-nowrap rounded-lg px-4 py-2 text-xs font-bold transition ${
                  activeTab === tab
                    ? "bg-green-700 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="relative w-full lg:max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search booking, farmer or centre..."
              className="h-10 w-full rounded-lg border border-slate-300 pl-9 pr-3 text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
            />
          </div>
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm lg:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px]">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-5 py-4 text-left text-xs font-bold text-slate-500">
                  Booking
                </th>
                <th className="px-5 py-4 text-left text-xs font-bold text-slate-500">
                  Farmer
                </th>
                <th className="px-5 py-4 text-left text-xs font-bold text-slate-500">
                  Centre
                </th>
                <th className="px-5 py-4 text-left text-xs font-bold text-slate-500">
                  Crop / Quantity
                </th>
                <th className="px-5 py-4 text-left text-xs font-bold text-slate-500">
                  Date & Time
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
              {filteredBookings.map((booking) => (
                <tr
                  key={booking.id}
                  className="border-b border-slate-100 last:border-0 hover:bg-slate-50"
                >
                  <td className="px-5 py-4">
                    <p className="text-sm font-bold text-blue-950">
                      {booking.id}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      Token {booking.token}
                    </p>
                  </td>

                  <td className="px-5 py-4">
                    <p className="text-sm font-semibold text-slate-800">
                      {booking.farmer}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {booking.farmerId}
                    </p>
                  </td>

                  <td className="px-5 py-4">
                    <p className="text-sm font-semibold text-slate-800">
                      {booking.centre}
                    </p>
                    <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                      <MapPin className="h-3 w-3" />
                      {booking.location}
                    </p>
                  </td>

                  <td className="px-5 py-4">
                    <p className="text-sm font-semibold text-slate-800">
                      {booking.crop}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {booking.quantity}
                    </p>
                  </td>

                  <td className="px-5 py-4">
                    <p className="text-sm font-semibold text-slate-800">
                      {booking.date}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {booking.time}
                    </p>
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-[11px] font-bold ${statusClasses[booking.status]}`}
                    >
                      {booking.status}
                    </span>
                  </td>

                  <td className="px-5 py-4 text-right">
                    <button
                      onClick={() => setSelectedBooking(booking)}
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

        {filteredBookings.length === 0 && (
          <div className="px-5 py-12 text-center">
            <CalendarDays className="mx-auto h-10 w-10 text-slate-300" />
            <p className="mt-3 text-sm font-bold text-slate-600">
              No bookings found
            </p>
            <p className="mt-1 text-xs text-slate-400">
              Try changing your search or filter.
            </p>
          </div>
        )}
      </div>

      {/* Mobile Cards */}
      <div className="space-y-4 lg:hidden">
        {filteredBookings.map((booking) => (
          <div
            key={booking.id}
            className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-extrabold text-blue-950">
                  {booking.id}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Token {booking.token}
                </p>
              </div>

              <span
                className={`rounded-full px-3 py-1 text-[10px] font-bold ${statusClasses[booking.status]}`}
              >
                {booking.status}
              </span>
            </div>

            <div className="mt-4 space-y-3">
              <div className="flex gap-3">
                <UserRound className="mt-0.5 h-4 w-4 shrink-0 text-green-700" />

                <div>
                  <p className="text-xs font-bold text-slate-800">
                    {booking.farmer}
                  </p>
                  <p className="mt-0.5 text-[11px] text-slate-500">
                    {booking.farmerId}
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-green-700" />

                <div>
                  <p className="text-xs font-bold text-slate-800">
                    {booking.centre}
                  </p>
                  <p className="mt-0.5 text-[11px] text-slate-500">
                    {booking.location}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-slate-50 p-3">
                  <p className="text-[10px] font-semibold text-slate-400">
                    Crop
                  </p>
                  <p className="mt-1 text-xs font-bold text-slate-800">
                    {booking.crop}
                  </p>
                </div>

                <div className="rounded-lg bg-slate-50 p-3">
                  <p className="text-[10px] font-semibold text-slate-400">
                    Quantity
                  </p>
                  <p className="mt-1 text-xs font-bold text-slate-800">
                    {booking.quantity}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-600">
                <Clock3 className="h-4 w-4 text-green-700" />
                {booking.date} • {booking.time}
              </div>
            </div>

            <button
              onClick={() => setSelectedBooking(booking)}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 py-2.5 text-xs font-bold text-blue-700 hover:bg-blue-50"
            >
              <Eye className="h-4 w-4" />
              View Booking Details
            </button>
          </div>
        ))}

        {filteredBookings.length === 0 && (
          <div className="rounded-xl border border-slate-200 bg-white px-5 py-12 text-center">
            <CalendarDays className="mx-auto h-10 w-10 text-slate-300" />
            <p className="mt-3 text-sm font-bold text-slate-600">
              No bookings found
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
              Booking Management
            </p>

            <p className="mt-1 text-xs leading-5 text-green-800">
              Admin can monitor booking status, farmer details,
              procurement centres, scheduled slots and tokens from
              this section.
            </p>
          </div>
        </div>
      </div>

      {/* Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4 py-6">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <div>
                <h2 className="text-lg font-extrabold text-blue-950">
                  Booking Details
                </h2>

                <p className="mt-0.5 text-xs text-slate-500">
                  {selectedBooking.id}
                </p>
              </div>

              <button
                onClick={() => setSelectedBooking(null)}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-5 p-5">
              <div className="flex items-center justify-between rounded-xl bg-green-50 p-4">
                <div>
                  <p className="text-xs font-semibold text-green-700">
                    Booking Status
                  </p>

                  <span
                    className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-bold ${statusClasses[selectedBooking.status]}`}
                  >
                    {selectedBooking.status}
                  </span>
                </div>

                <div className="text-right">
                  <p className="text-xs text-slate-500">Token</p>
                  <p className="text-xl font-extrabold text-blue-950">
                    {selectedBooking.token}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[11px] font-semibold text-slate-400">
                    Farmer
                  </p>
                  <p className="mt-1 text-sm font-bold text-slate-800">
                    {selectedBooking.farmer}
                  </p>
                </div>

                <div>
                  <p className="text-[11px] font-semibold text-slate-400">
                    Farmer ID
                  </p>
                  <p className="mt-1 text-sm font-bold text-slate-800">
                    {selectedBooking.farmerId}
                  </p>
                </div>

                <div>
                  <p className="text-[11px] font-semibold text-slate-400">
                    Centre
                  </p>
                  <p className="mt-1 text-sm font-bold text-slate-800">
                    {selectedBooking.centre}
                  </p>
                </div>

                <div>
                  <p className="text-[11px] font-semibold text-slate-400">
                    Location
                  </p>
                  <p className="mt-1 text-sm font-bold text-slate-800">
                    {selectedBooking.location}
                  </p>
                </div>

                <div>
                  <p className="text-[11px] font-semibold text-slate-400">
                    Crop
                  </p>
                  <p className="mt-1 text-sm font-bold text-slate-800">
                    {selectedBooking.crop}
                  </p>
                </div>

                <div>
                  <p className="text-[11px] font-semibold text-slate-400">
                    Quantity
                  </p>
                  <p className="mt-1 text-sm font-bold text-slate-800">
                    {selectedBooking.quantity}
                  </p>
                </div>

                <div>
                  <p className="text-[11px] font-semibold text-slate-400">
                    Booking Date
                  </p>
                  <p className="mt-1 text-sm font-bold text-slate-800">
                    {selectedBooking.date}
                  </p>
                </div>

                <div>
                  <p className="text-[11px] font-semibold text-slate-400">
                    Booking Time
                  </p>
                  <p className="mt-1 text-sm font-bold text-slate-800">
                    {selectedBooking.time}
                  </p>
                </div>
              </div>

              <div className="flex gap-3 rounded-xl bg-blue-50 p-4">
                <Clock3 className="mt-0.5 h-5 w-5 shrink-0 text-blue-700" />

                <div>
                  <p className="text-xs font-bold text-blue-900">
                    Scheduled Procurement Slot
                  </p>

                  <p className="mt-1 text-xs leading-5 text-blue-800">
                    Farmer is scheduled for token {selectedBooking.token}
                    during the selected time slot.
                  </p>
                </div>
              </div>

              {selectedBooking.status === "Upcoming" && (
                <button
                  onClick={() => cancelBooking(selectedBooking.id)}
                  className="flex w-full items-center justify-center gap-2 rounded-lg border border-red-200 py-2.5 text-xs font-bold text-red-600 hover:bg-red-50"
                >
                  <XCircle className="h-4 w-4" />
                  Cancel Booking
                </button>
              )}

              <button
                onClick={() => setSelectedBooking(null)}
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

export default AdminBookings;