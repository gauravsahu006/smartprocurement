import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ChevronDown,
  LocateFixed,
  MapPin,
  Navigation,
  Search,
  Clock3,
  BarChart3,
  BellRing,
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

function Centres() {
  const [centres, setCentres] = useState([]);
  const [crops, setCrops] = useState([]);
  const [centreCrops, setCentreCrops] = useState([]);

  const [crop, setCrop] = useState("");
  const [location, setLocation] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searched, setSearched] = useState(false);

  useEffect(() => {
    fetchCentreData();
  }, []);

  const fetchCentreData = async () => {
    try {
      setLoading(true);
      setError("");

      // -----------------------------------------
      // 1. Fetch centres
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
      // 2. Fetch crops
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

      setCentres(centreData || []);
      setCrops(cropData || []);
      setCentreCrops(centreCropData || []);

      // Select first crop automatically
      if (cropData?.length > 0) {
        setCrop(cropData[0].id.toString());
      }
    } catch (err) {
      console.error("Failed to load centres:", err);

      setError(
        err?.message || "Unable to load procurement centres."
      );
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------------------
  // Get crop IDs available at selected centre
  // -----------------------------------------
  const getCentreCropIds = (centreId) => {
    return centreCrops
      .filter(
        (item) => Number(item.centre_id) === Number(centreId)
      )
      .map((item) => Number(item.crop_id));
  };

  // -----------------------------------------
  // Filter centres
  // -----------------------------------------
  const filteredCentres = useMemo(() => {
    let result = [...centres];

    // Crop filter
    if (crop) {
      const selectedCropId = Number(crop);

      result = result.filter((centre) => {
        const availableCropIds = getCentreCropIds(centre.id);

        return availableCropIds.includes(selectedCropId);
      });
    }

    // Location filter
    if (location.trim() && location !== "Current Location") {
      const searchText = location.trim().toLowerCase();

      result = result.filter((centre) => {
        const searchableText = [
          centre.name,
          centre.address,
          centre.location,
          centre.city,
          centre.district,
          centre.state,
          centre.pincode,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        return searchableText.includes(searchText);
      });
    }

    return result;
  }, [centres, centreCrops, crop, location]);

  const handleSearch = () => {
    setSearched(true);
  };

  const getSelectedCropName = () => {
    const selectedCrop = crops.find(
      (item) => String(item.id) === String(crop)
    );

    return selectedCrop?.name || "selected crop";
  };

  const getCentreAddress = (centre) => {
    return (
      centre.address ||
      centre.location ||
      [
        centre.city,
        centre.district,
        centre.state,
      ]
        .filter(Boolean)
        .join(", ") ||
      "Location details unavailable"
    );
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-[1150px] px-4 py-5 sm:px-6 lg:px-7">
        <section>
          <h1 className="text-lg font-extrabold text-blue-950 sm:text-xl">
            Find Procurement Centres
          </h1>

          <p className="mt-1 text-[10px] text-slate-500 sm:text-xs">
            Loading procurement centres...
          </p>
        </section>

        <div className="mt-6 grid gap-3 md:grid-cols-2">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="h-[150px] animate-pulse rounded-lg border border-slate-200 bg-white"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1150px] px-4 py-5 sm:px-6 lg:px-7">
      {/* Page Heading */}
      <section>
        <h1 className="text-lg font-extrabold text-blue-950 sm:text-xl">
          Find Procurement Centres
        </h1>

        <p className="mt-1 text-[10px] text-slate-500 sm:text-xs">
          Search and compare nearby procurement centres
        </p>
      </section>

      {/* Error */}
      {error && (
        <div className="mt-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-[10px] font-semibold text-red-700">
          {error}
        </div>
      )}

      {/* Search */}
      <section className="mt-5">
        <div className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
          {/* Crop */}
          <div>
            <label className="mb-1.5 block text-[9px] font-semibold text-slate-600">
              Select Crop
            </label>

            <div className="relative">
              <WheatIcon />

              <select
                value={crop}
                onChange={(event) => {
                  setCrop(event.target.value);
                  setSearched(false);
                }}
                className="h-10 w-full appearance-none rounded-md border border-slate-200 bg-white pl-9 pr-8 text-[10px] font-semibold text-slate-700 outline-none transition focus:border-green-500 focus:ring-1 focus:ring-green-100"
              >
                {crops.length === 0 ? (
                  <option value="">
                    No crops available
                  </option>
                ) : (
                  crops.map((item) => (
                    <option
                      key={item.id}
                      value={item.id}
                    >
                      {item.name}
                    </option>
                  ))
                )}
              </select>

              <ChevronDown className="pointer-events-none absolute right-3 top-3 h-4 w-4 text-slate-400" />
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="mb-1.5 block text-[9px] font-semibold text-slate-600">
              Location
            </label>

            <div className="relative">
              <Navigation className="absolute left-3 top-3 h-4 w-4 text-slate-400" />

              <input
                value={location}
                onChange={(event) => {
                  setLocation(event.target.value);
                  setSearched(false);
                }}
                placeholder="Enter city, district or location"
                className="h-10 w-full rounded-md border border-slate-200 bg-white pl-9 pr-9 text-[10px] font-semibold text-slate-700 outline-none placeholder:text-slate-400 focus:border-green-500 focus:ring-1 focus:ring-green-100"
              />

              <button
                type="button"
                title="Use current location"
                className="absolute right-2.5 top-2.5 text-green-700 hover:text-green-800"
                onClick={() => {
                  setLocation("Current Location");
                  setSearched(true);
                }}
              >
                <LocateFixed className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Search Button */}
          <div className="flex items-end">
            <button
              type="button"
              onClick={handleSearch}
              className="flex h-10 w-full items-center justify-center gap-2 rounded-md bg-green-700 px-5 text-[10px] font-bold text-white shadow-sm transition hover:bg-green-800 md:w-auto"
            >
              <Search className="h-4 w-4" />
              Search Centres
            </button>
          </div>
        </div>

        {searched && (
          <p className="mt-2 text-[9px] font-medium text-green-700">
            Showing centres for {getSelectedCropName()}.
          </p>
        )}
      </section>

      {/* Centre Cards */}
      <section className="mt-5 grid gap-3 md:grid-cols-2">
        {filteredCentres.length === 0 ? (
          <div className="md:col-span-2 rounded-lg border border-slate-200 bg-white px-5 py-10 text-center shadow-sm">
            <MapPin className="mx-auto h-8 w-8 text-slate-300" />

            <h2 className="mt-3 text-sm font-extrabold text-blue-950">
              No procurement centre found
            </h2>

            <p className="mt-1 text-[10px] text-slate-500">
              Try another crop or location.
            </p>
          </div>
        ) : (
          filteredCentres.map((centre) => {
            const image =
              centreImages[centre.id] || centre1;

            const availableCropIds =
              getCentreCropIds(centre.id);

            const availableCropNames = crops
              .filter((item) =>
                availableCropIds.includes(Number(item.id))
              )
              .map((item) => item.name);

            return (
              <div
                key={centre.id}
                className="overflow-hidden rounded-lg border border-slate-200 bg-white p-2.5 shadow-sm transition hover:border-green-200 hover:shadow-md"
              >
                <div className="flex gap-3">
                  {/* Image */}
                  <div className="h-[84px] w-[96px] shrink-0 overflow-hidden rounded-md bg-slate-100 sm:h-[92px] sm:w-[105px]">
                    <img
                      src={image}
                      alt={centre.name}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  {/* Details */}
                  <div className="min-w-0 flex-1">
                    <h2 className="truncate text-[11px] font-extrabold text-blue-950 sm:text-xs">
                      {centre.name}
                    </h2>

                    <div className="mt-2 space-y-1">
                      <InfoRow
                        icon={MapPin}
                        text={getCentreAddress(centre)}
                      />

                      <InfoRow
                        icon={UsersRound}
                        text="Live queue available after booking"
                      />

                      <InfoRow
                        icon={Clock3}
                        text="Check available slots"
                      />

                      <InfoRow
                        icon={BarChart3}
                        text={
                          availableCropNames.length > 0
                            ? `Crops: ${availableCropNames.join(", ")}`
                            : "Crop availability unavailable"
                        }
                      />
                    </div>
                  </div>
                </div>

                {/* Button */}
                <div className="mt-2.5 flex justify-end">
                  <Link
                    to={`/centres/${centre.id}`}
                    className="rounded-md border border-green-300 px-5 py-1.5 text-[9px] font-bold text-green-700 transition hover:bg-green-50"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            );
          })
        )}
      </section>

      {/* Notify Banner */}
      <section className="mt-4 rounded-lg border border-green-100 bg-green-50/70 px-4 py-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white">
              <BellRing className="h-4 w-4 text-green-700" />
            </div>

            <div>
              <p className="text-[10px] font-extrabold text-slate-800">
                Can't find a centre near you?
              </p>

              <p className="mt-0.5 text-[9px] text-slate-500">
                We'll notify you when a new centre is added in your area.
              </p>
            </div>
          </div>

          <button
            type="button"
            className="rounded-md border border-green-300 bg-white px-5 py-1.5 text-[9px] font-bold text-green-700 hover:bg-green-50"
          >
            Notify Me
          </button>
        </div>
      </section>
    </div>
  );
}

function InfoRow({ icon: Icon, text }) {
  return (
    <div className="flex items-center gap-1.5 text-[8px] text-slate-600 sm:text-[9px]">
      <Icon className="h-3 w-3 shrink-0 text-green-700" />
      <span className="truncate">{text}</span>
    </div>
  );
}

function WheatIcon() {
  return (
    <span className="absolute left-3 top-3 text-green-700">
      <span className="text-[13px]">🌾</span>
    </span>
  );
}

export default Centres;