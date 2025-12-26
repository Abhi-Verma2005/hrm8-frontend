/**
 * Assign Lead Drawer
 * Drawer component for assigning a lead to a Sales Agent or 360 Consultant
 */

import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Loader2, Search, Users, CheckCircle, UserPlus } from 'lucide-react';
import { leadService, ConsultantForLeadAssignment, LeadAssignmentInfo } from '@/lib/hrm8/leadService';
import { toast } from 'sonner';
import { Progress } from '@/components/ui/progress';

interface AssignLeadDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  leadId: string;
  onSuccess?: () => void;
}

const getRoleBadge = (role: string) => {
  if (role === 'SALES_AGENT') {
    return <Badge className="bg-purple-500/10 text-purple-700 dark:text-purple-400">Sales Agent</Badge>;
  }
  if (role === 'CONSULTANT_360') {
    return <Badge className="bg-orange-500/10 text-orange-700 dark:text-orange-400">360 Consultant</Badge>;
  }
  return <Badge variant="outline">{role}</Badge>;
};

export function AssignLeadDrawer({
  open,
  onOpenChange,
  leadId,
  onSuccess,
}: AssignLeadDrawerProps) {
  const [loading, setLoading] = useState(true);
  const [loadingConsultants, setLoadingConsultants] = useState(false);
  const [assigning, setAssigning] = useState(false);
  const [leadInfo, setLeadInfo] = useState<LeadAssignmentInfo | null>(null);
  const leadInfoRef = useRef<LeadAssignmentInfo | null>(null);
  const [consultants, setConsultants] = useState<ConsultantForLeadAssignment[]>([]);
  const [selectedConsultantId, setSelectedConsultantId] = useState<string>('');

  // Filters
  const [searchQuery, setSearchQuery] = useState('');

  const loadLeadInfo = useCallback(async () => {
    try {
      setLoading(true);
      const leadInfoRes = await leadService.getAssignmentInfo(leadId);
      if (leadInfoRes.success && leadInfoRes.data) {
        setLeadInfo(leadInfoRes.data);
        leadInfoRef.current = leadInfoRes.data;
      }
    } catch (error) {
      toast.error('Failed to load lead info');
    } finally {
      setLoading(false);
    }
  }, [leadId]);

  const loadConsultants = useCallback(
    async (searchTerm?: string) => {
      try {
        const regionId = leadInfoRef.current?.lead.regionId;
        setLoadingConsultants(true);
        const consultantsRes = await leadService.getConsultantsForAssignment(regionId);
        if (consultantsRes.success && consultantsRes.data) {
          setConsultants(consultantsRes.data.consultants);
        } else {
          setConsultants([]);
        }
      } catch (error) {
        toast.error('Failed to load Sales Agents');
      } finally {
        setLoadingConsultants(false);
      }
    },
    []
  );

  useEffect(() => {
    if (open && leadId) {
      loadLeadInfo();
      setSelectedConsultantId('');
    }
  }, [open, leadId, loadLeadInfo]);

  useEffect(() => {
    if (open && leadInfoRef.current) {
      loadConsultants();
    }
  }, [open, loadConsultants]);

  const handleAutoAssign = async () => {
    try {
      setAssigning(true);
      const response = await leadService.autoAssign(leadId);
      if (response.success) {
        toast.success('Lead auto-assigned successfully');
        onSuccess?.();
        onOpenChange(false);
      } else {
        toast.error(response.error || 'Failed to auto-assign lead');
      }
    } catch (error) {
      toast.error('Failed to auto-assign lead');
    } finally {
      setAssigning(false);
    }
  };

  const handleAssign = async () => {
    if (!selectedConsultantId) {
      toast.error('Please select a Sales Agent');
      return;
    }

    try {
      setAssigning(true);
      const response = await leadService.assignConsultant(leadId, selectedConsultantId);
      if (response.success) {
        toast.success('Lead assigned successfully');
        onSuccess?.();
        onOpenChange(false);
      } else {
        toast.error(response.error || 'Failed to assign lead');
      }
    } catch (error) {
      toast.error('Failed to assign lead');
    } finally {
      setAssigning(false);
    }
  };

  const filteredConsultants = useMemo(() => {
    if (!searchQuery.trim()) {
      return consultants;
    }
    
    const query = searchQuery.toLowerCase().trim();
    return consultants.filter(consultant => {
      if (!consultant) return false;
      
      const firstName = (consultant.firstName || '').toLowerCase();
      const lastName = (consultant.lastName || '').toLowerCase();
      const fullName = `${firstName} ${lastName}`.trim();
      const email = (consultant.email || '').toLowerCase();
      
      return firstName.includes(query) || 
             lastName.includes(query) || 
             fullName.includes(query) || 
             email.includes(query);
    });
  }, [consultants, searchQuery]);

  const selectedConsultant = consultants.find(c => c.id === selectedConsultantId);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Assign Lead to Sales Agent</SheetTitle>
          <SheetDescription>
            Select a Sales Agent or 360 Consultant to assign this lead to. Recruiters manage jobs, not leads.
          </SheetDescription>
        </SheetHeader>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="space-y-6 mt-6">
            {/* Lead Info */}
            {leadInfo && (
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <Users className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div className="flex-1">
                      <h3 className="font-semibold">{leadInfo.lead.companyName}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{leadInfo.lead.email}</p>
                      {leadInfo.currentAssignment && (
                        <p className="text-sm text-muted-foreground mt-1">
                          Currently assigned to: {leadInfo.currentAssignment.consultant.firstName} {leadInfo.currentAssignment.consultant.lastName}
                        </p>
                      )}
                      {leadInfo.lead.assignmentSource === 'AUTO_RULES' && (
                        <Badge variant="default" className="mt-2">
                          Auto-assigned
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Auto-assign Button */}
            <Button
              variant="outline"
              onClick={handleAutoAssign}
              disabled={assigning}
              className="w-full"
            >
              {assigning ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <CheckCircle className="mr-2 h-4 w-4" />
              )}
              Try Auto-Assignment
            </Button>

            <Separator />

            {/* Search */}
            <div className="space-y-2">
              <Label>Search Sales Agents</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Consultants List */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>
                  Select Sales Agent
                  {searchQuery && (
                    <span className="text-sm text-muted-foreground ml-2">
                      ({filteredConsultants.length} of {consultants.length})
                    </span>
                  )}
                </Label>
                {loadingConsultants && (
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                )}
              </div>

              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {filteredConsultants.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    {loadingConsultants ? 'Loading Sales Agents...' : 'No Sales Agents found'}
                  </div>
                ) : (
                  filteredConsultants.map((consultant) => {
                    const isSelected = selectedConsultantId === consultant.id;
                    const workloadRatio = consultant.maxLeads > 0 
                      ? consultant.currentLeads / consultant.maxLeads 
                      : 0;
                    const isAtCapacity = consultant.currentLeads >= consultant.maxLeads;

                    return (
                      <Card
                        key={consultant.id}
                        className={`cursor-pointer transition-colors ${
                          isSelected
                            ? 'border-primary bg-primary/5'
                            : 'hover:bg-accent'
                        } ${isAtCapacity ? 'opacity-60' : ''}`}
                        onClick={() => !isAtCapacity && setSelectedConsultantId(consultant.id)}
                      >
                        <CardContent className="pt-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-semibold">
                                  {consultant.firstName} {consultant.lastName}
                                </span>
                                {getRoleBadge(consultant.role)}
                              </div>
                              <p className="text-sm text-muted-foreground">{consultant.email}</p>
                              <div className="mt-2 space-y-1">
                                <div className="flex items-center justify-between text-sm">
                                  <span className="text-muted-foreground">Lead Capacity:</span>
                                  <span className={isAtCapacity ? 'text-destructive font-medium' : ''}>
                                    {consultant.currentLeads} / {consultant.maxLeads}
                                  </span>
                                </div>
                                <Progress value={workloadRatio * 100} className="h-2" />
                                {consultant.successRate > 0 && (
                                  <div className="text-xs text-muted-foreground">
                                    Success Rate: {consultant.successRate}%
                                  </div>
                                )}
                              </div>
                            </div>
                            {isSelected && (
                              <CheckCircle className="h-5 w-5 text-primary" />
                            )}
                            {isAtCapacity && (
                              <Badge variant="destructive" className="ml-2">At Capacity</Badge>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })
                )}
              </div>
            </div>

            {/* Selected Consultant Summary */}
            {selectedConsultant && (
              <Card className="bg-primary/5">
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold">
                        Will assign to: {selectedConsultant.firstName} {selectedConsultant.lastName}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {selectedConsultant.email}
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        Capacity: {selectedConsultant.currentLeads + 1} / {selectedConsultant.maxLeads} leads
                      </div>
                    </div>
                    {getRoleBadge(selectedConsultant.role)}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Actions */}
            <div className="flex gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleAssign}
                disabled={!selectedConsultantId || assigning}
                className="flex-1"
              >
                {assigning ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <UserPlus className="mr-2 h-4 w-4" />
                )}
                Assign Lead
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}





