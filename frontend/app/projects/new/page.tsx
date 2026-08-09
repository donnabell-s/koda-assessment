// frontend/app/projects/new/page.tsx
'use client';

import { ProjectForm } from '@/components/ProjectForm';
import { projectApi } from '@/lib/api';
import { CreateProjectPayload } from '@/types/project';

export default function NewProjectPage() {
  const handleCreate = async (data: CreateProjectPayload) => {
    await projectApi.create(data);
  };

  return (
    <main className="min-h-screen bg-slate-50 p-6 sm:p-10 dark:bg-slate-950">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Create New Project
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Fill in the details below to add a new project to your tracking dashboard.
          </p>
        </div>

        <ProjectForm onSubmit={handleCreate} isEditing={false} />
      </div>
    </main>
  );
}