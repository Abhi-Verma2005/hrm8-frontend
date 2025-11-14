import { memo } from 'react';
import { DateRange } from 'react-day-picker';
import { ChevronDown } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { PresetItem } from './PresetItem';

interface PresetCategoryGroupProps {
  category: string;
  presets: Array<{ id: string; name: string; range: DateRange; category?: string }>;
  isOpen: boolean;
  onToggle: () => void;
  onSelectPreset: (range: DateRange) => void;
  onDuplicatePreset: (id: string, name: string, category?: string) => void;
  onEditPreset: (id: string, name: string, category?: string) => void;
  onDeletePreset: (id: string, name: string) => void;
}

export const PresetCategoryGroup = memo(function PresetCategoryGroup({
  category,
  presets,
  isOpen,
  onToggle,
  onSelectPreset,
  onDuplicatePreset,
  onEditPreset,
  onDeletePreset,
}: PresetCategoryGroupProps) {
  return (
    <Collapsible open={isOpen} onOpenChange={onToggle}>
      <div className="flex items-center justify-between">
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="flex-1 justify-between font-semibold"
          >
            {category}
            <ChevronDown
              className={`h-4 w-4 transition-transform ${
                isOpen ? 'transform rotate-180' : ''
              }`}
            />
          </Button>
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent className="space-y-1">
        <SortableContext
          items={presets.map(p => p.id)}
          strategy={verticalListSortingStrategy}
        >
          {presets.map((preset) => (
            <PresetItem
              key={preset.id}
              preset={preset}
              onSelect={() => onSelectPreset(preset.range)}
              onDuplicate={() => onDuplicatePreset(preset.id, preset.name, preset.category)}
              onEdit={() => onEditPreset(preset.id, preset.name, preset.category)}
              onDelete={() => onDeletePreset(preset.id, preset.name)}
            />
          ))}
        </SortableContext>
      </CollapsibleContent>
    </Collapsible>
  );
});
