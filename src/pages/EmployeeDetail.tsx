import { useParams, useNavigate } from "react-router-dom";
import { DashboardPageLayout } from "@/components/layouts/DashboardPageLayout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Edit, Mail, Phone } from "lucide-react";
import { getEmployeeById } from "@/lib/employeeStorage";
import { EntityAvatar } from "@/components/tables/EntityAvatar";
import { EmployeeStatusBadge } from "@/components/hrms/EmployeeStatusBadge";
import { EmploymentTypeBadge } from "@/components/hrms/EmploymentTypeBadge";
import { EmployeeOverviewTab } from "@/components/hrms/detail/EmployeeOverviewTab";
import { EmployeeDocumentsTab } from "@/components/hrms/detail/EmployeeDocumentsTab";
import { EmployeeHistoryTab } from "@/components/hrms/detail/EmployeeHistoryTab";
import { EmployeeNotesTab } from "@/components/hrms/detail/EmployeeNotesTab";

export default function EmployeeDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const employee = id ? getEmployeeById(id) : undefined;

  if (!employee) {
    return (
      <DashboardPageLayout>
        <div className="p-6">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-2">Employee Not Found</h2>
            <p className="text-muted-foreground mb-4">
              The employee you're looking for doesn't exist.
            </p>
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
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/hrms")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <EntityAvatar
                  name={`${employee.firstName} ${employee.lastName}`}
                  src={employee.avatar}
                  size="lg"
                />
                <div>
                  <h1 className="text-3xl font-bold">
                    {employee.firstName} {employee.lastName}
                  </h1>
                  <p className="text-lg text-muted-foreground">{employee.jobTitle}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Mail className="h-4 w-4" />
                      {employee.email}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Phone className="h-4 w-4" />
                      {employee.phone}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-3">
                    <EmployeeStatusBadge status={employee.status} />
                    <EmploymentTypeBadge type={employee.employmentType} />
                    <span className="text-sm text-muted-foreground">
                      ID: {employee.employeeId}
                    </span>
                  </div>
                </div>
              </div>
              <Button>
                <Edit className="mr-2 h-4 w-4" />
                Edit Profile
              </Button>
            </div>
          </div>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="history">Employment History</TabsTrigger>
            <TabsTrigger value="notes">Notes</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <EmployeeOverviewTab employee={employee} />
          </TabsContent>

          <TabsContent value="documents" className="space-y-6">
            <EmployeeDocumentsTab employeeId={employee.id} />
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <EmployeeHistoryTab employeeId={employee.id} />
          </TabsContent>

          <TabsContent value="notes" className="space-y-6">
            <EmployeeNotesTab employeeId={employee.id} />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardPageLayout>
  );
}
