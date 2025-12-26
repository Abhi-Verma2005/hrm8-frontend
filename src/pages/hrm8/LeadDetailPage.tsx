/**
 * Lead Detail Page
 * View and manage individual lead details
 */

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { leadService, Lead } from '@/lib/hrm8/leadService';
import { Hrm8PageLayout } from '@/components/layouts/Hrm8PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { ArrowLeft, UserPlus, UserMinus, Zap, Building2 } from 'lucide-react';
import { AssignLeadDrawer } from '@/components/hrm8/AssignLeadDrawer';
import { LeadConversionWizard } from '@/components/hrm8/LeadConversionWizard';
import { LeadAttributionCard } from '@/components/hrm8/LeadAttributionCard';
import { LeadStatusCard } from '@/components/hrm8/LeadStatusCard';
import { LeadActivityCard } from '@/components/hrm8/LeadActivityCard';
import { Loader2 } from 'lucide-react';

const getStatusBadge = (status: string) => {
  const variants: Record<string, "default" | "secondary" | "success" | "destructive" | "outline"> = {
    NEW: 'default',
    CONTACTED: 'secondary',
    QUALIFIED: 'default',
    CONVERTED: 'success',
    LOST: 'destructive',
    NURTURING: 'outline',
  };
  return <Badge variant={variants[status] || 'default'}>{status}</Badge>;
};

const getRoleBadge = (role: string) => {
  if (role === 'SALES_AGENT') {
    return <Badge className="bg-purple-500/10 text-purple-700 dark:text-purple-400">Sales Agent</Badge>;
  }
  if (role === 'CONSULTANT_360') {
    return <Badge className="bg-orange-500/10 text-orange-700 dark:text-orange-400">360 Consultant</Badge>;
  }
  return <Badge variant="outline">{role}</Badge>;
};

export default function LeadDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);
  const [assignDrawerOpen, setAssignDrawerOpen] = useState(false);
  const [conversionWizardOpen, setConversionWizardOpen] = useState(false);
  const [unassigning, setUnassigning] = useState(false);

  useEffect(() => {
    if (id) {
      loadLead();
    }
  }, [id]);

  const loadLead = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const response = await leadService.getById(id);
      if (response.success && response.data) {
        setLead(response.data);
      } else {
        toast.error(response.error || 'Failed to load lead');
        navigate('/hrm8/leads');
      }
    } catch (error) {
      toast.error('Failed to load lead');
      navigate('/hrm8/leads');
    } finally {
      setLoading(false);
    }
  };

  const handleAutoAssign = async () => {
    if (!id) return;
    try {
      const response = await leadService.autoAssign(id);
      if (response.success) {
        toast.success('Lead auto-assigned successfully');
        await loadLead();
      } else {
        toast.error(response.error || 'Failed to auto-assign lead');
      }
    } catch (error) {
      toast.error('Failed to auto-assign lead');
    }
  };

  const handleUnassign = async () => {
    if (!id) return;
    try {
      setUnassigning(true);
      const response = await leadService.unassign(id);
      if (response.success) {
        toast.success('Lead unassigned successfully');
        await loadLead();
      } else {
        toast.error(response.error || 'Failed to unassign lead');
      }
    } catch (error) {
      toast.error('Failed to unassign lead');
    } finally {
      setUnassigning(false);
    }
  };

  const handleAssignSuccess = () => {
    setAssignDrawerOpen(false);
    loadLead();
  };

  const handleConversionSuccess = () => {
    setConversionWizardOpen(false);
    // Navigate to the company page or back to leads
    navigate('/hrm8/leads');
  };

  if (loading) {
    return (
      <Hrm8PageLayout title="Lead Details" subtitle="Loading...">
        <div className="p-6 flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      </Hrm8PageLayout>
    );
  }

  if (!lead) {
    return (
      <Hrm8PageLayout title="Lead Details" subtitle="Lead not found">
        <div className="p-6">
          <Button onClick={() => navigate('/hrm8/leads')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Leads
          </Button>
        </div>
      </Hrm8PageLayout>
    );
  }

  return (
    <Hrm8PageLayout
      title="Lead Details"
      subtitle={lead.companyName}
      actions={
        <div className="flex gap-2">
          {lead.status === 'QUALIFIED' && (
            <Button
              variant="default"
              onClick={() => setConversionWizardOpen(true)}
              className="bg-green-600 hover:bg-green-700"
            >
              <Building2 className="mr-2 h-4 w-4" />
              Convert to Company
            </Button>
          )}
          {!lead.assignedConsultantId ? (
            <>
              <Button variant="outline" onClick={handleAutoAssign}>
                <Zap className="mr-2 h-4 w-4" />
                Auto-Assign
              </Button>
              <Button onClick={() => setAssignDrawerOpen(true)}>
                <UserPlus className="mr-2 h-4 w-4" />
                Assign Sales Agent
              </Button>
            </>
          ) : (
            <Button variant="outline" onClick={handleUnassign} disabled={unassigning}>
              {unassigning ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <UserMinus className="mr-2 h-4 w-4" />
              )}
              Unassign
            </Button>
          )}
          <Button variant="outline" onClick={() => navigate('/hrm8/leads')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </div>
      }
    >
      <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Lead Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Company Name</div>
                  <div className="text-lg font-semibold">{lead.companyName}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Status</div>
                  <div>{getStatusBadge(lead.status)}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Email</div>
                  <div>{lead.email}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Phone</div>
                  <div>{lead.phone || '-'}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Website</div>
                  <div>{lead.website || '-'}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Country</div>
                  <div>{lead.country}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">City</div>
                  <div>{lead.city || '-'}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Region</div>
                  <div>{lead.region?.name || '-'}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <LeadActivityCard lead={lead} />

          {lead.notes && (
            <Card>
              <CardHeader>
                <CardTitle>Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap">{lead.notes}</p>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <LeadStatusCard lead={lead} onUpdate={loadLead} />

          <Card>
            <CardHeader>
              <CardTitle>Assignment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {lead.assignedConsultant ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">Assigned Sales Agent</div>
                      <div className="text-lg font-semibold">
                        {lead.assignedConsultant.firstName} {lead.assignedConsultant.lastName}
                      </div>
                      <div className="text-sm">{getRoleBadge(lead.assignedConsultant.role)}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-muted-foreground">Capacity</div>
                      <div className="text-lg">
                        {lead.assignedConsultant.currentLeads} / {lead.assignedConsultant.maxLeads} leads
                      </div>
                    </div>
                  </div>
                  {lead.assignedAt && (
                    <div className="text-sm text-muted-foreground">
                      Assigned: {new Date(lead.assignedAt).toLocaleString()}
                    </div>
                  )}
                  {lead.assignmentMode && (
                    <div className="text-sm text-muted-foreground">
                      Assignment Mode: <Badge variant="outline">{lead.assignmentMode}</Badge>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No Sales Agent assigned</p>
                  <p className="text-sm mt-2">Click "Assign Sales Agent" to assign this lead</p>
                </div>
              )}
            </CardContent>
          </Card>

          <LeadAttributionCard lead={lead} onUpdate={loadLead} />

          {lead.tags && lead.tags.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Tags</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {lead.tags.map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <AssignLeadDrawer
          open={assignDrawerOpen}
          onOpenChange={setAssignDrawerOpen}
          leadId={lead.id}
          onSuccess={handleAssignSuccess}
        />

        <LeadConversionWizard
          open={conversionWizardOpen}
          onOpenChange={setConversionWizardOpen}
          lead={lead}
          onSuccess={handleConversionSuccess}
        />
      </div>
    </Hrm8PageLayout>
  );
}





