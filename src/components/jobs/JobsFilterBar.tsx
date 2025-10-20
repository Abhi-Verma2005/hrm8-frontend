import { Search, X, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface LocationOption {
  region: string;
  countries: string[];
}

interface JobsFilterBarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  selectedConsultants: string[];
  onConsultantsChange: (consultants: string[]) => void;
  selectedLocations: string[];
  onLocationsChange: (locations: string[]) => void;
  selectedService: string;
  onServiceChange: (service: string) => void;
  consultantOptions: string[];
  locationOptions: LocationOption[];
  currentUserId?: string;
}

const serviceTypeLabels: Record<string, string> = {
  'all': 'All Services',
  'self-managed': 'Self-Managed',
  'shortlisting': 'Shortlisting',
  'full-service': 'Full-Service',
  'executive-search': 'Executive Search',
  'rpo': 'RPO',
};

export function JobsFilterBar({
  searchValue,
  onSearchChange,
  selectedConsultants,
  onConsultantsChange,
  selectedLocations,
  onLocationsChange,
  selectedService,
  onServiceChange,
  consultantOptions,
  locationOptions,
}: JobsFilterBarProps) {
  
  const activeFilterCount = 
    (searchValue ? 1 : 0) +
    (selectedConsultants.length > 0 ? 1 : 0) +
    (selectedLocations.length > 0 ? 1 : 0) +
    (selectedService !== "all" ? 1 : 0);

  const hasActiveFilters = activeFilterCount > 0;

  const clearAllFilters = () => {
    onSearchChange("");
    onConsultantsChange([]);
    onLocationsChange([]);
    onServiceChange("all");
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search jobs by title, company, location..."
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select 
          value={selectedConsultants.length === 0 ? 'all' : selectedConsultants[0] || 'all'} 
          onValueChange={(value) => {
            if (value === 'all') {
              onConsultantsChange([]);
            } else if (value === 'my-jobs') {
              onConsultantsChange(['my-jobs']);
            } else {
              onConsultantsChange([value]);
            }
          }}
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Consultant" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Consultants</SelectItem>
            <SelectItem value="my-jobs">My Jobs Only</SelectItem>
            {consultantOptions.map((consultant) => (
              <SelectItem key={consultant} value={consultant}>
                {consultant}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select 
          value={selectedLocations.length === 0 ? 'all' : selectedLocations[0] || 'all'} 
          onValueChange={(value) => {
            if (value === 'all') {
              onLocationsChange([]);
            } else {
              onLocationsChange([value]);
            }
          }}
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Location" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Locations</SelectItem>
            {locationOptions.map(({ region, countries }) => (
              countries.map(country => (
                <SelectItem key={country} value={country}>
                  {country}
                </SelectItem>
              ))
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedService} onValueChange={onServiceChange}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Service Type" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(serviceTypeLabels).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          size="icon"
          onClick={clearAllFilters}
          title="Reset all filters"
          className="shrink-0"
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>

      {hasActiveFilters && (
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="gap-1">
            {activeFilterCount} filter{activeFilterCount !== 1 ? 's' : ''} active
          </Badge>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="h-7 px-2 text-xs"
          >
            <X className="mr-1 h-3 w-3" />
            Clear all
          </Button>
        </div>
      )}
    </div>
  );
}
