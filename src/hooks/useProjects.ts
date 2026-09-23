import { useCallback, useEffect, useState } from "react";
import { useToast } from "../context/ToastContext";
import { getAllProjects } from "../services/projectService";
import type { ApiError } from "../types/api";
import type { ProjectResponse } from "../types/project";

/** Return value contract for the `useProjects` hook. */
interface UseProjectsReturn {
  projects: ProjectResponse[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<ProjectResponse[]>;
}

/**
 * Custom hook for fetching and managing public portfolio projects.
 *
 * Automatically fetches all projects upon component mounting (ordered by the server),
 * tracks loading and error states, and exposes a stable `refetch` callback for data synchronization.
 */
export function useProjects(): UseProjectsReturn {
  const { addToast } = useToast();
  const [projects, setProjects] = useState<ProjectResponse[]>([]);
  // Initialized to true to prevent flash of empty list before initial fetch completes
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = useCallback(async (): Promise<ProjectResponse[]> => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await getAllProjects();
      setProjects(data);
      return data;
    } catch (err) {
      const apiError = err as ApiError;
      const message = apiError.message || "Failed to load projects";
      setError(message);
      addToast({ message, variant: "error" });
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    // Architectural decision: Accept cascading render for initial client-side fetching
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchProjects();
  }, [fetchProjects]);

  return { projects, isLoading, error, refetch: fetchProjects };
}
