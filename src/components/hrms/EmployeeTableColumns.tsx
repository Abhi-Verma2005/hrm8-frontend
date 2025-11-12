import { Column } from "@/components/tables/DataTable";
import { Employee } from "@/types/employee";
import { EmployeeStatusBadge } from "./EmployeeStatusBadge";
import { EmploymentTypeBadge } from "./EmploymentTypeBadge";
import { EntityAvatar } from "@/components/tables/EntityAvatar";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Eye, Edit } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { format } from "date-fns";
import { Link } from "react-router-dom";

interface EmployeeColumnsOptions {
  onEdit?: (employee: Employee) => void;
}

export const createEmployeeColumns = (options?: EmployeeColumnsOptions): Column<Employee>[] => [
  {
    key: "name",
    label: "Name",
    sortable: true,
    width: "25%",
    render: (employee) => (
      <div className="flex items-center gap-3">
        <EntityAvatar
          name={`${employee.firstName} ${employee.lastName}`}
          src={employee.avatar}
          type="person"
          size="md"
        />
        <div className="min-w-0 flex-1">
          <Link
            to={`/hrms/employees/${employee.id}`}
            className="font-semibold text-base hover:underline cursor-pointer line-clamp-1 block"
          >
            {employee.firstName} {employee.lastName}
          </Link>
          <div className="text-sm text-muted-foreground truncate">{employee.email}</div>
        </div>
      </div>
    ),
  },
  {
    key: "employeeId",
    label: "Employee ID",
    sortable: true,
    width: "10%",
    render: (employee) => (
      <span className="font-mono text-sm">{employee.employeeId}</span>
    ),
  },
  {
    key: "jobTitle",
    label: "Job Title",
    sortable: true,
    width: "15%",
  },
  {
    key: "department",
    label: "Department",
    sortable: true,
    width: "12%",
  },
  {
    key: "location",
    label: "Location",
    sortable: true,
    width: "10%",
  },
  {
    key: "employmentType",
    label: "Type",
    sortable: true,
    width: "10%",
    render: (employee) => <EmploymentTypeBadge type={employee.employmentType} />,
  },
  {
    key: "status",
    label: "Status",
    sortable: true,
    width: "10%",
    render: (employee) => <EmployeeStatusBadge status={employee.status} />,
  },
  {
    key: "hireDate",
    label: "Hire Date",
    sortable: true,
    width: "10%",
    render: (employee) => format(new Date(employee.hireDate), "MMM d, yyyy"),
  },
  {
    key: "actions",
    label: "Actions",
    width: "60px",
    render: (employee) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="bg-background">
          <DropdownMenuItem asChild>
            <Link to={`/hrms/employees/${employee.id}`}>
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </Link>
          </DropdownMenuItem>
          {options?.onEdit && (
            <DropdownMenuItem onClick={() => options.onEdit!(employee)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Employee
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];
