import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, MapPin, Users, Map as MapIcon } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { TerritoryMap } from "./TerritoryMap";

const territorySchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  description: z.string().trim().max(500, "Description must be less than 500 characters").optional(),
  region: z.string().min(1, "Region is required"),
  country: z.string().min(1, "Country is required").max(100),
  state: z.string().max(100).optional(),
  city: z.string().max(100).optional(),
  postalCode: z.string().max(20).optional(),
  latitude: z.string().regex(/^-?([0-9]{1,2}|1[0-7][0-9]|180)(\.[0-9]+)?$/, "Invalid latitude"),
  longitude: z.string().regex(/^-?([0-9]{1,2}|1[0-7][0-9]|180)(\.[0-9]+)?$/, "Invalid longitude"),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, "Invalid color format"),
  isActive: z.boolean(),
});

type TerritoryFormData = z.infer<typeof territorySchema>;

interface Territory extends TerritoryFormData {
  id: string;
  assignedReps: string[];
}

const assignmentSchema = z.object({
  territoryId: z.string().min(1, "Territory is required"),
  salesRepId: z.string().min(1, "Sales rep is required"),
  isPrimary: z.boolean(),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional(),
});

type AssignmentFormData = z.infer<typeof assignmentSchema>;

interface TerritoryAssignment extends AssignmentFormData {
  id: string;
  territoryName: string;
  salesRepName: string;
}

const mockTerritories: Territory[] = [
  {
    id: "1",
    name: "Northeast Region",
    description: "Covers New York, New Jersey, and Connecticut",
    region: "Northeast",
    country: "United States",
    state: "New York",
    city: "New York",
    latitude: "40.7128",
    longitude: "-74.0060",
    color: "#3B82F6",
    isActive: true,
    assignedReps: ["John Doe", "Jane Smith"],
  },
  {
    id: "2",
    name: "West Coast",
    description: "Covers California, Oregon, and Washington",
    region: "West",
    country: "United States",
    state: "California",
    city: "Los Angeles",
    latitude: "34.0522",
    longitude: "-118.2437",
    color: "#10B981",
    isActive: true,
    assignedReps: ["Mike Johnson"],
  },
  {
    id: "3",
    name: "Midwest Territory",
    description: "Covers Illinois, Wisconsin, and Minnesota",
    region: "Midwest",
    country: "United States",
    state: "Illinois",
    city: "Chicago",
    latitude: "41.8781",
    longitude: "-87.6298",
    color: "#F59E0B",
    isActive: true,
    assignedReps: ["Sarah Wilson"],
  },
  {
    id: "4",
    name: "Southern States",
    description: "Covers Texas, Louisiana, and Oklahoma",
    region: "South",
    country: "United States",
    state: "Texas",
    city: "Houston",
    latitude: "29.7604",
    longitude: "-95.3698",
    color: "#EF4444",
    isActive: true,
    assignedReps: ["Tom Brown", "Lisa Garcia"],
  },
];

const mockAssignments: TerritoryAssignment[] = [
  {
    id: "1",
    territoryId: "1",
    territoryName: "Northeast Region",
    salesRepId: "rep1",
    salesRepName: "John Doe",
    isPrimary: true,
    startDate: "2024-01-01",
  },
  {
    id: "2",
    territoryId: "1",
    territoryName: "Northeast Region",
    salesRepId: "rep2",
    salesRepName: "Jane Smith",
    isPrimary: false,
    startDate: "2024-02-01",
  },
  {
    id: "3",
    territoryId: "2",
    territoryName: "West Coast",
    salesRepId: "rep3",
    salesRepName: "Mike Johnson",
    isPrimary: true,
    startDate: "2024-01-15",
  },
];

const mockSalesReps = [
  { id: "rep1", name: "John Doe" },
  { id: "rep2", name: "Jane Smith" },
  { id: "rep3", name: "Mike Johnson" },
  { id: "rep4", name: "Sarah Wilson" },
  { id: "rep5", name: "Tom Brown" },
  { id: "rep6", name: "Lisa Garcia" },
];

