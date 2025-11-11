import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ArrowLeft, Download, Calendar, CheckCircle, XCircle, Clock, AlertTriangle, User, FileText, Shield, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getBackgroundCheckById } from '@/lib/mockBackgroundCheckStorage';
import { getConsentsByBackgroundCheck, getConsentResponseByRequestId } from '@/lib/backgroundChecks/consentStorage';
import { getRefereesByBackgroundCheck } from '@/lib/backgroundChecks/refereeStorage';
import { exportBackgroundCheckPDF } from '@/lib/backgroundChecks/backgroundCheckExport';
import type { BackgroundCheck } from '@/types/backgroundCheck';
import type { ConsentRequest } from '@/types/consent';
import type { RefereeDetails } from '@/types/referee';
import BackgroundCheckTimeline from '@/components/backgroundChecks/BackgroundCheckTimeline';
import ConsentStatusSection from '@/components/backgroundChecks/ConsentStatusSection';
import RefereeResponsesSection from '@/components/backgroundChecks/RefereeResponsesSection';
import CheckResultsSection from '@/components/backgroundChecks/CheckResultsSection';

export default function BackgroundCheckDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [check, setCheck] = useState<BackgroundCheck | null>(null);
  const [consents, setConsents] = useState<ConsentRequest[]>([]);
  const [referees, setReferees] = useState<RefereeDetails[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const checkData = getBackgroundCheckById(id);
      if (checkData) {
        setCheck(checkData);
        setConsents(getConsentsByBackgroundCheck(id));
        setReferees(getRefereesByBackgroundCheck(id));
      }
      setLoading(false);
    }
  }, [id]);

  const handleExportPDF = () => {
    if (check) {
      exportBackgroundCheckPDF(check, consents, referees);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading background check details...</p>
        </div>
      </div>
    );
  }

  if (!check) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="p-8 text-center max-w-md">
          <AlertTriangle className="h-12 w-12 text-warning mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Background Check Not Found</h2>
          <p className="text-muted-foreground mb-4">
            The background check you're looking for doesn't exist or has been removed.
          </p>
          <Button onClick={() => navigate('/background-checks')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Background Checks
          </Button>
        </Card>
      </div>
    );
  }

  const statusConfig = {
    'not-started': { label: 'Not Started', variant: 'secondary' as const, icon: Clock },
    'pending-consent': { label: 'Pending Consent', variant: 'warning' as const, icon: Mail },
    'in-progress': { label: 'In Progress', variant: 'default' as const, icon: Clock },
    'completed': { label: 'Completed', variant: 'success' as const, icon: CheckCircle },
    'issues-found': { label: 'Issues Found', variant: 'destructive' as const, icon: AlertTriangle },
    'cancelled': { label: 'Cancelled', variant: 'secondary' as const, icon: XCircle },
  };

  const currentStatus = statusConfig[check.status];
  const StatusIcon = currentStatus.icon;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              onClick={() => navigate('/background-checks')}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Background Checks
            </Button>
            <Button onClick={handleExportPDF} className="gap-2">
              <Download className="h-4 w-4" />
              Export PDF Report
            </Button>
          </div>

          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold">{check.candidateName}</h1>
                  <p className="text-muted-foreground">Background Check #{check.id.slice(0, 8).toUpperCase()}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 mt-4">
                <Badge variant={currentStatus.variant} className="gap-1.5">
                  <StatusIcon className="h-3.5 w-3.5" />
                  {currentStatus.label}
                </Badge>
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  Initiated on {new Date(check.initiatedDate).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <User className="h-4 w-4" />
                  By {check.initiatedByName}
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="text-sm text-muted-foreground mb-1">Total Cost</div>
              <div className="text-3xl font-bold">${check.totalCost?.toFixed(2) || '0.00'}</div>
              {check.paymentStatus && (
                <Badge variant={check.paymentStatus === 'paid' ? 'success' : 'warning'} className="mt-2">
                  {check.paymentStatus.charAt(0).toUpperCase() + check.paymentStatus.slice(1)}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Timeline */}
          <div className="lg:col-span-1">
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Timeline
              </h2>
              <BackgroundCheckTimeline check={check} consents={consents} referees={referees} />
            </Card>

            {/* Quick Stats */}
            <Card className="p-6 mt-6">
              <h3 className="text-lg font-semibold mb-4">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Check Types</span>
                  <Badge variant="secondary">{check.checkTypes.length}</Badge>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Provider</span>
                  <Badge variant="outline">{check.provider.toUpperCase()}</Badge>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Referees</span>
                  <Badge variant="secondary">{referees.length}</Badge>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Consent Status</span>
                  <Badge variant={check.consentGiven ? 'success' : 'warning'}>
                    {check.consentGiven ? 'Given' : 'Pending'}
                  </Badge>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column - Detailed Information */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="results" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="results">Check Results</TabsTrigger>
                <TabsTrigger value="consent">Consent Status</TabsTrigger>
                <TabsTrigger value="referees">Referee Responses</TabsTrigger>
              </TabsList>

              <TabsContent value="results" className="mt-6">
                <CheckResultsSection check={check} />
              </TabsContent>

              <TabsContent value="consent" className="mt-6">
                <ConsentStatusSection check={check} consents={consents} />
              </TabsContent>

              <TabsContent value="referees" className="mt-6">
                <RefereeResponsesSection check={check} referees={referees} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
