import { useState } from "react";
import { HiringTeamMember } from "@/types/job";
import { mockUsers } from "@/data/mockUsers";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { ComboboxWithAdd } from "@/components/ui/combobox-with-add";

interface AddHiringTeamDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (member: HiringTeamMember) => void;
  editMember?: HiringTeamMember | null;
  currentUserId?: string;
}

export function AddHiringTeamDialog({
  open,
  onOpenChange,
  onAdd,
  editMember,
  currentUserId = 'current-user',
}: AddHiringTeamDialogProps) {
  const [selectedUserId, setSelectedUserId] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteName, setInviteName] = useState('');
  const [role, setRole] = useState<HiringTeamMember['role']>('recruiter');
  const [permissions, setPermissions] = useState({
    canViewApplications: true,
    canShortlist: false,
    canScheduleInterviews: false,
    canMakeOffers: false,
  });

  // Pre-fill form when editing
  useState(() => {
    if (editMember) {
      if (editMember.userId) {
        const user = mockUsers.find(u => u.id === editMember.userId);
        if (user) {
          setSelectedUserId(`${user.name} (${user.email})`);
        }
      } else {
        setInviteEmail(editMember.email);
        setInviteName(editMember.name);
      }
      setRole(editMember.role);
      setPermissions(editMember.permissions);
    }
  });

  const resetForm = () => {
    setSelectedUserId('');
    setInviteEmail('');
    setInviteName('');
    setRole('recruiter');
    setPermissions({
      canViewApplications: true,
      canShortlist: false,
      canScheduleInterviews: false,
      canMakeOffers: false,
    });
  };

  const handleAddExisting = () => {
    const selectedLabel = selectedUserId;
    const user = mockUsers.find((u) => `${u.name} (${u.email})` === selectedLabel);
    if (!user) return;

    const member: HiringTeamMember = {
      id: editMember?.id || `member-${Date.now()}`,
      userId: user.id,
      email: user.email,
      name: user.name,
      role,
      permissions,
      status: 'active',
      addedBy: editMember?.addedBy || currentUserId,
    };

    onAdd(member);
    resetForm();
    onOpenChange(false);
  };

  const handleInviteNew = () => {
    if (!inviteEmail || !inviteName) return;

    const member: HiringTeamMember = {
      id: editMember?.id || `member-${Date.now()}`,
      email: inviteEmail,
      name: inviteName,
      role,
      permissions,
      status: editMember?.status || 'pending_invite',
      invitedAt: editMember?.invitedAt || new Date().toISOString(),
      addedBy: editMember?.addedBy || currentUserId,
    };

    onAdd(member);
    resetForm();
    onOpenChange(false);
  };

  const userOptions = mockUsers.map((user) => `${user.name} (${user.email})`);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{editMember ? 'Edit Team Member' : 'Add Team Member'}</DialogTitle>
          <DialogDescription>
            {editMember ? 'Update team member role and permissions' : 'Add existing users or invite new members to the hiring team'}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="existing" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="existing">Existing Users</TabsTrigger>
            <TabsTrigger value="invite">Invite New User</TabsTrigger>
          </TabsList>

          <TabsContent value="existing" className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>Select User</Label>
              <ComboboxWithAdd
                value={selectedUserId}
                onValueChange={setSelectedUserId}
                options={userOptions}
                placeholder="Search users..."
                emptyText="No users found"
              />
            </div>

            <div className="space-y-2">
              <Label>Role</Label>
              <RadioGroup value={role} onValueChange={(value) => setRole(value as HiringTeamMember['role'])}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="hiring_manager" id="role-hm" />
                  <Label htmlFor="role-hm" className="font-normal">Hiring Manager</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="recruiter" id="role-rec" />
                  <Label htmlFor="role-rec" className="font-normal">Recruiter</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="interviewer" id="role-int" />
                  <Label htmlFor="role-int" className="font-normal">Interviewer</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="coordinator" id="role-coord" />
                  <Label htmlFor="role-coord" className="font-normal">Coordinator</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label>Permissions</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="perm-view"
                    checked={permissions.canViewApplications}
                    onCheckedChange={(checked) =>
                      setPermissions({ ...permissions, canViewApplications: !!checked })
                    }
                  />
                  <Label htmlFor="perm-view" className="font-normal">
                    View Applications
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="perm-shortlist"
                    checked={permissions.canShortlist}
                    onCheckedChange={(checked) =>
                      setPermissions({ ...permissions, canShortlist: !!checked })
                    }
                  />
                  <Label htmlFor="perm-shortlist" className="font-normal">
                    Shortlist Candidates
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="perm-schedule"
                    checked={permissions.canScheduleInterviews}
                    onCheckedChange={(checked) =>
                      setPermissions({ ...permissions, canScheduleInterviews: !!checked })
                    }
                  />
                  <Label htmlFor="perm-schedule" className="font-normal">
                    Schedule Interviews
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="perm-offer"
                    checked={permissions.canMakeOffers}
                    onCheckedChange={(checked) =>
                      setPermissions({ ...permissions, canMakeOffers: !!checked })
                    }
                  />
                  <Label htmlFor="perm-offer" className="font-normal">
                    Make Offers
                  </Label>
                </div>
              </div>
            </div>

            <Button
              onClick={handleAddExisting}
              disabled={!selectedUserId}
              className="w-full"
            >
              {editMember ? 'Update Team Member' : 'Add Team Member'}
            </Button>
          </TabsContent>

          <TabsContent value="invite" className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="invite-email">Email Address</Label>
              <Input
                id="invite-email"
                type="email"
                placeholder="john.doe@example.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="invite-name">Full Name</Label>
              <Input
                id="invite-name"
                placeholder="John Doe"
                value={inviteName}
                onChange={(e) => setInviteName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Role</Label>
              <RadioGroup value={role} onValueChange={(value) => setRole(value as HiringTeamMember['role'])}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="hiring_manager" id="invite-role-hm" />
                  <Label htmlFor="invite-role-hm" className="font-normal">Hiring Manager</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="recruiter" id="invite-role-rec" />
                  <Label htmlFor="invite-role-rec" className="font-normal">Recruiter</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="interviewer" id="invite-role-int" />
                  <Label htmlFor="invite-role-int" className="font-normal">Interviewer</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="coordinator" id="invite-role-coord" />
                  <Label htmlFor="invite-role-coord" className="font-normal">Coordinator</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label>Permissions</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="invite-perm-view"
                    checked={permissions.canViewApplications}
                    onCheckedChange={(checked) =>
                      setPermissions({ ...permissions, canViewApplications: !!checked })
                    }
                  />
                  <Label htmlFor="invite-perm-view" className="font-normal">
                    View Applications
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="invite-perm-shortlist"
                    checked={permissions.canShortlist}
                    onCheckedChange={(checked) =>
                      setPermissions({ ...permissions, canShortlist: !!checked })
                    }
                  />
                  <Label htmlFor="invite-perm-shortlist" className="font-normal">
                    Shortlist Candidates
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="invite-perm-schedule"
                    checked={permissions.canScheduleInterviews}
                    onCheckedChange={(checked) =>
                      setPermissions({ ...permissions, canScheduleInterviews: !!checked })
                    }
                  />
                  <Label htmlFor="invite-perm-schedule" className="font-normal">
                    Schedule Interviews
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="invite-perm-offer"
                    checked={permissions.canMakeOffers}
                    onCheckedChange={(checked) =>
                      setPermissions({ ...permissions, canMakeOffers: !!checked })
                    }
                  />
                  <Label htmlFor="invite-perm-offer" className="font-normal">
                    Make Offers
                  </Label>
                </div>
              </div>
            </div>

            <div className="rounded-lg bg-muted p-3 text-sm text-muted-foreground">
              User will receive an email invitation to join the platform and this hiring team
            </div>

            <Button
              onClick={handleInviteNew}
              disabled={!inviteEmail || !inviteName}
              className="w-full"
            >
              {editMember ? 'Update Member' : 'Send Invite'}
            </Button>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
