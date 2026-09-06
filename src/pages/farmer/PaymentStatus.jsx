import { Link } from "react-router-dom";
import {
  Check,
  Download,
  IndianRupee,
  Info,
} from "lucide-react";

function PaymentStatus() {
  return (
    <div className="space-y-5 p-8">
      {/* Page Header */}
      <div>
        <h1 className="text-xl font-bold text-[#10233f]">
          Payment Status
        </h1>

        <p className="mt-1 text-xs text-slate-500">
          Track your payment details and history.
        </p>
      </div>

      {/* Payment Top Section */}
      <div className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
        {/* Payment Details */}
        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <h2 className="mb-4 text-sm font-bold text-[#10233f]">
            Payment Details
          </h2>

          <div className="space-y-3">
            <div className="grid grid-cols-[125px_1fr] gap-3 text-xs">
              <span className="text-slate-500">
                Centre Name
              </span>

              <span className="font-semibold text-slate-800">
                ABC Procurement Centre
              </span>
            </div>

            <div className="grid grid-cols-[125px_1fr] gap-3 text-xs">
              <span className="text-slate-500">
                Crop
              </span>

              <span className="font-semibold text-slate-800">
                Wheat
              </span>
            </div>

            <div className="grid grid-cols-[125px_1fr] gap-3 text-xs">
              <span className="text-slate-500">
                Quantity
              </span>

              <span className="font-semibold text-slate-800">
                48.5 Quintal
              </span>
            </div>

            <div className="grid grid-cols-[125px_1fr] gap-3 text-xs">
              <span className="text-slate-500">
                Rate (Per Quintal)
              </span>

              <span className="font-semibold text-slate-800">
                ₹ 2,125
              </span>
            </div>

            <div className="grid grid-cols-[125px_1fr] gap-3 text-xs">
              <span className="text-slate-500">
                Total Amount
              </span>

              <span className="font-semibold text-slate-800">
                ₹ 1,03,062.50
              </span>
            </div>

            <div className="grid grid-cols-[125px_1fr] gap-3 text-xs">
              <span className="text-slate-500">
                Payment Method
              </span>

              <span className="font-semibold text-slate-800">
                Bank Transfer (UPI)
              </span>
            </div>

            <div className="grid grid-cols-[125px_1fr] gap-3 text-xs">
              <span className="text-slate-500">
                Transaction ID
              </span>

              <span className="font-semibold text-slate-800">
                TXN123456789
              </span>
            </div>

            <div className="grid grid-cols-[125px_1fr] gap-3 text-xs">
              <span className="text-slate-500">
                Payment Date
              </span>

              <span className="font-semibold text-slate-800">
                05 Sep 2026, 11:30 AM
              </span>
            </div>
          </div>
        </div>

        {/* Payment Successful */}
        <div className="flex flex-col items-center justify-center rounded-lg border border-green-100 bg-green-50/60 p-6 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-600 text-white">
            <Check size={28} strokeWidth={3} />
          </div>

          <h2 className="mt-3 text-sm font-bold text-green-800">
            Payment Successful!
          </h2>

          <div className="mt-2 flex items-center text-xl font-bold text-green-700">
            <IndianRupee size={18} />
            1,03,062.50
          </div>

          <p className="mt-1 text-xs text-slate-500">
            has been transferred successfully.
          </p>

          <button
            type="button"
            onClick={() => window.print()}
            className="mt-5 inline-flex w-full max-w-[180px] items-center justify-center gap-2 rounded-md bg-[#087f3e] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#066b34]"
          >
            <Download size={15} />
            Download Receipt
          </button>
        </div>
      </div>

      {/* Payment History */}
      <div>
        <h2 className="mb-3 text-sm font-bold text-[#10233f]">
          Payment History
        </h2>

        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
          <div className="hidden grid-cols-[1.1fr_1fr_1.2fr_1.2fr_0.7fr] border-b border-slate-200 bg-slate-50 px-4 py-3 text-xs font-semibold text-slate-600 md:grid">
            <span>Date</span>
            <span>Amount (₹)</span>
            <span>Method</span>
            <span>Transaction ID</span>
            <span>Status</span>
          </div>

          <div className="grid gap-3 px-4 py-4 text-xs md:grid-cols-[1.1fr_1fr_1.2fr_1.2fr_0.7fr] md:items-center md:gap-0">
            <div>
              <p className="font-semibold text-slate-800 md:hidden">
                Date
              </p>
              <span className="text-slate-600">
                05 Sep 2026, 11:30 AM
              </span>
            </div>

            <div>
              <p className="font-semibold text-slate-800 md:hidden">
                Amount
              </p>
              <span className="font-semibold text-slate-800">
                1,03,062.50
              </span>
            </div>

            <div>
              <p className="font-semibold text-slate-800 md:hidden">
                Method
              </p>
              <span className="text-slate-600">
                Bank Transfer (UPI)
              </span>
            </div>

            <div>
              <p className="font-semibold text-slate-800 md:hidden">
                Transaction ID
              </p>
              <span className="text-slate-600">
                TXN123456789
              </span>
            </div>

            <div>
              <p className="font-semibold text-slate-800 md:hidden">
                Status
              </p>

              <span className="inline-flex w-fit items-center rounded-md border border-green-200 bg-green-50 px-3 py-1 text-[11px] font-semibold text-green-700">
                Success
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Information Note */}
      <div className="flex items-start gap-3 rounded-lg border border-blue-100 bg-blue-50 px-4 py-3">
        <Info
          size={17}
          className="mt-0.5 shrink-0 text-blue-600"
        />

        <div>
          <p className="text-xs font-semibold text-blue-900">
            Payment Information
          </p>

          <p className="mt-1 text-xs leading-5 text-blue-700">
            Your payment has been successfully transferred through
            the registered payment method. Keep the transaction ID
            for future reference.
          </p>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <Link
          to="/procurement"
          className="rounded-md border border-slate-200 bg-white px-5 py-2.5 text-center text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          View Procurement Status
        </Link>

        <Link
          to="/dashboard"
          className="rounded-md bg-[#087f3e] px-5 py-2.5 text-center text-xs font-semibold text-white transition hover:bg-[#066b34]"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}

export default PaymentStatus;