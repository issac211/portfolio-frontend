import { useCallback, useEffect, useState } from "react";
import { useToast } from "../context/ToastContext";
import { getProfile } from "../services/profileService";
import type { ApiError } from "../types/api";
import type { PersonalInfoResponse } from "../types/profile";

/** Values exposed by the `useProfile` hook. */
interface UseProfileReturn {
  profile: PersonalInfoResponse | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<PersonalInfoResponse | null>;
}

/**
 * Custom hook to fetch and manage public developer profile data.
 *
 * Automatically fetches profile information upon component mounting,
 * tracks loading and error states, and provides a stable `refetch`
 * callback for on-demand synchronization after mutations.
 */
export function useProfile(): UseProfileReturn {
  const { addToast } = useToast();
  const [profile, setProfile] = useState<PersonalInfoResponse | null>(null);
  // Initialized to true to avoid flash of empty content prior to initial fetch
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile =
    useCallback(async (): Promise<PersonalInfoResponse | null> => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await getProfile();
        setProfile(data);
        return data;
      } catch (err) {
        const apiError = err as ApiError;
        const message = apiError.message || "Failed to load profile";
        setError(message);
        addToast({ message, variant: "error" });
        return null;
      } finally {
        setIsLoading(false);
      }
    }, [addToast]);

  useEffect(() => {
    // Architectural decision: Accept cascading render for initial client-side fetching
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchProfile();
  }, [fetchProfile]);

  return { profile, isLoading, error, refetch: fetchProfile };
}
