// frontend/app/page.tsx
'use client';

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { Project, ProjectStatus, ProjectPriority } from '@/types/project';
import { projectApi } from '@/lib/api';
import { DeleteModal } from '@/components/DeleteModal';
import { ProjectFilters } from '@/components/ProjectFilters';
import { ProjectList } from '@/components/ProjectList';

export default function DashboardPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filter & Search State
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<ProjectStatus | 'All'>('All');
  const [selectedPriority, setSelectedPriority] = useState<ProjectPriority | 'All'>('All');

  // Modal State
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;

    const fetchProjects = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await projectApi.getAll();
        if (!isMounted) return;

        // Ensure we fall back to an empty array if data is null/undefined
        setProjects(data || []);
      } catch (err) {
        if (!isMounted) return;

        setError('Failed to load projects. Make sure the Django backend is running.');
        console.error(err);
      } finally {
        if (!isMounted) return;

        // Guarantees isLoading is turned off when request finishes
        setIsLoading(false);
      }
    };

    void fetchProjects();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        query === '' ||
        project.project_name.toLowerCase().includes(query) ||
        project.client_name.toLowerCase().includes(query) ||
        project.description.toLowerCase().includes(query);

      const matchesStatus = selectedStatus === 'All' || project.status === selectedStatus;
      const matchesPriority = selectedPriority === 'All' || project.priority === selectedPriority;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [projects, searchQuery, selectedStatus, selectedPriority]);

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

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedStatus('All');
    setSelectedPriority('All');
  };

  const isFiltering = searchQuery !== '' || selectedStatus !== 'All' || selectedPriority !== 'All';

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

        {/* Filter Controls */}
        <ProjectFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedStatus={selectedStatus}
          onStatusChange={setSelectedStatus}
          selectedPriority={selectedPriority}
          onPriorityChange={setSelectedPriority}
          onClearFilters={clearFilters}
          filteredCount={filteredProjects.length}
          totalCount={projects.length}
        />

        {/* Main Content Area */}
        {isLoading ? (
          /* 1. Show ONLY while fetching from API */
          <div className="flex h-64 items-center justify-center rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <p className="text-sm text-slate-500">Loading projects...</p>
          </div>
        ) : filteredProjects.length === 0 ? (
          /* 2. Show when request completes and list is empty */
          <div className="flex h-64 flex-col items-center justify-center rounded-xl bg-white text-center dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">
              {isFiltering ? 'No matching projects' : 'No projects found'}
            </h3>
            {isFiltering && (
              <>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Try adjusting or clearing your search and filter criteria.
                </p>
                <button
                  onClick={clearFilters}
                  className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                >
                  Reset Filters
                </button>
              </>
            )}
          </div>
        ) : (
          /* 3. Render projects list when projects exist */
          <ProjectList
            projects={filteredProjects}
            onDeleteProject={setProjectToDelete}
          />
        )}
      </div>

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