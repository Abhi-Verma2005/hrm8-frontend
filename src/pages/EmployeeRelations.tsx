import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DashboardPageLayout } from "@/components/layouts/DashboardPageLayout";
import { Shield, Plus, FileText, AlertCircle, Clock, CheckCircle2, TrendingUp, MoreHorizontal, Edit, Trash2 } from "lucide-react";
import { useRBAC } from "@/hooks/useRBAC";
import { getERCases, getERCaseStats, deleteERCase } from "@/lib/employeeRelationsStorage";
import { Badge } from "@/components/ui/badge";
import { DataTable, Column } from "@/components/tables/DataTable";
import { ERCase } from "@/types/employeeRelations";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ERCaseDialog } from "@/components/employee-relations/ERCaseDialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { DeleteConfirmationDialog } from "@/components/shared/DeleteConfirmationDialog";
import { toast } from "sonner";

export default function EmployeeRelations() {
  const { isHRAdmin, isSuperAdmin, isManager } = useRBAC();
  const [statusFilter, setStatusFilter] = useState<string | undefined>();
  const [caseDialogOpen, setCaseDialogOpen] = useState(false);
  const [editingCase, setEditingCase] = useState<ERCase | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [caseToDelete, setCaseToDelete] = useState<ERCase | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);
  const [selectedCases, setSelectedCases] = useState<string[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);

  const cases = getERCases({ status: statusFilter });
  const stats = getERCaseStats();

  const hasAccess = isHRAdmin || isSuperAdmin || isManager;

  const handleDeleteCase = () => {
    if (!caseToDelete) return;
    
    setIsDeleting(true);
    try {
      const success = deleteERCase(caseToDelete.id);
      if (success) {
        toast.success("ER case deleted successfully");
        setDeleteDialogOpen(false);
        setCaseToDelete(null);
        setRefreshKey(prev => prev + 1);
      } else {
        toast.error("Failed to delete case");
      }
    } catch (error) {
      toast.error("Failed to delete case");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleBulkDelete = () => {
    setIsDeleting(true);
    try {
      let successCount = 0;
      selectedCases.forEach((id) => {
        if (deleteERCase(id)) {
          successCount++;
        }
      });
      
      toast.success(`Successfully deleted ${successCount} case${successCount > 1 ? 's' : ''}`);
      setBulkDeleteDialogOpen(false);
      setSelectedCases([]);
      setRefreshKey(prev => prev + 1);
    } catch (error) {
      toast.error("Failed to delete cases");
    } finally {
      setIsDeleting(false);
    }
  };

  const caseColumns: Column<ERCase>[] = [
    {
      key: "caseNumber",
      label: "Case #",
      sortable: true,
    },
    {
      key: "type",
      label: "Type",
      sortable: true,
      render: (erCase) => (
        <Badge variant="outline">{erCase.type}</Badge>
      ),
    },
    {
      key: "category",
      label: "Category",
      sortable: true,
      render: (erCase) => (
        <Badge variant="secondary">{erCase.category}</Badge>
      ),
    },
    {
      key: "priority",
      label: "Priority",
      sortable: true,
      render: (erCase) => {
        const priority = erCase.priority;
        const colors = {
          low: "text-blue-600",
          medium: "text-yellow-600",
          high: "text-orange-600",
          urgent: "text-red-600",
        };
        return (
          <Badge variant="outline" className={colors[priority]}>
            {priority}
          </Badge>
        );
      },
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (erCase) => {
        const status = erCase.status;
        const colors = {
          open: "bg-blue-50 text-blue-700",
          investigating: "bg-yellow-50 text-yellow-700",
          "pending-action": "bg-orange-50 text-orange-700",
          resolved: "bg-green-50 text-green-700",
          closed: "bg-gray-50 text-gray-700",
        };
        return <Badge className={colors[status]}>{status}</Badge>;
      },
    },
    {
      key: "openedDate",
      label: "Opened",
      sortable: true,
      render: (erCase) => new Date(erCase.openedDate).toLocaleDateString(),
    },
    {
      key: "confidential",
      label: "Confidential",
      render: (erCase) =>
        erCase.confidential ? (
          <Shield className="h-4 w-4 text-red-500" />
        ) : (
          <span className="text-muted-foreground">-</span>
        ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (erCase) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-background">
            <DropdownMenuItem onClick={() => {
              setEditingCase(erCase);
              setCaseDialogOpen(true);
            }}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Case
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => {
                setCaseToDelete(erCase);
                setDeleteDialogOpen(true);
              }}
              className="text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Case
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  if (!hasAccess) {
    return (
      <DashboardPageLayout>
        <div className="p-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 text-muted-foreground">
                <Shield className="h-8 w-8" />
                <div>
                  <p className="font-semibold">Access Restricted</p>
                  <p className="text-sm">You don't have permission to view employee relations cases.</p>
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
              Employee Relations
            </h1>
            <p className="text-muted-foreground">
              Manage grievances, investigations, and disciplinary cases
            </p>
          </div>
          <Button onClick={() => setCaseDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Case
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Cases</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
                <FileText className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Open Cases</p>
                  <p className="text-2xl font-bold">{stats.open}</p>
                </div>
                <AlertCircle className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Investigating</p>
                  <p className="text-2xl font-bold">{stats.investigating}</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Resolved</p>
                  <p className="text-2xl font-bold">{stats.resolved}</p>
                </div>
                <CheckCircle2 className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Avg. Resolution</p>
                  <p className="text-2xl font-bold">{stats.avgResolutionTime}d</p>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Cases by Type */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {Object.entries(stats.byType).map(([type, count]) => (
            <Card key={type}>
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground capitalize">{type}</p>
                <p className="text-xl font-bold">{count}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content */}
        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all" onClick={() => setStatusFilter(undefined)}>
              All Cases
            </TabsTrigger>
            <TabsTrigger value="open" onClick={() => setStatusFilter('open')}>
              Open
            </TabsTrigger>
            <TabsTrigger value="investigating" onClick={() => setStatusFilter('investigating')}>
              Investigating
            </TabsTrigger>
            <TabsTrigger value="resolved" onClick={() => setStatusFilter('resolved')}>
              Resolved
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>All Cases</CardTitle>
                <CardDescription>
                  {cases.length === 0
                    ? "No cases found. Create your first case to get started."
                    : `Managing ${cases.length} employee relations case${cases.length > 1 ? 's' : ''}`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {cases.length > 0 ? (
                  <DataTable
                    columns={caseColumns}
                    data={cases}
                    searchKeys={["caseNumber", "type", "category"]}
                    selectable={true}
                    onSelectedRowsChange={setSelectedCases}
                    renderBulkActions={(selectedIds) => (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => setBulkDeleteDialogOpen(true)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Selected
                      </Button>
                    )}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Shield className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Cases Yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Get started by creating your first employee relations case
                    </p>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Create First Case
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="open" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Open Cases</CardTitle>
                <CardDescription>Cases requiring attention</CardDescription>
              </CardHeader>
              <CardContent>
                <DataTable
                  columns={caseColumns}
                  data={cases}
                  searchKeys={["caseNumber", "type", "category"]}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="investigating" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Under Investigation</CardTitle>
                <CardDescription>Active investigations</CardDescription>
              </CardHeader>
              <CardContent>
                <DataTable
                  columns={caseColumns}
                  data={cases}
                  searchKeys={["caseNumber", "type", "category"]}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="resolved" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Resolved Cases</CardTitle>
                <CardDescription>Completed and closed cases</CardDescription>
              </CardHeader>
              <CardContent>
                <DataTable
                  columns={caseColumns}
                  data={cases}
                  searchKeys={["caseNumber", "type", "category"]}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <ERCaseDialog
          open={caseDialogOpen}
          onOpenChange={(open) => {
            setCaseDialogOpen(open);
            if (!open) setEditingCase(null);
          }}
          editingCase={editingCase}
          onSuccess={() => {
            setRefreshKey(prev => prev + 1);
            setEditingCase(null);
          }}
        />
        
        <DeleteConfirmationDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          title="Delete ER Case"
          description={`Are you sure you want to delete case ${caseToDelete?.caseNumber}? This action cannot be undone.`}
          onConfirm={handleDeleteCase}
          isDeleting={isDeleting}
        />
        
        <DeleteConfirmationDialog
          open={bulkDeleteDialogOpen}
          onOpenChange={setBulkDeleteDialogOpen}
          title="Delete Multiple Cases"
          description={`Are you sure you want to delete ${selectedCases.length} case${selectedCases.length > 1 ? 's' : ''}? This action cannot be undone.`}
          onConfirm={handleBulkDelete}
          isDeleting={isDeleting}
        />
      </div>
    </DashboardPageLayout>
  );
}
