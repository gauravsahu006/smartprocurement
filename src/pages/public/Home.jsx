import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Leaf,
  LocateFixed,
  Menu,
  Search,
  ShieldCheck,
  Ticket,
  Users,
  WalletCards,
  X,
} from "lucide-react";

import farmerCentre from "../../assets/images/farmer-centre.png";

const steps = [
  {
    number: "1",
    title: "Find Centre",
    description: "Search and compare nearby procurement centres.",
    icon: LocateFixed,
  },
  {
    number: "2",
    title: "Book Slot",
    description: "Choose the best centre and book your preferred time slot.",
    icon: CalendarDays,
  },
  {
    number: "3",
    title: "Get Token",
    description: "Receive your digital token and visit the centre.",
    icon: Ticket,
  },
  {
    number: "4",
    title: "Track Payment",
    description: "Track procurement status and payment in real-time.",
    icon: WalletCards,
  },
];

const stats = [
  {
    value: "1000+",
    label: "Farmers Connected",
    icon: Users,
  },
  {
    value: "120+",
    label: "Procurement Centres",
    icon: LocateFixed,
  },
  {
    value: "35 min",
    label: "Average Waiting Time Saved",
    icon: Clock3,
  },
  {
    value: "5000+",
    label: "Bookings Completed",
    icon: Leaf,
  },
];

