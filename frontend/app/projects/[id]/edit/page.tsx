// frontend/app/projects/[id]/edit/page.tsx
'use client';

import { use, useEffect, useState } from 'react';
import { ProjectForm } from '@/components/ProjectForm';
import { projectApi } from '@/lib/api';
import { Project, CreateProjectPayload } from '@/types/project';

interface EditPageProps {
  params: Promise<{ id: string }>;
}

export default function EditProjectPage({ params }: EditPageProps) {
  const { id } = use(params);
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setIsLoading(true);
        const data = await projectApi.getById(id);
        setProject(data);
      } catch (err) {
        setError('Project not found or failed to load.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  const handleUpdate = async (data: CreateProjectPayload) => {
    await projectApi.update(id, data);
  };

  return (
    <main className="min-h-screen bg-slate-50 p-6 sm:p-10 dark:bg-slate-950">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Edit Project
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Update status, delivery dates, or priority details for this project.
          </p>
        </div>

        {isLoading ? (
          <div className="flex h-64 items-center justify-center rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <p className="text-sm text-slate-500">Loading project details...</p>
          </div>
        ) : error || !project ? (
          <div className="rounded-lg bg-rose-50 p-4 text-sm text-rose-700 dark:bg-rose-950/50 dark:text-rose-300">
            {error || 'Project not found.'}
          </div>
        ) : (
          <ProjectForm initialData={project} onSubmit={handleUpdate} isEditing={true} />
        )}
      </div>
    </main>
  );
}