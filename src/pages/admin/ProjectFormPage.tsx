import {
  useState,
  useEffect,
  useMemo,
  type SubmitEvent,
  type ChangeEvent,
} from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  getProject,
  createProject,
  updateProject,
  uploadProjectImage,
} from "../../services/projectService";
import { useToast } from "../../context/ToastContext";
import { IMAGE_BASE_URL } from "../../config/constants";
import { ImageIcon } from "../../components/ui/icons";
import { Input } from "../../components/ui/Input";
import { Card, CardHeader, CardBody } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { ProjectFormSkeleton } from "../../components/ui/Skeleton";
import type { ApiError } from "../../types/api";

/**
 * Administrative project creation and editing page.
 *
 * Automatically detects edit vs. create mode via route params, manages
 * controlled form fields, parses tech stack tags, handles media file
 * selection with preview, and coordinates multipart image uploads
 * following entity persistence.
 */
export function ProjectFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const isEditMode = Boolean(id);
  const projectId = id ? Number(id) : null;

  // Form fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [liveUrl, setLiveUrl] = useState("");
  const [techStackInput, setTechStackInput] = useState("");
  const [displayOrder, setDisplayOrder] = useState("");

  // Media state
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Status & loading state
  const [isLoadingProject, setIsLoadingProject] = useState(isEditMode);
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Only used for 422 inline validation summary — system errors surface as toasts
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Fetch initial project data in edit mode
  useEffect(() => {
    if (!isEditMode || !projectId) return;

    if (Number.isNaN(projectId)) {
      setErrorMessage("Invalid project ID provided in URL.");
      setIsLoadingProject(false);
      return;
    }

    let isMounted = true;
    setIsLoadingProject(true);
    setErrorMessage(null);

    getProject(projectId)
      .then((project) => {
        if (isMounted) {
          setTitle(project.title || "");
          setDescription(project.description || "");
          setGithubUrl(project.github_url || "");
          setLiveUrl(project.live_url || "");
          setTechStackInput(
            project.tech_stack ? project.tech_stack.join(", ") : ""
          );
          setDisplayOrder(
            project.display_order !== null && project.display_order !== undefined
              ? String(project.display_order)
              : ""
          );
          setExistingImageUrl(project.image_url || null);
        }
      })
      .catch((err: ApiError | Error) => {
        if (isMounted) {
          // Load failure is unexpected — no inline surface exists for it
          addToast({ message: err.message || "Failed to load project details.", variant: "error" });
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoadingProject(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [isEditMode, projectId]);

  // Clean up Blob preview URLs to prevent memory leaks
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  // Parse comma-separated tech stack for real-time chip previews
  const techStackChips = useMemo(() => {
    return techStackInput
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);
  }, [techStackInput]);

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) {
      setSelectedFile(null);
      setPreviewUrl(null);
      return;
    }

    if (!file.type.startsWith("image/")) {
      addToast({ message: "Selected file must be an image (PNG, JPG, WebP, etc.).", variant: "error" });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      addToast({ message: "Image file size must not exceed 5MB.", variant: "error" });
      return;
    }

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
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
    if (!description.trim()) {
      errors.description = "Project description is required.";
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
      description: description.trim(),
      github_url: githubUrl.trim() || null,
      live_url: liveUrl.trim() || null,
      tech_stack: techStackChips.length > 0 ? techStackChips : null,
      display_order:
        parsedOrder !== null && !Number.isNaN(parsedOrder)
          ? parsedOrder
          : null,
    };

    try {
      if (isEditMode && projectId) {
        await updateProject(projectId, payload);
        if (selectedFile) {
          await uploadProjectImage(projectId, selectedFile);
        }
        addToast({ message: "Project updated successfully.", variant: "success" });
      } else {
        const created = await createProject(payload);
        if (selectedFile) {
          await uploadProjectImage(created.id, selectedFile);
        }
        addToast({ message: "Project created successfully.", variant: "success" });
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
          message: apiErr.message || (isEditMode ? "Failed to update project." : "Failed to create project."),
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
                      {selectedFile ? "Replace Selected File" : "Choose Project Image"}
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
                    Core informational fields displayed on card and detail views.
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

                  {/* Description */}
                  <Input
                    as="textarea"
                    label="Description"
                    required
                    rows={5}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    error={fieldErrors.description}
                    placeholder="Provide an overview of the system architecture, business challenge, and solution..."
                  />

                  {/* Tech Stack Input & Live Preview */}
                  <div>
                    <Input
                      label="Technology Stack"
                      value={techStackInput}
                      onChange={(e) => setTechStackInput(e.target.value)}
                      placeholder="e.g., React, TypeScript, Tailwind, FastAPI, PostgreSQL"
                      helperText="Separate technologies with commas."
                    />

                    {/* Live Chip Preview */}
                    {techStackChips.length > 0 && (
                      <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                        <span className="text-xs text-gray-400">Preview:</span>
                        {techStackChips.map((tech) => (
                          <span
                            key={tech}
                            className="inline-flex items-center rounded-md bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700 ring-1 ring-blue-700/10 ring-inset"
                          >
                            {tech}
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
              <div className="flex items-center justify-end gap-3">
                <Link
                  to="/admin"
                  className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-xs hover:bg-gray-50"
                >
                  Cancel
                </Link>
                <Button
                  type="submit"
                  variant="primary"
                  isLoading={isSubmitting}
                >
                  {isEditMode ? "Save Changes" : "Create Project"}
                </Button>
              </div>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
