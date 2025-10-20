import { Search, X, RefreshCw } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Employer } from "@/types/entities";
import type { SubscriptionTier } from "@/lib/subscriptionConfig";

interface EmployersFilterBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: Employer['status'] | 'all';
  onStatusChange: (value: Employer['status'] | 'all') => void;
  tierFilter: SubscriptionTier | 'all';
  onTierChange: (value: SubscriptionTier | 'all') => void;
  accountTypeFilter: Employer['accountType'] | 'all';
  onAccountTypeChange: (value: Employer['accountType'] | 'all') => void;
  onClearFilters: () => void;
  activeFilterCount: number;
}

export function EmployersFilterBar({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusChange,
  tierFilter,
  onTierChange,
  accountTypeFilter,
  onAccountTypeChange,
  onClearFilters,
  activeFilterCount,
}: EmployersFilterBarProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search companies, industries, locations..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={statusFilter} onValueChange={onStatusChange}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="trial">Trial</SelectItem>
            <SelectItem value="expired">Expired</SelectItem>
          </SelectContent>
        </Select>

        <Select value={tierFilter} onValueChange={onTierChange}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Subscription Tier" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Tiers</SelectItem>
            <SelectItem value="free">Free</SelectItem>
            <SelectItem value="small">Small</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="large">Large</SelectItem>
            <SelectItem value="enterprise">Enterprise</SelectItem>
          </SelectContent>
        </Select>

        <Select value={accountTypeFilter} onValueChange={onAccountTypeChange}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Account Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="payg">PAYG</SelectItem>
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          size="icon"
          onClick={onClearFilters}
          title="Reset all filters"
          className="shrink-0"
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>

      {activeFilterCount > 0 && (
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="gap-1">
            {activeFilterCount} filter{activeFilterCount !== 1 ? 's' : ''} active
          </Badge>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
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
