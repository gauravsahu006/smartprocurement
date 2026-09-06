import { Link, useLocation } from "react-router-dom";
import {
  ArrowLeft,
  Check,
  Download,
  Info,
  MapPin,
} from "lucide-react";

const centres = {
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

  const centreId = booking.centreId || "1";
  const centre = centres[centreId] || centres[1];

  const bookingDate =
    booking.date ||
    new Date().toISOString().split("T")[0];

  const bookingTime =
    booking.slot || "10:00 AM - 11:00 AM";

  const crop = booking.crop || "Wheat";
  const quantity = booking.quantity || "48.5 Quintal";
  const token = booking.token || "124";
  const queuePosition = booking.queuePosition || "12";
  const waitTime = booking.waitTime || "35 min";

  const formattedDate = new Date(
    `${bookingDate}T00:00:00`
  ).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

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
                value={centre.name}
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
                value={crop}
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
                {centre.name}
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                {centre.address}
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
        {value}
      </p>
    </div>
  );
}