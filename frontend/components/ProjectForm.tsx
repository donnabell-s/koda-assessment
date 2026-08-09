// frontend/components/ProjectForm.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Project, CreateProjectPayload, ProjectStatus, ProjectPriority } from '@/types/project';

interface ProjectFormProps {
  initialData?: Project;
  onSubmit: (data: CreateProjectPayload) => Promise<void>;
  isEditing?: boolean;
}

const STATUS_OPTIONS: ProjectStatus[] = ['Planning', 'In Progress', 'On Hold', 'Completed'];
const PRIORITY_OPTIONS: ProjectPriority[] = ['Low', 'Medium', 'High'];

export function ProjectForm({ initialData, onSubmit, isEditing = false }: ProjectFormProps) {
  const router = useRouter();

  const [formData, setFormData] = useState<CreateProjectPayload>({
    client_name: initialData?.client_name || '',
    project_name: initialData?.project_name || '',
    description: initialData?.description || '',
    status: initialData?.status || 'Planning',
    priority: initialData?.priority || 'Low',
    start_date: initialData?.start_date || new Date().toISOString().split('T')[0],
    due_date: initialData?.due_date || '',
  });

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field when user types
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateClientSide = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.client_name.trim()) errors.client_name = 'Client Name is required.';
    if (!formData.project_name.trim()) errors.project_name = 'Project Name is required.';
    if (!formData.start_date) errors.start_date = 'Start Date is required.';
    if (!formData.due_date) errors.due_date = 'Due Date is required.';

    // Rule: Due Date cannot be earlier than Start Date
    if (formData.start_date && formData.due_date) {
      const start = new Date(formData.start_date);
      const due = new Date(formData.due_date);
      if (due < start) {
        errors.due_date = 'Due Date cannot be earlier than Start Date.';
      }
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateClientSide()) return;

    try {
      setIsSubmitting(true);
      await onSubmit(formData);
      router.push('/');
      router.refresh();
    } catch (err: unknown) {
      // Parse errors returned from Django REST Framework
      if (err && typeof err === 'object') {
        const drfErrors: Record<string, string> = {};
        Object.entries(err as Record<string, string[]>).forEach(([key, val]) => {
          drfErrors[key] = Array.isArray(val) ? val.join(' ') : String(val);
        });
        setFieldErrors(drfErrors);
      } else {
        setFieldErrors({ non_field_errors: 'Something went wrong. Please try again.' });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 rounded-xl bg-white p-6 shadow-sm border border-slate-200 dark:bg-slate-900 dark:border-slate-800">
      {fieldErrors.non_field_errors && (
        <div className="rounded-lg bg-rose-50 p-4 text-sm text-rose-700 dark:bg-rose-950/50 dark:text-rose-300">
          {fieldErrors.non_field_errors}
        </div>
      )}

      {/* Client Name & Project Name */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Client Name <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            name="client_name"
            value={formData.client_name}
            onChange={handleChange}
            placeholder="e.g. Acme Corp"
            className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          />
          {fieldErrors.client_name && (
            <p className="mt-1 text-xs text-rose-600">{fieldErrors.client_name}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Project Name <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            name="project_name"
            value={formData.project_name}
            onChange={handleChange}
            placeholder="e.g. E-Commerce Redesign"
            className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          />
          {fieldErrors.project_name && (
            <p className="mt-1 text-xs text-rose-600">{fieldErrors.project_name}</p>
          )}
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
          Description
        </label>
        <textarea
          name="description"
          rows={3}
          value={formData.description}
          onChange={handleChange}
          placeholder="Brief overview of project deliverables..."
          className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
        />
      </div>

      {/* Status & Priority */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Status
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          >
            {STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Priority
          </label>
          <select
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          >
            {PRIORITY_OPTIONS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Start Date & Due Date */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Start Date <span className="text-rose-500">*</span>
          </label>
          <input
            type="date"
            name="start_date"
            value={formData.start_date}
            onChange={handleChange}
            className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          />
          {fieldErrors.start_date && (
            <p className="mt-1 text-xs text-rose-600">{fieldErrors.start_date}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Due Date <span className="text-rose-500">*</span>
          </label>
          <input
            type="date"
            name="due_date"
            value={formData.due_date}
            onChange={handleChange}
            className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          />
          {fieldErrors.due_date && (
            <p className="mt-1 text-xs text-rose-600">{fieldErrors.due_date}</p>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
        <button
          type="button"
          onClick={() => router.push('/')}
          className="rounded-lg px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
        >
          {isSubmitting ? 'Saving...' : isEditing ? 'Update Project' : 'Create Project'}
        </button>
      </div>
    </form>
  );
}