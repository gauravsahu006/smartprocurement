import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
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

    
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [booking, setBooking] = useState(null);
const [bookingLoading, setBookingLoading] = useState(true);
const [queue, setQueue] = useState(null);
const [queueLoading, setQueueLoading] = useState(true);

        useEffect(() => {
        const fetchProfile = async () => {
            setLoading(true);

            const {
                data: { user },
                error: userError,
            } = await supabase.auth.getUser();

            if (userError) {
                console.error("User fetch error:", userError);
                setLoading(false);
                return;
            }

            if (!user) {
                console.log("No logged-in user");
                setLoading(false);
                return;
            }

            const { data, error } = await supabase
                .from("profiles")
                .select("*")
                .eq("id", user.id)
                .single();

            if (error) {
                console.error("Profile fetch error:", error);
                setLoading(false);
                return;
            }

            console.log("Farmer profile:", data);

            setProfile(data);
            setLoading(false);
        };

        fetchProfile();
    }, []);

    useEffect(() => {
    const fetchBooking = async () => {

      

        setBookingLoading(true);

        const {
            data: { user },
            error: userError,
        } = await supabase.auth.getUser();

        if (userError) {
            console.error("User fetch error:", userError);
            setBookingLoading(false);
            return;
        }

        if (!user) {
            console.log("No logged-in user");
            setBookingLoading(false);
            return;
        }

        const { data, error } = await supabase
            .from("bookings")
            .select("*")
            .eq("farmer_id", user.id)
            .order("created_at", { ascending: false })
;

        if (error) {
            console.error("Booking fetch error:", error);
            setBookingLoading(false);
            return;
        }

        console.log(
    "Farmer bookings:",
    JSON.stringify(data, null, 2)
);

  const statusPriority = {
    processing: 3,
    called: 2,
    confirmed: 1,
};

const activeBooking = data
    ?.filter((item) =>
        ["confirmed", "called", "processing"].includes(item.status)
    )
    .sort(
        (a, b) =>
            (statusPriority[b.status] || 0) -
            (statusPriority[a.status] || 0)
    )[0];

console.log("Selected active booking:", activeBooking);

if (!activeBooking) {
    setBooking(null);
    setBookingLoading(false);
    return;
}

// Centre
const { data: centreData, error: centreError } = await supabase
    .from("centres")
    .select("*")
    .eq("id", activeBooking.centre_id)
    .single();

// Crop
const { data: cropData, error: cropError } = await supabase
    .from("crops")
    .select("*")
    .eq("id", activeBooking.crop_id)
    .single();

// Slot
const { data: slotData, error: slotError } = await supabase
    .from("time_slots")
    .select("*")
    .eq("id", activeBooking.slot_id)
    .single();

console.log("Booking centre:", centreData);
console.log("Booking crop:", cropData);
console.log("Booking slot:", slotData);

const finalBooking = {
    ...activeBooking,
    centre: centreData,
    crop: cropData,
    slot: slotData,
};

console.log("Final Booking OBJECT:", finalBooking);

setBooking(finalBooking);
setBookingLoading(false);


    };

    fetchBooking();
}, []);

useEffect(() => {
    const fetchQueue = async () => {
        setQueueLoading(true);

        if (!booking?.id) {
            setQueue(null);
            setQueueLoading(false);
            return;
        }

        const { data, error } = await supabase
            .from("queue_entries")
            .select("*")
            .eq("booking_id", booking.id)
            .single();

        if (error) {
            console.error("Queue fetch error:", error);
            setQueueLoading(false);
            return;
        }

        console.log("Active queue:", data);

        setQueue(data);
        setQueueLoading(false);
    };

    fetchQueue();
}, [booking]);


    return (
        <div className="mx-auto max-w-[1280px] px-4 py-5 sm:px-6 lg:px-7">
            {/* Welcome */}
            <section>
                <h1 className="text-lg font-extrabold text-blue-950 sm:text-xl">
                    Welcome, {loading ? "..." : profile?.full_name || "Farmer"}!
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
    {bookingLoading
        ? "Loading..."
        : booking?.crop?.name || "No crop"}
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
    {bookingLoading
        ? "..."
        : booking && ["confirmed", "called", "processing"].includes(booking.status)
            ? `#${booking.token_number}`
            : "—"}
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
                                    {queueLoading
    ? "Checking queue..."
    : queue?.queue_position
        ? `You are #${queue.queue_position} in the queue`
        : "Not in queue"}
                                </p>

                                <p className="text-[8px] text-slate-500">
{queue?.status
    ? `Queue status: ${queue.status}`
    : "Queue information unavailable"}
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
                               {bookingLoading
    ? "Loading..."
    : booking?.centre?.name || "No booking"}
                            </span>
                        </div>

                        <div className="flex justify-between gap-3">
    <span className="text-[9px] text-slate-500">
        Date & Time
    </span>

    <span className="text-right text-[9px] font-bold text-slate-800">
       {bookingLoading
    ? "Loading..."
    : booking?.slot
        ? `${new Date(booking.booking_date).toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
          })}, ${new Date(
              `1970-01-01T${booking.slot.start_time}`
          ).toLocaleTimeString("en-IN", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
          })} - ${new Date(
              `1970-01-01T${booking.slot.end_time}`
          ).toLocaleTimeString("en-IN", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
          })}`
        : "No booking"}
    </span>
</div>

                        <div className="flex justify-between">
    <span className="text-[9px] text-slate-500">
        Token
    </span>

    <span className="text-[9px] font-bold text-slate-800">
        {bookingLoading
            ? "..."
            : booking?.token_number
                ? `#${booking.token_number}`
                : "—"}
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