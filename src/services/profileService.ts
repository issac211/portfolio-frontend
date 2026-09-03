import { apiRequest } from "./apiClient";
import type { PersonalInfoResponse, PersonalInfoCreate, PersonalInfoUpdate } from "../types/profile";

/** Fetches the public profile. No auth required. */
export async function getProfile(): Promise<PersonalInfoResponse> {
  return apiRequest<PersonalInfoResponse>("/profile/");
}

/** Creates or updates the profile (upsert). Auth required. */
export async function upsertProfile(
  data: PersonalInfoCreate | PersonalInfoUpdate
): Promise<PersonalInfoResponse> {
  return apiRequest<PersonalInfoResponse>("/profile/", {
    method: "PUT",
    body: data,
  });
}

/** Uploads a profile image via FormData. Auth required. */
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
