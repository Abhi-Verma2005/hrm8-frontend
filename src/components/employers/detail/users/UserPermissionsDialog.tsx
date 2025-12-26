import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { EmployerUser, UserPermission } from "@/types/employerUser";
import { Shield, Briefcase, Users, Lock } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { usePermissions } from "@/hooks/usePermissions";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface UserPermissionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: EmployerUser | null;
  onSave: (userId: string, permissions: UserPermission[]) => void;
}

const modulePermissionGroups = {
  ats: [
    {
      label: "Jobs & Recruitment",
      permissions: [
        { value: "manage_jobs" as UserPermission, label: "Manage Jobs", description: "Create, edit, and delete job postings" },
        { value: "view_jobs" as UserPermission, label: "View Jobs", description: "View all job postings" },
        { value: "recruitment.manage" as UserPermission, label: "Manage Recruitment", description: "Full recruitment process management" },
        { value: "recruitment.view" as UserPermission, label: "View Recruitment", description: "View recruitment data and reports" },
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
      label: "Administration",
      permissions: [
        { value: "manage_billing" as UserPermission, label: "Manage Billing", description: "Update payment methods and view invoices" },
        { value: "view_billing" as UserPermission, label: "View Billing", description: "View billing information and invoices" },
        { value: "manage_users" as UserPermission, label: "Manage Users", description: "Add, edit, and remove users" },
        { value: "manage_settings" as UserPermission, label: "Manage Settings", description: "Change company settings and preferences" },
      ],
    },
  ],
  hrms: [
    {
      label: "Employee Management",
      permissions: [
        { value: "employees.view" as UserPermission, label: "View Employees", description: "View employee records and profiles" },
        { value: "employees.create" as UserPermission, label: "Create Employees", description: "Add new employees to the system" },
        { value: "employees.edit" as UserPermission, label: "Edit Employees", description: "Update employee information" },
        { value: "employees.delete" as UserPermission, label: "Delete Employees", description: "Remove employees from the system" },
      ],
    },
    {
      label: "Payroll & Compensation",
      permissions: [
        { value: "payroll.view" as UserPermission, label: "View Payroll", description: "View payroll information" },
        { value: "payroll.process" as UserPermission, label: "Process Payroll", description: "Process and manage payroll" },
        { value: "payroll.approve" as UserPermission, label: "Approve Payroll", description: "Approve payroll submissions" },
        { value: "compensation.view" as UserPermission, label: "View Compensation", description: "View compensation data" },
        { value: "compensation.manage" as UserPermission, label: "Manage Compensation", description: "Manage compensation plans" },
        { value: "compensation.approve" as UserPermission, label: "Approve Compensation", description: "Approve compensation changes" },
      ],
    },
    {
      label: "Time & Attendance",
      permissions: [
        { value: "attendance.view" as UserPermission, label: "View Attendance", description: "View attendance records" },
        { value: "attendance.manage" as UserPermission, label: "Manage Attendance", description: "Manage attendance tracking" },
        { value: "attendance.approve" as UserPermission, label: "Approve Attendance", description: "Approve attendance records" },
        { value: "leave.view" as UserPermission, label: "View Leave", description: "View leave requests and balances" },
        { value: "leave.apply" as UserPermission, label: "Apply Leave", description: "Submit leave requests" },
        { value: "leave.approve" as UserPermission, label: "Approve Leave", description: "Approve/reject leave requests" },
      ],
    },
    {
      label: "Documents & Benefits",
      permissions: [
        { value: "documents.view" as UserPermission, label: "View Documents", description: "View employee documents" },
        { value: "documents.upload" as UserPermission, label: "Upload Documents", description: "Upload and manage documents" },
        { value: "documents.delete" as UserPermission, label: "Delete Documents", description: "Delete documents" },
        { value: "benefits.view" as UserPermission, label: "View Benefits", description: "View benefits information" },
        { value: "benefits.manage" as UserPermission, label: "Manage Benefits", description: "Manage benefits plans" },
        { value: "benefits.enroll" as UserPermission, label: "Enroll Benefits", description: "Enroll employees in benefits" },
      ],
    },
    {
      label: "Expenses & Operations",
      permissions: [
        { value: "expenses.view" as UserPermission, label: "View Expenses", description: "View expense reports" },
        { value: "expenses.submit" as UserPermission, label: "Submit Expenses", description: "Submit expense claims" },
        { value: "expenses.approve" as UserPermission, label: "Approve Expenses", description: "Approve expense claims" },
        { value: "onboarding.view" as UserPermission, label: "View Onboarding", description: "View onboarding processes" },
        { value: "onboarding.manage" as UserPermission, label: "Manage Onboarding", description: "Manage employee onboarding" },
        { value: "offboarding.view" as UserPermission, label: "View Offboarding", description: "View offboarding processes" },
        { value: "offboarding.manage" as UserPermission, label: "Manage Offboarding", description: "Manage employee offboarding" },
      ],
    },
    {
      label: "Reports & Settings",
      permissions: [
        { value: "reports.view" as UserPermission, label: "View Reports", description: "View reports and analytics" },
        { value: "reports.export" as UserPermission, label: "Export Reports", description: "Export reports and data" },
        { value: "settings.view" as UserPermission, label: "View Settings", description: "View system settings" },
        { value: "settings.manage" as UserPermission, label: "Manage Settings", description: "Manage system settings" },
      ],
    },
  ],
};

export default function UserPermissionsDialog({ open, onOpenChange, user, onSave }: UserPermissionsDialogProps) {
  const { user: currentUser } = usePermissions();
  const [selectedPermissions, setSelectedPermissions] = useState<UserPermission[]>(user?.permissions || []);

  const togglePermission = (permission: UserPermission, isDisabled: boolean) => {
    if (isDisabled) return;
    
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

  const renderModuleSection = (
    moduleKey: 'ats' | 'hrms',
    moduleName: string,
    icon: typeof Briefcase,
    isEnabled: boolean
  ) => {
    const ModuleIcon = icon;
    const groups = modulePermissionGroups[moduleKey];

    return (
      <div key={moduleKey} className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ModuleIcon className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">{moduleName} Module</h3>
          </div>
          <Badge variant={isEnabled ? "default" : "secondary"}>
            {isEnabled ? "Enabled" : "Disabled"}
          </Badge>
        </div>

        {!isEnabled && (
          <Alert>
            <Lock className="h-4 w-4" />
            <AlertDescription>
              {moduleName} module is not enabled. These permissions will not be available to users.
            </AlertDescription>
          </Alert>
        )}

        {groups.map((group) => (
          <div key={group.label} className="space-y-3">
            <h4 className="font-semibold text-sm text-muted-foreground">{group.label}</h4>
            <div className="space-y-3 pl-4">
              {group.permissions.map((permission) => {
                const isDisabled = !isEnabled;
                const isChecked = selectedPermissions.includes(permission.value);
                
                return (
                  <div 
                    key={permission.value} 
                    className={`flex items-start gap-3 ${isDisabled ? 'opacity-50' : ''}`}
                  >
                    <Checkbox
                      id={permission.value}
                      checked={isChecked}
                      disabled={isDisabled}
                      onCheckedChange={() => togglePermission(permission.value, isDisabled)}
                    />
                    <div className="flex-1">
                      <Label
                        htmlFor={permission.value}
                        className={`font-medium ${isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                      >
                        {permission.label}
                        {isDisabled && (
                          <Badge variant="outline" className="ml-2 text-xs">
                            Module Disabled
                          </Badge>
                        )}
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        {permission.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Edit Permissions
          </DialogTitle>
          <DialogDescription>
            Customize permissions for {user.firstName} {user.lastName} ({user.role})
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-8">
          {renderModuleSection('ats', 'ATS', Briefcase, currentUser.modules.atsEnabled)}
          <Separator />
          {renderModuleSection('hrms', 'HRMS', Users, currentUser.modules.hrmsEnabled)}
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
