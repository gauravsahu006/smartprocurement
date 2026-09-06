import { useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
    ArrowLeft,
    CalendarDays,
    CheckCircle2,
    Clock3,
    MapPin,
    Users,
} from "lucide-react";

const centres = {
    1: {
        name: "ABC Procurement Centre",
        address: "Main Road, Ranchi",
        distance: "5.2 km",
        queue: 12,
        waitTime: "35 min",
        capacity: 70,
    },
    2: {
        name: "Krishi Seva Kendra",
        address: "Kanke Road, Ranchi",
        distance: "2.1 km",
        queue: 8,
        waitTime: "60 min",
        capacity: 70,
    },
    3: {
        name: "Green Field Centre",
        address: "Tupudana, Ranchi",
        distance: "7.8 km",
        queue: 8,
        waitTime: "20 min",
        capacity: 60,
    },
    4: {
        name: "Shakti Kendra",
        address: "Harmu Road, Ranchi",
        distance: "9.5 km",
        queue: 15,
        waitTime: "45 min",
        capacity: 66,
    },
};

const slots = [
    {
        time: "09:00 AM - 10:00 AM",
        available: 12,
    },
    {
        time: "10:00 AM - 11:00 AM",
        available: 8,
    },
    {
        time: "11:00 AM - 12:00 PM",
        available: 15,
    },
    {
        time: "12:00 PM - 01:00 PM",
        available: 5,
    },
    {
        time: "02:00 PM - 03:00 PM",
        available: 10,
    },
    {
        time: "03:00 PM - 04:00 PM",
        available: 7,
    },
];

function getDate(daysFromToday) {
    const date = new Date();

    date.setDate(date.getDate() + daysFromToday);

    return date;
}

function formatDate(date) {
    return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
    });
}

function getDay(date) {
    return date.toLocaleDateString("en-IN", {
        weekday: "short",
    });
}

