import { NavLink, useNavigate } from "react-router-dom";
import {
  Bell,
  Building2,
  CalendarDays,
  ClipboardList,
  CreditCard,
  FileText,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  ShieldCheck,
  Users,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";

import { supabase } from "../lib/supabase";

const menuItems = [
  {
    label: "Dashboard",
    path: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Farmers",
    path: "/admin/farmers",
    icon: Users,
  },
  {
    label: "Procurement Centres",
    path: "/admin/centres",
    icon: Building2,
  },
  {
    label: "Bookings",
    path: "/admin/bookings",
    icon: CalendarDays,
  },
  {
    label: "Procurement",
    path: "/admin/procurement",
    icon: ClipboardList,
  },
  {
    label: "Payments",
    path: "/admin/payments",
    icon: CreditCard,
  },
  {
    label: "Admin Profile",
    path: "/admin/profile",
    icon: Settings,
  },
];

function AdminLayout({ children }) {
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [adminName, setAdminName] = useState("Admin");
  const [loadingAdmin, setLoadingAdmin] = useState(true);

  // -----------------------------------------
  // Load logged-in admin
  // -----------------------------------------
  useEffect(() => {
    const loadAdminProfile = async () => {
      try {
        setLoadingAdmin(true);

        // Get logged-in Supabase user
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();

        if (authError) {
          console.error("Auth error:", authError);
          return;
        }

        if (!user) {
          navigate("/admin/login");
          return;
        }

        // Get admin profile
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
        if (profile?.role !== "admin") {
          console.error("This account is not an admin.");
          await supabase.auth.signOut();
          navigate("/admin/login");
          return;
        }

        setAdminName(profile.full_name || "Admin");
      } catch (error) {
        console.error("Failed to load admin:", error);
      } finally {
        setLoadingAdmin(false);
      }
    };

    loadAdminProfile();
  }, [navigate]);

  // -----------------------------------------
  // Generate initials
  // -----------------------------------------
  const getInitials = (name) => {
    if (!name || name === "Admin") {
      return "A";
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

      setMobileMenuOpen(false);
      navigate("/admin/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const displayName = loadingAdmin ? "..." : adminName;
  const initials = loadingAdmin ? "..." : getInitials(adminName);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* Header */}
      <header className="fixed left-0 right-0 top-0 z-50 h-16 border-b border-slate-200 bg-white">
        <div className="flex h-full items-center justify-between px-4 sm:px-6 lg:px-7">

          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-700 text-white">
              <ShieldCheck className="h-5 w-5" />
            </div>

            <div className="hidden sm:block">
              <p className="text-sm font-extrabold leading-tight text-blue-950">
                Smart Procurement
              </p>

              <p className="text-[10px] font-medium text-slate-500">
                Admin Portal
              </p>
            </div>
          </div>

          {/* Right */}
          <div className="flex items-center gap-3">

            {/* Notifications */}
            <button
              type="button"
              className="relative flex h-9 w-9 items-center justify-center rounded-lg text-slate-600 transition hover:bg-slate-100"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />

              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
            </button>

            <div className="hidden h-8 w-px bg-slate-200 sm:block" />

            {/* Dynamic Admin */}
            <div className="hidden items-center gap-2 sm:flex">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-100 text-sm font-extrabold text-green-700">
                {initials}
              </div>

              <div>
                <p className="text-xs font-bold text-blue-950">
                  {displayName}
                </p>

                <p className="text-[10px] text-slate-500">
                  Administrator
                </p>
              </div>
            </div>

            {/* Mobile menu button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-700 hover:bg-slate-100 lg:hidden"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Desktop Sidebar */}
      <aside className="fixed bottom-0 left-0 top-16 z-40 hidden w-64 border-r border-slate-200 bg-white lg:block">
        <div className="flex h-full flex-col">

          {/* Navigation */}
          <nav className="flex-1 space-y-1 overflow-y-auto p-4">
            <p className="mb-3 px-3 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
              Main Menu
            </p>

            {menuItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition ${
                      isActive
                        ? "bg-green-50 text-green-700"
                        : "text-slate-600 hover:bg-slate-50 hover:text-blue-950"
                    }`
                  }
                >
                  <Icon className="h-[18px] w-[18px] shrink-0" />

                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>

          {/* Bottom */}
          <div className="border-t border-slate-100 p-4">

            <div className="mb-3 rounded-lg bg-green-50 p-3">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-green-700" />

                <p className="text-[11px] font-bold text-green-800">
                  Admin Access
                </p>
              </div>

              <p className="mt-1 text-[10px] leading-4 text-green-700">
                You have full system management access.
              </p>
            </div>

            {/* Logout */}
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50"
            >
              <LogOut className="h-[18px] w-[18px]" />

              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">

          <button
            type="button"
            onClick={() => setMobileMenuOpen(false)}
            className="absolute inset-0 bg-slate-950/30"
            aria-label="Close menu"
          />

          <aside className="relative flex h-full w-[280px] flex-col bg-white shadow-xl">

            {/* Mobile Header */}
            <div className="flex h-16 items-center justify-between border-b border-slate-200 px-5">
              <div>
                <p className="text-sm font-extrabold text-blue-950">
                  Smart Procurement
                </p>

                <p className="text-[10px] text-slate-500">
                  Admin Portal
                </p>
              </div>

              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Mobile Navigation */}
            <nav className="flex-1 space-y-1 overflow-y-auto p-4">
              <p className="mb-3 px-3 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                Main Menu
              </p>

              {menuItems.map((item) => {
                const Icon = item.icon;

                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-semibold transition ${
                        isActive
                          ? "bg-green-50 text-green-700"
                          : "text-slate-600 hover:bg-slate-50"
                      }`
                    }
                  >
                    <Icon className="h-[18px] w-[18px]" />

                    {item.label}
                  </NavLink>
                );
              })}
            </nav>

            {/* Mobile Logout */}
            <div className="border-t border-slate-100 p-4">
              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm font-semibold text-red-600 hover:bg-red-50"
              >
                <LogOut className="h-[18px] w-[18px]" />

                Logout
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Main Content */}
      <main className="min-h-screen pt-16 lg:pl-64">
        <div className="px-4 py-5 sm:px-6 lg:px-7 lg:py-6">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200 bg-white lg:hidden">
        <div className="grid grid-cols-4">
          {menuItems.slice(0, 4).map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex flex-col items-center gap-1 px-2 py-2.5 text-[9px] font-bold ${
                    isActive
                      ? "text-green-700"
                      : "text-slate-500"
                  }`
                }
              >
                <Icon className="h-[18px] w-[18px]" />

                {item.label}
              </NavLink>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

export default AdminLayout;