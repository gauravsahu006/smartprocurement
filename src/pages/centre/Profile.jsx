import { useState } from "react";
import {
  Building2,
  CheckCircle2,
  Clock3,
  Edit3,
  Mail,
  MapPin,
  Phone,
  Save,
  ShieldCheck,
  UserRound,
} from "lucide-react";

const initialProfile = {
  centreName: "ABC Procurement Centre",
  officerName: "Centre Officer",
  mobile: "9876543210",
  email: "officer@abcprocurement.com",
  address: "Main Market Road, Ranchi",
  district: "Ranchi",
  state: "Jharkhand",
  pincode: "834001",
  workingHours: "09:00 AM - 06:00 PM",
  registrationId: "PC-JH-RAN-00124",
};

const initialCrops = [
  "Wheat",
  "Rice",
  "Maize",
  "Paddy",
];

const initialFacilities = [
  "Digital Weighing",
  "Quality Testing",
  "Storage Facility",
  "Parking",
];

function Profile() {
  const [profile, setProfile] = useState(initialProfile);
  const [crops, setCrops] = useState(initialCrops);
  const [facilities, setFacilities] = useState(initialFacilities);
  const [editing, setEditing] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    localStorage.setItem("centreProfile", JSON.stringify(profile));

    setEditing(false);
    setMessage("Profile updated successfully.");

    setTimeout(() => {
      setMessage("");
    }, 3000);
  };

  const toggleCrop = (crop) => {
    setCrops((prev) =>
      prev.includes(crop)
        ? prev.filter((item) => item !== crop)
        : [...prev, crop]
    );
  };

  const toggleFacility = (facility) => {
    setFacilities((prev) =>
      prev.includes(facility)
        ? prev.filter((item) => item !== facility)
        : [...prev, facility]
    );
  };

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-5 sm:px-6 lg:px-7">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-lg font-extrabold text-blue-950 sm:text-xl">
            Centre Profile
          </h1>

          <p className="mt-1 text-[10px] text-slate-500 sm:text-xs">
            Manage your procurement centre and officer information.
          </p>
        </div>

        <button
          onClick={() => {
            setEditing(!editing);
            setMessage("");
          }}
          className="flex items-center justify-center gap-2 rounded-md bg-green-700 px-4 py-2.5 text-[9px] font-bold text-white hover:bg-green-800"
        >
          <Edit3 className="h-3.5 w-3.5" />

          {editing ? "Cancel Editing" : "Edit Profile"}
        </button>
      </div>

      {/* Success Message */}
      {message && (
        <div className="mt-4 flex items-center gap-2 rounded-lg border border-green-100 bg-green-50 px-4 py-3 text-[10px] font-semibold text-green-700">
          <CheckCircle2 className="h-4 w-4" />
          {message}
        </div>
      )}

      {/* Profile Overview */}
      <section className="mt-5 grid gap-4 lg:grid-cols-[0.75fr_1.7fr]">
        {/* Left Card */}
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col items-center text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-green-700">
              <Building2 className="h-9 w-9" />
            </div>

            <h2 className="mt-4 text-sm font-extrabold text-blue-950">
              {profile.centreName}
            </h2>

            <p className="mt-1 text-[9px] font-medium text-slate-500">
              Procurement Centre
            </p>

            <span className="mt-3 inline-flex items-center gap-1 rounded-full bg-green-50 px-3 py-1.5 text-[8px] font-bold text-green-700">
              <CheckCircle2 className="h-3 w-3" />
              Verified Centre
            </span>
          </div>

          <div className="mt-6 space-y-3 border-t border-slate-100 pt-5">
            <ContactItem
              icon={UserRound}
              label="Officer"
              value={profile.officerName}
            />

            <ContactItem
              icon={Phone}
              label="Mobile"
              value={profile.mobile}
            />

            <ContactItem
              icon={Mail}
              label="Email"
              value={profile.email}
            />

            <ContactItem
              icon={MapPin}
              label="District"
              value={`${profile.district}, ${profile.state}`}
            />
          </div>

          {/* Security */}
          <div className="mt-5 rounded-lg bg-green-50 p-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-green-700" />

              <p className="text-[9px] font-extrabold text-green-800">
                Account Security
              </p>
            </div>

            <p className="mt-2 text-[8px] leading-4 text-green-700">
              Your centre account is verified and protected. Keep your
              login credentials secure.
            </p>
          </div>
        </div>

        {/* Right Content */}
        <div className="space-y-4">
          {/* Centre Information */}
          <ProfileCard
            icon={Building2}
            title="Centre Information"
            description="Basic information about your procurement centre."
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <ProfileField
                label="Centre Name"
                name="centreName"
                value={profile.centreName}
                editing={editing}
                onChange={handleChange}
              />

              <ProfileField
                label="Registration ID"
                name="registrationId"
                value={profile.registrationId}
                editing={false}
                onChange={handleChange}
              />

              <ProfileField
                label="Address"
                name="address"
                value={profile.address}
                editing={editing}
                onChange={handleChange}
              />

              <ProfileField
                label="District"
                name="district"
                value={profile.district}
                editing={editing}
                onChange={handleChange}
              />

              <ProfileField
                label="State"
                name="state"
                value={profile.state}
                editing={editing}
                onChange={handleChange}
              />

              <ProfileField
                label="Pincode"
                name="pincode"
                value={profile.pincode}
                editing={editing}
                onChange={handleChange}
              />
            </div>
          </ProfileCard>

          {/* Officer Information */}
          <ProfileCard
            icon={UserRound}
            title="Officer Information"
            description="Contact details of the centre officer."
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <ProfileField
                label="Officer Name"
                name="officerName"
                value={profile.officerName}
                editing={editing}
                onChange={handleChange}
              />

              <ProfileField
                label="Mobile Number"
                name="mobile"
                value={profile.mobile}
                editing={editing}
                onChange={handleChange}
              />

              <ProfileField
                label="Email Address"
                name="email"
                value={profile.email}
                editing={editing}
                onChange={handleChange}
              />

              <ProfileField
                label="Working Hours"
                name="workingHours"
                value={profile.workingHours}
                editing={editing}
                onChange={handleChange}
              />
            </div>
          </ProfileCard>

          {/* Crops */}
          <ProfileCard
            icon={Building2}
            title="Accepted Crops"
            description="Crops currently accepted at this centre."
          >
            <div className="flex flex-wrap gap-2">
              {["Wheat", "Rice", "Maize", "Paddy", "Barley"].map(
                (crop) => {
                  const active = crops.includes(crop);

                  return (
                    <button
                      key={crop}
                      onClick={() => editing && toggleCrop(crop)}
                      className={`rounded-full px-3 py-1.5 text-[8px] font-bold transition ${
                        active
                          ? "bg-green-100 text-green-700"
                          : "bg-slate-100 text-slate-400"
                      } ${
                        editing
                          ? "cursor-pointer hover:bg-green-200"
                          : "cursor-default"
                      }`}
                    >
                      {crop}
                    </button>
                  );
                }
              )}
            </div>
          </ProfileCard>

          {/* Facilities */}
          <ProfileCard
            icon={ShieldCheck}
            title="Centre Facilities"
            description="Facilities available for farmers at this centre."
          >
            <div className="grid gap-2 sm:grid-cols-2">
              {[
                "Digital Weighing",
                "Quality Testing",
                "Storage Facility",
                "Parking",
                "Drinking Water",
                "Waiting Area",
              ].map((facility) => {
                const active = facilities.includes(facility);

                return (
                  <button
                    key={facility}
                    onClick={() =>
                      editing && toggleFacility(facility)
                    }
                    className={`flex items-center gap-2 rounded-md border px-3 py-2.5 text-left text-[8px] font-bold transition ${
                      active
                        ? "border-green-100 bg-green-50 text-green-700"
                        : "border-slate-100 bg-slate-50 text-slate-400"
                    } ${
                      editing
                        ? "cursor-pointer hover:border-green-200"
                        : "cursor-default"
                    }`}
                  >
                    <CheckCircle2
                      className={`h-3.5 w-3.5 ${
                        active
                          ? "text-green-600"
                          : "text-slate-300"
                      }`}
                    />

                    {facility}
                  </button>
                );
              })}
            </div>
          </ProfileCard>

          {/* Save */}
          {editing && (
            <div className="flex justify-end">
              <button
                onClick={handleSave}
                className="flex items-center gap-2 rounded-md bg-green-700 px-5 py-2.5 text-[9px] font-bold text-white hover:bg-green-800"
              >
                <Save className="h-3.5 w-3.5" />
                Save Changes
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Bottom Information */}
      <div className="mt-5 flex items-start gap-3 rounded-lg border border-blue-100 bg-blue-50 px-4 py-3">
        <Clock3 className="mt-0.5 h-4 w-4 shrink-0 text-blue-700" />

        <div>
          <p className="text-[9px] font-bold text-blue-900">
            Centre Operating Hours
          </p>

          <p className="mt-1 text-[8px] leading-4 text-blue-800">
            Your centre is currently scheduled to operate from{" "}
            <span className="font-bold">
              {profile.workingHours}
            </span>
            . Update the working hours if your centre schedule changes.
          </p>
        </div>
      </div>
    </div>
  );
}

