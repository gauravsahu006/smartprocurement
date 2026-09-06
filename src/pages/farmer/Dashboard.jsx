import { Link } from "react-router-dom";
import {
    ArrowRight,
    BellRing,
    CalendarDays,
    CheckCircle2,
    Clock3,
    IndianRupee,
    MapPin,
    PackageCheck,
    Ticket,
    Wheat,
} from "lucide-react";

function Dashboard() {
    return (
        <div className="mx-auto max-w-[1280px] px-4 py-5 sm:px-6 lg:px-7">
            {/* Welcome */}
            <section>
                <h1 className="text-lg font-extrabold text-blue-950 sm:text-xl">
                    Welcome, Rajesh Kumar!
                </h1>

                <p className="mt-1 text-[10px] text-slate-500 sm:text-xs">
                    Here's what's happening today.
                </p>
            </section>

            {/* Summary Cards */}
            <section className="mt-4 grid grid-cols-2 gap-3 xl:grid-cols-4">
                {/* Crop */}
                <div className="rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-50">
                            <Wheat className="h-5 w-5 text-green-700" />
                        </div>

                        <div>
                            <p className="text-[9px] text-slate-500">
                                My Crop
                            </p>

                            <p className="text-xs font-extrabold text-slate-800">
                                Wheat
                            </p>
                        </div>
                    </div>
                </div>

                {/* Centre */}
                <div className="rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-50">
                            <MapPin className="h-5 w-5 text-blue-700" />
                        </div>

                        <div>
                            <p className="text-[9px] text-slate-500">
                                Nearest Centre
                            </p>

                            <p className="text-xs font-extrabold text-slate-800">
                                5.2 km
                            </p>
                        </div>
                    </div>
                </div>

                {/* Token */}
                <div className="rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-50">
                            <Ticket className="h-5 w-5 text-orange-600" />
                        </div>

                        <div>
                            <p className="text-[9px] text-slate-500">
                                Active Token
                            </p>

                            <p className="text-xs font-extrabold text-slate-800">
                                #124
                            </p>
                        </div>
                    </div>
                </div>

                {/* Time */}
                <div className="rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-purple-50">
                            <Clock3 className="h-5 w-5 text-purple-700" />
                        </div>

                        <div>
                            <p className="text-[9px] text-slate-500">
                                Est. Wait Time
                            </p>

                            <p className="text-xs font-extrabold text-slate-800">
                                35 min
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Quick Actions */}
            <section className="mt-4">
                <h2 className="text-[11px] font-extrabold text-blue-950">
                    Quick Actions
                </h2>

                <div className="mt-2 flex flex-wrap gap-2">
                    <Link
                        to="/centres"
                        className="rounded-md bg-green-700 px-4 py-1.5 text-[9px] font-bold text-white hover:bg-green-800"
                    >
                        Find Centres
                    </Link>

                    <Link
                        to="/bookings"
                        className="rounded-md border border-green-200 bg-white px-4 py-1.5 text-[9px] font-bold text-slate-700 hover:bg-green-50"
                    >
                        My Booking
                    </Link>

                    <Link
                        to="/queue"
                        className="rounded-md border border-green-200 bg-white px-4 py-1.5 text-[9px] font-bold text-slate-700 hover:bg-green-50"
                    >
                        Live Queue
                    </Link>

                    <Link
                        to="/payment"
                        className="rounded-md border border-green-200 bg-white px-4 py-1.5 text-[9px] font-bold text-slate-700 hover:bg-green-50"
                    >
                        Payment Status
                    </Link>
                </div>
            </section>

            {/* Bottom Cards */}
            <section className="mt-4 grid gap-3 lg:grid-cols-[1.2fr_0.8fr]">
                {/* Recent Activity */}
                <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                        <h2 className="text-[11px] font-extrabold text-blue-950">
                            Recent Activity
                        </h2>

                        <BellRing className="h-4 w-4 text-green-700" />
                    </div>

                    <div className="mt-3 space-y-3">
                        {/* Activity */}
                        <div className="flex gap-3">
                            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-green-50">
                                <Ticket className="h-3.5 w-3.5 text-green-700" />
                            </div>

                            <div>
                                <p className="text-[9px] font-bold text-slate-800">
                                    Booking confirmed
                                </p>

                                <p className="text-[8px] text-slate-500">
                                    Token #124 generated for ABC Procurement Centre
                                </p>

                                <p className="mt-0.5 text-[8px] text-slate-400">
                                    05 Sep 2026, 10:00 AM
                                </p>
                            </div>
                        </div>

                        {/* Activity */}
                        <div className="flex gap-3">
                            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-green-50">
                                <UsersIcon />
                            </div>

                            <div>
                                <p className="text-[9px] font-bold text-slate-800">
                                    You are #12 in the queue
                                </p>

                                <p className="text-[8px] text-slate-500">
                                    Live queue updated
                                </p>

                                <p className="mt-0.5 text-[8px] text-slate-400">
                                    05 Sep 2026, 09:25 AM
                                </p>
                            </div>
                        </div>

                        {/* Activity */}
                        <div className="flex gap-3">
                            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-green-50">
                                <CheckCircle2 className="h-3.5 w-3.5 text-green-700" />
                            </div>

                            <div>
                                <p className="text-[9px] font-bold text-slate-800">
                                    Weighing completed
                                </p>

                                <p className="text-[8px] text-slate-500">
                                    Waiting for quality check
                                </p>

                                <p className="mt-0.5 text-[8px] text-slate-400">
                                    05 Sep 2026, 10:20 AM
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Upcoming Booking */}
                <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                        <h2 className="text-[11px] font-extrabold text-blue-950">
                            Upcoming Booking
                        </h2>

                        <CalendarDays className="h-4 w-4 text-green-700" />
                    </div>

                    <div className="mt-4 space-y-3">
                        <div className="flex justify-between gap-3">
                            <span className="text-[9px] text-slate-500">
                                Centre
                            </span>

                            <span className="text-right text-[9px] font-bold text-slate-800">
                                ABC Procurement Centre
                            </span>
                        </div>

                        <div className="flex justify-between gap-3">
                            <span className="text-[9px] text-slate-500">
                                Date & Time
                            </span>

                            <span className="text-right text-[9px] font-bold text-slate-800">
                                05 Sep 2026, 10:00 AM
                            </span>
                        </div>

                        <div className="flex justify-between">
                            <span className="text-[9px] text-slate-500">
                                Token
                            </span>

                            <span className="text-[9px] font-bold text-slate-800">
                                #124
                            </span>
                        </div>
                    </div>

                    <button className="mt-5 flex w-full items-center justify-center gap-2 rounded-md bg-green-700 py-2 text-[9px] font-bold text-white hover:bg-green-800">
                        View Details
                        <ArrowRight className="h-3 w-3" />
                    </button>
                </div>
            </section>
        </div>
    );
}

function UsersIcon() {
    return (
        <div className="flex items-center justify-center">
            <PackageCheck className="h-3.5 w-3.5 text-green-700" />
        </div>
    );
}

export default Dashboard;