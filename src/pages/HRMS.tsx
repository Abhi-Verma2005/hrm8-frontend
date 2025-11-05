import { useState, useMemo } from "react";
import { DashboardPageLayout } from "@/components/layouts/DashboardPageLayout";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { DataTable } from "@/components/tables/DataTable";
import { employeeColumns } from "@/components/hrms/EmployeeTableColumns";
import { EmployeesFilterBar } from "@/components/hrms/EmployeesFilterBar";
import { AddEmployeeDialog } from "@/components/hrms/AddEmployeeDialog";
import { getEmployees } from "@/lib/employeeStorage";

export default function HRMS() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");
  const [addDialogOpen, setAddDialogOpen] = useState(false);
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
          <Button onClick={() => setAddDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Employee
          </Button>
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
        />

        <AddEmployeeDialog
          open={addDialogOpen}
          onOpenChange={setAddDialogOpen}
          onSuccess={() => setRefreshKey(prev => prev + 1)}
        />
      </div>
    </DashboardPageLayout>
  );
}
