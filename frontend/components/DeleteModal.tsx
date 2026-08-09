// frontend/components/DeleteModal.tsx
'use client';

interface DeleteModalProps {
  isOpen: boolean;
  projectName: string;
  isDeleting: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export function DeleteModal({ isOpen, projectName, isDeleting, onConfirm, onClose }: DeleteModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-slate-900 border dark:border-slate-800">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
          Delete Project
        </h3>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          Are you sure you want to delete <span className="font-semibold text-slate-900 dark:text-slate-200">&quot;{projectName}&quot;</span>? This action cannot be undone.
        </p>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="rounded-lg px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-medium text-white hover:bg-rose-700 disabled:opacity-50 transition-colors"
          >
            {isDeleting ? 'Deleting...' : 'Delete Project'}
          </button>
        </div>
      </div>
    </div>
  );
}