function ProfileCard({ icon: Icon, title, description, children }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="flex items-start gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-green-50 text-green-700">
          <Icon className="h-4 w-4" />
        </div>

        <div>
          <h2 className="text-[11px] font-extrabold text-blue-950">
            {title}
          </h2>

          <p className="mt-0.5 text-[8px] text-slate-500">
            {description}
          </p>
        </div>
      </div>

      <div className="mt-5">{children}</div>
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
      <label className="text-[8px] font-bold text-slate-500">
        {label}
      </label>

      {editing ? (
        <input
          name={name}
          value={value}
          onChange={onChange}
          className="mt-1.5 h-9 w-full rounded-md border border-slate-200 bg-white px-3 text-[9px] font-semibold text-blue-950 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
        />
      ) : (
        <div className="mt-1.5 min-h-9 rounded-md bg-slate-50 px-3 py-2.5 text-[9px] font-semibold text-blue-950">
          {value}
        </div>
      )}
    </div>
  );
}

function ContactItem({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-slate-50 text-slate-500">
        <Icon className="h-3.5 w-3.5" />
      </div>

      <div className="min-w-0">
        <p className="text-[7px] font-semibold text-slate-400">
          {label}
        </p>

        <p className="truncate text-[9px] font-bold text-blue-950">
          {value}
        </p>
      </div>
    </div>
  );
}

export default Profile;