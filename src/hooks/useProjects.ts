import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "../config/constants";
import {
  createProject,
  deleteProject,
  deleteProjectImage,
  getAllProjects,
  updateProject,
} from "../services/projectService";
import type { ApiError } from "../types/api";
import type {
  ProjectCreate,
  ProjectResponse,
  ProjectUpdate,
} from "../types/project";

/** Return value contract for the `useProjects` hook. */
export interface UseProjectsReturn {
  projects: ProjectResponse[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<ProjectResponse[]>;
}

/**
 * Custom hook for fetching and managing public portfolio projects via React Query.
 *
 * Automatically caches the projects collection, eliminates redundant network calls across
 * pages, and exposes a refetch callback backed by the centralized query client.
 */
export function useProjects(): UseProjectsReturn {
  const { data, isLoading, error, refetch } = useQuery<
    ProjectResponse[],
    ApiError
  >({
    queryKey: QUERY_KEYS.projects,
    queryFn: getAllProjects,
  });

  const handleRefetch = async (): Promise<ProjectResponse[]> => {
    const result = await refetch();
    return result.data ?? [];
  };

  const errorMessage = error ? error.message || "Failed to load projects" : null;

  return {
    projects: data ?? [],
    isLoading,
    error: errorMessage,
    refetch: handleRefetch,
  };
}

/**
 * Mutation hook for creating a project, invalidating QUERY_KEYS.projects on success.
 */
export function useCreateProjectMutation() {
  const queryClient = useQueryClient();
  return useMutation<ProjectResponse, ApiError, ProjectCreate>({
    mutationFn: (data: ProjectCreate) => createProject(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.projects });
    },
  });
}

/**
 * Mutation hook for updating a project, invalidating QUERY_KEYS.projects on success.
 */
export function useUpdateProjectMutation() {
  const queryClient = useQueryClient();
  return useMutation<
    ProjectResponse,
    ApiError,
    { id: number; data: ProjectUpdate }
  >({
    mutationFn: ({ id, data }) => updateProject(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.projects });
    },
  });
}

/**
 * Mutation hook for deleting a project, invalidating QUERY_KEYS.projects on success.
 */
export function useDeleteProjectMutation() {
  const queryClient = useQueryClient();
  return useMutation<void, ApiError, number>({
    mutationFn: (id: number) => deleteProject(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.projects });
    },
  });
}

/**
 * Mutation hook for deleting a project image, invalidating QUERY_KEYS.projects on success.
 */
export function useDeleteProjectImageMutation() {
  const queryClient = useQueryClient();
  return useMutation<void, ApiError, number>({
    mutationFn: (id: number) => deleteProjectImage(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.projects });
    },
  });
}

