// frontend/components/ProjectFilters.tsx
'use client';

import { ProjectStatus, ProjectPriority } from '@/types/project';

const STATUS_OPTIONS: (ProjectStatus | 'All')[] = [
  'All',
  'Planning',
  'In Progress',
  'On Hold',
  'Completed',
];

const PRIORITY_OPTIONS: (ProjectPriority | 'All')[] = [
  'All',
  'Low',
  'Medium',
  'High',
];

interface ProjectFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedStatus: ProjectStatus | 'All';
  onStatusChange: (status: ProjectStatus | 'All') => void;
  selectedPriority: ProjectPriority | 'All';
  onPriorityChange: (priority: ProjectPriority | 'All') => void;
  onClearFilters: () => void;
  filteredCount: number;
  totalCount: number;
}

export function ProjectFilters({
  searchQuery,
  onSearchChange,
  selectedStatus,
  onStatusChange,
  selectedPriority,
  onPriorityChange,
  onClearFilters,
  filteredCount,
  totalCount,
}: ProjectFiltersProps) {
  const isFiltering =
    searchQuery !== '' || selectedStatus !== 'All' || selectedPriority !== 'All';

  return (
    <div className="mb-6 space-y-4">
      {/* Controls Bar */}
      <div className="grid grid-cols-1 gap-4 rounded-xl bg-white p-4 shadow-sm sm:grid-cols-12 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        {/* Search Input */}
        <div className="sm:col-span-6">
          <label className="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-1">
            Search Projects
          </label>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by project name, client, or description..."
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          />
        </div>

        {/* Status Filter */}
        <div className="sm:col-span-3">
          <label className="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-1">
            Status
          </label>
          <select
            value={selectedStatus}
            onChange={(e) => onStatusChange(e.target.value as ProjectStatus | 'All')}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          >
            {STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>
                {status === 'All' ? 'All Statuses' : status}
              </option>
            ))}
          </select>
        </div>

        {/* Priority Filter */}
        <div className="sm:col-span-3">
          <label className="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-1">
            Priority
          </label>
          <select
            value={selectedPriority}
            onChange={(e) => onPriorityChange(e.target.value as ProjectPriority | 'All')}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          >
            {PRIORITY_OPTIONS.map((priority) => (
              <option key={priority} value={priority}>
                {priority === 'All' ? 'All Priorities' : priority}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Results Meta & Reset */}
      <div className="flex items-center justify-between px-1">
        <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
          Showing{' '}
          <span className="text-slate-900 dark:text-white font-semibold">
            {filteredCount}
          </span>{' '}
          of {totalCount} projects
        </p>
        {isFiltering && (
          <button
            onClick={onClearFilters}
            className="text-sm font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 underline"
          >
            Clear filters
          </button>
        )}
      </div>
    </div>
  );
}