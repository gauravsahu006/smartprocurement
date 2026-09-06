import { useMemo, useState } from "react";
import {
  CheckCircle2,
  Clock3,
  Eye,
  Filter,
  PackageCheck,
  Search,
  Scale,
  Wheat,
  XCircle,
} from "lucide-react";

const initialRecords = [
  {
    id: "PR241124",
    bookingId: "SP241124",
    farmer: "Rajesh Kumar",
    farmerId: "FR10241",
    centre: "ABC Procurement Centre",
    crop: "Wheat",
    bookedQuantity: 48.5,
    actualQuantity: 48.2,
    rate: 2125,
    amount: "₹1,02,425",
    moisture: "12.4%",
    grade: "A",
    status: "Completed",
    date: "06 Sep 2026",
  },
  {
    id: "PR241125",
    bookingId: "SP241125",
    farmer: "Ramesh Mahto",
    farmerId: "FR10242",
    centre: "Krishi Seva Kendra",
    crop: "Wheat",
    bookedQuantity: 32,
    actualQuantity: 31.8,
    rate: 2125,
    amount: "₹67,575",
    moisture: "13.1%",
    grade: "A",
    status: "Quality Check",
    date: "06 Sep 2026",
  },
  {
    id: "PR241126",
    bookingId: "SP241126",
    farmer: "Sita Devi",
    farmerId: "FR10243",
    centre: "Green Field Centre",
    crop: "Maize",
    bookedQuantity: 25,
    actualQuantity: 24.7,
    rate: 1980,
    amount: "₹48,906",
    moisture: "13.8%",
    grade: "B",
    status: "Weighing",
    date: "06 Sep 2026",
  },
  {
    id: "PR241120",
    bookingId: "SP241120",
    farmer: "Mohan Oraon",
    farmerId: "FR10237",
    centre: "ABC Procurement Centre",
    crop: "Wheat",
    bookedQuantity: 40,
    actualQuantity: 39.6,
    rate: 2125,
    amount: "₹84,150",
    moisture: "12.7%",
    grade: "A",
    status: "Completed",
    date: "05 Sep 2026",
  },
  {
    id: "PR241118",
    bookingId: "SP241118",
    farmer: "Birsa Tudu",
    farmerId: "FR10235",
    centre: "Shakti Kendra",
    crop: "Maize",
    bookedQuantity: 28,
    actualQuantity: 27.6,
    rate: 1980,
    amount: "₹54,648",
    moisture: "14.2%",
    grade: "B",
    status: "Payment Pending",
    date: "05 Sep 2026",
  },
  {
    id: "PR241115",
    bookingId: "SP241115",
    farmer: "Pawan Kumar",
    farmerId: "FR10231",
    centre: "Krishi Seva Kendra",
    crop: "Rice",
    bookedQuantity: 35,
    actualQuantity: 0,
    rate: 2183,
    amount: "₹0",
    moisture: "-",
    grade: "-",
    status: "Cancelled",
    date: "04 Sep 2026",
  },
];

