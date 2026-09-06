import { useMemo, useState } from "react";
import {
  CheckCircle2,
  Eye,
  Search,
  ShieldOff,
  UserRound,
  X,
} from "lucide-react";

const initialFarmers = [
  {
    id: "FRM1001",
    name: "Rajesh Kumar",
    mobile: "9876543210",
    location: "Ranchi, Jharkhand",
    crop: "Wheat",
    land: "4.5 Acres",
    bookings: 8,
    status: "Active",
    joined: "12 Aug 2026",
  },
  {
    id: "FRM1002",
    name: "Ramesh Mahto",
    mobile: "9123456780",
    location: "Khunti, Jharkhand",
    crop: "Rice",
    land: "6 Acres",
    bookings: 6,
    status: "Active",
    joined: "18 Aug 2026",
  },
  {
    id: "FRM1003",
    name: "Sita Devi",
    mobile: "9988776655",
    location: "Gumla, Jharkhand",
    crop: "Maize",
    land: "3.2 Acres",
    bookings: 5,
    status: "Pending",
    joined: "25 Aug 2026",
  },
  {
    id: "FRM1004",
    name: "Mohan Oraon",
    mobile: "9876123450",
    location: "Lohardaga, Jharkhand",
    crop: "Wheat",
    land: "5 Acres",
    bookings: 11,
    status: "Active",
    joined: "05 Aug 2026",
  },
  {
    id: "FRM1005",
    name: "Birsa Tudu",
    mobile: "9012345678",
    location: "Simdega, Jharkhand",
    crop: "Maize",
    land: "2.8 Acres",
    bookings: 3,
    status: "Blocked",
    joined: "30 Jul 2026",
  },
  {
    id: "FRM1006",
    name: "Pawan Kumar",
    mobile: "9345678120",
    location: "Hazaribagh, Jharkhand",
    crop: "Rice",
    land: "7.5 Acres",
    bookings: 9,
    status: "Active",
    joined: "22 Aug 2026",
  },
  {
    id: "FRM1007",
    name: "Sunita Devi",
    mobile: "9876501234",
    location: "Bokaro, Jharkhand",
    crop: "Wheat",
    land: "4 Acres",
    bookings: 4,
    status: "Pending",
    joined: "28 Aug 2026",
  },
  {
    id: "FRM1008",
    name: "Arjun Singh",
    mobile: "9090909090",
    location: "Ramgarh, Jharkhand",
    crop: "Rice",
    land: "8 Acres",
    bookings: 13,
    status: "Active",
    joined: "15 Jul 2026",
  },
];

const statusStyles = {
  Active: "bg-green-50 text-green-700",
  Pending: "bg-orange-50 text-orange-700",
  Blocked: "bg-red-50 text-red-700",
};

