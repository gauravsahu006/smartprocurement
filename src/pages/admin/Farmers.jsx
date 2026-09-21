import { useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  Eye,
  Search,
  ShieldOff,
  UserRound,
  X,
} from "lucide-react";

import { supabase } from "../../lib/supabase";

const statusStyles = {
  Active: "bg-green-50 text-green-700",
  Pending: "bg-orange-50 text-orange-700",
  Blocked: "bg-red-50 text-red-700",
};

function Farmers() {
  const [farmers, setFarmers] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedFarmer, setSelectedFarmer] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // --------------------------------------------------
  // FETCH FARMERS
  // --------------------------------------------------

  const loadFarmers = async () => {
    try {
      setLoading(true);
      setError("");

      // ----------------------------------------------
      // 1. Get all farmer profiles
      // ----------------------------------------------

      const { data: profiles, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("role", "farmer")
        .order("created_at", { ascending: false });

      if (profileError) {
        throw profileError;
      }

      if (!profiles || profiles.length === 0) {
        setFarmers([]);
        return;
      }

      // ----------------------------------------------
      // 2. Get bookings of all farmers
      // ----------------------------------------------

      const farmerIds = profiles.map((farmer) => farmer.id);

      const { data: bookings, error: bookingError } = await supabase
        .from("bookings")
        .select("*")
        .in("farmer_id", farmerIds)
        .order("created_at", { ascending: false });

      if (bookingError) {
        throw bookingError;
      }

      // ----------------------------------------------
      // 3. Get crops
      // ----------------------------------------------

      const cropIds = [
        ...new Set(
          (bookings || [])
            .map((booking) => booking.crop_id)
            .filter(Boolean)
        ),
      ];

      let cropMap = {};

      if (cropIds.length > 0) {
        const { data: crops, error: cropError } = await supabase
          .from("crops")
          .select("*")
          .in("id", cropIds);

        if (cropError) {
          throw cropError;
        }

        crops?.forEach((crop) => {
          cropMap[crop.id] =
            crop.name ||
            crop.crop_name ||
            crop.title ||
            "Unknown Crop";
        });
      }

      // ----------------------------------------------
      // 4. Prepare booking information
      // ----------------------------------------------

      const bookingMap = {};

      (bookings || []).forEach((booking) => {
        if (!bookingMap[booking.farmer_id]) {
          bookingMap[booking.farmer_id] = [];
        }

        bookingMap[booking.farmer_id].push(booking);
      });

      // ----------------------------------------------
      // 5. Convert DB data → UI data
      // ----------------------------------------------

      const formattedFarmers = profiles.map((profile, index) => {
        const farmerBookings = bookingMap[profile.id] || [];

        const latestBooking = farmerBookings[0];

        const rawStatus =
          profile.account_status ||
          profile.status ||
          "active";

        const status =
          rawStatus === "blocked"
            ? "Blocked"
            : rawStatus === "pending"
              ? "Pending"
              : "Active";

        // Try common profile field names.
        const name =
          profile.full_name ||
          profile.name ||
          profile.username ||
          "Unknown Farmer";

        const mobile =
          profile.mobile ||
          profile.phone ||
          profile.phone_number ||
          "Not provided";

        const location =
          profile.location ||
          profile.address ||
          profile.village ||
          profile.district ||
          "Not provided";

        const landValue =
          profile.land_acres ??
          profile.land_area ??
          profile.landholding ??
          profile.land ??
          null;

        const crop =
          latestBooking?.crop_id &&
          cropMap[latestBooking.crop_id]
            ? cropMap[latestBooking.crop_id]
            : "Not available";

        return {
          id: `FRM${String(index + 1).padStart(4, "0")}`,
          databaseId: profile.id,

          name,
          mobile,
          location,

          crop,

          land:
            landValue !== null
              ? `${landValue} Acres`
              : "Not provided",

          bookings: farmerBookings.length,

          status,

          joined: profile.created_at
            ? formatDate(profile.created_at)
            : "Not available",

          created_at: profile.created_at,
        };
      });

      setFarmers(formattedFarmers);
    } catch (err) {
      console.error("Farmers load error:", err);

      setError(
        err?.message ||
          "Unable to load farmers. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------------
  // INITIAL LOAD
  // --------------------------------------------------

  useEffect(() => {
    loadFarmers();
  }, []);

  // --------------------------------------------------
  // SEARCH + FILTER
  // --------------------------------------------------

  const filteredFarmers = useMemo(() => {
    return farmers.filter((farmer) => {
      const searchValue = search.toLowerCase().trim();

      const matchesSearch =
        !searchValue ||
        farmer.name.toLowerCase().includes(searchValue) ||
        farmer.id.toLowerCase().includes(searchValue) ||
        farmer.mobile.toLowerCase().includes(searchValue) ||
        farmer.location.toLowerCase().includes(searchValue) ||
        farmer.crop.toLowerCase().includes(searchValue);

      const matchesStatus =
        statusFilter === "All" ||
        farmer.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [farmers, search, statusFilter]);

  // --------------------------------------------------
  // COUNTS
  // --------------------------------------------------

  const activeCount = farmers.filter(
    (farmer) => farmer.status === "Active"
  ).length;

  const pendingCount = farmers.filter(
    (farmer) => farmer.status === "Pending"
  ).length;

  const blockedCount = farmers.filter(
    (farmer) => farmer.status === "Blocked"
  ).length;

  // --------------------------------------------------
  // BLOCK / UNBLOCK
  // --------------------------------------------------

  const toggleBlock = async (farmer) => {
    try {
      setSaving(true);
      setError("");

      const isBlocked = farmer.status === "Blocked";

      const newStatus = isBlocked
        ? "active"
        : "blocked";

      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          account_status: newStatus,
        })
        .eq("id", farmer.databaseId);

      if (updateError) {
        throw updateError;
      }

      // Update UI after DB update succeeds
      setFarmers((currentFarmers) =>
        currentFarmers.map((item) =>
          item.databaseId === farmer.databaseId
            ? {
                ...item,
                status: isBlocked
                  ? "Active"
                  : "Blocked",
              }
            : item
        )
      );

      setSelectedFarmer(null);
    } catch (err) {
      console.error("Block/unblock error:", err);

      setError(
        err?.message ||
          "Unable to update farmer status."
      );
    } finally {
      setSaving(false);
    }
  };

  // --------------------------------------------------
  // DATE
  // --------------------------------------------------

  function formatDate(dateString) {
    return new Intl.DateTimeFormat("en-IN", {
      timeZone: "Asia/Kolkata",
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(dateString));
  }

  // --------------------------------------------------
  // LOADING
  // --------------------------------------------------

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-green-600" />

          <p className="mt-3 text-sm font-semibold text-slate-500">
            Loading farmers...
          </p>
        </div>
      </div>
    );
  }

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

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

      {/* Error */}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4">
          <p className="text-xs font-bold text-red-800">
            Error
          </p>

          <p className="mt-1 text-xs text-red-700">
            {error}
          </p>

          <button
            onClick={loadFarmers}
            className="mt-3 rounded-lg bg-red-600 px-4 py-2 text-xs font-bold text-white hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Summary */}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

        <SummaryCard
          title="Total Farmers"
          value={farmers.length}
          note="Registered accounts"
          icon={UserRound}
          iconClass="bg-blue-50 text-blue-700"
        />

        <SummaryCard
          title="Active Farmers"
          value={activeCount}
          note="Active accounts"
          icon={CheckCircle2}
          iconClass="bg-green-50 text-green-700"
        />

        <SummaryCard
          title="Pending Verification"
          value={pendingCount}
          note="Need verification"
          icon={ShieldOff}
          iconClass="bg-orange-50 text-orange-700"
        />

        <SummaryCard
          title="Blocked Farmers"
          value={blockedCount}
          note="Restricted accounts"
          icon={ShieldOff}
          iconClass="bg-red-50 text-red-600"
        />

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
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
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
                <option value="All">
                  All Status
                </option>

                <option value="Active">
                  Active
                </option>

                <option value="Pending">
                  Pending
                </option>

                <option value="Blocked">
                  Blocked
                </option>
              </select>

            </div>
          </div>
        </div>

        {/* Desktop Table */}

        <div className="hidden overflow-x-auto md:block">

          <table className="w-full min-w-[900px] text-left">

            <thead className="bg-slate-50">
              <tr className="text-[10px] font-extrabold uppercase tracking-wide text-slate-500">

                <th className="px-5 py-3">
                  Farmer
                </th>

                <th className="px-5 py-3">
                  Location
                </th>

                <th className="px-5 py-3">
                  Crop
                </th>

                <th className="px-5 py-3">
                  Bookings
                </th>

                <th className="px-5 py-3">
                  Status
                </th>

                <th className="px-5 py-3 text-right">
                  Action
                </th>

              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">

              {filteredFarmers.map((farmer) => (

                <tr
                  key={farmer.databaseId}
                  className="transition hover:bg-slate-50/70"
                >

                  <td className="px-5 py-4">

                    <div className="flex items-center gap-3">

                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-green-100 text-xs font-extrabold text-green-700">
                        {farmer.name.charAt(0).toUpperCase()}
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
                      className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
                        statusStyles[farmer.status]
                      }`}
                    >
                      {farmer.status}
                    </span>

                  </td>

                  <td className="px-5 py-4 text-right">

                    <button
                      type="button"
                      onClick={() =>
                        setSelectedFarmer(farmer)
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

        {/* Mobile */}

        <div className="divide-y divide-slate-100 md:hidden">

          {filteredFarmers.map((farmer) => (

            <div
              key={farmer.databaseId}
              className="p-4"
            >

              <div className="flex items-start justify-between gap-3">

                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-100 text-sm font-extrabold text-green-700">
                    {farmer.name.charAt(0).toUpperCase()}
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

                <StatusBadge status={farmer.status} />

              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 rounded-lg bg-slate-50 p-3">

                <InfoItem
                  label="Mobile"
                  value={farmer.mobile}
                />

                <InfoItem
                  label="Crop"
                  value={farmer.crop}
                />

                <InfoItem
                  label="Location"
                  value={farmer.location}
                />

                <InfoItem
                  label="Bookings"
                  value={farmer.bookings}
                />

              </div>

              <button
                type="button"
                onClick={() =>
                  setSelectedFarmer(farmer)
                }
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 py-2.5 text-xs font-bold text-blue-700"
              >
                <Eye className="h-4 w-4" />
                View Details
              </button>

            </div>

          ))}

        </div>

        {/* Empty */}

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
            Showing {filteredFarmers.length} of{" "}
            {farmers.length} farmers
          </p>

        </div>

      </div>

      {/* Info */}

      <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">

        <p className="text-xs font-bold text-blue-800">
          Farmer Account Management
        </p>

        <p className="mt-1 text-[11px] leading-5 text-blue-700">
          Admins can review farmer information and restrict
          accounts when necessary. Account status is stored
          directly in the database.
        </p>

      </div>

      {/* Modal */}

      {selectedFarmer && (

        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/40 px-4 py-6">

          <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">

            {/* Header */}

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
                onClick={() =>
                  setSelectedFarmer(null)
                }
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>

            </div>

            {/* Content */}

            <div className="space-y-4 p-5">

              <div className="flex items-center gap-3 rounded-xl bg-green-50 p-4">

                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-lg font-extrabold text-green-700">
                  {selectedFarmer.name
                    .charAt(0)
                    .toUpperCase()}
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

                <ModalItem
                  label="Mobile Number"
                  value={selectedFarmer.mobile}
                />

                <div className="rounded-lg border border-slate-200 p-3">

                  <p className="text-[9px] font-bold uppercase text-slate-400">
                    Status
                  </p>

                  <StatusBadge
                    status={selectedFarmer.status}
                  />

                </div>

                <ModalItem
                  label="Location"
                  value={selectedFarmer.location}
                />

                <ModalItem
                  label="Primary Crop"
                  value={selectedFarmer.crop}
                />

                <ModalItem
                  label="Landholding"
                  value={selectedFarmer.land}
                />

                <ModalItem
                  label="Total Bookings"
                  value={selectedFarmer.bookings}
                />

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
                  onClick={() =>
                    setSelectedFarmer(null)
                  }
                  className="rounded-lg border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  Close
                </button>

                <button
                  type="button"
                  disabled={saving}
                  onClick={() =>
                    toggleBlock(selectedFarmer)
                  }
                  className={`rounded-lg px-4 py-2.5 text-xs font-bold text-white ${
                    selectedFarmer.status === "Blocked"
                      ? "bg-green-700 hover:bg-green-800"
                      : "bg-red-600 hover:bg-red-700"
                  } disabled:cursor-not-allowed disabled:opacity-60`}
                >
                  {saving
                    ? "Updating..."
                    : selectedFarmer.status ===
                        "Blocked"
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

// --------------------------------------------------
// COMPONENTS
// --------------------------------------------------

function SummaryCard({
  title,
  value,
  note,
  icon: Icon,
  iconClass,
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

      <div className="flex items-center justify-between">

        <p className="text-xs font-bold text-slate-500">
          {title}
        </p>

        <div
          className={`flex h-9 w-9 items-center justify-center rounded-lg ${iconClass}`}
        >
          <Icon className="h-4 w-4" />
        </div>

      </div>

      <p className="mt-3 text-2xl font-extrabold text-blue-950">
        {value}
      </p>

      <p className="mt-1 text-[11px] text-slate-400">
        {note}
      </p>

    </div>
  );
}

function StatusBadge({ status }) {
  return (
    <span
      className={`inline-block rounded-full px-2.5 py-1 text-[10px] font-bold ${
        statusStyles[status] ||
        "bg-slate-50 text-slate-600"
      }`}
    >
      {status}
    </span>
  );
}

function InfoItem({ label, value }) {
  return (
    <div>
      <p className="text-[9px] font-bold uppercase text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-[11px] font-semibold text-slate-700">
        {value}
      </p>
    </div>
  );
}

function ModalItem({ label, value }) {
  return (
    <div className="rounded-lg border border-slate-200 p-3">

      <p className="text-[9px] font-bold uppercase text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-xs font-bold text-slate-700">
        {value}
      </p>

    </div>
  );
}

export default Farmers;