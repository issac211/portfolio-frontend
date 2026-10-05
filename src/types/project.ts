/** Project data returned by the API. `image_url` is a relative path — prepend `IMAGE_BASE_URL` to render. */
export interface ProjectResponse {
  id: number;
  title: string;
  summary: string;
  content: string | null;
  github_url: string | null;
  live_url: string | null;
  tech_stack: string[] | null;
  tags?: string[] | null;
  display_order: number | null;
  image_url: string | null;
}

/** Payload for `POST /projects/`. */
export interface ProjectCreate {
  title: string;
  summary: string;
  content?: string | null;
  github_url?: string | null;
  live_url?: string | null;
  tech_stack?: string[] | null;
  tags?: string[] | null;
  display_order?: number | null;
}

/** Partial update payload for `PATCH /projects/:id`. All fields optional. */
export interface ProjectUpdate {
  title?: string | null;
  summary?: string | null;
  content?: string | null;
  github_url?: string | null;
  live_url?: string | null;
  tech_stack?: string[] | null;
  tags?: string[] | null;
  display_order?: number | null;
}

