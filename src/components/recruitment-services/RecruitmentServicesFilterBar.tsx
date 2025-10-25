import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface RecruitmentServicesFilterBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  serviceTypeFilter: string;
  onServiceTypeChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (value: string) => void;
  priorityFilter: string;
  onPriorityChange: (value: string) => void;
  countryFilter: string;
  onCountryChange: (value: string) => void;
  onClearFilters: () => void;
  activeFilterCount: number;
}

export function RecruitmentServicesFilterBar({
  searchTerm,
  onSearchChange,
  serviceTypeFilter,
  onServiceTypeChange,
  statusFilter,
  onStatusChange,
  priorityFilter,
  onPriorityChange,
  countryFilter,
  onCountryChange,
  onClearFilters,
  activeFilterCount
}: RecruitmentServicesFilterBarProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search projects..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>

      <Select value={serviceTypeFilter} onValueChange={onServiceTypeChange}>
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="Service Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Types</SelectItem>
          <SelectItem value="shortlisting">Shortlisting</SelectItem>
          <SelectItem value="full-service">Full-Service</SelectItem>
          <SelectItem value="executive-search">Executive Search</SelectItem>
          <SelectItem value="rpo">RPO</SelectItem>
        </SelectContent>
      </Select>

      <Select value={countryFilter} onValueChange={onCountryChange}>
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="Country" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Countries</SelectItem>
          <SelectItem value="United States">United States</SelectItem>
          <SelectItem value="United Kingdom">United Kingdom</SelectItem>
          <SelectItem value="Australia">Australia</SelectItem>
          <SelectItem value="Canada">Canada</SelectItem>
        </SelectContent>
      </Select>

      <Select value={statusFilter} onValueChange={onStatusChange}>
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Statuses</SelectItem>
          <SelectItem value="active">Active</SelectItem>
          <SelectItem value="on-hold">On Hold</SelectItem>
          <SelectItem value="completed">Completed</SelectItem>
          <SelectItem value="cancelled">Cancelled</SelectItem>
        </SelectContent>
      </Select>

      <Select value={priorityFilter} onValueChange={onPriorityChange}>
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="Priority" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Priorities</SelectItem>
          <SelectItem value="high">High</SelectItem>
          <SelectItem value="medium">Medium</SelectItem>
          <SelectItem value="low">Low</SelectItem>
        </SelectContent>
      </Select>

      {activeFilterCount > 0 && (
        <Button
          variant="outline"
          onClick={onClearFilters}
          className="w-full sm:w-auto"
        >
          <X className="h-4 w-4 mr-2" />
          Clear
          <Badge variant="secondary" className="ml-2">
            {activeFilterCount}
          </Badge>
        </Button>
      )}
    </div>
  );
}
