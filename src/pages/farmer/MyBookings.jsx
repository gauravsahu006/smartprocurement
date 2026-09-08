import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  Clock,
  MapPin,
  Ticket,
  RefreshCw,
  XCircle,
} from "lucide-react";
import { supabase } from "../../lib/supabase";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError("");

      // -----------------------------------------
      // 1. Get logged-in farmer
      // -----------------------------------------

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        throw userError;
      }

      if (!user) {
        setError("Please login first.");
        return;
      }

      console.log("Logged in farmer:", user.id);

      // -----------------------------------------
      // 2. Fetch farmer bookings
      // -----------------------------------------

      const { data: bookingData, error: bookingError } =
        await supabase
          .from("bookings")
          .select("*")
          .eq("farmer_id", user.id)
          .order("created_at", {
            ascending: false,
          });

      if (bookingError) {
        throw bookingError;
      }

      console.log("Bookings:", bookingData);

      if (!bookingData || bookingData.length === 0) {
        setBookings([]);
        return;
      }

      // -----------------------------------------
      // 3. Get IDs needed for related data
      // -----------------------------------------

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

      // -----------------------------------------
      // 4. Fetch centres
      // -----------------------------------------

      let centres = [];

      if (centreIds.length > 0) {
        const { data, error } = await supabase
          .from("centres")
          .select("*")
          .in("id", centreIds);

        if (error) {
          console.error("Centre fetch error:", error);
        } else {
          centres = data || [];
        }
      }

      // -----------------------------------------
      // 5. Fetch crops
      // -----------------------------------------

      let crops = [];

      if (cropIds.length > 0) {
        const { data, error } = await supabase
          .from("crops")
          .select("*")
          .in("id", cropIds);

        if (error) {
          console.error("Crop fetch error:", error);
        } else {
          crops = data || [];
        }
      }

      // -----------------------------------------
      // 6. Fetch time slots
      // -----------------------------------------

      let slots = [];

      if (slotIds.length > 0) {
        const { data, error } = await supabase
          .from("time_slots")
          .select("*")
          .in("id", slotIds);

        if (error) {
          console.error("Slot fetch error:", error);
        } else {
          slots = data || [];
        }
      }

      console.log("Centres:", centres);
      console.log("Crops:", crops);
      console.log("Slots:", slots);

      // -----------------------------------------
      // 7. Fetch procurements
      // -----------------------------------------

      const bookingIds = bookingData
        .map((booking) => booking.id)
        .filter(Boolean);

      let procurements = [];

      if (bookingIds.length > 0) {
        const { data, error } = await supabase
          .from("procurements")
          .select("*")
          .in("booking_id", bookingIds);

        if (error) {
          console.error(
            "Procurement fetch error:",
            error
          );
        } else {
          procurements = data || [];
        }
      }

      // -----------------------------------------
      // 8. Combine everything
      // -----------------------------------------

      const finalBookings = bookingData.map((booking) => {
        const centre = centres.find(
          (item) => item.id === booking.centre_id
        );

        const crop = crops.find(
          (item) => item.id === booking.crop_id
        );

        const slot = slots.find(
          (item) => item.id === booking.slot_id
        );

        const procurement = procurements.find(
          (item) => item.booking_id === booking.id
        );

        return {
          ...booking,
          centre,
          crop,
          slot,
          procurement,
        };
      });

      console.log(
        "Final bookings:",
        finalBookings
      );

      setBookings(finalBookings);
    } catch (err) {
      console.error(
        "Fetch bookings error:",
        err
      );

      setError(
        err?.message ||
          "Unable to load your bookings."
      );
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------------------
  // Cancel booking
  // -----------------------------------------

  const handleCancel = async (bookingId) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this booking?"
    );

    if (!confirmed) return;

    try {
      setError("");

      const { data, error } =
        await supabase.rpc("cancel_booking", {
          p_booking_id: Number(bookingId),
        });

      if (error) {
        throw error;
      }

      console.log(
        "Booking cancelled:",
        data
      );

      await fetchBookings();
    } catch (err) {
      console.error(
        "Cancel booking error:",
        err
      );

      setError(
        err?.message ||
          "Unable to cancel booking."
      );
    }
  };

  // -----------------------------------------
  // Loading
  // -----------------------------------------

  if (loading) {
    return (
      <main className="min-h-full bg-[#f8faf9] px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="flex min-h-[400px] items-center justify-center">
            <div className="text-center">
              <RefreshCw
                size={28}
                className="mx-auto animate-spin text-green-700"
              />

              <p className="mt-3 text-sm text-slate-500">
                Loading your bookings...
              </p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-full bg-[#f8faf9] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">

        {/* Back */}
        <Link
          to="/dashboard"
          className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-green-700"
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </Link>

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[#10233f]">
            My Bookings
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            View and manage your procurement centre bookings.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* No bookings */}
        {bookings.length === 0 ? (
          <section className="rounded-xl border border-slate-200 bg-white px-6 py-12 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-50">
              <CalendarDays
                size={26}
                className="text-green-700"
              />
            </div>

            <h2 className="mt-4 text-lg font-bold text-[#10233f]">
              No bookings yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
              You haven't booked a procurement slot yet.
              Select a centre and choose an available slot to get started.
            </p>

            <Link
              to="/centres"
              className="mt-5 inline-flex items-center justify-center rounded-lg bg-green-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-green-800"
            >
              Book a Slot
            </Link>
          </section>
        ) : (
          <div className="space-y-5">

            {bookings.map((booking) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                onCancel={handleCancel}
              />
            ))}

          </div>
        )}
      </div>
    </main>
  );
}

// =====================================================
// BOOKING CARD
// =====================================================

