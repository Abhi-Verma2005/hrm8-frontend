import { useState } from "react";
import { DataTable } from "@/components/tables/DataTable";
import { Button } from "@/components/ui/button";
import { UserPlus, Mail } from "lucide-react";
import { EmployerUser } from "@/types/employerUser";
import { getEmployerUsers, createEmployerUser, updateEmployerUser, deleteEmployerUser, inviteUser } from "@/lib/employerUserStorage";
import { createEmployerUserColumns } from "./EmployerUserTableColumns";
import AddUserDialog from "./AddUserDialog";
import InviteUserDialog from "./InviteUserDialog";
import UserPermissionsDialog from "./UserPermissionsDialog";
import { toast } from "sonner";
import { EmployerUserFormData } from "@/lib/validations/employerValidation";

interface EmployerUsersTabProps {
  employerId: string;
}

export default function EmployerUsersTab({ employerId }: EmployerUsersTabProps) {
  const [users, setUsers] = useState(getEmployerUsers(employerId));
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [permissionsDialogOpen, setPermissionsDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<EmployerUser | null>(null);

  const handleAddUser = (userData: EmployerUserFormData) => {
    const newUser = createEmployerUser({
      ...userData,
      employerId,
      status: "active",
    });
    setUsers(getEmployerUsers(employerId));
    toast.success("User added successfully");
  };

  const handleInviteUser = (email: string, role: EmployerUser['role']) => {
    inviteUser(employerId, email, role, "current-user-id");
    setUsers(getEmployerUsers(employerId));
    toast.success(`Invitation sent to ${email}`);
  };

  const handleEdit = (user: EmployerUser) => {
    toast.info("Edit functionality coming soon");
  };

  const handleDelete = (user: EmployerUser) => {
    if (confirm(`Are you sure you want to delete ${user.firstName} ${user.lastName}?`)) {
      deleteEmployerUser(user.id);
      setUsers(getEmployerUsers(employerId));
      toast.success("User deleted successfully");
    }
  };

  const handleEditPermissions = (user: EmployerUser) => {
    setSelectedUser(user);
    setPermissionsDialogOpen(true);
  };

  const handleSavePermissions = (userId: string, permissions: string[]) => {
    updateEmployerUser(userId, { permissions });
    setUsers(getEmployerUsers(employerId));
    toast.success("Permissions updated");
  };

  const handleResendInvite = (user: EmployerUser) => {
    toast.success(`Invitation resent to ${user.email}`);
  };

  const handleToggleStatus = (user: EmployerUser) => {
    const newStatus = user.status === "active" ? "suspended" : "active";
    updateEmployerUser(user.id, { status: newStatus });
    setUsers(getEmployerUsers(employerId));
    toast.success(`User ${newStatus === "active" ? "activated" : "suspended"}`);
  };

  const columns = createEmployerUserColumns(
    handleEdit,
    handleDelete,
    handleEditPermissions,
    handleResendInvite,
    handleToggleStatus
  );

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Button onClick={() => setAddDialogOpen(true)}>
          <UserPlus className="h-4 w-4 mr-2" />
          Add User
        </Button>
        <Button variant="outline" onClick={() => setInviteDialogOpen(true)}>
          <Mail className="h-4 w-4 mr-2" />
          Invite User
        </Button>
      </div>

      <DataTable
        data={users}
        columns={columns}
        searchable
        searchKeys={["firstName", "lastName", "email"]}
        emptyMessage="No users found"
      />

      <AddUserDialog open={addDialogOpen} onOpenChange={setAddDialogOpen} onAdd={handleAddUser} />
      <InviteUserDialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen} onInvite={handleInviteUser} />
      <UserPermissionsDialog
        open={permissionsDialogOpen}
        onOpenChange={setPermissionsDialogOpen}
        user={selectedUser}
        onSave={handleSavePermissions}
      />
    </div>
  );
}
