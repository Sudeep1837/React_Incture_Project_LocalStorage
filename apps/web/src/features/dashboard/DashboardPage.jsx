import React from "react";
import { useSelector } from "react-redux";
import { PageHeader, PageCard } from "../common/components/UI";
import { InsightCard, DonutChartCard, MiniTrendChart, StripMetric } from "../common/components/Analytics";
import { selectDashboardMetrics, selectWeeklyTrend, selectProjectHealth, selectWorkloadMetrics } from "../../store/selectors";
import { FolderKanban, CheckSquare, Target, Activity, CheckCircle2, AlertCircle } from "lucide-react";

export default function DashboardPage() {
  const metrics = useSelector(selectDashboardMetrics);
  const trendData = useSelector(selectWeeklyTrend);
  const projectHealth = useSelector(selectProjectHealth);
  const workload = useSelector(selectWorkloadMetrics);
  const activity = useSelector((state) => state.work.activity);

  const highestWorkloadUser = workload.length > 0 ? workload[0] : null;
  const delayedProjects = projectHealth.filter(p => p.progress < 50 && p.taskCount > 0);

  return (
    <div className="space-y-8">
      <PageHeader 
        title="Command Center" 
        subtitle="Intelligent oversight of workspace execution and delivery"
        icon={Target}
      />

      {/* Smart Insights Row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <InsightCard 
          title="Active Execution" 
          value={metrics.pendingTasks} 
          insight={metrics.overdueTasks > 0 ? `${metrics.overdueTasks} critical tasks overdue` : "All tasks on schedule"}
          icon={Activity} 
          trend={metrics.completionRate > 50 ? 12 : -4}
        />
        <InsightCard 
          title="Project Velocity" 
          value={`${metrics.completionRate}%`} 
          insight={delayedProjects.length > 0 ? `${delayedProjects.length} projects need attention` : "Healthy progression"}
          icon={FolderKanban} 
        />
        <InsightCard 
          title="Completed Work" 
          value={metrics.completedTasks} 
          insight="Tasks delivered across workspace"
          icon={CheckCircle2} 
          trend={8}
        />
        {highestWorkloadUser ? (
          <InsightCard 
            title="Team Workload" 
            value={highestWorkloadUser.activeTaskCount}
            insight={`Highest load: ${highestWorkloadUser.name}`}
            icon={CheckSquare}
          />
        ) : (
          <InsightCard 
            title="Team Workload" 
            value={0}
            insight="No active assignments"
            icon={CheckSquare}
          />
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Analytics Main Column */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="grid sm:grid-cols-2 gap-6">
            <DonutChartCard 
              title="Execution Status" 
              subtitle="Tasks mapped by current column"
              data={metrics.statusData} 
            />
            <DonutChartCard 
              title="Priority Distribution" 
              subtitle="Tasks mapped by urgency"
              data={metrics.priorityData} 
            />
          </div>

          <PageCard title="Delivery Trend" subtitle="Task completion trajectory over 7 days">
            <div className="h-[250px] w-full mt-4 flex items-end justify-between gap-4">
              <div className="flex flex-col gap-8 mb-4">
                <StripMetric label="7-Day Output" value={trendData.reduce((acc, d) => acc + d.value, 0)} sub="Tasks" />
                <StripMetric label="Peak Velocity" value={Math.max(...trendData.map(d => d.value))} sub="Tasks/day" />
              </div>
              <div className="h-full flex-1">
                <MiniTrendChart data={trendData} color="#10b981" />
              </div>
            </div>
          </PageCard>
        </div>

        {/* Activity & Health Column */}
        <div className="space-y-6">
          <PageCard title="Project Health" subtitle="At a glance visual status">
            <div className="space-y-4 mt-2">
              {projectHealth.length === 0 ? (
                <p className="text-sm text-slate-500">No active projects</p>
              ) : (
                projectHealth.slice(0, 4).map(project => (
                  <div key={project.id} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">{project.name}</p>
                      <p className="text-xs text-slate-500">{project.taskCount} total tasks</p>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-bold ${project.health === 'excellent' ? 'text-emerald-500' : project.health === 'good' ? 'text-indigo-500' : 'text-amber-500'}`}>
                        {project.progress}%
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </PageCard>

          <PageCard title="Workspace Telemetry" subtitle="Real-time execution log" className="min-h-[400px]">
            <div className="relative mt-4 space-y-0 before:absolute before:inset-0 before:ml-[11px] before:h-full before:w-px before:bg-slate-200 dark:before:bg-slate-800">
              {activity.slice(0, 8).map((item) => (
                <div key={item.id} className="relative flex items-start gap-4 mb-5 last:mb-0 group">
                  <div className="relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-white bg-indigo-100 dark:border-slate-900 dark:bg-indigo-500/20">
                    <div className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                  </div>
                  <div className="flex-1 pt-0.5">
                    <p className="text-sm text-slate-700 dark:text-slate-300 leading-snug">{item.message}</p>
                    <p className="text-xs text-slate-400 mt-0.5">Recently</p>
                  </div>
                </div>
              ))}
              {activity.length === 0 && (
                <div className="py-8 text-center text-sm text-slate-500">No telemetry recorded yet</div>
              )}
            </div>
          </PageCard>
        </div>
      </div>
    </div>
  );
}
