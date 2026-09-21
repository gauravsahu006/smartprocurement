import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  Edit3,
  KeyRound,
  Mail,
  Save,
  ShieldCheck,
  Smartphone,
  UserRound,
  Loader2,
} from "lucide-react";

import { supabase } from "../../lib/supabase";

function AdminProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [profile, setProfile] = useState({
    id: "",
    name: "",
    email: "",
    username: "",
    mobile: "",
    role: "System Administrator",
  });

  const [notifications, setNotifications] = useState({
    systemAlerts: true,
    paymentAlerts: true,
    bookingAlerts: true,
    emailUpdates: false,
  });

  // -----------------------------------------
  // Load Admin Profile
  // -----------------------------------------
  useEffect(() => {
    loadAdminProfile();

    const savedNotifications = localStorage.getItem(
      "adminNotificationPreferences"
    );

    if (savedNotifications) {
      try {
        setNotifications(JSON.parse(savedNotifications));
      } catch {
        // Ignore invalid localStorage data
      }
    }
  }, []);

  const loadAdminProfile = async () => {
    try {
      setLoading(true);
      setError("");

      // Get logged-in user from Supabase Auth
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError) throw authError;

      if (!user) {
        throw new Error("Admin session not found.");
      }

      // Get profile from database
      const { data: adminProfile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profileError) throw profileError;

      // Security check
      if (adminProfile.role !== "admin") {
        throw new Error("Access denied. This account is not an admin.");
      }

      setProfile({
        id: user.id,
        name:
          adminProfile.full_name ||
          adminProfile.name ||
          "Admin User",

        email: user.email || "",

        username:
          adminProfile.username ||
          adminProfile.user_name ||
          user.user_metadata?.username ||
          "",

        mobile:
          adminProfile.mobile ||
          adminProfile.phone ||
          adminProfile.contact_number ||
          user.user_metadata?.mobile ||
          "",

        role: "System Administrator",
      });
    } catch (err) {
      console.error("Admin profile error:", err);
      setError(err.message || "Failed to load admin profile.");
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------------------
  // Input Change
  // -----------------------------------------
  const handleChange = (field, value) => {
    setProfile((current) => ({
      ...current,
      [field]: value,
    }));
  };

  // -----------------------------------------
  // Save Profile
  // -----------------------------------------
  const handleSave = async () => {
    try {
      setSaving(true);
      setError("");
      setMessage("");

      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError) throw authError;

      if (!user) {
        throw new Error("Admin session not found.");
      }

      // ---------------------------------------
      // 1. Update profile table
      // ---------------------------------------

      const updateData = {
        full_name: profile.name,
      };

      /*
       * Only update optional columns if they
       * actually exist in the fetched profile.
       *
       * This prevents errors if your current
       * profiles table doesn't have these columns.
       */

      const { data: existingProfile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (existingProfile) {
        if ("mobile" in existingProfile) {
          updateData.mobile = profile.mobile;
        } else if ("phone" in existingProfile) {
          updateData.phone = profile.mobile;
        } else if ("contact_number" in existingProfile) {
          updateData.contact_number = profile.mobile;
        }

        if ("username" in existingProfile) {
          updateData.username = profile.username;
        } else if ("user_name" in existingProfile) {
          updateData.user_name = profile.username;
        }
      }

      const { error: profileError } = await supabase
        .from("profiles")
        .update(updateData)
        .eq("id", user.id);

      if (profileError) throw profileError;

      // ---------------------------------------
      // 2. Update Auth Email
      // ---------------------------------------

      if (profile.email !== user.email) {
        const { error: emailError } =
          await supabase.auth.updateUser({
            email: profile.email,
          });

        if (emailError) throw emailError;

        setMessage(
          "Profile saved. A confirmation email may be sent for the new email address."
        );
      } else {
        setMessage("Profile updated successfully.");
      }

      setIsEditing(false);

      // Reload fresh data
      await loadAdminProfile();
    } catch (err) {
      console.error("Save profile error:", err);
      setError(err.message || "Failed to save profile.");
    } finally {
      setSaving(false);
    }
  };

  // -----------------------------------------
  // Notification Preferences
  // -----------------------------------------
  const toggleNotification = (field) => {
    const updated = {
      ...notifications,
      [field]: !notifications[field],
    };

    setNotifications(updated);

    localStorage.setItem(
      "adminNotificationPreferences",
      JSON.stringify(updated)
    );
  };

  // -----------------------------------------
  // Change Password
  // -----------------------------------------
  const handleChangePassword = async () => {
    try {
      setError("");
      setMessage("");

      if (!profile.email) {
        throw new Error("Admin email not available.");
      }

      const { error: resetError } =
        await supabase.auth.resetPasswordForEmail(profile.email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });

      if (resetError) throw resetError;

      setMessage(
        "Password reset link has been sent to your administrator email."
      );
    } catch (err) {
      console.error("Password reset error:", err);
      setError(err.message || "Failed to send password reset email.");
    }
  };

  // -----------------------------------------
  // Loading
  // -----------------------------------------
  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex items-center gap-3 text-slate-500">
          <Loader2 className="h-5 w-5 animate-spin" />
          Loading administrator profile...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5 pb-6 pt-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-blue-950">
            Admin Profile
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage your administrator account and preferences.
          </p>
        </div>

        {!isEditing ? (
          <button
            type="button"
            onClick={() => {
              setError("");
              setMessage("");
              setIsEditing(true);
            }}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-green-700 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-green-800"
          >
            <Edit3 className="h-4 w-4" />
            Edit Profile
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-green-700 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}

            {saving ? "Saving..." : "Save Changes"}
          </button>
        )}
      </div>

      {/* Messages */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {error}
        </div>
      )}

      {message && (
        <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm font-semibold text-green-700">
          {message}
        </div>
      )}

      {/* Profile Overview */}
      <div className="grid gap-5 lg:grid-cols-[300px_1fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col items-center text-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-blue-100">
              <UserRound className="h-11 w-11 text-blue-700" />
            </div>

            <h2 className="mt-4 text-xl font-extrabold text-blue-950">
              {profile.name}
            </h2>

            <p className="mt-1 text-sm font-medium text-slate-500">
              {profile.role}
            </p>

            <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1.5 text-xs font-bold text-green-700">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Verified Administrator
            </div>
          </div>

          <div className="mt-6 space-y-4 border-t border-slate-100 pt-5">
            <div className="flex items-start gap-3">
              <Mail className="mt-0.5 h-4 w-4 text-slate-400" />

              <div>
                <p className="text-[11px] font-semibold uppercase text-slate-400">
                  Email
                </p>

                <p className="mt-0.5 break-all text-sm font-semibold text-slate-700">
                  {profile.email || "—"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Smartphone className="mt-0.5 h-4 w-4 text-slate-400" />

              <div>
                <p className="text-[11px] font-semibold uppercase text-slate-400">
                  Mobile
                </p>

                <p className="mt-0.5 text-sm font-semibold text-slate-700">
                  {profile.mobile
                    ? `+91 ${profile.mobile}`
                    : "—"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-0.5 h-4 w-4 text-slate-400" />

              <div>
                <p className="text-[11px] font-semibold uppercase text-slate-400">
                  Role
                </p>

                <p className="mt-0.5 text-sm font-semibold text-slate-700">
                  System Administrator
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
              <UserRound className="h-5 w-5 text-blue-700" />
            </div>

            <div>
              <h2 className="text-lg font-extrabold text-blue-950">
                Personal Information
              </h2>

              <p className="text-xs text-slate-500">
                Your administrator account details
              </p>
            </div>
          </div>

          <div className="mt-5 grid gap-5 md:grid-cols-2">
            {/* Name */}
            <div>
              <label className="text-xs font-bold text-slate-600">
                Full Name
              </label>

              <input
                type="text"
                value={profile.name}
                disabled={!isEditing}
                onChange={(event) =>
                  handleChange("name", event.target.value)
                }
                className="mt-2 h-11 w-full rounded-lg border border-slate-300 px-3 text-sm text-slate-700 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100 disabled:bg-slate-50 disabled:text-slate-500"
              />
            </div>

            {/* Username */}
            <div>
              <label className="text-xs font-bold text-slate-600">
                Username
              </label>

              <input
                type="text"
                value={profile.username}
                disabled={!isEditing}
                onChange={(event) =>
                  handleChange("username", event.target.value)
                }
                className="mt-2 h-11 w-full rounded-lg border border-slate-300 px-3 text-sm text-slate-700 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100 disabled:bg-slate-50 disabled:text-slate-500"
              />
            </div>

            {/* Email */}
            <div>
              <label className="text-xs font-bold text-slate-600">
                Email Address
              </label>

              <input
                type="email"
                value={profile.email}
                disabled={!isEditing}
                onChange={(event) =>
                  handleChange("email", event.target.value)
                }
                className="mt-2 h-11 w-full rounded-lg border border-slate-300 px-3 text-sm text-slate-700 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100 disabled:bg-slate-50 disabled:text-slate-500"
              />
            </div>

            {/* Mobile */}
            <div>
              <label className="text-xs font-bold text-slate-600">
                Mobile Number
              </label>

              <input
                type="tel"
                value={profile.mobile}
                disabled={!isEditing}
                onChange={(event) =>
                  handleChange("mobile", event.target.value)
                }
                className="mt-2 h-11 w-full rounded-lg border border-slate-300 px-3 text-sm text-slate-700 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100 disabled:bg-slate-50 disabled:text-slate-500"
              />
            </div>

            {/* Role */}
            <div className="md:col-span-2">
              <label className="text-xs font-bold text-slate-600">
                Administrator Role
              </label>

              <input
                type="text"
                value={profile.role}
                disabled
                className="mt-2 h-11 w-full rounded-lg border border-slate-300 bg-slate-50 px-3 text-sm text-slate-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Security */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50">
              <KeyRound className="h-5 w-5 text-green-700" />
            </div>

            <div>
              <h2 className="text-lg font-extrabold text-blue-950">
                Account Security
              </h2>

              <p className="text-xs text-slate-500">
                Keep your administrator account secure.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleChangePassword}
            className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-bold text-blue-700 transition hover:bg-slate-50"
          >
            Change Password
          </button>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <div className="rounded-xl bg-green-50 p-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-700" />

              <p className="text-sm font-bold text-green-800">
                Password Protected
              </p>
            </div>

            <p className="mt-1 text-xs leading-5 text-green-700">
              Your administrator account is protected with a password.
            </p>
          </div>

          <div className="rounded-xl bg-blue-50 p-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-blue-700" />

              <p className="text-sm font-bold text-blue-800">
                Secure Access
              </p>
            </div>

            <p className="mt-1 text-xs leading-5 text-blue-700">
              Only authorized administrators can access system controls.
            </p>
          </div>
        </div>
      </div>

      {/* Notification Preferences */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div>
          <h2 className="text-lg font-extrabold text-blue-950">
            Notification Preferences
          </h2>

          <p className="mt-1 text-xs text-slate-500">
            Choose which system updates you want to receive.
          </p>
        </div>

        <div className="mt-5 divide-y divide-slate-100">
          {[
            {
              key: "systemAlerts",
              title: "System Alerts",
              description:
                "Receive important system and security alerts.",
            },
            {
              key: "paymentAlerts",
              title: "Payment Alerts",
              description:
                "Get notified about pending and failed payments.",
            },
            {
              key: "bookingAlerts",
              title: "Booking Alerts",
              description:
                "Receive updates about new and cancelled bookings.",
            },
            {
              key: "emailUpdates",
              title: "Email Updates",
              description:
                "Receive regular system reports and updates by email.",
            },
          ].map((item) => (
            <div
              key={item.key}
              className="flex items-center justify-between gap-4 py-4"
            >
              <div>
                <p className="text-sm font-bold text-slate-700">
                  {item.title}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  {item.description}
                </p>
              </div>

              <button
                type="button"
                onClick={() => toggleNotification(item.key)}
                className={`relative h-6 w-11 shrink-0 rounded-full transition ${
                  notifications[item.key]
                    ? "bg-green-700"
                    : "bg-slate-300"
                }`}
                aria-label={`Toggle ${item.title}`}
              >
                <span
                  className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition ${
                    notifications[item.key]
                      ? "left-6"
                      : "left-1"
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Info */}
      <div className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-4">
        <div className="flex items-start gap-3">
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-blue-700" />

          <div>
            <p className="text-sm font-bold text-blue-900">
              Administrator Access
            </p>

            <p className="mt-1 text-xs leading-5 text-blue-700">
              Administrator accounts have access to farmer records,
              procurement centres, bookings, payments, and system reports.
              Keep your login credentials private.
            </p>
          </div>
        </div>
      </div>

      {/* Back */}
      <div>
        <Link
          to="/admin/dashboard"
          className="inline-flex items-center gap-2 text-sm font-bold text-blue-700 hover:text-blue-800"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}

export default AdminProfile;