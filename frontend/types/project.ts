export type ProjectStatus = 'Planning' | 'In Progress' | 'On Hold' | 'Completed';
export type ProjectPriority = 'Low' | 'Medium' | 'High';

export interface Project {
  id: number;
  client_name: string;
  project_name: string;
  description: string;
  status: ProjectStatus;
  priority: ProjectPriority;
  start_date: string; // ISO Date YYYY-MM-DD
  due_date: string;   // ISO Date YYYY-MM-DD
  created_at: string;
  updated_at: string;
}

export type CreateProjectPayload = Omit<Project, 'id' | 'created_at' | 'updated_at'>;
export type UpdateProjectPayload = Partial<CreateProjectPayload>;

export interface ApiValidationError {
  [key: string]: string[];
}