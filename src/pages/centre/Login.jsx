import { useState } from "react";
import { supabase } from "../../lib/supabase";
import { Link, useNavigate } from "react-router-dom";
import {
    Eye,
    EyeOff,
    Leaf,
    LockKeyhole,
    UserRound,
} from "lucide-react";

import centreLoginBg from "../../assets/images/procurement-centre-bg.png";

function Login() {
    const navigate = useNavigate();

    const [mobile, setMobile] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!mobile || !password) {
        setError("Please enter email and password.");
        return;
    }

    setError("");
    setLoading(true);

    try {
        // 1. Login through Supabase Auth
        const { data, error: loginError } =
            await supabase.auth.signInWithPassword({
                email: mobile,
                password: password,
            });

        if (loginError) {
            console.error("Centre login error:", loginError);
            setError(loginError.message);
            setLoading(false);
            return;
        }

        const user = data.user;

        console.log("Centre staff Auth user:", user);

        // 2. Get user's profile
        const { data: profile, error: profileError } =
            await supabase
                .from("profiles")
                .select("*")
                .eq("id", user.id)
                .single();

        if (profileError) {
            console.error(
                "Centre staff profile error:",
                profileError
            );

            await supabase.auth.signOut();

            setError("Unable to load your profile.");
            setLoading(false);
            return;
        }

        console.log("Centre staff profile:", profile);

        // 3. Check role
        if (profile.role !== "centre_staff") {
            await supabase.auth.signOut();

            setError(
                "This account is not registered as centre staff."
            );

            setLoading(false);
            return;
        }

        // 4. Check centre assignment
        const { data: staffAssignment, error: assignmentError } =
            await supabase
                .from("centre_staff")
                .select("*")
                .eq("user_id", user.id)
                .single();

        if (assignmentError) {
            console.error(
                "Centre assignment error:",
                assignmentError
            );

            await supabase.auth.signOut();

            setError(
                "No procurement centre is assigned to this account."
            );

            setLoading(false);
            return;
        }

        console.log(
            "Centre staff assignment:",
            staffAssignment
        );

        // 5. Login successful
        setError("");

        console.log("Centre staff login successful!");

        navigate("/centre/dashboard");
    } catch (error) {
        console.error("Unexpected centre login error:", error);

        setError("Something went wrong. Please try again.");
    } finally {
        setLoading(false);
    }
};
    
    return (
        <div className="min-h-screen overflow-hidden ">
            {/* Background */}
            <div className="relative min-h-[calc(100vh-2px)]">
                <img
                    src={centreLoginBg}
                    alt="Procurement Centre"
                    className="absolute inset-0 h-full w-full object-cover"
                />

                {/* Login Content */}
                <div className="relative z-10 flex min-h-[calc(100vh-2px)] items-center justify-center px-5 py-8 lg:justify-end lg:px-[4.5%] xl:px-[7%]">
                    {/* Welcome Text */}
                    <div className="absolute left-[10%] top-1/3 hidden max-w-[330px] -translate-y-1/2 lg:block xl:left-[10%]">
                        <h1 className="text-3xl font-extrabold leading-tight text-blue-950 xl:text-[36px]">
                            Welcome Centre Officer!
                        </h1>

                        <p className="mt-4 max-w-[285px] text-base font-medium leading-7 text-blue-950">
                            Login to manage procurement,
                            <br />
                            queue, and farmer operations
                            <br />
                            efficiently.
                        </p>

                        {/* Decorative Line */}
                        <div className="mt-6 flex items-center gap-3">
                            <span className="h-[2px] w-[70px] bg-green-600" />

                            <Leaf
                                className="h-5 w-5 text-green-700"
                                strokeWidth={2.2}
                            />

                            <span className="h-[2px] w-[70px] bg-green-600" />
                        </div>
                    </div>

                    {/* Login Card */}
                    <div className="w-full max-w-[400px] rounded-2xl bg-white px-7 py-8 shadow-[0_8px_30px_rgba(15,23,42,0.12)] sm:px-9 sm:py-9 lg:mr-[1%]">
                        {/* Heading */}
                        <div className="text-center">
                            <h2 className="text-[23px] font-extrabold text-blue-950 sm:text-[25px]">
                                Centre Officer Login
                            </h2>

                            <p className="mt-1.5 text-xs font-medium text-slate-600 sm:text-sm">
                                Login to access your centre dashboard
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="mt-7 space-y-4">
                            {/* Mobile Number */}
                            <div className="relative">
                                <UserRound className="absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-500" />

                               <input
    type="email"
    value={mobile}
    onChange={(event) => setMobile(event.target.value)}
    placeholder="Email"
                                    className="h-12 w-full rounded-lg border border-slate-300 bg-white pl-11 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-500 focus:border-green-600 focus:ring-2 focus:ring-green-100"
                                />
                            </div>

                            {/* Password */}
                            <div className="relative">
                                <LockKeyhole className="absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-500" />

                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(event) => setPassword(event.target.value)}
                                    placeholder="Password"
                                    className="h-12 w-full rounded-lg border border-slate-300 bg-white pl-11 pr-11 text-sm text-slate-700 outline-none transition placeholder:text-slate-500 focus:border-green-600 focus:ring-2 focus:ring-green-100"
                                />

                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-slate-700"
                                    aria-label="Toggle password visibility"
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-[18px] w-[18px]" />
                                    ) : (
                                        <Eye className="h-[18px] w-[18px]" />
                                    )}
                                </button>
                            </div>

                            {/* Remember + Forgot */}
                            <div className="flex items-center justify-between pt-1">
                                <label className="flex cursor-pointer items-center gap-2 text-xs font-medium text-slate-700">
                                    <input
                                        type="checkbox"
                                        checked={rememberMe}
                                        onChange={(event) =>
                                            setRememberMe(event.target.checked)
                                        }
                                        className="h-4 w-4 rounded border-slate-300 accent-green-700"
                                    />

                                    Remember Me
                                </label>

                                <button
                                    type="button"
                                    className="text-xs font-bold text-blue-700 hover:text-blue-800"
                                >
                                    Forgot Password?
                                </button>
                            </div>

                            {/* Error */}
                            {error && (
                                <div className="rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-600">
                                    {error}
                                </div>
                            )}

                            {/* Login Button */}
                            <button
    type="submit"
    disabled={loading}
    className="mt-2 h-12 w-full rounded-lg bg-green-700 text-base font-bold text-white shadow-sm transition hover:bg-green-800 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
>
    {loading ? "Logging in..." : "Login"}
</button>
                        </form>

                        {/* Contact Admin */}
                        <div className="mt-7 text-center">
                            <p className="text-xs font-medium text-slate-700 sm:text-sm">
                                Don't have an account?{" "}
                                <Link
                                    to="/centre/register"
                                    className="font-bold text-blue-700 hover:text-blue-800"
                                >
                                    Register Here
                                </Link>
                            </p>
                        </div>
                    </div>

                    {/* Mobile Welcome */}
                    <div className="absolute bottom-5 left-5 right-5 rounded-xl bg-white/90 p-4 text-center shadow-sm backdrop-blur-sm lg:hidden">
                        <h1 className="text-xl font-extrabold text-blue-950">
                            Welcome Centre Officer!
                        </h1>

                        <p className="mt-1 text-xs leading-5 text-blue-950">
                            Login to manage procurement, queue, and farmer operations
                            efficiently.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;