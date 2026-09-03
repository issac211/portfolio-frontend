/** Profile data returned by `GET /profile/`. `image_url` is a relative path — prepend `IMAGE_BASE_URL` to render. */
export interface PersonalInfoResponse {
  id: number;
  first_name: string;
  last_name: string;
  birth_date: string | null;
  bio: string | null;
  image_url: string | null;
}

/** Payload for creating a profile (`PUT /profile/`). */
export interface PersonalInfoCreate {
  first_name: string;
  last_name: string;
  birth_date?: string | null;
  bio?: string | null;
}

/** Partial update payload for the profile (`PUT /profile/`). All fields optional. */
export interface PersonalInfoUpdate {
  first_name?: string | null;
  last_name?: string | null;
  birth_date?: string | null;
  bio?: string | null;
}
