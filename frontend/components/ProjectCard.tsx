// frontend/components/ProjectCard.tsx
'use client';

import Link from 'next/link';
import { Project } from '@/types/project';
import { StatusBadge, PriorityBadge } from '@/components/Badges';

interface ProjectCardProps {
  project: Project;
  onDelete: (project: Project) => void;
}

export function ProjectCard({ project, onDelete }: ProjectCardProps) {
  return (
    <div className="flex flex-col justify-between rounded-xl bg-white p-6 shadow-sm border border-slate-200 dark:bg-slate-900 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
      <div>
        <div className="flex items-start justify-between gap-2 mb-3">
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white text-base">
              {project.project_name}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {project.client_name}
            </p>
          </div>
          <StatusBadge status={project.status} />
        </div>

        {project.description && (
          <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-2 mb-4">
            {project.description}
          </p>
        )}

        <div className="grid grid-cols-2 gap-2 text-xs py-3 border-t border-b border-slate-100 dark:border-slate-800 mb-4">
          <div>
            <span className="text-slate-400 block uppercase font-medium">Priority</span>
            <div className="mt-1">
              <PriorityBadge priority={project.priority} />
            </div>
          </div>
          <div>
            <span className="text-slate-400 block uppercase font-medium">Due Date</span>
            <span className="font-mono text-slate-700 dark:text-slate-300 mt-1 block">
              {project.due_date}
            </span>
          </div>
        </div>
      </div>

      <div className="flex justify-end items-center gap-3 pt-2">
        <Link
          href={`/projects/${project.id}/edit`}
          className="text-xs font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
        >
          Edit
        </Link>
        <button
          type="button"
          onClick={() => onDelete(project)}
          className="text-xs font-medium text-rose-600 hover:text-rose-700 dark:text-rose-400"
        >
          Delete
        </button>
      </div>
    </div>
  );
}