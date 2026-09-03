import { apiRequest } from "./apiClient";
import type { ProjectResponse, ProjectCreate, ProjectUpdate } from "../types/project";

/** Fetches all projects. No auth required. */
export async function getAllProjects(): Promise<ProjectResponse[]> {
  return apiRequest<ProjectResponse[]>("/projects/");
}

/** Fetches a single project by ID. No auth required. */
export async function getProject(id: number): Promise<ProjectResponse> {
  return apiRequest<ProjectResponse>(`/projects/${id}`);
}

/** Creates a new project. Auth required. */
export async function createProject(
  data: ProjectCreate
): Promise<ProjectResponse> {
  return apiRequest<ProjectResponse>("/projects/", {
    method: "POST",
    body: data,
  });
}

/** Partially updates an existing project. Auth required. */
export async function updateProject(
  id: number,
  data: ProjectUpdate
): Promise<ProjectResponse> {
  return apiRequest<ProjectResponse>(`/projects/${id}`, {
    method: "PATCH",
    body: data,
  });
}

/** Deletes a project. Auth required. */
export async function deleteProject(id: number): Promise<void> {
  return apiRequest<void>(`/projects/${id}`, {
    method: "DELETE",
  });
}

/** Uploads an image for a specific project via FormData. Auth required. */
export async function uploadProjectImage(
  id: number,
  file: File
): Promise<ProjectResponse> {
  const formData = new FormData();
  formData.append("file", file);

  return apiRequest<ProjectResponse>(`/projects/${id}/upload-image`, {
    method: "POST",
    body: formData,
  });
}
