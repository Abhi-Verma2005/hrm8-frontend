import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { getEmployerLocations, getEmployerDepartments } from "@/lib/locationDepartmentStorage";
import LocationCard from "./LocationCard";
import DepartmentCard from "./DepartmentCard";
import { toast } from "sonner";

interface LocationsDepartmentsTabProps {
  employerId: string;
}

export default function LocationsDepartmentsTab({ employerId }: LocationsDepartmentsTabProps) {
  const [locations] = useState(getEmployerLocations(employerId));
  const [departments] = useState(getEmployerDepartments(employerId));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Locations</h3>
          <Button size="sm" onClick={() => toast.info("Add location dialog coming soon")}>
            <Plus className="h-4 w-4 mr-2" />
            Add Location
          </Button>
        </div>
        <div className="space-y-3">
          {locations.map((location) => (
            <LocationCard
              key={location.id}
              location={location}
              onEdit={() => toast.info("Edit coming soon")}
              onDelete={() => toast.info("Delete coming soon")}
              onSetPrimary={() => toast.info("Set primary coming soon")}
            />
          ))}
          {locations.length === 0 && (
            <p className="text-center text-muted-foreground py-8">No locations added yet</p>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Departments</h3>
          <Button size="sm" onClick={() => toast.info("Add department dialog coming soon")}>
            <Plus className="h-4 w-4 mr-2" />
            Add Department
          </Button>
        </div>
        <div className="space-y-3">
          {departments.map((department) => (
            <DepartmentCard
              key={department.id}
              department={department}
              onEdit={() => toast.info("Edit coming soon")}
              onDelete={() => toast.info("Delete coming soon")}
            />
          ))}
          {departments.length === 0 && (
            <p className="text-center text-muted-foreground py-8">No departments added yet</p>
          )}
        </div>
      </div>
    </div>
  );
}
