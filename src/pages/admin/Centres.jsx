import { useMemo, useState } from "react";
import {
  Building2,
  CheckCircle2,
  Eye,
  MapPin,
  Phone,
  Search,
  Users,
  X,
} from "lucide-react";

const initialCentres = [
  {
    id: "CTR1001",
    name: "ABC Procurement Centre",
    officer: "Amit Kumar",
    mobile: "9876543210",
    location: "Ranchi, Jharkhand",
    address: "Main Market Road, Ranchi",
    status: "Active",
    capacity: 85,
    queue: 12,
    farmers: 145,
    bookings: 68,
    crops: "Wheat, Rice, Maize",
    joined: "10 Jul 2026",
  },
  {
    id: "CTR1002",
    name: "Krishi Seva Kendra",
    officer: "Suresh Mahto",
    mobile: "9123456780",
    location: "Khunti, Jharkhand",
    address: "Station Road, Khunti",
    status: "Active",
    capacity: 70,
    queue: 8,
    farmers: 118,
    bookings: 54,
    crops: "Wheat, Rice",
    joined: "15 Jul 2026",
  },
  {
    id: "CTR1003",
    name: "Green Field Centre",
    officer: "Ravi Oraon",
    mobile: "9988776655",
    location: "Gumla, Jharkhand",
    address: "Agriculture Market, Gumla",
    status: "Active",
    capacity: 60,
    queue: 8,
    farmers: 96,
    bookings: 42,
    crops: "Maize, Wheat",
    joined: "22 Jul 2026",
  },
  {
    id: "CTR1004",
    name: "Shakti Kendra",
    officer: "Manoj Singh",
    mobile: "9012345678",
    location: "Lohardaga, Jharkhand",
    address: "Block Market Road, Lohardaga",
    status: "Pending",
    capacity: 45,
    queue: 0,
    farmers: 72,
    bookings: 28,
    crops: "Rice, Maize",
    joined: "28 Aug 2026",
  },
  {
    id: "CTR1005",
    name: "Kisan Suvidha Centre",
    officer: "Deepak Kumar",
    mobile: "9345678120",
    location: "Hazaribagh, Jharkhand",
    address: "Old Bus Stand Road, Hazaribagh",
    status: "Active",
    capacity: 78,
    queue: 15,
    farmers: 132,
    bookings: 61,
    crops: "Wheat, Rice, Maize",
    joined: "02 Aug 2026",
  },
  {
    id: "CTR1006",
    name: "Jan Seva Procurement Centre",
    officer: "Vijay Tudu",
    mobile: "9090909090",
    location: "Simdega, Jharkhand",
    address: "Main Bazaar, Simdega",
    status: "Inactive",
    capacity: 0,
    queue: 0,
    farmers: 51,
    bookings: 19,
    crops: "Rice, Wheat",
    joined: "05 Jun 2026",
  },
];

const statusStyles = {
  Active: "bg-green-50 text-green-700",
  Pending: "bg-orange-50 text-orange-700",
  Inactive: "bg-red-50 text-red-700",
};

