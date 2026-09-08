import { Link, useLocation } from "react-router-dom";
import {
  ArrowLeft,
  Check,
  Download,
  Info,
  MapPin,
} from "lucide-react";

const fallbackCentres = {
  1: {
    name: "ABC Procurement Centre",
    address: "XYZ Village, Ranchi, Jharkhand",
  },
  2: {
    name: "Krishi Seva Kendra",
    address: "Kanke Road, Ranchi, Jharkhand",
  },
  3: {
    name: "Green Field Centre",
    address: "Tupudana, Ranchi, Jharkhand",
  },
  4: {
    name: "Shakti Kendra",
    address: "Harmu Road, Ranchi, Jharkhand",
  },
};

export default function BookingConfirmation() {
  const location = useLocation();

  const booking = location.state || {};

  /*
   * ---------------------------------------
   * CENTRE
   * ---------------------------------------
   *
   * Booking may contain:
   * booking.centre -> object
   * OR
   * booking.centreId -> id
   */

  const centreId =
    booking.centre?.id ||
    booking.centreId ||
    booking.centre_id ||
    1;

  const centre =
    booking.centre ||
    fallbackCentres[centreId] ||
    fallbackCentres[1];

  const centreName =
    centre?.name || "Procurement Centre";

  const centreAddress =
    centre?.address ||
    [centre?.district, centre?.state]
      .filter(Boolean)
      .join(", ") ||
    "Address not available";

  /*
   * ---------------------------------------
   * BOOKING DATE
   * ---------------------------------------
   */

  const bookingDate =
    booking.date ||
    booking.booking_date ||
    booking.slot?.slot_date ||
    booking.slot?.date ||
    new Date().toISOString().split("T")[0];

  /*
   * ---------------------------------------
   * BOOKING TIME
   * ---------------------------------------
   */

  let bookingTime = "Time not available";

  if (typeof booking.slot === "string") {
    bookingTime = booking.slot;
  } else if (booking.slot?.start_time) {
    const start = formatTime(booking.slot.start_time);
    const end = booking.slot?.end_time
      ? formatTime(booking.slot.end_time)
      : "";

    bookingTime = end ? `${start} - ${end}` : start;
  } else if (booking.start_time) {
    const start = formatTime(booking.start_time);
    const end = booking.end_time
      ? formatTime(booking.end_time)
      : "";

    bookingTime = end ? `${start} - ${end}` : start;
  }

  /*
   * ---------------------------------------
   * CROP
   * ---------------------------------------
   *
   * booking.crop can be:
   * {
   *   id,
   *   name,
   *   description,
   *   created_at
   * }
   */

  const crop =
    typeof booking.crop === "object"
      ? booking.crop?.name
      : booking.crop;

  const cropName = crop || "Crop not available";

  /*
   * ---------------------------------------
   * QUANTITY
   * ---------------------------------------
   */

  const quantity =
    booking.quantity !== undefined &&
    booking.quantity !== null
      ? `${booking.quantity} Quintal`
      : "Not specified";

  /*
   * ---------------------------------------
   * TOKEN
   * ---------------------------------------
   */

  const token =
    booking.token ||
    booking.token_number ||
    booking.tokenNumber ||
    booking.queue?.token_number ||
    "—";

  /*
   * ---------------------------------------
   * QUEUE POSITION
   * ---------------------------------------
   */

  const queuePosition =
    booking.queuePosition ||
    booking.queue_position ||
    booking.queue?.queue_position ||
    "—";

  /*
   * ---------------------------------------
   * WAIT TIME
   * ---------------------------------------
   */

  const waitTime =
    booking.waitTime ||
    booking.wait_time ||
    "Calculating...";

  /*
   * ---------------------------------------
   * FORMATTED DATE
   * ---------------------------------------
   */

  const formattedDate = formatDate(bookingDate);

  /*
   * ---------------------------------------
   * DOWNLOAD / PRINT
   * ---------------------------------------
   */

  const handleDownload = () => {
    window.print();
  };

  return (
    <main className="min-h-full bg-[#f8faf9] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">

        {/* Back */}
        <Link
          to="/dashboard"
          className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-green-700"
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </Link>

        {/* Success Header */}
        <section className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-700 shadow-sm">
            <Check
              size={30}
              strokeWidth={3}
              className="text-white"
            />
          </div>

          <h1 className="mt-3 text-xl font-bold text-[#10233f] sm:text-2xl">
            Booking Confirmed!
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Your slot has been successfully booked.
          </p>
        </section>

        {/* Booking Card */}
        <section className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="grid md:grid-cols-2">

            {/* Left Column */}
            <div className="border-b border-slate-200 md:border-b-0 md:border-r">

              <DetailRow
                label="Centre Name"
                value={centreName}
              />

              <DetailRow
                label="Token Number"
                value={`#${token}`}
                highlight
              />

              <DetailRow
                label="Booking Date"
                value={formattedDate}
              />

              <DetailRow
                label="Booking Time"
                value={bookingTime}
                last
              />

            </div>

            {/* Right Column */}
            <div>

              <DetailRow
                label="Crop"
                value={cropName}
              />

              <DetailRow
                label="Quantity"
                value={quantity}
              />

              <DetailRow
                label="Your Position in Queue"
                value={`#${queuePosition}`}
              />

              <DetailRow
                label="Estimated Wait Time"
                value={waitTime}
                last
              />

            </div>
          </div>

          {/* Important Notice */}
          <div className="px-4 pb-4 sm:px-5 sm:pb-5">
            <div className="flex gap-3 rounded-lg border border-green-100 bg-[#f0faf4] p-4">

              <div className="mt-0.5 shrink-0">
                <Info
                  size={18}
                  className="text-green-700"
                />
              </div>

              <div>
                <p className="text-sm font-semibold text-green-800">
                  Important
                </p>

                <p className="mt-1 text-xs leading-5 text-slate-600">
                  Please reach the centre at least 15 minutes
                  before your slot time.
                </p>

                <p className="text-xs leading-5 text-slate-600">
                  Carry your digital token and necessary documents.
                </p>
              </div>

            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3 px-4 pb-5 sm:flex-row sm:justify-center sm:px-5">

            <Link
              to="/queue"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-green-700 bg-white px-6 py-2.5 text-sm font-semibold text-green-700 transition hover:bg-green-50"
            >
              <MapPin size={16} />
              View Live Queue
            </Link>

            <button
              type="button"
              onClick={handleDownload}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-green-700 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-green-800"
            >
              <Download size={16} />
              Download Booking Slip
            </button>

          </div>
        </section>

        {/* Centre Information */}
        <section className="mt-5 rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
          <div className="flex items-start gap-3">

            <div className="rounded-lg bg-green-50 p-2 text-green-700">
              <MapPin size={18} />
            </div>

            <div>
              <h2 className="text-sm font-bold text-[#10233f]">
                {centreName}
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                {centreAddress}
              </p>
            </div>

          </div>
        </section>

        {/* Bottom Links */}
        <div className="mt-5 flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs">

          <Link
            to="/bookings"
            className="font-medium text-slate-500 hover:text-green-700"
          >
            My Bookings
          </Link>

          <Link
            to="/dashboard"
            className="font-medium text-slate-500 hover:text-green-700"
          >
            Dashboard
          </Link>

        </div>
      </div>
    </main>
  );
}

/*
 * ---------------------------------------
 * DETAIL ROW
 * ---------------------------------------
 */

function DetailRow({
  label,
  value,
  highlight = false,
  last = false,
}) {
  return (
    <div
      className={`px-5 py-4 ${
        !last ? "border-b border-slate-100" : ""
      }`}
    >
      <p className="text-[11px] font-medium text-slate-500">
        {label}
      </p>

      <p
        className={`mt-1 text-sm font-semibold ${
          highlight
            ? "text-green-700"
            : "text-[#10233f]"
        }`}
      >
        {value ?? "—"}
      </p>
    </div>
  );
}

/*
 * ---------------------------------------
 * FORMAT DATE
 * ---------------------------------------
 */

function formatDate(date) {
  if (!date) return "Date not available";

  const parsedDate = new Date(`${date}T00:00:00`);

  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  return parsedDate.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/*
 * ---------------------------------------
 * FORMAT TIME
 * ---------------------------------------
 */

function formatTime(time) {
  if (!time) return "";

  const [hours, minutes] = time.split(":");

  const date = new Date();

  date.setHours(
    Number(hours),
    Number(minutes),
    0,
    0
  );

  return date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}