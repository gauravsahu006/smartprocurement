import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  BarChart3,
  CheckCircle2,
  Clock3,
  MapPin,
  Phone,
  UserRound,
  Wheat,
  Wrench,
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

function CentreDetails() {
  const { id } = useParams();

  const [centre, setCentre] = useState(null);
  const [acceptedCrops, setAcceptedCrops] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (id) {
      fetchCentreDetails();
    }
  }, [id]);

  const fetchCentreDetails = async () => {
    try {
      setLoading(true);
      setError("");

      // -----------------------------------------
      // 1. Fetch centre
      // -----------------------------------------
      const {
        data: centreData,
        error: centreError,
      } = await supabase
        .from("centres")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (centreError) {
        throw centreError;
      }

      if (!centreData) {
        setError("Procurement centre not found.");
        setCentre(null);
        return;
      }

      setCentre(centreData);

      // -----------------------------------------
      // 2. Fetch centre-crop mapping
      // -----------------------------------------
      const {
        data: centreCropData,
        error: centreCropError,
      } = await supabase
        .from("centre_crops")
        .select("*")
        .eq("centre_id", id);

      if (centreCropError) {
        throw centreCropError;
      }

      // -----------------------------------------
      // 3. Fetch crops
      // -----------------------------------------
      if (centreCropData && centreCropData.length > 0) {
        const cropIds = centreCropData.map(
          (item) => item.crop_id
        );

        const {
          data: cropData,
          error: cropError,
        } = await supabase
          .from("crops")
          .select("*")
          .in("id", cropIds)
          .order("id", { ascending: true });

        if (cropError) {
          throw cropError;
        }

        setAcceptedCrops(cropData || []);
      } else {
        setAcceptedCrops([]);
      }
    } catch (err) {
      console.error("Failed to load centre details:", err);

      setError(
        err?.message ||
          "Unable to load procurement centre details."
      );
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------------------
  // Helpers
  // -----------------------------------------

  const getCentreImage = () => {
    return centreImages[Number(id)] || centre1;
  };

  const getAddress = () => {
    if (!centre) return "Location details unavailable";

    return (
      centre.address ||
      centre.location ||
      [
        centre.village,
        centre.city,
        centre.district,
        centre.state,
        centre.pincode,
      ]
        .filter(Boolean)
        .join(", ") ||
      "Location details unavailable"
    );
  };

  const getContact = () => {
    if (!centre) return "Not available";

    return (
      centre.contact ||
      centre.phone ||
      centre.contact_number ||
      centre.mobile ||
      "Not available"
    );
  };

  const getIncharge = () => {
    if (!centre) return "Not available";

    return (
      centre.incharge ||
      centre.incharge_name ||
      centre.manager_name ||
      centre.contact_person ||
      "Not available"
    );
  };

  // -----------------------------------------
  // Loading
  // -----------------------------------------
  if (loading) {
    return (
      <div className="mx-auto max-w-[1150px] px-4 py-5 sm:px-6 lg:px-7">
        <Link
          to="/centres"
          className="inline-flex items-center gap-1.5 text-[9px] font-semibold text-slate-600 hover:text-green-700"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Centres
        </Link>

        <div className="mt-4 grid gap-4 lg:grid-cols-[1.05fr_1fr]">
          <div className="h-[400px] animate-pulse rounded-lg border border-slate-200 bg-white" />

          <div className="h-[400px] animate-pulse rounded-lg border border-slate-200 bg-white" />
        </div>
      </div>
    );
  }

  // -----------------------------------------
  // Error / Not Found
  // -----------------------------------------
  if (!centre) {
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
            Centre not found
          </h1>

          <p className="mt-1 text-[10px] text-red-600">
            {error || "This procurement centre does not exist."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1150px] px-4 py-5 sm:px-6 lg:px-7">
      {/* Back */}
      <Link
        to="/centres"
        className="inline-flex items-center gap-1.5 text-[9px] font-semibold text-slate-600 hover:text-green-700"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to Centres
      </Link>

      {/* Error */}
      {error && (
        <div className="mt-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-[10px] font-semibold text-red-700">
          {error}
        </div>
      )}

      {/* Main Grid */}
      <section className="mt-4 grid gap-4 lg:grid-cols-[1.05fr_1fr]">
        {/* Left */}
        <div>
          {/* Centre Image */}
          <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
            <img
              src={getCentreImage()}
              alt={centre.name}
              className="h-[210px] w-full object-cover sm:h-[250px]"
            />
          </div>

          {/* Quick Stats */}
          <div className="mt-2 grid grid-cols-3 gap-2">
            <StatCard
              icon={MapPin}
              label="Location"
              value={
                centre.city ||
                centre.district ||
                centre.state ||
                "Available"
              }
            />

            <StatCard
              icon={UserRound}
              label="Current Queue"
              value="Live"
              suffix="after booking"
            />

            <StatCard
              icon={Clock3}
              label="Slot Status"
              value="Available"
            />
          </div>

          {/* Capacity */}
          <div className="mt-2 rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-green-700" />

                <div>
                  <p className="text-[9px] text-slate-500">
                    Today's Capacity
                  </p>

                  <p className="text-sm font-extrabold text-blue-950">
                    Check available slots
                  </p>
                </div>
              </div>

              <span className="text-[9px] font-bold text-green-700">
                Live
              </span>
            </div>

            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-green-600"
                style={{ width: "40%" }}
              />
            </div>

            <p className="mt-1.5 text-[8px] text-slate-400">
              Capacity will be determined from available time
              slots.
            </p>
          </div>

          {/* About */}
          <div className="mt-5">
            <h2 className="text-sm font-extrabold text-blue-950">
              About this Centre
            </h2>

            <p className="mt-2 text-[9px] leading-5 text-slate-600">
              {centre.name} is a procurement centre where
              farmers can bring their crops for weighing, quality
              checking and transparent procurement.
            </p>
          </div>
        </div>

        {/* Right */}
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          {/* Title */}
          <div className="flex items-start justify-between gap-3">
            <h1 className="text-base font-extrabold text-blue-950 sm:text-lg">
              {centre.name}
            </h1>

            <span className="shrink-0 rounded-md border border-green-200 bg-green-50 px-2.5 py-1 text-[9px] font-bold text-green-700">
              Open
            </span>
          </div>

          {/* Address */}
          <div className="mt-3 flex items-start gap-2 border-b border-slate-100 pb-3">
            <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-green-700" />

            <p className="text-[9px] leading-4 text-slate-600">
              {getAddress()}
            </p>
          </div>

          {/* Information */}
          <div className="mt-4 space-y-4">
            <DetailRow
              icon={Clock3}
              label="Working Hours"
              value="09:00 AM - 05:00 PM"
            />

            <DetailRow
              icon={Phone}
              label="Contact Number"
              value={getContact()}
            />

            <DetailRow
              icon={UserRound}
              label="Centre Incharge"
              value={getIncharge()}
            />
          </div>

          {/* Crops */}
          <div className="mt-5 border-t border-slate-100 pt-4">
            <div className="flex items-center gap-2">
              <Wheat className="h-4 w-4 text-green-700" />

              <p className="text-[10px] font-bold text-slate-700">
                Accepted Crops
              </p>
            </div>

            <div className="mt-2 flex flex-wrap gap-2">
              {acceptedCrops.length === 0 ? (
                <span className="rounded-md bg-slate-50 px-2.5 py-1.5 text-[8px] font-bold text-slate-500">
                  No crop information available
                </span>
              ) : (
                acceptedCrops.map((crop) => (
                  <span
                    key={crop.id}
                    className="rounded-md bg-green-50 px-2.5 py-1.5 text-[8px] font-bold text-green-700"
                  >
                    {crop.name}
                  </span>
                ))
              )}
            </div>
          </div>

          {/* Facilities */}
          <div className="mt-5 border-t border-slate-100 pt-4">
            <div className="flex items-center gap-2">
              <Wrench className="h-4 w-4 text-green-700" />

              <p className="text-[10px] font-bold text-slate-700">
                Facilities
              </p>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-y-3">
              <Facility text="Weighing Machine" />
              <Facility text="Quality Check" />
              <Facility text="Parking" />
              <Facility text="Drinking Water" />
            </div>
          </div>

          {/* Choose */}
          <Link
            to={`/recommendations?centre=${centre.id}`}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-md bg-green-700 py-2.5 text-[10px] font-bold text-white shadow-sm transition hover:bg-green-800"
          >
            <CheckCircle2 className="h-4 w-4" />
            Choose This Centre
          </Link>
        </div>
      </section>

      {/* Map */}
      <section className="mt-5">
        <h2 className="text-sm font-extrabold text-blue-950">
          Location
        </h2>

        <div className="relative mt-3 h-[180px] overflow-hidden rounded-lg border border-slate-200 bg-[#e8f0e8]">
          {/* Simple Map Background */}
          <div className="absolute inset-0 opacity-60">
            <div className="absolute left-[10%] top-[20%] h-px w-[80%] rotate-12 bg-white" />

            <div className="absolute left-[5%] top-[50%] h-px w-[90%] -rotate-6 bg-white" />

            <div className="absolute left-[30%] top-0 h-full w-px rotate-[18deg] bg-white" />

            <div className="absolute left-[65%] top-0 h-full w-px -rotate-[12deg] bg-white" />

            <div className="absolute left-[15%] top-[15%] h-16 w-24 rounded-full bg-green-100" />

            <div className="absolute right-[10%] bottom-[10%] h-20 w-28 rounded-full bg-blue-100" />
          </div>

          {/* Pin */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-700 shadow-lg">
              <MapPin className="h-5 w-5 fill-white text-white" />
            </div>
          </div>

          <div className="absolute bottom-3 left-3 rounded-md bg-white px-3 py-2 shadow-sm">
            <p className="text-[8px] font-bold text-slate-700">
              {centre.name}
            </p>

            <p className="mt-0.5 text-[7px] text-slate-500">
              {getAddress()}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, suffix }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 shrink-0 text-green-700" />

        <div className="min-w-0">
          <p className="truncate text-[8px] text-slate-500">
            {label}
          </p>

          <p className="mt-0.5 text-[10px] font-extrabold text-blue-950">
            {value}

            {suffix && (
              <span className="ml-1 text-[7px] font-medium text-slate-400">
                {suffix}
              </span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}

function DetailRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3">
      <Icon className="h-4 w-4 shrink-0 text-slate-500" />

      <div className="flex min-w-0 flex-1 items-center justify-between gap-3">
        <span className="text-[9px] text-slate-500">
          {label}
        </span>

        <span className="text-right text-[9px] font-bold text-slate-700">
          {value}
        </span>
      </div>
    </div>
  );
}

function Facility({ text }) {
  return (
    <div className="flex items-center gap-1.5">
      <CheckCircle2 className="h-3 w-3 text-green-600" />

      <span className="text-[8px] text-slate-600">
        {text}
      </span>
    </div>
  );
}

export default CentreDetails;