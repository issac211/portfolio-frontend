import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "../config/constants";
import {
  deleteProfile,
  deleteProfileImage,
  getProfile,
  uploadProfileImage,
  upsertProfile,
} from "../services/profileService";
import type { ApiError } from "../types/api";
import type {
  PersonalInfoCreate,
  PersonalInfoResponse,
  PersonalInfoUpdate,
} from "../types/profile";

/** Values exposed by the `useProfile` hook. */
export interface UseProfileReturn {
  profile: PersonalInfoResponse | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<PersonalInfoResponse | null>;
}

/**
 * Custom hook to fetch and manage public developer profile data via React Query.
 *
 * Automatically deduplicates requests, caches the profile across all consumers
 * (Navbar, Footer, Hero, Dashboard), and provides automatic background revalidation.
 */
export function useProfile(): UseProfileReturn {
  const { data, isLoading, error, refetch } = useQuery<
    PersonalInfoResponse | null,
    ApiError
  >({
    queryKey: QUERY_KEYS.profile,
    queryFn: getProfile,
  });

  const handleRefetch = async (): Promise<PersonalInfoResponse | null> => {
    const result = await refetch();
    return result.data ?? null;
  };

  const errorMessage = error ? error.message || "Failed to load profile" : null;

  return {
    profile: data ?? null,
    isLoading,
    error: errorMessage,
    refetch: handleRefetch,
  };
}

/**
 * Mutation hook for creating/updating the profile, invalidating QUERY_KEYS.profile on success.
 */
export function useUpsertProfileMutation() {
  const queryClient = useQueryClient();
  return useMutation<
    PersonalInfoResponse,
    ApiError,
    PersonalInfoCreate | PersonalInfoUpdate
  >({
    mutationFn: (data: PersonalInfoCreate | PersonalInfoUpdate) =>
      upsertProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.profile });
    },
  });
}

/**
 * Mutation hook for uploading a profile image, invalidating QUERY_KEYS.profile on success.
 */
export function useUploadProfileImageMutation() {
  const queryClient = useQueryClient();
  return useMutation<PersonalInfoResponse, ApiError, File>({
    mutationFn: (file: File) => uploadProfileImage(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.profile });
    },
  });
}

/**
 * Mutation hook for deleting the profile image, invalidating QUERY_KEYS.profile on success.
 */
export function useDeleteProfileImageMutation() {
  const queryClient = useQueryClient();
  return useMutation<void, ApiError, void>({
    mutationFn: () => deleteProfileImage(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.profile });
    },
  });
}

/**
 * Mutation hook for soft-deleting the profile, invalidating QUERY_KEYS.profile on success.
 */
export function useDeleteProfileMutation() {
  const queryClient = useQueryClient();
  return useMutation<void, ApiError, void>({
    mutationFn: () => deleteProfile(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.profile });
    },
  });
}


