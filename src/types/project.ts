/**
 * Project Types
 * Derived from: api-contract.json → ProjectResponse, ProjectCreate, ProjectUpdate
 *
 * Note: image_url is a relative path from the API (e.g., "/uploads/projects/img.jpg").
 * The component layer must prepend IMAGE_BASE_URL to render it.
 */

export interface ProjectResponse {
  id: number;
  title: string;
  description: string;
  github_url: string | null;
  live_url: string | null;
  tech_stack: string[] | null;
  display_order: number | null;
  image_url: string | null;
}

export interface ProjectCreate {
  title: string;
  description: string;
  github_url?: string | null;
  live_url?: string | null;
  tech_stack?: string[] | null;
  display_order?: number | null;
}

export interface ProjectUpdate {
  title?: string | null;
  description?: string | null;
  github_url?: string | null;
  live_url?: string | null;
  tech_stack?: string[] | null;
  display_order?: number | null;
}
