import { useSelector } from "react-redux";
import { PageCard, PageHeader } from "../common/components/UI";
import { UserCircle, Mail, Briefcase, Calendar } from "lucide-react";

export default function ProfilePage() {
  const user = useSelector((state) => state.auth.user);
  const profile = useSelector((state) => state.work.profile || {});
  
  const displayName = profile.name || user?.name || "Anonymous User";
  const displayEmail = profile.email || user?.email || "No email provided";
  const displayRole = user?.role || "Employee";

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <PageHeader 
        title="My Profile" 
        subtitle="View your account details and role context"
        icon={UserCircle}
      />

      <div className="overflow-hidden rounded-2xl border border-slate-200/60 bg-white shadow-sm dark:border-white/10 dark:bg-slate-900/50 backdrop-blur-xl">
        <div className="h-32 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
        
        <div className="px-6 sm:px-10 pb-10">
          <div className="relative flex justify-between items-end mb-8 -mt-12">
            <div className="rounded-full bg-white p-1 dark:bg-slate-900 shadow-md">
              <img
                className="h-24 w-24 rounded-full object-cover border-4 border-white dark:border-slate-900"
                src={`https://ui-avatars.com/api/?name=${displayName}&background=e0e7ff&color=4338ca&size=256&bold=true`}
                alt=""
              />
            </div>
            {/* Optional action button here */}
          </div>
          
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{displayName}</h2>
          <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400 mt-1">{displayRole}</p>
          
          <div className="mt-8 pt-8 border-t border-slate-200 dark:border-white/10 grid gap-6 sm:grid-cols-2">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800">
                <Mail className="h-5 w-5 text-slate-500 tracking-tight dark:text-slate-400" />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Email Address</p>
                <p className="text-sm font-medium text-slate-900 dark:text-slate-100 mt-0.5">{displayEmail}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800">
                <Briefcase className="h-5 w-5 text-slate-500 tracking-tight dark:text-slate-400" />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Workspace Role</p>
                <p className="text-sm font-medium text-slate-900 dark:text-slate-100 mt-0.5">{displayRole}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800">
                <Calendar className="h-5 w-5 text-slate-500 tracking-tight dark:text-slate-400" />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Joined Date</p>
                <p className="text-sm font-medium text-slate-900 dark:text-slate-100 mt-0.5">Recently</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
