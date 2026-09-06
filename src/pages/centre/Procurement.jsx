import { useMemo, useState } from "react";
import {
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  Droplets,
  Scale,
  Search,
  UserRound,
} from "lucide-react";

const farmersData = [
  {
    token: "#118",
    farmer: "Ramesh Mahto",
    crop: "Wheat",
    bookedQuantity: 42,
    moisture: "12.5%",
    grade: "A",
    rate: 2125,
    status: "Quality Check",
  },
  {
    token: "#119",
    farmer: "Mohan Oraon",
    crop: "Wheat",
    bookedQuantity: 35,
    moisture: "13.1%",
    grade: "A",
    rate: 2125,
    status: "Pending",
  },
  {
    token: "#120",
    farmer: "Sita Devi",
    crop: "Wheat",
    bookedQuantity: 28,
    moisture: "12.8%",
    grade: "A",
    rate: 2125,
    status: "Pending",
  },
  {
    token: "#121",
    farmer: "Birsa Tudu",
    crop: "Wheat",
    bookedQuantity: 45,
    moisture: "14.2%",
    grade: "B",
    rate: 2050,
    status: "Pending",
  },
  {
    token: "#122",
    farmer: "Pawan Kumar",
    crop: "Maize",
    bookedQuantity: 30,
    moisture: "13.5%",
    grade: "A",
    rate: 1900,
    status: "Pending",
  },
];

const steps = [
  {
    id: "quality",
    title: "Quality Check",
    description: "Check moisture and quality grade",
  },
  {
    id: "weighing",
    title: "Weighing",
    description: "Enter actual procured quantity",
  },
  {
    id: "complete",
    title: "Complete Procurement",
    description: "Confirm final procurement details",
  },
];

