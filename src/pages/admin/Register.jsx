import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  LockKeyhole,
  ShieldCheck,
  UserRound,
  Mail,
} from "lucide-react";

import adminLoginBg from "../../assets/images/admin-login-bg.png";

function AdminRegister() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const {
      name,
      email,
      username,
      password,
      confirmPassword,
    } = formData;

    if (!name || !email || !username || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const existingAdmin = JSON.parse(
      localStorage.getItem("adminUser")
    );

    if (existingAdmin?.username === username) {
      setError("This username is already registered.");
      return;
    }

    const adminUser = {
      name,
      email,
      username,
      password,
    };

    localStorage.setItem("adminUser", JSON.stringify(adminUser));

    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen bg-white">

      <div className="grid min-h-[calc(100vh-4px)] lg:grid-cols-2">
        {/* Left Image */}
        <section className="relative hidden overflow-hidden lg:block">
          <img
            src={adminLoginBg}
            alt="Admin workspace"
            className="absolute inset-0 h-full w-full object-cover"
          />

          <div className="absolute left-[17%] top-[16%]">
            <h1 className="text-[30px] font-extrabold tracking-tight text-blue-950 xl:text-[34px]">
              Create Admin Account!
            </h1>

            <p className="mt-4 text-[13px] font-medium leading-6 text-blue-950 xl:text-sm">
              Register your admin account to manage
              <br />
              the Smart Procurement System efficiently.
            </p>

            <div className="mt-6 flex items-center gap-3">
              <span className="h-px w-14 bg-green-700" />

              <ShieldCheck className="h-5 w-5 text-green-700" />

              <span className="h-px w-14 bg-green-700" />
            </div>
          </div>
        </section>

        {/* Right Form */}
        <section className="flex min-h-[calc(100vh-4px)] items-center justify-center px-5 py-8 sm:px-8">
          <div className="w-full max-w-[400px]">
            <div className="rounded-lg border border-slate-200 bg-white px-6 py-6 shadow-[0_2px_10px_rgba(15,23,42,0.06)] sm:px-7">
              <div className="text-center">
                <h2 className="text-[21px] font-extrabold text-blue-950">
                  Admin Registration
                </h2>

                <p className="mt-1.5 text-[11px] font-medium text-slate-600">
                  Create your administrator account
                </p>
              </div>

              <form
                onSubmit={handleSubmit}
                className="mt-6 space-y-3"
              >
                {/* Full Name */}
                <div>
                  <label className="mb-1.5 block text-[10px] font-bold text-blue-950">
                    Full Name
                  </label>

                  <div className="relative">
                    <UserRound className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter full name"
                      className="h-9 w-full rounded-md border border-slate-300 pl-9 pr-3 text-[11px] outline-none transition focus:border-green-700 focus:ring-2 focus:ring-green-100"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="mb-1.5 block text-[10px] font-bold text-blue-950">
                    Email Address
                  </label>

                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter email address"
                      className="h-9 w-full rounded-md border border-slate-300 pl-9 pr-3 text-[11px] outline-none transition focus:border-green-700 focus:ring-2 focus:ring-green-100"
                    />
                  </div>
                </div>

                {/* Username */}
                <div>
                  <label className="mb-1.5 block text-[10px] font-bold text-blue-950">
                    Username
                  </label>

                  <div className="relative">
                    <UserRound className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      placeholder="Create username"
                      className="h-9 w-full rounded-md border border-slate-300 pl-9 pr-3 text-[11px] outline-none transition focus:border-green-700 focus:ring-2 focus:ring-green-100"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="mb-1.5 block text-[10px] font-bold text-blue-950">
                    Password
                  </label>

                  <div className="relative">
                    <LockKeyhole className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Create password"
                      className="h-9 w-full rounded-md border border-slate-300 pl-9 pr-10 text-[11px] outline-none transition focus:border-green-700 focus:ring-2 focus:ring-green-100"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword((value) => !value)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="mb-1.5 block text-[10px] font-bold text-blue-950">
                    Confirm Password
                  </label>

                  <div className="relative">
                    <LockKeyhole className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm password"
                      className="h-9 w-full rounded-md border border-slate-300 pl-9 pr-10 text-[11px] outline-none transition focus:border-green-700 focus:ring-2 focus:ring-green-100"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(
                          (value) => !value
                        )
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Error */}
                {error && (
                  <div className="rounded-md bg-red-50 px-3 py-2 text-[10px] font-medium text-red-600">
                    {error}
                  </div>
                )}

                {/* Register */}
                <button
                  type="submit"
                  className="mt-2 h-10 w-full rounded-md bg-green-700 text-xs font-bold text-white shadow-sm transition hover:bg-green-800 active:scale-[0.99]"
                >
                  Create Admin Account
                </button>
              </form>

              {/* Security */}
              <div className="mt-5 flex items-center gap-3 rounded-full bg-green-50 px-4 py-2.5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-green-700">
                  <ShieldCheck className="h-4 w-4" />
                </div>

                <div>
                  <p className="text-[10px] font-bold text-green-800">
                    Secure Registration
                  </p>

                  <p className="text-[8px] leading-4 text-green-700">
                    Your administrator details are kept secure.
                  </p>
                </div>
              </div>

              {/* Login */}
              <div className="mt-5 text-center">
                <p className="text-[10px] text-slate-600">
                  Already have an admin account?{" "}
                  <Link
                    to="/admin/login"
                    className="font-bold text-blue-700 hover:text-blue-800"
                  >
                    Login Here
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Mobile Welcome */}
      <section className="border-t border-slate-200 bg-slate-50 px-5 py-6 text-center lg:hidden">
        <h1 className="text-xl font-extrabold text-blue-950">
          Create Admin Account!
        </h1>

        <p className="mx-auto mt-2 max-w-sm text-xs leading-5 text-slate-600">
          Register your admin account to manage the Smart
          Procurement System efficiently.
        </p>
      </section>
    </div>
  );
}

export default AdminRegister;