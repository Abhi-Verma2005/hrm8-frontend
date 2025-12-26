import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Department } from "@/types/entities";
import { Building2, Edit, Trash2, User, DollarSign } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface DepartmentCardProps {
  department: Department;
  onEdit: (department: Department) => void;
  onDelete: (department: Department) => void;
}

export default function DepartmentCard({ department, onEdit, onDelete }: DepartmentCardProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            <CardTitle className="text-base">{department.name}</CardTitle>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => onEdit(department)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => onDelete(department)}
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {department.description && (
          <p className="text-sm text-muted-foreground">{department.description}</p>
        )}

        <div className="space-y-2">
          {department.headOfDepartment && (
            <div className="flex items-center gap-2 text-sm">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Head:</span>
              <span className="font-medium">{department.headOfDepartment}</span>
            </div>
          )}

          {department.costCenter && (
            <div className="flex items-center gap-2 text-sm">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Cost Center:</span>
              <Badge variant="outline" className="text-xs">
                {department.costCenter}
              </Badge>
            </div>
          )}
        </div>

      </CardContent>
    </Card>
  );
}
