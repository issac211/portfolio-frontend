/** Allowed status indicator values matching backend Literal enum. */
export type StatusIndicator =
  | "success"
  | "warning"
  | "error"
  | "neutral"
  | null;

/** Non-null status indicator keys used for styling and lookup mappings. */
export type ActiveStatusIndicator = Exclude<StatusIndicator, null>;

/** Profile data returned by `GET /profile/`. `image_url` is either a relative path or an absolute Cloudinary URL — resolve via `getImageUrl`. */
export interface PersonalInfoResponse {
  id: number;
  first_name: string;
  last_name: string;
  birth_date: string | null;
  bio: string | null;
  hero_title: string | null;
  availability_status: string | null;
  short_bio: string | null;
  github_url: string | null;
  linkedin_url: string | null;
  email: string | null;
  status_indicator: StatusIndicator;
  image_url: string | null;
  is_active: boolean;
}

/** Payload for creating a profile (`PUT /profile/`). */
export interface PersonalInfoCreate {
  first_name: string;
  last_name: string;
  birth_date?: string | null;
  bio?: string | null;
  hero_title?: string | null;
  availability_status?: string | null;
  short_bio?: string | null;
  github_url?: string | null;
  linkedin_url?: string | null;
  email?: string | null;
  status_indicator?: StatusIndicator;
}

/** Partial update payload for the profile (`PUT /profile/`). All fields optional. */
export interface PersonalInfoUpdate {
  first_name?: string | null;
  last_name?: string | null;
  birth_date?: string | null;
  bio?: string | null;
  hero_title?: string | null;
  availability_status?: string | null;
  short_bio?: string | null;
  github_url?: string | null;
  linkedin_url?: string | null;
  email?: string | null;
  status_indicator?: StatusIndicator;
}

