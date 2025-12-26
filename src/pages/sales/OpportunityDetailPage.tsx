/**
 * Opportunity Detail Page
 * View and manage individual opportunity details
 */

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DashboardPageLayout } from '@/components/layouts/DashboardPageLayout';
import { AtsPageHeader } from '@/components/layouts/AtsPageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Edit, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { getOpportunityById } from '@/lib/salesOpportunityStorage';
import type { SalesOpportunity } from '@/types/salesOpportunity';
import { OpportunityStageBadge } from '@/components/sales/OpportunityStageBadge';
import { OpportunityTypeBadge } from '@/components/sales/OpportunityTypeBadge';
import { toast } from 'sonner';

export default function OpportunityDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [opportunity, setOpportunity] = useState<SalesOpportunity | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            loadOpportunity();
        }
    }, [id]);

    const loadOpportunity = () => {
        if (!id) return;
        try {
            const opp = getOpportunityById(id);
            if (opp) {
                setOpportunity(opp);
            } else {
                toast.error('Opportunity not found');
                navigate('/sales/opportunities');
            }
        } catch (error) {
            toast.error('Failed to load opportunity');
            navigate('/sales/opportunities');
        } finally {
            setLoading(false);
        }
    };

    const handleMarkWon = () => {
        toast.success('Opportunity marked as won!');
        navigate('/sales/opportunities');
    };

    const handleMarkLost = () => {
        toast.success('Opportunity marked as lost');
        navigate('/sales/opportunities');
    };

    if (loading) {
        return (
            <DashboardPageLayout>
                <div className="p-6 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
            </DashboardPageLayout>
        );
    }

    if (!opportunity) {
        return (
            <DashboardPageLayout>
                <div className="p-6">
                    <Button onClick={() => navigate('/sales/opportunities')}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Opportunities
                    </Button>
                </div>
            </DashboardPageLayout>
        );
    }

    return (
        <DashboardPageLayout>
            <div className="p-6 space-y-6">
                <AtsPageHeader
                    title="Opportunity Details"
                    subtitle={opportunity.name}
                    actions={
                        <div className="flex gap-2">
                            {opportunity.stage !== 'CLOSED_WON' && opportunity.stage !== 'CLOSED_LOST' && (
                                <>
                                    <Button variant="outline" onClick={handleMarkWon}>
                                        <CheckCircle className="mr-2 h-4 w-4" />
                                        Mark Won
                                    </Button>
                                    <Button variant="outline" onClick={handleMarkLost}>
                                        <XCircle className="mr-2 h-4 w-4" />
                                        Mark Lost
                                    </Button>
                                </>
                            )}
                            <Button variant="outline" onClick={() => navigate('/sales/opportunities')}>
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back
                            </Button>
                        </div>
                    }
                />

                <Card>
                    <CardHeader>
                        <CardTitle>Opportunity Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <div className="text-sm font-medium text-muted-foreground">Opportunity Name</div>
                                <div className="text-lg font-semibold">{opportunity.name}</div>
                            </div>
                            <div>
                                <div className="text-sm font-medium text-muted-foreground">Company</div>
                                <div className="text-lg font-semibold">{opportunity.employerName}</div>
                            </div>
                            <div>
                                <div className="text-sm font-medium text-muted-foreground">Stage</div>
                                <div><OpportunityStageBadge stage={opportunity.stage} /></div>
                            </div>
                            <div>
                                <div className="text-sm font-medium text-muted-foreground">Type</div>
                                <div><OpportunityTypeBadge type={opportunity.type} /></div>
                            </div>
                            <div>
                                <div className="text-sm font-medium text-muted-foreground">Value</div>
                                <div className="text-lg font-semibold">
                                    ${opportunity.value.toLocaleString()}
                                </div>
                            </div>
                            <div>
                                <div className="text-sm font-medium text-muted-foreground">Probability</div>
                                <div className="text-lg">{opportunity.probability}%</div>
                            </div>
                            <div>
                                <div className="text-sm font-medium text-muted-foreground">Expected Close</div>
                                <div>{new Date(opportunity.expectedCloseDate).toLocaleDateString()}</div>
                            </div>
                            <div>
                                <div className="text-sm font-medium text-muted-foreground">Sales Agent</div>
                                <div>{opportunity.salesAgentName || 'Unassigned'}</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {opportunity.description && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Description</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="whitespace-pre-wrap">{opportunity.description}</p>
                        </CardContent>
                    </Card>
                )}

                <Card>
                    <CardHeader>
                        <CardTitle>Timeline</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Created:</span>
                                <span>{new Date(opportunity.createdAt).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Last Updated:</span>
                                <span>{new Date(opportunity.updatedAt).toLocaleString()}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </DashboardPageLayout>
    );
}
