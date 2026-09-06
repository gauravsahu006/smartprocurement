import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    Building2,
    Eye,
    EyeOff,
    LockKeyhole,
    Mail,
    MapPin,
    Phone,
    UserRound,
} from "lucide-react";

function Register() {
    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        centreName: "",
        officerName: "",
        mobile: "",
        email: "",
        address: "",
        district: "",
        password: "",
        confirmPassword: "",
    });

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        if (
            !formData.centreName ||
            !formData.officerName ||
            !formData.mobile ||
            !formData.email ||
            !formData.address ||
            !formData.district ||
            !formData.password ||
            !formData.confirmPassword
        ) {
            setError("Please fill all the required fields.");
            return;
        }

        if (!/^\d{10}$/.test(formData.mobile)) {
            setError("Please enter a valid 10-digit mobile number.");
            return;
        }

        if (formData.password.length < 6) {
            setError("Password must be at least 6 characters.");
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        const existingCentre = JSON.parse(
            localStorage.getItem("centreOfficer")
        );

        if (existingCentre?.mobile === formData.mobile) {
            setError("This mobile number is already registered.");
            return;
        }

        const centreOfficer = {
            centreName: formData.centreName,
            officerName: formData.officerName,
            mobile: formData.mobile,
            email: formData.email,
            address: formData.address,
            district: formData.district,
            password: formData.password,
        };

        localStorage.setItem(
            "centreOfficer",
            JSON.stringify(centreOfficer)
        );

        setError("");

        navigate("/centre/login");
    };

    return (
        <div className="min-h-screen bg-slate-50 border-t-2 border-green-700">
            <div className="mx-auto flex min-h-[calc(100vh-2px)] max-w-6xl items-center justify-center px-4 py-8 sm:px-6">
                <div className="grid w-full overflow-hidden rounded-2xl bg-white shadow-lg lg:grid-cols-[0.85fr_1.15fr]">

                    {/* Welcome Section */}
                    <div className="hidden bg-green-50 p-8 lg:flex lg:flex-col lg:justify-center xl:p-12">
                        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-green-700 text-white">
                            <Building2 className="h-7 w-7" />
                        </div>

                        <h1 className="mt-6 text-3xl font-extrabold leading-tight text-blue-950">
                            Register Your
                            <br />
                            Procurement Centre
                        </h1>

                        <p className="mt-4 max-w-sm text-sm leading-6 text-slate-600">
                            Create your Centre Officer account to manage farmer bookings,
                            queues, procurement operations and payments efficiently.
                        </p>

                        <div className="mt-8 space-y-4">
                            <Feature text="Manage farmer bookings" />
                            <Feature text="Monitor live queue" />
                            <Feature text="Track procurement and payments" />
                        </div>
                    </div>

                    {/* Registration Form */}
                    <div className="p-6 sm:p-8 lg:p-10">
                        <div>
                            <h2 className="text-2xl font-extrabold text-blue-950">
                                Centre Officer Registration
                            </h2>

                            <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                                Register your procurement centre to get started
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="mt-6 space-y-4">

                            {/* Centre Details */}
                            <div className="grid gap-4 sm:grid-cols-2">
                                <InputField
                                    icon={Building2}
                                    name="centreName"
                                    placeholder="Centre Name"
                                    value={formData.centreName}
                                    onChange={handleChange}
                                />

                                <InputField
                                    icon={UserRound}
                                    name="officerName"
                                    placeholder="Officer Name"
                                    value={formData.officerName}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <InputField
                                    icon={Phone}
                                    name="mobile"
                                    placeholder="Mobile Number"
                                    type="tel"
                                    value={formData.mobile}
                                    onChange={handleChange}
                                />

                                <InputField
                                    icon={Mail}
                                    name="email"
                                    placeholder="Email Address"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </div>

                            {/* Location */}
                            <InputField
                                icon={MapPin}
                                name="address"
                                placeholder="Centre Address"
                                value={formData.address}
                                onChange={handleChange}
                            />

                            <InputField
                                icon={MapPin}
                                name="district"
                                placeholder="District"
                                value={formData.district}
                                onChange={handleChange}
                            />

                            {/* Password */}
                            <PasswordField
                                name="password"
                                placeholder="Password"
                                value={formData.password}
                                showPassword={showPassword}
                                setShowPassword={setShowPassword}
                                onChange={handleChange}
                            />

                            <PasswordField
                                name="confirmPassword"
                                placeholder="Confirm Password"
                                value={formData.confirmPassword}
                                showPassword={showConfirmPassword}
                                setShowPassword={setShowConfirmPassword}
                                onChange={handleChange}
                            />

                            {error && (
                                <div className="rounded-lg bg-red-50 px-3 py-2.5 text-xs font-medium text-red-600">
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                className="h-12 w-full rounded-lg bg-green-700 text-sm font-bold text-white transition hover:bg-green-800 active:scale-[0.99]"
                            >
                                Register Centre
                            </button>
                        </form>

                        <p className="mt-6 text-center text-xs text-slate-600 sm:text-sm">
                            Already have an account?{" "}
                            <Link
                                to="/centre/login"
                                className="font-bold text-blue-700 hover:text-blue-800"
                            >
                                Login Here
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

function InputField({
    icon: Icon,
    name,
    placeholder,
    type = "text",
    value,
    onChange,
}) {
    return (
        <div className="relative">
            <Icon className="absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-500" />

            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="h-12 w-full rounded-lg border border-slate-300 bg-white pl-11 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-500 focus:border-green-600 focus:ring-2 focus:ring-green-100"
            />
        </div>
    );
}

function PasswordField({
    name,
    placeholder,
    value,
    showPassword,
    setShowPassword,
    onChange,
}) {
    return (
        <div className="relative">
            <LockKeyhole className="absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-500" />

            <input
                type={showPassword ? "text" : "password"}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="h-12 w-full rounded-lg border border-slate-300 bg-white pl-11 pr-11 text-sm text-slate-700 outline-none transition placeholder:text-slate-500 focus:border-green-600 focus:ring-2 focus:ring-green-100"
            />

            <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
                aria-label="Toggle password visibility"
            >
                {showPassword ? (
                    <EyeOff className="h-[18px] w-[18px]" />
                ) : (
                    <Eye className="h-[18px] w-[18px]" />
                )}
            </button>
        </div>
    );
}

function Feature({ text }) {
    return (
        <div className="flex items-center gap-3">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-700 text-xs font-bold text-white">
                ✓
            </div>

            <span className="text-sm font-medium text-slate-700">
                {text}
            </span>
        </div>
    );
}

export default Register;