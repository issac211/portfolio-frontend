import MDEditor from "@uiw/react-md-editor";
import {
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
  type SubmitEvent,
} from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ConfirmDeleteModal } from "../../components/admin/ConfirmDeleteModal";
import { Button } from "../../components/ui/Button";
import { Card, CardBody, CardHeader } from "../../components/ui/Card";
import {
  ExternalLinkIcon,
  ImageIcon,
  TrashIcon,
} from "../../components/ui/icons";
import { Input } from "../../components/ui/Input";
import { ProjectFormSkeleton } from "../../components/ui/Skeleton";
import { IMAGE_BASE_URL } from "../../config/constants";
import { useToast } from "../../context/ToastContext";
import {
  useCreateProjectMutation,
  useDeleteProjectImageMutation,
  useDeleteProjectMutation,
  useProject,
  useUpdateProjectMutation,
  useUploadProjectImageMutation,
} from "../../hooks/useProjects";
import { useSEO } from "../../hooks/useSEO";
import type { ApiError } from "../../types/api";

/**
 * Administrative project creation and editing page.
 *
 * Utilizes the Keyed Component pattern (`key={id ?? "new"}`) to guarantee that navigating
 * between edit mode and creation mode (or between different projects) unmounts the previous
 * instance and completely resets all form state, media previews, and validation errors.
 */
export function ProjectFormPage() {
  const { id } = useParams<{ id: string }>();
  return <ProjectFormContent key={id ?? "new"} />;
}

