import type { Column } from "@/components/tables/DataTable";
import type { Candidate } from "@/types/entities";
import { CandidateAvatar } from "./CandidateAvatar";
import { CandidateStatusBadge } from "./CandidateStatusBadge";
import { SkillsBadgeGroup } from "./SkillsBadgeGroup";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Eye, Edit, Mail, Trash2, Download } from "lucide-react";
import { Link } from "react-router-dom";

export const candidateTableColumns: Column<Candidate>[] = [
  {
    key: 'name',
    label: 'Candidate',
    sortable: true,
    render: (candidate) => (
      <div className="flex items-center gap-3">
        <CandidateAvatar 
          name={candidate.name} 
          photo={candidate.photo}
          size="sm"
        />
      <div>
        <Link 
          to={`/candidates/${candidate.id}`}
          className="font-semibold text-base hover:underline cursor-pointer line-clamp-1 block"
        >
          {candidate.name}
        </Link>
        <div className="text-sm text-muted-foreground">{candidate.email}</div>
      </div>
      </div>
    ),
  },
  {
    key: 'location',
    label: 'Location',
    sortable: true,
    render: (candidate) => {
      if (!candidate.location) return <span className="text-muted-foreground">—</span>;
      
      return (
        <div className="text-sm">
          <p className="font-medium">{candidate.location}</p>
          <p className="text-xs text-muted-foreground">{candidate.country}</p>
        </div>
      );
    },
  },
  {
    key: 'phone',
    label: 'Phone',
    sortable: false,
  },
  {
    key: 'position',
    label: 'Position',
    sortable: true,
  },
  {
    key: 'experience',
    label: 'Experience',
    sortable: true,
  },
  {
    key: 'skills',
    label: 'Skills',
    sortable: false,
    render: (candidate) => (
      <SkillsBadgeGroup skills={candidate.skills} maxVisible={2} />
    ),
  },
  {
    key: 'status',
    label: 'Status',
    sortable: true,
    render: (candidate) => <CandidateStatusBadge status={candidate.status} />,
  },
  {
    key: 'appliedDate',
    label: 'Applied Date',
    sortable: true,
    render: (candidate) => candidate.appliedDate.toLocaleDateString(),
  },
  {
    key: 'actions',
    label: 'Actions',
    sortable: false,
    width: '60px',
    render: (candidate) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon-sm">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            <Link to={`/candidates/${candidate.id}`}>
              <Eye className="h-4 w-4 mr-2" />
              View Details
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to={`/candidates/${candidate.id}/edit`}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Mail className="h-4 w-4 mr-2" />
            Send Email
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Download className="h-4 w-4 mr-2" />
            Download Resume
          </DropdownMenuItem>
          <DropdownMenuItem className="text-destructive">
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];
