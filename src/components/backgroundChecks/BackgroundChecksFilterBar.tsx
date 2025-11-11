import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/common/SearchInput";
import { FilterDropdown } from "@/components/common/FilterDropdown";
import { X } from "lucide-react";

interface BackgroundChecksFilterBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (value: string) => void;
  checkTypeFilter: string;
  onCheckTypeChange: (value: string) => void;
  providerFilter: string;
  onProviderChange: (value: string) => void;
  onClearFilters: () => void;
  activeFilterCount: number;
}

export function BackgroundChecksFilterBar({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusChange,
  checkTypeFilter,
  onCheckTypeChange,
  providerFilter,
  onProviderChange,
  onClearFilters,
  activeFilterCount,
}: BackgroundChecksFilterBarProps) {
  const statusOptions = [
    { label: "Not Started", value: "not-started" },
    { label: "Pending Consent", value: "pending-consent" },
    { label: "In Progress", value: "in-progress" },
    { label: "Completed", value: "completed" },
    { label: "Issues Found", value: "issues-found" },
    { label: "Cancelled", value: "cancelled" },
  ];

  const checkTypeOptions = [
    { label: "Criminal Record", value: "criminal" },
    { label: "Employment Verification", value: "employment" },
    { label: "Education Verification", value: "education" },
    { label: "Credit Check", value: "credit" },
    { label: "Drug Screen", value: "drug-screen" },
    { label: "Reference Check", value: "reference" },
    { label: "Identity Verification", value: "identity" },
    { label: "Professional License", value: "professional-license" },
  ];

  const providerOptions = [
    { label: "Checkr", value: "checkr" },
    { label: "Sterling", value: "sterling" },
    { label: "HireRight", value: "hireright" },
    { label: "Manual", value: "manual" },
  ];

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <SearchInput
        value={searchTerm}
        onChange={onSearchChange}
        placeholder="Search background checks..."
        className="flex-1"
      />
      
      <div className="flex gap-2 flex-wrap">
        <FilterDropdown
          label="Status"
          value={statusFilter}
          onChange={onStatusChange}
          options={statusOptions}
        />
        
        <FilterDropdown
          label="Check Type"
          value={checkTypeFilter}
          onChange={onCheckTypeChange}
          options={checkTypeOptions}
        />
        
        <FilterDropdown
          label="Provider"
          value={providerFilter}
          onChange={onProviderChange}
          options={providerOptions}
        />
        
        {activeFilterCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="gap-1"
          >
            <X className="h-4 w-4" />
            Clear ({activeFilterCount})
          </Button>
        )}
      </div>
    </div>
  );
}
