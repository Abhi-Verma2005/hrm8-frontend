import { useMemo, useState } from "react";
import { DashboardPageLayout } from "@/components/layouts/DashboardPageLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getEmployees } from "@/lib/employeeStorage";
import { Employee } from "@/types/employee";
import { EntityAvatar } from "@/components/tables/EntityAvatar";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";
import { Link } from "react-router-dom";

interface OrgNode {
  employee: Employee;
  reports: OrgNode[];
}

function buildOrgTree(employees: Employee[]): OrgNode[] {
  const employeeMap = new Map(employees.map(emp => [emp.id, emp]));
  const rootNodes: OrgNode[] = [];
  const nodeMap = new Map<string, OrgNode>();

  // Create nodes
  employees.forEach(emp => {
    nodeMap.set(emp.id, { employee: emp, reports: [] });
  });

  // Build tree structure
  employees.forEach(emp => {
    const node = nodeMap.get(emp.id)!;
    if (emp.managerId && employeeMap.has(emp.managerId)) {
      const managerNode = nodeMap.get(emp.managerId)!;
      managerNode.reports.push(node);
    } else {
      rootNodes.push(node);
    }
  });

  return rootNodes;
}

function EmployeeCard({ node, searchQuery }: { node: OrgNode; searchQuery: string }) {
  const { employee, reports } = node;
  const matchesSearch = searchQuery === "" || 
    employee.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    employee.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    employee.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
    employee.department.toLowerCase().includes(searchQuery.toLowerCase());

  if (!matchesSearch && reports.every(r => !matchesReportSearch(r, searchQuery))) {
    return null;
  }

  return (
    <div className="flex flex-col items-center">
      <Link to={`/hrms/employees/${employee.id}`}>
        <Card className="w-64 hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-4">
            <div className="flex flex-col items-center text-center space-y-3">
              <EntityAvatar
                name={`${employee.firstName} ${employee.lastName}`}
                src={employee.avatar}
                type="person"
                size="lg"
              />
              <div>
                <div className="font-semibold">
                  {employee.firstName} {employee.lastName}
                </div>
                <div className="text-sm text-muted-foreground">{employee.jobTitle}</div>
                <Badge variant="outline" className="mt-2">{employee.department}</Badge>
              </div>
              {reports.length > 0 && (
                <div className="text-xs text-muted-foreground">
                  {reports.length} {reports.length === 1 ? 'report' : 'reports'}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </Link>

      {reports.length > 0 && (
        <div className="flex flex-col items-center mt-8">
          <div className="h-8 w-0.5 bg-border" />
          <div className="flex gap-8">
            {reports.map((report) => (
              <div key={report.employee.id} className="flex flex-col items-center">
                <div className="h-8 w-0.5 bg-border" />
                <EmployeeCard node={report} searchQuery={searchQuery} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function matchesReportSearch(node: OrgNode, searchQuery: string): boolean {
  if (searchQuery === "") return true;
  
  const employee = node.employee;
  const matches = 
    employee.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    employee.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    employee.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
    employee.department.toLowerCase().includes(searchQuery.toLowerCase());

  if (matches) return true;
  return node.reports.some(r => matchesReportSearch(r, searchQuery));
}

export default function OrgChart() {
  const [searchQuery, setSearchQuery] = useState("");
  const employees = getEmployees().filter(e => e.status === 'active');
  
  const orgTree = useMemo(() => buildOrgTree(employees), [employees]);

  return (
    <DashboardPageLayout>
      <div className="p-12 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Organization Chart</h1>
            <p className="text-muted-foreground">
              Visual representation of reporting structure
            </p>
          </div>
          <div className="w-64">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search employees..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
        </div>

        <div className="overflow-auto pb-8">
          <div className="min-w-max p-8 flex gap-8 justify-center">
            {orgTree.map((node) => (
              <EmployeeCard key={node.employee.id} node={node} searchQuery={searchQuery} />
            ))}
          </div>
        </div>
      </div>
    </DashboardPageLayout>
  );
}
