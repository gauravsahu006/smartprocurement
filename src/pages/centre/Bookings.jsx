import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  ChevronDown,
  Clock3,
  Eye,
  MapPin,
  Search,
  UserRound,
} from "lucide-react";
import { supabase } from "../../lib/supabase";

function Bookings() {
  const [bookingsData, setBookingsData] = useState([]);

  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");
  const [selectedBooking, setSelectedBooking] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const tabs = [
    "All",
    "Upcoming",
    "Completed",
    "Cancelled",
  ];

  // ==================================================
  // Get local date
  // ==================================================
  const getLocalDate = () => {
    const now = new Date();

    const year = now.getFullYear();
    const month = String(
      now.getMonth() + 1
    ).padStart(2, "0");
    const day = String(
      now.getDate()
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  // ==================================================
  // Format date
  // ==================================================
  const formatDate = (dateValue) => {
    if (!dateValue) {
      return "—";
    }

    const date = new Date(
      `${dateValue}T00:00:00`
    );

    return date.toLocaleDateString(
      "en-GB",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  // ==================================================
  // Format time
  // ==================================================
  const formatTime = (timeValue) => {
    if (!timeValue) {
      return "—";
    }

    const [hours, minutes] =
      timeValue.split(":");

    const date = new Date();

    date.setHours(
      Number(hours),
      Number(minutes),
      0,
      0
    );

    return date.toLocaleTimeString(
      "en-US",
      {
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };

  // ==================================================
  // Format slot
  // ==================================================
  const formatSlot = (
    startTime,
    endTime
  ) => {
    if (!startTime || !endTime) {
      return "—";
    }

    return `${formatTime(
      startTime
    )} - ${formatTime(endTime)}`;
  };

  // ==================================================
  // Convert database status to UI status
  // ==================================================
  const getDisplayStatus = (
    status,
    bookingDate
  ) => {
    if (status === "cancelled") {
      return "Cancelled";
    }

    if (status === "completed") {
      return "Completed";
    }

    // If booking is not completed/cancelled,
    // show it as upcoming.
    return "Upcoming";
  };

  // ==================================================
  // Fetch bookings
  // ==================================================
  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
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
        console.error(
          "Bookings user error:",
          userError
        );

        setError(
          "Please login again."
        );

        return;
      }

      console.log(
        "Bookings logged-in staff:",
        user
      );

      // ==================================================
      // 2. Get staff centre assignment
      // ==================================================
      const {
        data: staffAssignment,
        error: staffError,
      } = await supabase
        .from("centre_staff")
        .select("centre_id")
        .eq("user_id", user.id)
        .single();

      if (
        staffError ||
        !staffAssignment
      ) {
        console.error(
          "Bookings staff assignment error:",
          staffError
        );

        setError(
          "Unable to find your centre assignment."
        );

        return;
      }

      console.log(
        "Bookings staff assignment:",
        staffAssignment
      );

      const centreId =
        staffAssignment.centre_id;

      console.log(
        "Bookings centre:",
        centreId
      );

      // ==================================================
      // 3. Get bookings of assigned centre
      // ==================================================
      const {
        data: bookingRows,
        error: bookingError,
      } = await supabase
        .from("bookings")
        .select("*")
        .eq("centre_id", centreId)
        .order("booking_date", {
          ascending: false,
        })
        .order("token_number", {
          ascending: true,
        });

      if (bookingError) {
        console.error(
          "Bookings fetch error:",
          bookingError
        );

        setError(
          "Unable to load bookings."
        );

        return;
      }

      console.log(
        "Centre bookings:",
        bookingRows
      );

      if (
        !bookingRows ||
        bookingRows.length === 0
      ) {
        setBookingsData([]);
        return;
      }

      // ==================================================
      // 4. Get unique farmer IDs
      // ==================================================
      const farmerIds = [
        ...new Set(
          bookingRows
            .map(
              (booking) =>
                booking.farmer_id
            )
            .filter(Boolean)
        ),
      ];

      // ==================================================
      // 5. Get unique crop IDs
      // ==================================================
      const cropIds = [
        ...new Set(
          bookingRows
            .map(
              (booking) =>
                booking.crop_id
            )
            .filter(Boolean)
        ),
      ];

      // ==================================================
      // 6. Get unique slot IDs
      // ==================================================
      const slotIds = [
        ...new Set(
          bookingRows
            .map(
              (booking) =>
                booking.slot_id
            )
            .filter(Boolean)
        ),
      ];

      // ==================================================
      // 7. Fetch farmer profiles
      // ==================================================
      let farmers = [];

      if (farmerIds.length > 0) {
        const {
          data: farmerData,
          error: farmerError,
        } = await supabase
          .from("profiles")
          .select("*")
          .in("id", farmerIds);

        if (farmerError) {
          console.error(
            "Farmer profiles error:",
            farmerError
          );
        } else {
          farmers =
            farmerData || [];
        }
      }

      console.log(
        "Booking farmers:",
        farmers
      );

      // ==================================================
      // 8. Fetch crops
      // ==================================================
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
            "Booking crops error:",
            cropError
          );
        } else {
          crops =
            cropData || [];
        }
      }

      console.log(
        "Booking crops:",
        crops
      );

      // ==================================================
      // 9. Fetch time slots
      // ==================================================
      let slots = [];

      if (slotIds.length > 0) {
        const {
          data: slotData,
          error: slotError,
        } = await supabase
          .from("time_slots")
          .select("*")
          .in("id", slotIds);

        if (slotError) {
          console.error(
            "Booking slots error:",
            slotError
          );
        } else {
          slots =
            slotData || [];
        }
      }

      console.log(
        "Booking slots:",
        slots
      );

      // ==================================================
      // 10. Enrich bookings
      // ==================================================
      const enrichedBookings =
        bookingRows.map(
          (booking) => {
            const farmer =
              farmers.find(
                (item) =>
                  item.id ===
                  booking.farmer_id
              );

            const crop =
              crops.find(
                (item) =>
                  item.id ===
                  booking.crop_id
              );

            const slot =
              slots.find(
                (item) =>
                  item.id ===
                  booking.slot_id
              );

            // --------------------------------------------
            // Get farmer phone
            // --------------------------------------------
            const farmerPhone =
              farmer?.phone ??
              farmer?.mobile ??
              farmer?.phone_number ??
              "—";

            // --------------------------------------------
            // Get booking status
            // --------------------------------------------
            const displayStatus =
              getDisplayStatus(
                booking.status,
                booking.booking_date
              );

            return {
              ...booking,

              // Existing UI fields
              id:
                booking.id,

              bookingId:
                `SP${String(
                  booking.id
                ).padStart(
                  6,
                  "0"
                )}`,

              token:
                booking.token_number != null
                  ? `#${booking.token_number}`
                  : "—",

              farmer:
                farmer?.full_name ||
                "Unknown Farmer",

              mobile:
                farmerPhone,

              crop:
                crop?.name ||
                "Unknown Crop",

              quantity:
                booking.quantity != null
                  ? `${booking.quantity} Quintal`
                  : "—",

              date:
                formatDate(
                  booking.booking_date
                ),

              time:
                formatSlot(
                  slot?.start_time,
                  slot?.end_time
                ),

              status:
                displayStatus,

              // Raw values for future use
              rawStatus:
                booking.status,

              slotData:
                slot,

              farmerData:
                farmer,

              cropData:
                crop,
            };
          }
        );

      console.log(
        "Enriched bookings:",
        enrichedBookings
      );

      setBookingsData(
        enrichedBookings
      );
    } catch (err) {
      console.error(
        "Bookings page error:",
        err
      );

      setError(
        "Something went wrong while loading bookings."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==================================================
  // Filter bookings
  // ==================================================
  const filteredBookings =
    useMemo(() => {
      return bookingsData.filter(
        (booking) => {
          // --------------------------------------------
          // Tab filter
          // --------------------------------------------
          const matchesTab =
            activeTab === "All" ||
            booking.status ===
              activeTab;

          // --------------------------------------------
          // Search filter
          // --------------------------------------------
          const searchValue =
            search
              .trim()
              .toLowerCase();

          if (!searchValue) {
            return matchesTab;
          }

          const matchesSearch =
            booking.farmer
              .toLowerCase()
              .includes(searchValue) ||
            booking.token
              .toLowerCase()
              .includes(searchValue) ||
            booking.bookingId
              .toLowerCase()
              .includes(searchValue) ||
            booking.crop
              .toLowerCase()
              .includes(searchValue) ||
            booking.mobile
              .toLowerCase()
              .includes(searchValue);

          return (
            matchesTab &&
            matchesSearch
          );
        }
      );
    }, [
      activeTab,
      search,
      bookingsData,
    ]);

  // ==================================================
  // Current date
  // ==================================================
  const currentDate =
    getLocalDate();

  return (
    <div className="mx-auto max-w-[1280px] px-4 py-5 sm:px-6 lg:px-7">

      {/* ==================================================
          Header
      ================================================== */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <h1 className="text-lg font-extrabold text-blue-950 sm:text-xl">
            Bookings
          </h1>

          <p className="mt-1 text-[10px] text-slate-500 sm:text-xs">
            View and manage farmer bookings at your centre
          </p>
        </div>

        <button
          type="button"
          className="flex w-fit items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-[10px] font-semibold text-slate-700 shadow-sm"
        >
          <CalendarDays className="h-3.5 w-3.5 text-slate-500" />

          {new Date(
            `${currentDate}T00:00:00`
          ).toLocaleDateString(
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
          Search
      ================================================== */}
      <div className="mt-5 rounded-lg border border-slate-200 bg-white p-3 shadow-sm">

        <div className="relative">

          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

          <input
            type="text"
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value
              )
            }
            placeholder="Search by farmer name, token, booking ID or crop..."
            className="h-10 w-full rounded-md border border-slate-200 bg-slate-50 pl-9 pr-3 text-xs text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-green-600 focus:bg-white"
          />

        </div>
      </div>

      {/* ==================================================
          Tabs
      ================================================== */}
      <div className="mt-4 flex gap-1 overflow-x-auto rounded-lg border border-slate-200 bg-white p-1 shadow-sm">

        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() =>
              setActiveTab(tab)
            }
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

      {/* ==================================================
          Booking List
      ================================================== */}
      <section className="mt-4 space-y-3">

        {/* Loading */}
        {loading && (
          <div className="rounded-lg border border-slate-200 bg-white py-12 text-center shadow-sm">

            <div className="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-slate-200 border-t-green-700" />

            <p className="mt-3 text-[10px] font-semibold text-slate-500">
              Loading bookings...
            </p>

          </div>
        )}

        {/* No results */}
        {!loading &&
          filteredBookings.length ===
            0 && (
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

        {/* Results */}
        {!loading &&
          filteredBookings.map(
            (booking) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                onView={() =>
                  setSelectedBooking(
                    booking
                  )
                }
              />
            )
          )}

      </section>

      {/* ==================================================
          Booking Count
      ================================================== */}
      {!loading && (
        <p className="mt-4 text-center text-[9px] text-slate-400">
          Showing{" "}
          {filteredBookings.length}{" "}
          of{" "}
          {bookingsData.length}{" "}
          bookings
        </p>
      )}

      {/* ==================================================
          Details Modal
      ================================================== */}
      {selectedBooking && (
        <BookingDetails
          booking={
            selectedBooking
          }
          onClose={() =>
            setSelectedBooking(null)
          }
        />
      )}

    </div>
  );
}

// ==================================================
// Booking Card
// ==================================================
function BookingCard({
  booking,
  onView,
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md">

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        {/* ==================================================
            Farmer
        ================================================== */}
        <div className="flex min-w-0 items-start gap-3">

          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-50 text-green-700">
            <UserRound className="h-5 w-5" />
          </div>

          <div className="min-w-0">

            <div className="flex flex-wrap items-center gap-2">

              <h2 className="text-xs font-extrabold text-blue-950">
                {booking.farmer}
              </h2>

              <StatusBadge
                status={
                  booking.status
                }
              />

            </div>

            <p className="mt-1 text-[9px] text-slate-500">
              Booking ID:{" "}
              {booking.bookingId}
            </p>

            <p className="mt-1 text-[9px] text-slate-500">
              Mobile:{" "}
              {booking.mobile}
            </p>

          </div>
        </div>

        {/* ==================================================
            Booking Info
        ================================================== */}
        <div className="grid grid-cols-2 gap-x-8 gap-y-3 sm:grid-cols-4 lg:flex lg:items-center">

          <InfoItem
            label="Token"
            value={
              booking.token
            }
            highlight
          />

          <InfoItem
            label="Crop"
            value={
              booking.crop
            }
          />

          <InfoItem
            label="Quantity"
            value={
              booking.quantity
            }
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

        {/* ==================================================
            Action
        ================================================== */}
        <button
          type="button"
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

// ==================================================
// Info Item
// ==================================================
function InfoItem({
  label,
  value,
  highlight,
}) {
  return (
    <div>

      <p className="text-[8px] font-semibold text-slate-400">
        {label}
      </p>

      <p
        className={`mt-1 text-[9px] font-extrabold ${
          highlight
            ? "text-green-700"
            : "text-slate-700"
        }`}
      >
        {value}
      </p>

    </div>
  );
}

// ==================================================
// Status Badge
// ==================================================
function StatusBadge({
  status,
}) {
  const styles = {
    Upcoming:
      "bg-blue-50 text-blue-700",

    Completed:
      "bg-green-50 text-green-700",

    Cancelled:
      "bg-red-50 text-red-600",
  };

  return (
    <span
      className={`rounded-full px-2 py-1 text-[7px] font-bold ${
        styles[status] ||
        "bg-slate-100 text-slate-600"
      }`}
    >
      {status}
    </span>
  );
}

// ==================================================
// Booking Details Modal
// ==================================================
function BookingDetails({
  booking,
  onClose,
}) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/40 px-4 py-6">

      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white shadow-xl">

        {/* ==================================================
            Modal Header
        ================================================== */}
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">

          <div>

            <h2 className="text-sm font-extrabold text-blue-950">
              Booking Details
            </h2>

            <p className="mt-0.5 text-[9px] text-slate-500">
              {booking.bookingId}
            </p>

          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-md text-lg text-slate-400 hover:bg-slate-100"
          >
            ×
          </button>

        </div>

        {/* ==================================================
            Details
        ================================================== */}
        <div className="space-y-4 p-5">

          {/* Token */}
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
            value={
              booking.farmer
            }
          />

          <DetailRow
            label="Mobile Number"
            value={
              booking.mobile
            }
          />

          <DetailRow
            label="Crop"
            value={
              booking.crop
            }
          />

          <DetailRow
            label="Quantity"
            value={
              booking.quantity
            }
          />

          <DetailRow
            label="Booking Date"
            value={
              booking.date
            }
          />

          <DetailRow
            label="Time Slot"
            value={
              booking.time
            }
          />

          <DetailRow
            label="Status"
            value={
              booking.status
            }
          />

          <div className="flex items-start gap-2 rounded-lg bg-blue-50 p-3">

            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-blue-700" />

            <div>

              <p className="text-[9px] font-bold text-blue-900">
                Procurement Centre
              </p>

              <p className="mt-0.5 text-[8px] leading-4 text-blue-800">
                ABC Procurement Centre,
                Main Market Road,
                Ranchi, Jharkhand
              </p>

            </div>

          </div>

        </div>

        {/* ==================================================
            Footer
        ================================================== */}
        <div className="border-t border-slate-100 px-5 py-4">

          <button
            type="button"
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

// ==================================================
// Detail Row
// ==================================================
function DetailRow({
  label,
  value,
}) {
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