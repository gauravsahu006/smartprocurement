import { useMemo, useState } from "react";
import {
  CalendarDays,
  ChevronDown,
  Clock3,
  Eye,
  MapPin,
  Search,
  UserRound,
} from "lucide-react";

const bookingsData = [
  {
    id: "SP241124",
    token: "#124",
    farmer: "Rajesh Kumar",
    mobile: "9876543210",
    crop: "Wheat",
    quantity: "48.5 Quintal",
    date: "06 Sep 2026",
    time: "03:00 PM - 04:00 PM",
    status: "Upcoming",
  },
  {
    id: "SP241125",
    token: "#125",
    farmer: "Ramesh Mahto",
    mobile: "9123456780",
    crop: "Wheat",
    quantity: "32 Quintal",
    date: "06 Sep 2026",
    time: "04:00 PM - 05:00 PM",
    status: "Upcoming",
  },
  {
    id: "SP241126",
    token: "#126",
    farmer: "Sita Devi",
    mobile: "9988776655",
    crop: "Maize",
    quantity: "25 Quintal",
    date: "06 Sep 2026",
    time: "05:00 PM - 06:00 PM",
    status: "Upcoming",
  },
  {
    id: "SP241120",
    token: "#120",
    farmer: "Mohan Oraon",
    mobile: "9090909090",
    crop: "Wheat",
    quantity: "40 Quintal",
    date: "05 Sep 2026",
    time: "11:00 AM - 12:00 PM",
    status: "Completed",
  },
  {
    id: "SP241118",
    token: "#118",
    farmer: "Birsa Tudu",
    mobile: "9012345678",
    crop: "Maize",
    quantity: "28 Quintal",
    date: "05 Sep 2026",
    time: "10:00 AM - 11:00 AM",
    status: "Completed",
  },
  {
    id: "SP241115",
    token: "#115",
    farmer: "Pawan Kumar",
    mobile: "9345678901",
    crop: "Rice",
    quantity: "35 Quintal",
    date: "04 Sep 2026",
    time: "02:00 PM - 03:00 PM",
    status: "Cancelled",
  },
];

function Bookings() {
  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");
  const [selectedBooking, setSelectedBooking] = useState(null);

  const tabs = ["All", "Upcoming", "Completed", "Cancelled"];

  const filteredBookings = useMemo(() => {
    return bookingsData.filter((booking) => {
      const matchesTab =
        activeTab === "All" || booking.status === activeTab;

      const searchValue = search.toLowerCase();

      const matchesSearch =
        booking.farmer.toLowerCase().includes(searchValue) ||
        booking.token.toLowerCase().includes(searchValue) ||
        booking.id.toLowerCase().includes(searchValue) ||
        booking.crop.toLowerCase().includes(searchValue);

      return matchesTab && matchesSearch;
    });
  }, [activeTab, search]);

  return (
    <div className="mx-auto max-w-[1280px] px-4 py-5 sm:px-6 lg:px-7">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-lg font-extrabold text-blue-950 sm:text-xl">
            Bookings
          </h1>

          <p className="mt-1 text-[10px] text-slate-500 sm:text-xs">
            View and manage farmer bookings at your centre
          </p>
        </div>

        <button className="flex w-fit items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-[10px] font-semibold text-slate-700 shadow-sm">
          <CalendarDays className="h-3.5 w-3.5 text-slate-500" />
          06 Sep 2026
          <ChevronDown className="h-3 w-3 text-slate-400" />
        </button>
      </div>

      {/* Search */}
      <div className="mt-5 rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by farmer name, token, booking ID or crop..."
            className="h-10 w-full rounded-md border border-slate-200 bg-slate-50 pl-9 pr-3 text-xs text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-green-600 focus:bg-white"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-4 flex gap-1 overflow-x-auto rounded-lg border border-slate-200 bg-white p-1 shadow-sm">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`whitespace-nowrap rounded-md px-4 py-2 text-[10px] font-bold transition ${
              activeTab === tab
                ? "bg-green-700 text-white"
                : "text-slate-500 hover:bg-slate-50"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Booking List */}
      <section className="mt-4 space-y-3">
        {filteredBookings.map((booking) => (
          <BookingCard
            key={booking.id}
            booking={booking}
            onView={() => setSelectedBooking(booking)}
          />
        ))}

        {filteredBookings.length === 0 && (
          <div className="rounded-lg border border-slate-200 bg-white py-12 text-center shadow-sm">
            <CalendarDays className="mx-auto h-8 w-8 text-slate-300" />

            <h3 className="mt-3 text-sm font-bold text-blue-950">
              No bookings found
            </h3>

            <p className="mt-1 text-[10px] text-slate-500">
              Try changing the search or booking status.
            </p>
          </div>
        )}
      </section>

      {/* Booking Count */}
      <p className="mt-4 text-center text-[9px] text-slate-400">
        Showing {filteredBookings.length} of {bookingsData.length} bookings
      </p>

      {/* Details Modal */}
      {selectedBooking && (
        <BookingDetails
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
        />
      )}
    </div>
  );
}

