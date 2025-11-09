import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Edit, UserCog, Percent } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { CommissionRole, CommissionRoleType } from "@/types/commissionRole";
import { getAllCommissionRoles, createCommissionRole, updateCommissionRole } from "@/lib/multiRoleCommissionStorage";

const roleSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(50, "Name must be less than 50 characters"),
  type: z.enum(['sales-agent', 'recruiter', 'account-manager', 'team-lead', 'sourcing-specialist', 'custom']),
  description: z.string().trim().max(200, "Description must be less than 200 characters").optional(),
  defaultRate: z.string().regex(/^\d+(\.\d{1,2})?$/, "Invalid percentage").refine((val) => {
    const num = parseFloat(val);
    return num >= 0 && num <= 100;
  }, "Rate must be between 0 and 100"),
  isActive: z.boolean(),
});

type RoleFormData = z.infer<typeof roleSchema>;

const roleTypeLabels: Record<CommissionRoleType, string> = {
  'sales-agent': 'Sales Agent',
  'recruiter': 'Recruiter',
  'account-manager': 'Account Manager',
  'team-lead': 'Team Lead',
  'sourcing-specialist': 'Sourcing Specialist',
  'custom': 'Custom Role',
};

export function CommissionRoleManager() {
  const [roles, setRoles] = useState<CommissionRole[]>(getAllCommissionRoles());
  const [editingRole, setEditingRole] = useState<CommissionRole | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<RoleFormData>({
    resolver: zodResolver(roleSchema),
    defaultValues: {
      name: "",
      type: "sales-agent",
      description: "",
      defaultRate: "0",
      isActive: true,
    },
  });

  const onSubmit = (data: RoleFormData) => {
    try {
      const roleData = {
        name: data.name,
        type: data.type,
        description: data.description,
        defaultRate: parseFloat(data.defaultRate),
        isActive: data.isActive,
      };

      if (editingRole) {
        const updated = updateCommissionRole(editingRole.id, roleData);
        if (updated) {
          setRoles(getAllCommissionRoles());
          toast({
            title: "Role Updated",
            description: `${data.name} has been updated successfully.`,
          });
        }
      } else {
        createCommissionRole(roleData);
        setRoles(getAllCommissionRoles());
        toast({
          title: "Role Created",
          description: `${data.name} has been created successfully.`,
        });
      }
      
      setDialogOpen(false);
      setEditingRole(null);
      form.reset();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save commission role.",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (role: CommissionRole) => {
    setEditingRole(role);
    form.reset({
      name: role.name,
      type: role.type,
      description: role.description || "",
      defaultRate: role.defaultRate.toString(),
      isActive: role.isActive,
    });
    setDialogOpen(true);
  };

  const handleToggleActive = (role: CommissionRole) => {
    const updated = updateCommissionRole(role.id, { isActive: !role.isActive });
    if (updated) {
      setRoles(getAllCommissionRoles());
      toast({
        title: role.isActive ? "Role Deactivated" : "Role Activated",
        description: `${role.name} is now ${!role.isActive ? 'active' : 'inactive'}.`,
      });
    }
  };

  const handleDialogClose = (open: boolean) => {
    setDialogOpen(open);
    if (!open) {
      setEditingRole(null);
      form.reset();
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <UserCog className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle>Commission Roles</CardTitle>
              <CardDescription>Manage commission roles and default rates</CardDescription>
            </div>
          </div>
          <Dialog open={dialogOpen} onOpenChange={handleDialogClose}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Role
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{editingRole ? "Edit Commission Role" : "Create Commission Role"}</DialogTitle>
                <DialogDescription>
                  {editingRole ? "Update the commission role details below." : "Add a new commission role for your team."}
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Role Name</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Senior Sales Agent" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Role Type</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {Object.entries(roleTypeLabels).map(([value, label]) => (
                                <SelectItem key={value} value={value}>
                                  {label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Brief description of this role's responsibilities"
                            rows={3}
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="defaultRate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Default Commission Rate (%)</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input type="text" placeholder="15" {...field} />
                            <Percent className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          </div>
                        </FormControl>
                        <FormDescription>Default percentage for this role</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="isActive"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Active</FormLabel>
                          <FormDescription>
                            Enable this role for commission assignments
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end gap-2 pt-4">
                    <Button type="button" variant="outline" onClick={() => handleDialogClose(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">
                      {editingRole ? "Update" : "Create"} Role
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Role Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Default Rate</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {roles.map((role) => (
              <TableRow key={role.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{role.name}</div>
                    {role.description && (
                      <div className="text-sm text-muted-foreground">{role.description}</div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{roleTypeLabels[role.type]}</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <span className="font-semibold">{role.defaultRate}%</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={role.isActive ? "default" : "secondary"}>
                    {role.isActive ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(role)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleToggleActive(role)}
                    >
                      <Switch checked={role.isActive} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
