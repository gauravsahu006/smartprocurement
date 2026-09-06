import { useState } from "react";
import { Link } from "react-router-dom";
import {
    CalendarDays,
    CheckCircle2,
    Clock3,
    MapPin,
    Wheat,
    XCircle,
} from "lucide-react";

import centre1 from "../../assets/images/procurement-centre-1.png";
import centre2 from "../../assets/images/procurement-centre-2.png";
import centre3 from "../../assets/images/procurement-centre-3.png";

const bookings = [
    {
        id: 1,
        centre: "ABC Procurement Centre",
        location: "XYZ Village, Ranchi, Jharkhand",
        image: centre1,
        crop: "Wheat",
        date: "05 Sep 2026",
        time: "10:00 AM - 11:00 AM",
        token: "#124",
        status: "Confirmed",
        type: "upcoming",
    },
    {
        id: 2,
        centre: "Krishi Seva Kendra",
        location: "Lohardaga, Jharkhand",
        image: centre2,
        crop: "Wheat",
        date: "10 Sep 2026",
        time: "11:00 AM - 12:00 PM",
        token: "#198",
        status: "Confirmed",
        type: "upcoming",
    },
    {
        id: 3,
        centre: "Green Field Centre",
        location: "Jamshedpur, Jharkhand",
        image: centre3,
        crop: "Maize",
        date: "15 Sep 2026",
        time: "09:00 AM - 10:00 AM",
        token: "#256",
        status: "Pending",
        type: "upcoming",
    },
    {
        id: 4,
        centre: "Shakti Kendra",
        location: "Bokaro, Jharkhand",
        image: centre1,
        crop: "Paddy",
        date: "28 Aug 2026",
        time: "10:00 AM - 11:00 AM",
        token: "#091",
        status: "Completed",
        type: "completed",
    },
    {
        id: 5,
        centre: "ABC Procurement Centre",
        location: "XYZ Village, Ranchi, Jharkhand",
        image: centre1,
        crop: "Wheat",
        date: "18 Aug 2026",
        time: "02:00 PM - 03:00 PM",
        token: "#076",
        status: "Completed",
        type: "completed",
    },
    {
        id: 6,
        centre: "Krishi Seva Kendra",
        location: "Lohardaga, Jharkhand",
        image: centre2,
        crop: "Maize",
        date: "12 Aug 2026",
        time: "09:00 AM - 10:00 AM",
        token: "#064",
        status: "Cancelled",
        type: "cancelled",
    },
];

function MyBookings() {
    const [activeTab, setActiveTab] = useState("upcoming");

    const filteredBookings = bookings.filter(
        (booking) => booking.type === activeTab
    );

    return (
        <div className="space-y-5 p-6">
            {/* Page Header */}
            <div>
                <h1 className="text-xl font-bold text-[#10233f]">
                    My Bookings
                </h1>

                <p className="mt-1 text-xs text-slate-500">
                    View and manage all your bookings.
                </p>
            </div>

            {/* Tabs */}
            <div className="border-b border-slate-200">
                <div className="flex gap-6">
                    <BookingTab
                        label="Upcoming"
                        value="upcoming"
                        activeTab={activeTab}
                        onClick={setActiveTab}
                    />

                    <BookingTab
                        label="Completed"
                        value="completed"
                        activeTab={activeTab}
                        onClick={setActiveTab}
                    />

                    <BookingTab
                        label="Cancelled"
                        value="cancelled"
                        activeTab={activeTab}
                        onClick={setActiveTab}
                    />
                </div>
            </div>

            {/* Booking List */}
            <div className="space-y-3">
                {filteredBookings.map((booking) => (
                    <BookingCard
                        key={booking.id}
                        booking={booking}
                    />
                ))}
            </div>

            {/* Empty State */}
            {filteredBookings.length === 0 && (
                <div className="rounded-lg border border-slate-200 bg-white px-5 py-12 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-50 text-slate-400">
                        <CalendarDays size={22} />
                    </div>

                    <h2 className="mt-3 text-sm font-semibold text-[#10233f]">
                        No {activeTab} bookings
                    </h2>

                    <p className="mt-1 text-xs text-slate-500">
                        Your {activeTab} bookings will appear here.
                    </p>

                    {activeTab === "upcoming" && (
                        <Link
                            to="/centres"
                            className="mt-4 inline-flex rounded-md bg-[#087f3e] px-4 py-2 text-xs font-semibold text-white hover:bg-[#066b34]"
                        >
                            Find Procurement Centre
                        </Link>
                    )}
                </div>
            )}

            {/* Bottom Information */}
            <div className="rounded-lg border border-blue-100 bg-blue-50 px-4 py-3">
                <div className="flex items-start gap-2">
                    <Clock3
                        size={16}
                        className="mt-0.5 shrink-0 text-blue-600"
                    />

                    <p className="text-[11px] leading-5 text-blue-700">
                        Please reach the procurement centre at least 15 minutes
                        before your booked slot and carry your digital token and
                        necessary documents.
                    </p>
                </div>
            </div>
        </div>
    );
}