function ProjectFormContent() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const createMutation = useCreateProjectMutation();
  const updateMutation = useUpdateProjectMutation();
  const deleteProjectMutation = useDeleteProjectMutation();
  const deleteImageMutation = useDeleteProjectImageMutation();
  const uploadImageMutation = useUploadProjectImageMutation();

  const isEditMode = Boolean(id);
  const projectId = id ? Number(id) : null;
  const isInvalidId = isEditMode && (!projectId || Number.isNaN(projectId));

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useSEO({
    title: isEditMode ? "Edit Project" : "New Project",
    description: isEditMode
      ? "Modify project metadata, tags, and media."
      : "Create and publish a new project showcase.",
  });

  // Form fields
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [liveUrl, setLiveUrl] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [displayOrder, setDisplayOrder] = useState("");

  // Media state
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Status & loading state
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Only used for 422 inline validation summary — system errors surface as toasts
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Query project via React Query in edit mode
  const {
    data: project,
    isLoading: isQueryLoading,
    error: queryError,
  } = useProject(isEditMode && !isInvalidId ? projectId : null);

  const isLoadingProject = isEditMode && isQueryLoading;

  useEffect(() => {
    if (isInvalidId) {
      // Architectural decision: Accept cascading render for initial client-side validation
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setErrorMessage("Invalid project ID provided in URL.");
    }
  }, [isInvalidId]);

  useEffect(() => {
    if (queryError) {
      addToast({
        message: queryError.message || "Failed to load project details.",
        variant: "error",
      });
    }
  }, [queryError, addToast]);

  useEffect(() => {
    if (project) {
      // Architectural decision: Accept cascading render for initial client-side fetching
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTitle(project.title || "");
      setSummary(project.summary || "");
      setContent(project.content || "");
      setGithubUrl(project.github_url || "");
      setLiveUrl(project.live_url || "");
      setTagsInput(project.tags ? project.tags.join(", ") : "");
      setDisplayOrder(
        project.display_order !== null && project.display_order !== undefined
          ? String(project.display_order)
          : "",
      );
      setExistingImageUrl(project.image_url || null);
    }
  }, [project]);

  // Clean up Blob preview URLs to prevent memory leaks
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  // Parse comma-separated tags for real-time chip previews
  const tagChips = useMemo(() => {
    return tagsInput
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);
  }, [tagsInput]);

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) {
      setSelectedFile(null);
      setPreviewUrl(null);
      return;
    }

    if (!file.type.startsWith("image/")) {
      addToast({
        message: "Selected file must be an image (PNG, JPG, WebP, etc.).",
        variant: "error",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      addToast({
        message: "Image file size must not exceed 5MB.",
        variant: "error",
      });
      return;
    }

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  }

  async function handleDeleteImage() {
    if (!isEditMode || !projectId) return;

    if (
      !window.confirm("Are you sure you want to remove this project image?")
    ) {
      return;
    }

    try {
      await deleteImageMutation.mutateAsync(projectId);
      setExistingImageUrl(null);
      setSelectedFile(null);
      setPreviewUrl(null);
      addToast({
        message: "Project image removed successfully.",
        variant: "success",
      });
    } catch (err) {
      const apiErr = err as ApiError;
      addToast({
        message: apiErr.message || "Failed to remove project image.",
        variant: "error",
      });
    }
  }

  async function handleDeleteProject() {
    if (!projectId) return;

    try {
      await deleteProjectMutation.mutateAsync(projectId);
      addToast({
        message: `Project "${title || "Project"}" deleted successfully.`,
        variant: "success",
      });
      navigate("/admin");
    } catch (err) {
      const apiErr = err as ApiError;
      addToast({
        message: apiErr.message || "Failed to delete project.",
        variant: "error",
      });
    } finally {
      setIsDeleteModalOpen(false);
    }
  }

  async function handleSubmit(e: SubmitEvent) {
    e.preventDefault();

    setErrorMessage(null);
    setFieldErrors({});

    // Client-side validation guard
    const errors: Record<string, string> = {};
    if (!title.trim()) {
      errors.title = "Project title is required.";
    }
    if (!summary.trim()) {
      errors.summary = "Project summary is required.";
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setIsSubmitting(true);

    const parsedOrder =
      displayOrder.trim() !== "" ? Number(displayOrder) : null;

    const payload = {
      title: title.trim(),
      summary: summary.trim(),
      content: content.trim() || null,
      github_url: githubUrl.trim() || null,
      live_url: liveUrl.trim() || null,
      tags: tagChips.length > 0 ? tagChips : null,
      display_order:
        parsedOrder !== null && !Number.isNaN(parsedOrder) ? parsedOrder : null,
    };

    try {
      if (isEditMode && projectId) {
        await updateMutation.mutateAsync({ id: projectId, data: payload });
        if (selectedFile) {
          await uploadImageMutation.mutateAsync({
            id: projectId,
            file: selectedFile,
          });
        }
        addToast({
          message: "Project updated successfully.",
          variant: "success",
        });
      } else {
        const created = await createMutation.mutateAsync(payload);
        if (selectedFile) {
          await uploadImageMutation.mutateAsync({
            id: created.id,
            file: selectedFile,
          });
        }
        addToast({
          message: "Project created successfully.",
          variant: "success",
        });
      }

      navigate("/admin");
    } catch (err) {
      const apiErr = err as ApiError;

      // 422 validation errors — map to inline field errors and show summary
      if (apiErr.validationErrors && apiErr.validationErrors.length > 0) {
        setErrorMessage(apiErr.message || "Please fix the errors below.");
        const mappedErrors: Record<string, string> = {};
        for (const vErr of apiErr.validationErrors) {
          const field = vErr.loc[vErr.loc.length - 1];
          if (typeof field === "string") {
            mappedErrors[field] = vErr.msg;
          }
        }
        setFieldErrors(mappedErrors);
      } else {
        // System/network failure — no inline surface; surface globally
        addToast({
          message:
            apiErr.message ||
            (isEditMode
              ? "Failed to update project."
              : "Failed to create project."),
          variant: "error",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  const currentMediaUrl = previewUrl
    ? previewUrl
    : existingImageUrl
      ? `${IMAGE_BASE_URL}${existingImageUrl}`
      : null;

  return (
    <div className="space-y-8 pb-12">
      {/* ── Header & Breadcrumb ── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
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
            {isEditMode ? "Edit Project" : "Create New Project"}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {isEditMode
              ? "Modify project metadata, external links, and preview imagery."
              : "Add a new engineering showcase project to your portfolio."}
          </p>
        </div>

        {isEditMode && projectId && (
          <div className="flex flex-wrap items-center gap-2.5 shrink-0 self-start">
            <Link
              to={`/projects/${projectId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-xs font-semibold text-gray-700 shadow-xs transition-colors hover:bg-gray-50 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              title="View public project page in a new tab"
            >
              <span>View Public Page</span>
              <ExternalLinkIcon className="h-3.5 w-3.5 text-gray-500" />
            </Link>
          </div>
        )}
      </div>

      {isLoadingProject ? (
        <div className="py-4">
          <ProjectFormSkeleton />
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Inline 422 validation summary banner */}
          {errorMessage && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
              <p className="font-semibold">Please fix the following errors</p>
              <p className="mt-0.5 text-red-700">{errorMessage}</p>
            </div>
          )}

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            {/* ── Left Column: Media Preview & Image Upload ── */}
            <div className="lg:col-span-4">
              <Card>
                <CardHeader>
                  <h2 className="text-base font-semibold text-gray-900">
                    Project Preview Media
                  </h2>
                  <p className="mt-0.5 text-xs text-gray-500">
                    Aspect ratio 16:9 recommended (JPG, PNG, or WebP).
                  </p>
                </CardHeader>
                <CardBody className="p-5">
                  {/* 16:9 Image Preview Box */}
                  <div className="relative mb-4 aspect-video w-full overflow-hidden rounded-lg border border-gray-200 bg-gray-50 shadow-inner">
                    {currentMediaUrl ? (
                      <img
                        src={currentMediaUrl}
                        alt="Project media preview"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full flex-col items-center justify-center text-gray-400">
                        <ImageIcon className="h-10 w-10 text-gray-300" />
                        <span className="mt-1 text-xs">No image chosen</span>
                      </div>
                    )}
                  </div>

                  {/* File Upload Trigger */}
                  <label className="w-full cursor-pointer">
                    <span className="inline-flex w-full items-center justify-center rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-xs font-semibold text-gray-700 shadow-xs transition-colors hover:bg-gray-50">
                      {selectedFile
                        ? "Replace Selected File"
                        : "Choose Project Image"}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="sr-only"
                    />
                  </label>

                  {selectedFile && (
                    <p className="mt-2 truncate text-center text-xs text-gray-500">
                      Selected: {selectedFile.name}
                    </p>
                  )}

                  {/* Remove Existing Project Image */}
                  {isEditMode && existingImageUrl && !selectedFile && (
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
                        <span>Remove Image</span>
                      </Button>
                    </div>
                  )}
                </CardBody>
              </Card>
            </div>

            {/* ── Right Column: Project Details ── */}
            <div className="space-y-6 lg:col-span-8">
              <Card>
                <CardHeader>
                  <h2 className="text-base font-semibold text-gray-900">
                    Project Details
                  </h2>
                  <p className="mt-0.5 text-xs text-gray-500">
                    Core informational fields displayed on card and detail
                    views.
                  </p>
                </CardHeader>
                <CardBody className="space-y-5 p-6">
                  {/* Title */}
                  <Input
                    label="Project Title"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    error={fieldErrors.title}
                    placeholder="e.g., Cloud-Native Analytics Engine"
                  />

                  {/* Summary */}
                  <Input
                    as="textarea"
                    label="Summary"
                    required
                    rows={3}
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    error={fieldErrors.summary}
                    placeholder="Concise overview displayed on the portfolio project card (max 300 characters)..."
                    helperText="Brief summary displayed on project cards in the public grid."
                  />

                  {/* Content / Full Write-up (Rich Markdown Editor) */}
                  <div className="space-y-1.5" data-color-mode="light">
                    <div className="flex items-center justify-between">
                      <label className="block text-sm font-medium text-gray-700">
                        Detailed Content (Full Write-up — Markdown)
                      </label>
                      <span className="text-xs text-gray-400">
                        Supports GFM (tables, code blocks, lists, links)
                      </span>
                    </div>

                    <div className="overflow-hidden rounded-lg border border-gray-300 shadow-2xs transition-all focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20">
                      <MDEditor
                        value={content}
                        onChange={(val) => setContent(val || "")}
                        height={350}
                        preview="live"
                      />
                    </div>

                    {fieldErrors.content ? (
                      <p className="text-xs font-medium text-red-600">
                        {fieldErrors.content}
                      </p>
                    ) : (
                      <p className="text-xs text-gray-500">
                        Full project case study displayed on the detail page
                        with rich Markdown formatting.
                      </p>
                    )}
                  </div>

                  {/* Tags Input & Live Preview */}
                  <div>
                    <Input
                      label="Tags"
                      value={tagsInput}
                      onChange={(e) => setTagsInput(e.target.value)}
                      placeholder="e.g., React, TypeScript, FastAPI, Open Source, WIP"
                      helperText="Separate tags with commas. Use them for technologies, categories, or status labels."
                    />

                    {/* Live Chip Preview */}
                    {tagChips.length > 0 && (
                      <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                        <span className="text-xs text-gray-400">Preview:</span>
                        {tagChips.map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center rounded-md bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700 ring-1 ring-blue-700/10 ring-inset"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* URLs & Display Order Grid */}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Input
                      type="url"
                      label="GitHub Repository URL"
                      value={githubUrl}
                      onChange={(e) => setGithubUrl(e.target.value)}
                      placeholder="https://github.com/..."
                    />

                    <Input
                      type="url"
                      label="Live Demonstration URL"
                      value={liveUrl}
                      onChange={(e) => setLiveUrl(e.target.value)}
                      placeholder="https://my-app.example.com"
                    />
                  </div>

                  {/* Display Order */}
                  <div className="max-w-xs">
                    <Input
                      type="number"
                      label="Display Order"
                      value={displayOrder}
                      onChange={(e) => setDisplayOrder(e.target.value)}
                      placeholder="e.g., 1, 2, 3..."
                      helperText="Lower numbers appear first in the portfolio grid."
                    />
                  </div>
                </CardBody>
              </Card>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                {isEditMode && projectId ? (
                  <Link
                    to={`/projects/${projectId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-xs font-semibold text-gray-700 shadow-xs transition-colors hover:bg-gray-50 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    title="View public project page in a new tab"
                  >
                    <span>View Public Page</span>
                    <ExternalLinkIcon className="h-3.5 w-3.5 text-gray-500" />
                  </Link>
                ) : (
                  <div />
                )}

                <div className="flex items-center gap-3">
                  <Link
                    to="/admin"
                    className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-xs hover:bg-gray-50"
                  >
                    Cancel
                  </Link>
                  <Button
                    type="submit"
                    variant="primary"
                    isLoading={
                      isSubmitting ||
                      createMutation.isPending ||
                      updateMutation.isPending ||
                      uploadImageMutation.isPending
                    }
                  >
                    {isEditMode ? "Save Changes" : "Create Project"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </form>
      )}

      {/* ── Danger Zone: Delete Project ── */}
      {isEditMode && projectId && (
        <div className="rounded-xl border border-red-200 bg-red-50/40 p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-base font-semibold text-red-900">
                Danger Zone: Delete Project
              </h3>
              <p className="mt-1 text-sm text-red-700">
                Permanently delete this project from your portfolio. This action
                cannot be undone.
              </p>
            </div>
            <Button
              type="button"
              variant="danger"
              onClick={() => setIsDeleteModalOpen(true)}
            >
              <TrashIcon className="h-4 w-4" />
              <span>Delete Project</span>
            </Button>
          </div>
        </div>
      )}

      {/* ── Confirm Delete Modal ── */}
      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        title={`Delete "${title || "Project"}"`}
        description={
          <>
            Are you sure you want to delete{" "}
            <strong>{title || "this project"}</strong>? This will permanently
            remove the showcase and all associated media from your portfolio.
            This action cannot be undone.
          </>
        }
        confirmButtonText="Delete Project"
        isLoading={deleteProjectMutation.isPending}
        onConfirm={handleDeleteProject}
        onClose={() => setIsDeleteModalOpen(false)}
      />
    </div>
  );
}