export default function Booking() {
    const navigate = useNavigate();
    const location = useLocation();

    const params = new URLSearchParams(location.search);
    const centreId = params.get("centre") || "1";

    const centre = centres[centreId] || centres[1];

    const dates = useMemo(() => {
        return Array.from({ length: 7 }, (_, index) => getDate(index));
    }, []);

    const [selectedDate, setSelectedDate] = useState(
        dates[0].toISOString().split("T")[0]
    );

    const [selectedSlot, setSelectedSlot] = useState("");

    const [error, setError] = useState("");

    const handleConfirm = () => {
        if (!selectedDate) {
            setError("Please select a date.");
            return;
        }

        if (!selectedSlot) {
            setError("Please select a time slot.");
            return;
        }

        setError("");

        const selectedSlotData = slots.find(
            (slot) => slot.time === selectedSlot
        );

        navigate("/booking-confirmation", {
            state: {
                centreId,
                date: selectedDate,
                slot: selectedSlot,
                available: selectedSlotData?.available || 0,

                crop: "Wheat",
                quantity: "48.5 Quintal",
                token: "124",
                queuePosition: "12",
                waitTime: centre.waitTime,
            },
        });
    };

    return (
        <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="mb-6">
                <Link
                    to={`/recommendations?centre=${centreId}`}
                    className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-green-700"
                >
                    <ArrowLeft size={17} />
                    Back to Recommendations
                </Link>

                <h1 className="text-2xl font-bold text-[#10233f] sm:text-3xl">
                    Book Procurement Slot
                </h1>

                <p className="mt-1 text-sm text-slate-500">
                    Select a convenient date and time for your procurement visit.
                </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-[330px_1fr]">
                {/* Centre Summary */}
                <section className="h-fit rounded-xl border border-slate-200 bg-white p-5">
                    <div className="mb-5">
                        <p className="text-xs font-semibold uppercase tracking-wide text-green-700">
                            Selected Centre
                        </p>

                        <h2 className="mt-1 text-xl font-bold text-[#10233f]">
                            {centre.name}
                        </h2>
                    </div>

                    <div className="space-y-4">
                        <div className="flex gap-3">
                            <div className="rounded-lg bg-green-50 p-2 text-green-700">
                                <MapPin size={18} />
                            </div>

                            <div>
                                <p className="text-xs text-slate-500">Location</p>
                                <p className="text-sm font-medium text-slate-700">
                                    {centre.address}
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
                                <Clock3 size={18} />
                            </div>

                            <div>
                                <p className="text-xs text-slate-500">Estimated Wait</p>
                                <p className="text-sm font-medium text-slate-700">
                                    {centre.waitTime}
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <div className="rounded-lg bg-orange-50 p-2 text-orange-600">
                                <Users size={18} />
                            </div>

                            <div>
                                <p className="text-xs text-slate-500">Current Queue</p>
                                <p className="text-sm font-medium text-slate-700">
                                    {centre.queue} farmers
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 border-t border-slate-100 pt-5">
                        <div className="mb-2 flex items-center justify-between">
                            <span className="text-sm font-medium text-slate-600">
                                Capacity
                            </span>

                            <span className="text-sm font-semibold text-green-700">
                                {centre.capacity}%
                            </span>
                        </div>

                        <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                            <div
                                className="h-full rounded-full bg-green-600"
                                style={{ width: `${centre.capacity}%` }}
                            />
                        </div>

                        <p className="mt-2 text-xs text-slate-500">
                            Good availability for booking.
                        </p>
                    </div>
                </section>

                {/* Booking Section */}
                <section className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6">
                    {/* Date */}
                    <div>
                        <div className="mb-4 flex items-center gap-2">
                            <CalendarDays className="text-green-700" size={20} />

                            <h2 className="text-lg font-bold text-[#10233f]">
                                Select Date
                            </h2>
                        </div>

                        <div className="grid grid-cols-4 gap-2 sm:grid-cols-7">
                            {dates.map((date) => {
                                const value = date.toISOString().split("T")[0];
                                const isSelected = selectedDate === value;

                                return (
                                    <button
                                        key={value}
                                        type="button"
                                        onClick={() => {
                                            setSelectedDate(value);
                                            setError("");
                                        }}
                                        className={`rounded-lg border px-2 py-3 text-center transition ${isSelected
                                            ? "border-green-600 bg-green-600 text-white"
                                            : "border-slate-200 bg-white text-slate-700 hover:border-green-400 hover:bg-green-50"
                                            }`}
                                    >
                                        <span className="block text-xs font-medium">
                                            {getDay(date)}
                                        </span>

                                        <span className="mt-1 block text-sm font-bold">
                                            {formatDate(date)}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Slots */}
                    <div className="mt-8">
                        <div className="mb-4 flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-bold text-[#10233f]">
                                    Available Time Slots
                                </h2>

                                <p className="mt-1 text-xs text-slate-500">
                                    Choose one available slot for your visit.
                                </p>
                            </div>

                            <span className="hidden rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700 sm:block">
                                {slots.length} slots available
                            </span>
                        </div>

                        <div className="grid gap-3 sm:grid-cols-2">
                            {slots.map((slot) => {
                                const isSelected = selectedSlot === slot.time;
                                const isLow = slot.available <= 5;

                                return (
                                    <button
                                        key={slot.time}
                                        type="button"
                                        onClick={() => {
                                            setSelectedSlot(slot.time);
                                            setError("");
                                        }}
                                        className={`flex items-center justify-between rounded-lg border p-4 text-left transition ${isSelected
                                            ? "border-green-600 bg-green-50 ring-1 ring-green-600"
                                            : "border-slate-200 bg-white hover:border-green-400 hover:bg-slate-50"
                                            }`}
                                    >
                                        <div>
                                            <p className="text-sm font-semibold text-slate-800">
                                                {slot.time}
                                            </p>

                                            <p
                                                className={`mt-1 text-xs font-medium ${isLow ? "text-orange-600" : "text-green-600"
                                                    }`}
                                            >
                                                {slot.available} slots available
                                            </p>
                                        </div>

                                        {isSelected && (
                                            <CheckCircle2
                                                size={21}
                                                className="shrink-0 text-green-600"
                                            />
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                            {error}
                        </div>
                    )}

                    {/* Summary */}
                    <div className="mt-8 rounded-xl bg-slate-50 p-4">
                        <h3 className="text-sm font-bold text-[#10233f]">
                            Booking Summary
                        </h3>

                        <div className="mt-3 grid gap-3 text-sm sm:grid-cols-3">
                            <div>
                                <p className="text-xs text-slate-500">Centre</p>
                                <p className="font-medium text-slate-700">
                                    {centre.name}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs text-slate-500">Date</p>
                                <p className="font-medium text-slate-700">
                                    {selectedDate
                                        ? new Date(`${selectedDate}T00:00:00`).toLocaleDateString(
                                            "en-IN",
                                            {
                                                day: "2-digit",
                                                month: "short",
                                                year: "numeric",
                                            }
                                        )
                                        : "Not selected"}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs text-slate-500">Time</p>
                                <p className="font-medium text-slate-700">
                                    {selectedSlot || "Not selected"}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Confirm */}
                    <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                        <Link
                            to={`/recommendations?centre=${centreId}`}
                            className="rounded-lg border border-slate-200 px-5 py-3 text-center text-sm font-semibold text-slate-600 hover:bg-slate-50"
                        >
                            Cancel
                        </Link>

                        <button
                            type="button"
                            onClick={handleConfirm}
                            className="rounded-lg bg-green-700 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-green-800"
                        >
                            Confirm Slot
                        </button>
                    </div>
                </section>
            </div>
        </main>
    );
}