function BookingTab({
    label,
    value,
    activeTab,
    onClick,
}) {
    const active = activeTab === value;

    return (
        <button
            type="button"
            onClick={() => onClick(value)}
            className={`relative pb-3 text-xs font-semibold transition ${active
                    ? "text-green-700"
                    : "text-slate-500 hover:text-slate-700"
                }`}
        >
            {label}

            {active && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-green-600" />
            )}
        </button>
    );
}

function BookingCard({ booking }) {
    const isCompleted = booking.status === "Completed";
    const isCancelled = booking.status === "Cancelled";

    return (
        <div className="rounded-lg border border-slate-200 bg-white p-3.5 transition hover:border-slate-300">
            <div className="grid gap-4 lg:grid-cols-[125px_1fr_auto] lg:items-center">
                {/* Centre Image */}
                <img
                    src={booking.image}
                    alt={booking.centre}
                    className="h-24 w-full rounded-md object-cover sm:h-28 lg:h-20"
                />

                {/* Booking Details */}
                <div className="min-w-0">
                    <h2 className="text-sm font-bold text-[#10233f]">
                        {booking.centre}
                    </h2>

                    <div className="mt-1 flex items-start gap-1 text-[10px] text-slate-500">
                        <MapPin
                            size={12}
                            className="mt-0.5 shrink-0 text-green-600"
                        />
                        <span>{booking.location}</span>
                    </div>

                    <div className="mt-3 grid gap-2 sm:grid-cols-3">
                        <BookingMeta
                            icon={<Wheat size={12} />}
                            value={booking.crop}
                        />

                        <BookingMeta
                            icon={<CalendarDays size={12} />}
                            value={booking.date}
                        />

                        <BookingMeta
                            icon={<Clock3 size={12} />}
                            value={booking.time}
                        />
                    </div>
                </div>

                {/* Token + Status + Button */}
                <div className="flex flex-col items-stretch gap-3 border-t border-slate-100 pt-3 lg:min-w-[190px] lg:items-end lg:border-t-0 lg:pt-0">
                    <div className="flex w-full items-start justify-between gap-8 lg:justify-end">
                        <div>
                            <p className="text-[9px] text-slate-400">
                                Token Number
                            </p>

                            <p className="mt-0.5 text-lg font-bold text-green-700">
                                {booking.token}
                            </p>
                        </div>

                        <div className="text-right">
                            <p className="text-[9px] text-slate-400">
                                Status
                            </p>

                            <StatusBadge status={booking.status} />
                        </div>
                    </div>

                    <Link
                        to={`/centres/${booking.id}`}
                        className="w-full rounded-md border border-green-600 px-2 py-2 text-center text-[10px] font-semibold text-green-700 transition hover:bg-green-50 sm:w-27.5"
                    >
                        View Details
                    </Link>
                </div>
            </div>
        </div>
    );
}

function BookingMeta({ icon, value }) {
    return (
        <div className="flex items-center gap-1.5 text-[10px] text-slate-600">
            <span className="text-green-600">{icon}</span>
            <span>{value}</span>
        </div>
    );
}

function StatusBadge({ status }) {
    if (status === "Confirmed") {
        return (
            <span className="mt-1 inline-flex items-center gap-1 rounded-md border border-green-200 bg-green-50 px-2 py-1 text-[9px] font-semibold text-green-700">
                <CheckCircle2 size={11} />
                Confirmed
            </span>
        );
    }

    if (status === "Pending") {
        return (
            <span className="mt-1 inline-flex items-center gap-1 rounded-md border border-amber-200 bg-amber-50 px-2 py-1 text-[9px] font-semibold text-amber-700">
                <Clock3 size={11} />
                Pending
            </span>
        );
    }

    return (
        <span className="mt-1 inline-flex items-center gap-1 rounded-md border border-red-200 bg-red-50 px-2 py-1 text-[9px] font-semibold text-red-600">
            <XCircle size={11} />
            Cancelled
        </span>
    );
}

export default MyBookings;