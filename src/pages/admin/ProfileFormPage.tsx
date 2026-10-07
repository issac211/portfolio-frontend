import { useEffect, useState, type ChangeEvent, type SubmitEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ConfirmDeleteModal } from "../../components/admin/ConfirmDeleteModal";
import { Button } from "../../components/ui/Button";
import { Card, CardBody, CardHeader } from "../../components/ui/Card";
import { TrashIcon, UserIcon } from "../../components/ui/icons";
import { Input } from "../../components/ui/Input";
import { ProfileFormSkeleton } from "../../components/ui/Skeleton";
import { IMAGE_BASE_URL } from "../../config/constants";
import { useToast } from "../../context/ToastContext";
import {
  useDeleteProfileImageMutation,
  useDeleteProfileMutation,
  useProfile,
  useUpsertProfileMutation,
  useUploadProfileImageMutation,
} from "../../hooks/useProfile";
import { useSEO } from "../../hooks/useSEO";
import type { ApiError } from "../../types/api";
import type { StatusIndicator } from "../../types/profile";

/**
 * Administrative profile management page.
 *
 * Provides a dual-panel workflow allowing administrators to update core
 * personal details, hero headlines, availability status, social links, and bio
 * via upsert API semantics, and upload high-resolution profile imagery via multipart FormData.
 */
