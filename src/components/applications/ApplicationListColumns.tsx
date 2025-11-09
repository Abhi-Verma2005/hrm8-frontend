import { ColumnDef } from "@tanstack/react-table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Eye, Mail, CheckCircle, XCircle } from "lucide-react";
import { format } from "date-fns";
import type { Application, ApplicationStatus, ApplicationStage } from "@/types/application";

const statusConfig: Record<ApplicationStatus, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  applied: { label: "Applied", variant: "outline" },
  screening: { label: "Screening", variant: "secondary" },
  interview: { label: "Interview", variant: "default" },
  offer: { label: "Offer", variant: "default" },
  hired: { label: "Hired", variant: "default" },
  rejected: { label: "Rejected", variant: "destructive" },
  withdrawn: { label: "Withdrawn", variant: "outline" },
};

const stageColors: Record<string, string> = {
  'New Application': 'bg-blue-500',
  'Resume Review': 'bg-cyan-500',
  'Phone Screen': 'bg-purple-500',
  'Technical Interview': 'bg-indigo-500',
  'Manager Interview': 'bg-violet-500',
  'Final Round': 'bg-fuchsia-500',
  'Reference Check': 'bg-pink-500',
  'Offer Extended': 'bg-green-500',
  'Offer Accepted': 'bg-emerald-500',
  'Rejected': 'bg-red-500',
  'Withdrawn': 'bg-gray-500',
};

export const applicationListColumns = (
  onApplicationClick: (application: Application) => void
): ColumnDef<Application>[] => [
  {
    accessorKey: "candidateName",
    header: "Candidate",
    cell: ({ row }) => {
      const application = row.original;
      return (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={application.candidatePhoto} />
            <AvatarFallback>
              {application.candidateName.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-medium">{application.candidateName}</span>
            <span className="text-xs text-muted-foreground">{application.candidateEmail}</span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "jobTitle",
    header: "Job Position",
    cell: ({ row }) => {
      const application = row.original;
      return (
        <div className="flex flex-col">
          <span className="font-medium">{application.jobTitle}</span>
          <span className="text-xs text-muted-foreground">{application.employerName}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as ApplicationStatus;
      const config = statusConfig[status];
      return <Badge variant={config.variant}>{config.label}</Badge>;
    },
  },
  {
    accessorKey: "stage",
    header: "Stage",
    cell: ({ row }) => {
      const stage = row.getValue("stage") as ApplicationStage;
      const color = stageColors[stage] || 'bg-gray-500';
      return (
        <div className="flex items-center gap-2">
          <div className={`h-2 w-2 rounded-full ${color}`} />
          <span className="text-sm">{stage}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "appliedDate",
    header: "Applied Date",
    cell: ({ row }) => {
      const date = row.getValue("appliedDate") as Date;
      return <span className="text-sm">{format(date, "MMM d, yyyy")}</span>;
    },
  },
  {
    accessorKey: "score",
    header: "Score",
    cell: ({ row }) => {
      const score = row.getValue("score") as number | undefined;
      if (!score) return <span className="text-muted-foreground">-</span>;
      return (
        <div className="flex items-center gap-2">
          <div className="w-16 bg-secondary rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full"
              style={{ width: `${score}%` }}
            />
          </div>
          <span className="text-sm font-medium">{score}</span>
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const application = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => onApplicationClick(application)}>
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Mail className="mr-2 h-4 w-4" />
              Send Email
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <CheckCircle className="mr-2 h-4 w-4" />
              Move to Next Stage
            </DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">
              <XCircle className="mr-2 h-4 w-4" />
              Reject Application
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
