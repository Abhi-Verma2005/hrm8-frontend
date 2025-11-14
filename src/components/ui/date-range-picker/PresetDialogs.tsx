import { memo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

interface SavePresetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  presetName: string;
  presetCategory: string;
  onNameChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onSave: () => void;
  categories: string[];
}

export const SavePresetDialog = memo(function SavePresetDialog({
  open,
  onOpenChange,
  presetName,
  presetCategory,
  onNameChange,
  onCategoryChange,
  onSave,
  categories,
}: SavePresetDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Save Custom Preset</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Preset Name</Label>
            <Input
              placeholder="e.g., Q1 2024"
              value={presetName}
              onChange={(e) => onNameChange(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Category (optional)</Label>
            <Input
              placeholder="e.g., Quarterly Reports"
              value={presetCategory}
              onChange={(e) => onCategoryChange(e.target.value)}
              list="categories"
            />
            {categories.length > 0 && (
              <datalist id="categories">
                {categories.map(cat => (
                  <option key={cat} value={cat} />
                ))}
              </datalist>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onSave}>Save Preset</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
});

interface EditPresetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editName: string;
  editCategory: string;
  updateRange: boolean;
  onNameChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onUpdateRangeChange: (checked: boolean) => void;
  onUpdate: () => void;
  categories: string[];
}

export const EditPresetDialog = memo(function EditPresetDialog({
  open,
  onOpenChange,
  editName,
  editCategory,
  updateRange,
  onNameChange,
  onCategoryChange,
  onUpdateRangeChange,
  onUpdate,
  categories,
}: EditPresetDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Preset</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Preset Name</Label>
            <Input
              value={editName}
              onChange={(e) => onNameChange(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Category (optional)</Label>
            <Input
              placeholder="e.g., Quarterly Reports"
              value={editCategory}
              onChange={(e) => onCategoryChange(e.target.value)}
              list="edit-categories"
            />
            {categories.length > 0 && (
              <datalist id="edit-categories">
                {categories.map(cat => (
                  <option key={cat} value={cat} />
                ))}
              </datalist>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="update-range"
              checked={updateRange}
              onCheckedChange={onUpdateRangeChange}
            />
            <Label htmlFor="update-range" className="text-sm font-normal cursor-pointer">
              Update date range to current selection
            </Label>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onUpdate}>Update Preset</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
});

interface DuplicatePresetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  duplicateName: string;
  duplicateCategory: string;
  onNameChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onDuplicate: () => void;
  categories: string[];
}

export const DuplicatePresetDialog = memo(function DuplicatePresetDialog({
  open,
  onOpenChange,
  duplicateName,
  duplicateCategory,
  onNameChange,
  onCategoryChange,
  onDuplicate,
  categories,
}: DuplicatePresetDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Duplicate Preset</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>New Preset Name</Label>
            <Input
              value={duplicateName}
              onChange={(e) => onNameChange(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Category (optional)</Label>
            <Input
              placeholder="e.g., Quarterly Reports"
              value={duplicateCategory}
              onChange={(e) => onCategoryChange(e.target.value)}
              list="duplicate-categories"
            />
            {categories.length > 0 && (
              <datalist id="duplicate-categories">
                {categories.map(cat => (
                  <option key={cat} value={cat} />
                ))}
              </datalist>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onDuplicate}>Duplicate</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
});
