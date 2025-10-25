import { Button } from '@/components/ui/button';
import { LayoutGrid, List } from 'lucide-react';

interface ViewToggleProps {
  value: 'grid' | 'list';
  onChange: (value: 'grid' | 'list') => void;
}

export function ViewToggle({ value, onChange }: ViewToggleProps) {
  return (
    <div className="flex items-center gap-1 border rounded-md p-1">
      <Button
        variant={value === 'grid' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onChange('grid')}
        aria-label="Grid view"
      >
        <LayoutGrid className="h-4 w-4" />
      </Button>
      <Button
        variant={value === 'list' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onChange('list')}
        aria-label="List view"
      >
        <List className="h-4 w-4" />
      </Button>
    </div>
  );
}
