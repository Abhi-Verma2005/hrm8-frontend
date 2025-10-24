import { Column } from "@/components/tables/DataTable";
import { EmployerUser } from "@/types/employerUser";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MoreHorizontal, Edit, Trash2, Shield, Mail, Ban, CheckCircle } from "lucide-react";
import UserRoleBadge from "./UserRoleBadge";
import UserStatusBadge from "./UserStatusBadge";
import { formatDistanceToNow } from "date-fns";

export function createEmployerUserColumns(
  onEdit: (user: EmployerUser) => void,
  onDelete: (user: EmployerUser) => void,
  onEditPermissions: (user: EmployerUser) => void,
  onResendInvite: (user: EmployerUser) => void,
  onToggleStatus: (user: EmployerUser) => void
): Column<EmployerUser>[] {
  return [
    {
      key: "user",
      label: "User",
      render: (user) => {
        const initials = `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
        const fullName = `${user.firstName} ${user.lastName}`.trim() || "Pending";
        
        return (
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-primary/10 text-primary font-medium">
                {initials || "?"}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{fullName}</div>
              <div className="text-sm text-muted-foreground">{user.email}</div>
            </div>
          </div>
        );
      },
    },
    {
      key: "title",
      label: "Title & Department",
      render: (user) => {
        return (
          <div>
            <div className="font-medium">{user.title || "—"}</div>
            {user.department && (
              <div className="text-sm text-muted-foreground">{user.department}</div>
            )}
          </div>
        );
      },
    },
    {
      key: "role",
      label: "Role",
      render: (user) => <UserRoleBadge role={user.role} />,
    },
    {
      key: "status",
      label: "Status",
      render: (user) => <UserStatusBadge status={user.status} />,
    },
    {
      key: "lastLoginAt",
      label: "Last Login",
      render: (user) => {
        if (!user.lastLoginAt) {
          return <span className="text-muted-foreground">Never</span>;
        }
        
        return (
          <span className="text-sm">
            {formatDistanceToNow(new Date(user.lastLoginAt), { addSuffix: true })}
          </span>
        );
      },
    },
    {
      key: "actions",
      label: "",
      render: (user) => {
        const isOwner = user.role === "owner";
        
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
              <DropdownMenuItem onClick={() => onEdit(user)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit User
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEditPermissions(user)}>
                <Shield className="mr-2 h-4 w-4" />
                Edit Permissions
              </DropdownMenuItem>
              
              {user.status === "invited" && (
                <DropdownMenuItem onClick={() => onResendInvite(user)}>
                  <Mail className="mr-2 h-4 w-4" />
                  Resend Invite
                </DropdownMenuItem>
              )}
              
              <DropdownMenuSeparator />
              
              {user.status === "active" && (
                <DropdownMenuItem onClick={() => onToggleStatus(user)}>
                  <Ban className="mr-2 h-4 w-4" />
                  Suspend User
                </DropdownMenuItem>
              )}
              
              {user.status === "suspended" && (
                <DropdownMenuItem onClick={() => onToggleStatus(user)}>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Activate User
                </DropdownMenuItem>
              )}
              
              {!isOwner && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => onDelete(user)}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete User
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
}
