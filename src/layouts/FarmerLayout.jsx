import { NavLink, Link } from "react-router-dom";
import {
  Bell,
  CalendarDays,
  ChartNoAxesCombined,
  ClipboardList,
  CreditCard,
  LayoutDashboard,
  Leaf,
  LogOut,
  MapPin,
  UserRound,
  UsersRound,
} from "lucide-react";

const menuItems = [
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Find Centres",
    path: "/centres",
    icon: MapPin,
  },
  {
    name: "My Bookings",
    path: "/bookings",
    icon: CalendarDays,
  },
  {
    name: "Live Queue",
    path: "/queue",
    icon: UsersRound,
  },
  {
    name: "Procurement Status",
    path: "/procurement",
    icon: ClipboardList,
  },
  {
    name: "Payment Status",
    path: "/payment",
    icon: CreditCard,
  },
  {
    name: "Profile",
    path: "/profile",
    icon: UserRound,
  },
];

function FarmerLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#f8faf9] text-slate-800">
      {/* Header */}
      <header className="fixed left-0 right-0 top-0 z-50 h-[60px] border-b border-slate-200 bg-white">
        <div className="flex h-full items-center justify-between px-4 lg:px-5">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-50">
              <Leaf className="h-6 w-6 text-green-700" />
            </div>

            <div className="leading-tight">
              <p className="text-sm font-extrabold text-green-800">
                Smart Procurement
              </p>

              <p className="text-[9px] font-bold text-blue-900">
                & Queue Management System
              </p>
            </div>
          </Link>

          {/* Right */}
          <div className="flex items-center gap-4">
            <button className="relative flex h-9 w-9 items-center justify-center rounded-full hover:bg-slate-50">
              <Bell className="h-[18px] w-[18px] text-slate-600" />

              <span className="absolute right-1 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[8px] font-bold text-white">
                3
              </span>
            </button>

            <div className="hidden h-7 w-px bg-slate-200 sm:block" />

            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-[10px] font-extrabold text-green-800">
                RK
              </div>

              <div className="hidden leading-tight sm:block">
                <p className="text-[11px] font-bold text-slate-800">
                  Rajesh Kumar
                </p>

                <p className="text-[9px] text-slate-500">
                  Farmer
                </p>
              </div>

              <span className="hidden text-xs text-slate-500 sm:block">
                ▼
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <aside className="fixed bottom-0 left-0 top-[60px] z-40 hidden w-[118px] border-r border-slate-200 bg-white lg:block">
        <nav className="flex h-full flex-col px-2 py-3">
          <div className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex min-h-[35px] flex-col items-center justify-center gap-1 rounded-md px-1 text-center transition ${
                      isActive
                        ? "bg-green-700 text-white"
                        : "text-slate-600 hover:bg-green-50 hover:text-green-700"
                    }`
                  }
                >
                  <Icon className="h-[15px] w-[15px]" />

                  <span className="text-[8px] font-semibold leading-tight">
                    {item.name}
                  </span>
                </NavLink>
              );
            })}
          </div>

          <div className="mt-auto">
            <Link
              to="/login"
              className="flex min-h-[35px] flex-col items-center justify-center gap-1 rounded-md px-1 text-slate-600 hover:bg-red-50 hover:text-red-600"
            >
              <LogOut className="h-[15px] w-[15px]" />

              <span className="text-[8px] font-semibold">
                Logout
              </span>
            </Link>
          </div>
        </nav>
      </aside>

      {/* Mobile Nav */}
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200 bg-white lg:hidden">
        <nav className="flex items-center justify-around px-1 py-2">
          {menuItems.slice(0, 5).map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `flex min-w-0 flex-1 flex-col items-center gap-1 ${
                    isActive ? "text-green-700" : "text-slate-500"
                  }`
                }
              >
                <Icon className="h-4 w-4" />

                <span className="truncate text-[8px] font-semibold">
                  {item.name}
                </span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Page */}
      <main className="pt-[60px] lg:ml-[118px]">
        {children}
      </main>
    </div>
  );
}

export default FarmerLayout;