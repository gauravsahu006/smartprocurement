import { Link, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  Award,
  BarChart3,
  CheckCircle2,
  ChevronRight,
  Clock3,
  MapPin,
  Navigation,
  Star,
  UsersRound,
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
    capacity: "70%",
    score: 94,
    reason: "Best balance of distance, queue and capacity",
  },
  {
    id: 2,
    name: "Krishi Seva Kendra",
    image: centre2,
    distance: "2.1 km",
    queue: "8 Farmers",
    waitTime: "60 min",
    capacity: "70%",
    score: 88,
    reason: "Closest centre to your location",
  },
  {
    id: 3,
    name: "Green Field Centre",
    image: centre3,
    distance: "7.8 km",
    queue: "8 Farmers",
    waitTime: "20 min",
    capacity: "60%",
    score: 86,
    reason: "Lowest estimated waiting time",
  },
  {
    id: 4,
    name: "Shakti Kendra",
    image: centre4,
    distance: "9.5 km",
    queue: "15 Farmers",
    waitTime: "45 min",
    capacity: "66%",
    score: 79,
    reason: "Good capacity availability",
  },
];

function Recommendations() {
  const [searchParams] = useSearchParams();

  const selectedId = Number(searchParams.get("centre")) || 1;

  const recommended =
    centres.find((centre) => centre.id === 1) || centres[0];

  const otherCentres = centres.filter(
    (centre) => centre.id !== recommended.id
  );

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
              Based on distance, queue and current capacity
            </p>
          </div>
        </div>
      </section>

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
                src={recommended.image}
                alt={recommended.name}
                className="h-full w-full object-cover"
              />

              <div className="absolute left-3 top-3 flex items-center gap-1 rounded-md bg-white px-2 py-1 shadow-sm">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />

                <span className="text-[8px] font-extrabold text-slate-700">
                  {recommended.score}% Match
                </span>
              </div>
            </div>

            {/* Details */}
            <div className="p-4 sm:p-5">
              <div className="flex flex-col justify-between gap-3 sm:flex-row">
                <div>
                  <h3 className="text-sm font-extrabold text-blue-950 sm:text-base">
                    {recommended.name}
                  </h3>

                  <div className="mt-1.5 flex items-center gap-1.5">
                    <MapPin className="h-3 w-3 text-green-700" />

                    <span className="text-[9px] text-slate-500">
                      {recommended.distance} from your location
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 self-start rounded-md bg-green-50 px-2.5 py-1.5">
                  <Star className="h-3 w-3 fill-green-600 text-green-600" />

                  <span className="text-[9px] font-extrabold text-green-700">
                    {recommended.score}% Match
                  </span>
                </div>
              </div>

              {/* Stats */}
              <div className="mt-4 grid grid-cols-3 gap-2">
                <MiniStat
                  icon={UsersRound}
                  label="Queue"
                  value={recommended.queue}
                />

                <MiniStat
                  icon={Clock3}
                  label="Wait Time"
                  value={recommended.waitTime}
                />

                <MiniStat
                  icon={BarChart3}
                  label="Capacity"
                  value={recommended.capacity}
                />
              </div>

              {/* Reason */}
              <div className="mt-3 rounded-md bg-green-50 px-3 py-2">
                <p className="text-[8px] font-semibold text-green-800">
                  Why we recommend this
                </p>

                <p className="mt-0.5 text-[8px] text-green-700">
                  {recommended.reason}
                </p>
              </div>

              {/* Actions */}
              <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                <Link
                  to="/booking"
                  className="flex flex-1 items-center justify-center gap-2 rounded-md bg-green-700 py-2 text-[9px] font-bold text-white hover:bg-green-800"
                >
                  Select Recommended Centre
                  <ChevronRight className="h-3.5 w-3.5" />
                </Link>

                <Link
                  to={`/centres/${recommended.id}`}
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
      <section className="mt-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-[11px] font-extrabold text-blue-950">
              Compare Other Centres
            </h2>

            <p className="mt-0.5 text-[8px] text-slate-400">
              See how other nearby centres compare
            </p>
          </div>

          <span className="text-[8px] font-semibold text-slate-400">
            {otherCentres.length} alternatives
          </span>
        </div>

        <div className="mt-3 grid gap-3 md:grid-cols-3">
          {otherCentres.map((centre) => (
            <div
              key={centre.id}
              className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm"
            >
              {/* Image */}
              <div className="relative h-[105px]">
                <img
                  src={centre.image}
                  alt={centre.name}
                  className="h-full w-full object-cover"
                />

                <div className="absolute right-2 top-2 rounded-md bg-white px-2 py-1 shadow-sm">
                  <span className="text-[8px] font-extrabold text-green-700">
                    {centre.score}% Match
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-3">
                <h3 className="truncate text-[10px] font-extrabold text-blue-950">
                  {centre.name}
                </h3>

                <div className="mt-2 space-y-1.5">
                  <SmallInfo
                    icon={MapPin}
                    text={centre.distance}
                  />

                  <SmallInfo
                    icon={UsersRound}
                    text={`Queue: ${centre.queue}`}
                  />

                  <SmallInfo
                    icon={Clock3}
                    text={`Wait: ${centre.waitTime}`}
                  />

                  <SmallInfo
                    icon={BarChart3}
                    text={`Capacity: ${centre.capacity}`}
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
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="mt-5 rounded-lg border border-blue-100 bg-blue-50/50 p-4">
        <h2 className="text-[11px] font-extrabold text-blue-950">
          How is the recommendation calculated?
        </h2>

        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          <RecommendationFactor
            number="01"
            title="Distance"
            text="Nearby centres receive a higher score."
          />

          <RecommendationFactor
            number="02"
            title="Queue"
            text="Lower queue means a better recommendation."
          />

          <RecommendationFactor
            number="03"
            title="Capacity"
            text="Available capacity is considered in real time."
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

      <p className="mt-1 text-[9px] font-extrabold text-slate-800">
        {value}
      </p>
    </div>
  );
}

function SmallInfo({ icon: Icon, text }) {
  return (
    <div className="flex items-center gap-1.5">
      <Icon className="h-3 w-3 text-green-700" />

      <span className="text-[8px] text-slate-500">
        {text}
      </span>
    </div>
  );
}

function RecommendationFactor({ number, title, text }) {
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

export default Recommendations;