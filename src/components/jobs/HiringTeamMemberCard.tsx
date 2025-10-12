import { HiringTeamMember } from "@/types/job";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface HiringTeamMemberCardProps {
  member: HiringTeamMember;
  onRemove: (memberId: string) => void;
}

const roleLabels: Record<HiringTeamMember['role'], string> = {
  hiring_manager: 'Hiring Manager',
  recruiter: 'Recruiter',
  interviewer: 'Interviewer',
  coordinator: 'Coordinator',
};

const roleVariants: Record<HiringTeamMember['role'], 'default' | 'secondary' | 'outline'> = {
  hiring_manager: 'default',
  recruiter: 'secondary',
  interviewer: 'outline',
  coordinator: 'outline',
};

export function HiringTeamMemberCard({ member, onRemove }: HiringTeamMemberCardProps) {
  const initials = member.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const permissions = [];
  if (member.permissions.canViewApplications) permissions.push('View');
  if (member.permissions.canShortlist) permissions.push('Shortlist');
  if (member.permissions.canScheduleInterviews) permissions.push('Schedule');
  if (member.permissions.canMakeOffers) permissions.push('Offer');

  return (
    <div className="flex items-start gap-3 p-4 border rounded-lg bg-card">
      <Avatar className="h-10 w-10">
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h4 className="font-medium truncate">{member.name}</h4>
          <Badge variant={roleVariants[member.role]}>
            {roleLabels[member.role]}
          </Badge>
          {member.status === 'pending_invite' && (
            <Badge variant="outline" className="text-yellow-600 border-yellow-600">
              Pending
            </Badge>
          )}
        </div>
        <p className="text-sm text-muted-foreground truncate mb-2">{member.email}</p>
        <div className="flex flex-wrap gap-1">
          {permissions.map((perm) => (
            <Badge key={perm} variant="outline" className="text-xs">
              {perm}
            </Badge>
          ))}
        </div>
      </div>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => onRemove(member.id)}
        className="shrink-0"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}
