import { useEffect, useMemo, useState } from "react";
import { supabase } from "../../lib/supabase";
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  Eye,
  MapPin,
  RefreshCw,
  Search,
  UserRound,
  XCircle,
} from "lucide-react";

function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("All");
  const [selectedBooking, setSelectedBooking] = useState(null);

  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [error, setError] = useState("");

  const tabs = ["All", "Upcoming", "Completed", "Cancelled"];

  // --------------------------------------------------
  // Format date
  // --------------------------------------------------
  const formatDate = (value) => {
    if (!value) return "—";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return String(value);
    }

    return new Intl.DateTimeFormat("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      timeZone: "Asia/Kolkata",
    }).format(date);
  };

  // --------------------------------------------------
  // Format time
  // --------------------------------------------------
  const formatTime = (value) => {
    if (!value) return null;

    const raw = String(value);

    // PostgreSQL time can be "15:00:00"
    const parts = raw.split(":");

    if (parts.length < 2) {
      return raw;
    }

    let hour = Number(parts[0]);
    const minute = parts[1];

    if (Number.isNaN(hour)) {
      return raw;
    }

    const suffix = hour >= 12 ? "PM" : "AM";

    hour = hour % 12 || 12;

    return `${String(hour).padStart(2, "0")}:${minute} ${suffix}`;
  };

  // --------------------------------------------------
  // Format time slot
  // --------------------------------------------------
  const formatSlot = (slot) => {
    if (!slot) return "Time not assigned";

    const start =
      slot.start_time ??
      slot.start ??
      slot.from_time ??
      slot.from ??
      null;

    const end =
      slot.end_time ??
      slot.end ??
      slot.to_time ??
      slot.to ??
      null;

    if (start && end) {
      return `${formatTime(start)} - ${formatTime(end)}`;
    }

    if (start) {
      return formatTime(start);
    }

    return "Time not assigned";
  };

  // --------------------------------------------------
  // Normalize database booking status
  // --------------------------------------------------
  const normalizeStatus = (status) => {
    const value = String(status || "").toLowerCase();

    if (
      value === "cancelled" ||
      value === "canceled" ||
      value === "rejected"
    ) {
      return "Cancelled";
    }

    if (value === "completed") {
      return "Completed";
    }

    if (
      value === "processing" ||
      value === "called" ||
      value === "weighing" ||
      value === "quality_check" ||
      value === "accepted"
    ) {
      return "Upcoming";
    }

    return "Upcoming";
  };

  // --------------------------------------------------
  // Create farmer display ID
  // --------------------------------------------------
  const getFarmerId = (profile) => {
    if (!profile) return "—";

    return (
      profile.farmer_id ||
      profile.farmer_code ||
      profile.registration_id ||
      profile.user_code ||
      (profile.id
        ? `FR${profile.id.replace(/-/g, "").slice(0, 6).toUpperCase()}`
        : "—")
    );
  };

  // --------------------------------------------------
  // Load bookings from Supabase
  // --------------------------------------------------
  const loadBookings = async () => {
    try {
      setLoading(true);
      setError("");

      // 1. Get bookings
      const { data: bookingData, error: bookingError } = await supabase
        .from("bookings")
        .select("*")
        .order("booking_date", { ascending: false });

      if (bookingError) {
        throw bookingError;
      }

      if (!bookingData || bookingData.length === 0) {
        setBookings([]);
        return;
      }

      // ------------------------------------------------
      // Collect IDs
      // ------------------------------------------------
      const farmerIds = [
        ...new Set(
          bookingData
            .map((booking) => booking.farmer_id)
            .filter(Boolean)
        ),
      ];

      const centreIds = [
        ...new Set(
          bookingData
            .map((booking) => booking.centre_id)
            .filter(Boolean)
        ),
      ];

      const cropIds = [
        ...new Set(
          bookingData
            .map((booking) => booking.crop_id)
            .filter(Boolean)
        ),
      ];

      const slotIds = [
        ...new Set(
          bookingData
            .map((booking) => booking.slot_id)
            .filter(Boolean)
        ),
      ];

      // ------------------------------------------------
      // 2. Get farmers
      // ------------------------------------------------
      let farmerMap = {};

      if (farmerIds.length > 0) {
        const { data: farmers, error: farmerError } = await supabase
          .from("profiles")
          .select("*")
          .in("id", farmerIds);

        if (farmerError) {
          console.error("Farmer fetch error:", farmerError);
        } else {
          farmerMap = Object.fromEntries(
            (farmers || []).map((farmer) => [farmer.id, farmer])
          );
        }
      }

      // ------------------------------------------------
      // 3. Get centres
      // ------------------------------------------------
      let centreMap = {};

      if (centreIds.length > 0) {
        const { data: centres, error: centreError } = await supabase
          .from("centres")
          .select("*")
          .in("id", centreIds);

        if (centreError) {
          console.error("Centre fetch error:", centreError);
        } else {
          centreMap = Object.fromEntries(
            (centres || []).map((centre) => [centre.id, centre])
          );
        }
      }

      // ------------------------------------------------
      // 4. Get crops
      // ------------------------------------------------
      let cropMap = {};

      if (cropIds.length > 0) {
        const { data: crops, error: cropError } = await supabase
          .from("crops")
          .select("*")
          .in("id", cropIds);

        if (cropError) {
          console.error("Crop fetch error:", cropError);
        } else {
          cropMap = Object.fromEntries(
            (crops || []).map((crop) => [crop.id, crop])
          );
        }
      }

      // ------------------------------------------------
      // 5. Get time slots
      // ------------------------------------------------
      let slotMap = {};

      if (slotIds.length > 0) {
        const { data: slots, error: slotError } = await supabase
          .from("time_slots")
          .select("*")
          .in("id", slotIds);

        if (slotError) {
          console.error("Slot fetch error:", slotError);
        } else {
          slotMap = Object.fromEntries(
            (slots || []).map((slot) => [slot.id, slot])
          );
        }
      }

      // ------------------------------------------------
      // 6. Convert database data into UI data
      // ------------------------------------------------
      const formattedBookings = bookingData.map((booking) => {
        const farmer = farmerMap[booking.farmer_id];
        const centre = centreMap[booking.centre_id];
        const crop = cropMap[booking.crop_id];
        const slot = slotMap[booking.slot_id];

        const rawQuantity =
          booking.quantity ??
          booking.quantity_quintal ??
          booking.quantity_quintals ??
          booking.expected_quantity ??
          0;

        const quantity =
          rawQuantity !== null && rawQuantity !== undefined
            ? `${rawQuantity} Quintal`
            : "—";

        const location = [
          centre?.district,
          centre?.state,
        ]
          .filter(Boolean)
          .join(", ");

        const bookingDate =
          booking.booking_date ??
          booking.scheduled_date ??
          booking.date ??
          booking.created_at;

        const displayId =
          booking.booking_number ||
          booking.booking_code ||
          booking.reference_number ||
          `SP${String(booking.id).padStart(6, "0")}`;

        const farmerName =
          farmer?.full_name ||
          farmer?.name ||
          farmer?.fullName ||
          "Unknown Farmer";

        const centreName =
          centre?.name ||
          centre?.centre_name ||
          "Unknown Centre";

        const cropName =
          crop?.name ||
          crop?.crop_name ||
          "Unknown Crop";

        const token =
          booking.token_number ??
          booking.token ??
          booking.queue_token ??
          booking.id;

        return {
          id: displayId,

          // Important: actual DB ID for update
          rawId: booking.id,

          farmer: farmerName,

          farmerId: getFarmerId(farmer),

          centre: centreName,

          location:
            location ||
            centre?.address ||
            "Location not available",

          crop: cropName,

          quantity,

          date: formatDate(bookingDate),

          time:
            formatSlot(slot) !== "Time not assigned"
              ? formatSlot(slot)
              : "Time not assigned",

          token: `#${token}`,

          status: normalizeStatus(booking.status),

          // Keep original DB status for debugging/future use
          dbStatus: booking.status,

          bookingDateRaw: bookingDate,

          centreId: booking.centre_id,

          farmerIdRaw: booking.farmer_id,

          cropId: booking.crop_id,

          slotId: booking.slot_id,
        };
      });

      setBookings(formattedBookings);
    } catch (err) {
      console.error("Admin bookings error:", err);

      setError(
        err?.message ||
          "Unable to load bookings. Please try again."
      );

      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------------
  // Load on page open
  // --------------------------------------------------
  useEffect(() => {
    loadBookings();
  }, []);

  // --------------------------------------------------
  // Filter bookings
  // --------------------------------------------------
  const filteredBookings = useMemo(() => {
    const query = search.trim().toLowerCase();

    return bookings.filter((booking) => {
      const matchesTab =
        activeTab === "All" ||
        booking.status === activeTab;

      const searchableText = [
        booking.id,
        booking.farmer,
        booking.farmerId,
        booking.centre,
        booking.location,
        booking.crop,
        booking.quantity,
        booking.token,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        !query || searchableText.includes(query);

      return matchesTab && matchesSearch;
    });
  }, [bookings, activeTab, search]);

  // --------------------------------------------------
  // Statistics
  // --------------------------------------------------
  const stats = useMemo(() => {
    return {
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
  }, [bookings]);

  // --------------------------------------------------
  // Cancel booking
  // --------------------------------------------------
  const cancelBooking = async (booking) => {
    if (!booking?.rawId) {
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to cancel booking ${booking.id}?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setCancelling(true);
      setError("");

      const { error: updateError } = await supabase
        .from("bookings")
        .update({
          status: "cancelled",
        })
        .eq("id", booking.rawId);

      if (updateError) {
        throw updateError;
      }

      // Update UI immediately
      setBookings((current) =>
        current.map((item) =>
          item.rawId === booking.rawId
            ? {
                ...item,
                status: "Cancelled",
                dbStatus: "cancelled",
              }
            : item
        )
      );

      setSelectedBooking(null);
    } catch (err) {
      console.error("Cancel booking error:", err);

      setError(
        err?.message ||
          "Unable to cancel booking."
      );
    } finally {
      setCancelling(false);
    }
  };

  const statusClasses = {
    Upcoming: "bg-blue-50 text-blue-700",
    Completed: "bg-green-50 text-green-700",
    Cancelled: "bg-red-50 text-red-700",
  };

  // --------------------------------------------------
  // Current date
  // --------------------------------------------------
  const today = new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  }).format(new Date());

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

          <div className="flex items-center justify-between gap-3">
            <button
              onClick={loadBookings}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-600 shadow-sm hover:bg-slate-50 disabled:opacity-50"
            >
              <RefreshCw
                className={`h-4 w-4 ${
                  loading ? "animate-spin" : ""
                }`}
              />
              Refresh
            </button>

            <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600 shadow-sm">
              <CalendarDays className="h-4 w-4 text-green-700" />
              {today}
            </div>
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4">
          <div className="flex items-start gap-3">
            <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />

            <div>
              <p className="text-sm font-bold text-red-800">
                Something went wrong
              </p>

              <p className="mt-1 text-xs leading-5 text-red-700">
                {error}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold text-slate-500">
            Total Bookings
          </p>

          <p className="mt-2 text-2xl font-extrabold text-blue-950">
            {loading ? "..." : stats.total}
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
            {loading ? "..." : stats.upcoming}
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
            {loading ? "..." : stats.completed}
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
            {loading ? "..." : stats.cancelled}
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
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search booking, farmer or centre..."
              className="h-10 w-full rounded-lg border border-slate-300 pl-9 pr-3 text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
            />
          </div>
        </div>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="rounded-xl border border-slate-200 bg-white px-5 py-16 text-center shadow-sm">
          <RefreshCw className="mx-auto h-8 w-8 animate-spin text-green-700" />

          <p className="mt-3 text-sm font-bold text-slate-600">
            Loading bookings...
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Fetching booking data from Supabase.
          </p>
        </div>
      ) : (
        <>
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
                      key={booking.rawId}
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
                          className={`inline-flex rounded-full px-3 py-1 text-[11px] font-bold ${
                            statusClasses[booking.status]
                          }`}
                        >
                          {booking.status}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-right">
                        <button
                          onClick={() =>
                            setSelectedBooking(booking)
                          }
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
                key={booking.rawId}
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
                    className={`rounded-full px-3 py-1 text-[10px] font-bold ${
                      statusClasses[booking.status]
                    }`}
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
                  onClick={() =>
                    setSelectedBooking(booking)
                  }
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

                <p className="mt-1 text-xs text-slate-400">
                  Try changing your search or filter.
                </p>
              </div>
            )}
          </div>
        </>
      )}

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
                    className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-bold ${
                      statusClasses[selectedBooking.status]
                    }`}
                  >
                    {selectedBooking.status}
                  </span>
                </div>

                <div className="text-right">
                  <p className="text-xs text-slate-500">
                    Token
                  </p>

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
                    Farmer is scheduled for token{" "}
                    {selectedBooking.token} during the selected
                    time slot.
                  </p>
                </div>
              </div>

              {selectedBooking.status === "Upcoming" && (
                <button
                  onClick={() =>
                    cancelBooking(selectedBooking)
                  }
                  disabled={cancelling}
                  className="flex w-full items-center justify-center gap-2 rounded-lg border border-red-200 py-2.5 text-xs font-bold text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {cancelling ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      Cancelling...
                    </>
                  ) : (
                    <>
                      <XCircle className="h-4 w-4" />
                      Cancel Booking
                    </>
                  )}
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