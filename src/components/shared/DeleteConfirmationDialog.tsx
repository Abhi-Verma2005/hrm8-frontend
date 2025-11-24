import { WarningConfirmationDialog } from "@/components/ui/warning-confirmation-dialog";

interface DeleteConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  onConfirm: () => void;
  isDeleting?: boolean;
}

/**
 * @deprecated Use WarningConfirmationDialog directly with type="delete"
 * This component is kept for backward compatibility
 */
export function DeleteConfirmationDialog({
  open,
  onOpenChange,
  title,
  description,
  onConfirm,
  isDeleting = false,
}: DeleteConfirmationDialogProps) {
  return (
    <WarningConfirmationDialog
      open={open}
      onOpenChange={onOpenChange}
      onConfirm={onConfirm}
      type="delete"
      title={title}
      description={description}
      isProcessing={isDeleting}
    />
  );
}
