import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useDebouncedValue } from "../../hooks/useDebouncedValue";
import { applyTextFilter, sortByField } from "../common/utils/filtering";
import { ConfirmDialog, EmptyState, PageCard, PageHeader, Button, Badge } from "../common/components/UI";
import { MetricsStrip, StripMetric } from "../common/components/Analytics";
import { addNotification, deleteTask, upsertTask } from "../../store/workSlice";
import { selectDashboardMetrics } from "../../store/selectors";
import { getSocket } from "../../services/socketClient";
import TaskForm from "./components/TaskForm";
import TaskDetailsDrawer from "./components/TaskDetailsDrawer";
import { CheckSquare, Plus, Search } from "lucide-react";

export default function TasksPage() {
  const dispatch = useDispatch();
  const tasks = useSelector((state) => state.work.tasks);
  const users = useSelector((state) => state.work.users);
  const metrics = useSelector(selectDashboardMetrics);
  
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("updatedAt");
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [selected, setSelected] = useState(null);
  const [statusFilter, setStatusFilter] = useState("All");

  const debounced = useDebouncedValue(query);

  const filtered = useMemo(() => {
    let result = tasks;
    if (statusFilter !== "All") result = result.filter(t => t.status === statusFilter);
    return sortByField(applyTextFilter(result, debounced, ["title", "type", "priority", "status"]), sort, "desc");
  }, [tasks, debounced, sort, statusFilter]);

  const saveTask = (values) => {
    const task = { ...editing, ...values, id: editing?.id || crypto.randomUUID() };
    dispatch(upsertTask(task));
    dispatch(addNotification({ id: crypto.randomUUID(), message: `Task ${editing?.id ? "updated" : "created"}: ${task.title}`, read: false }));
    getSocket()?.emit(editing?.id ? "task:updated" : "task:created", { task });
    setEditing(null);
  };

  const getPriorityTone = (priority) => {
    if (priority === "Critical") return "red";
    if (priority === "High") return "amber";
    if (priority === "Medium") return "indigo";
    return "slate";
  };

  const getUserName = (id) => users.find(u => u.id === id)?.name || "Unassigned";

  return (
    <div className="space-y-6">
      <PageHeader
        title="Task Execution"
        subtitle="Manage constraints and deliverable tasks"
        icon={CheckSquare}
        actions={
          <Button onClick={() => setEditing({ status: "Todo", type: "Feature", priority: "Medium" })}>
            <Plus className="h-4 w-4" /> New Task
          </Button>
        }
      />

      <MetricsStrip>
        <div className="flex w-full overflow-x-auto pb-2 sm:pb-0 hide-scrollbar gap-2 sm:gap-6 cursor-pointer">
          <div onClick={() => setStatusFilter("All")} className={`transition-opacity hover:opacity-100 ${statusFilter === "All" ? "opacity-100" : "opacity-50 grayscale"}`}>
            <StripMetric label="Total Tasks" value={metrics.totalTasks} />
          </div>
          {metrics.statusData.map(stat => (
            <div key={stat.name} onClick={() => setStatusFilter(stat.name)} className={`transition-opacity hover:opacity-100 ${statusFilter === stat.name ? "opacity-100 scale-105" : "opacity-50 grayscale"}`}>
              <StripMetric label={stat.name} value={stat.value} sub="Tasks" />
            </div>
          ))}
        </div>
      </MetricsStrip>

      <PageCard>
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              className="w-full rounded-xl border border-slate-200/60 bg-slate-50 py-2 pl-10 pr-4 text-sm transition focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-white/10 dark:bg-slate-900/50 dark:focus:border-indigo-400 dark:focus:ring-indigo-400"
              placeholder="Search tasks by title, type, priority..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <select
            className="rounded-xl border border-slate-200/60 bg-slate-50 px-4 py-2 text-sm transition focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-white/10 dark:bg-slate-900/50 dark:focus:border-indigo-400 dark:focus:ring-indigo-400"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="updatedAt">Recently updated</option>
            <option value="title">Alphabetical</option>
            <option value="priority">Priority String</option>
          </select>
        </div>

        {!filtered.length ? (
          <EmptyState title="No tasks found" description="Create a task to start tracking delivery or adjust your search filters." icon={CheckSquare} />
        ) : (
          <div className="grid gap-3">
            {filtered.map((task) => (
              <article 
                key={task.id} 
                className="group flex flex-col gap-4 rounded-2xl border border-slate-200/60 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-white/10 dark:bg-slate-900/50 sm:flex-row sm:items-center sm:justify-between cursor-pointer"
              >
                <div className="flex-1" onClick={() => setSelected(task.id)}>
                  <div className="flex items-center gap-3">
                    <h3 className="text-base font-semibold text-slate-900 transition group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400">{task.title}</h3>
                    <Badge value={task.status} />
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1.5"><Badge value={task.priority} tone={getPriorityTone(task.priority)} /></span>
                    <span className="flex items-center gap-1.5 before:content-['·'] before:mr-1.5">{task.type}</span>
                    <span className="flex items-center gap-1.5 before:content-['·'] before:mr-1.5 font-medium text-slate-600 dark:text-slate-300">
                      {getUserName(task.assigneeId)}
                    </span>
                    {task.projectName && (
                      <span className="flex items-center gap-1.5 before:content-['·'] before:mr-1.5 font-semibold text-indigo-600 dark:text-indigo-400">
                        {task.projectName}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex shrink-0 items-center justify-end gap-2 border-t border-slate-100 pt-4 dark:border-white/5 sm:border-0 sm:pt-0">
                  <Button variant="secondary" onClick={(e) => { e.stopPropagation(); setEditing(task); }}>Edit</Button>
                  <Button variant="ghost" onClick={(e) => { e.stopPropagation(); setDeleting(task); }} className="text-red-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10">Delete</Button>
                </div>
              </article>
            ))}
          </div>
        )}
      </PageCard>

      {editing && (
        <PageCard title={editing.id ? "Edit Task" : "Create Task"}>
          <TaskForm initialValues={editing} onSubmit={saveTask} onCancel={() => setEditing(null)} />
        </PageCard>
      )}

      <ConfirmDialog open={Boolean(deleting)} title="Delete task?" message="This will permanently remove the task." onCancel={() => setDeleting(null)} onConfirm={() => { dispatch(deleteTask(deleting.id)); setDeleting(null); }} />
      <TaskDetailsDrawer task={tasks.find((item) => item.id === selected)} onClose={() => setSelected(null)} />
    </div>
  );
}