function Home() {
  const [mobileMenu, setMobileMenu] = useState(false);

  return (
    <div className="min-h-screen bg-white text-slate-800">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-[72px] max-w-[1440px] items-center justify-between px-5 sm:px-8 lg:px-10">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-green-50">
              <Leaf className="h-7 w-7 text-green-700" strokeWidth={2.2} />
            </div>

            <div className="leading-tight">
              <h1 className="text-[18px] font-extrabold tracking-tight text-green-800 sm:text-[20px]">
                Smart Procurement
              </h1>
              <p className="text-[10px] font-semibold text-blue-900 sm:text-[11px]">
                & Queue Management System
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-7 lg:flex">
            <a
              href="#home"
              className="border-b-2 border-green-700 py-6 text-sm font-semibold text-green-700"
            >
              Home
            </a>

            <a
              href="#how-it-works"
              className="py-6 text-sm font-medium text-slate-700 transition hover:text-green-700"
            >
              How It Works
            </a>

            <Link
              to="/find-centres"
              className="py-6 text-sm font-medium text-slate-700 transition hover:text-green-700"
            >
              Centres
            </Link>

            <a
              href="#about"
              className="py-6 text-sm font-medium text-slate-700 transition hover:text-green-700"
            >
              About Us
            </a>

            <a
              href="#help"
              className="py-6 text-sm font-medium text-slate-700 transition hover:text-green-700"
            >
              Help
            </a>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden items-center gap-2.5 sm:flex">
            <Link
              to="/login"
              className="flex items-center gap-2 rounded-lg border border-blue-200 px-4 py-2.5 text-sm font-semibold text-blue-800 transition hover:bg-blue-50"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600"
            >
              Register
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenu(!mobileMenu)}
            className="rounded-lg border border-slate-200 p-2.5 text-slate-700 sm:hidden"
            aria-label="Toggle menu"
          >
            {mobileMenu ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenu && (
          <div className="border-t border-slate-100 bg-white px-5 py-4 shadow-lg sm:hidden">
            <nav className="flex flex-col">
              <a
                href="#home"
                onClick={() => setMobileMenu(false)}
                className="rounded-lg bg-green-50 px-4 py-3 font-semibold text-green-700"
              >
                Home
              </a>

              <a
                href="#how-it-works"
                onClick={() => setMobileMenu(false)}
                className="rounded-lg px-4 py-3 font-medium hover:bg-slate-50"
              >
                How It Works
              </a>

              <Link
                to="/find-centres"
                onClick={() => setMobileMenu(false)}
                className="rounded-lg px-4 py-3 font-medium hover:bg-slate-50"
              >
                Centres
              </Link>

              <a
                href="#about"
                onClick={() => setMobileMenu(false)}
                className="rounded-lg px-4 py-3 font-medium hover:bg-slate-50"
              >
                About Us
              </a>

              <a
                href="#help"
                onClick={() => setMobileMenu(false)}
                className="rounded-lg px-4 py-3 font-medium hover:bg-slate-50"
              >
                Help
              </a>

              <div className="mt-3 grid grid-cols-2 gap-2 border-t border-slate-100 pt-4">
                <Link
                  to="/login"
                  className="rounded-lg border border-blue-200 px-4 py-3 text-center font-semibold text-blue-800"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className="rounded-lg bg-orange-500 px-4 py-3 text-center font-semibold text-white"
                >
                  Register
                </Link>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Hero */}
      <main>
        <section
          id="home"
          className="relative overflow-hidden bg-sky-50"
        >
          <div className="mx-auto grid min-h-[420px] max-w-[1440px] lg:grid-cols-[0.9fr_1.1fr]">
            {/* Hero Content */}
            <div className="relative z-10 flex items-center px-5 py-12 sm:px-10 lg:px-14 xl:px-20">
              <div className="max-w-xl">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-green-200 bg-white/80 px-3 py-1.5 text-xs font-semibold text-green-700 shadow-sm">
                  <CheckCircle2 className="h-4 w-4" />
                  Simple • Fast • Transparent
                </div>

                <h2 className="text-4xl font-extrabold leading-[1.08] tracking-tight text-blue-950 sm:text-5xl lg:text-6xl">
                  Smart Procurement,
                  <span className="block text-green-700">
                    Less Waiting
                  </span>
                </h2>

                <p className="mt-5 max-w-lg text-base leading-7 text-slate-700 sm:text-lg">
                  Find the best procurement centre, book your slot,
                  track your queue and monitor your payment — all in
                  one place.
                </p>

                <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                  <Link
                    to="/find-centres"
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-green-700 px-5 py-3.5 text-sm font-bold text-white shadow-md transition hover:bg-green-800"
                  >
                    <Search className="h-4 w-4" />
                    Find Procurement Centre
                  </Link>

                  <Link
                    to="/login"
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-orange-500 px-6 py-3.5 text-sm font-bold text-white shadow-md transition hover:bg-orange-600"
                  >
                    Login
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>

                <div className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-xs font-medium text-slate-600">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="h-4 w-4 text-green-700" />
                    Secure & Transparent
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock3 className="h-4 w-4 text-green-700" />
                    Real-time Updates
                  </span>
                </div>
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative min-h-[300px] overflow-hidden sm:min-h-[380px] lg:min-h-[420px]">
              <img
                src={farmerCentre}
                alt="Farmer at procurement centre"
                className="absolute inset-0 h-full w-full object-cover object-center"
              />

              <div className="absolute inset-0 bg-gradient-to-r from-sky-50 via-transparent to-transparent lg:w-1/3" />
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section
          id="how-it-works"
          className="bg-white px-5 py-14 sm:px-8 lg:px-10 lg:py-16"
        >
          <div className="mx-auto max-w-7xl">
            <div className="mb-10 text-center">
              <p className="text-sm font-bold uppercase tracking-wider text-green-700">
                Simple Process
              </p>

              <h3 className="mt-2 text-2xl font-extrabold text-blue-950 sm:text-3xl">
                How It Works
              </h3>

              <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
                Complete your procurement journey in four simple
                steps.
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {steps.map((step, index) => {
                const Icon = step.icon;

                return (
                  <div
                    key={step.number}
                    className="relative rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                  >
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-green-50">
                      <Icon className="h-8 w-8 text-green-700" />
                    </div>

                    <div className="mt-4 text-xs font-bold text-green-700">
                      STEP {step.number}
                    </div>

                    <h4 className="mt-1 text-lg font-bold text-blue-950">
                      {step.title}
                    </h4>

                    <p className="mt-2 text-sm leading-5 text-slate-600">
                      {step.description}
                    </p>

                    {index !== steps.length - 1 && (
                      <ArrowRight className="absolute -right-4 top-1/2 hidden h-7 w-7 -translate-y-1/2 text-green-600 lg:block" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="bg-blue-950 px-5 py-8 sm:px-8 lg:px-10">
          <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 lg:grid-cols-4">
            {stats.map((stat) => {
              const Icon = stat.icon;

              return (
                <div
                  key={stat.label}
                  className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-4 sm:p-5"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/10">
                    <Icon className="h-5 w-5 text-white" />
                  </div>

                  <div>
                    <p className="text-lg font-extrabold text-white sm:text-xl">
                      {stat.value}
                    </p>
                    <p className="text-[10px] leading-4 text-blue-100 sm:text-xs">
                      {stat.label}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* About */}
        <section
          id="about"
          className="px-5 py-14 sm:px-8 lg:px-10 lg:py-20"
        >
          <div className="mx-auto grid max-w-7xl gap-8 rounded-3xl bg-green-50 p-7 sm:p-10 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-sm font-bold uppercase tracking-wider text-green-700">
                For Every Farmer
              </p>

              <h3 className="mt-2 text-2xl font-extrabold text-blue-950 sm:text-3xl">
                A smarter way to manage your procurement journey.
              </h3>

              <p className="mt-4 leading-7 text-slate-700">
                Smart Procurement helps farmers find nearby centres,
                reserve convenient slots, avoid unnecessary waiting,
                follow their token and receive clear payment updates.
              </p>

              <Link
                to="/register"
                className="mt-6 inline-flex items-center gap-2 rounded-lg bg-green-700 px-5 py-3 font-bold text-white transition hover:bg-green-800"
              >
                Get Started
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {[
                "Find nearby procurement centres",
                "Book your preferred slot",
                "Track live queue position",
                "Monitor procurement & payment",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-3 rounded-xl bg-white p-4 shadow-sm"
                >
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-700" />
                  <span className="text-sm font-semibold text-slate-700">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer
        id="help"
        className="border-t border-slate-200 bg-white px-5 py-6"
      >
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 text-center sm:flex-row sm:text-left">
          <div>
            <p className="font-bold text-green-800">
              Smart Procurement
            </p>
            <p className="text-xs text-slate-500">
              & Queue Management System
            </p>
          </div>

          <p className="text-xs text-slate-500">
            Safe • Transparent • Easy
          </p>
        </div>
      </footer>
    </div>
  );
}

export default Home;