import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../store/authSlice";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LayoutDashboard, 
  FolderKanban, 
  CheckSquare, 
  Kanban, 
  Users, 
  BarChart3, 
  Bell, 
  Settings, 
  UserCircle,
  LogOut,
  Hexagon
} from "lucide-react";

const links = [
  { name: "dashboard", icon: LayoutDashboard },
  { name: "projects", icon: FolderKanban },
  { name: "tasks", icon: CheckSquare },
  { name: "kanban", icon: Kanban },
  { name: "users", icon: Users },
  { name: "reports", icon: BarChart3 },
  { name: "notifications", icon: Bell },
  { name: "settings", icon: Settings },
  { name: "profile", icon: UserCircle },
];

export default function AppLayout() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const location = useLocation();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-indigo-500/30 dark:bg-slate-950 dark:text-slate-100 flex">
      {/* Sidebar */}
      <motion.aside 
        initial={{ x: -28, opacity: 0 }} 
        animate={{ x: 0, opacity: 1 }} 
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="sticky top-0 z-40 hidden h-screen w-72 flex-col border-r border-slate-200/60 bg-white/40 backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/40 lg:flex"
      >
        <div className="flex h-16 shrink-0 items-center gap-3 px-6 pb-2 pt-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500 text-white shadow-sm ring-1 ring-indigo-500/50">
            <Hexagon className="h-5 w-5 fill-indigo-400" />
          </div>
          <span className="text-xl font-bold tracking-tight">EWMS</span>
        </div>
        
        <nav className="flex flex-1 flex-col justify-between overflow-y-auto px-4 py-8">
          <div className="space-y-1">
            <p className="mb-4 px-3 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Workspace
            </p>
            {links.map((item) => (
              <NavLink
                key={item.name}
                to={`/${item.name}`}
                className={({ isActive }) => `
                  group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all
                  ${isActive 
                    ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300" 
                    : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-slate-200"
                  }
                `}
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <motion.div
                        layoutId="active-nav-bg"
                        className="absolute inset-0 rounded-xl bg-indigo-50 dark:bg-indigo-500/10"
                        initial={false}
                        transition={{ type: "spring", stiffness: 350, damping: 30 }}
                      />
                    )}
                    <item.icon className={`relative z-10 h-5 w-5 ${isActive ? "text-indigo-600 dark:text-indigo-400" : "text-slate-400 group-hover:text-slate-500 dark:group-hover:text-slate-300"}`} />
                    <span className="relative z-10 capitalize">{item.name}</span>
                  </>
                )}
              </NavLink>
            ))}
          </div>

          <div className="mt-8 space-y-1">
            <button
              onClick={handleLogout}
              className="group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 transition-all hover:bg-red-50 hover:text-red-600 dark:text-slate-400 dark:hover:bg-red-500/10 dark:hover:text-red-400"
            >
              <LogOut className="h-5 w-5 text-slate-400 group-hover:text-red-500" />
              <span>Log out</span>
            </button>
          </div>
        </nav>
      </motion.aside>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Top Navbar */}
        <motion.header 
          initial={{ y: -16, opacity: 0 }} 
          animate={{ y: 0, opacity: 1 }} 
          transition={{ duration: 0.3, ease: "easeOut", delay: 0.1 }}
          className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between border-b border-slate-200/60 bg-white/70 px-4 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/70 sm:px-6 lg:px-8"
        >
          <div className="flex items-center gap-4 lg:hidden">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500 text-white shadow-sm ring-1 ring-indigo-500/50">
              <Hexagon className="h-4 w-4 fill-indigo-400" />
            </div>
          </div>
          
          <div className="flex flex-1 items-center justify-end gap-x-4 self-stretch lg:gap-x-6">
            {/* Quick Actions or Global Search can go here */}
            
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              <button aria-label="Notifications" className="-m-2.5 p-2.5 text-slate-400 hover:text-slate-500 dark:hover:text-slate-300 transition relative">
                <Bell className="h-5 w-5" aria-hidden="true" />
                <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-slate-900"></span>
              </button>

              <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-slate-200 dark:lg:bg-slate-700" aria-hidden="true" />

              <div className="flex items-center gap-3 p-1">
                <img
                  className="h-8 w-8 rounded-full bg-slate-100 object-cover ring-1 ring-slate-200 dark:ring-slate-800"
                  src={`https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=c7d2fe&color=3730a3&bold=true`}
                  alt=""
                />
                <div className="hidden lg:flex lg:flex-col lg:items-start text-sm">
                  <span className="font-semibold text-slate-900 dark:text-white leading-tight" aria-hidden="true">
                    {user?.name}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 leading-tight">
                    {user?.role}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 xl:p-10 mx-auto w-full max-w-7xl">
          <AnimatePresence mode="wait">
            <motion.div 
              key={location.pathname}
              initial={{ opacity: 0, y: 12, filter: "blur(4px)" }} 
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} 
              exit={{ opacity: 0, y: -8, filter: "blur(2px)" }}
              transition={{ duration: 0.3, ease: [0.25, 0.8, 0.25, 1] }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
