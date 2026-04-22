import React from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";

function PublicNavbar() {
  const token = useSelector((state) => state.auth.token);
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/70 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/" className="text-lg font-bold tracking-tight text-white">EWMS</Link>
        <div className="hidden items-center gap-6 text-sm text-slate-200 md:flex">
          <a href="#features" className="hover:text-white">Features</a>
          <a href="#roles" className="hover:text-white">Roles</a>
          <a href="#cta" className="hover:text-white">Get Started</a>
        </div>
        <div className="flex items-center gap-2">
          <NavLink to="/login" className="rounded-lg px-3 py-2 text-sm text-slate-200 hover:bg-white/10">Login</NavLink>
          <NavLink to={token ? "/dashboard" : "/signup"} className="rounded-lg bg-gradient-to-r from-indigo-500 to-cyan-500 px-3 py-2 text-sm font-medium text-white">
            {token ? "Dashboard" : "Sign Up"}
          </NavLink>
        </div>
      </nav>
    </header>
  );
}

function PublicFooter() {
  return (
    <footer className="border-t border-white/10 bg-slate-950 px-6 py-6 text-center text-sm text-slate-400">
      Enterprise Work Management System · Modern demo architecture with localStorage + JWT + Socket.IO
    </footer>
  );
}

export default function PublicLayout() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <PublicNavbar />
      <motion.main initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
        <Outlet />
      </motion.main>
      <PublicFooter />
    </div>
  );
}
