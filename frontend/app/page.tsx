// frontend/app/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Project } from '@/types/project';
import { projectApi } from '@/lib/api';
import { StatusBadge, PriorityBadge } from '@/components/Badges';
import { DeleteModal } from '@/components/DeleteModal';

export default function DashboardPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Modal State
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const fetchProjects = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await projectApi.getAll();
      setProjects(data);
    } catch (err) {
      setError('Failed to load projects. Make sure the Django backend is running.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleDelete = async () => {
    if (!projectToDelete) return;

    try {
      setIsDeleting(true);
      await projectApi.delete(projectToDelete.id);
      setProjects((prev) => prev.filter((p) => p.id !== projectToDelete.id));
      setProjectToDelete(null);
    } catch (err) {
      alert('Failed to delete project.');
      console.error(err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 p-6 sm:p-10 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Client Project Tracker
            </h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Manage client projects, monitor status, and track delivery deadlines.
            </p>
          </div>
          <Link
            href="/projects/new"
            className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow hover:bg-indigo-700 transition-colors"
          >
            + Create New Project
          </Link>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="mb-6 rounded-lg bg-rose-50 p-4 text-sm text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 border border-rose-200 dark:border-rose-900">
            {error}
          </div>
        )}

        {/* Loading State */}
        {isLoading ? (
          <div className="flex h-64 items-center justify-center rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <p className="text-sm text-slate-500">Loading projects...</p>
          </div>
        ) : projects.length === 0 ? (
          /* Empty State */
          <div className="flex h-64 flex-col items-center justify-center rounded-xl bg-white text-center dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">No projects found</h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Get started by creating your first client project.</p>
            <Link
              href="/projects/new"
              className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
            >
              Create Project
            </Link>
          </div>
        ) : (
          /* Table View */
          <div className="overflow-x-auto rounded-xl bg-white shadow-sm dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-50 text-xs font-semibold uppercase text-slate-500 dark:bg-slate-800/50 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-6 py-4">Project & Client</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Priority</th>
                  <th className="px-6 py-4">Start Date</th>
                  <th className="px-6 py-4">Due Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {projects.map((project) => (
                  <tr key={project.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-900 dark:text-white">
                        {project.project_name}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        {project.client_name}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={project.status} />
                    </td>
                    <td className="px-6 py-4">
                      <PriorityBadge priority={project.priority} />
                    </td>
                    <td className="px-6 py-4 text-xs font-mono">{project.start_date}</td>
                    <td className="px-6 py-4 text-xs font-mono">{project.due_date}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-3">
                        <Link
                          href={`/projects/${project.id}/edit`}
                          className="font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
                        >
                          Edit
                        </Link>
                        <button
                          type="button"
                          onClick={() => setProjectToDelete(project)}
                          className="font-medium text-rose-600 hover:text-rose-700 dark:text-rose-400"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Modal */}
      <DeleteModal
        isOpen={!!projectToDelete}
        projectName={projectToDelete?.project_name || ''}
        isDeleting={isDeleting}
        onConfirm={handleDelete}
        onClose={() => setProjectToDelete(null)}
      />
    </main>
  );
}