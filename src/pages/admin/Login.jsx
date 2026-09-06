import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    Eye,
    EyeOff,
    LockKeyhole,
    ShieldCheck,
    UserRound,
} from "lucide-react";

import adminLoginBg from "../../assets/images/admin-login-bg.png";

function AdminLogin() {
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = (event) => {
        event.preventDefault();

        if (!username.trim() || !password) {
            setError("Please enter username and password.");
            return;
        }

        // Demo admin credentials
        if (username !== "admin" || password !== "admin123") {
            setError("Invalid username or password.");
            return;
        }

        setError("");

        localStorage.setItem("adminLoggedIn", "true");
        localStorage.setItem("userRole", "admin");

        if (rememberMe) {
            localStorage.setItem("rememberAdmin", "true");
        } else {
            localStorage.removeItem("rememberAdmin");
        }

        navigate("/admin/dashboard");
    };

    return (
        <div className="min-h-screen bg-white">

            <div className="grid min-h-[calc(100vh-4px)] lg:grid-cols-2">
                {/* Left Image Section */}
                <section className="relative hidden overflow-hidden lg:block">
                    <img
                        src={adminLoginBg}
                        alt="Admin workspace"
                        className="absolute inset-0 h-full w-full object-cover"
                    />

                    {/* Welcome Content */}
                    <div className="absolute left-[25%] top-[20%] z-10">
                        <h1 className="text-[30px] font-extrabold tracking-tight text-blue-950 xl:text-[34px]">
                            Welcome Admin!
                        </h1>

                        <p className="mt-4 text-[13px] font-medium leading-6 text-blue-950 xl:text-sm">
                            Login to access the admin dashboard
                            <br />
                            and manage the system efficiently.
                        </p>

                        <div className="mt-6 flex items-center gap-3">
                            <span className="h-px w-14 bg-green-700" />

                            <ShieldCheck
                                className="h-5 w-5 text-green-700"
                                strokeWidth={2}
                            />

                            <span className="h-px w-14 bg-green-700" />
                        </div>
                    </div>
                </section>

                {/* Right Login Section */}
                <section className="flex min-h-[calc(100vh-4px)] items-center justify-center bg-white px-5 py-10 sm:px-8">
                    <div className="w-full max-w-[390px]">
                        {/* Login Card */}
                        <div className="rounded-lg border border-slate-200 bg-white px-6 py-7 shadow-[0_2px_10px_rgba(15,23,42,0.06)] sm:px-7 sm:py-7">
                            {/* Heading */}
                            <div className="text-center">
                                <h2 className="text-[21px] font-extrabold text-blue-950">
                                    Admin Login
                                </h2>

                                <p className="mt-1.5 text-[11px] font-medium text-slate-600">
                                    Enter your credentials to continue
                                </p>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="mt-7 space-y-4">
                                {/* Username */}
                                <div>
                                    <label
                                        htmlFor="admin-username"
                                        className="mb-1.5 block text-[10px] font-bold text-blue-950"
                                    >
                                        Username
                                    </label>

                                    <div className="relative">
                                        <UserRound className="absolute left-3 top-1/2 h-[16px] w-[16px] -translate-y-1/2 text-slate-400" />

                                        <input
                                            id="admin-username"
                                            type="text"
                                            value={username}
                                            onChange={(event) => {
                                                setUsername(event.target.value);
                                                setError("");
                                            }}
                                            placeholder="Enter username"
                                            autoComplete="username"
                                            className="h-10 w-full rounded-md border border-slate-300 bg-white pl-9 pr-3 text-[11px] text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-green-700 focus:ring-2 focus:ring-green-100"
                                        />
                                    </div>
                                </div>

                                {/* Password */}
                                <div>
                                    <label
                                        htmlFor="admin-password"
                                        className="mb-1.5 block text-[10px] font-bold text-blue-950"
                                    >
                                        Password
                                    </label>

                                    <div className="relative">
                                        <LockKeyhole className="absolute left-3 top-1/2 h-[16px] w-[16px] -translate-y-1/2 text-slate-400" />

                                        <input
                                            id="admin-password"
                                            type={showPassword ? "text" : "password"}
                                            value={password}
                                            onChange={(event) => {
                                                setPassword(event.target.value);
                                                setError("");
                                            }}
                                            placeholder="Enter password"
                                            autoComplete="current-password"
                                            className="h-10 w-full rounded-md border border-slate-300 bg-white pl-9 pr-10 text-[11px] text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-green-700 focus:ring-2 focus:ring-green-100"
                                        />

                                        <button
                                            type="button"
                                            onClick={() => setShowPassword((value) => !value)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-700"
                                            aria-label={
                                                showPassword
                                                    ? "Hide password"
                                                    : "Show password"
                                            }
                                        >
                                            {showPassword ? (
                                                <EyeOff className="h-4 w-4" />
                                            ) : (
                                                <Eye className="h-4 w-4" />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                {/* Remember / Forgot */}
                                <div className="flex items-center justify-between pt-0.5">
                                    <label className="flex cursor-pointer items-center gap-2 text-[10px] font-medium text-slate-600">
                                        <input
                                            type="checkbox"
                                            checked={rememberMe}
                                            onChange={(event) =>
                                                setRememberMe(event.target.checked)
                                            }
                                            className="h-3.5 w-3.5 rounded border-slate-300 accent-green-700"
                                        />

                                        Remember Me
                                    </label>

                                    <button
                                        type="button"
                                        className="text-[10px] font-bold text-blue-700 transition hover:text-blue-900"
                                    >
                                        Forgot Password?
                                    </button>
                                </div>

                                {/* Error */}
                                {error && (
                                    <div className="rounded-md bg-red-50 px-3 py-2 text-[10px] font-medium text-red-600">
                                        {error}
                                    </div>
                                )}

                                {/* Login Button */}
                                <button
                                    type="submit"
                                    className="mt-1 h-10 w-full rounded-md bg-green-700 text-xs font-bold text-white shadow-sm transition hover:bg-green-800 active:scale-[0.99]"
                                >
                                    Login
                                </button>
                                <div className="mt-6 text-center">
                                    <p className="text-[10px] text-slate-600 sm:text-[11px]">
                                        Don't have an admin account?{" "}
                                        <Link
                                            to="/admin/register"
                                            className="font-bold text-blue-700 transition hover:text-blue-800"
                                        >
                                            Register Here
                                        </Link>
                                    </p>
                                </div>
                            </form>

                        </div>

                        {/* Back Link */}
                        <div className="mt-5 text-center">
                            <Link
                                to="/login"
                                className="text-[10px] font-semibold text-slate-500 transition hover:text-blue-950"
                            >
                                ← Back to Role Selection
                            </Link>
                        </div>
                    </div>
                </section>
            </div>

            {/* Mobile Welcome */}
            <section className="border-t border-slate-200 bg-slate-50 px-5 py-7 text-center lg:hidden">
                <h1 className="text-xl font-extrabold text-blue-950">
                    Welcome Admin!
                </h1>

                <p className="mx-auto mt-2 max-w-sm text-xs leading-5 text-slate-600">
                    Login to access the admin dashboard and manage the
                    system efficiently.
                </p>

                <div className="mt-4 flex items-center justify-center gap-3">
                    <span className="h-px w-12 bg-green-700" />

                    <ShieldCheck className="h-5 w-5 text-green-700" />

                    <span className="h-px w-12 bg-green-700" />
                </div>
            </section>
        </div>
    );
}

export default AdminLogin;