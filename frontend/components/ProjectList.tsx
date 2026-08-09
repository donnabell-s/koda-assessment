// frontend/components/ProjectList.tsx
'use client';

import { Project } from '@/types/project';
import { ProjectCard } from '@/components/ProjectCard';

interface ProjectListProps {
  projects: Project[];
  onDeleteProject: (project: Project) => void;
}

export function ProjectList({ projects, onDeleteProject }: ProjectListProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          project={project}
          onDelete={onDeleteProject}
        />
      ))}
    </div>
  );
}