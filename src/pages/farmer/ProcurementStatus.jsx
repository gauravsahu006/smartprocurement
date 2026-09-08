import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Check,
  Clock3,
  FileCheck2,
  Scale,
  CreditCard,
  MapPin,
  PackageCheck,
} from "lucide-react";
import { supabase } from "../../lib/supabase";

export default function ProcurementStatus() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [booking, setBooking] = useState(null);
  const [procurement, setProcurement] = useState(null);
  const [weighment, setWeighment] = useState(null);
  const [quality, setQuality] = useState(null);
  const [payment, setPayment] = useState(null);

  useEffect(() => {
    fetchProcurementStatus();
  }, []);

  async function fetchProcurementStatus() {
    try {
      setLoading(true);
      setError("");

      // 1. Logged-in farmer
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) throw userError;

      if (!user) {
        throw new Error("Please login first.");
      }

      // 2. Latest relevant booking
      const { data: bookingData, error: bookingError } = await supabase
        .from("bookings")
        .select("*")
        .eq("farmer_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (bookingError) throw bookingError;

      if (!bookingData) {
        setBooking(null);
        return;
      }

      // 3. Centre
      const { data: centreData, error: centreError } = await supabase
        .from("centres")
        .select("*")
        .eq("id", bookingData.centre_id)
        .maybeSingle();

      if (centreError) throw centreError;

      // 4. Crop
      const { data: cropData, error: cropError } = await supabase
        .from("crops")
        .select("*")
        .eq("id", bookingData.crop_id)
        .maybeSingle();

      if (cropError) throw cropError;

      // 5. Time slot
      const { data: slotData, error: slotError } = await supabase
        .from("time_slots")
        .select("*")
        .eq("id", bookingData.slot_id)
        .maybeSingle();

      if (slotError) throw slotError;

      // 6. Queue entry
      const { data: queueData, error: queueError } = await supabase
        .from("queue_entries")
        .select("*")
        .eq("booking_id", bookingData.id)
        .maybeSingle();

      if (queueError) throw queueError;

      // 7. Procurement
      const { data: procurementData, error: procurementError } =
        await supabase
          .from("procurements")
          .select("*")
          .eq("booking_id", bookingData.id)
          .maybeSingle();

      if (procurementError) throw procurementError;

      let weighmentData = null;
      let qualityData = null;
      let paymentData = null;

      // 8. Weighment
      if (procurementData) {
        const { data, error } = await supabase
          .from("weighments")
          .select("*")
          .eq("procurement_id", procurementData.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        if (error) throw error;

        weighmentData = data;
      }

      // 9. Quality
      if (procurementData) {
        const { data, error } = await supabase
          .from("quality_checks")
          .select("*")
          .eq("procurement_id", procurementData.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        if (error) throw error;

        qualityData = data;
      }

      // 10. Payment
      if (procurementData) {
        const { data, error } = await supabase
          .from("payments")
          .select("*")
          .eq("procurement_id", procurementData.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        if (error) throw error;

        paymentData = data;
      }

      setBooking({
        ...bookingData,
        centre: centreData,
        crop: cropData,
        slot: slotData,
        queue: queueData,
      });

      setProcurement(procurementData);
      setWeighment(weighmentData);
      setQuality(qualityData);
      setPayment(paymentData);
    } catch (err) {
      console.error("Procurement Status Error:", err);
      setError(err.message || "Unable to load procurement status.");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-full bg-[#f8faf9] px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-green-600" />

            <p className="mt-3 text-sm text-slate-500">
              Loading procurement status...
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-full bg-[#f8faf9] px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <Link
            to="/dashboard"
            className="mb-4 inline-flex items-center gap-2 text-xs font-medium text-slate-500 hover:text-green-700"
          >
            <ArrowLeft size={15} />
            Back to Dashboard
          </Link>

          <div className="rounded-xl border border-red-200 bg-red-50 p-5">
            <p className="text-sm font-semibold text-red-700">
              Unable to load procurement status
            </p>

            <p className="mt-1 text-xs text-red-600">
              {error}
            </p>

            <button
              onClick={fetchProcurementStatus}
              className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-xs font-semibold text-white hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </main>
    );
  }

  if (!booking) {
    return (
      <main className="min-h-full bg-[#f8faf9] px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <Link
            to="/dashboard"
            className="mb-4 inline-flex items-center gap-2 text-xs font-medium text-slate-500 hover:text-green-700"
          >
            <ArrowLeft size={15} />
            Back to Dashboard
          </Link>

          <div className="rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <PackageCheck className="mx-auto text-slate-400" size={40} />

            <h2 className="mt-3 text-base font-bold text-[#10233f]">
              No Procurement Found
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              You don't have any booking yet.
            </p>

            <Link
              to="/booking"
              className="mt-5 inline-block rounded-lg bg-green-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-green-800"
            >
              Book a Slot
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const steps = buildSteps({
    booking,
    procurement,
    weighment,
    quality,
    payment,
  });

  const currentStep = steps.find((step) => step.current);

  const currentStatus = currentStep
    ? currentStep.title
    : "Procurement Completed";

  const isCompleted =
    booking.status === "completed" ||
    procurement?.status === "completed";

  return (
    <main className="min-h-full bg-[#f8faf9] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-5">
          <Link
            to="/dashboard"
            className="mb-3 inline-flex items-center gap-2 text-xs font-medium text-slate-500 transition hover:text-green-700"
          >
            <ArrowLeft size={15} />
            Back to Dashboard
          </Link>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-xl font-bold text-[#10233f] sm:text-2xl">
                Procurement Status
              </h1>

              <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                Track your produce procurement process step by step.
              </p>
            </div>

            <span
              className={`flex w-fit items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${
                isCompleted
                  ? "bg-green-50 text-green-700"
                  : "bg-blue-50 text-blue-700"
              }`}
            >
              <span
                className={`h-2 w-2 rounded-full ${
                  isCompleted
                    ? "bg-green-600"
                    : "animate-pulse bg-blue-600"
                }`}
              />

              {isCompleted ? "Procurement Completed" : currentStatus}
            </span>
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-[1fr_330px]">
          {/* Timeline */}
          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-6 border-b border-slate-100 pb-4">
              <h2 className="text-base font-bold text-[#10233f]">
                Procurement Journey
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Current progress of your procurement request.
              </p>
            </div>

            <div className="relative">
              <div className="absolute bottom-7 left-[17px] top-7 w-px bg-slate-200" />

              <div className="space-y-6">
                {steps.map((step, index) => (
                  <StatusStep
                    key={step.title}
                    step={step}
                    index={index}
                  />
                ))}
              </div>
            </div>
          </section>

          {/* Summary */}
          <div className="space-y-5">
            <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-green-700">
                    Booking
                  </p>

                  <h2 className="mt-1 text-base font-bold text-[#10233f]">
                    #{booking.id}
                  </h2>
                </div>

                <span
                  className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${
                    booking.status === "completed"
                      ? "bg-green-50 text-green-700"
                      : booking.status === "cancelled"
                      ? "bg-red-50 text-red-700"
                      : "bg-blue-50 text-blue-700"
                  }`}
                >
                  {formatBookingStatus(booking.status)}
                </span>
              </div>

              <div className="space-y-4">
                <SummaryItem
                  label="Centre"
                  value={booking.centre?.name || "—"}
                  icon={MapPin}
                />

                <SummaryItem
                  label="Token Number"
                  value={
                    booking.queue?.token_number
                      ? `#${booking.queue.token_number}`
                      : "Not assigned"
                  }
                  icon={PackageCheck}
                />

                <SummaryItem
                  label="Booking Date"
                  value={formatDate(booking.booking_date)}
                  icon={Clock3}
                />

                <SummaryItem
                  label="Time Slot"
                  value={formatSlot(booking.slot)}
                  icon={Clock3}
                />
              </div>
            </section>

            {/* Produce */}
            <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-base font-bold text-[#10233f]">
                Produce Details
              </h2>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <SmallStat
                  label="Crop"
                  value={
                    booking.crop?.name ||
                    booking.crop?.crop_name ||
                    "—"
                  }
                />

                <SmallStat
                  label="Quantity"
                  value={
                    booking.quantity
                      ? `${booking.quantity} Qtl`
                      : "Not recorded"
                  }
                />

                <SmallStat
                  label="Queue Position"
                  value={
                    booking.queue?.queue_position
                      ? `#${booking.queue.queue_position}`
                      : "—"
                  }
                />

                <SmallStat
                  label="Wait Time"
                  value="Live Queue"
                />
              </div>
            </section>

            {/* Current Status */}
            <section
              className={`rounded-xl border p-5 ${
                isCompleted
                  ? "border-green-100 bg-green-50"
                  : "border-blue-100 bg-blue-50"
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`rounded-lg bg-white p-2 shadow-sm ${
                    isCompleted
                      ? "text-green-600"
                      : "text-blue-600"
                  }`}
                >
                  {isCompleted ? (
                    <Check size={19} />
                  ) : (
                    <FileCheck2 size={19} />
                  )}
                </div>

                <div>
                  <p
                    className={`text-xs font-semibold ${
                      isCompleted
                        ? "text-green-700"
                        : "text-blue-700"
                    }`}
                  >
                    Current Status
                  </p>

                  <h3 className="mt-1 text-sm font-bold text-[#10233f]">
                    {currentStatus}
                  </h3>

                  <p className="mt-1 text-xs leading-5 text-slate-600">
                    {getCurrentDescription({
                      procurement,
                      weighment,
                      quality,
                      payment,
                      isCompleted,
                    })}
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* Quality Check */}
        <section className="mt-5 rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="text-base font-bold text-[#10233f]">
                Quality Check
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Inspection details updated by the procurement centre.
              </p>
            </div>

            <span
              className={`flex w-fit items-center gap-2 rounded-full px-3 py-1.5 text-[10px] font-semibold ${
                quality
                  ? quality.result === "rejected"
                    ? "bg-red-50 text-red-700"
                    : "bg-green-50 text-green-700"
                  : "bg-orange-50 text-orange-700"
              }`}
            >
              <Clock3 size={13} />

              {quality
                ? quality.result === "rejected"
                  ? "Rejected"
                  : "Completed"
                : "Pending"}
            </span>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <ProcessCard
              title="Moisture"
              value={
                quality?.moisture !== null &&
                quality?.moisture !== undefined
                  ? `${quality.moisture}%`
                  : "Pending"
              }
            />

            <ProcessCard
              title="Grade"
              value={
                quality?.quality ||
                quality?.grade ||
                "Pending"
              }
            />

            <ProcessCard
              title="Quality Result"
              value={
                quality
                  ? quality.result ||
                    quality.status ||
                    quality.quality ||
                    "Completed"
                  : "Awaiting Inspection"
              }
            />
          </div>
        </section>

        {/* Weighment */}
        {weighment && (
          <section className="mt-5 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-base font-bold text-[#10233f]">
              Weighment Details
            </h2>

            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
              <ProcessCard
                title="Actual Quantity"
                value={
                  weighment.quantity !== null &&
                  weighment.quantity !== undefined
                    ? `${weighment.quantity} Qtl`
                    : "—"
                }
              />

              <ProcessCard
                title="Unit"
                value={weighment.unit || "Quintal"}
              />

              <ProcessCard
                title="Weighed At"
                value={formatDateTime(weighment.created_at)}
              />
            </div>
          </section>
        )}

        {/* Payment */}
        {payment && (
          <section className="mt-5 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-green-50 p-2 text-green-700">
                <CreditCard size={18} />
              </div>

              <div>
                <h2 className="text-base font-bold text-[#10233f]">
                  Payment
                </h2>

                <p className="text-xs text-slate-500">
                  Payment information from the procurement centre.
                </p>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <ProcessCard
                title="Amount"
                value={
                  payment.total_amount !== null &&
                  payment.total_amount !== undefined
                    ? `₹${Number(payment.total_amount).toLocaleString(
                        "en-IN"
                      )}`
                    : "—"
                }
              />

              <ProcessCard
                title="Status"
                value={payment.status || "Pending"}
              />

              <ProcessCard
                title="Method"
                value={
                  payment.payment_method ||
                  payment.method ||
                  "—"
                }
              />

              <ProcessCard
                title="Transaction ID"
                value={payment.transaction_id || "—"}
              />
            </div>
          </section>
        )}

        {/* Information */}
        <div className="mt-5 rounded-xl border border-green-100 bg-green-50 p-4">
          <div className="flex gap-3">
            <div className="mt-0.5 shrink-0">
              <Check size={17} className="text-green-700" />
            </div>

            <div>
              <p className="text-xs font-semibold text-green-800">
                What happens next?
              </p>

              <p className="mt-1 text-xs leading-5 text-slate-600">
                {isCompleted
                  ? "Your procurement and payment process has been completed successfully."
                  : "The procurement centre will update each stage as your produce moves through weighing, quality verification, payment and completion."}
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <Link
            to="/queue"
            className="rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-center text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            View Live Queue
          </Link>

          <Link
            to="/payment"
            className="rounded-lg bg-green-700 px-5 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-green-800"
          >
            View Payment Status
          </Link>
        </div>
      </div>
    </main>
  );
}

/* ---------------- STATUS LOGIC ---------------- */

function buildSteps({
  booking,
  procurement,
  weighment,
  quality,
  payment,
}) {
  const bookingDone =
    booking.status === "confirmed" ||
    booking.status === "checked_in" ||
    booking.status === "processing" ||
    booking.status === "completed" ||
    !!procurement;

  const reachedCentre =
    booking.status === "checked_in" ||
    booking.status === "processing" ||
    booking.status === "completed" ||
    !!procurement;

  const tokenCalled =
    booking.status === "called" ||
    booking.status === "processing" ||
    booking.status === "completed" ||
    !!procurement ||
    booking.queue?.status === "called" ||
    booking.queue?.status === "processing" ||
    booking.queue?.status === "completed";

  const weighingDone = !!weighment;

  const qualityDone = !!quality;

  const paymentDone =
    payment?.status === "successful" ||
    payment?.status === "completed";

  const completed =
    booking.status === "completed" ||
    procurement?.status === "completed";

  let currentTitle = "";

  if (completed) {
    currentTitle = "Completed";
  } else if (paymentDone) {
    currentTitle = "Completed";
  } else if (payment) {
    currentTitle = "Payment Initiated";
  } else if (qualityDone) {
    currentTitle = "Payment Initiated";
  } else if (weighingDone) {
    currentTitle = "Quality Check";
  } else if (
    procurement?.status === "weighing" ||
    procurement?.status === "processing"
  ) {
    currentTitle = "Weighing";
  } else if (tokenCalled) {
    currentTitle = "Quality Check";
  } else if (reachedCentre) {
    currentTitle = "Token Called";
  } else {
    currentTitle = "Booking Confirmed";
  }

  return [
    {
      title: "Booking Confirmed",
      description:
        "Your procurement slot has been confirmed.",
      completed: bookingDone,
      current: currentTitle === "Booking Confirmed",
      time: formatDateTime(booking.created_at),
      icon: Check,
    },
    {
      title: "Reached Centre",
      description:
        "Farmer has reached the procurement centre.",
      completed: reachedCentre,
      current: currentTitle === "Reached Centre",
      time: reachedCentre ? "Completed" : "Pending",
      icon: MapPin,
    },
    {
      title: "Token Called",
      description:
        "Your token has been called for procurement.",
      completed: tokenCalled,
      current: currentTitle === "Token Called",
      time: tokenCalled ? "Called" : "Pending",
      icon: PackageCheck,
    },
    {
      title: "Quality Check",
      description:
        "Produce quality is being verified.",
      completed: qualityDone,
      current: currentTitle === "Quality Check",
      time: qualityDone
        ? "Completed"
        : currentTitle === "Quality Check"
        ? "In progress"
        : "Pending",
      icon: FileCheck2,
    },
    {
      title: "Weighing",
      description:
        "Produce is weighed at the procurement centre.",
      completed: weighingDone,
      current: currentTitle === "Weighing",
      time: weighingDone ? "Completed" : "Pending",
      icon: Scale,
    },
    {
      title: "Payment Initiated",
      description:
        "Payment is initiated after final approval.",
      completed: !!payment,
      current: currentTitle === "Payment Initiated",
      time: payment
        ? payment.status || "Initiated"
        : "Pending",
      icon: CreditCard,
    },
    {
      title: "Completed",
      description:
        "Procurement and payment process completed.",
      completed: completed || paymentDone,
      current: currentTitle === "Completed",
      time:
        completed || paymentDone
          ? "Completed"
          : "Pending",
      icon: Check,
    },
  ];
}

/* ---------------- HELPERS ---------------- */

function formatBookingStatus(status) {
  const map = {
    pending: "Pending",
    confirmed: "Confirmed",
    checked_in: "Checked In",
    called: "Called",
    processing: "Processing",
    completed: "Completed",
    cancelled: "Cancelled",
  };

  return map[status] || status || "Unknown";
}

function formatDate(date) {
  if (!date) return "—";

  return new Date(`${date}T00:00:00`).toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
}

function formatDateTime(date) {
  if (!date) return "—";

  return new Date(date).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatSlot(slot) {
  if (!slot) return "—";

  const start =
    slot.start_time?.slice(0, 5) ||
    slot.startTime?.slice(0, 5);

  const end =
    slot.end_time?.slice(0, 5) ||
    slot.endTime?.slice(0, 5);

  if (!start || !end) return "—";

  return `${formatTime(start)} - ${formatTime(end)}`;
}

function formatTime(time) {
  const [hour, minute] = time.split(":");

  const date = new Date();
  date.setHours(Number(hour), Number(minute), 0, 0);

  return date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getCurrentDescription({
  procurement,
  weighment,
  quality,
  payment,
  isCompleted,
}) {
  if (isCompleted) {
    return "Your produce procurement and payment process has been completed successfully.";
  }

  if (payment) {
    return "Your payment has been initiated by the procurement centre.";
  }

  if (quality) {
    return "Quality verification is complete. The payment process can now proceed.";
  }

  if (weighment) {
    return "Your produce has been weighed. The quality verification process is the next stage.";
  }

  if (procurement) {
    return "Your produce is currently being processed at the procurement centre.";
  }

  return "Your booking is confirmed. Please follow the live queue for the next stage.";
}

/* ---------------- UI COMPONENTS ---------------- */

function StatusStep({ step }) {
  const Icon = step.icon;

  return (
    <div className="relative flex gap-4">
      <div
        className={`relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
          step.current
            ? "bg-blue-600 text-white ring-4 ring-blue-100"
            : step.completed
            ? "bg-green-600 text-white"
            : "border border-slate-300 bg-white text-slate-400"
        }`}
      >
        <Icon size={16} strokeWidth={2.5} />
      </div>

      <div className="min-w-0 flex-1 pb-1">
        <div className="flex flex-col justify-between gap-1 sm:flex-row">
          <div>
            <h3
              className={`text-sm font-semibold ${
                step.current
                  ? "text-blue-700"
                  : step.completed
                  ? "text-[#10233f]"
                  : "text-slate-500"
              }`}
            >
              {step.title}
            </h3>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              {step.description}
            </p>
          </div>

          <span
            className={`w-fit text-[10px] font-medium ${
              step.current
                ? "text-blue-600"
                : step.completed
                ? "text-green-600"
                : "text-slate-400"
            }`}
          >
            {step.time}
          </span>
        </div>
      </div>
    </div>
  );
}

function SummaryItem({ label, value, icon: Icon }) {
  return (
    <div className="flex items-center gap-3">
      <div className="rounded-lg bg-green-50 p-2 text-green-700">
        <Icon size={16} />
      </div>

      <div className="min-w-0">
        <p className="text-[10px] text-slate-500">
          {label}
        </p>

        <p className="truncate text-xs font-semibold text-[#10233f]">
          {value}
        </p>
      </div>
    </div>
  );
}

function SmallStat({ label, value }) {
  return (
    <div className="rounded-lg border border-slate-100 bg-slate-50 p-3">
      <p className="text-[10px] text-slate-500">
        {label}
      </p>

      <p className="mt-1 text-sm font-bold text-[#10233f]">
        {value}
      </p>
    </div>
  );
}

function ProcessCard({ title, value }) {
  return (
    <div className="rounded-lg border border-slate-200 p-4">
      <p className="text-[10px] font-medium text-slate-500">
        {title}
      </p>

      <p className="mt-2 text-sm font-semibold text-slate-700">
        {value}
      </p>
    </div>
  );
}