import { useEffect, useState, type ChangeEvent, type SubmitEvent } from "react";
import { Link } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { Card, CardBody, CardHeader } from "../../components/ui/Card";
import { UserIcon } from "../../components/ui/icons";
import { Input } from "../../components/ui/Input";
import { ProfileFormSkeleton } from "../../components/ui/Skeleton";
import { IMAGE_BASE_URL } from "../../config/constants";
import { useToast } from "../../context/ToastContext";
import { useProfile } from "../../hooks/useProfile";
import { useSEO } from "../../hooks/useSEO";
import {
  uploadProfileImage,
  upsertProfile,
} from "../../services/profileService";
import type { ApiError } from "../../types/api";

/**
 * Administrative profile management page.
 *
 * Provides a dual-panel workflow allowing administrators to update core
 * personal details (name, birth date, bio) via upsert API semantics,
 * and upload high-resolution profile imagery via multipart FormData.
 */
export function ProfileFormPage() {
  const { profile, isLoading: isProfileLoading, refetch } = useProfile();
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

  // Submission & feedback state
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Image upload state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);

  // Synchronize controlled form inputs once profile data arrives
  useEffect(() => {
    if (profile) {
      // Architectural decision: Accept cascading render for initial client-side fetching
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFirstName(profile.first_name || "");
      setLastName(profile.last_name || "");
      setBirthDate(profile.birth_date ? profile.birth_date.split("T")[0] : "");
      setBio(profile.bio || "");
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

    setIsUploadingImage(true);
    setImageError(null);

    try {
      await uploadProfileImage(selectedFile);
      addToast({
        message: "Profile photo uploaded successfully!",
        variant: "success",
      });
      setSelectedFile(null);
      setPreviewUrl(null);
      await refetch();
    } catch (err) {
      const apiErr = err as ApiError;
      setImageError(apiErr.message || "Failed to upload profile photo.");
    } finally {
      setIsUploadingImage(false);
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

    setIsSaving(true);

    try {
      await upsertProfile({
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        birth_date: birthDate || null,
        bio: bio.trim() || null,
      });

      addToast({
        message: "Profile details saved successfully!",
        variant: "success",
      });
      await refetch();
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
    } finally {
      setIsSaving(false);
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
                      isLoading={isUploadingImage}
                      onClick={handleImageUpload}
                    >
                      Upload Selected Photo
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

                  {/* Birth Date */}
                  <Input
                    type="date"
                    label="Birth Date"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    helperText="Optional. Used to calculate years of experience or age if desired."
                  />

                  {/* Professional Biography */}
                  <Input
                    as="textarea"
                    label="Professional Bio"
                    rows={5}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Describe your engineering focus, experience, and core technologies..."
                    helperText="Markdown or clean paragraph text describing your background."
                  />

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
                      isLoading={isSaving}
                    >
                      Save Profile Changes
                    </Button>
                  </div>
                </form>
              </CardBody>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
