import { format, formatDistanceToNow } from "date-fns";
import { MoreHorizontal, Edit, FileText, Archive, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EmployerAvatar } from "./EmployerAvatar";
import { EmployerStatusBadge } from "./EmployerStatusBadge";
import { SubscriptionTierBadge } from "./SubscriptionTierBadge";
import { AccountTypeBadge } from "./AccountTypeBadge";
import { formatRevenue } from "@/lib/employerUtils";
import type { Employer } from "@/types/entities";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { Column } from "@/components/tables/DataTable";

export const createEmployerColumns = (): Column<Employer>[] => [
  {
    key: "name",
    label: "Company",
    sortable: true,
    render: (employer) => (
      <div className="flex items-center gap-3">
        <EmployerAvatar name={employer.name} logoUrl={employer.logo} size="sm" />
        <div>
          <Link
            to={`/employers/${employer.id}`}
            className="font-semibold text-base hover:underline cursor-pointer line-clamp-1 block"
          >
            {employer.name}
          </Link>
          <p className="text-sm text-muted-foreground">{employer.industry}</p>
        </div>
      </div>
    ),
  },
  {
    key: "accountType",
    label: "Account Type",
    sortable: true,
    render: (employer) => <AccountTypeBadge accountType={employer.accountType} />,
  },
  {
    key: "subscriptionTier",
    label: "Subscription",
    sortable: true,
    render: (employer) => <SubscriptionTierBadge tier={employer.subscriptionTier} />,
  },
  {
    key: "location",
    label: "Location",
    sortable: true,
    render: (employer) => {
      const locationParts = employer.location.split(',').map(p => p.trim());
      const city = locationParts[0] || '';
      const state = locationParts[1] || '';
      const country = employer.locations?.[0]?.country || 'United States';
      
      return (
        <div className="text-sm">
          <p className="font-medium">{city}{state ? `, ${state}` : ''}</p>
          <p className="text-xs text-muted-foreground">{country}</p>
        </div>
      );
    },
  },
  {
    key: "activeJobCount",
    label: "Active Jobs",
    sortable: true,
    render: (employer) => (
      <div className="text-center">
        <span className="font-medium">{employer.activeJobCount}</span>
      </div>
    ),
  },
  {
    key: "revenue",
    label: "Monthly Revenue",
    sortable: true,
    render: (employer) => {
      const revenue = employer.monthlySubscriptionFee || 0;
      return <span className="font-medium">{formatRevenue(revenue)}</span>;
    },
  },
  {
    key: "lastActivityAt",
    label: "Last Login",
    sortable: true,
    render: (employer) => {
      const date = employer.lastActivityAt || employer.updatedAt;
      return (
        <div className="text-sm">
          <p>{formatDistanceToNow(new Date(date), { addSuffix: true })}</p>
          <p className="text-xs text-muted-foreground">
            {format(new Date(date), "MMM d, yyyy")}
          </p>
        </div>
      );
    },
  },
  {
    key: "accountManagerName",
    label: "Account Manager",
    sortable: true,
    render: (employer) => {
      const manager = employer.accountManagerName;
      if (!manager) return <span className="text-muted-foreground">—</span>;
      
      return (
        <div className="flex items-center gap-2">
          <Avatar className="h-6 w-6">
            <AvatarFallback className="text-xs bg-primary/10 text-primary">
              {manager.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm">{manager}</span>
        </div>
      );
    },
  },
  {
    key: "actions",
    label: "Actions",
    render: (employer) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link to={`/employers/${employer.id}`}>
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to={`/employers/${employer.id}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Employer
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <FileText className="mr-2 h-4 w-4" />
            Send Invoice
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-destructive">
            <Archive className="mr-2 h-4 w-4" />
            Archive
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];
