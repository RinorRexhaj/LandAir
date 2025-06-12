export interface Project {
  id: number;
  created_at: Date;
  user_id: string;
  project_name: string;
  last_edited: Date;
  created?: boolean;
  file?: string;
  url?: string;
}
