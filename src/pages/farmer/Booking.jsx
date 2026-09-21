import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  Clock3,
  MapPin,
  Users,
  Wheat,
} from "lucide-react";

import { supabase } from "../../lib/supabase";

/* =========================================================
   DATE HELPERS
========================================================= */

function getDate(daysFromToday) {
  const date = new Date();

  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() + daysFromToday);

  return date;
}

/*
  IMPORTANT:
  toISOString() timezone issue avoid karne ke liye
  local date key bana rahe hain.
*/
function getDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
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

/* =========================================================
   TIME HELPERS
========================================================= */

function formatTime(time) {
  if (!time) return "";

  const [hours, minutes] = time.split(":");

  const date = new Date();

  date.setHours(Number(hours), Number(minutes), 0, 0);

  return date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatSlot(startTime, endTime) {
  return `${formatTime(startTime)} - ${formatTime(endTime)}`;
}

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function Booking() {
  const navigate = useNavigate();
  const location = useLocation();

  const params = new URLSearchParams(location.search);

  const centreId = Number(params.get("centre")) || 1;

  /* =======================================================
     STATE
  ======================================================= */

  const [centre, setCentre] = useState(null);
  const [crops, setCrops] = useState([]);
  const [slots, setSlots] = useState([]);

  const [selectedCrop, setSelectedCrop] = useState("");
  const [selectedSlotId, setSelectedSlotId] = useState("");

  const [loadingCentre, setLoadingCentre] = useState(true);
  const [loadingCrops, setLoadingCrops] = useState(true);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);

  const [error, setError] = useState("");

  /* =======================================================
     NEXT 7 DAYS
  ======================================================= */

  const dates = useMemo(() => {
    return Array.from({ length: 7 }, (_, index) => getDate(index));
  }, []);

  const [selectedDate, setSelectedDate] = useState(
    getDateKey(dates[0])
  );

  /* =======================================================
     FETCH CENTRE
  ======================================================= */

  useEffect(() => {
    async function fetchCentre() {
      setLoadingCentre(true);
      setError("");

      const { data, error: centreError } = await supabase
        .from("centres")
        .select("*")
        .eq("id", centreId)
        .single();

      if (centreError) {
        console.error("Centre fetch error:", centreError);

        setError("Unable to load procurement centre.");
        setCentre(null);
      } else {
        console.log("Selected centre:", data);

        setCentre(data);
      }

      setLoadingCentre(false);
    }

    fetchCentre();
  }, [centreId]);

  /* =======================================================
     FETCH CROPS
  ======================================================= */

  useEffect(() => {
    async function fetchCrops() {
      setLoadingCrops(true);

      const {
        data: centreCrops,
        error: centreCropsError,
      } = await supabase
        .from("centre_crops")
        .select("crop_id")
        .eq("centre_id", centreId);

      if (centreCropsError) {
        console.error(
          "Centre crops error:",
          centreCropsError
        );

        setCrops([]);
        setLoadingCrops(false);

        return;
      }

      const cropIds = (centreCrops || []).map(
        (item) => item.crop_id
      );

      if (cropIds.length === 0) {
        setCrops([]);
        setLoadingCrops(false);

        return;
      }

      const { data: cropData, error: cropError } =
        await supabase
          .from("crops")
          .select("*")
          .in("id", cropIds)
          .order("name", {
            ascending: true,
          });

      if (cropError) {
        console.error(
          "Crops fetch error:",
          cropError
        );

        setCrops([]);
      } else {
        console.log(
          "Available crops:",
          cropData
        );

        setCrops(cropData || []);

        /*
          Automatically select first crop
        */
        if (cropData?.length > 0) {
          setSelectedCrop(
            String(cropData[0].id)
          );
        }
      }

      setLoadingCrops(false);
    }

    fetchCrops();
  }, [centreId]);

  /* =======================================================
     ENSURE + FETCH DAILY TIME SLOTS
  ======================================================= */

  useEffect(() => {
    async function fetchSlots() {
      if (!centreId || !selectedDate) {
        return;
      }

      setLoadingSlots(true);
      setError("");
      setSelectedSlotId("");

      try {
        /*
          STEP 1:
          Automatically create the six slots for this date
          if they don't already exist.
        */

        const {
          data: generatedSlots,
          error: generateError,
        } = await supabase.rpc(
          "ensure_daily_slots",
          {
            p_centre_id: centreId,
            p_slot_date: selectedDate,
          }
        );

        if (generateError) {
          console.error(
            "Ensure daily slots error:",
            generateError
          );

          throw generateError;
        }

        console.log(
          "Daily slots ensured:",
          generatedSlots
        );

        /*
          STEP 2:
          Fetch current database state.

          This is important because booked_count may
          have changed after another farmer booked.
        */

        const {
          data,
          error: slotsError,
        } = await supabase
          .from("time_slots")
          .select("*")
          .eq("centre_id", centreId)
          .eq("slot_date", selectedDate)
          .eq("is_active", true)
          .order("start_time", {
            ascending: true,
          });

        if (slotsError) {
          console.error(
            "Slots fetch error:",
            slotsError
          );

          throw slotsError;
        }

        console.log(
          "Current available slots:",
          data
        );

        setSlots(data || []);
      } catch (slotException) {
        console.error(
          "Slot loading exception:",
          slotException
        );

        setSlots([]);

        setError(
          slotException?.message ||
            "Unable to load available time slots."
        );
      } finally {
        setLoadingSlots(false);
      }
    }

    fetchSlots();
  }, [centreId, selectedDate]);

  /* =======================================================
     CONFIRM BOOKING
  ======================================================= */

  const handleConfirm = async () => {
    setError("");

    if (!selectedDate) {
      setError("Please select a date.");
      return;
    }

    if (!selectedCrop) {
      setError("Please select a crop.");
      return;
    }

    if (!selectedSlotId) {
      setError("Please select a time slot.");
      return;
    }

    if (!centre) {
      setError(
        "Procurement centre information is unavailable."
      );

      return;
    }

    if (bookingLoading) {
      return;
    }

    /* =====================================================
       FIND SELECTED SLOT
    ===================================================== */

    const selectedSlot = slots.find(
      (slot) =>
        String(slot.id) ===
        String(selectedSlotId)
    );

    if (!selectedSlot) {
      setError(
        "Selected time slot could not be found."
      );

      return;
    }

    /* =====================================================
       CHECK SLOT AVAILABILITY
    ===================================================== */

    const capacity = Number(
      selectedSlot.capacity || 0
    );

    const bookedCount = Number(
      selectedSlot.booked_count || 0
    );

    const availableBeforeBooking =
      capacity - bookedCount;

    if (availableBeforeBooking <= 0) {
      setError(
        "This slot is already full. Please select another slot."
      );

      /*
        Refresh slots so UI gets latest database state.
      */

      setSelectedSlotId("");

      return;
    }

    setBookingLoading(true);

    try {
      /* ===================================================
         GET CURRENT FARMER
      =================================================== */

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        throw userError;
      }

      if (!user) {
        setError(
          "Please login as a farmer before booking."
        );

        navigate("/farmer-login");

        return;
      }

      console.log(
        "Creating booking for farmer:",
        user.id
      );

      /* ===================================================
         CREATE BOOKING

         IMPORTANT:
         Date is already stored inside time_slots.

         So DO NOT send p_booking_date.
      =================================================== */

      const bookingPayload = {
        p_centre_id: centreId,
        p_crop_id: Number(selectedCrop),
        p_slot_id: Number(selectedSlotId),
        p_notes: null,
      };

      console.log(
        "Creating booking with:",
        bookingPayload
      );

      const {
        data,
        error: bookingError,
      } = await supabase.rpc(
        "create_booking",
        bookingPayload
      );

      if (bookingError) {
        console.error(
          "Create booking error:",
          bookingError
        );

        throw new Error(
          bookingError.message
        );
      }

      console.log(
        "Booking created successfully:",
        data
      );

      /* ===================================================
         RPC RESPONSE
      =================================================== */

      let bookingData = data;

      if (Array.isArray(data)) {
        bookingData = data[0];
      }

      console.log(
        "Final booking data:",
        bookingData
      );

      /* ===================================================
         FETCH UPDATED SLOT
         
         This gets the NEW booked_count after booking.
      =================================================== */

      const {
        data: updatedSlot,
        error: updatedSlotError,
      } = await supabase
        .from("time_slots")
        .select("*")
        .eq("id", selectedSlot.id)
        .single();

      if (updatedSlotError) {
        console.warn(
          "Could not fetch updated slot:",
          updatedSlotError
        );
      }

      const finalSlot =
        updatedSlot || selectedSlot;

      const availableAfterBooking =
        Number(finalSlot.capacity || 0) -
        Number(finalSlot.booked_count || 0);

      /* ===================================================
         NAVIGATE TO CONFIRMATION
      =================================================== */

      navigate("/booking-confirmation", {
        state: {
          booking: bookingData,

          centreId: centreId,

          centre: centre,

          date: selectedDate,

          slotId: finalSlot.id,

          slot: formatSlot(
            finalSlot.start_time,
            finalSlot.end_time
          ),

          crop:
            crops.find(
              (crop) =>
                String(crop.id) ===
                String(selectedCrop)
            ) || null,

          cropId: Number(selectedCrop),

          /*
            IMPORTANT:
            This is now the remaining availability
            AFTER the booking.
          */
          available:
            Math.max(
              0,
              availableAfterBooking
            ),

          token:
            bookingData?.token_number ??
            bookingData?.token ??
            null,

          queuePosition:
            bookingData?.queue_position ??
            bookingData?.position ??
            null,

          waitTime: null,
        },
      });
    } catch (bookingException) {
      console.error(
        "Booking exception:",
        bookingException
      );

      setError(
        bookingException?.message ||
          "Something went wrong while creating the booking."
      );
    } finally {
      setBookingLoading(false);
    }
  };

  /* =======================================================
     LOADING CENTRE
  ======================================================= */

  if (loadingCentre) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center">
          <p className="text-sm font-medium text-slate-500">
            Loading procurement centre...
          </p>
        </div>
      </main>
    );
  }

  /* =======================================================
     CENTRE NOT FOUND
  ======================================================= */

  if (!centre) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-xl border border-red-200 bg-red-50 p-8 text-center">
          <p className="text-sm font-semibold text-red-600">
            Procurement centre not found.
          </p>

          <Link
            to="/centres"
            className="mt-4 inline-flex rounded-lg bg-green-700 px-5 py-2.5 text-sm font-semibold text-white"
          >
            Back to Centres
          </Link>
        </div>
      </main>
    );
  }

  /* =======================================================
     CALCULATED VALUES
  ======================================================= */

  const selectedSlot = slots.find(
    (slot) =>
      String(slot.id) ===
      String(selectedSlotId)
  );

  const selectedCropData = crops.find(
    (crop) =>
      String(crop.id) ===
      String(selectedCrop)
  );

  /*
    Only slots having remaining capacity are displayed.
  */

  const availableSlots = slots.filter(
    (slot) => {
      const capacity = Number(
        slot.capacity || 0
      );

      const bookedCount = Number(
        slot.booked_count || 0
      );

      return capacity - bookedCount > 0;
    }
  );

  /* =======================================================
     UI
  ======================================================= */

  return (
    <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">

      {/* ==================================================
          HEADER
      ================================================== */}

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
          Select a convenient date, crop and time
          for your procurement visit.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[330px_1fr]">

        {/* =================================================
            CENTRE SUMMARY
        ================================================= */}

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

            {/* Location */}

            <div className="flex gap-3">
              <div className="rounded-lg bg-green-50 p-2 text-green-700">
                <MapPin size={18} />
              </div>

              <div>
                <p className="text-xs text-slate-500">
                  Location
                </p>

                <p className="text-sm font-medium text-slate-700">
                  {centre.address ||
                    "Location not available"}
                </p>
              </div>
            </div>

            {/* District */}

            {centre.district && (
              <div className="flex gap-3">
                <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
                  <MapPin size={18} />
                </div>

                <div>
                  <p className="text-xs text-slate-500">
                    District
                  </p>

                  <p className="text-sm font-medium text-slate-700">
                    {centre.district}
                  </p>
                </div>
              </div>
            )}

            {/* Queue */}

            <div className="flex gap-3">
              <div className="rounded-lg bg-orange-50 p-2 text-orange-600">
                <Users size={18} />
              </div>

              <div>
                <p className="text-xs text-slate-500">
                  Current Queue
                </p>

                <p className="text-sm font-medium text-slate-700">
                  Live queue will be updated after booking
                </p>
              </div>
            </div>
          </div>

          {/* Crop */}

          <div className="mt-6 border-t border-slate-100 pt-5">
            <div className="flex items-center gap-2">
              <Wheat
                size={18}
                className="text-green-700"
              />

              <span className="text-sm font-semibold text-slate-700">
                Selected Crop
              </span>
            </div>

            <p className="mt-2 text-sm font-bold text-[#10233f]">
              {selectedCropData?.name ||
                "Select crop"}
            </p>
          </div>
        </section>

        {/* =================================================
            BOOKING SECTION
        ================================================= */}

        <section className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6">

          {/* =================================================
              CROP
          ================================================= */}

          <div>
            <div className="mb-4 flex items-center gap-2">
              <Wheat
                className="text-green-700"
                size={20}
              />

              <h2 className="text-lg font-bold text-[#10233f]">
                Select Crop
              </h2>
            </div>

            {loadingCrops ? (
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm text-slate-500">
                  Loading available crops...
                </p>
              </div>
            ) : crops.length === 0 ? (
              <div className="rounded-lg border border-orange-200 bg-orange-50 p-4">
                <p className="text-sm font-medium text-orange-700">
                  No crops are currently accepted
                  at this centre.
                </p>
              </div>
            ) : (
              <div className="relative">

                <Wheat
                  size={17}
                  className="pointer-events-none absolute left-3 top-3 text-green-700"
                />

                <select
                  value={selectedCrop}
                  onChange={(event) => {
                    setSelectedCrop(
                      event.target.value
                    );

                    setError("");
                  }}
                  className="h-11 w-full appearance-none rounded-lg border border-slate-200 bg-white pl-10 pr-10 text-sm font-medium text-slate-700 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
                >
                  <option value="">
                    Select a crop
                  </option>

                  {crops.map((crop) => (
                    <option
                      key={crop.id}
                      value={crop.id}
                    >
                      {crop.name}
                    </option>
                  ))}
                </select>

                <ChevronDown
                  size={17}
                  className="pointer-events-none absolute right-3 top-3 text-slate-400"
                />
              </div>
            )}
          </div>

          {/* =================================================
              DATE
          ================================================= */}

          <div className="mt-8">

            <div className="mb-4 flex items-center gap-2">
              <CalendarDays
                className="text-green-700"
                size={20}
              />

              <h2 className="text-lg font-bold text-[#10233f]">
                Select Date
              </h2>
            </div>

            <div className="grid grid-cols-4 gap-2 sm:grid-cols-7">

              {dates.map((date) => {
                /*
                  IMPORTANT:
                  Use local date instead of toISOString()
                  to prevent timezone date shifting.
                */

                const value =
                  getDateKey(date);

                const isSelected =
                  selectedDate === value;

                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => {
                      setSelectedDate(value);
                      setError("");
                    }}
                    className={`rounded-lg border px-2 py-3 text-center transition ${
                      isSelected
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

          {/* =================================================
              TIME SLOTS
          ================================================= */}

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

              {!loadingSlots && (
                <span className="hidden rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700 sm:block">
                  {availableSlots.length} slots available
                </span>
              )}
            </div>

            {/* Loading */}

            {loadingSlots ? (
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-5 text-center">
                <p className="text-sm text-slate-500">
                  Loading available slots...
                </p>
              </div>

            ) : availableSlots.length === 0 ? (

              /* No slots */

              <div className="rounded-lg border border-orange-200 bg-orange-50 p-5">

                <div className="flex items-center gap-3">

                  <Clock3
                    size={20}
                    className="text-orange-600"
                  />

                  <div>
                    <p className="text-sm font-semibold text-orange-700">
                      No slots available
                    </p>

                    <p className="mt-1 text-xs text-orange-600">
                      All slots for this date are full.
                      Please select another date.
                    </p>
                  </div>

                </div>
              </div>

            ) : (

              /* Available slots */

              <div className="grid gap-3 sm:grid-cols-2">

                {availableSlots.map((slot) => {

                  const isSelected =
                    String(selectedSlotId) ===
                    String(slot.id);

                  const capacity =
                    Number(
                      slot.capacity || 0
                    );

                  const bookedCount =
                    Number(
                      slot.booked_count || 0
                    );

                  const available =
                    Math.max(
                      0,
                      capacity -
                        bookedCount
                    );

                  const isLow =
                    available <= 5;

                  return (
                    <button
                      key={slot.id}
                      type="button"
                      onClick={() => {
                        setSelectedSlotId(
                          String(slot.id)
                        );

                        setError("");
                      }}
                      className={`flex items-center justify-between rounded-lg border p-4 text-left transition ${
                        isSelected
                          ? "border-green-600 bg-green-50 ring-1 ring-green-600"
                          : "border-slate-200 bg-white hover:border-green-400 hover:bg-slate-50"
                      }`}
                    >
                      <div>

                        <p className="text-sm font-semibold text-slate-800">
                          {formatSlot(
                            slot.start_time,
                            slot.end_time
                          )}
                        </p>

                        <p
                          className={`mt-1 text-xs font-medium ${
                            isLow
                              ? "text-orange-600"
                              : "text-green-600"
                          }`}
                        >
                          {available} slots available
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
            )}
          </div>

          {/* =================================================
              ERROR
          ================================================= */}

          {error && (
            <div className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
              {error}
            </div>
          )}

          {/* =================================================
              SUMMARY
          ================================================= */}

          <div className="mt-8 rounded-xl bg-slate-50 p-4">

            <h3 className="text-sm font-bold text-[#10233f]">
              Booking Summary
            </h3>

            <div className="mt-3 grid gap-4 text-sm sm:grid-cols-3">

              {/* Centre */}

              <div>
                <p className="text-xs text-slate-500">
                  Centre
                </p>

                <p className="mt-1 font-medium text-slate-700">
                  {centre.name}
                </p>
              </div>

              {/* Crop */}

              <div>
                <p className="text-xs text-slate-500">
                  Crop
                </p>

                <p className="mt-1 font-medium text-slate-700">
                  {selectedCropData?.name ||
                    "Not selected"}
                </p>
              </div>

              {/* Date */}

              <div>
                <p className="text-xs text-slate-500">
                  Date
                </p>

                <p className="mt-1 font-medium text-slate-700">
                  {selectedDate
                    ? new Date(
                        `${selectedDate}T00:00:00`
                      ).toLocaleDateString(
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

              {/* Time */}

              <div>
                <p className="text-xs text-slate-500">
                  Time
                </p>

                <p className="mt-1 font-medium text-slate-700">
                  {selectedSlot
                    ? formatSlot(
                        selectedSlot.start_time,
                        selectedSlot.end_time
                      )
                    : "Not selected"}
                </p>
              </div>

              {/* Available */}

              <div>
                <p className="text-xs text-slate-500">
                  Available Slots
                </p>

                <p className="mt-1 font-medium text-green-700">
                  {selectedSlot
                    ? Math.max(
                        0,
                        Number(
                          selectedSlot.capacity ||
                            0
                        ) -
                          Number(
                            selectedSlot.booked_count ||
                              0
                          )
                      )
                    : "—"}
                </p>
              </div>

            </div>
          </div>

          {/* =================================================
              CONFIRM
          ================================================= */}

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
              disabled={
                bookingLoading ||
                loadingCrops ||
                loadingSlots ||
                crops.length === 0 ||
                availableSlots.length === 0 ||
                !selectedSlotId
              }
              className="rounded-lg bg-green-700 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {bookingLoading
                ? "Creating Booking..."
                : "Confirm Slot"}
            </button>

          </div>
        </section>
      </div>
    </main>
  );
}