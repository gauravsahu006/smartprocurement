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

function CentreLayout({ children }) {
  const navigate = useNavigate();

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

  const handleLogout = () => {
    navigate("/centre/login");
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="fixed left-0 right-0 top-0 z-50 h-16 border-b border-slate-200 bg-white">
        <div className="flex h-full items-center justify-between px-4 sm:px-6">
          <div>
            <h1 className="text-sm font-extrabold text-blue-950 sm:text-base">
              Smart Procurement
            </h1>

            <p className="text-[9px] text-slate-500 sm:text-[10px]">
              Centre Officer Panel
            </p>
          </div>

          <div className="flex items-center gap-4">
            <button className="relative text-slate-600 hover:text-blue-950">
              <Bell className="h-5 w-5" />

              <span className="absolute -right-1 -top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-green-600 text-[7px] font-bold text-white">
                3
              </span>
            </button>

            <div className="hidden text-right sm:block">
              <p className="text-xs font-bold text-blue-950">
                Centre Officer
              </p>

              <p className="text-[9px] text-slate-500">
                ABC Procurement Centre
              </p>
            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-100 text-sm font-bold text-green-700">
              CO
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

          <div className="mt-auto border-t border-slate-100 pt-3">
            <button
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
                    isActive ? "text-green-700" : "text-slate-500"
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
        <div className="pb-20 lg:pb-0">{children}</div>
      </main>
    </div>
  );
}

export default CentreLayout;