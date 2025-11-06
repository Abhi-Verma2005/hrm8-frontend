import { useParams, useNavigate } from "react-router-dom";
import { DashboardPageLayout } from "@/components/layouts/DashboardPageLayout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit, Mail, Phone, MapPin, Calendar, DollarSign } from "lucide-react";
import { getEmployeeById } from "@/lib/employeeStorage";
import { EmployeeStatusBadge } from "@/components/hrms/EmployeeStatusBadge";
import { EmploymentTypeBadge } from "@/components/hrms/EmploymentTypeBadge";
import { EntityAvatar } from "@/components/tables/EntityAvatar";
import { format } from "date-fns";
import { useState } from "react";
import { EmployeeFormDialog } from "@/components/hrms/EmployeeFormDialog";
import { EmployeeDocuments } from "@/components/hrms/EmployeeDocuments";
import { EmployeeNotes } from "@/components/hrms/EmployeeNotes";
import { EmployeeHistory } from "@/components/hrms/EmployeeHistory";

export default function EmployeeDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const employee = getEmployeeById(id!);

  if (!employee) {
    return (
      <DashboardPageLayout>
        <div className="p-6">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-2">Employee Not Found</h2>
            <p className="text-muted-foreground mb-4">The employee you're looking for doesn't exist.</p>
            <Button onClick={() => navigate("/hrms")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Employees
            </Button>
          </div>
        </div>
      </DashboardPageLayout>
    );
  }

  return (
    <DashboardPageLayout>
      <div className="p-6 space-y-6" key={refreshKey}>
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate("/hrms")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Employees
          </Button>
          <Button onClick={() => setEditDialogOpen(true)}>
            <Edit className="mr-2 h-4 w-4" />
            Edit Employee
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-start gap-6">
              <EntityAvatar
                name={`${employee.firstName} ${employee.lastName}`}
                src={employee.avatar}
                type="person"
                size="lg"
              />
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <CardTitle className="text-3xl">
                    {employee.firstName} {employee.lastName}
                  </CardTitle>
                  <EmployeeStatusBadge status={employee.status} />
                </div>
                <CardDescription className="text-lg">{employee.jobTitle}</CardDescription>
                <div className="flex flex-wrap gap-2 mt-3">
                  <Badge variant="outline">{employee.department}</Badge>
                  <EmploymentTypeBadge type={employee.employmentType} />
                  <Badge variant="outline" className="font-mono">{employee.employeeId}</Badge>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="notes">Notes</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{employee.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{employee.phone}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                    <div>
                      <div>{employee.address}</div>
                      <div>{employee.city}, {employee.state} {employee.postalCode}</div>
                      <div>{employee.country}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Employment Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>Hired: {format(new Date(employee.hireDate), "MMM d, yyyy")}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>Location: {employee.location}</span>
                  </div>
                  {employee.managerName && (
                    <div>
                      <span className="text-sm text-muted-foreground">Manager: </span>
                      <span>{employee.managerName}</span>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Compensation</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span className="text-2xl font-bold">
                      {new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: employee.currency,
                      }).format(employee.salary)}
                    </span>
                    <span className="text-sm text-muted-foreground">/ {employee.payFrequency}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <span className="text-sm text-muted-foreground">Date of Birth: </span>
                    <span>{format(new Date(employee.dateOfBirth), "MMM d, yyyy")}</span>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Gender: </span>
                    <span className="capitalize">{employee.gender.replace('-', ' ')}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {employee.emergencyContactName && (
              <Card>
                <CardHeader>
                  <CardTitle>Emergency Contact</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div>
                    <span className="text-sm text-muted-foreground">Name: </span>
                    <span>{employee.emergencyContactName}</span>
                  </div>
                  {employee.emergencyContactPhone && (
                    <div>
                      <span className="text-sm text-muted-foreground">Phone: </span>
                      <span>{employee.emergencyContactPhone}</span>
                    </div>
                  )}
                  {employee.emergencyContactRelationship && (
                    <div>
                      <span className="text-sm text-muted-foreground">Relationship: </span>
                      <span>{employee.emergencyContactRelationship}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {(employee.skills && employee.skills.length > 0) && (
              <Card>
                <CardHeader>
                  <CardTitle>Skills</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {employee.skills.map((skill, index) => (
                      <Badge key={index} variant="secondary">{skill}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {(employee.certifications && employee.certifications.length > 0) && (
              <Card>
                <CardHeader>
                  <CardTitle>Certifications</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {employee.certifications.map((cert, index) => (
                      <Badge key={index} variant="secondary">{cert}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {employee.notes && (
              <Card>
                <CardHeader>
                  <CardTitle>Additional Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm whitespace-pre-wrap">{employee.notes}</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="documents">
            <EmployeeDocuments employeeId={employee.id} />
          </TabsContent>

          <TabsContent value="notes">
            <EmployeeNotes employeeId={employee.id} />
          </TabsContent>

          <TabsContent value="history">
            <EmployeeHistory employeeId={employee.id} />
          </TabsContent>
        </Tabs>

        <EmployeeFormDialog
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          employee={employee}
          onSuccess={() => setRefreshKey(prev => prev + 1)}
        />
      </div>
    </DashboardPageLayout>
  );
}
