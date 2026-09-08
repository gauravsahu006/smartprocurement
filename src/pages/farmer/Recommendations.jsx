import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  Award,
  BarChart3,
  CheckCircle2,
  ChevronRight,
  Clock3,
  MapPin,
  Star,
  UsersRound,
} from "lucide-react";

import centre1 from "../../assets/images/procurement-centre-1.png";
import centre2 from "../../assets/images/procurement-centre-2.png";
import centre3 from "../../assets/images/procurement-centre-3.png";
import centre4 from "../../assets/images/procurement-centre-4.png";

import { supabase } from "../../lib/supabase";

const centreImages = {
  1: centre1,
  2: centre2,
  3: centre3,
  4: centre4,
};

function Recommendations() {
  const [searchParams] = useSearchParams();

  const selectedId = Number(searchParams.get("centre"));

  const [centres, setCentres] = useState([]);
  const [crops, setCrops] = useState([]);
  const [centreCrops, setCentreCrops] = useState([]);
  const [queueEntries, setQueueEntries] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);

  const [selectedCropId, setSelectedCropId] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Today's date
  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    if (!selectedId) {
      setError("No procurement centre was selected.");
      setLoading(false);
      return;
    }

    fetchRecommendationData();
  }, [selectedId]);

  const fetchRecommendationData = async () => {
    try {
      setLoading(true);
      setError("");

      // -----------------------------------------
      // 1. Fetch all centres
      // -----------------------------------------
      const {
        data: centreData,
        error: centreError,
      } = await supabase
        .from("centres")
        .select("*")
        .order("id", { ascending: true });

      if (centreError) {
        throw centreError;
      }

      // -----------------------------------------
      // 2. Fetch all crops
      // -----------------------------------------
      const {
        data: cropData,
        error: cropError,
      } = await supabase
        .from("crops")
        .select("*")
        .order("id", { ascending: true });

      if (cropError) {
        throw cropError;
      }

      // -----------------------------------------
      // 3. Fetch centre-crop mapping
      // -----------------------------------------
      const {
        data: centreCropData,
        error: centreCropError,
      } = await supabase
        .from("centre_crops")
        .select("*");

      if (centreCropError) {
        throw centreCropError;
      }

      // -----------------------------------------
      // 4. Fetch active queue
      // -----------------------------------------
      const {
        data: queueData,
        error: queueError,
      } = await supabase
        .from("queue_entries")
        .select("*")
        .eq("centre_id", selectedId)
        .in("status", ["waiting", "called", "processing"]);

      if (queueError) {
        throw queueError;
      }

      // -----------------------------------------
      // 5. Fetch today's time slots
      // -----------------------------------------
      const {
        data: slotData,
        error: slotError,
      } = await supabase
        .from("time_slots")
        .select("*")
        .eq("centre_id", selectedId)
        .eq("slot_date", today)
        .order("start_time", { ascending: true });

      if (slotError) {
        throw slotError;
      }

      setCentres(centreData || []);
      setCrops(cropData || []);
      setCentreCrops(centreCropData || []);
      setQueueEntries(queueData || []);
      setTimeSlots(slotData || []);

      // -----------------------------------------
      // Set first accepted crop
      // -----------------------------------------
      const selectedCentreCropIds = (
        centreCropData || []
      )
        .filter(
          (item) =>
            Number(item.centre_id) === Number(selectedId)
        )
        .map((item) => Number(item.crop_id));

      const firstCrop = (cropData || []).find((item) =>
        selectedCentreCropIds.includes(Number(item.id))
      );

      if (firstCrop) {
        setSelectedCropId(String(firstCrop.id));
      }
    } catch (err) {
      console.error(
        "Failed to load recommendation data:",
        err
      );

      setError(
        err?.message ||
          "Unable to load recommendation data."
      );
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------------------
  // Selected centre
  // -----------------------------------------
  const selectedCentre = useMemo(() => {
    return centres.find(
      (centre) => Number(centre.id) === Number(selectedId)
    );
  }, [centres, selectedId]);

  // -----------------------------------------
  // Accepted crops for selected centre
  // -----------------------------------------
  const acceptedCrops = useMemo(() => {
    const cropIds = centreCrops
      .filter(
        (item) =>
          Number(item.centre_id) === Number(selectedId)
      )
      .map((item) => Number(item.crop_id));

    return crops.filter((crop) =>
      cropIds.includes(Number(crop.id))
    );
  }, [centreCrops, crops, selectedId]);

  // -----------------------------------------
  // Queue count
  // -----------------------------------------
  const currentQueueCount = queueEntries.length;

  // -----------------------------------------
  // Today's available slots
  // -----------------------------------------
  const availableSlots = timeSlots.filter((slot) => {
    const capacity = Number(slot.capacity || 0);
    const bookedCount = Number(slot.booked_count || 0);

    return bookedCount < capacity;
  });

  // -----------------------------------------
  // Centre recommendation score
  //
  // This is intentionally based only on data
  // we actually have.
  // -----------------------------------------
  const getCentreScore = (centre) => {
    const centreQueue = queueEntries.filter(
      (entry) =>
        Number(entry.centre_id) === Number(centre.id)
    ).length;

    const centreSlots =
      Number(centre.id) === Number(selectedId)
        ? availableSlots.length
        : 0;

    let score = 50;

    // Lower queue = better
    if (centreQueue === 0) score += 30;
    else if (centreQueue <= 5) score += 20;
    else if (centreQueue <= 10) score += 10;

    // Available slots
    if (centreSlots > 3) score += 20;
    else if (centreSlots > 0) score += 10;

    return Math.min(score, 100);
  };

  // -----------------------------------------
  // Other centres
  // -----------------------------------------
  const otherCentres = useMemo(() => {
    return centres.filter(
      (centre) =>
        Number(centre.id) !== Number(selectedId)
    );
  }, [centres, selectedId]);

  // -----------------------------------------
  // Helpers
  // -----------------------------------------
  const getCentreImage = (centreId) => {
    return centreImages[Number(centreId)] || centre1;
  };

  const getCentreAddress = (centre) => {
    return (
      centre?.address ||
      centre?.location ||
      [
        centre?.village,
        centre?.city,
        centre?.district,
        centre?.state,
        centre?.pincode,
      ]
        .filter(Boolean)
        .join(", ") ||
      "Location details unavailable"
    );
  };

  const getCentreCropNames = (centreId) => {
    const cropIds = centreCrops
      .filter(
        (item) =>
          Number(item.centre_id) === Number(centreId)
      )
      .map((item) => Number(item.crop_id));

    return crops
      .filter((crop) =>
        cropIds.includes(Number(crop.id))
      )
      .map((crop) => crop.name);
  };

  // -----------------------------------------
  // Loading
  // -----------------------------------------
  if (loading) {
    return (
      <div className="mx-auto max-w-[1150px] px-4 py-5 sm:px-6 lg:px-7">
        <Link
          to={`/centres/${selectedId || 1}`}
          className="inline-flex items-center gap-1.5 text-[9px] font-semibold text-slate-600 hover:text-green-700"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Centre Details
        </Link>

        <div className="mt-5 h-[350px] animate-pulse rounded-lg border border-slate-200 bg-white" />
      </div>
    );
  }

  // -----------------------------------------
  // Error
  // -----------------------------------------
  if (error || !selectedCentre) {
    return (
      <div className="mx-auto max-w-[1150px] px-4 py-5 sm:px-6 lg:px-7">
        <Link
          to="/centres"
          className="inline-flex items-center gap-1.5 text-[9px] font-semibold text-slate-600 hover:text-green-700"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Centres
        </Link>

        <div className="mt-6 rounded-lg border border-red-200 bg-red-50 px-5 py-10 text-center">
          <MapPin className="mx-auto h-8 w-8 text-red-400" />

          <h1 className="mt-3 text-sm font-extrabold text-red-800">
            Unable to load recommendation
          </h1>

          <p className="mt-1 text-[10px] text-red-600">
            {error || "Selected centre was not found."}
          </p>
        </div>
      </div>
    );
  }

  const selectedScore = getCentreScore(selectedCentre);

  return (
    <div className="mx-auto max-w-[1150px] px-4 py-5 sm:px-6 lg:px-7">
      {/* Back */}
      <Link
        to={`/centres/${selectedId}`}
        className="inline-flex items-center gap-1.5 text-[9px] font-semibold text-slate-600 hover:text-green-700"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to Centre Details
      </Link>

      {/* Heading */}
      <section className="mt-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-50">
            <Award className="h-4 w-4 text-green-700" />
          </div>

          <div>
            <h1 className="text-lg font-extrabold text-blue-950 sm:text-xl">
              Best Centre Recommendation
            </h1>

            <p className="mt-0.5 text-[9px] text-slate-500 sm:text-xs">
              Based on current queue and available slots
            </p>
          </div>
        </div>
      </section>

      {/* Crop Selection */}
      {acceptedCrops.length > 0 && (
        <section className="mt-5 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-[11px] font-extrabold text-blue-950">
                Select Your Crop
              </h2>

              <p className="mt-0.5 text-[8px] text-slate-500">
                Choose the crop you want to bring for procurement.
              </p>
            </div>

            <select
              value={selectedCropId}
              onChange={(event) =>
                setSelectedCropId(event.target.value)
              }
              className="h-9 rounded-md border border-slate-200 bg-white px-3 text-[9px] font-semibold text-slate-700 outline-none focus:border-green-500 focus:ring-1 focus:ring-green-100"
            >
              {acceptedCrops.map((crop) => (
                <option
                  key={crop.id}
                  value={crop.id}
                >
                  {crop.name}
                </option>
              ))}
            </select>
          </div>
        </section>
      )}

      {/* Recommended */}
      <section className="mt-5">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-[11px] font-extrabold text-blue-950">
            Recommended for You
          </h2>

          <span className="rounded-full bg-green-100 px-2.5 py-1 text-[8px] font-bold text-green-700">
            Best Match
          </span>
        </div>

        <div className="overflow-hidden rounded-lg border-2 border-green-500 bg-white shadow-sm">
          <div className="grid lg:grid-cols-[240px_1fr]">
            {/* Image */}
            <div className="relative h-[170px] lg:h-full">
              <img
                src={getCentreImage(selectedCentre.id)}
                alt={selectedCentre.name}
                className="h-full w-full object-cover"
              />

              <div className="absolute left-3 top-3 flex items-center gap-1 rounded-md bg-white px-2 py-1 shadow-sm">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />

                <span className="text-[8px] font-extrabold text-slate-700">
                  {selectedScore}% Match
                </span>
              </div>
            </div>

            {/* Details */}
            <div className="p-4 sm:p-5">
              <div className="flex flex-col justify-between gap-3 sm:flex-row">
                <div>
                  <h3 className="text-sm font-extrabold text-blue-950 sm:text-base">
                    {selectedCentre.name}
                  </h3>

                  <div className="mt-1.5 flex items-start gap-1.5">
                    <MapPin className="mt-0.5 h-3 w-3 shrink-0 text-green-700" />

                    <span className="text-[9px] text-slate-500">
                      {getCentreAddress(selectedCentre)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 self-start rounded-md bg-green-50 px-2.5 py-1.5">
                  <Star className="h-3 w-3 fill-green-600 text-green-600" />

                  <span className="text-[9px] font-extrabold text-green-700">
                    {selectedScore}% Match
                  </span>
                </div>
              </div>

              {/* Stats */}
              <div className="mt-4 grid grid-cols-3 gap-2">
                <MiniStat
                  icon={UsersRound}
                  label="Queue"
                  value={`${currentQueueCount} Farmers`}
                />

                <MiniStat
                  icon={Clock3}
                  label="Available Slots"
                  value={`${availableSlots.length} slots`}
                />

                <MiniStat
                  icon={BarChart3}
                  label="Crop"
                  value={
                    acceptedCrops.find(
                      (item) =>
                        String(item.id) ===
                        String(selectedCropId)
                    )?.name || "Select crop"
                  }
                />
              </div>

              {/* Reason */}
              <div className="mt-3 rounded-md bg-green-50 px-3 py-2">
                <p className="text-[8px] font-semibold text-green-800">
                  Why this centre is recommended
                </p>

                <p className="mt-0.5 text-[8px] text-green-700">
                  {availableSlots.length > 0
                    ? "This centre currently has available time slots for booking."
                    : "No available slot is currently visible for today. Check another date during booking."}
                </p>
              </div>

              {/* Address */}
              <div className="mt-3 flex items-start gap-1.5">
                <NavigationIcon />

                <span className="text-[8px] text-slate-500">
                  {getCentreAddress(selectedCentre)}
                </span>
              </div>

              {/* Actions */}
              <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                <Link
                  to={`/booking?centre=${selectedCentre.id}${
                    selectedCropId
                      ? `&crop=${selectedCropId}`
                      : ""
                  }`}
                  className="flex flex-1 items-center justify-center gap-2 rounded-md bg-green-700 py-2 text-[9px] font-bold text-white hover:bg-green-800"
                >
                  Continue to Booking
                  <ChevronRight className="h-3.5 w-3.5" />
                </Link>

                <Link
                  to={`/centres/${selectedCentre.id}`}
                  className="flex items-center justify-center rounded-md border border-green-300 px-5 py-2 text-[9px] font-bold text-green-700 hover:bg-green-50"
                >
                  View Details
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Compare */}
      {otherCentres.length > 0 && (
        <section className="mt-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-[11px] font-extrabold text-blue-950">
                Compare Other Centres
              </h2>

              <p className="mt-0.5 text-[8px] text-slate-400">
                See other procurement centres
              </p>
            </div>

            <span className="text-[8px] font-semibold text-slate-400">
              {otherCentres.length} alternatives
            </span>
          </div>

          <div className="mt-3 grid gap-3 md:grid-cols-3">
            {otherCentres.map((centre) => {
              const cropNames = getCentreCropNames(centre.id);

              return (
                <div
                  key={centre.id}
                  className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm"
                >
                  {/* Image */}
                  <div className="relative h-[105px]">
                    <img
                      src={getCentreImage(centre.id)}
                      alt={centre.name}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  {/* Content */}
                  <div className="p-3">
                    <h3 className="truncate text-[10px] font-extrabold text-blue-950">
                      {centre.name}
                    </h3>

                    <div className="mt-2 space-y-1.5">
                      <SmallInfo
                        icon={MapPin}
                        text={getCentreAddress(centre)}
                      />

                      <SmallInfo
                        icon={UsersRound}
                        text="Live queue available"
                      />

                      <SmallInfo
                        icon={Clock3}
                        text="Check available slots"
                      />

                      <SmallInfo
                        icon={BarChart3}
                        text={
                          cropNames.length > 0
                            ? `Crops: ${cropNames.join(", ")}`
                            : "Crop information unavailable"
                        }
                      />
                    </div>

                    <Link
                      to={`/centres/${centre.id}`}
                      className="mt-3 flex w-full items-center justify-center gap-1 rounded-md border border-green-300 py-1.5 text-[8px] font-bold text-green-700 hover:bg-green-50"
                    >
                      View Details
                      <ChevronRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* How it works */}
      <section className="mt-5 rounded-lg border border-blue-100 bg-blue-50/50 p-4">
        <h2 className="text-[11px] font-extrabold text-blue-950">
          How is the recommendation calculated?
        </h2>

        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          <RecommendationFactor
            number="01"
            title="Current Queue"
            text="Centres with lower active queues receive a better score."
          />

          <RecommendationFactor
            number="02"
            title="Available Slots"
            text="Centres with available time slots are preferred."
          />

          <RecommendationFactor
            number="03"
            title="Crop Availability"
            text="Only crops mapped to the selected centre are shown."
          />
        </div>
      </section>
    </div>
  );
}

function MiniStat({ icon: Icon, label, value }) {
  return (
    <div className="rounded-md border border-slate-100 bg-slate-50 px-2.5 py-2">
      <div className="flex items-center gap-1.5">
        <Icon className="h-3 w-3 text-green-700" />

        <span className="text-[7px] text-slate-500">
          {label}
        </span>
      </div>

      <p className="mt-1 truncate text-[9px] font-extrabold text-slate-800">
        {value}
      </p>
    </div>
  );
}

function SmallInfo({ icon: Icon, text }) {
  return (
    <div className="flex items-start gap-1.5">
      <Icon className="mt-0.5 h-3 w-3 shrink-0 text-green-700" />

      <span className="text-[8px] text-slate-500">
        {text}
      </span>
    </div>
  );
}

function RecommendationFactor({
  number,
  title,
  text,
}) {
  return (
    <div className="flex gap-2.5">
      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white text-[7px] font-extrabold text-green-700">
        {number}
      </div>

      <div>
        <p className="text-[9px] font-bold text-slate-700">
          {title}
        </p>

        <p className="mt-0.5 text-[8px] leading-4 text-slate-500">
          {text}
        </p>
      </div>
    </div>
  );
}

function NavigationIcon() {
  return (
    <MapPin className="mt-0.5 h-3 w-3 shrink-0 text-green-700" />
  );
}

export default Recommendations;