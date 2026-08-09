// frontend/components/Badges.tsx
import { ProjectStatus, ProjectPriority } from '@/types/project';

export function StatusBadge({ status }: { status: ProjectStatus }) {
  const styles: Record<ProjectStatus, string> = {
    'Planning': 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 border-blue-200 dark:border-blue-800',
    'In Progress': 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 border-amber-200 dark:border-amber-800',
    'On Hold': 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700',
    'Completed': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[status]}`}>
      {status}
    </span>
  );
}

export function PriorityBadge({ priority }: { priority: ProjectPriority }) {
  const styles: Record<ProjectPriority, string> = {
    'Low': 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
    'Medium': 'bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300',
    'High': 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300 font-semibold',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs ${styles[priority]}`}>
      {priority}
    </span>
  );
}