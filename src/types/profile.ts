/**
 * Personal Info / Profile Types
 * Derived from: api-contract.json → PersonalInfoResponse, PersonalInfoCreate, PersonalInfoUpdate
 *
 * Note: image_url is a relative path from the API (e.g., "/uploads/profile/img.jpg").
 * The component layer must prepend IMAGE_BASE_URL to render it.
 */

export interface PersonalInfoResponse {
  id: number;
  first_name: string;
  last_name: string;
  birth_date: string | null;
  bio: string | null;
  image_url: string | null;
}

export interface PersonalInfoCreate {
  first_name: string;
  last_name: string;
  birth_date?: string | null;
  bio?: string | null;
}

export interface PersonalInfoUpdate {
  first_name?: string | null;
  last_name?: string | null;
  birth_date?: string | null;
  bio?: string | null;
}