function Centres() {
  const [centres, setCentres] = useState(initialCentres);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedCentre, setSelectedCentre] = useState(null);

  const filteredCentres = useMemo(() => {
    return centres.filter((centre) => {
      const searchValue = search.toLowerCase().trim();

      const matchesSearch =
        !searchValue ||
        centre.name.toLowerCase().includes(searchValue) ||
        centre.id.toLowerCase().includes(searchValue) ||
        centre.officer.toLowerCase().includes(searchValue) ||
        centre.location.toLowerCase().includes(searchValue);

      const matchesStatus =
        statusFilter === "All" ||
        centre.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [centres, search, statusFilter]);

  const activeCount = centres.filter(
    (centre) => centre.status === "Active"
  ).length;

  const pendingCount = centres.filter(
    (centre) => centre.status === "Pending"
  ).length;

  const inactiveCount = centres.filter(
    (centre) => centre.status === "Inactive"
  ).length;

  const totalQueue = centres.reduce(
    (total, centre) => total + centre.queue,
    0
  );

  const toggleStatus = (id) => {
    setCentres((currentCentres) =>
      currentCentres.map((centre) => {
        if (centre.id !== id) {
          return centre;
        }

        return {
          ...centre,
          status:
            centre.status === "Active"
              ? "Inactive"
              : "Active",
        };
      })
    );

    setSelectedCentre(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <p className="text-sm font-semibold text-green-700">
          Centre Management
        </p>

        <h1 className="mt-1 text-2xl font-extrabold text-blue-950 sm:text-3xl">
          Procurement Centres
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Manage procurement centres, officers and centre operations.
        </p>
      </div>

      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-slate-500">
              Total Centres
            </p>

            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
              <Building2 className="h-4 w-4" />
            </div>
          </div>

          <p className="mt-3 text-2xl font-extrabold text-blue-950">
            {centres.length}
          </p>

          <p className="mt-1 text-[11px] text-slate-400">
            Registered centres
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-slate-500">
              Active Centres
            </p>

            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-50 text-green-700">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </div>

          <p className="mt-3 text-2xl font-extrabold text-blue-950">
            {activeCount}
          </p>

          <p className="mt-1 text-[11px] text-slate-400">
            Currently operational
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-slate-500">
              Pending Approval
            </p>

            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-50 text-orange-700">
              <Building2 className="h-4 w-4" />
            </div>
          </div>

          <p className="mt-3 text-2xl font-extrabold text-blue-950">
            {pendingCount}
          </p>

          <p className="mt-1 text-[11px] text-slate-400">
            Need admin review
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-slate-500">
              Farmers in Queue
            </p>

            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-50 text-purple-700">
              <Users className="h-4 w-4" />
            </div>
          </div>

          <p className="mt-3 text-2xl font-extrabold text-blue-950">
            {totalQueue}
          </p>

          <p className="mt-1 text-[11px] text-slate-400">
            Across active centres
          </p>
        </div>
      </div>

      {/* Centre List */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        {/* Toolbar */}
        <div className="border-b border-slate-100 p-4 sm:p-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-base font-extrabold text-blue-950">
                Registered Centres
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Search and manage procurement centres.
              </p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                <input
                  type="text"
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                  placeholder="Search centre..."
                  className="h-10 w-full rounded-lg border border-slate-300 pl-9 pr-3 text-xs text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-green-700 focus:ring-2 focus:ring-green-100 sm:w-64"
                />
              </div>

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
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        {/* Desktop Table */}
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full min-w-[1000px] text-left">
            <thead className="bg-slate-50">
              <tr className="text-[10px] font-extrabold uppercase tracking-wide text-slate-500">
                <th className="px-5 py-3">Centre</th>
                <th className="px-5 py-3">Officer</th>
                <th className="px-5 py-3">Location</th>
                <th className="px-5 py-3">Queue</th>
                <th className="px-5 py-3">Capacity</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filteredCentres.map((centre) => (
                <tr
                  key={centre.id}
                  className="transition hover:bg-slate-50/70"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-green-50 text-green-700">
                        <Building2 className="h-5 w-5" />
                      </div>

                      <div>
                        <p className="text-xs font-bold text-blue-950">
                          {centre.name}
                        </p>

                        <p className="mt-0.5 text-[10px] text-slate-400">
                          {centre.id}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    <p className="text-xs font-semibold text-slate-700">
                      {centre.officer}
                    </p>

                    <p className="mt-0.5 text-[10px] text-slate-400">
                      {centre.mobile}
                    </p>
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1.5 text-xs text-slate-600">
                      <MapPin className="h-3.5 w-3.5 text-slate-400" />
                      {centre.location}
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    <span className="text-xs font-bold text-blue-950">
                      {centre.queue}
                    </span>

                    <span className="ml-1 text-[10px] text-slate-400">
                      farmers
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <div className="w-24">
                      <div className="flex justify-between text-[10px]">
                        <span className="font-bold text-slate-600">
                          {centre.capacity}%
                        </span>

                        <span className="text-slate-400">
                          used
                        </span>
                      </div>

                      <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className={`h-full rounded-full ${
                            centre.capacity >= 80
                              ? "bg-orange-500"
                              : centre.capacity === 0
                                ? "bg-slate-300"
                                : "bg-green-600"
                          }`}
                          style={{
                            width: `${centre.capacity}%`,
                          }}
                        />
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${statusStyles[centre.status]}`}
                    >
                      {centre.status}
                    </span>
                  </td>

                  <td className="px-5 py-4 text-right">
                    <button
                      type="button"
                      onClick={() =>
                        setSelectedCentre(centre)
                      }
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
          {filteredCentres.map((centre) => (
            <div key={centre.id} className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-green-50 text-green-700">
                    <Building2 className="h-5 w-5" />
                  </div>

                  <div>
                    <p className="text-sm font-bold text-blue-950">
                      {centre.name}
                    </p>

                    <p className="mt-0.5 text-[10px] text-slate-400">
                      {centre.id}
                    </p>
                  </div>
                </div>

                <span
                  className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${statusStyles[centre.status]}`}
                >
                  {centre.status}
                </span>
              </div>

              <div className="mt-4 space-y-3 rounded-lg bg-slate-50 p-3">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-slate-400" />

                  <p className="text-[11px] font-semibold text-slate-700">
                    {centre.location}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-[9px] font-bold uppercase text-slate-400">
                      Officer
                    </p>

                    <p className="mt-1 text-[11px] font-semibold text-slate-700">
                      {centre.officer}
                    </p>
                  </div>

                  <div>
                    <p className="text-[9px] font-bold uppercase text-slate-400">
                      Queue
                    </p>

                    <p className="mt-1 text-[11px] font-semibold text-slate-700">
                      {centre.queue} farmers
                    </p>
                  </div>

                  <div>
                    <p className="text-[9px] font-bold uppercase text-slate-400">
                      Capacity
                    </p>

                    <p className="mt-1 text-[11px] font-semibold text-slate-700">
                      {centre.capacity}% used
                    </p>
                  </div>

                  <div>
                    <p className="text-[9px] font-bold uppercase text-slate-400">
                      Bookings
                    </p>

                    <p className="mt-1 text-[11px] font-semibold text-slate-700">
                      {centre.bookings}
                    </p>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedCentre(centre)}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 py-2.5 text-xs font-bold text-blue-700"
              >
                <Eye className="h-4 w-4" />
                View Details
              </button>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredCentres.length === 0 && (
          <div className="px-5 py-12 text-center">
            <Search className="mx-auto h-8 w-8 text-slate-300" />

            <p className="mt-3 text-sm font-bold text-blue-950">
              No centres found
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Try changing your search or filter.
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="border-t border-slate-100 px-5 py-3">
          <p className="text-[10px] font-medium text-slate-400">
            Showing {filteredCentres.length} of {centres.length} centres
          </p>
        </div>
      </div>

      {/* Info */}
      <div className="rounded-xl border border-green-100 bg-green-50 p-4">
        <p className="text-xs font-bold text-green-800">
          Centre Operations
        </p>

        <p className="mt-1 text-[11px] leading-5 text-green-700">
          Admins can monitor centre capacity, queue activity and
          officer information. Inactive centres will not be available
          for new farmer bookings.
        </p>
      </div>

      {/* Details Modal */}
      {selectedCentre && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/40 px-4 py-6">
          <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wide text-green-700">
                  Centre Details
                </p>

                <h2 className="mt-1 text-lg font-extrabold text-blue-950">
                  {selectedCentre.name}
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setSelectedCentre(null)}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="space-y-4 p-5">
              <div className="flex items-center gap-3 rounded-xl bg-green-50 p-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white text-green-700 shadow-sm">
                  <Building2 className="h-6 w-6" />
                </div>

                <div className="min-w-0">
                  <p className="text-sm font-extrabold text-blue-950">
                    {selectedCentre.name}
                  </p>

                  <p className="mt-1 text-[10px] text-slate-500">
                    Centre ID: {selectedCentre.id}
                  </p>
                </div>

                <span
                  className={`ml-auto shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold ${statusStyles[selectedCentre.status]}`}
                >
                  {selectedCentre.status}
                </span>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-lg border border-slate-200 p-3">
                  <p className="text-[9px] font-bold uppercase text-slate-400">
                    Officer
                  </p>

                  <p className="mt-1 text-xs font-bold text-slate-700">
                    {selectedCentre.officer}
                  </p>
                </div>

                <div className="rounded-lg border border-slate-200 p-3">
                  <p className="text-[9px] font-bold uppercase text-slate-400">
                    Mobile
                  </p>

                  <div className="mt-1 flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5 text-green-700" />

                    <p className="text-xs font-bold text-slate-700">
                      {selectedCentre.mobile}
                    </p>
                  </div>
                </div>

                <div className="rounded-lg border border-slate-200 p-3 sm:col-span-2">
                  <p className="text-[9px] font-bold uppercase text-slate-400">
                    Address
                  </p>

                  <div className="mt-1 flex items-start gap-1.5">
                    <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-green-700" />

                    <p className="text-xs font-bold text-slate-700">
                      {selectedCentre.address}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div className="rounded-lg bg-slate-50 p-3 text-center">
                  <p className="text-[9px] font-bold text-slate-400">
                    Queue
                  </p>

                  <p className="mt-1 text-lg font-extrabold text-blue-950">
                    {selectedCentre.queue}
                  </p>
                </div>

                <div className="rounded-lg bg-slate-50 p-3 text-center">
                  <p className="text-[9px] font-bold text-slate-400">
                    Capacity
                  </p>

                  <p className="mt-1 text-lg font-extrabold text-blue-950">
                    {selectedCentre.capacity}%
                  </p>
                </div>

                <div className="rounded-lg bg-slate-50 p-3 text-center">
                  <p className="text-[9px] font-bold text-slate-400">
                    Farmers
                  </p>

                  <p className="mt-1 text-lg font-extrabold text-blue-950">
                    {selectedCentre.farmers}
                  </p>
                </div>

                <div className="rounded-lg bg-slate-50 p-3 text-center">
                  <p className="text-[9px] font-bold text-slate-400">
                    Bookings
                  </p>

                  <p className="mt-1 text-lg font-extrabold text-blue-950">
                    {selectedCentre.bookings}
                  </p>
                </div>
              </div>

              <div className="rounded-lg border border-slate-200 p-4">
                <p className="text-[9px] font-bold uppercase text-slate-400">
                  Accepted Crops
                </p>

                <p className="mt-1 text-xs font-semibold text-slate-700">
                  {selectedCentre.crops}
                </p>
              </div>

              <div className="rounded-lg border border-slate-200 p-4">
                <p className="text-[9px] font-bold uppercase text-slate-400">
                  Registered On
                </p>

                <p className="mt-1 text-xs font-semibold text-slate-700">
                  {selectedCentre.joined}
                </p>
              </div>

              {/* Actions */}
              <div className="flex flex-col-reverse gap-2 pt-1 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedCentre(null)}
                  className="rounded-lg border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  Close
                </button>

                {selectedCentre.status !== "Pending" && (
                  <button
                    type="button"
                    onClick={() =>
                      toggleStatus(selectedCentre.id)
                    }
                    className={`rounded-lg px-4 py-2.5 text-xs font-bold text-white ${
                      selectedCentre.status === "Inactive"
                        ? "bg-green-700 hover:bg-green-800"
                        : "bg-red-600 hover:bg-red-700"
                    }`}
                  >
                    {selectedCentre.status === "Inactive"
                      ? "Activate Centre"
                      : "Deactivate Centre"}
                  </button>
                )}

                {selectedCentre.status === "Pending" && (
                  <button
                    type="button"
                    onClick={() =>
                      toggleStatus(selectedCentre.id)
                    }
                    className="rounded-lg bg-green-700 px-4 py-2.5 text-xs font-bold text-white hover:bg-green-800"
                  >
                    Approve Centre
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Centres;