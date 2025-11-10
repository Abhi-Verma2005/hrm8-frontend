import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardPageLayout } from "@/components/layouts/DashboardPageLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Plus, FileText } from "lucide-react";
import { getBackgroundChecks, saveBackgroundCheck } from "@/lib/mockBackgroundCheckStorage";
import { BackgroundCheck } from "@/types/backgroundCheck";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { BackgroundCheckForm } from "@/components/backgroundChecks/BackgroundCheckForm";
import { toast } from "@/hooks/use-toast";

export default function BackgroundChecks() {
  const navigate = useNavigate();
  const [checks, setChecks] = useState<BackgroundCheck[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    loadChecks();
  }, []);

  const loadChecks = () => {
    setChecks(getBackgroundChecks());
  };

  const handleInitiateCheck = (data: any) => {
    const newCheck: BackgroundCheck = {
      id: `bgc-${Date.now()}`,
      candidateId: 'cand-temp',
      candidateName: 'Sample Candidate',
      provider: data.provider,
      checkTypes: data.checkTypes.map((type: string) => ({
        type: type as any,
        required: true,
      })),
      status: 'pending-consent',
      initiatedBy: 'current-user',
      initiatedByName: 'Current User',
      initiatedDate: new Date().toISOString(),
      consentGiven: false,
      results: [],
      overallStatus: 'clear',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    saveBackgroundCheck(newCheck);
    loadChecks();
    setIsFormOpen(false);
    toast({
      title: "Background Check Initiated",
      description: "Consent request has been sent to the candidate.",
    });
  };

  const getStatusBadge = (status: BackgroundCheck['status']) => {
    const variants: Record<BackgroundCheck['status'], any> = {
      'not-started': "outline",
      'pending-consent': "secondary",
      'in-progress': "secondary",
      completed: "default",
      'issues-found': "destructive",
      cancelled: "outline",
    };
    return <Badge variant={variants[status]}>{status.replace('-', ' ')}</Badge>;
  };

  return (
    <DashboardPageLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Background Checks</h1>
            <p className="text-muted-foreground">
              Manage candidate screening and verification
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              onClick={() => navigate('/questionnaire-templates')}
            >
              <FileText className="h-4 w-4 mr-2" />
              Manage Templates
            </Button>
            <Button onClick={() => setIsFormOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Initiate Check
            </Button>
          </div>
        </div>

        <div className="grid gap-4">
          {checks.map((check) => (
            <Card key={check.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>{check.candidateName}</CardTitle>
                    <p className="text-sm text-muted-foreground capitalize">{check.provider} • {check.checkTypes.length} checks</p>
                  </div>
                  {getStatusBadge(check.status)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="text-sm">
                      Initiated by: {check.initiatedByName}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(check.initiatedDate), { addSuffix: true })}
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          {checks.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center">
                <Shield className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-lg font-medium mb-2">No Background Checks</p>
                <p className="text-sm text-muted-foreground">
                  Initiate background checks for candidates after offer acceptance
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Initiate Background Check</DialogTitle>
            </DialogHeader>
            <BackgroundCheckForm
              candidateName="Sample Candidate"
              onSubmit={handleInitiateCheck}
              onCancel={() => setIsFormOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>
    </DashboardPageLayout>
  );
}