export function TerritoryRegionsTab() {
  const [territories, setTerritories] = useState<Territory[]>(mockTerritories);
  const [assignments, setAssignments] = useState<TerritoryAssignment[]>(mockAssignments);
  const [editingTerritory, setEditingTerritory] = useState<Territory | null>(null);
  const [editingAssignment, setEditingAssignment] = useState<TerritoryAssignment | null>(null);
  const [territoryDialogOpen, setTerritoryDialogOpen] = useState(false);
  const [assignmentDialogOpen, setAssignmentDialogOpen] = useState(false);
  const { toast } = useToast();

  const territoryForm = useForm<TerritoryFormData>({
    resolver: zodResolver(territorySchema),
    defaultValues: {
      name: "",
      description: "",
      region: "",
      country: "United States",
      state: "",
      city: "",
      postalCode: "",
      latitude: "",
      longitude: "",
      color: "#3B82F6",
      isActive: true,
    },
  });

  const assignmentForm = useForm<AssignmentFormData>({
    resolver: zodResolver(assignmentSchema),
    defaultValues: {
      territoryId: "",
      salesRepId: "",
      isPrimary: false,
      startDate: new Date().toISOString().split('T')[0],
      endDate: "",
    },
  });

  const onSubmitTerritory = (data: TerritoryFormData) => {
    if (editingTerritory) {
      setTerritories(territories.map(t => 
        t.id === editingTerritory.id 
          ? { ...data, id: editingTerritory.id, assignedReps: editingTerritory.assignedReps } 
          : t
      ));
      toast({
        title: "Territory Updated",
        description: `${data.name} has been updated successfully.`,
      });
    } else {
      const newTerritory: Territory = {
        ...data,
        id: Date.now().toString(),
        assignedReps: [],
      };
      setTerritories([...territories, newTerritory]);
      toast({
        title: "Territory Created",
        description: `${data.name} has been created successfully.`,
      });
    }
    setTerritoryDialogOpen(false);
    setEditingTerritory(null);
    territoryForm.reset();
  };

  const onSubmitAssignment = (data: AssignmentFormData) => {
    const territory = territories.find(t => t.id === data.territoryId);
    const salesRep = mockSalesReps.find(r => r.id === data.salesRepId);

    if (editingAssignment) {
      setAssignments(assignments.map(a => 
        a.id === editingAssignment.id 
          ? { 
              ...data, 
              id: editingAssignment.id,
              territoryName: territory?.name || "",
              salesRepName: salesRep?.name || "",
            } 
          : a
      ));
      toast({
        title: "Assignment Updated",
        description: "Territory assignment has been updated successfully.",
      });
    } else {
      const newAssignment: TerritoryAssignment = {
        ...data,
        id: Date.now().toString(),
        territoryName: territory?.name || "",
        salesRepName: salesRep?.name || "",
      };
      setAssignments([...assignments, newAssignment]);
      toast({
        title: "Assignment Created",
        description: "Sales rep has been assigned to territory successfully.",
      });
    }
    setAssignmentDialogOpen(false);
    setEditingAssignment(null);
    assignmentForm.reset();
  };

  const handleEditTerritory = (territory: Territory) => {
    setEditingTerritory(territory);
    territoryForm.reset(territory);
    setTerritoryDialogOpen(true);
  };

  const handleEditAssignment = (assignment: TerritoryAssignment) => {
    setEditingAssignment(assignment);
    assignmentForm.reset(assignment);
    setAssignmentDialogOpen(true);
  };

  const handleDeleteTerritory = (id: string) => {
    const territory = territories.find(t => t.id === id);
    setTerritories(territories.filter(t => t.id !== id));
    toast({
      title: "Territory Deleted",
      description: `${territory?.name} has been deleted successfully.`,
      variant: "destructive",
    });
  };

  const handleDeleteAssignment = (id: string) => {
    setAssignments(assignments.filter(a => a.id !== id));
    toast({
      title: "Assignment Removed",
      description: "Territory assignment has been removed successfully.",
      variant: "destructive",
    });
  };

  const mapTerritories = territories
    .filter(t => t.isActive)
    .map(t => ({
      id: t.id,
      name: t.name,
      coordinates: [parseFloat(t.longitude), parseFloat(t.latitude)] as [number, number],
      color: t.color,
    }));

  return (
    <Tabs defaultValue="territories" className="space-y-4">
      <TabsList>
        <TabsTrigger value="territories">Territories</TabsTrigger>
        <TabsTrigger value="assignments">Assignments</TabsTrigger>
        <TabsTrigger value="map">Map View</TabsTrigger>
      </TabsList>

      <TabsContent value="territories" className="space-y-4">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle>Territories</CardTitle>
                  <CardDescription>Manage geographic territories and regions</CardDescription>
                </div>
              </div>
              <Dialog open={territoryDialogOpen} onOpenChange={(open) => {
                setTerritoryDialogOpen(open);
                if (!open) {
                  setEditingTerritory(null);
                  territoryForm.reset();
                }
              }}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Territory
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>{editingTerritory ? "Edit Territory" : "Create Territory"}</DialogTitle>
                    <DialogDescription>
                      {editingTerritory ? "Update territory details below." : "Add a new territory."}
                    </DialogDescription>
                  </DialogHeader>
                  <Form {...territoryForm}>
                    <form onSubmit={territoryForm.handleSubmit(onSubmitTerritory)} className="space-y-4">
                      <FormField
                        control={territoryForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Territory Name</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., Northeast Region" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={territoryForm.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Textarea placeholder="Brief description" rows={3} {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={territoryForm.control}
                          name="region"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Region</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select region" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="Northeast">Northeast</SelectItem>
                                  <SelectItem value="Southeast">Southeast</SelectItem>
                                  <SelectItem value="Midwest">Midwest</SelectItem>
                                  <SelectItem value="Southwest">Southwest</SelectItem>
                                  <SelectItem value="West">West</SelectItem>
                                  <SelectItem value="International">International</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={territoryForm.control}
                          name="country"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Country</FormLabel>
                              <FormControl>
                                <Input placeholder="United States" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={territoryForm.control}
                          name="state"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>State/Province</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., California" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={territoryForm.control}
                          name="city"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>City</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., Los Angeles" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={territoryForm.control}
                          name="latitude"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Latitude</FormLabel>
                              <FormControl>
                                <Input type="text" placeholder="40.7128" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={territoryForm.control}
                          name="longitude"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Longitude</FormLabel>
                              <FormControl>
                                <Input type="text" placeholder="-74.0060" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={territoryForm.control}
                        name="color"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Map Color</FormLabel>
                            <div className="flex gap-2">
                              <FormControl>
                                <Input type="color" {...field} className="w-20 h-10" />
                              </FormControl>
                              <Input value={field.value} onChange={field.onChange} className="flex-1" />
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={territoryForm.control}
                        name="isActive"
                        render={({ field }) => (
                          <FormItem className="flex items-center gap-2 space-y-0">
                            <FormControl>
                              <Switch checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                            <FormLabel className="!mt-0">Active</FormLabel>
                          </FormItem>
                        )}
                      />

                      <div className="flex justify-end gap-2 pt-4">
                        <Button type="button" variant="outline" onClick={() => setTerritoryDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button type="submit">
                          {editingTerritory ? "Update" : "Create"} Territory
                        </Button>
                      </div>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Region</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Assigned Reps</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {territories.map((territory) => (
                  <TableRow key={territory.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-4 h-4 rounded-full" 
                          style={{ backgroundColor: territory.color }}
                        />
                        <div>
                          <span className="font-medium">{territory.name}</span>
                          {territory.description && (
                            <p className="text-sm text-muted-foreground">{territory.description}</p>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{territory.region}</TableCell>
                    <TableCell>
                      {territory.city && territory.state ? `${territory.city}, ${territory.state}` : territory.country}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {territory.assignedReps.slice(0, 2).map((rep, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {rep}
                          </Badge>
                        ))}
                        {territory.assignedReps.length > 2 && (
                          <Badge variant="secondary" className="text-xs">
                            +{territory.assignedReps.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={territory.isActive ? "default" : "secondary"}>
                        {territory.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEditTerritory(territory)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Territory</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "{territory.name}"? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDeleteTerritory(territory.id)}>
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="assignments" className="space-y-4">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle>Territory Assignments</CardTitle>
                  <CardDescription>Assign sales reps to territories</CardDescription>
                </div>
              </div>
              <Dialog open={assignmentDialogOpen} onOpenChange={(open) => {
                setAssignmentDialogOpen(open);
                if (!open) {
                  setEditingAssignment(null);
                  assignmentForm.reset();
                }
              }}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Assign Rep
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-xl">
                  <DialogHeader>
                    <DialogTitle>{editingAssignment ? "Edit Assignment" : "Create Assignment"}</DialogTitle>
                    <DialogDescription>
                      {editingAssignment ? "Update assignment details." : "Assign a sales rep to a territory."}
                    </DialogDescription>
                  </DialogHeader>
                  <Form {...assignmentForm}>
                    <form onSubmit={assignmentForm.handleSubmit(onSubmitAssignment)} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={assignmentForm.control}
                          name="territoryId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Territory</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select territory" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {territories.map(t => (
                                    <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={assignmentForm.control}
                          name="salesRepId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Sales Rep</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select rep" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {mockSalesReps.map(rep => (
                                    <SelectItem key={rep.id} value={rep.id}>{rep.name}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={assignmentForm.control}
                          name="startDate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Start Date</FormLabel>
                              <FormControl>
                                <Input type="date" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={assignmentForm.control}
                          name="endDate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>End Date</FormLabel>
                              <FormControl>
                                <Input type="date" {...field} />
                              </FormControl>
                              <FormDescription>Leave empty for ongoing</FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={assignmentForm.control}
                        name="isPrimary"
                        render={({ field }) => (
                          <FormItem className="flex items-center gap-2 space-y-0">
                            <FormControl>
                              <Switch checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                            <FormLabel className="!mt-0">Primary Contact</FormLabel>
                          </FormItem>
                        )}
                      />

                      <div className="flex justify-end gap-2 pt-4">
                        <Button type="button" variant="outline" onClick={() => setAssignmentDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button type="submit">
                          {editingAssignment ? "Update" : "Create"} Assignment
                        </Button>
                      </div>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Territory</TableHead>
                  <TableHead>Sales Rep</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>End Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {assignments.map((assignment) => (
                  <TableRow key={assignment.id}>
                    <TableCell className="font-medium">{assignment.territoryName}</TableCell>
                    <TableCell>{assignment.salesRepName}</TableCell>
                    <TableCell>
                      <Badge variant={assignment.isPrimary ? "default" : "secondary"}>
                        {assignment.isPrimary ? "Primary" : "Secondary"}
                      </Badge>
                    </TableCell>
                    <TableCell>{assignment.startDate}</TableCell>
                    <TableCell>{assignment.endDate || "Ongoing"}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEditAssignment(assignment)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Remove Assignment</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to remove this assignment? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDeleteAssignment(assignment.id)}>
                                Remove
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="map" className="space-y-4">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <MapIcon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle>Territory Map</CardTitle>
                <CardDescription>Interactive visualization of all territories</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <TerritoryMap 
              territories={mapTerritories}
              onTerritoryClick={(territoryId) => {
                const territory = territories.find(t => t.id === territoryId);
                if (territory) {
                  toast({
                    title: territory.name,
                    description: territory.description || "Click to view details",
                  });
                }
              }}
            />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
