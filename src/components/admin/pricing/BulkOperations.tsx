import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getATSSubscriptionTiers, getAddonServices, getRecruitmentServices, updateATSSubscriptionTier, updateAddonService, updateRecruitmentService } from '@/lib/pricingStorage';
import { useToast } from '@/hooks/use-toast';
import { CheckSquare, Square } from 'lucide-react';

type EntityType = 'tiers' | 'addons' | 'services';

export function BulkOperations() {
  const [entityType, setEntityType] = useState<EntityType>('tiers');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const { toast } = useToast();

  const entities = {
    tiers: getATSSubscriptionTiers(),
    addons: getAddonServices(),
    services: getRecruitmentServices(),
  };

  const currentEntities = entities[entityType];

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === currentEntities.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(currentEntities.map((e) => e.id));
    }
  };

  const applyBulkAction = (action: 'activate' | 'draft' | 'archive') => {
    if (selectedIds.length === 0) {
      toast({
        title: 'No items selected',
        description: 'Please select at least one item to perform bulk actions.',
        variant: 'destructive',
      });
      return;
    }

    const statusMap = {
      activate: 'active',
      draft: 'draft',
      archive: 'archived',
    } as const;

    const status = statusMap[action];

    selectedIds.forEach((id) => {
      if (entityType === 'tiers') {
        updateATSSubscriptionTier(id, { status }, 'bulk-operation');
      } else if (entityType === 'addons') {
        updateAddonService(id, { status });
      } else if (entityType === 'services') {
        updateRecruitmentService(id, { status });
      }
    });

    toast({
      title: 'Bulk action applied',
      description: `${selectedIds.length} items updated to ${status} status.`,
    });

    setSelectedIds([]);
    window.location.reload();
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      active: 'bg-green-500/10 text-green-500',
      draft: 'bg-yellow-500/10 text-yellow-500',
      archived: 'bg-gray-500/10 text-gray-500',
    };
    return colors[status] || 'bg-gray-500/10 text-gray-500';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bulk Operations</CardTitle>
        <CardDescription>Select multiple items and apply actions in bulk</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Entity Type Selector */}
          <div className="flex items-center gap-4">
            <Select value={entityType} onValueChange={(v) => {
              setEntityType(v as EntityType);
              setSelectedIds([]);
            }}>
              <SelectTrigger className="w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tiers">ATS Tiers</SelectItem>
                <SelectItem value="addons">Add-on Services</SelectItem>
                <SelectItem value="services">Recruitment Services</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              size="sm"
              onClick={toggleSelectAll}
            >
              {selectedIds.length === currentEntities.length ? (
                <>
                  <CheckSquare className="h-4 w-4 mr-2" />
                  Deselect All
                </>
              ) : (
                <>
                  <Square className="h-4 w-4 mr-2" />
                  Select All
                </>
              )}
            </Button>

            {selectedIds.length > 0 && (
              <Badge variant="secondary">
                {selectedIds.length} selected
              </Badge>
            )}
          </div>

          {/* Actions */}
          {selectedIds.length > 0 && (
            <div className="flex gap-2 p-3 bg-muted rounded-lg">
              <Button
                onClick={() => applyBulkAction('activate')}
                variant="outline"
                size="sm"
              >
                Set Active
              </Button>
              <Button
                onClick={() => applyBulkAction('draft')}
                variant="outline"
                size="sm"
              >
                Set Draft
              </Button>
              <Button
                onClick={() => applyBulkAction('archive')}
                variant="outline"
                size="sm"
              >
                Archive
              </Button>
            </div>
          )}

          {/* Items List */}
          <div className="border rounded-lg divide-y">
            {currentEntities.map((entity) => (
              <div
                key={entity.id}
                className="flex items-center gap-3 p-3 hover:bg-muted/50 cursor-pointer"
                onClick={() => toggleSelect(entity.id)}
              >
                <Checkbox
                  checked={selectedIds.includes(entity.id)}
                  onCheckedChange={() => toggleSelect(entity.id)}
                />
                <div className="flex-1">
                  <p className="font-medium">{entity.name}</p>
                  <p className="text-sm text-muted-foreground line-clamp-1">
                    {entity.description}
                  </p>
                </div>
                <Badge className={getStatusColor(entity.status)} variant="secondary">
                  {entity.status}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
