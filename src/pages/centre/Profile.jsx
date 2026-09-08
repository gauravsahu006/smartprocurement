import { useEffect, useState } from "react";
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
import { supabase } from "../../lib/supabase";

function Profile() {
  const [profile, setProfile] = useState({
    centreName: "",
    officerName: "",
    mobile: "",
    email: "",
    address: "",
    district: "",
    state: "",
    pincode: "",
    workingHours: "",
    registrationId: "",
  });

  const [crops, setCrops] = useState([]);
  const [facilities] = useState([]);

  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // ==================================================
  // Load Profile
  // ==================================================
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    setError("");

    try {
      // ==================================================
      // 1. Get logged-in user
      // ==================================================
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        console.error(
          "Profile auth error:",
          userError
        );

        setError(
          "Please login again."
        );

        return;
      }

      console.log(
        "Profile Auth user:",
        user
      );

      // ==================================================
      // 2. Get staff profile
      // ==================================================
      const {
        data: staffProfile,
        error: profileError,
      } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profileError) {
        console.error(
          "Profile fetch error:",
          profileError
        );

        setError(
          "Unable to load your profile."
        );

        return;
      }

      console.log(
        "Staff profile:",
        staffProfile
      );

      // ==================================================
      // 3. Get staff centre assignment
      // ==================================================
      const {
        data: assignment,
        error: assignmentError,
      } = await supabase
        .from("centre_staff")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (
        assignmentError ||
        !assignment
      ) {
        console.error(
          "Centre assignment error:",
          assignmentError
        );

        setError(
          "No procurement centre is assigned to your account."
        );

        return;
      }

      console.log(
        "Staff assignment:",
        assignment
      );

      // ==================================================
      // 4. Get assigned centre
      // ==================================================
      const {
        data: centre,
        error: centreError,
      } = await supabase
        .from("centres")
        .select("*")
        .eq(
          "id",
          assignment.centre_id
        )
        .single();

      if (
        centreError ||
        !centre
      ) {
        console.error(
          "Centre fetch error:",
          centreError
        );

        setError(
          "Unable to load your centre information."
        );

        return;
      }

      console.log(
        "Assigned centre:",
        centre
      );

      // ==================================================
      // 5. Get accepted crops
      // ==================================================
      const {
        data: centreCropData,
        error: centreCropError,
      } = await supabase
        .from("centre_crops")
        .select("*")
        .eq(
          "centre_id",
          assignment.centre_id
        );

      if (centreCropError) {
        console.error(
          "Centre crops error:",
          centreCropError
        );
      }

      console.log(
        "Centre crop assignments:",
        centreCropData
      );

      // ==================================================
      // 6. Get crop IDs
      // ==================================================
      const cropIds =
        (centreCropData || [])
          .map(
            (item) =>
              item.crop_id
          )
          .filter(Boolean);

      let cropData = [];

      if (cropIds.length > 0) {
        const {
          data,
          error: cropError,
        } = await supabase
          .from("crops")
          .select("*")
          .in(
            "id",
            cropIds
          );

        if (cropError) {
          console.error(
            "Crops fetch error:",
            cropError
          );
        } else {
          cropData =
            data || [];
        }
      }

      console.log(
        "Accepted crops:",
        cropData
      );

      // ==================================================
      // 7. Build profile
      // ==================================================
      setProfile({
        centreName:
          centre.name ||
          "",

        officerName:
          staffProfile.full_name ||
          "",

        mobile:
          staffProfile.phone ||
          staffProfile.mobile ||
          "",

        email:
          user.email ||
          "",

        address:
          centre.address ||
          "",

        district:
          centre.district ||
          "",

        state:
          centre.state ||
          "",

        pincode:
          centre.pincode ||
          "",

        workingHours:
          centre.working_hours ||
          centre.workingHours ||
          "",

        registrationId:
          centre.registration_id ||
          centre.registrationId ||
          "",
      });

      setCrops(
        cropData.map(
          (crop) =>
            crop.name
        )
      );
    } catch (err) {
      console.error(
        "Profile page error:",
        err
      );

      setError(
        "Something went wrong while loading your profile."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==================================================
  // Input Change
  // ==================================================
  const handleChange = (
    event
  ) => {
    const {
      name,
      value,
    } = event.target;

    setProfile(
      (prev) => ({
        ...prev,
        [name]: value,
      })
    );
  };

  // ==================================================
  // Save Staff Profile
  // ==================================================
  const handleSave =
    async () => {
      setSaving(true);
      setError("");
      setMessage("");

      try {
        const {
          data: {
            user,
          },
        } =
          await supabase.auth.getUser();

        if (!user) {
          setError(
            "Please login again."
          );

          return;
        }

        // ----------------------------------------------
        // Update staff profile
        // ----------------------------------------------
        const {
          error: updateError,
        } = await supabase
          .from("profiles")
          .update({
            full_name:
              profile.officerName,

            phone:
              profile.mobile,
          })
          .eq(
            "id",
            user.id
          );

        if (updateError) {
          console.error(
            "Profile update error:",
            updateError
          );

          setError(
            updateError.message ||
              "Unable to update profile."
          );

          return;
        }

        console.log(
          "Profile updated successfully"
        );

        setEditing(false);

        setMessage(
          "Profile updated successfully."
        );

        setTimeout(() => {
          setMessage("");
        }, 3000);

        // Reload real data
        await fetchProfile();
      } catch (err) {
        console.error(
          "Save profile error:",
          err
        );

        setError(
          "Unable to save profile."
        );
      } finally {
        setSaving(false);
      }
    };

  // ==================================================
  // Loading Screen
  // ==================================================
  if (loading) {
    return (
      <div className="mx-auto max-w-[1200px] px-4 py-10 sm:px-6 lg:px-7">
        <div className="rounded-lg border border-slate-200 bg-white py-16 text-center shadow-sm">
          <div className="mx-auto h-7 w-7 animate-spin rounded-full border-2 border-slate-200 border-t-green-700" />

          <p className="mt-3 text-[10px] font-semibold text-slate-500">
            Loading profile...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-5 sm:px-6 lg:px-7">

      {/* ==================================================
          Header
      ================================================== */}
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
          type="button"
          onClick={() => {
            setEditing(
              !editing
            );

            setMessage("");
            setError("");
          }}
          className="flex items-center justify-center gap-2 rounded-md bg-green-700 px-4 py-2.5 text-[9px] font-bold text-white hover:bg-green-800"
        >
          <Edit3 className="h-3.5 w-3.5" />

          {editing
            ? "Cancel Editing"
            : "Edit Profile"}
        </button>

      </div>

      {/* ==================================================
          Success
      ================================================== */}
      {message && (
        <div className="mt-4 flex items-center gap-2 rounded-lg border border-green-100 bg-green-50 px-4 py-3 text-[10px] font-semibold text-green-700">
          <CheckCircle2 className="h-4 w-4" />
          {message}
        </div>
      )}

      {/* ==================================================
          Error
      ================================================== */}
      {error && (
        <div className="mt-4 rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-[10px] font-semibold text-red-700">
          {error}
        </div>
      )}

      {/* ==================================================
          Profile Overview
      ================================================== */}
      <section className="mt-5 grid gap-4 lg:grid-cols-[0.75fr_1.7fr]">

        {/* ==================================================
            Left Card
        ================================================== */}
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">

          <div className="flex flex-col items-center text-center">

            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-green-700">
              <Building2 className="h-9 w-9" />
            </div>

            <h2 className="mt-4 text-sm font-extrabold text-blue-950">
              {profile.centreName ||
                "Procurement Centre"}
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
              value={
                profile.officerName ||
                "—"
              }
            />

            <ContactItem
              icon={Phone}
              label="Mobile"
              value={
                profile.mobile ||
                "—"
              }
            />

            <ContactItem
              icon={Mail}
              label="Email"
              value={
                profile.email ||
                "—"
              }
            />

            <ContactItem
              icon={MapPin}
              label="District"
              value={
                profile.district
                  ? `${profile.district}, ${profile.state}`
                  : "—"
              }
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
              Your centre account is verified and protected.
              Keep your login credentials secure.
            </p>

          </div>

        </div>

        {/* ==================================================
            Right Content
        ================================================== */}
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
                value={
                  profile.centreName
                }
                editing={false}
                onChange={
                  handleChange
                }
              />

              <ProfileField
                label="Registration ID"
                name="registrationId"
                value={
                  profile.registrationId ||
                  "—"
                }
                editing={false}
                onChange={
                  handleChange
                }
              />

              <ProfileField
                label="Address"
                name="address"
                value={
                  profile.address ||
                  "—"
                }
                editing={false}
                onChange={
                  handleChange
                }
              />

              <ProfileField
                label="District"
                name="district"
                value={
                  profile.district ||
                  "—"
                }
                editing={false}
                onChange={
                  handleChange
                }
              />

              <ProfileField
                label="State"
                name="state"
                value={
                  profile.state ||
                  "—"
                }
                editing={false}
                onChange={
                  handleChange
                }
              />

              <ProfileField
                label="Pincode"
                name="pincode"
                value={
                  profile.pincode ||
                  "—"
                }
                editing={false}
                onChange={
                  handleChange
                }
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
                value={
                  profile.officerName
                }
                editing={editing}
                onChange={
                  handleChange
                }
              />

              <ProfileField
                label="Mobile Number"
                name="mobile"
                value={
                  profile.mobile
                }
                editing={editing}
                onChange={
                  handleChange
                }
              />

              <ProfileField
                label="Email Address"
                name="email"
                value={
                  profile.email
                }
                editing={false}
                onChange={
                  handleChange
                }
              />

              <ProfileField
                label="Working Hours"
                name="workingHours"
                value={
                  profile.workingHours ||
                  "Not configured"
                }
                editing={false}
                onChange={
                  handleChange
                }
              />

            </div>
          </ProfileCard>

          {/* ==================================================
              Accepted Crops
          ================================================== */}
          <ProfileCard
            icon={Building2}
            title="Accepted Crops"
            description="Crops currently accepted at this centre."
          >

            {crops.length > 0 ? (
              <div className="flex flex-wrap gap-2">

                {crops.map(
                  (crop) => (
                    <span
                      key={crop}
                      className="rounded-full bg-green-100 px-3 py-1.5 text-[8px] font-bold text-green-700"
                    >
                      {crop}
                    </span>
                  )
                )}

              </div>
            ) : (
              <p className="text-[9px] text-slate-400">
                No crops configured for this centre.
              </p>
            )}

          </ProfileCard>

          {/* ==================================================
              Facilities
          ================================================== */}
          <ProfileCard
            icon={ShieldCheck}
            title="Centre Facilities"
            description="Facilities available for farmers at this centre."
          >

            {facilities.length > 0 ? (
              <div className="grid gap-2 sm:grid-cols-2">

                {facilities.map(
                  (facility) => (
                    <div
                      key={
                        facility
                      }
                      className="flex items-center gap-2 rounded-md border border-green-100 bg-green-50 px-3 py-2.5 text-left text-[8px] font-bold text-green-700"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />

                      {facility}
                    </div>
                  )
                )}

              </div>
            ) : (
              <p className="text-[9px] text-slate-400">
                Facility information is not configured in the centre database.
              </p>
            )}

          </ProfileCard>

          {/* Save */}
          {editing && (
            <div className="flex justify-end">

              <button
                type="button"
                onClick={
                  handleSave
                }
                disabled={
                  saving
                }
                className="flex items-center gap-2 rounded-md bg-green-700 px-5 py-2.5 text-[9px] font-bold text-white hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60"
              >

                <Save className="h-3.5 w-3.5" />

                {saving
                  ? "Saving..."
                  : "Save Changes"}

              </button>

            </div>
          )}

        </div>

      </section>

      {/* ==================================================
          Bottom Information
      ================================================== */}
      <div className="mt-5 flex items-start gap-3 rounded-lg border border-blue-100 bg-blue-50 px-4 py-3">

        <Clock3 className="mt-0.5 h-4 w-4 shrink-0 text-blue-700" />

        <div>

          <p className="text-[9px] font-bold text-blue-900">
            Centre Operating Hours
          </p>

          <p className="mt-1 text-[8px] leading-4 text-blue-800">

            Your centre is currently scheduled to operate from{" "}

            <span className="font-bold">
              {profile.workingHours ||
                "Not configured"}
            </span>

            .

          </p>

        </div>

      </div>

    </div>
  );
}

// ==================================================
// Profile Card
// ==================================================
function ProfileCard({
  icon: Icon,
  title,
  description,
  children,
}) {
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

      <div className="mt-5">
        {children}
      </div>

    </div>
  );
}

// ==================================================
// Profile Field
// ==================================================
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
          value={
            value || ""
          }
          onChange={
            onChange
          }
          className="mt-1.5 h-9 w-full rounded-md border border-slate-200 bg-white px-3 text-[9px] font-semibold text-blue-950 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
        />
      ) : (
        <div className="mt-1.5 min-h-9 rounded-md bg-slate-50 px-3 py-2.5 text-[9px] font-semibold text-blue-950">
          {value || "—"}
        </div>
      )}

    </div>
  );
}

// ==================================================
// Contact Item
// ==================================================
function ContactItem({
  icon: Icon,
  label,
  value,
}) {
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
          {value || "—"}
        </p>

      </div>

    </div>
  );
}

export default Profile;