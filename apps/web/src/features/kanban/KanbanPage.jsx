import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DndContext, useDraggable, useDroppable } from "@dnd-kit/core";
import { TASK_STATUSES } from "../../constants/roles";
import { moveTask } from "../../store/workSlice";
import { getSocket } from "../../services/socketClient";
import { PageHeader, Badge } from "../common/components/UI";
import { MetricsStrip, StripMetric } from "../common/components/Analytics";
import { selectKanbanMetrics } from "../../store/selectors";
import { Kanban, GripHorizontal, LayoutTemplate } from "lucide-react";
import { motion } from "framer-motion";

export default function KanbanPage() {
  const tasks = useSelector((state) => state.work.tasks);
  const kMetrics = useSelector(selectKanbanMetrics);
  const dispatch = useDispatch();
  const grouped = useMemo(
    () => TASK_STATUSES.map((status) => ({ status, tasks: tasks.filter((task) => task.status === status) })),
    [tasks],
  );

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col space-y-6">
      <PageHeader 
        title="Kanban Board" 
        subtitle="Visualize workflow and track execution status" 
        icon={Kanban} 
      />

      <MetricsStrip>
        <StripMetric label="Total Tasks" value={kMetrics.totalActive + kMetrics.done} />
        <StripMetric label="In Progress" value={kMetrics.inProgress} />
        <StripMetric label="Review Bottleneck" value={kMetrics.bottlenecks} sub="Requires attention" />
        <StripMetric label="Done" value={kMetrics.done} />
        <StripMetric label="Velocity" value={kMetrics.velocity} sub="% Completed" />
      </MetricsStrip>

      <DndContext
        onDragEnd={({ active, over }) => {
          if (!over) return;
          dispatch(moveTask({ taskId: active.id, status: over.id }));
          getSocket()?.emit("task:moved", { taskId: active.id, status: over.id });
        }}
      >
        <div className="flex flex-1 gap-6 overflow-x-auto pb-4 pt-2">
          {grouped.map((col) => <Column key={col.status} status={col.status} tasks={col.tasks} />)}
        </div>
      </DndContext>
    </div>
  );
}

function Column({ status, tasks }) {
  const { setNodeRef, isOver } = useDroppable({ id: status });
  
  return (
    <div className="flex w-80 shrink-0 flex-col rounded-2xl bg-slate-100/50 p-3 dark:bg-slate-900/40 border border-slate-200/50 dark:border-white/5 backdrop-blur-xl">
      <div className="mb-4 flex items-center justify-between px-2">
        <h3 className="font-semibold text-slate-900 dark:text-white tracking-tight">{status}</h3>
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-200/50 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-400">
          {tasks.length}
        </span>
      </div>
      
      <div 
        ref={setNodeRef} 
        className={`flex-1 space-y-3 rounded-xl p-1 transition-colors ${
          isOver ? "bg-indigo-50 dark:bg-indigo-500/10" : ""
        }`}
      >
        {tasks.map((task) => <TaskCard key={task.id} task={task} />)}
        {tasks.length === 0 && (
          <div className="flex h-24 items-center justify-center rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
            <p className="text-sm text-slate-400">Drop here</p>
          </div>
        )}
      </div>
    </div>
  );
}

function TaskCard({ task }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: task.id });
  
  const getPriorityTone = (priority) => {
    if (priority === "High") return "red";
    if (priority === "Medium") return "amber";
    return "blue";
  };

  return (
    <motion.div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      layoutId={task.id}
      style={{
        transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
        zIndex: isDragging ? 50 : 1,
      }}
      className={`group relative cursor-grab rounded-xl border border-slate-200/60 bg-white p-4 shadow-sm transition-shadow hover:shadow-md dark:border-white/10 dark:bg-slate-800 ${
        isDragging ? "shadow-2xl ring-2 ring-indigo-500/50 rotate-2" : ""
      }`}
    >
      <div className="mb-3 flex items-start justify-between gap-2">
        <p className="text-sm font-semibold text-slate-900 dark:text-white leading-snug">{task.title}</p>
        <div className="flex h-6 w-6 items-center justify-center rounded opacity-0 transition-opacity group-hover:opacity-100 hover:bg-slate-100 dark:hover:bg-slate-700">
          <GripHorizontal className="h-4 w-4 text-slate-400" />
        </div>
      </div>
      <div className="flex items-center justify-between">
        <Badge value={task.priority} tone={getPriorityTone(task.priority)} />
        <div className="flex items-center gap-1.5">
          <LayoutTemplate className="h-3.5 w-3.5 text-slate-400" />
          <span className="text-xs text-slate-500 dark:text-slate-400">{task.type}</span>
        </div>
      </div>
    </motion.div>
  );
}
