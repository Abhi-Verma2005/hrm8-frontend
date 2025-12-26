import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { 
  getEmployerLocations, 
  getEmployerDepartments,
  createLocation,
  updateLocation,
  deleteLocation,
  setPrimaryLocation,
  createDepartment,
  updateDepartment,
  deleteDepartment,
} from "@/lib/locationDepartmentStorage";
import LocationCard from "./LocationCard";
import DepartmentCard from "./DepartmentCard";
import { AddLocationDialog } from "@/components/jobs/AddLocationDialog";
import { AddDepartmentDialog } from "@/components/jobs/AddDepartmentDialog";
import { Location, Department } from "@/types/entities";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface LocationsDepartmentsTabProps {
  employerId: string;
  employer?: any;
}

export default function LocationsDepartmentsTab({ employerId, employer }: LocationsDepartmentsTabProps) {
  const [locations, setLocations] = useState(getEmployerLocations(employerId));
  const [departments, setDepartments] = useState(getEmployerDepartments(employerId));
  const [addLocationOpen, setAddLocationOpen] = useState(false);
  const [editLocationOpen, setEditLocationOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [deleteLocationOpen, setDeleteLocationOpen] = useState(false);
  const [addDepartmentOpen, setAddDepartmentOpen] = useState(false);
  const [editDepartmentOpen, setEditDepartmentOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [deleteDepartmentOpen, setDeleteDepartmentOpen] = useState(false);

  const handleAddLocation = (locationData: any) => {
    try {
      const newLocation = createLocation(employerId, locationData);
      setLocations([...locations, newLocation]);
      toast.success("Location added successfully");
    } catch (error) {
      toast.error("Failed to add location");
    }
  };

  const handleEditLocation = (locationData: any) => {
    if (!selectedLocation) return;
    
    try {
      const updated = updateLocation(employerId, selectedLocation.id, locationData);
      if (updated) {
        setLocations(locations.map(loc => 
          loc.id === updated.id ? updated : loc
        ));
        toast.success("Location updated successfully");
      }
    } catch (error) {
      toast.error("Failed to update location");
    }
  };

  const handleDeleteLocation = () => {
    if (!selectedLocation) return;
    
    try {
      const success = deleteLocation(employerId, selectedLocation.id);
      if (success) {
        setLocations(locations.filter(loc => loc.id !== selectedLocation.id));
        toast.success("Location deleted successfully");
        setDeleteLocationOpen(false);
        setSelectedLocation(null);
      } else {
        toast.error("Cannot delete primary location");
      }
    } catch (error) {
      toast.error("Failed to delete location");
    }
  };

  const handleSetPrimary = (location: Location) => {
    try {
      const success = setPrimaryLocation(employerId, location.id);
      if (success) {
        setLocations(getEmployerLocations(employerId));
        toast.success(`${location.name} set as primary location`);
      }
    } catch (error) {
      toast.error("Failed to set primary location");
    }
  };

  const handleAddDepartment = (departmentData: any) => {
    try {
      const newDepartment = createDepartment(employerId, departmentData);
      setDepartments([...departments, newDepartment]);
      toast.success("Department added successfully");
    } catch (error) {
      toast.error("Failed to add department");
    }
  };

  const handleEditDepartment = (departmentData: any) => {
    if (!selectedDepartment) return;
    
    try {
      const updated = updateDepartment(employerId, selectedDepartment.id, departmentData);
      if (updated) {
        setDepartments(departments.map(dept => 
          dept.id === updated.id ? updated : dept
        ));
        toast.success("Department updated successfully");
      }
    } catch (error) {
      toast.error("Failed to update department");
    }
  };

  const handleDeleteDepartment = () => {
    if (!selectedDepartment) return;
    
    try {
      const success = deleteDepartment(employerId, selectedDepartment.id);
      if (success) {
        setDepartments(departments.filter(dept => dept.id !== selectedDepartment.id));
        toast.success("Department deleted successfully");
        setDeleteDepartmentOpen(false);
        setSelectedDepartment(null);
      } else {
        toast.error("Failed to delete department");
      }
    } catch (error) {
      toast.error("Failed to delete department");
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Locations</h3>
          <Button size="sm" onClick={() => setAddLocationOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Location
          </Button>
        </div>
        <div className="space-y-3">
          {locations.map((location) => (
            <LocationCard
              key={location.id}
              location={location}
              onEdit={() => {
                setSelectedLocation(location);
                setEditLocationOpen(true);
              }}
              onDelete={() => {
                setSelectedLocation(location);
                setDeleteLocationOpen(true);
              }}
              onSetPrimary={() => handleSetPrimary(location)}
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
          <Button size="sm" onClick={() => setAddDepartmentOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Department
          </Button>
        </div>
        <div className="space-y-3">
          {departments.map((department) => (
            <DepartmentCard
              key={department.id}
              department={department}
              onEdit={() => {
                setSelectedDepartment(department);
                setEditDepartmentOpen(true);
              }}
              onDelete={() => {
                setSelectedDepartment(department);
                setDeleteDepartmentOpen(true);
              }}
            />
          ))}
          {departments.length === 0 && (
            <p className="text-center text-muted-foreground py-8">No departments added yet</p>
          )}
        </div>
      </div>

      {/* Add Location Dialog */}
      <AddLocationDialog
        open={addLocationOpen}
        onOpenChange={setAddLocationOpen}
        onAdd={handleAddLocation}
        employerName={employer?.companyName}
      />

      {/* Edit Location Dialog */}
      <AddLocationDialog
        open={editLocationOpen}
        onOpenChange={setEditLocationOpen}
        onAdd={handleEditLocation}
        employerName={employer?.companyName}
        editMode={true}
        initialData={selectedLocation || undefined}
      />

      {/* Delete Location Confirmation Dialog */}
      <AlertDialog open={deleteLocationOpen} onOpenChange={setDeleteLocationOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Location?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{selectedLocation?.name}"? 
              This action cannot be undone.
              {selectedLocation?.isPrimary && (
                <p className="mt-2 text-destructive font-medium">
                  This is a primary location and cannot be deleted.
                </p>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteLocation}
              className="bg-destructive hover:bg-destructive/90"
              disabled={selectedLocation?.isPrimary}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Add Department Dialog */}
      <AddDepartmentDialog
        open={addDepartmentOpen}
        onOpenChange={setAddDepartmentOpen}
        onAdd={handleAddDepartment}
        employerName={employer?.companyName}
      />

      {/* Edit Department Dialog */}
      <AddDepartmentDialog
        open={editDepartmentOpen}
        onOpenChange={setEditDepartmentOpen}
        onAdd={handleEditDepartment}
        employerName={employer?.companyName}
        editMode={true}
        initialData={selectedDepartment || undefined}
      />

      {/* Delete Department Confirmation Dialog */}
      <AlertDialog open={deleteDepartmentOpen} onOpenChange={setDeleteDepartmentOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Department?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{selectedDepartment?.name}"? 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteDepartment}
              className="bg-destructive hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
