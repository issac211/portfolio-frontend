import {
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { Button } from "../ui/Button";
import { ExclamationCircleIcon, XIcon } from "../ui/icons";
import { Input } from "../ui/Input";

export interface ConfirmDeleteModalProps {
  /** Controls modal visibility. */
  isOpen: boolean;
  /** Modal dialog title. */
  title: string;
  /** Explanatory description of the destructive action. */
  description: ReactNode;
  /** Optional case-sensitive keyword that must be typed to enable the confirm button (e.g. "DELETE"). */
  confirmKeyword?: string;
  /** Label for the destructive action button. Defaults to "Delete". */
  confirmButtonText?: string;
  /** Indicates whether the destructive mutation is currently in flight. */
  isLoading?: boolean;
  /** Callback invoked when the user confirms the deletion. */
  onConfirm: () => void;
  /** Callback invoked to dismiss the modal without action. */
  onClose: () => void;
}

/**
 * Accessible confirmation modal for destructive operations.
 *
 * Implements strict security guards for high-impact actions (such as profile soft deletion)
 * by optionally requiring typed keyword verification before enabling the confirmation action.
 */
export function ConfirmDeleteModal(props: ConfirmDeleteModalProps) {
  if (!props.isOpen) return null;
  return <ConfirmDeleteDialog {...props} />;
}

function ConfirmDeleteDialog({
  title,
  description,
  confirmKeyword,
  confirmButtonText = "Delete",
  isLoading = false,
  onConfirm,
  onClose,
}: Omit<ConfirmDeleteModalProps, "isOpen">) {
  const [typedConfirmation, setTypedConfirmation] = useState("");

  // Handle ESC key press to close modal when not executing an async operation
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && !isLoading) {
        onClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isLoading, onClose]);

  const isKeywordMatching = confirmKeyword
    ? typedConfirmation.trim() === confirmKeyword
    : true;

  const isConfirmDisabled = isLoading || !isKeywordMatching;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-delete-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-gray-900/60 backdrop-blur-xs transition-opacity"
        onClick={() => {
          if (!isLoading) onClose();
        }}
        aria-hidden="true"
      />

      {/* Modal Dialog Card */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative z-10 w-full max-w-md transform overflow-hidden rounded-xl bg-white p-6 shadow-2xl transition-all"
      >
        {/* Close Button */}
        <button
          type="button"
          disabled={isLoading}
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 focus:outline-none disabled:cursor-not-allowed"
          aria-label="Close dialog"
        >
          <XIcon className="h-5 w-5" />
        </button>

        <div className="flex items-start gap-4">
          {/* Warning Icon Badge */}
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600">
            <ExclamationCircleIcon className="h-6 w-6" />
          </div>

          <div className="flex-1">
            <h2
              id="confirm-delete-title"
              className="text-lg font-semibold text-gray-900"
            >
              {title}
            </h2>
            <div className="mt-2 text-sm text-gray-600 leading-relaxed">
              {description}
            </div>
          </div>
        </div>

        {/* Typed keyword verification input */}
        {confirmKeyword && (
          <div className="mt-5 space-y-2 rounded-lg bg-red-50/60 p-3.5 border border-red-100">
            <label
              htmlFor="confirm-keyword-input"
              className="block text-xs font-medium text-red-900"
            >
              To confirm, type{" "}
              <span className="font-mono font-bold select-all text-red-700">
                {confirmKeyword}
              </span>{" "}
              below:
            </label>
            <Input
              id="confirm-keyword-input"
              value={typedConfirmation}
              onChange={(e) => setTypedConfirmation(e.target.value)}
              disabled={isLoading}
              placeholder={confirmKeyword}
              autoComplete="off"
            />
          </div>
        )}

        {/* Actions */}
        <div className="mt-6 flex items-center justify-end gap-3">
          <Button
            type="button"
            variant="secondary"
            disabled={isLoading}
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="danger"
            isLoading={isLoading}
            disabled={isConfirmDisabled}
            onClick={onConfirm}
          >
            {confirmButtonText}
          </Button>
        </div>
      </div>
    </div>
  );
}

