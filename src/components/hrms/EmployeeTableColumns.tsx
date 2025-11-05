import { Column } from "@/components/tables/DataTable";
import { Employee } from "@/types/employee";
import { EmployeeStatusBadge } from "./EmployeeStatusBadge";
import { EmploymentTypeBadge } from "./EmploymentTypeBadge";
import { EntityAvatar } from "@/components/tables/EntityAvatar";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Eye } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { format } from "date-fns";
import { Link } from "react-router-dom";

export const employeeColumns: Column<Employee>[] = [
  {
    key: "employeeId",
    label: "Employee ID",
    sortable: true,
    render: (employee) => (
      <span className="font-mono text-sm">{employee.employeeId}</span>
    ),
  },
  {
    key: "name",
    label: "Name",
    sortable: true,
    render: (employee) => (
      <div className="flex items-center gap-3">
        <EntityAvatar
          name={`${employee.firstName} ${employee.lastName}`}
          src={employee.avatar}
        />
        <div>
          <div className="font-medium">{employee.firstName} {employee.lastName}</div>
          <div className="text-sm text-muted-foreground">{employee.email}</div>
        </div>
      </div>
    ),
  },
  {
    key: "jobTitle",
    label: "Job Title",
    sortable: true,
  },
  {
    key: "department",
    label: "Department",
    sortable: true,
  },
  {
    key: "location",
    label: "Location",
    sortable: true,
  },
  {
    key: "employmentType",
    label: "Type",
    sortable: true,
    render: (employee) => <EmploymentTypeBadge type={employee.employmentType} />,
  },
  {
    key: "status",
    label: "Status",
    sortable: true,
    render: (employee) => <EmployeeStatusBadge status={employee.status} />,
  },
  {
    key: "hireDate",
    label: "Hire Date",
    sortable: true,
    render: (employee) => format(new Date(employee.hireDate), "MMM d, yyyy"),
  },
  {
    key: "actions",
    label: "Actions",
    render: (employee) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            <Link to={`/hrms/employees/${employee.id}`}>
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];
