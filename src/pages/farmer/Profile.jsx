import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Camera,
  CheckCircle2,
  Edit3,
  LockKeyhole,
  Mail,
  MapPin,
  Phone,
  Save,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import farmerProfile from "../../assets/images/farmer-profile.png";

function Profile() {
  const [isEditing, setIsEditing] = useState(false);

  const [profile, setProfile] = useState({
    name: "Rajesh Kumar",
    mobile: "9876543210",
    email: "rajesh.kumar@email.com",
    aadhaar: "XXXX XXXX 1234",
    dob: "15 March 1985",
    address: "XYZ Village, Ranchi, Jharkhand - 834001",
    primaryCrop: "Wheat",
    landholding: "5.2 Acres",
    otherCrops: "Maize, Paddy",
    farmerId: "FARMER12345",
  });

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = () => {
    setIsEditing(false);
  };

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
                  alt="Rajesh Kumar"
                  className="h-28 w-28 rounded-full object-cover"
                />

                <button
                  type="button"
                  className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-white text-slate-700 shadow"
                >
                  <Camera size={14} />
                </button>
              </div>

              <h2 className="mt-3 text-sm font-bold text-[#10233f]">
                {profile.name}
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Farmer
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
                    {profile.mobile}
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
                    {profile.email}
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
                  onClick={() => setIsEditing(true)}
                  className="inline-flex items-center gap-1.5 rounded-md border border-green-200 px-3 py-1.5 text-[10px] font-semibold text-green-700 hover:bg-green-50"
                >
                  <Edit3 size={13} />
                  Edit Profile
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSave}
                  className="inline-flex items-center gap-1.5 rounded-md bg-[#087f3e] px-3 py-1.5 text-[10px] font-semibold text-white hover:bg-[#066b34]"
                >
                  <Save size={13} />
                  Save
                </button>
              )}
            </div>

            <div className="grid gap-4 pt-4 sm:grid-cols-2">
              {/* Full Name */}
              <ProfileField
                label="Full Name"
                name="name"
                value={profile.name}
                editing={isEditing}
                onChange={handleChange}
              />

              {/* Email */}
              <ProfileField
                label="Email Address"
                name="email"
                value={profile.email}
                editing={isEditing}
                onChange={handleChange}
              />

              {/* Mobile */}
              <ProfileField
                label="Mobile Number"
                name="mobile"
                value={profile.mobile}
                editing={isEditing}
                onChange={handleChange}
              />

              {/* DOB */}
              <ProfileField
                label="Date of Birth"
                name="dob"
                value={profile.dob}
                editing={isEditing}
                onChange={handleChange}
              />

              {/* Aadhaar */}
              <ProfileField
                label="Aadhaar Number"
                name="aadhaar"
                value={profile.aadhaar}
                editing={false}
                onChange={handleChange}
              />

              {/* Address */}
              <ProfileField
                label="Address"
                name="address"
                value={profile.address}
                editing={isEditing}
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
                editing={isEditing}
                onChange={handleChange}
              />

              <ProfileField
                label="Landholding (in acres)"
                name="landholding"
                value={profile.landholding}
                editing={isEditing}
                onChange={handleChange}
              />

              <ProfileField
                label="Other Crops"
                name="otherCrops"
                value={profile.otherCrops}
                editing={isEditing}
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
          value={value}
          onChange={onChange}
          className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
        />
      ) : (
        <div className="min-h-[34px] rounded-md border border-slate-100 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-700">
          {value}
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