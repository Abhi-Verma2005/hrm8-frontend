import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2 } from "lucide-react";

export function EmployeesKanbanBoard() {
  return (
    <div className="flex items-center justify-center h-96">
      <Card className="max-w-md">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center">
              <Building2 className="h-6 w-6 text-foreground" />
            </div>
            <div>
              <CardTitle>Kanban View Coming Soon</CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            The Kanban board view for employee management is currently under development.
            This will allow you to organize employees by department, status, or custom workflows.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