export function ProfileFormPage() {
  const navigate = useNavigate();
  const { profile, isLoading: isProfileLoading } = useProfile();
  const upsertMutation = useUpsertProfileMutation();
  const uploadImageMutation = useUploadProfileImageMutation();
  const deleteImageMutation = useDeleteProfileImageMutation();
  const deleteProfileMutation = useDeleteProfileMutation();
  const { addToast } = useToast();

  useSEO({
    title: "Edit Profile",
    description:
      "Update developer bio, personal information, and profile portrait.",
  });

  // Form field state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [bio, setBio] = useState("");
  const [heroTitle, setHeroTitle] = useState("");
  const [availabilityStatus, setAvailabilityStatus] = useState("");
  const [statusIndicator, setStatusIndicator] = useState<StatusIndicator>("neutral");
  const [shortBio, setShortBio] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [email, setEmail] = useState("");

  // Submission & feedback state
  const [saveError, setSaveError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Image upload state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);

  // Danger zone deletion state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Synchronize controlled form inputs once profile data arrives (with null coalescing)
  useEffect(() => {
    if (profile) {
      // Architectural decision: Accept cascading render for initial client-side fetching
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFirstName(profile.first_name ?? "");
      setLastName(profile.last_name ?? "");
      setBirthDate(profile.birth_date ? profile.birth_date.split("T")[0] : "");
      setBio(profile.bio ?? "");
      setHeroTitle(profile.hero_title ?? "");
      setAvailabilityStatus(profile.availability_status ?? "");
      setStatusIndicator(profile.status_indicator ?? "neutral");
      setShortBio(profile.short_bio ?? "");
      setGithubUrl(profile.github_url ?? "");
      setLinkedinUrl(profile.linkedin_url ?? "");
      setEmail(profile.email ?? "");
    }
  }, [profile]);

  // Clean up object URL when a new file is chosen or component unmounts
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    setImageError(null);

    const file = e.target.files?.[0];
    if (!file) {
      setSelectedFile(null);
      setPreviewUrl(null);
      return;
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setImageError("Selected file must be an image (PNG, JPG, WebP, etc.).");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setImageError("Image file size must not exceed 5MB.");
      return;
    }

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  }

  async function handleImageUpload() {
    if (!selectedFile) return;

    setImageError(null);

    try {
      await uploadImageMutation.mutateAsync(selectedFile);
      addToast({
        message: "Profile photo uploaded successfully!",
        variant: "success",
      });
      setSelectedFile(null);
      setPreviewUrl(null);
    } catch (err) {
      const apiErr = err as ApiError;
      setImageError(apiErr.message || "Failed to upload profile photo.");
    }
  }


  async function handleDeleteImage() {
    if (!window.confirm("Are you sure you want to remove your profile photo?")) {
      return;
    }

    setImageError(null);

    try {
      await deleteImageMutation.mutateAsync();
      setSelectedFile(null);
      setPreviewUrl(null);
      addToast({
        message: "Profile photo removed successfully.",
        variant: "success",
      });
    } catch (err) {
      const apiErr = err as ApiError;
      setImageError(apiErr.message || "Failed to remove profile photo.");
    }
  }

  async function handleDeleteProfile() {
    try {
      await deleteProfileMutation.mutateAsync();
      addToast({
        message: "Profile deleted successfully.",
        variant: "success",
      });
      setIsDeleteModalOpen(false);
      navigate("/admin");
    } catch (err) {
      const apiErr = err as ApiError;
      addToast({
        message: apiErr.message || "Failed to delete profile.",
        variant: "error",
      });
    }
  }

  async function handleSubmit(e: SubmitEvent) {
    e.preventDefault();

    setSaveError(null);
    setFieldErrors({});

    // Client-side validation guard
    const errors: Record<string, string> = {};
    if (!firstName.trim()) {
      errors.first_name = "First name is required.";
    }
    if (!lastName.trim()) {
      errors.last_name = "Last name is required.";
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    try {
      await upsertMutation.mutateAsync({
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        birth_date: birthDate || null,
        bio: bio.trim() || null,
        hero_title: heroTitle.trim() || null,
        availability_status: availabilityStatus.trim() || null,
        status_indicator: statusIndicator,
        short_bio: shortBio.trim() || null,
        github_url: githubUrl.trim() || null,
        linkedin_url: linkedinUrl.trim() || null,
        email: email.trim() || null,
      });

      addToast({
        message: "Profile details saved successfully!",
        variant: "success",
      });
    } catch (err) {
      const apiErr = err as ApiError;

      // 422 validation errors stay inline — anything else is a system/network failure
      if (apiErr.validationErrors && apiErr.validationErrors.length > 0) {
        setSaveError(apiErr.message || "Please fix the errors below.");
        const mappedErrors: Record<string, string> = {};
        for (const vErr of apiErr.validationErrors) {
          const field = vErr.loc[vErr.loc.length - 1];
          if (typeof field === "string") {
            mappedErrors[field] = vErr.msg;
          }
        }
        setFieldErrors(mappedErrors);
      } else {
        addToast({
          message: apiErr.message || "Failed to save profile changes.",
          variant: "error",
        });
      }
    }
  }

  const currentAvatarUrl = previewUrl
    ? previewUrl
    : profile?.image_url
      ? `${IMAGE_BASE_URL}${profile.image_url}`
      : null;

  return (
    <div className="space-y-8 pb-12">
      {/* ── Header ── */}
      <div>
        <nav aria-label="Breadcrumb" className="mb-2">
          <Link
            to="/admin"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-blue-600"
          >
            ← Back to Dashboard
          </Link>
        </nav>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
          Profile Settings
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Update your public personal information, professional biography, and
          portrait image.
        </p>
      </div>

      {isProfileLoading && !profile ? (
        <div className="py-4">
          <ProfileFormSkeleton />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* ── Left Column: Avatar Management ── */}
          <div className="lg:col-span-4">
            <Card>
              <CardHeader>
                <h2 className="text-base font-semibold text-gray-900">
                  Profile Photo
                </h2>
                <p className="mt-0.5 text-xs text-gray-500">
                  Upload a clean portrait image (JPG, PNG, or WebP).
                </p>
              </CardHeader>
              <CardBody className="flex flex-col items-center p-6 text-center">
                {/* Avatar Display */}
                <div className="relative mb-4 flex h-36 w-36 items-center justify-center overflow-hidden rounded-full border-4 border-gray-100 bg-gray-50 shadow-inner">
                  {currentAvatarUrl ? (
                    <img
                      src={currentAvatarUrl}
                      alt="Profile preview"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <UserIcon className="h-16 w-16 text-gray-300" />
                  )}
                </div>

                {imageError && (
                  <p className="mb-3 text-xs font-medium text-red-600">
                    {imageError}
                  </p>
                )}

                {/* File Input */}
                <label className="w-full cursor-pointer">
                  <span className="inline-flex w-full items-center justify-center rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-xs font-semibold text-gray-700 shadow-xs transition-colors hover:bg-gray-50">
                    {selectedFile ? "Choose Different Photo" : "Select Photo"}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="sr-only"
                  />
                </label>

                {selectedFile && (
                  <div className="mt-3 w-full">
                    <p className="mb-2 truncate text-xs text-gray-500">
                      {selectedFile.name}
                    </p>
                    <Button
                      variant="primary"
                      size="sm"
                      fullWidth
                      isLoading={uploadImageMutation.isPending}
                      onClick={handleImageUpload}
                    >
                      Upload Selected Photo
                    </Button>
                  </div>
                )}

                {/* Remove Existing Photo */}
                {profile?.image_url && !selectedFile && (
                  <div className="mt-3 w-full">
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      fullWidth
                      disabled={deleteImageMutation.isPending}
                      isLoading={deleteImageMutation.isPending}
                      onClick={handleDeleteImage}
                      className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                    >
                      <TrashIcon className="h-4 w-4 text-red-500" />
                      <span>Remove Photo</span>
                    </Button>
                  </div>
                )}
              </CardBody>
            </Card>
          </div>

          {/* ── Right Column: Personal Information Form ── */}
          <div className="lg:col-span-8">
            <Card>
              <CardHeader>
                <h2 className="text-base font-semibold text-gray-900">
                  Personal Details
                </h2>
                <p className="mt-0.5 text-xs text-gray-500">
                  These details will be publicly showcased in your portfolio's
                  Hero section.
                </p>
              </CardHeader>

              <CardBody className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Feedback Alerts */}
                  {saveError && (
                    <div className="rounded-lg border border-red-200 bg-red-50 p-3.5 text-sm text-red-800">
                      {saveError}
                    </div>
                  )}

                  {/* Name Fields (2 Columns) */}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Input
                      label="First Name"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      error={fieldErrors.first_name}
                      placeholder="e.g., John"
                    />

                    <Input
                      label="Last Name"
                      required
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      error={fieldErrors.last_name}
                      placeholder="e.g., Doe"
                    />
                  </div>

                  {/* Hero Title */}
                  <Input
                    label="Hero Headline Title"
                    value={heroTitle}
                    onChange={(e) => setHeroTitle(e.target.value)}
                    error={fieldErrors.hero_title}
                    placeholder="e.g., Building scalable, modern web applications"
                    helperText="Headline displayed in the Hero section. Use '|' to manually choose the gradient highlight (e.g. 'Engineering scalable | modern apps'), or leave as-is for auto-highlight."
                  />

                  {/* Availability Status & Status Indicator (2 Columns) */}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Input
                      label="Availability Status"
                      value={availabilityStatus}
                      onChange={(e) => setAvailabilityStatus(e.target.value)}
                      error={fieldErrors.availability_status}
                      placeholder="e.g., Available for new projects"
                      helperText="Text badge displayed in Hero and Footer."
                    />

                    <div className="flex flex-col">
                      <label
                        htmlFor="status_indicator"
                        className="mb-1.5 text-sm font-medium text-gray-700"
                      >
                        Status Indicator
                      </label>
                      <select
                        id="status_indicator"
                        value={statusIndicator ?? "neutral"}
                        onChange={(e) =>
                          setStatusIndicator(
                            (e.target.value as StatusIndicator) || null
                          )
                        }
                        className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 transition-colors focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                      >
                        <option value="success">Success (Green / Active)</option>
                        <option value="warning">Warning (Amber / Busy)</option>
                        <option value="error">Error (Red / Unavailable)</option>
                        <option value="neutral">Neutral (Gray)</option>
                      </select>
                      <p className="mt-1.5 text-xs text-gray-500">
                        Color dot displayed next to your availability badge.
                      </p>
                    </div>
                  </div>

                  {/* Short Bio / Tagline */}
                  <Input
                    as="textarea"
                    label="Short Bio / Tagline"
                    rows={2}
                    value={shortBio}
                    onChange={(e) => setShortBio(e.target.value)}
                    error={fieldErrors.short_bio}
                    placeholder="Brief tagline for the Hero and Footer..."
                    helperText="A concise 1-2 sentence introduction."
                  />

                  {/* Professional Biography */}
                  <Input
                    as="textarea"
                    label="Full Professional Bio"
                    rows={5}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    error={fieldErrors.bio}
                    placeholder="Describe your engineering focus, experience, and core technologies..."
                    helperText="Markdown or paragraph text describing your detailed background."
                  />

                  {/* Birth Date */}
                  <Input
                    type="date"
                    label="Birth Date"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    error={fieldErrors.birth_date}
                    helperText="Optional. Used to calculate years of experience or age if desired."
                  />

                  {/* Contact & Social Links Section */}
                  <div className="border-t border-gray-100 pt-6">
                    <h3 className="mb-4 text-sm font-semibold text-gray-900">
                      Contact &amp; Social Links
                    </h3>
                    <div className="space-y-4">
                      <Input
                        type="email"
                        label="Public Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        error={fieldErrors.email}
                        placeholder="e.g., contact@example.com"
                        helperText="Public contact email used for inquiries in the footer."
                      />
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <Input
                          type="url"
                          label="GitHub URL"
                          value={githubUrl}
                          onChange={(e) => setGithubUrl(e.target.value)}
                          error={fieldErrors.github_url}
                          placeholder="https://github.com/your-username"
                        />
                        <Input
                          type="url"
                          label="LinkedIn URL"
                          value={linkedinUrl}
                          onChange={(e) => setLinkedinUrl(e.target.value)}
                          error={fieldErrors.linkedin_url}
                          placeholder="https://linkedin.com/in/your-username"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Submit Action */}
                  <div className="flex items-center justify-end gap-3 pt-2">
                    <Link
                      to="/admin"
                      className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-xs hover:bg-gray-50"
                    >
                      Cancel
                    </Link>
                    <Button
                      type="submit"
                      variant="primary"
                      isLoading={upsertMutation.isPending}
                    >
                      Save Profile Changes
                    </Button>
                  </div>
                </form>
              </CardBody>
            </Card>
          </div>
        </div>

        {/* ── Danger Zone: Soft Delete Profile ── */}
        {profile && (
          <div className="mt-8 rounded-xl border border-red-200 bg-red-50/40 p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-base font-semibold text-red-900">
                  Danger Zone: Deactivate Profile
                </h3>
                <p className="mt-1 text-sm text-red-700">
                  Soft-delete your personal developer profile. This sets its status
                  to inactive and removes it from public views.
                </p>
              </div>
              <Button
                type="button"
                variant="danger"
                onClick={() => setIsDeleteModalOpen(true)}
              >
                Delete Profile
              </Button>
            </div>
          </div>
        )}

        {/* ── Confirm Delete Modal ── */}
        <ConfirmDeleteModal
          isOpen={isDeleteModalOpen}
          title="Delete Developer Profile"
          description="Are you sure you want to deactivate your developer profile? This action soft-deletes the profile by setting it inactive."
          confirmKeyword="DELETE"
          confirmButtonText="Deactivate Profile"
          isLoading={deleteProfileMutation.isPending}
          onConfirm={handleDeleteProfile}
          onClose={() => setIsDeleteModalOpen(false)}
        />
      </>
    )}
  </div>
);
}
