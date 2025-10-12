import { useState } from "react";
import { Search, ChevronDown, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface JobsFilterBarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  selectedConsultants: string[];
  onConsultantsChange: (consultants: string[]) => void;
  selectedCountry: string;
  onCountryChange: (country: string) => void;
  selectedService: string;
  onServiceChange: (service: string) => void;
  consultantOptions: string[];
  countryOptions: string[];
  currentUserId?: string;
}

const serviceTypeLabels: Record<string, string> = {
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
  selectedCountry,
  onCountryChange,
  selectedService,
  onServiceChange,
  consultantOptions,
  countryOptions,
  currentUserId,
}: JobsFilterBarProps) {
  const [consultantPopoverOpen, setConsultantPopoverOpen] = useState(false);

  const toggleConsultant = (consultant: string) => {
    const newSelection = selectedConsultants.includes(consultant)
      ? selectedConsultants.filter((c) => c !== consultant)
      : [...selectedConsultants, consultant];
    onConsultantsChange(newSelection);
  };

  const hasActiveFilters =
    searchValue ||
    selectedConsultants.length > 0 ||
    selectedCountry !== "all" ||
    selectedService !== "all";

  const clearAllFilters = () => {
    onSearchChange("");
    onConsultantsChange([]);
    onCountryChange("all");
    onServiceChange("all");
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-3">
        {/* Search Input - 30% width on desktop */}
        <div className="relative md:w-[30%]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search jobs..."
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Consultant Multi-Select Dropdown */}
        <Popover open={consultantPopoverOpen} onOpenChange={setConsultantPopoverOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="justify-between md:w-[200px]"
            >
              {selectedConsultants.length === 0
                ? "All Consultants"
                : selectedConsultants.length === 1
                ? selectedConsultants[0]
                : `${selectedConsultants.length} selected`}
              <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0" align="start">
            <Command>
              <CommandInput placeholder="Search consultants..." />
              <CommandEmpty>No consultants found.</CommandEmpty>
              <CommandGroup className="max-h-[300px] overflow-y-auto">
                <CommandItem onSelect={() => toggleConsultant("my-jobs")}>
                  <Checkbox
                    checked={selectedConsultants.includes("my-jobs")}
                    className="mr-2"
                  />
                  <span>Show My Jobs Only</span>
                </CommandItem>
                <CommandSeparator className="my-1" />
                {consultantOptions.map((consultant) => (
                  <CommandItem
                    key={consultant}
                    onSelect={() => toggleConsultant(consultant)}
                  >
                    <Checkbox
                      checked={selectedConsultants.includes(consultant)}
                      className="mr-2"
                    />
                    <span>{consultant}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>

        {/* Country Dropdown */}
        <Select value={selectedCountry} onValueChange={onCountryChange}>
          <SelectTrigger className="md:w-[180px]">
            <SelectValue placeholder="All Countries" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Countries</SelectItem>
            {countryOptions.map((country) => (
              <SelectItem key={country} value={country}>
                {country}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Service Type Dropdown */}
        <Select value={selectedService} onValueChange={onServiceChange}>
          <SelectTrigger className="md:w-[180px]">
            <SelectValue placeholder="All Services" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Services</SelectItem>
            <SelectItem value="self-managed">Self-Managed</SelectItem>
            <SelectItem value="shortlisting">Shortlisting</SelectItem>
            <SelectItem value="full-service">Full-Service</SelectItem>
            <SelectItem value="executive-search">Executive Search</SelectItem>
            <SelectItem value="rpo">RPO</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted-foreground">Active filters:</span>

          {searchValue && (
            <Badge variant="secondary" className="gap-1">
              Search: {searchValue}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => onSearchChange("")}
              />
            </Badge>
          )}

          {selectedConsultants.length > 0 && (
            <Badge variant="secondary" className="gap-1">
              {selectedConsultants.includes("my-jobs")
                ? "My Jobs Only"
                : `Consultants: ${selectedConsultants.length}`}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => onConsultantsChange([])}
              />
            </Badge>
          )}

          {selectedCountry !== "all" && (
            <Badge variant="secondary" className="gap-1">
              Country: {selectedCountry}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => onCountryChange("all")}
              />
            </Badge>
          )}

          {selectedService !== "all" && (
            <Badge variant="secondary" className="gap-1">
              Service: {serviceTypeLabels[selectedService]}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => onServiceChange("all")}
              />
            </Badge>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="h-7 text-xs"
          >
            Clear all
          </Button>
        </div>
      )}
    </div>
  );
}