function AdminProcurement() {
  const [records, setRecords] = useState(initialRecords);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("All");
  const [selectedRecord, setSelectedRecord] = useState(null);

  const tabs = [
    "All",
    "Quality Check",
    "Weighing",
    "Completed",
    "Payment Pending",
    "Cancelled",
  ];

  const filteredRecords = useMemo(() => {
    return records.filter((record) => {
      const matchesTab =
        activeTab === "All" || record.status === activeTab;

      const query = search.toLowerCase();

      const matchesSearch =
        record.id.toLowerCase().includes(query) ||
        record.bookingId.toLowerCase().includes(query) ||
        record.farmer.toLowerCase().includes(query) ||
        record.farmerId.toLowerCase().includes(query) ||
        record.centre.toLowerCase().includes(query) ||
        record.crop.toLowerCase().includes(query);

      return matchesTab && matchesSearch;
    });
  }, [records, activeTab, search]);

  const completed = records.filter(
    (record) => record.status === "Completed"
  ).length;

  const inProgress = records.filter(
    (record) =>
      record.status === "Quality Check" ||
      record.status === "Weighing"
  ).length;

  const paymentPending = records.filter(
    (record) => record.status === "Payment Pending"
  ).length;

  const totalQuantity = records.reduce(
    (sum, record) => sum + record.actualQuantity,
    0
  );

  const statusClasses = {
    "Quality Check": "bg-blue-50 text-blue-700",
    Weighing: "bg-amber-50 text-amber-700",
    Completed: "bg-green-50 text-green-700",
    "Payment Pending": "bg-purple-50 text-purple-700",
    Cancelled: "bg-red-50 text-red-700",
  };

  const statusIcon = {
    "Quality Check": <Clock3 className="h-3.5 w-3.5" />,
    Weighing: <Scale className="h-3.5 w-3.5" />,
    Completed: <CheckCircle2 className="h-3.5 w-3.5" />,
    "Payment Pending": <PackageCheck className="h-3.5 w-3.5" />,
    Cancelled: <XCircle className="h-3.5 w-3.5" />,
  };

  const markCompleted = (id) => {
    setRecords((current) =>
      current.map((record) =>
        record.id === id
          ? { ...record, status: "Completed" }
          : record
      )
    );

    setSelectedRecord((current) =>
      current
        ? { ...current, status: "Completed" }
        : current
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-semibold text-green-700">
            Procurement Monitoring
          </p>

          <h1 className="mt-1 text-2xl font-extrabold text-blue-950 sm:text-3xl">
            Procurement Overview
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Monitor farmer procurement, quality checks, weighing and payments.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600 shadow-sm">
          <Filter className="h-4 w-4 text-green-700" />
          06 September 2026
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500">
              Total Procurement
            </p>

            <div className="rounded-lg bg-green-50 p-2 text-green-700">
              <PackageCheck className="h-5 w-5" />
            </div>
          </div>

          <p className="mt-3 text-2xl font-extrabold text-blue-950">
            {records.length}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Today's records
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500">
              Completed
            </p>

            <div className="rounded-lg bg-green-50 p-2 text-green-700">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </div>

          <p className="mt-3 text-2xl font-extrabold text-green-700">
            {completed}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Successfully procured
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500">
              In Progress
            </p>

            <div className="rounded-lg bg-blue-50 p-2 text-blue-700">
              <Clock3 className="h-5 w-5" />
            </div>
          </div>

          <p className="mt-3 text-2xl font-extrabold text-blue-700">
            {inProgress}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Quality & weighing
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500">
              Total Quantity
            </p>

            <div className="rounded-lg bg-amber-50 p-2 text-amber-700">
              <Wheat className="h-5 w-5" />
            </div>
          </div>

          <p className="mt-3 text-2xl font-extrabold text-blue-950">
            {totalQuantity.toFixed(1)}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Quintal processed
          </p>
        </div>
      </div>

      {/* Payment pending alert */}
      <div className="flex flex-col gap-3 rounded-xl border border-purple-100 bg-purple-50 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-3">
          <PackageCheck className="mt-0.5 h-5 w-5 shrink-0 text-purple-700" />

          <div>
            <p className="text-sm font-bold text-purple-900">
              Payment Pending
            </p>

            <p className="mt-1 text-xs text-purple-800">
              {paymentPending} procurement record is waiting for payment processing.
            </p>
          </div>
        </div>

        <button
          onClick={() => setActiveTab("Payment Pending")}
          className="rounded-lg bg-purple-700 px-4 py-2 text-xs font-bold text-white hover:bg-purple-800"
        >
          View Pending
        </button>
      </div>

      {/* Filters */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-4">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`whitespace-nowrap rounded-lg px-3.5 py-2 text-xs font-bold transition ${
                  activeTab === tab
                    ? "bg-green-700 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="relative w-full lg:max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search farmer, centre or procurement ID..."
              className="h-10 w-full rounded-lg border border-slate-300 pl-9 pr-3 text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
            />
          </div>
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm lg:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px]">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-5 py-4 text-left text-xs font-bold text-slate-500">
                  Procurement
                </th>

                <th className="px-5 py-4 text-left text-xs font-bold text-slate-500">
                  Farmer
                </th>

                <th className="px-5 py-4 text-left text-xs font-bold text-slate-500">
                  Centre
                </th>

                <th className="px-5 py-4 text-left text-xs font-bold text-slate-500">
                  Crop
                </th>

                <th className="px-5 py-4 text-left text-xs font-bold text-slate-500">
                  Quantity
                </th>

                <th className="px-5 py-4 text-left text-xs font-bold text-slate-500">
                  Quality
                </th>

                <th className="px-5 py-4 text-left text-xs font-bold text-slate-500">
                  Status
                </th>

                <th className="px-5 py-4 text-right text-xs font-bold text-slate-500">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredRecords.map((record) => (
                <tr
                  key={record.id}
                  className="border-b border-slate-100 last:border-0 hover:bg-slate-50"
                >
                  <td className="px-5 py-4">
                    <p className="text-sm font-bold text-blue-950">
                      {record.id}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {record.bookingId}
                    </p>
                  </td>

                  <td className="px-5 py-4">
                    <p className="text-sm font-semibold text-slate-800">
                      {record.farmer}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {record.farmerId}
                    </p>
                  </td>

                  <td className="px-5 py-4">
                    <p className="text-sm font-semibold text-slate-800">
                      {record.centre}
                    </p>
                  </td>

                  <td className="px-5 py-4">
                    <span className="inline-flex items-center gap-1.5 rounded-lg bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700">
                      <Wheat className="h-3.5 w-3.5" />
                      {record.crop}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <p className="text-sm font-semibold text-slate-800">
                      {record.actualQuantity > 0
                        ? `${record.actualQuantity} Qtl`
                        : `${record.bookedQuantity} Qtl`}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      Booked: {record.bookedQuantity} Qtl
                    </p>
                  </td>

                  <td className="px-5 py-4">
                    <p className="text-sm font-semibold text-slate-800">
                      Grade {record.grade}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      Moisture {record.moisture}
                    </p>
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-bold ${statusClasses[record.status]}`}
                    >
                      {statusIcon[record.status]}
                      {record.status}
                    </span>
                  </td>

                  <td className="px-5 py-4 text-right">
                    <button
                      onClick={() => setSelectedRecord(record)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-blue-700 hover:bg-blue-50"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredRecords.length === 0 && (
          <div className="px-5 py-12 text-center">
            <PackageCheck className="mx-auto h-10 w-10 text-slate-300" />

            <p className="mt-3 text-sm font-bold text-slate-600">
              No procurement records found
            </p>
          </div>
        )}
      </div>

      {/* Mobile Cards */}
      <div className="space-y-4 lg:hidden">
        {filteredRecords.map((record) => (
          <div
            key={record.id}
            className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-extrabold text-blue-950">
                  {record.id}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  {record.bookingId}
                </p>
              </div>

              <span
                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold ${statusClasses[record.status]}`}
              >
                {statusIcon[record.status]}
                {record.status}
              </span>
            </div>

            <div className="mt-4 space-y-3">
              <div>
                <p className="text-[10px] font-semibold text-slate-400">
                  Farmer
                </p>

                <p className="mt-1 text-sm font-bold text-slate-800">
                  {record.farmer}
                </p>

                <p className="text-[11px] text-slate-500">
                  {record.farmerId}
                </p>
              </div>

              <div>
                <p className="text-[10px] font-semibold text-slate-400">
                  Procurement Centre
                </p>

                <p className="mt-1 text-sm font-bold text-slate-800">
                  {record.centre}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-slate-50 p-3">
                  <p className="text-[10px] font-semibold text-slate-400">
                    Crop
                  </p>

                  <p className="mt-1 text-xs font-bold text-slate-800">
                    {record.crop}
                  </p>
                </div>

                <div className="rounded-lg bg-slate-50 p-3">
                  <p className="text-[10px] font-semibold text-slate-400">
                    Quantity
                  </p>

                  <p className="mt-1 text-xs font-bold text-slate-800">
                    {record.actualQuantity > 0
                      ? `${record.actualQuantity} Qtl`
                      : "-"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-[10px] font-semibold text-slate-400">
                    Grade
                  </p>

                  <p className="mt-1 text-xs font-bold text-slate-800">
                    {record.grade}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] font-semibold text-slate-400">
                    Moisture
                  </p>

                  <p className="mt-1 text-xs font-bold text-slate-800">
                    {record.moisture}
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setSelectedRecord(record)}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 py-2.5 text-xs font-bold text-blue-700 hover:bg-blue-50"
            >
              <Eye className="h-4 w-4" />
              View Procurement Details
            </button>
          </div>
        ))}

        {filteredRecords.length === 0 && (
          <div className="rounded-xl border border-slate-200 bg-white px-5 py-12 text-center">
            <PackageCheck className="mx-auto h-10 w-10 text-slate-300" />

            <p className="mt-3 text-sm font-bold text-slate-600">
              No procurement records found
            </p>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="rounded-xl border border-green-100 bg-green-50 p-4">
        <div className="flex gap-3">
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-700" />

          <div>
            <p className="text-sm font-bold text-green-900">
              Procurement Monitoring
            </p>

            <p className="mt-1 text-xs leading-5 text-green-800">
              Track quality checks, actual weights, procurement values,
              payment status and completion progress across all centres.
            </p>
          </div>
        </div>
      </div>

      {/* Details Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4 py-6">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <div>
                <h2 className="text-lg font-extrabold text-blue-950">
                  Procurement Details
                </h2>

                <p className="mt-0.5 text-xs text-slate-500">
                  {selectedRecord.id}
                </p>
              </div>

              <button
                onClick={() => setSelectedRecord(null)}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-5 p-5">
              {/* Status */}
              <div className="flex items-center justify-between rounded-xl bg-slate-50 p-4">
                <div>
                  <p className="text-[11px] font-semibold text-slate-400">
                    Current Status
                  </p>

                  <span
                    className={`mt-2 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${statusClasses[selectedRecord.status]}`}
                  >
                    {statusIcon[selectedRecord.status]}
                    {selectedRecord.status}
                  </span>
                </div>

                <div className="text-right">
                  <p className="text-[11px] text-slate-400">
                    Date
                  </p>

                  <p className="mt-1 text-sm font-bold text-blue-950">
                    {selectedRecord.date}
                  </p>
                </div>
              </div>

              {/* Farmer */}
              <div>
                <p className="text-xs font-bold text-blue-950">
                  Farmer Information
                </p>

                <div className="mt-3 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[10px] text-slate-400">
                      Farmer Name
                    </p>

                    <p className="mt-1 text-sm font-bold text-slate-800">
                      {selectedRecord.farmer}
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] text-slate-400">
                      Farmer ID
                    </p>

                    <p className="mt-1 text-sm font-bold text-slate-800">
                      {selectedRecord.farmerId}
                    </p>
                  </div>
                </div>
              </div>

              {/* Procurement */}
              <div>
                <p className="text-xs font-bold text-blue-950">
                  Procurement Information
                </p>

                <div className="mt-3 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[10px] text-slate-400">
                      Booking ID
                    </p>

                    <p className="mt-1 text-sm font-bold text-slate-800">
                      {selectedRecord.bookingId}
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] text-slate-400">
                      Centre
                    </p>

                    <p className="mt-1 text-sm font-bold text-slate-800">
                      {selectedRecord.centre}
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] text-slate-400">
                      Crop
                    </p>

                    <p className="mt-1 text-sm font-bold text-slate-800">
                      {selectedRecord.crop}
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] text-slate-400">
                      Booked Quantity
                    </p>

                    <p className="mt-1 text-sm font-bold text-slate-800">
                      {selectedRecord.bookedQuantity} Qtl
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] text-slate-400">
                      Actual Quantity
                    </p>

                    <p className="mt-1 text-sm font-bold text-green-700">
                      {selectedRecord.actualQuantity > 0
                        ? `${selectedRecord.actualQuantity} Qtl`
                        : "-"}
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] text-slate-400">
                      Rate
                    </p>

                    <p className="mt-1 text-sm font-bold text-slate-800">
                      ₹{selectedRecord.rate.toLocaleString()} / Qtl
                    </p>
                  </div>
                </div>
              </div>

              {/* Quality */}
              <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
                <p className="text-xs font-bold text-blue-900">
                  Quality Check
                </p>

                <div className="mt-3 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[10px] text-blue-600">
                      Moisture
                    </p>

                    <p className="mt-1 text-sm font-bold text-blue-950">
                      {selectedRecord.moisture}
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] text-blue-600">
                      Grade
                    </p>

                    <p className="mt-1 text-sm font-bold text-blue-950">
                      Grade {selectedRecord.grade}
                    </p>
                  </div>
                </div>
              </div>

              {/* Amount */}
              <div className="flex items-center justify-between rounded-xl bg-green-50 p-4">
                <div>
                  <p className="text-xs font-semibold text-green-700">
                    Procurement Value
                  </p>

                  <p className="mt-1 text-xs text-green-800">
                    Based on actual quantity
                  </p>
                </div>

                <p className="text-xl font-extrabold text-green-800">
                  {selectedRecord.amount}
                </p>
              </div>

              {selectedRecord.status !== "Completed" &&
                selectedRecord.status !== "Cancelled" && (
                  <button
                    onClick={() => markCompleted(selectedRecord.id)}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-green-700 py-2.5 text-xs font-bold text-white hover:bg-green-800"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    Mark Procurement Completed
                  </button>
                )}

              <button
                onClick={() => setSelectedRecord(null)}
                className="w-full rounded-lg bg-slate-100 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminProcurement;