import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  PackageCheck,
  CreditCard,
  UserRound,
  LogOut,
  Bell,
} from "lucide-react";
import { useEffect, useState } from "react";

import { supabase } from "../lib/supabase";

function CentreLayout({ children }) {
  const navigate = useNavigate();

  const [staffName, setStaffName] = useState("Centre Officer");
  const [centreName, setCentreName] = useState("Procurement Centre");
  const [loading, setLoading] = useState(true);

  const menuItems = [
    {
      label: "Dashboard",
      path: "/centre/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "Bookings",
      path: "/centre/bookings",
      icon: CalendarDays,
    },
    {
      label: "Queue Management",
      path: "/centre/queue",
      icon: Users,
    },
    {
      label: "Procurement",
      path: "/centre/procurement",
      icon: PackageCheck,
    },
    {
      label: "Payments",
      path: "/centre/payments",
      icon: CreditCard,
    },
    {
      label: "Profile",
      path: "/centre/profile",
      icon: UserRound,
    },
  ];

  // -----------------------------------------
  // Load Centre Staff Profile
  // -----------------------------------------
  useEffect(() => {
    const loadStaffProfile = async () => {
      try {
        setLoading(true);

        // Current logged-in user
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();

        if (authError) {
          console.error("Auth error:", authError);
          return;
        }

        if (!user) {
          navigate("/centre/login");
          return;
        }

        // Get staff profile
        const { data: profile, error: profileError } =
          await supabase
            .from("profiles")
            .select("full_name, role")
            .eq("id", user.id)
            .single();

        if (profileError) {
          console.error("Profile error:", profileError);
          return;
        }

        // Security check
        if (profile?.role !== "centre_staff") {
          console.error("This account is not Centre Staff.");
          await supabase.auth.signOut();
          navigate("/centre/login");
          return;
        }

        setStaffName(profile.full_name || "Centre Officer");

        // ---------------------------------------
        // Get assigned centre
        // ---------------------------------------
        const { data: staffAssignment, error: staffError } =
          await supabase
            .from("centre_staff")
            .select("*")
            .eq("user_id", user.id)
            .maybeSingle();

        if (staffError) {
          console.error("Centre assignment error:", staffError);
          return;
        }

        if (staffAssignment?.centre_id) {
          const { data: centre, error: centreError } =
            await supabase
              .from("centres")
              .select("*")
              .eq("id", staffAssignment.centre_id)
              .single();

          if (centreError) {
            console.error("Centre error:", centreError);
            return;
          }

          setCentreName(
            centre?.name || "Procurement Centre"
          );
        }
      } catch (error) {
        console.error(
          "Failed to load centre staff profile:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    loadStaffProfile();
  }, [navigate]);

  // -----------------------------------------
  // Generate Initials
  // -----------------------------------------
  const getInitials = (name) => {
    if (!name || name === "Centre Officer") {
      return "CO";
    }

    return name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  };

  // -----------------------------------------
  // Logout
  // -----------------------------------------
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();

      navigate("/centre/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const displayStaffName = loading
    ? "..."
    : staffName;

  const displayCentreName = loading
    ? "..."
    : centreName;

  const initials = loading
    ? "..."
    : getInitials(staffName);

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Header */}
      <header className="fixed left-0 right-0 top-0 z-50 h-16 border-b border-slate-200 bg-white">
        <div className="flex h-full items-center justify-between px-4 sm:px-6">

          {/* Logo / Title */}
          <div>
            <h1 className="text-sm font-extrabold text-blue-950 sm:text-base">
              Smart Procurement
            </h1>

            <p className="text-[9px] text-slate-500 sm:text-[10px]">
              Centre Officer Panel
            </p>
          </div>

          {/* Right */}
          <div className="flex items-center gap-4">

            {/* Notification */}
            <button
              type="button"
              className="relative text-slate-600 hover:text-blue-950"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />

              <span className="absolute -right-1 -top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-green-600 text-[7px] font-bold text-white">
                3
              </span>
            </button>

            {/* Staff Information */}
            <div className="hidden text-right sm:block">
              <p className="text-xs font-bold text-blue-950">
                {displayStaffName}
              </p>

              <p className="text-[9px] text-slate-500">
                {displayCentreName}
              </p>
            </div>

            {/* Dynamic Initials */}
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-100 text-sm font-bold text-green-700">
              {initials}
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <aside className="fixed bottom-0 left-0 top-16 z-40 hidden w-60 border-r border-slate-200 bg-white lg:block">
        <div className="flex h-full flex-col p-4">

          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-lg px-3 py-2.5 text-xs font-semibold transition ${
                      isActive
                        ? "bg-green-50 text-green-700"
                        : "text-slate-600 hover:bg-slate-50 hover:text-blue-950"
                    }`
                  }
                >
                  <Icon className="h-4 w-4" />

                  {item.label}
                </NavLink>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="mt-auto border-t border-slate-100 pt-3">
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-xs font-semibold text-red-600 transition hover:bg-red-50"
            >
              <LogOut className="h-4 w-4" />

              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200 bg-white lg:hidden">
        <div className="grid grid-cols-4">
          {menuItems.slice(0, 4).map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex flex-col items-center gap-1 px-2 py-2 text-[8px] font-semibold ${
                    isActive
                      ? "text-green-700"
                      : "text-slate-500"
                  }`
                }
              >
                <Icon className="h-4 w-4" />

                {item.label}
              </NavLink>
            );
          })}
        </div>
      </nav>

      {/* Page Content */}
      <main className="min-h-screen pt-16 lg:ml-60">
        <div className="pb-20 lg:pb-0">
          {children}
        </div>
      </main>
    </div>
  );
}

export default CentreLayout;