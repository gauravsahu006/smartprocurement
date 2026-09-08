import { useState } from "react";
import { Link } from "react-router-dom";
import {
  CalendarDays,
  Eye,
  EyeOff,
  Leaf,
  LocateFixed,
  LockKeyhole,
  Mail,
  Phone,
  ShieldCheck,
  User,
  UserRoundPlus,
  WalletCards,
} from "lucide-react";

import farmerField from "../../assets/images/farmer-field.png";
import { supabase } from "../../lib/supabase";

function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    let newValue = value;

    // Mobile: only numbers, maximum 10 digits
    if (name === "mobile") {
      newValue = value.replace(/\D/g, "").slice(0, 10);
    }

    setForm((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    // Remove field error while typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }

    // Remove submit error while typing
    if (errors.submit) {
      setErrors((prev) => ({
        ...prev,
        submit: "",
      }));
    }

    setSuccessMessage("");
  };

  const validateForm = () => {
    const newErrors = {};

    // Full Name
    if (!form.fullName.trim()) {
      newErrors.fullName = "Full name is required.";
    } else if (form.fullName.trim().length < 3) {
      newErrors.fullName = "Name must be at least 3 characters.";
    }

    // Email
    if (!form.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())
    ) {
      newErrors.email = "Enter a valid email address.";
    }

    // Mobile
    if (!form.mobile) {
      newErrors.mobile = "Mobile number is required.";
    } else if (!/^[6-9]\d{9}$/.test(form.mobile)) {
      newErrors.mobile = "Enter a valid 10-digit mobile number.";
    }

    // Password
    if (!form.password) {
      newErrors.password = "Password is required.";
    } else if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }

    // Confirm Password
    if (!form.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password.";
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrors({});
    setSuccessMessage("");

    const isValid = validateForm();

    if (!isValid) {
      return;
    }

    setLoading(true);

    try {
      /*
       * STEP 1
       * Create user in Supabase Authentication
       */
      const { data: authData, error: authError } =
        await supabase.auth.signUp({
          email: form.email.trim().toLowerCase(),
          password: form.password,

        options: {
            data: {
              full_name: form.fullName.trim(),
              phone: form.mobile,
              role: "farmer",
            },
          },
         });

         
        

      if (authError) {
        throw authError;
      }

     if (!authData?.user) {
  throw new Error(
    "Registration failed. User was not created."
  );
}

if (!authData.session) {
  throw new Error(
    "Registration completed, but no active session was created."
  );
}

const userId = authData.user.id;

      /*
       * STEP 2
       * Create farmer profile
       *
       * profiles table:
       * id
       * full_name
       * phone
       * role
       */
      const profilePayload = {
        id: userId,
        full_name: form.fullName.trim(),
        phone: form.mobile,
        role: "farmer",
      };

      const { error: profileError } = await supabase
        .from("profiles")
        .upsert(profilePayload, {
          onConflict: "id",
        });

      if (profileError) {
        console.error(
          "Profile creation error:",
          profileError
        );

        throw new Error(
          `Account created, but farmer profile could not be saved: ${profileError.message}`
        );
      }

      /*
       * STEP 3
       * Registration successful
       */
      setSuccessMessage(
        "Registration successful! You can now login with your email and password."
      );

      /*
       * Clear form
       */
      setForm({
        fullName: "",
        email: "",
        mobile: "",
        password: "",
        confirmPassword: "",
      });

      setShowPassword(false);
      setShowConfirmPassword(false);
    } catch (error) {
      console.error("Registration error:", error);

      let message =
        error?.message ||
        "Registration failed. Please try again.";

      /*
       * Common Supabase errors
       */
      const lowerMessage = message.toLowerCase();

      if (
        lowerMessage.includes("user already registered") ||
        lowerMessage.includes("already registered")
      ) {
        message =
          "This email is already registered. Please login.";
      }

      if (
        lowerMessage.includes("invalid login credentials")
      ) {
        message =
          "Invalid registration details. Please check your information.";
      }

      if (
        lowerMessage.includes("duplicate") &&
        lowerMessage.includes("phone")
      ) {
        message =
          "This mobile number is already registered.";
      }

      setErrors({
        submit: message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="h-[72px] border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-full max-w-[1440px] items-center justify-between px-5 sm:px-8">
          <Link
            to="/"
            className="flex items-center gap-2.5"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-green-50">
              <Leaf className="h-7 w-7 text-green-700" />
            </div>

            <div className="leading-tight">
              <h1 className="text-lg font-extrabold tracking-tight text-green-800 sm:text-xl">
                Smart Procurement
              </h1>

              <p className="text-[10px] font-semibold text-blue-900 sm:text-[11px]">
                & Queue Management System
              </p>
            </div>
          </Link>

          <p className="text-xs text-slate-600 sm:text-sm">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-bold text-blue-800 hover:text-green-700"
            >
              Login
            </Link>
          </p>
        </div>
      </header>

      {/* Main */}
      <main>
        <div className="mx-auto grid max-w-[1440px] grid-cols-1 lg:grid-cols-[1.15fr_0.7fr_0.7fr]">
          {/* Form */}
          <section className="flex items-center justify-center px-6 py-10 sm:px-10 lg:px-12 xl:px-20">
            <div className="w-full max-w-[470px]">
              <div className="mb-7">
                <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-green-50">
                  <UserRoundPlus className="h-6 w-6 text-green-700" />
                </div>

                <h2 className="text-2xl font-extrabold text-blue-950 sm:text-3xl">
                  Create Your Account
                </h2>

                <p className="mt-2 text-sm text-slate-600">
                  Register to access smart procurement services
                </p>
              </div>

              <form
                onSubmit={handleSubmit}
                className="space-y-4"
              >
                {/* Full Name */}
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                    Full Name
                  </label>

                  <div className="relative">
                    <User
                      className={`absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 ${
                        errors.fullName
                          ? "text-red-500"
                          : "text-slate-400"
                      }`}
                    />

                    <input
                      type="text"
                      name="fullName"
                      value={form.fullName}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      autoComplete="name"
                      className={`h-11 w-full rounded-lg border bg-white pl-11 pr-4 text-sm outline-none transition ${
                        errors.fullName
                          ? "border-red-500 focus:ring-2 focus:ring-red-100"
                          : "border-slate-200 focus:border-green-600 focus:ring-2 focus:ring-green-100"
                      }`}
                    />
                  </div>

                  {errors.fullName && (
                    <p className="mt-1 text-xs font-medium text-red-600">
                      {errors.fullName}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                    Email Address
                  </label>

                  <div className="relative">
                    <Mail
                      className={`absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 ${
                        errors.email
                          ? "text-red-500"
                          : "text-slate-400"
                      }`}
                    />

                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="Enter your email address"
                      autoComplete="email"
                      className={`h-11 w-full rounded-lg border bg-white pl-11 pr-4 text-sm outline-none transition ${
                        errors.email
                          ? "border-red-500 focus:ring-2 focus:ring-red-100"
                          : "border-slate-200 focus:border-green-600 focus:ring-2 focus:ring-green-100"
                      }`}
                    />
                  </div>

                  {errors.email && (
                    <p className="mt-1 text-xs font-medium text-red-600">
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Mobile */}
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                    Mobile Number
                  </label>

                  <div className="relative">
                    <Phone
                      className={`absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 ${
                        errors.mobile
                          ? "text-red-500"
                          : "text-slate-400"
                      }`}
                    />

                    <input
                      type="tel"
                      name="mobile"
                      value={form.mobile}
                      onChange={handleChange}
                      placeholder="Enter 10-digit mobile number"
                      inputMode="numeric"
                      maxLength={10}
                      autoComplete="tel"
                      className={`h-11 w-full rounded-lg border bg-white pl-11 pr-4 text-sm outline-none transition ${
                        errors.mobile
                          ? "border-red-500 focus:ring-2 focus:ring-red-100"
                          : "border-slate-200 focus:border-green-600 focus:ring-2 focus:ring-green-100"
                      }`}
                    />
                  </div>

                  {errors.mobile && (
                    <p className="mt-1 text-xs font-medium text-red-600">
                      {errors.mobile}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                    Password
                  </label>

                  <div className="relative">
                    <LockKeyhole
                      className={`absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 ${
                        errors.password
                          ? "text-red-500"
                          : "text-slate-400"
                      }`}
                    />

                    <input
                      type={
                        showPassword ? "text" : "password"
                      }
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      placeholder="Create password"
                      autoComplete="new-password"
                      className={`h-11 w-full rounded-lg border bg-white pl-11 pr-11 text-sm outline-none transition ${
                        errors.password
                          ? "border-red-500 focus:ring-2 focus:ring-red-100"
                          : "border-slate-200 focus:border-green-600 focus:ring-2 focus:ring-green-100"
                      }`}
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(!showPassword)
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>

                  {errors.password && (
                    <p className="mt-1 text-xs font-medium text-red-600">
                      {errors.password}
                    </p>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                    Confirm Password
                  </label>

                  <div className="relative">
                    <LockKeyhole
                      className={`absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 ${
                        errors.confirmPassword
                          ? "text-red-500"
                          : "text-slate-400"
                      }`}
                    />

                    <input
                      type={
                        showConfirmPassword
                          ? "text"
                          : "password"
                      }
                      name="confirmPassword"
                      value={form.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm your password"
                      autoComplete="new-password"
                      className={`h-11 w-full rounded-lg border bg-white pl-11 pr-11 text-sm outline-none transition ${
                        errors.confirmPassword
                          ? "border-red-500 focus:ring-2 focus:ring-red-100"
                          : "border-slate-200 focus:border-green-600 focus:ring-2 focus:ring-green-100"
                      }`}
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(
                          !showConfirmPassword
                        )
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>

                  {errors.confirmPassword && (
                    <p className="mt-1 text-xs font-medium text-red-600">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>

                {/* Submit Error */}
                {errors.submit && (
                  <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3">
                    <p className="text-xs font-medium text-red-700">
                      {errors.submit}
                    </p>
                  </div>
                )}

                {/* Success */}
                {successMessage && (
                  <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3">
                    <p className="text-xs font-medium text-green-700">
                      {successMessage}
                    </p>
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className={`mt-2 h-11 w-full rounded-lg text-sm font-bold text-white transition ${
                    loading
                      ? "cursor-not-allowed bg-green-500"
                      : "bg-green-700 hover:bg-green-800"
                  }`}
                >
                  {loading
                    ? "Creating Account..."
                    : "Create Account"}
                </button>
              </form>

              <p className="mt-5 text-center text-sm text-slate-600">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-bold text-blue-800 hover:text-green-700"
                >
                  Login
                </Link>
              </p>
            </div>
          </section>

          {/* Image */}
          <section className="hidden min-h-[calc(100vh-72px)] lg:block">
            <img
              src={farmerField}
              alt="Farmer working in field"
              className="h-full w-full object-cover"
            />
          </section>

          {/* Benefits */}
          <section className="hidden items-center px-7 py-10 lg:flex xl:px-10">
            <div className="w-full">
              <h2 className="text-center text-xl font-extrabold leading-7 text-green-800">
                Everything you need
                <span className="block">
                  in one place
                </span>
              </h2>

              <div className="mt-7 space-y-3">
                <div className="flex items-center gap-4 rounded-xl border border-slate-200 p-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-green-50">
                    <LocateFixed className="h-5 w-5 text-green-700" />
                  </div>

                  <p className="text-xs font-semibold leading-5 text-slate-700">
                    Find nearby procurement
                    <br />
                    centres
                  </p>
                </div>

                <div className="flex items-center gap-4 rounded-xl border border-slate-200 p-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50">
                    <CalendarDays className="h-5 w-5 text-blue-700" />
                  </div>

                  <p className="text-xs font-semibold leading-5 text-slate-700">
                    Book convenient
                    <br />
                    time slots
                  </p>
                </div>

                <div className="flex items-center gap-4 rounded-xl border border-slate-200 p-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-50">
                    <WalletCards className="h-5 w-5 text-orange-600" />
                  </div>

                  <p className="text-xs font-semibold leading-5 text-slate-700">
                    Track procurement &
                    <br />
                    payment status
                  </p>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-center gap-2 rounded-lg bg-green-50 p-4 text-xs font-medium text-green-800">
                <ShieldCheck className="h-5 w-5" />
                Your data is safe and secure with us.
              </div>
            </div>
          </section>

          {/* Mobile Image */}
          <section className="h-[280px] lg:hidden">
            <img
              src={farmerField}
              alt="Farmer working in field"
              className="h-full w-full object-cover"
            />
          </section>

          {/* Mobile Benefits */}
          <section className="px-5 py-8 lg:hidden">
            <h2 className="text-center text-xl font-extrabold text-green-800">
              Everything you need
              <span className="block">
                in one place
              </span>
            </h2>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="flex items-center gap-3 rounded-xl border p-4">
                <LocateFixed className="h-5 w-5 shrink-0 text-green-700" />

                <span className="text-xs font-semibold">
                  Find nearby procurement centres
                </span>
              </div>

              <div className="flex items-center gap-3 rounded-xl border p-4">
                <CalendarDays className="h-5 w-5 shrink-0 text-blue-700" />

                <span className="text-xs font-semibold">
                  Book convenient time slots
                </span>
              </div>

              <div className="flex items-center gap-3 rounded-xl border p-4">
                <WalletCards className="h-5 w-5 shrink-0 text-orange-600" />

                <span className="text-xs font-semibold">
                  Track payment status
                </span>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-center gap-2 rounded-lg bg-green-50 p-4 text-xs font-medium text-green-800">
              <ShieldCheck className="h-5 w-5" />
              Your data is safe and secure with us.
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default Register;