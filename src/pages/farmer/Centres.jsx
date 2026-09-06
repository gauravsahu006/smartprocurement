import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ChevronDown,
  LocateFixed,
  MapPin,
  Navigation,
  Search,
  UsersRound,
  Clock3,
  BarChart3,
  BellRing,
} from "lucide-react";

import centre1 from "../../assets/images/procurement-centre-1.png";
import centre2 from "../../assets/images/procurement-centre-2.png";
import centre3 from "../../assets/images/procurement-centre-3.png";
import centre4 from "../../assets/images/procurement-centre-4.png";

const centres = [
  {
    id: 1,
    name: "ABC Procurement Centre",
    image: centre1,
    distance: "5.2 km",
    queue: "12 Farmers",
    waitTime: "35 min",
    utilization: "70%",
  },
  {
    id: 2,
    name: "Krishi Seva Kendra",
    image: centre2,
    distance: "2.1 km",
    queue: "8 Farmers",
    waitTime: "60 min",
    utilization: "70%",
  },
  {
    id: 3,
    name: "Green Field Centre",
    image: centre3,
    distance: "7.8 km",
    queue: "8 Farmers",
    waitTime: "20 min",
    utilization: "60%",
  },
  {
    id: 4,
    name: "Shakti Kendra",
    image: centre4,
    distance: "9.5 km",
    queue: "15 Farmers",
    waitTime: "45 min",
    utilization: "66%",
  },
];

function Centres() {
  const [crop, setCrop] = useState("Wheat");
  const [location, setLocation] = useState("");
  const [searched, setSearched] = useState(false);

  const handleSearch = () => {
    setSearched(true);
  };

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
                onChange={(event) => setCrop(event.target.value)}
                className="h-10 w-full appearance-none rounded-md border border-slate-200 bg-white pl-9 pr-8 text-[10px] font-semibold text-slate-700 outline-none transition focus:border-green-500 focus:ring-1 focus:ring-green-100"
              >
                <option>Wheat</option>
                <option>Rice</option>
                <option>Maize</option>
                <option>Pulses</option>
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
                onChange={(event) => setLocation(event.target.value)}
                placeholder="Use My Location"
                className="h-10 w-full rounded-md border border-slate-200 bg-white pl-9 pr-9 text-[10px] font-semibold text-slate-700 outline-none placeholder:text-slate-400 focus:border-green-500 focus:ring-1 focus:ring-green-100"
              />

              <button
                type="button"
                title="Use current location"
                className="absolute right-2.5 top-2.5 text-green-700 hover:text-green-800"
                onClick={() => setLocation("Current Location")}
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
            Showing procurement centres for {crop}.
          </p>
        )}
      </section>

      {/* Centre Cards */}
      <section className="mt-5 grid gap-3 md:grid-cols-2">
        {centres.map((centre) => (
          <div
            key={centre.id}
            className="overflow-hidden rounded-lg border border-slate-200 bg-white p-2.5 shadow-sm transition hover:border-green-200 hover:shadow-md"
          >
            <div className="flex gap-3">
              {/* Image */}
              <div className="h-[84px] w-[96px] shrink-0 overflow-hidden rounded-md bg-slate-100 sm:h-[92px] sm:w-[105px]">
                <img
                  src={centre.image}
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
                    text={`${centre.distance} away`}
                  />

                  <InfoRow
                    icon={UsersRound}
                    text={`Queue: ${centre.queue}`}
                  />

                  <InfoRow
                    icon={Clock3}
                    text={`Est. Wait Time: ${centre.waitTime}`}
                  />

                  <InfoRow
                    icon={BarChart3}
                    text={`Capacity Utilization: ${centre.utilization}`}
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
        ))}
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
      <span>{text}</span>
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