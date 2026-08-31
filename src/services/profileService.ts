/**
 * Profile Service
 *
 * Wraps all /profile endpoints. Uses apiRequest for consistent
 * auth headers and error handling.
 */

import { apiRequest } from "./apiClient";
import type { PersonalInfoResponse, PersonalInfoCreate, PersonalInfoUpdate } from "../types/profile";

/** Fetches the public profile. No auth required. */
export async function getProfile(): Promise<PersonalInfoResponse> {
  return apiRequest<PersonalInfoResponse>("/profile/");
}

/**
 * Creates or updates the profile (upsert).
 * Auth required — apiClient attaches the Bearer token automatically.
 */
export async function upsertProfile(
  data: PersonalInfoCreate | PersonalInfoUpdate
): Promise<PersonalInfoResponse> {
  return apiRequest<PersonalInfoResponse>("/profile/", {
    method: "PUT",
    body: data,
  });
}

/**
 * Uploads a profile image. Auth required.
 * Uses FormData — apiClient will NOT set Content-Type (browser handles it).
 */
export async function uploadProfileImage(
  file: File
): Promise<PersonalInfoResponse> {
  const formData = new FormData();
  formData.append("file", file);

  return apiRequest<PersonalInfoResponse>("/profile/upload-image", {
    method: "POST",
    body: formData,
  });
}
