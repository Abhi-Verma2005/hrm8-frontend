import { useState, useMemo } from "react";
import { DashboardPageLayout } from "@/components/layouts/DashboardPageLayout";
import { Button } from "@/components/ui/button";
import { Plus, Upload, Download, Image as ImageIcon, Edit2 } from "lucide-react";
import { DataTable } from "@/components/tables/DataTable";
import { createEmployeeColumns } from "@/components/hrms/EmployeeTableColumns";
import { EmployeesFilterBar } from "@/components/hrms/EmployeesFilterBar";
import { EmployeeFormDialog } from "@/components/hrms/EmployeeFormDialog";
import { BulkImportDialog } from "@/components/hrms/BulkImportDialog";
import { ExportDialog } from "@/components/hrms/ExportDialog";
import { BulkPhotoUploadDialog } from "@/components/hrms/BulkPhotoUploadDialog";
import { BulkEditDialog } from "@/components/hrms/BulkEditDialog";
import { Employee } from "@/types/employee";
import { getEmployees } from "@/lib/employeeStorage";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";

export default function HRMS() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [bulkImportDialogOpen, setBulkImportDialogOpen] = useState(false);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [bulkPhotoDialogOpen, setBulkPhotoDialogOpen] = useState(false);
  const [bulkEditDialogOpen, setBulkEditDialogOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | undefined>();
  const [selectedEmployees, setSelectedEmployees] = useState<Employee[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);

  const employees = useMemo(() => getEmployees(), [refreshKey]);

  const filteredEmployees = useMemo(() => {
    return employees.filter(employee => {
      const matchesSearch = 
        employee.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        employee.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        employee.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        employee.employeeId.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === "all" || employee.status === statusFilter;
      const matchesDepartment = departmentFilter === "all" || employee.department === departmentFilter;
      const matchesLocation = locationFilter === "all" || employee.location === locationFilter;

      return matchesSearch && matchesStatus && matchesDepartment && matchesLocation;
    });
  }, [employees, searchQuery, statusFilter, departmentFilter, locationFilter]);

  const handleEditEmployee = (employee: Employee) => {
    setEditingEmployee(employee);
    setFormDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setFormDialogOpen(false);
    setEditingEmployee(undefined);
  };

  const employeeColumns = useMemo(() => createEmployeeColumns({
    onEdit: handleEditEmployee,
  }), []);

  return (
    <DashboardPageLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Employee Records</h1>
            <p className="text-muted-foreground">
              Manage employee information, documents, and history
            </p>
          </div>
          <div className="flex gap-2">
            {selectedEmployees.length > 0 && (
              <Button 
                variant="outline" 
                onClick={() => setBulkEditDialogOpen(true)}
              >
                <Edit2 className="mr-2 h-4 w-4" />
                Edit {selectedEmployees.length}
              </Button>
            )}
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Upload className="mr-2 h-4 w-4" />
                  Import
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-background">
                <DropdownMenuItem onClick={() => setBulkImportDialogOpen(true)}>
                  <Upload className="mr-2 h-4 w-4" />
                  Import Employees (CSV/Excel)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setBulkPhotoDialogOpen(true)}>
                  <ImageIcon className="mr-2 h-4 w-4" />
                  Import Photos (ZIP)
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button variant="outline" onClick={() => setExportDialogOpen(true)}>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>

            <Button onClick={() => setFormDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Employee
            </Button>
          </div>
        </div>

        <EmployeesFilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          departmentFilter={departmentFilter}
          onDepartmentFilterChange={setDepartmentFilter}
          locationFilter={locationFilter}
          onLocationFilterChange={setLocationFilter}
        />

        <DataTable
          columns={employeeColumns}
          data={filteredEmployees}
          selectable
          onSelectedRowsChange={(ids) => {
            const selected = filteredEmployees.filter(emp => ids.includes(emp.id));
            setSelectedEmployees(selected);
          }}
        />

        <EmployeeFormDialog
          open={formDialogOpen}
          onOpenChange={handleCloseDialog}
          employee={editingEmployee}
          onSuccess={() => setRefreshKey(prev => prev + 1)}
        />

        <BulkImportDialog
          open={bulkImportDialogOpen}
          onOpenChange={setBulkImportDialogOpen}
          onSuccess={() => setRefreshKey(prev => prev + 1)}
        />

        <ExportDialog
          open={exportDialogOpen}
          onOpenChange={setExportDialogOpen}
          selectedEmployees={selectedEmployees.length > 0 ? selectedEmployees : undefined}
        />

        <BulkPhotoUploadDialog
          open={bulkPhotoDialogOpen}
          onOpenChange={setBulkPhotoDialogOpen}
          onSuccess={() => setRefreshKey(prev => prev + 1)}
        />

        <BulkEditDialog
          open={bulkEditDialogOpen}
          onOpenChange={setBulkEditDialogOpen}
          selectedEmployees={selectedEmployees}
          onSuccess={() => {
            setRefreshKey(prev => prev + 1);
            setSelectedEmployees([]);
          }}
        />
      </div>
    </DashboardPageLayout>
  );
}