function BookingCard({
  booking,
  onCancel,
}) {
  const centreName =
    booking.centre?.name ||
    "Procurement Centre";

  const centreAddress =
    booking.centre?.address ||
    [
      booking.centre?.district,
      booking.centre?.state,
    ]
      .filter(Boolean)
      .join(", ") ||
    "Address not available";

  const cropName =
    booking.crop?.name ||
    "Crop not available";

  const token =
    booking.token_number ||
    booking.token ||
    "—";

  const bookingDate =
    booking.booking_date ||
    booking.slot?.slot_date ||
    booking.slot?.date ||
    null;

  const bookingTime = getSlotTime(
    booking.slot
  );

  const bookingStatus =
    booking.status || "confirmed";

  const procurementStatus =
    booking.procurement?.status ||
    null;

  const displayStatus =
    procurementStatus ||
    bookingStatus;

  const canCancel =
    ["confirmed", "pending"].includes(
      bookingStatus
    );

  return (
    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

      {/* Top */}
      <div className="flex flex-col gap-4 border-b border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <div className="flex items-center gap-2">
            <Ticket
              size={18}
              className="text-green-700"
            />

            <span className="text-sm font-bold text-[#10233f]">
              Booking #{booking.id}
            </span>
          </div>

          <p className="mt-1 text-xs text-slate-500">
            Token #{token}
          </p>
        </div>

        <StatusBadge
          status={displayStatus}
        />

      </div>

      {/* Details */}
      <div className="grid gap-4 px-5 py-5 sm:grid-cols-2 lg:grid-cols-4">

        {/* Centre */}
        <InfoItem
          icon={MapPin}
          label="Centre"
          value={centreName}
        />

        {/* Crop */}
        <InfoItem
          icon={CalendarDays}
          label="Crop"
          value={cropName}
        />

        {/* Date */}
        <InfoItem
          icon={CalendarDays}
          label="Date"
          value={
            bookingDate
              ? formatDate(bookingDate)
              : "Not available"
          }
        />

        {/* Time */}
        <InfoItem
          icon={Clock}
          label="Time"
          value={bookingTime}
        />

      </div>

      {/* Address */}
      <div className="border-t border-slate-100 px-5 py-4">
        <div className="flex items-start gap-2">
          <MapPin
            size={16}
            className="mt-0.5 shrink-0 text-slate-400"
          />

          <div>
            <p className="text-[11px] font-medium text-slate-500">
              Centre Address
            </p>

            <p className="mt-1 text-sm text-slate-700">
              {centreAddress}
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-3 border-t border-slate-100 px-5 py-4 sm:flex-row sm:justify-end">

        <Link
          to={`/queue?booking=${booking.id}`}
          className="inline-flex items-center justify-center rounded-lg border border-green-700 px-4 py-2 text-sm font-semibold text-green-700 transition hover:bg-green-50"
        >
          View Live Queue
        </Link>

        {canCancel && (
          <button
            type="button"
            onClick={() =>
              onCancel(booking.id)
            }
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50"
          >
            <XCircle size={16} />
            Cancel Booking
          </button>
        )}

      </div>
    </section>
  );
}

// =====================================================
// INFO ITEM
// =====================================================

function InfoItem({
  icon: Icon,
  label,
  value,
}) {
  return (
    <div className="flex items-start gap-3">

      <div className="rounded-lg bg-slate-50 p-2">
        <Icon
          size={16}
          className="text-slate-500"
        />
      </div>

      <div className="min-w-0">
        <p className="text-[11px] font-medium text-slate-500">
          {label}
        </p>

        <p className="mt-1 truncate text-sm font-semibold text-[#10233f]">
          {value || "—"}
        </p>
      </div>

    </div>
  );
}

// =====================================================
// STATUS BADGE
// =====================================================

function StatusBadge({
  status,
}) {
  const normalized =
    String(status || "")
      .toLowerCase()
      .replaceAll("_", " ");

  let className =
    "bg-slate-100 text-slate-700";

  if (
    ["confirmed", "waiting"].includes(
      normalized
    )
  ) {
    className =
      "bg-blue-50 text-blue-700";
  }

  if (
    ["called", "processing", "quality check"].includes(
      normalized
    )
  ) {
    className =
      "bg-amber-50 text-amber-700";
  }

  if (
    ["accepted", "completed", "successful"].includes(
      normalized
    )
  ) {
    className =
      "bg-green-50 text-green-700";
  }

  if (
    ["cancelled", "rejected", "failed"].includes(
      normalized
    )
  ) {
    className =
      "bg-red-50 text-red-700";
  }

  return (
    <span
      className={`inline-flex w-fit rounded-full px-3 py-1 text-xs font-semibold capitalize ${className}`}
    >
      {normalized || "Unknown"}
    </span>
  );
}

// =====================================================
// DATE FORMAT
// =====================================================

function formatDate(date) {
  if (!date) return "—";

  const parsedDate = new Date(
    `${date}T00:00:00`
  );

  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  return parsedDate.toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
}

// =====================================================
// SLOT TIME
// =====================================================

function getSlotTime(slot) {
  if (!slot) {
    return "Time not available";
  }

  if (
    slot.start_time &&
    slot.end_time
  ) {
    return `${formatTime(
      slot.start_time
    )} - ${formatTime(slot.end_time)}`;
  }

  if (slot.start_time) {
    return formatTime(
      slot.start_time
    );
  }

  return "Time not available";
}

function formatTime(time) {
  if (!time) return "";

  const [hours, minutes] =
    String(time).split(":");

  const date = new Date();

  date.setHours(
    Number(hours),
    Number(minutes),
    0,
    0
  );

  return date.toLocaleTimeString(
    "en-IN",
    {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }
  );
}