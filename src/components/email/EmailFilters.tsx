import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { EmailFilters as EmailFiltersType, EmailStatus } from '@/lib/api/emailInboxService';
import { CalendarIcon, X } from 'lucide-react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface EmailFiltersProps {
  filters: EmailFiltersType;
  onFiltersChange: (filters: EmailFiltersType) => void;
  onClear: () => void;
  className?: string;
}

const STATUS_OPTIONS: { value: EmailStatus; label: string }[] = [
  { value: 'SENT', label: 'Sent' },
  { value: 'DELIVERED', label: 'Delivered' },
  { value: 'OPENED', label: 'Opened' },
  { value: 'BOUNCED', label: 'Bounced' },
  { value: 'FAILED', label: 'Failed' },
];

export function EmailFilters({ filters, onFiltersChange, onClear, className }: EmailFiltersProps) {
  const hasFilters = Object.values(filters).some(v => v !== undefined && v !== '');

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Filters</CardTitle>
            <CardDescription>Filter emails by various criteria</CardDescription>
          </div>
          {hasFilters && (
            <Button variant="ghost" size="sm" onClick={onClear}>
              <X className="h-4 w-4 mr-2" />
              Clear
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Status</Label>
          <Select
            value={filters.status || 'ALL'}
            onValueChange={(value) =>
              onFiltersChange({ ...filters, status: value === 'ALL' ? undefined : (value as EmailStatus) })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Statuses</SelectItem>
              {STATUS_OPTIONS.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Start Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  'w-full justify-start text-left font-normal',
                  !filters.startDate && 'text-muted-foreground'
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {filters.startDate ? format(new Date(filters.startDate), 'PPP') : 'Pick a date'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={filters.startDate ? new Date(filters.startDate) : undefined}
                onSelect={(date) =>
                  onFiltersChange({ ...filters, startDate: date ? date.toISOString() : undefined })
                }
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label>End Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  'w-full justify-start text-left font-normal',
                  !filters.endDate && 'text-muted-foreground'
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {filters.endDate ? format(new Date(filters.endDate), 'PPP') : 'Pick a date'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={filters.endDate ? new Date(filters.endDate) : undefined}
                onSelect={(date) =>
                  onFiltersChange({ ...filters, endDate: date ? date.toISOString() : undefined })
                }
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {filters.jobId && (
          <div className="space-y-2">
            <Label>Job ID</Label>
            <Input value={filters.jobId} disabled />
          </div>
        )}

        {filters.applicationId && (
          <div className="space-y-2">
            <Label>Application ID</Label>
            <Input value={filters.applicationId} disabled />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

