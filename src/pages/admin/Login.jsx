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
import { supabase } from "../../lib/supabase";

function AdminLogin() {
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");

        if (!username.trim() || !password) {
            setError("Please enter username and password.");
            return;
        }

        try {
            setLoading(true);

            /*
             * =====================================================
             * ADMIN LOGIN
             * =====================================================
             *
             * Supabase Auth uses email/password.
             *
             * If the admin enters:
             *
             * admin@test.com
             *
             * it will be used directly as the email.
             *
             * If your admin username is stored as an email,
             * this works directly.
             */

            let email = username.trim();

            /*
             * Optional convenience:
             * If user types only "admin", convert it to
             * admin@test.com.
             *
             * CHANGE THIS EMAIL if your actual admin
             * Supabase Auth email is different.
             */

            if (!email.includes("@")) {
                email = `${email}@test.com`;
            }

            // =====================================================
            // 1. SUPABASE AUTH LOGIN
            // =====================================================

            const {
                data: authData,
                error: authError,
            } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (authError) {
                throw new Error(
                    authError.message ||
                    "Invalid username or password."
                );
            }

            const user = authData?.user;

            if (!user) {
                throw new Error(
                    "Unable to login. Please try again."
                );
            }

            console.log(
                "Admin authenticated user:",
                user
            );

            // =====================================================
            // 2. GET PROFILE
            // =====================================================

            const {
                data: profile,
                error: profileError,
            } = await supabase
                .from("profiles")
                .select("id, full_name, role")
                .eq("id", user.id)
                .single();

            if (profileError) {
                console.error(
                    "Admin profile error:",
                    profileError
                );

                /*
                 * Logout because authentication succeeded
                 * but profile verification failed.
                 */

                await supabase.auth.signOut();

                throw new Error(
                    "Admin profile not found."
                );
            }

            console.log(
                "Admin profile:",
                profile
            );

            // =====================================================
            // 3. VERIFY ADMIN ROLE
            // =====================================================

            if (profile.role !== "admin") {
                await supabase.auth.signOut();

                throw new Error(
                    "Access denied. This account is not an admin account."
                );
            }

            // =====================================================
            // 4. SAVE LOGIN INFORMATION
            // =====================================================

            localStorage.setItem(
                "userRole",
                "admin"
            );

            localStorage.setItem(
                "adminLoggedIn",
                "true"
            );

            localStorage.setItem(
                "adminUserId",
                user.id
            );

            if (rememberMe) {
                localStorage.setItem(
                    "rememberAdmin",
                    "true"
                );
            } else {
                localStorage.removeItem(
                    "rememberAdmin"
                );
            }

            // =====================================================
            // 5. GO TO ADMIN DASHBOARD
            // =====================================================

            navigate("/admin/dashboard");

        } catch (err) {
            console.error(
                "Admin login error:",
                err
            );

            setError(
                err.message ||
                "Invalid username or password."
            );

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white">

            <div className="grid min-h-[calc(100vh-4px)] lg:grid-cols-2">

                {/* =================================================
                    LEFT IMAGE SECTION
                ================================================= */}

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

                {/* =================================================
                    RIGHT LOGIN SECTION
                ================================================= */}

                <section className="flex min-h-[calc(100vh-4px)] items-center justify-center bg-white px-5 py-10 sm:px-8">

                    <div className="w-full max-w-[390px]">

                        {/* LOGIN CARD */}

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

                            {/* FORM */}

                            <form
                                onSubmit={handleSubmit}
                                className="mt-7 space-y-4"
                            >

                                {/* =================================================
                                    USERNAME / EMAIL
                                ================================================= */}

                                <div>

                                    <label
                                        htmlFor="admin-username"
                                        className="mb-1.5 block text-[10px] font-bold text-blue-950"
                                    >
                                        Username / Email
                                    </label>

                                    <div className="relative">

                                        <UserRound
                                            className="absolute left-3 top-1/2 h-[16px] w-[16px] -translate-y-1/2 text-slate-400"
                                        />

                                        <input
                                            id="admin-username"
                                            type="text"
                                            value={username}
                                            onChange={(event) => {
                                                setUsername(
                                                    event.target.value
                                                );
                                                setError("");
                                            }}
                                            placeholder="Enter username or email"
                                            autoComplete="username"
                                            disabled={loading}
                                            className="h-10 w-full rounded-md border border-slate-300 bg-white pl-9 pr-3 text-[11px] text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-green-700 focus:ring-2 focus:ring-green-100 disabled:cursor-not-allowed disabled:bg-slate-50"
                                        />

                                    </div>

                                </div>

                                {/* =================================================
                                    PASSWORD
                                ================================================= */}

                                <div>

                                    <label
                                        htmlFor="admin-password"
                                        className="mb-1.5 block text-[10px] font-bold text-blue-950"
                                    >
                                        Password
                                    </label>

                                    <div className="relative">

                                        <LockKeyhole
                                            className="absolute left-3 top-1/2 h-[16px] w-[16px] -translate-y-1/2 text-slate-400"
                                        />

                                        <input
                                            id="admin-password"
                                            type={
                                                showPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            value={password}
                                            onChange={(event) => {
                                                setPassword(
                                                    event.target.value
                                                );
                                                setError("");
                                            }}
                                            placeholder="Enter password"
                                            autoComplete="current-password"
                                            disabled={loading}
                                            className="h-10 w-full rounded-md border border-slate-300 bg-white pl-9 pr-10 text-[11px] text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-green-700 focus:ring-2 focus:ring-green-100 disabled:cursor-not-allowed disabled:bg-slate-50"
                                        />

                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowPassword(
                                                    (value) => !value
                                                )
                                            }
                                            disabled={loading}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-700 disabled:cursor-not-allowed"
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

                                {/* =================================================
                                    REMEMBER / FORGOT
                                ================================================= */}

                                <div className="flex items-center justify-between pt-0.5">

                                    <label className="flex cursor-pointer items-center gap-2 text-[10px] font-medium text-slate-600">

                                        <input
                                            type="checkbox"
                                            checked={rememberMe}
                                            onChange={(event) =>
                                                setRememberMe(
                                                    event.target.checked
                                                )
                                            }
                                            disabled={loading}
                                            className="h-3.5 w-3.5 rounded border-slate-300 accent-green-700"
                                        />

                                        Remember Me

                                    </label>

                                    <button
                                        type="button"
                                        onClick={() => {
                                            setError(
                                                "Please contact the system administrator to reset your password."
                                            );
                                        }}
                                        className="text-[10px] font-bold text-blue-700 transition hover:text-blue-900"
                                    >
                                        Forgot Password?
                                    </button>

                                </div>

                                {/* =================================================
                                    ERROR
                                ================================================= */}

                                {error && (
                                    <div className="rounded-md border border-red-100 bg-red-50 px-3 py-2 text-[10px] font-medium leading-4 text-red-600">
                                        {error}
                                    </div>
                                )}

                                {/* =================================================
                                    LOGIN BUTTON
                                ================================================= */}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="mt-1 h-10 w-full rounded-md bg-green-700 text-xs font-bold text-white shadow-sm transition hover:bg-green-800 active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-slate-400"
                                >
                                    {loading
                                        ? "Logging in..."
                                        : "Login"}
                                </button>

                                {/* =================================================
                                    REGISTER
                                ================================================= */}

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

                        {/* =================================================
                            BACK LINK
                        ================================================= */}

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

            {/* =================================================
                MOBILE WELCOME
            ================================================= */}

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

                    <ShieldCheck
                        className="h-5 w-5 text-green-700"
                    />

                    <span className="h-px w-12 bg-green-700" />

                </div>

            </section>

        </div>
    );
}

export default AdminLogin;