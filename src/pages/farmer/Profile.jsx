import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Camera,
  CheckCircle2,
  Edit3,
  LockKeyhole,
  Mail,
  Phone,
  Save,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import farmerProfile from "../../assets/images/farmer-profile.png";
import { supabase } from "../../lib/supabase";

function Profile() {
  const [isEditing, setIsEditing] = useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [profile, setProfile] = useState({
    name: "",
    mobile: "",
    email: "",
    farmerId: "",
    role: "Farmer",

    // These fields are not assumed to exist in the backend.
    aadhaar: "Not available",
    dob: "Not available",
    address: "Not available",
    primaryCrop: "Not available",
    landholding: "Not available",
    otherCrops: "Not available",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  async function fetchProfile() {
    try {
      setLoading(true);
      setError("");

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) throw userError;

      if (!user) {
        throw new Error("Please login first.");
      }

      // Get farmer profile from public.profiles
      const { data: profileData, error: profileError } =
        await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .maybeSingle();

      if (profileError) throw profileError;

      if (!profileData) {
        throw new Error("Farmer profile not found.");
      }

      console.log("Farmer profile:", profileData);

      setProfile({
        name: profileData.full_name || "",
        mobile:
          profileData.phone ||
          profileData.mobile ||
          "",
        email: user.email || "",
        farmerId: profileData.id || user.id,
        role: profileData.role || "farmer",

        aadhaar: "Not available",
        dob: "Not available",
        address: "Not available",
        primaryCrop: "Not available",
        landholding: "Not available",
        otherCrops: "Not available",
      });
    } catch (err) {
      console.error("Farmer Profile Error:", err);
      setError(
        err.message || "Unable to load profile."
      );
    } finally {
      setLoading(false);
    }
  }

  const handleChange = (e) => {
    setProfile((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

    setSuccess("");
  };

  async function handleSave() {
    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) throw userError;

      if (!user) {
        throw new Error("Please login first.");
      }

      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          full_name: profile.name,
          phone: profile.mobile,
        })
        .eq("id", user.id);

      if (updateError) throw updateError;

      setIsEditing(false);
      setSuccess("Profile updated successfully.");

      // Reload latest backend data
      await fetchProfile();
    } catch (err) {
      console.error("Profile Update Error:", err);

      setError(
        err.message || "Unable to update profile."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="space-y-5 p-6">
        <div>
          <h1 className="text-xl font-bold text-[#10233f]">
            My Profile
          </h1>

          <p className="mt-1 text-xs text-slate-500">
            View and manage your profile information.
          </p>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-8 text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-green-600" />

          <p className="mt-3 text-xs text-slate-500">
            Loading profile...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5 p-6">
      {/* Page Header */}
      <div>
        <h1 className="text-xl font-bold text-[#10233f]">
          My Profile
        </h1>

        <p className="mt-1 text-xs text-slate-500">
          View and manage your profile information.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3">
          <p className="text-xs font-medium text-red-700">
            {error}
          </p>
        </div>
      )}

      {/* Success */}
      {success && (
        <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3">
          <p className="text-xs font-medium text-green-700">
            {success}
          </p>
        </div>
      )}

      {/* Main Profile Area */}
      <div className="grid gap-4 xl:grid-cols-[250px_1fr]">
        {/* Left Profile Column */}
        <div className="space-y-4">
          {/* Profile Card */}
          <div className="rounded-lg border border-slate-200 bg-white p-5">
            <div className="flex flex-col items-center text-center">
              <div className="relative">
                <img
                  src={farmerProfile}
                  alt={profile.name || "Farmer"}
                  className="h-28 w-28 rounded-full object-cover"
                />

                {/* Camera button kept as UI only */}
                <button
                  type="button"
                  disabled
                  className="absolute bottom-0 right-0 flex h-8 w-8 cursor-not-allowed items-center justify-center rounded-full border-2 border-white bg-white text-slate-400 shadow"
                  title="Profile photo upload is not configured yet"
                >
                  <Camera size={14} />
                </button>
              </div>

              <h2 className="mt-3 text-sm font-bold text-[#10233f]">
                {profile.name || "Farmer"}
              </h2>

              <p className="mt-1 text-xs capitalize text-slate-500">
                {profile.role}
              </p>

              <div className="mt-2 inline-flex items-center gap-1 text-[10px] font-semibold text-green-700">
                <CheckCircle2 size={13} />
                Verified Farmer
              </div>
            </div>

            <div className="mt-5 space-y-3 border-t border-slate-100 pt-4">
              <div className="flex items-center gap-3">
                <Phone
                  size={15}
                  className="shrink-0 text-slate-500"
                />

                <div>
                  <p className="text-[10px] text-slate-400">
                    Mobile Number
                  </p>

                  <p className="text-xs font-medium text-slate-700">
                    {profile.mobile || "Not available"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Mail
                  size={15}
                  className="shrink-0 text-slate-500"
                />

                <div className="min-w-0">
                  <p className="text-[10px] text-slate-400">
                    Email Address
                  </p>

                  <p className="truncate text-xs font-medium text-slate-700">
                    {profile.email || "Not available"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Account Security */}
          <div className="rounded-lg bg-green-50 p-4">
            <div className="flex items-start gap-3">
              <LockKeyhole
                size={20}
                className="mt-0.5 text-green-700"
              />

              <div>
                <h3 className="text-xs font-bold text-green-800">
                  Account Security
                </h3>

                <p className="mt-1 text-[10px] leading-4 text-green-700">
                  Keep your account secure.
                </p>

                <button
                  type="button"
                  className="mt-3 rounded-md border border-green-200 bg-white px-3 py-1.5 text-[10px] font-semibold text-green-700 hover:bg-green-100"
                  onClick={() =>
                    alert(
                      "Password change can be added using Supabase Auth."
                    )
                  }
                >
                  Change Password
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Information Column */}
        <div className="space-y-4">
          {/* Personal Information */}
          <div className="rounded-lg border border-slate-200 bg-white p-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-sm font-bold text-[#10233f]">
                Personal Information
              </h2>

              {!isEditing ? (
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(true);
                    setSuccess("");
                  }}
                  className="inline-flex items-center gap-1.5 rounded-md border border-green-200 px-3 py-1.5 text-[10px] font-semibold text-green-700 hover:bg-green-50"
                >
                  <Edit3 size={13} />
                  Edit Profile
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  className="inline-flex items-center gap-1.5 rounded-md bg-[#087f3e] px-3 py-1.5 text-[10px] font-semibold text-white hover:bg-[#066b34] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Save size={13} />

                  {saving ? "Saving..." : "Save"}
                </button>
              )}
            </div>

            <div className="grid gap-4 pt-4 sm:grid-cols-2">
              <ProfileField
                label="Full Name"
                name="name"
                value={profile.name}
                editing={isEditing}
                onChange={handleChange}
              />

              <ProfileField
                label="Email Address"
                name="email"
                value={profile.email}
                editing={false}
                onChange={handleChange}
              />

              <ProfileField
                label="Mobile Number"
                name="mobile"
                value={profile.mobile}
                editing={isEditing}
                onChange={handleChange}
              />

              <ProfileField
                label="Date of Birth"
                name="dob"
                value={profile.dob}
                editing={false}
                onChange={handleChange}
              />

              <ProfileField
                label="Aadhaar Number"
                name="aadhaar"
                value={profile.aadhaar}
                editing={false}
                onChange={handleChange}
              />

              <ProfileField
                label="Address"
                name="address"
                value={profile.address}
                editing={false}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Farming Information */}
          <div className="rounded-lg border border-slate-200 bg-white p-5">
            <h2 className="border-b border-slate-100 pb-3 text-sm font-bold text-[#10233f]">
              Farming Information
            </h2>

            <div className="grid gap-4 pt-4 sm:grid-cols-2">
              <ProfileField
                label="Primary Crop"
                name="primaryCrop"
                value={profile.primaryCrop}
                editing={false}
                onChange={handleChange}
              />

              <ProfileField
                label="Landholding (in acres)"
                name="landholding"
                value={profile.landholding}
                editing={false}
                onChange={handleChange}
              />

              <ProfileField
                label="Other Crops"
                name="otherCrops"
                value={profile.otherCrops}
                editing={false}
                onChange={handleChange}
              />

              <ProfileField
                label="Farmer ID"
                name="farmerId"
                value={profile.farmerId}
                editing={false}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Communication Preferences */}
          <div className="rounded-lg border border-slate-200 bg-white p-5">
            <h2 className="border-b border-slate-100 pb-3 text-sm font-bold text-[#10233f]">
              Communication Preferences
            </h2>

            <div className="grid gap-4 pt-4 sm:grid-cols-2">
              <PreferenceToggle
                title="SMS Notifications"
                description="Receive booking and queue updates."
                defaultChecked
              />

              <PreferenceToggle
                title="Email Notifications"
                description="Receive payment and procurement updates."
                defaultChecked
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Note */}
      <div className="flex items-start gap-2 rounded-lg border border-blue-100 bg-blue-50 px-4 py-3">
        <ShieldCheck
          size={16}
          className="mt-0.5 shrink-0 text-blue-600"
        />

        <p className="text-[11px] leading-5 text-blue-700">
          Your personal information is securely stored and used only
          for procurement, booking and payment services.
        </p>
      </div>

      {/* Dashboard Link */}
      <div>
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 text-xs font-semibold text-green-700 hover:text-green-800"
        >
          <UserRound size={14} />
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}

function ProfileField({
  label,
  name,
  value,
  editing,
  onChange,
}) {
  return (
    <div>
      <label className="mb-1.5 block text-[10px] font-medium text-slate-500">
        {label}
      </label>

      {editing ? (
        <input
          type="text"
          name={name}
          value={value || ""}
          onChange={onChange}
          className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
        />
      ) : (
        <div className="min-h-[34px] rounded-md border border-slate-100 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-700">
          {value || "Not available"}
        </div>
      )}
    </div>
  );
}

function PreferenceToggle({
  title,
  description,
  defaultChecked = false,
}) {
  const [enabled, setEnabled] = useState(defaultChecked);

  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-xs font-semibold text-slate-700">
          {title}
        </p>

        <p className="mt-1 text-[10px] text-slate-400">
          {description}
        </p>
      </div>

      <button
        type="button"
        onClick={() => setEnabled(!enabled)}
        className={`relative h-5 w-9 shrink-0 rounded-full transition ${
          enabled ? "bg-green-600" : "bg-slate-300"
        }`}
        aria-label={`Toggle ${title}`}
      >
        <span
          className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition ${
            enabled ? "left-[18px]" : "left-0.5"
          }`}
        />
      </button>
    </div>
  );
}

export default Profile;