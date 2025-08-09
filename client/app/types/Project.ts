export interface Project {
  id: string;
  created_at: Date;
  user_id: string;
  project_name: string;
  last_edited: Date;
  created?: boolean;
  file?: string;
  image?: string;
  url?: string;
}
