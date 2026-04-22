import { useDispatch, useSelector } from "react-redux";
import { clearNotifications, markNotificationRead } from "../../store/workSlice";
import { EmptyState, PageCard, PageHeader, Button } from "../common/components/UI";
import { Bell, Check, Trash2, BellRing } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function NotificationsPage() {
  const dispatch = useDispatch();
  const notifications = useSelector((state) => state.work.notifications);

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Notifications" 
        subtitle="Realtime updates on tasks, mentions, and project changes"
        icon={Bell}
        actions={
          notifications.length > 0 && (
            <Button variant="secondary" onClick={() => dispatch(clearNotifications())}>
              <Trash2 className="h-4 w-4" /> Clear All
            </Button>
          )
        }
      />

      <PageCard className="overflow-hidden p-0 sm:p-0 border-0 sm:border dark:border-white/10 dark:bg-slate-900/40">
        {!notifications.length ? (
          <div className="p-6">
            <EmptyState title="All caught up!" description="You don't have any new notifications." icon={BellRing} />
          </div>
        ) : (
          <div className="divide-y divide-slate-200 dark:divide-white/10">
            <AnimatePresence>
              {notifications.map((item) => (
                <motion.div 
                  key={item.id} 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className={`group relative flex items-start gap-4 p-4 sm:p-6 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50 ${!item.read ? "bg-indigo-50/50 dark:bg-indigo-900/10" : ""}`}
                >
                  <div className={`mt-1 h-2 w-2 shrink-0 rounded-full ${!item.read ? "bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]" : "bg-transparent ring-1 ring-slate-300 dark:ring-slate-700"}`} />
                  
                  <div className="flex-1">
                    <p className={`text-sm ${!item.read ? "font-semibold text-slate-900 dark:text-white" : "font-medium text-slate-700 dark:text-slate-300"}`}>
                      {item.message}
                    </p>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      {new Date(item.createdAt || Date.now()).toLocaleString(undefined, {
                        month: "short", day: "numeric", hour: "numeric", minute: "2-digit"
                      })}
                    </p>
                  </div>
                  
                  {!item.read && (
                    <Button 
                      variant="ghost" 
                      onClick={() => dispatch(markNotificationRead(item.id))}
                      className="opacity-0 group-hover:opacity-100 transition text-indigo-600 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-500/10 h-8 px-2"
                    >
                      <Check className="h-4 w-4" /> <span className="sr-only sm:not-sr-only sm:ml-1 text-xs">Mark read</span>
                    </Button>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </PageCard>
    </div>
  );
}
