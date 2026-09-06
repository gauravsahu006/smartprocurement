import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Building2,
  LockKeyhole,
  ShieldCheck,
  UserRound,
} from "lucide-react";

function Login() {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState("");

  const roles = [
    {
      id: "farmer",
      title: "Farmer",
      description: "Book slots, track queue and payments",
      icon: UserRound,
      color: "green",
      path: "/login",
    },
    {
      id: "centre",
      title: "Centre Officer",
      description: "Manage bookings, queue and procurement",
      icon: Building2,
      color: "blue",
      path: "/centre/login",
    },
    {
      id: "admin",
      title: "Admin",
      description: "Monitor the complete procurement system",
      icon: ShieldCheck,
      color: "purple",
      path: "/admin/login",
    },
  ];

  const handleContinue = () => {
    if (!selectedRole) {
      return;
    }

    localStorage.setItem("selectedRole", selectedRole);

    const role = roles.find((item) => item.id === selectedRole);

    if (role?.path && role.path !== "/login") {
      navigate(role.path);
      return;
    }

    navigate("/farmer-login");
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-5 py-10">
        <div className="w-full max-w-xl">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-9">
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-green-700">
                <LockKeyhole className="h-6 w-6" />
              </div>

              <h1 className="mt-5 text-2xl font-extrabold text-blue-950 sm:text-3xl">
                Welcome Back
              </h1>

              <p className="mt-2 text-sm text-slate-500">
                Select your role to continue
              </p>
            </div>

            <div className="mt-8 space-y-3">
              {roles.map((role) => {
                const Icon = role.icon;
                const isSelected = selectedRole === role.id;

                return (
                  <button
                    key={role.id}
                    type="button"
                    onClick={() => setSelectedRole(role.id)}
                    className={`flex w-full items-center gap-4 rounded-xl border p-4 text-left transition ${
                      isSelected
                        ? "border-green-600 bg-green-50 ring-2 ring-green-100"
                        : "border-slate-200 bg-white hover:border-green-300 hover:bg-slate-50"
                    }`}
                  >
                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                        role.color === "green"
                          ? "bg-green-100 text-green-700"
                          : role.color === "blue"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-purple-100 text-purple-700"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <h2 className="text-sm font-extrabold text-blue-950">
                        {role.title}
                      </h2>

                      <p className="mt-1 text-xs text-slate-500">
                        {role.description}
                      </p>
                    </div>

                    <div
                      className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                        isSelected
                          ? "border-green-600 bg-green-600"
                          : "border-slate-300"
                      }`}
                    >
                      {isSelected && (
                        <span className="h-2 w-2 rounded-full bg-white" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={handleContinue}
              disabled={!selectedRole}
              className="mt-7 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-green-700 text-sm font-bold text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              Continue
              <ArrowRight className="h-4 w-4" />
            </button>

            <div className="mt-6 text-center">
              <Link
                to="/"
                className="text-xs font-semibold text-slate-500 hover:text-blue-950"
              >
                ← Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;