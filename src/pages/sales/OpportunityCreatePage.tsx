/**
 * Opportunity Create Page
 * Create new sales opportunities
 */

import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { DashboardPageLayout } from '@/components/layouts/DashboardPageLayout';
import { AtsPageHeader } from '@/components/layouts/AtsPageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Save } from 'lucide-react';
import { toast } from 'sonner';

export default function OpportunityCreatePage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const companyId = searchParams.get('companyId');

    const [formData, setFormData] = useState({
        name: '',
        employerName: '',
        type: 'SUBSCRIPTION',
        stage: 'NEW',
        value: '',
        probability: '50',
        expectedCloseDate: '',
        description: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // TODO: Call backend API to create opportunity
        console.log('Creating opportunity:', formData);

        toast.success('Opportunity created successfully!');
        navigate('/sales/opportunities');
    };

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <DashboardPageLayout>
            <div className="p-6 space-y-6">
                <AtsPageHeader
                    title="Create Opportunity"
                    subtitle="Add a new sales opportunity"
                    actions={
                        <Button variant="outline" onClick={() => navigate('/sales/opportunities')}>
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Cancel
                        </Button>
                    }
                />

                <form onSubmit={handleSubmit}>
                    <Card>
                        <CardHeader>
                            <CardTitle>Opportunity Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Opportunity Name *</Label>
                                    <Input
                                        id="name"
                                        value={formData.name}
                                        onChange={(e) => handleChange('name', e.target.value)}
                                        placeholder="e.g., Acme Corp - Subscription"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="employerName">Company Name *</Label>
                                    <Input
                                        id="employerName"
                                        value={formData.employerName}
                                        onChange={(e) => handleChange('employerName', e.target.value)}
                                        placeholder="e.g., Acme Corporation"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="type">Type *</Label>
                                    <Select value={formData.type} onValueChange={(value) => handleChange('type', value)}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="SUBSCRIPTION">Subscription</SelectItem>
                                            <SelectItem value="RECRUITMENT">Recruitment Service</SelectItem>
                                            <SelectItem value="RPO">RPO</SelectItem>
                                            <SelectItem value="CONSULTING">Consulting</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="stage">Stage *</Label>
                                    <Select value={formData.stage} onValueChange={(value) => handleChange('stage', value)}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="NEW">New</SelectItem>
                                            <SelectItem value="CONTACTED">Contacted</SelectItem>
                                            <SelectItem value="QUALIFIED">Qualified</SelectItem>
                                            <SelectItem value="PROPOSAL">Proposal</SelectItem>
                                            <SelectItem value="NEGOTIATION">Negotiation</SelectItem>
                                            <SelectItem value="WON">Won</SelectItem>
                                            <SelectItem value="LOST">Lost</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="value">Value ($) *</Label>
                                    <Input
                                        id="value"
                                        type="number"
                                        value={formData.value}
                                        onChange={(e) => handleChange('value', e.target.value)}
                                        placeholder="e.g., 50000"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="probability">Probability (%) *</Label>
                                    <Input
                                        id="probability"
                                        type="number"
                                        min="0"
                                        max="100"
                                        value={formData.probability}
                                        onChange={(e) => handleChange('probability', e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="space-y-2 col-span-2">
                                    <Label htmlFor="expectedCloseDate">Expected Close Date *</Label>
                                    <Input
                                        id="expectedCloseDate"
                                        type="date"
                                        value={formData.expectedCloseDate}
                                        onChange={(e) => handleChange('expectedCloseDate', e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="space-y-2 col-span-2">
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea
                                        id="description"
                                        value={formData.description}
                                        onChange={(e) => handleChange('description', e.target.value)}
                                        placeholder="Add any additional details about this opportunity..."
                                        rows={4}
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end gap-2 pt-4">
                                <Button type="button" variant="outline" onClick={() => navigate('/sales/opportunities')}>
                                    Cancel
                                </Button>
                                <Button type="submit">
                                    <Save className="mr-2 h-4 w-4" />
                                    Create Opportunity
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </form>
            </div>
        </DashboardPageLayout>
    );
}