function Procurement() {
  const [farmers, setFarmers] = useState(farmersData);
  const [selectedFarmer, setSelectedFarmer] = useState(farmersData[0]);
  const [search, setSearch] = useState("");
  const [activeStep, setActiveStep] = useState("quality");
  const [moisture, setMoisture] = useState(
    farmersData[0].moisture.replace("%", "")
  );
  const [grade, setGrade] = useState(farmersData[0].grade);
  const [actualQuantity, setActualQuantity] = useState(
    farmersData[0].bookedQuantity.toString()
  );
  const [message, setMessage] = useState("");

  const filteredFarmers = useMemo(() => {
    const value = search.toLowerCase();

    return farmers.filter(
      (farmer) =>
        farmer.farmer.toLowerCase().includes(value) ||
        farmer.token.toLowerCase().includes(value) ||
        farmer.crop.toLowerCase().includes(value)
    );
  }, [farmers, search]);

  const totalAmount =
    Number(actualQuantity || 0) * selectedFarmer.rate;

  const selectFarmer = (farmer) => {
    setSelectedFarmer(farmer);
    setMoisture(farmer.moisture.replace("%", ""));
    setGrade(farmer.grade);
    setActualQuantity(farmer.bookedQuantity.toString());
    setActiveStep("quality");
    setMessage("");
  };

  const completeQualityCheck = () => {
    if (!moisture || !grade) {
      setMessage("Please enter moisture and select a quality grade.");
      return;
    }

    setActiveStep("weighing");
    setMessage("Quality check completed successfully.");
  };

  const completeWeighing = () => {
    if (!actualQuantity || Number(actualQuantity) <= 0) {
      setMessage("Please enter a valid quantity.");
      return;
    }

    setActiveStep("complete");
    setMessage("Weighing completed successfully.");
  };

  const completeProcurement = () => {
    setFarmers((prev) =>
      prev.map((farmer) =>
        farmer.token === selectedFarmer.token
          ? {
              ...farmer,
              status: "Completed",
              moisture: `${moisture}%`,
              grade,
            }
          : farmer
      )
    );

    setSelectedFarmer((prev) => ({
      ...prev,
      status: "Completed",
      moisture: `${moisture}%`,
      grade,
    }));

    setMessage(
      `Procurement completed for ${selectedFarmer.token}. Payment is ready to be initiated.`
    );
  };

  return (
    <div className="mx-auto max-w-[1280px] px-4 py-5 sm:px-6 lg:px-7">
      {/* Header */}
      <div>
        <h1 className="text-lg font-extrabold text-blue-950 sm:text-xl">
          Procurement
        </h1>

        <p className="mt-1 text-[10px] text-slate-500 sm:text-xs">
          Manage quality check, weighing and procurement completion
        </p>
      </div>

      {/* Success Message */}
      {message && (
        <div className="mt-4 flex items-center gap-2 rounded-lg border border-green-100 bg-green-50 px-4 py-3 text-[10px] font-semibold text-green-700">
          <CheckCircle2 className="h-4 w-4 shrink-0" />

          <span>{message}</span>

          <button
            onClick={() => setMessage("")}
            className="ml-auto text-sm"
          >
            ×
          </button>
        </div>
      )}

      {/* Farmer Selection + Process */}
      <section className="mt-5 grid gap-4 lg:grid-cols-[0.85fr_1.65fr]">
        {/* Farmer List */}
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-[11px] font-extrabold text-blue-950">
                Today's Farmers
              </h2>

              <p className="mt-0.5 text-[8px] text-slate-500">
                Select a farmer to process
              </p>
            </div>

            <UserRound className="h-4 w-4 text-green-700" />
          </div>

          {/* Search */}
          <div className="relative mt-4">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />

            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search farmer or token..."
              className="h-9 w-full rounded-md border border-slate-200 bg-slate-50 pl-9 pr-3 text-[9px] outline-none focus:border-green-600 focus:bg-white"
            />
          </div>

          {/* Farmers */}
          <div className="mt-3 space-y-2">
            {filteredFarmers.map((farmer) => {
              const isSelected =
                selectedFarmer.token === farmer.token;

              return (
                <button
                  key={farmer.token}
                  onClick={() => selectFarmer(farmer)}
                  className={`w-full rounded-lg border p-3 text-left transition ${
                    isSelected
                      ? "border-green-300 bg-green-50"
                      : "border-slate-100 hover:border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-extrabold text-green-700">
                        {farmer.token}
                      </span>

                      <span className="text-[9px] font-bold text-blue-950">
                        {farmer.farmer}
                      </span>
                    </div>

                    <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
                  </div>

                  <div className="mt-1 flex items-center justify-between">
                    <span className="text-[8px] text-slate-500">
                      {farmer.crop} • {farmer.bookedQuantity} Qtl
                    </span>

                    <StatusBadge status={farmer.status} />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Procurement Process */}
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          {/* Selected Farmer */}
          <div className="flex flex-col gap-3 border-b border-slate-100 pb-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded-md bg-green-50 px-2 py-1 text-[9px] font-extrabold text-green-700">
                  {selectedFarmer.token}
                </span>

                <h2 className="text-xs font-extrabold text-blue-950">
                  {selectedFarmer.farmer}
                </h2>
              </div>

              <p className="mt-1 text-[9px] text-slate-500">
                {selectedFarmer.crop} • Booked Quantity:{" "}
                {selectedFarmer.bookedQuantity} Quintal
              </p>
            </div>

            <StatusBadge status={selectedFarmer.status} />
          </div>

          {/* Steps */}
          <div className="mt-5 grid grid-cols-3 gap-2">
            {steps.map((step, index) => {
              const isActive = activeStep === step.id;
              const stepIndex = steps.findIndex(
                (item) => item.id === activeStep
              );

              const currentIndex = index;

              const isDone = currentIndex < stepIndex;

              return (
                <div key={step.id} className="relative">
                  <div
                    className={`rounded-lg border p-3 ${
                      isActive
                        ? "border-green-300 bg-green-50"
                        : isDone
                        ? "border-green-200 bg-green-50/50"
                        : "border-slate-100 bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[9px] font-extrabold ${
                          isActive || isDone
                            ? "bg-green-700 text-white"
                            : "bg-slate-200 text-slate-500"
                        }`}
                      >
                        {isDone ? (
                          <CheckCircle2 className="h-3.5 w-3.5" />
                        ) : (
                          index + 1
                        )}
                      </div>

                      <p
                        className={`text-[8px] font-bold ${
                          isActive || isDone
                            ? "text-green-700"
                            : "text-slate-500"
                        }`}
                      >
                        {step.title}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quality Check */}
          {activeStep === "quality" && (
            <div className="mt-5">
              <div className="flex items-center gap-2">
                <ClipboardCheck className="h-4 w-4 text-green-700" />

                <div>
                  <h3 className="text-[11px] font-extrabold text-blue-950">
                    Quality Check
                  </h3>

                  <p className="text-[8px] text-slate-500">
                    Verify produce quality before weighing
                  </p>
                </div>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-lg border border-slate-200 p-3">
                  <div className="flex items-center gap-2">
                    <Droplets className="h-4 w-4 text-blue-600" />

                    <label className="text-[9px] font-bold text-slate-600">
                      Moisture Percentage
                    </label>
                  </div>

                  <div className="relative mt-2">
                    <input
                      type="number"
                      step="0.1"
                      value={moisture}
                      onChange={(event) =>
                        setMoisture(event.target.value)
                      }
                      className="h-10 w-full rounded-md border border-slate-200 pr-8 pl-3 text-xs outline-none focus:border-green-600"
                    />

                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                      %
                    </span>
                  </div>
                </div>

                <div className="rounded-lg border border-slate-200 p-3">
                  <label className="text-[9px] font-bold text-slate-600">
                    Quality Grade
                  </label>

                  <select
                    value={grade}
                    onChange={(event) => setGrade(event.target.value)}
                    className="mt-2 h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-xs outline-none focus:border-green-600"
                  >
                    <option value="A">Grade A</option>
                    <option value="B">Grade B</option>
                    <option value="C">Grade C</option>
                  </select>
                </div>
              </div>

              <div className="mt-4 rounded-lg bg-blue-50 p-3">
                <p className="text-[8px] font-bold text-blue-900">
                  Quality Result
                </p>

                <p className="mt-1 text-[9px] text-blue-800">
                  {Number(moisture) <= 13
                    ? "Quality is within the acceptable moisture range."
                    : "Moisture is above the preferred range. Verify quality carefully."}
                </p>
              </div>

              <button
                onClick={completeQualityCheck}
                className="mt-4 w-full rounded-md bg-green-700 py-2.5 text-[10px] font-bold text-white hover:bg-green-800"
              >
                Complete Quality Check
              </button>
            </div>
          )}

          {/* Weighing */}
          {activeStep === "weighing" && (
            <div className="mt-5">
              <div className="flex items-center gap-2">
                <Scale className="h-4 w-4 text-green-700" />

                <div>
                  <h3 className="text-[11px] font-extrabold text-blue-950">
                    Weighing
                  </h3>

                  <p className="text-[8px] text-slate-500">
                    Enter the actual quantity received
                  </p>
                </div>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-lg border border-slate-200 p-4">
                  <p className="text-[8px] font-semibold text-slate-500">
                    Booked Quantity
                  </p>

                  <p className="mt-1 text-xl font-extrabold text-blue-950">
                    {selectedFarmer.bookedQuantity} Qtl
                  </p>
                </div>

                <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                  <label className="text-[8px] font-semibold text-green-700">
                    Actual Quantity
                  </label>

                  <div className="relative mt-2">
                    <input
                      type="number"
                      step="0.1"
                      value={actualQuantity}
                      onChange={(event) =>
                        setActualQuantity(event.target.value)
                      }
                      className="h-10 w-full rounded-md border border-green-200 bg-white pr-12 pl-3 text-xs font-bold outline-none focus:border-green-600"
                    />

                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                      Qtl
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <InfoBox
                  label="Quality Grade"
                  value={`Grade ${grade}`}
                />

                <InfoBox
                  label="Moisture"
                  value={`${moisture}%`}
                />
              </div>

              <button
                onClick={completeWeighing}
                className="mt-4 w-full rounded-md bg-green-700 py-2.5 text-[10px] font-bold text-white hover:bg-green-800"
              >
                Confirm Weight
              </button>
            </div>
          )}

          {/* Complete Procurement */}
          {activeStep === "complete" && (
            <div className="mt-5">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-700" />

                <div>
                  <h3 className="text-[11px] font-extrabold text-blue-950">
                    Complete Procurement
                  </h3>

                  <p className="text-[8px] text-slate-500">
                    Review the final details before completing
                  </p>
                </div>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <InfoBox
                  label="Farmer"
                  value={selectedFarmer.farmer}
                />

                <InfoBox
                  label="Token"
                  value={selectedFarmer.token}
                />

                <InfoBox
                  label="Crop"
                  value={selectedFarmer.crop}
                />

                <InfoBox
                  label="Final Quantity"
                  value={`${actualQuantity} Quintal`}
                />

                <InfoBox
                  label="Quality"
                  value={`Grade ${grade}`}
                />

                <InfoBox
                  label="Rate"
                  value={`₹${selectedFarmer.rate.toLocaleString("en-IN")} / Qtl`}
                />
              </div>

              <div className="mt-4 rounded-lg bg-green-50 p-4">
                <p className="text-[8px] font-bold text-green-700">
                  Total Procurement Amount
                </p>

                <p className="mt-1 text-2xl font-extrabold text-green-700">
                  ₹
                  {totalAmount.toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
              </div>

              <button
                onClick={completeProcurement}
                disabled={selectedFarmer.status === "Completed"}
                className="mt-4 w-full rounded-md bg-green-700 py-2.5 text-[10px] font-bold text-white hover:bg-green-800 disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                {selectedFarmer.status === "Completed"
                  ? "Procurement Completed"
                  : "Complete Procurement"}
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Summary */}
      <section className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <SummaryCard
          label="Farmers Today"
          value={farmers.length}
        />

        <SummaryCard
          label="Completed"
          value={
            farmers.filter(
              (farmer) => farmer.status === "Completed"
            ).length
          }
        />

        <SummaryCard
          label="Pending"
          value={
            farmers.filter(
              (farmer) =>
                farmer.status === "Pending" ||
                farmer.status === "Quality Check"
            ).length
          }
        />

        <SummaryCard
          label="Total Quantity"
          value={`${farmers
            .filter((farmer) => farmer.status === "Completed")
            .reduce(
              (total, farmer) => total + farmer.bookedQuantity,
              0
            )} Qtl`}
        />
      </section>

      {/* Info */}
      <div className="mt-4 flex items-start gap-3 rounded-lg border border-blue-100 bg-blue-50 px-4 py-3">
        <ClipboardCheck className="mt-0.5 h-4 w-4 shrink-0 text-blue-700" />

        <div>
          <p className="text-[9px] font-bold text-blue-900">
            Procurement Process
          </p>

          <p className="mt-0.5 text-[8px] leading-4 text-blue-800">
            Complete quality verification and weighing before marking
            a farmer's procurement as completed.
          </p>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    "Quality Check": "bg-orange-50 text-orange-700",
    Pending: "bg-slate-100 text-slate-600",
    Completed: "bg-green-50 text-green-700",
  };

  return (
    <span
      className={`rounded-full px-2 py-1 text-[7px] font-bold ${
        styles[status] || "bg-slate-100 text-slate-600"
      }`}
    >
      {status}
    </span>
  );
}

function InfoBox({ label, value }) {
  return (
    <div className="rounded-lg border border-slate-100 bg-slate-50 p-3">
      <p className="text-[8px] font-semibold text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-[10px] font-extrabold text-blue-950">
        {value}
      </p>
    </div>
  );
}

function SummaryCard({ label, value }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-[9px] font-semibold text-slate-500">
        {label}
      </p>

      <p className="mt-2 text-xl font-extrabold text-blue-950">
        {value}
      </p>
    </div>
  );
}

export default Procurement;