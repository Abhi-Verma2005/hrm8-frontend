import { useState, useEffect } from "react";
import { DashboardPageLayout } from "@/components/layouts/DashboardPageLayout";
import { Button } from "@/components/ui/button";
import { Plus, FileText } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getRequisitions } from "@/lib/mockRequisitionStorage";
import { JobRequisition } from "@/types/requisition";
import { formatDistanceToNow } from "date-fns";
import { Link } from "react-router-dom";

export default function Requisitions() {
  const [requisitions, setRequisitions] = useState<JobRequisition[]>([]);

  useEffect(() => {
    loadRequisitions();
  }, []);

  const loadRequisitions = () => {
    setRequisitions(getRequisitions());
  };

  const getStatusBadge = (status: JobRequisition['status']) => {
    const variants: Record<JobRequisition['status'], { variant: any; label: string }> = {
      draft: { variant: "outline", label: "Draft" },
      pending: { variant: "secondary", label: "Pending Approval" },
      approved: { variant: "default", label: "Approved" },
      rejected: { variant: "destructive", label: "Rejected" },
      cancelled: { variant: "outline", label: "Cancelled" },
      converted: { variant: "default", label: "Converted to Job" },
    };
    const { variant, label } = variants[status];
    return <Badge variant={variant}>{label}</Badge>;
  };

  const getPriorityBadge = (priority: JobRequisition['priority']) => {
    const colors: Record<JobRequisition['priority'], string> = {
      low: "bg-gray-100 text-gray-700",
      medium: "bg-blue-100 text-blue-700",
      high: "bg-orange-100 text-orange-700",
      urgent: "bg-red-100 text-red-700",
    };
    return <Badge className={colors[priority]} variant="outline">{priority}</Badge>;
  };

  return (
    <DashboardPageLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Job Requisitions</h1>
            <p className="text-muted-foreground">
              Manage hiring requests and approval workflows
            </p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Requisition
          </Button>
        </div>

        <div className="grid gap-4">
          {requisitions.map((req) => (
            <Card key={req.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-xl">{req.title}</CardTitle>
                    <CardDescription>
                      {req.department} • {req.numberOfPositions} position(s) • {req.location}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    {getStatusBadge(req.status)}
                    {getPriorityBadge(req.priority)}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>Requested by: {req.requestedByName}</span>
                    <span>•</span>
                    <span>
                      {formatDistanceToNow(new Date(req.requestDate), { addSuffix: true })}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm">
                      <span className="font-medium">Budget: </span>
                      <span>
                        ${req.estimatedSalary.min.toLocaleString()} - $
                        {req.estimatedSalary.max.toLocaleString()} {req.estimatedSalary.currency}
                      </span>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <Link to={`/requisitions/${req.id}`}>View Details</Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {requisitions.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-lg font-medium mb-2">No Requisitions</p>
                <p className="text-sm text-muted-foreground mb-4">
                  Create your first job requisition to start the approval process
                </p>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Requisition
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </DashboardPageLayout>
  );
}
