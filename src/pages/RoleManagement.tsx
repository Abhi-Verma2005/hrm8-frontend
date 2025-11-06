import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DashboardPageLayout } from "@/components/layouts/DashboardPageLayout";
import { Shield, Plus, Crown, Users } from "lucide-react";
import { useRBAC } from "@/hooks/useRBAC";
import { getAllUserRoles } from "@/lib/rbacService";
import { Badge } from "@/components/ui/badge";
import { DataTable, Column } from "@/components/tables/DataTable";
import { UserRole, ROLE_PERMISSIONS } from "@/types/rbac";

export default function RoleManagement() {
  const { isSuperAdmin } = useRBAC();
  const userRoles = getAllUserRoles();

  const roleColumns: Column<UserRole>[] = [
    {
      accessorKey: "userId",
      header: "User ID",
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => (
        <Badge variant="default">{row.original.role}</Badge>
      ),
    },
    {
      accessorKey: "departmentId",
      header: "Department",
      cell: ({ row }) => row.original.departmentId || "-",
    },
    {
      accessorKey: "grantedAt",
      header: "Granted",
      cell: ({ row }) => new Date(row.original.grantedAt).toLocaleDateString(),
    },
    {
      accessorKey: "expiresAt",
      header: "Expires",
      cell: ({ row }) => (row.original.expiresAt ? new Date(row.original.expiresAt).toLocaleDateString() : "Never"),
    },
    {
      accessorKey: "isActive",
      header: "Status",
      cell: ({ row }) => (
        <Badge variant={row.original.isActive ? "default" : "secondary"}>
          {row.original.isActive ? "Active" : "Inactive"}
        </Badge>
      ),
    },
  ];

  if (!isSuperAdmin) {
    return (
      <DashboardPageLayout>
        <div className="p-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 text-muted-foreground">
                <Shield className="h-8 w-8" />
                <div>
                  <p className="font-semibold">Access Restricted</p>
                  <p className="text-sm">Only super administrators can manage roles.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardPageLayout>
    );
  }

  return (
    <DashboardPageLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Shield className="h-8 w-8" />
              Role Management
            </h1>
            <p className="text-muted-foreground">
              Manage user roles and permissions across the system
            </p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Assign Role
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Roles</p>
                  <p className="text-2xl font-bold">{userRoles.length}</p>
                </div>
                <Shield className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Users</p>
                  <p className="text-2xl font-bold">{userRoles.filter((r) => r.isActive).length}</p>
                </div>
                <Users className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Administrators</p>
                  <p className="text-2xl font-bold">
                    {userRoles.filter((r) => r.role === 'super_admin' || r.role === 'hr_admin').length}
                  </p>
                </div>
                <Crown className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Role Definitions */}
        <Card>
          <CardHeader>
            <CardTitle>Role Definitions</CardTitle>
            <CardDescription>Understanding role hierarchy and permissions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {ROLE_PERMISSIONS.map((rolePermission) => (
                <div key={rolePermission.role} className="p-4 rounded-lg border">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="default">{rolePermission.role}</Badge>
                        {(rolePermission.role === 'super_admin' || rolePermission.role === 'hr_admin') && (
                          <Crown className="h-4 w-4 text-yellow-500" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{rolePermission.description}</p>
                      <div className="flex flex-wrap gap-1">
                        {rolePermission.permissions.slice(0, 5).map((perm) => (
                          <Badge key={perm} variant="outline" className="text-xs">
                            {perm}
                          </Badge>
                        ))}
                        {rolePermission.permissions.length > 5 && (
                          <Badge variant="outline" className="text-xs">
                            +{rolePermission.permissions.length - 5} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* User Roles Table */}
        <Card>
          <CardHeader>
            <CardTitle>Assigned Roles</CardTitle>
            <CardDescription>Current role assignments across users</CardDescription>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={roleColumns}
              data={userRoles}
              searchKey="userId"
              searchPlaceholder="Search by user ID..."
            />
          </CardContent>
        </Card>
      </div>
    </DashboardPageLayout>
  );
}