function Farmers() {
  const [farmers, setFarmers] = useState(initialFarmers);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedFarmer, setSelectedFarmer] = useState(null);

  const filteredFarmers = useMemo(() => {
    return farmers.filter((farmer) => {
      const searchValue = search.toLowerCase().trim();

      const matchesSearch =
        !searchValue ||
        farmer.name.toLowerCase().includes(searchValue) ||
        farmer.id.toLowerCase().includes(searchValue) ||
        farmer.mobile.includes(searchValue) ||
        farmer.location.toLowerCase().includes(searchValue);

      const matchesStatus =
        statusFilter === "All" || farmer.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [farmers, search, statusFilter]);

  const activeCount = farmers.filter(
    (farmer) => farmer.status === "Active"
  ).length;

  const pendingCount = farmers.filter(
    (farmer) => farmer.status === "Pending"
  ).length;

  const blockedCount = farmers.filter(
    (farmer) => farmer.status === "Blocked"
  ).length;

  const toggleBlock = (id) => {
    setFarmers((currentFarmers) =>
      currentFarmers.map((farmer) => {
        if (farmer.id !== id) {
          return farmer;
        }

        return {
          ...farmer,
          status:
            farmer.status === "Blocked"
              ? "Active"
              : "Blocked",
        };
      })
    );

    setSelectedFarmer(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <p className="text-sm font-semibold text-green-700">
          Farmer Management
        </p>

        <h1 className="mt-1 text-2xl font-extrabold text-blue-950 sm:text-3xl">
          Farmers
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Manage registered farmers and their account status.
        </p>
      </div>

      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-slate-500">
              Total Farmers
            </p>

            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
              <UserRound className="h-4 w-4" />
            </div>
          </div>

          <p className="mt-3 text-2xl font-extrabold text-blue-950">
            {farmers.length}
          </p>

          <p className="mt-1 text-[11px] text-slate-400">
            Registered accounts
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-slate-500">
              Active Farmers
            </p>

            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-50 text-green-700">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </div>

          <p className="mt-3 text-2xl font-extrabold text-blue-950">
            {activeCount}
          </p>

          <p className="mt-1 text-[11px] text-slate-400">
            Active accounts
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-slate-500">
              Pending Verification
            </p>

            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-50 text-orange-700">
              <ShieldOff className="h-4 w-4" />
            </div>
          </div>

          <p className="mt-3 text-2xl font-extrabold text-blue-950">
            {pendingCount}
          </p>

          <p className="mt-1 text-[11px] text-slate-400">
            Need verification
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-slate-500">
              Blocked Farmers
            </p>

            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50 text-red-600">
              <ShieldOff className="h-4 w-4" />
            </div>
          </div>

          <p className="mt-3 text-2xl font-extrabold text-blue-950">
            {blockedCount}
          </p>

          <p className="mt-1 text-[11px] text-slate-400">
            Restricted accounts
          </p>
        </div>
      </div>

      {/* Farmer List */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        {/* Toolbar */}
        <div className="border-b border-slate-100 p-4 sm:p-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-base font-extrabold text-blue-950">
                Registered Farmers
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Search and manage farmer accounts.
              </p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                <input
                  type="text"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search farmer..."
                  className="h-10 w-full rounded-lg border border-slate-300 pl-9 pr-3 text-xs text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-green-700 focus:ring-2 focus:ring-green-100 sm:w-64"
                />
              </div>

              {/* Filter */}
              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(event.target.value)
                }
                className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-xs font-semibold text-slate-600 outline-none focus:border-green-700 focus:ring-2 focus:ring-green-100"
              >
                <option value="All">All Status</option>
                <option value="Active">Active</option>
                <option value="Pending">Pending</option>
                <option value="Blocked">Blocked</option>
              </select>
            </div>
          </div>
        </div>

        {/* Desktop Table */}
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full min-w-[900px] text-left">
            <thead className="bg-slate-50">
              <tr className="text-[10px] font-extrabold uppercase tracking-wide text-slate-500">
                <th className="px-5 py-3">Farmer</th>
                <th className="px-5 py-3">Location</th>
                <th className="px-5 py-3">Crop</th>
                <th className="px-5 py-3">Bookings</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filteredFarmers.map((farmer) => (
                <tr
                  key={farmer.id}
                  className="transition hover:bg-slate-50/70"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-green-100 text-xs font-extrabold text-green-700">
                        {farmer.name.charAt(0)}
                      </div>

                      <div>
                        <p className="text-xs font-bold text-blue-950">
                          {farmer.name}
                        </p>

                        <p className="mt-0.5 text-[10px] text-slate-400">
                          {farmer.id} · {farmer.mobile}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-4 text-xs text-slate-600">
                    {farmer.location}
                  </td>

                  <td className="px-5 py-4">
                    <p className="text-xs font-semibold text-slate-700">
                      {farmer.crop}
                    </p>

                    <p className="mt-0.5 text-[10px] text-slate-400">
                      {farmer.land}
                    </p>
                  </td>

                  <td className="px-5 py-4 text-xs font-bold text-slate-700">
                    {farmer.bookings}
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${statusStyles[farmer.status]}`}
                    >
                      {farmer.status}
                    </span>
                  </td>

                  <td className="px-5 py-4 text-right">
                    <button
                      type="button"
                      onClick={() => setSelectedFarmer(farmer)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-[10px] font-bold text-blue-700 transition hover:border-blue-200 hover:bg-blue-50"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="divide-y divide-slate-100 md:hidden">
          {filteredFarmers.map((farmer) => (
            <div key={farmer.id} className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-100 text-sm font-extrabold text-green-700">
                    {farmer.name.charAt(0)}
                  </div>

                  <div>
                    <p className="text-sm font-bold text-blue-950">
                      {farmer.name}
                    </p>

                    <p className="mt-0.5 text-[10px] text-slate-400">
                      {farmer.id}
                    </p>
                  </div>
                </div>

                <span
                  className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${statusStyles[farmer.status]}`}
                >
                  {farmer.status}
                </span>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 rounded-lg bg-slate-50 p-3">
                <div>
                  <p className="text-[9px] font-bold uppercase text-slate-400">
                    Mobile
                  </p>

                  <p className="mt-1 text-[11px] font-semibold text-slate-700">
                    {farmer.mobile}
                  </p>
                </div>

                <div>
                  <p className="text-[9px] font-bold uppercase text-slate-400">
                    Crop
                  </p>

                  <p className="mt-1 text-[11px] font-semibold text-slate-700">
                    {farmer.crop}
                  </p>
                </div>

                <div>
                  <p className="text-[9px] font-bold uppercase text-slate-400">
                    Location
                  </p>

                  <p className="mt-1 text-[11px] font-semibold text-slate-700">
                    {farmer.location}
                  </p>
                </div>

                <div>
                  <p className="text-[9px] font-bold uppercase text-slate-400">
                    Bookings
                  </p>

                  <p className="mt-1 text-[11px] font-semibold text-slate-700">
                    {farmer.bookings}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedFarmer(farmer)}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 py-2.5 text-xs font-bold text-blue-700"
              >
                <Eye className="h-4 w-4" />
                View Details
              </button>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredFarmers.length === 0 && (
          <div className="px-5 py-12 text-center">
            <Search className="mx-auto h-8 w-8 text-slate-300" />

            <p className="mt-3 text-sm font-bold text-blue-950">
              No farmers found
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Try changing your search or filter.
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="border-t border-slate-100 px-5 py-3">
          <p className="text-[10px] font-medium text-slate-400">
            Showing {filteredFarmers.length} of {farmers.length} farmers
          </p>
        </div>
      </div>

      {/* Info */}
      <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
        <p className="text-xs font-bold text-blue-800">
          Farmer Account Management
        </p>

        <p className="mt-1 text-[11px] leading-5 text-blue-700">
          Admins can review farmer information and restrict accounts
          when necessary. Blocking an account prevents the farmer from
          accessing the system.
        </p>
      </div>

      {/* Details Modal */}
      {selectedFarmer && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/40 px-4 py-6">
          <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wide text-green-700">
                  Farmer Details
                </p>

                <h2 className="mt-1 text-lg font-extrabold text-blue-950">
                  {selectedFarmer.name}
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setSelectedFarmer(null)}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="space-y-4 p-5">
              <div className="flex items-center gap-3 rounded-xl bg-green-50 p-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-lg font-extrabold text-green-700">
                  {selectedFarmer.name.charAt(0)}
                </div>

                <div>
                  <p className="text-sm font-bold text-blue-950">
                    {selectedFarmer.name}
                  </p>

                  <p className="mt-1 text-[11px] text-slate-500">
                    Farmer ID: {selectedFarmer.id}
                  </p>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-lg border border-slate-200 p-3">
                  <p className="text-[9px] font-bold uppercase text-slate-400">
                    Mobile Number
                  </p>

                  <p className="mt-1 text-xs font-bold text-slate-700">
                    {selectedFarmer.mobile}
                  </p>
                </div>

                <div className="rounded-lg border border-slate-200 p-3">
                  <p className="text-[9px] font-bold uppercase text-slate-400">
                    Status
                  </p>

                  <span
                    className={`mt-1 inline-block rounded-full px-2.5 py-1 text-[10px] font-bold ${statusStyles[selectedFarmer.status]}`}
                  >
                    {selectedFarmer.status}
                  </span>
                </div>

                <div className="rounded-lg border border-slate-200 p-3">
                  <p className="text-[9px] font-bold uppercase text-slate-400">
                    Location
                  </p>

                  <p className="mt-1 text-xs font-bold text-slate-700">
                    {selectedFarmer.location}
                  </p>
                </div>

                <div className="rounded-lg border border-slate-200 p-3">
                  <p className="text-[9px] font-bold uppercase text-slate-400">
                    Primary Crop
                  </p>

                  <p className="mt-1 text-xs font-bold text-slate-700">
                    {selectedFarmer.crop}
                  </p>
                </div>

                <div className="rounded-lg border border-slate-200 p-3">
                  <p className="text-[9px] font-bold uppercase text-slate-400">
                    Landholding
                  </p>

                  <p className="mt-1 text-xs font-bold text-slate-700">
                    {selectedFarmer.land}
                  </p>
                </div>

                <div className="rounded-lg border border-slate-200 p-3">
                  <p className="text-[9px] font-bold uppercase text-slate-400">
                    Total Bookings
                  </p>

                  <p className="mt-1 text-xs font-bold text-slate-700">
                    {selectedFarmer.bookings}
                  </p>
                </div>
              </div>

              <div className="rounded-lg bg-slate-50 p-3">
                <p className="text-[9px] font-bold uppercase text-slate-400">
                  Registered On
                </p>

                <p className="mt-1 text-xs font-semibold text-slate-700">
                  {selectedFarmer.joined}
                </p>
              </div>

              {/* Actions */}
              <div className="flex flex-col-reverse gap-2 pt-1 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedFarmer(null)}
                  className="rounded-lg border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  Close
                </button>

                <button
                  type="button"
                  onClick={() => toggleBlock(selectedFarmer.id)}
                  className={`rounded-lg px-4 py-2.5 text-xs font-bold text-white ${
                    selectedFarmer.status === "Blocked"
                      ? "bg-green-700 hover:bg-green-800"
                      : "bg-red-600 hover:bg-red-700"
                  }`}
                >
                  {selectedFarmer.status === "Blocked"
                    ? "Unblock Farmer"
                    : "Block Farmer"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Farmers;