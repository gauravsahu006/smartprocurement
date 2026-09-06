import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  CalendarDays,
  Eye,
  EyeOff,
  Leaf,
  LocateFixed,
  LockKeyhole,
  Phone,
  ShieldCheck,
  Ticket,
  WalletCards,
} from "lucide-react";

import farmerField from "../../assets/images/farmer-field2.png";

function FarmerLogin() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    mobile: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "mobile") {
      const numbersOnly = value.replace(/\D/g, "").slice(0, 10);

      setForm({
        ...form,
        mobile: numbersOnly,
      });
    } else {
      setForm({
        ...form,
        [name]: value,
      });
    }

    // Remove error while user corrects the field
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!form.mobile) {
      newErrors.mobile = "Mobile number is required.";
    } else if (!/^[6-9]\d{9}$/.test(form.mobile)) {
      newErrors.mobile = "Enter a valid 10-digit mobile number.";
    }

    if (!form.password) {
      newErrors.password = "Password is required.";
    } else if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const isValid = validateForm();

    if (!isValid) {
      return;
    }

    // Temporary navigation until backend authentication is added
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="h-[72px] border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-full max-w-[1440px] items-center justify-between px-5 sm:px-8">
          <Link to="/" className="flex items-center gap-2.5">
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
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-bold text-blue-800 hover:text-green-700"
            >
              Register
            </Link>
          </p>
        </div>
      </header>

      {/* Main */}
      <main className="min-h-[calc(100vh-72px)]">
        <div className="mx-auto grid min-h-[calc(100vh-72px)] max-w-[1440px] grid-cols-1 lg:grid-cols-[1.15fr_0.7fr_0.7fr]">
          
          {/* Login Form */}
          <section className="flex items-center justify-center bg-white px-6 py-10 sm:px-10 lg:px-12 xl:px-20">
            <div className="w-full max-w-[470px]">
              <div className="mb-8">
                <h2 className="text-2xl font-extrabold text-blue-950 sm:text-3xl">
                  Welcome Back
                </h2>

                <p className="mt-2 text-sm text-slate-600">
                  Login to manage your procurement journey
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
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
                      placeholder="Enter mobile number"
                      inputMode="numeric"
                      maxLength={10}
                      className={`h-12 w-full rounded-lg border bg-white pl-11 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:ring-2 ${
                        errors.mobile
                          ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                          : "border-slate-200 focus:border-green-600 focus:ring-green-100"
                      }`}
                    />
                  </div>

                  {errors.mobile && (
                    <p className="mt-1.5 text-xs font-medium text-red-600">
                      {errors.mobile}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <div className="mb-1.5 flex items-center justify-between">
                    <label className="text-xs font-semibold text-slate-700">
                      Password
                    </label>

                    <button
                      type="button"
                      className="text-xs font-semibold text-blue-800 hover:text-green-700"
                    >
                      Forgot Password?
                    </button>
                  </div>

                  <div className="relative">
                    <LockKeyhole
                      className={`absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 ${
                        errors.password
                          ? "text-red-500"
                          : "text-slate-400"
                      }`}
                    />

                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      placeholder="Enter password"
                      className={`h-12 w-full rounded-lg border bg-white pl-11 pr-11 text-sm outline-none transition placeholder:text-slate-400 focus:ring-2 ${
                        errors.password
                          ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                          : "border-slate-200 focus:border-green-600 focus:ring-green-100"
                      }`}
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>

                  {errors.password && (
                    <p className="mt-1.5 text-xs font-medium text-red-600">
                      {errors.password}
                    </p>
                  )}
                </div>

                {/* Remember */}
                <label className="flex cursor-pointer items-center gap-2 text-xs text-slate-600">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-slate-300 accent-green-700"
                  />
                  Remember me
                </label>

                {/* Login */}
                <button
                  type="submit"
                  className="h-12 w-full rounded-lg bg-green-700 text-sm font-bold text-white shadow-sm transition hover:bg-green-800"
                >
                  Login
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-slate-600">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="font-bold text-blue-800 hover:text-green-700"
                >
                  Create Account
                </Link>
              </p>

              <div className="mt-8 flex items-center justify-center gap-2 border-t border-slate-100 pt-5 text-xs text-slate-500">
                <ShieldCheck className="h-4 w-4 text-green-700" />
                Your data is safe and secure with us.
              </div>
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
          <section className="hidden items-center bg-white px-7 py-10 lg:flex xl:px-10">
            <div className="w-full">
              <h2 className="text-center text-xl font-extrabold leading-7 text-green-800">
                Everything you need
                <span className="block">in one place</span>
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
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-purple-50">
                    <Ticket className="h-5 w-5 text-purple-700" />
                  </div>

                  <p className="text-xs font-semibold leading-5 text-slate-700">
                    Get digital token &
                    <br />
                    track queue
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
          <section className="relative h-[280px] lg:hidden">
            <img
              src={farmerField}
              alt="Farmer working in field"
              className="h-full w-full object-cover"
            />
          </section>

          {/* Mobile Benefits */}
          <section className="bg-white px-5 py-8 lg:hidden">
            <h2 className="text-center text-xl font-extrabold text-green-800">
              Everything you need
              <span className="block">in one place</span>
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
                <Ticket className="h-5 w-5 shrink-0 text-purple-700" />
                <span className="text-xs font-semibold">
                  Get digital token & track queue
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

export default FarmerLogin;