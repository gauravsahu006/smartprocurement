import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Check,
  Circle,
  Clock3,
  FileCheck2,
  Scale,
  CreditCard,
  MapPin,
  PackageCheck,
} from "lucide-react";

const steps = [
  {
    title: "Booking Confirmed",
    description: "Your procurement slot has been confirmed.",
    time: "09:15 AM",
    completed: true,
    icon: Check,
  },
  {
    title: "Reached Centre",
    description: "Farmer has reached the procurement centre.",
    time: "10:42 AM",
    completed: true,
    icon: MapPin,
  },
  {
    title: "Token Called",
    description: "Your token has been called for procurement.",
    time: "10:48 AM",
    completed: true,
    icon: PackageCheck,
  },
  {
    title: "Quality Check",
    description: "Produce quality is being verified.",
    time: "In progress",
    current: true,
    icon: FileCheck2,
  },
  {
    title: "Weighing",
    description: "Produce will be weighed after quality verification.",
    time: "Pending",
    icon: Scale,
  },
  {
    title: "Payment Initiated",
    description: "Payment will be initiated after final approval.",
    time: "Pending",
    icon: CreditCard,
  },
  {
    title: "Completed",
    description: "Procurement and payment process completed.",
    time: "Pending",
    icon: Check,
  },
];

export default function ProcurementStatus() {
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

            <span className="flex w-fit items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700">
              <span className="h-2 w-2 animate-pulse rounded-full bg-blue-600" />
              Quality Check in Progress
            </span>
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-[1fr_330px]">
          {/* Status Timeline */}
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
              {/* Timeline Line */}
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

          {/* Booking Summary */}
          <div className="space-y-5">
            <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-green-700">
                    Booking
                  </p>

                  <h2 className="mt-1 text-base font-bold text-[#10233f]">
                    #SP241124
                  </h2>
                </div>

                <span className="rounded-full bg-green-50 px-2.5 py-1 text-[10px] font-semibold text-green-700">
                  Active
                </span>
              </div>

              <div className="space-y-4">
                <SummaryItem
                  label="Centre"
                  value="ABC Procurement Centre"
                  icon={MapPin}
                />

                <SummaryItem
                  label="Token Number"
                  value="#124"
                  icon={PackageCheck}
                />

                <SummaryItem
                  label="Booking Date"
                  value="06 Sep 2026"
                  icon={Clock3}
                />

                <SummaryItem
                  label="Time Slot"
                  value="03:00 PM - 04:00 PM"
                  icon={Clock3}
                />
              </div>
            </section>

            {/* Produce Details */}
            <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-base font-bold text-[#10233f]">
                Produce Details
              </h2>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <SmallStat
                  label="Crop"
                  value="Wheat"
                />

                <SmallStat
                  label="Quantity"
                  value="48.5 Qtl"
                />

                <SmallStat
                  label="Queue Position"
                  value="#12"
                />

                <SmallStat
                  label="Wait Time"
                  value="35 min"
                />
              </div>
            </section>

            {/* Current Status */}
            <section className="rounded-xl border border-blue-100 bg-blue-50 p-5">
              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-white p-2 text-blue-600 shadow-sm">
                  <FileCheck2 size={19} />
                </div>

                <div>
                  <p className="text-xs font-semibold text-blue-700">
                    Current Status
                  </p>

                  <h3 className="mt-1 text-sm font-bold text-[#10233f]">
                    Quality Check in Progress
                  </h3>

                  <p className="mt-1 text-xs leading-5 text-slate-600">
                    Your produce is currently being inspected. The
                    weighing process will start after quality approval.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* Quality Check Details */}
        <section className="mt-5 rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="text-base font-bold text-[#10233f]">
                Quality Check
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Inspection details will be updated by the procurement
                centre.
              </p>
            </div>

            <span className="flex w-fit items-center gap-2 rounded-full bg-orange-50 px-3 py-1.5 text-[10px] font-semibold text-orange-700">
              <Clock3 size={13} />
              In Progress
            </span>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <ProcessCard
              title="Moisture"
              value="Pending"
            />

            <ProcessCard
              title="Grade"
              value="Pending"
            />

            <ProcessCard
              title="Quality Result"
              value="Awaiting Inspection"
            />
          </div>
        </section>

        {/* Information */}
        <div className="mt-5 rounded-xl border border-green-100 bg-green-50 p-4">
          <div className="flex gap-3">
            <div className="mt-0.5 shrink-0">
              <Check
                size={17}
                className="text-green-700"
              />
            </div>

            <div>
              <p className="text-xs font-semibold text-green-800">
                What happens next?
              </p>

              <p className="mt-1 text-xs leading-5 text-slate-600">
                Once the quality check is approved, your produce will
                be weighed. After final approval, the payment process
                will be initiated automatically.
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