import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { EmployerUser, UserPermission } from "@/types/employerUser";
import { Shield } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface UserPermissionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: EmployerUser | null;
  onSave: (userId: string, permissions: UserPermission[]) => void;
}

const permissionGroups = [
  {
    label: "Jobs",
    permissions: [
      { value: "manage_jobs" as UserPermission, label: "Manage Jobs", description: "Create, edit, and delete job postings" },
      { value: "view_jobs" as UserPermission, label: "View Jobs", description: "View all job postings" },
    ],
  },
  {
    label: "Candidates",
    permissions: [
      { value: "manage_candidates" as UserPermission, label: "Manage Candidates", description: "Review, approve, and manage candidates" },
      { value: "view_candidates" as UserPermission, label: "View Candidates", description: "View candidate profiles and applications" },
    ],
  },
  {
    label: "Billing",
    permissions: [
      { value: "manage_billing" as UserPermission, label: "Manage Billing", description: "Update payment methods and view invoices" },
      { value: "view_billing" as UserPermission, label: "View Billing", description: "View billing information and invoices" },
    ],
  },
  {
    label: "Administration",
    permissions: [
      { value: "manage_users" as UserPermission, label: "Manage Users", description: "Add, edit, and remove users" },
      { value: "manage_settings" as UserPermission, label: "Manage Settings", description: "Change company settings and preferences" },
    ],
  },
];

export default function UserPermissionsDialog({ open, onOpenChange, user, onSave }: UserPermissionsDialogProps) {
  const [selectedPermissions, setSelectedPermissions] = useState<UserPermission[]>(user?.permissions || []);

  const togglePermission = (permission: UserPermission) => {
    setSelectedPermissions(prev =>
      prev.includes(permission)
        ? prev.filter(p => p !== permission)
        : [...prev, permission]
    );
  };

  const handleSave = () => {
    if (user) {
      onSave(user.id, selectedPermissions);
      onOpenChange(false);
    }
  };

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Edit Permissions
          </DialogTitle>
          <DialogDescription>
            Customize permissions for {user.firstName} {user.lastName} ({user.role})
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {permissionGroups.map((group) => (
            <div key={group.label} className="space-y-3">
              <h4 className="font-semibold text-sm">{group.label}</h4>
              <div className="space-y-3 pl-4">
                {group.permissions.map((permission) => (
                  <div key={permission.value} className="flex items-start gap-3">
                    <Checkbox
                      id={permission.value}
                      checked={selectedPermissions.includes(permission.value)}
                      onCheckedChange={() => togglePermission(permission.value)}
                    />
                    <div className="flex-1">
                      <Label
                        htmlFor={permission.value}
                        className="font-medium cursor-pointer"
                      >
                        {permission.label}
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        {permission.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <Separator />
            </div>
          ))}
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Permissions</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
