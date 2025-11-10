import { Button } from '@/components/ui/button';
import { UserPlus, Calendar, AlertCircle, X } from 'lucide-react';

interface BulkActionsBarProps {
  selectedCount: number;
  onAssignToService: () => void;
  onAdjustCapacity: () => void;
  onClearSelection: () => void;
}

export function BulkActionsBar({
  selectedCount,
  onAssignToService,
  onAdjustCapacity,
  onClearSelection,
}: BulkActionsBarProps) {
  return (
    <div className="flex items-center justify-between gap-4 p-4 bg-primary/10 border border-primary/20 rounded-lg mb-4">
      <div className="flex items-center gap-2">
        <AlertCircle className="h-5 w-5 text-primary" />
        <span className="font-medium text-sm">
          {selectedCount} consultant{selectedCount !== 1 ? 's' : ''} selected
        </span>
      </div>
      
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onAssignToService}
        >
          <UserPlus className="h-4 w-4 mr-2" />
          Assign to Service
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={onAdjustCapacity}
        >
          <Calendar className="h-4 w-4 mr-2" />
          Adjust Capacity
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearSelection}
        >
          <X className="h-4 w-4 mr-2" />
          Clear
        </Button>
      </div>
    </div>
  );
}