function BookingCard({ booking, onView }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        {/* Farmer */}
        <div className="flex min-w-0 items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-50 text-green-700">
            <UserRound className="h-5 w-5" />
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xs font-extrabold text-blue-950">
                {booking.farmer}
              </h2>

              <StatusBadge status={booking.status} />
            </div>

            <p className="mt-1 text-[9px] text-slate-500">
              Booking ID: {booking.id}
            </p>

            <p className="mt-1 text-[9px] text-slate-500">
              Mobile: {booking.mobile}
            </p>
          </div>
        </div>

        {/* Booking Info */}
        <div className="grid grid-cols-2 gap-x-8 gap-y-3 sm:grid-cols-4 lg:flex lg:items-center">
          <InfoItem
            label="Token"
            value={booking.token}
            highlight
          />

          <InfoItem
            label="Crop"
            value={booking.crop}
          />

          <InfoItem
            label="Quantity"
            value={booking.quantity}
          />

          <div>
            <p className="text-[8px] font-semibold text-slate-400">
              Date & Time
            </p>

            <div className="mt-1 flex items-center gap-1 text-[9px] font-bold text-slate-700">
              <Clock3 className="h-3 w-3 text-slate-400" />
              {booking.date}
            </div>

            <p className="mt-0.5 text-[8px] text-slate-500">
              {booking.time}
            </p>
          </div>
        </div>

        {/* Action */}
        <button
          onClick={onView}
          className="flex w-full items-center justify-center gap-1.5 rounded-md border border-green-600 px-4 py-2 text-[9px] font-bold text-green-700 transition hover:bg-green-50 lg:w-auto"
        >
          <Eye className="h-3.5 w-3.5" />
          View Details
        </button>
      </div>
    </div>
  );
}

function InfoItem({ label, value, highlight }) {
  return (
    <div>
      <p className="text-[8px] font-semibold text-slate-400">
        {label}
      </p>

      <p
        className={`mt-1 text-[9px] font-extrabold ${
          highlight ? "text-green-700" : "text-slate-700"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    Upcoming: "bg-blue-50 text-blue-700",
    Completed: "bg-green-50 text-green-700",
    Cancelled: "bg-red-50 text-red-600",
  };

  return (
    <span
      className={`rounded-full px-2 py-1 text-[7px] font-bold ${
        styles[status]
      }`}
    >
      {status}
    </span>
  );
}

function BookingDetails({ booking, onClose }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/40 px-4 py-6">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white shadow-xl">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <div>
            <h2 className="text-sm font-extrabold text-blue-950">
              Booking Details
            </h2>

            <p className="mt-0.5 text-[9px] text-slate-500">
              {booking.id}
            </p>
          </div>

          <button
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-md text-lg text-slate-400 hover:bg-slate-100"
          >
            ×
          </button>
        </div>

        {/* Details */}
        <div className="space-y-4 p-5">
          <div className="rounded-lg bg-green-50 p-4">
            <p className="text-[9px] font-semibold text-green-700">
              Token Number
            </p>

            <p className="mt-1 text-2xl font-extrabold text-green-700">
              {booking.token}
            </p>
          </div>

          <DetailRow
            label="Farmer Name"
            value={booking.farmer}
          />

          <DetailRow
            label="Mobile Number"
            value={booking.mobile}
          />

          <DetailRow
            label="Crop"
            value={booking.crop}
          />

          <DetailRow
            label="Quantity"
            value={booking.quantity}
          />

          <DetailRow
            label="Booking Date"
            value={booking.date}
          />

          <DetailRow
            label="Time Slot"
            value={booking.time}
          />

          <DetailRow
            label="Status"
            value={booking.status}
          />

          <div className="flex items-start gap-2 rounded-lg bg-blue-50 p-3">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-blue-700" />

            <div>
              <p className="text-[9px] font-bold text-blue-900">
                Procurement Centre
              </p>

              <p className="mt-0.5 text-[8px] leading-4 text-blue-800">
                ABC Procurement Centre, Main Market Road,
                Ranchi, Jharkhand
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-100 px-5 py-4">
          <button
            onClick={onClose}
            className="w-full rounded-md bg-green-700 py-2.5 text-xs font-bold text-white hover:bg-green-800"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

function DetailRow({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-2.5">
      <span className="text-[9px] text-slate-500">
        {label}
      </span>

      <span className="text-right text-[9px] font-bold text-slate-700">
        {value}
      </span>
    </div>
  );
}

export default Bookings;