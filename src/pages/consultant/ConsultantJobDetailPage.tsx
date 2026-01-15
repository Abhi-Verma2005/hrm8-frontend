/**
 * Consultant Job Detail Page
 * Detailed view of an assigned job with workflow actions
 */

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useConsultantAuth } from '@/contexts/ConsultantAuthContext';
import { consultantService } from '@/lib/consultant/consultantService';
import { ConsultantCandidateService, CandidatePipelineItem } from '@/lib/consultant/consultantCandidateService';
import { ConsultantPageLayout } from '@/components/layouts/ConsultantPageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Building, MapPin, AlertTriangle, FileText, Send, User, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function ConsultantJobDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { consultant } = useConsultantAuth();

    const [loading, setLoading] = useState(true);
    const [jobData, setJobData] = useState<any>(null);
    const [candidates, setCandidates] = useState<CandidatePipelineItem[]>([]);
    const [loadingCandidates, setLoadingCandidates] = useState(false);

    // Action states
    const [logOpen, setLogOpen] = useState(false);
    const [logType, setLogType] = useState('');
    const [logNotes, setLogNotes] = useState('');

    useEffect(() => {
        if (id) {
            loadJobDetails();
            loadCandidates();
        }
    }, [id]);

    const loadJobDetails = async () => {
        try {
            setLoading(true);
            if (!id) return;

            const response = await consultantService.getJobDetails(id);
            if (response.success && response.data) {
                setJobData(response.data);
            } else {
                toast.error('Failed to load job details');
                navigate('/consultant/jobs');
            }
        } catch (error) {
            console.error(error);
            toast.error('Error loading job');
        } finally {
            setLoading(false);
        }
    };

    const loadCandidates = async () => {
        if (!id) return;
        setLoadingCandidates(true);
        try {
            const data = await ConsultantCandidateService.getPipeline(id);
            setCandidates(data);
        } catch (error) {
            console.error('Failed to load candidates:', error);
        } finally {
            setLoadingCandidates(false);
        }
    };

    const handleLogActivity = async () => {
        if (!id || !logType || !logNotes) {
            toast.error('Please fill in all fields');
            return;
        }

        try {
            const res = await consultantService.logJobActivity(id, logType, logNotes);
            if (res.success) {
                toast.success('Activity logged');
                setLogOpen(false);
                setLogType('');
                setLogNotes('');
                loadJobDetails();
            } else {
                toast.error(res.error || 'Failed to log activity');
            }
        } catch (err) {
            toast.error('Failed to log activity');
        }
    };

    const handleUpdateStatus = async (applicationId: string, newStatus: string) => {
        try {
            // Optimistic update?
            await ConsultantCandidateService.updateStatus(applicationId, newStatus);
            toast.success('Status updated');
            loadCandidates(); // Refresh
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    const handleMessageCandidate = async (candidateId: string, email: string) => {
        // We need to find or create conversation. 
        // For simplicity, navigate to messages page maybe with a query param?
        // Or create conversation directly then navigate.
        // Let's assume we can navigate to the conversation if it exists, or create new.
        // The ConsultantMessagesPage handles list. Ideally we create conversation here.
        // But for now, let's just push to messages.
        // Better UX: Create conversation via API then redirect.
        // We don't have that endpoint exposed in our service yet explicitly for 'ensureConversation'.
        // But 'sendMessage' creates it if not exists usually, or we use a specific 'createConversation' endpoint.
        // Let's just navigate to messages root for now or implement 'createConversation' in service later.
        navigate(`/consultant/messages`);
        toast.info(`Please start a chat with ${email}`);
    };

    if (loading) {
        return (
            <ConsultantPageLayout>
                <div className="flex h-screen items-center justify-center">
                    Loading...
                </div>
            </ConsultantPageLayout>
        );
    }

    if (!jobData) return null;

    const { job, pipeline, team, employer } = jobData;

    return (
        <ConsultantPageLayout>
            <div className="p-6 space-y-6">
                {/* Header with Back Button */}
                <div>
                    <Button variant="ghost" className="mb-2 pl-0 hover:pl-2 transition-all" onClick={() => navigate('/consultant/jobs')}>
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to My Jobs
                    </Button>
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">{job.title}</h1>
                            <div className="flex items-center gap-2 text-muted-foreground mt-1">
                                <Building className="h-4 w-4" />
                                <span>{job.company?.name || 'Client Company'}</span>
                                <span className="text-gray-300 mx-1">|</span>
                                <MapPin className="h-4 w-4" />
                                <span>{job.location}</span>
                                <span className="text-gray-300 mx-1">|</span>
                                <Badge variant={job.status === 'ACTIVE' ? 'default' : 'secondary'}>{job.status}</Badge>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Dialog open={logOpen} onOpenChange={setLogOpen}>
                                <DialogTrigger asChild>
                                    <Button variant="outline">
                                        <FileText className="mr-2 h-4 w-4" /> Log Activity
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Log Activity</DialogTitle>
                                        <DialogDescription>Record a touchpoint or update for this job.</DialogDescription>
                                    </DialogHeader>
                                    <div className="space-y-4 py-4">
                                        <div className="space-y-2">
                                            <Label>Activity Type</Label>
                                            <Select value={logType} onValueChange={setLogType}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select type" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Call">Client Call</SelectItem>
                                                    <SelectItem value="Email">Email Sent</SelectItem>
                                                    <SelectItem value="Meeting">Meeting</SelectItem>
                                                    <SelectItem value="Other">Other</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Notes</Label>
                                            <Textarea value={logNotes} onChange={e => setLogNotes(e.target.value)} placeholder="Details..." />
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button onClick={handleLogActivity}>Save Log</Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>
                </div>

                <Tabs defaultValue="candidates" className="space-y-4">
                    <TabsList>
                        <TabsTrigger value="details">Job Details</TabsTrigger>
                        <TabsTrigger value="candidates">Candidates ({candidates.length})</TabsTrigger>
                    </TabsList>

                    <TabsContent value="details" className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Main Content */}
                            <div className="md:col-span-2 space-y-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Job Details</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <h4 className="text-sm font-medium text-muted-foreground">Salary Range</h4>
                                                <p className="text-sm font-medium">
                                                    {job.salaryMin ? `${job.salaryCurrency} ${job.salaryMin.toLocaleString()} - ${job.salaryMax.toLocaleString()}` : 'Not specificed'}
                                                </p>
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-medium text-muted-foreground">Work Arrangement</h4>
                                                <p className="text-sm font-medium capitalize">{job.workArrangement?.toLowerCase().replace('_', ' ')}</p>
                                            </div>
                                        </div>
                                        <Separator />
                                        <div>
                                            <h4 className="text-sm font-medium text-muted-foreground mb-2">Description</h4>
                                            <div className="prose prose-sm max-w-none text-sm text-foreground/90" dangerouslySetInnerHTML={{ __html: job.description || 'No description' }} />
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Sidebar */}
                            <div className="space-y-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-base">Employer Contact</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                                <User className="h-5 w-5 text-primary" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-sm">{employer.contactName}</p>
                                                <p className="text-xs text-muted-foreground">Hiring Manager</p>
                                            </div>
                                        </div>
                                        <div className="text-sm space-y-1">
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">Email:</span>
                                                <span className="truncate max-w-[150px]">{employer.email}</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="candidates" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Pipeline</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {loadingCandidates ? (
                                    <div className="text-center py-10">Loading candidates...</div>
                                ) : candidates.length === 0 ? (
                                    <div className="text-center py-10 text-muted-foreground">No candidates applied yet.</div>
                                ) : (
                                    <div className="space-y-4">
                                        {candidates.map(app => (
                                            <div key={app.id} className="flex items-center justify-between p-4 border rounded-lg bg-card hover:bg-muted/30 transition-colors">
                                                <div className="flex items-center gap-4">
                                                    <Avatar className="h-10 w-10">
                                                        <AvatarImage src={app.candidate.photo} />
                                                        <AvatarFallback>{app.candidate.first_name[0]}{app.candidate.last_name[0]}</AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <h4 className="font-medium">{app.candidate.first_name} {app.candidate.last_name}</h4>
                                                        <p className="text-xs text-muted-foreground">{app.candidate.email}</p>
                                                        <div className="flex gap-2 mt-1">
                                                            {app.resume_url && (
                                                                <a href={app.resume_url} target="_blank" rel="noreferrer" className="text-xs text-primary hover:underline flex items-center">
                                                                    <FileText className="h-3 w-3 mr-1" /> Resume
                                                                </a>
                                                            )}
                                                            {app.candidate.linked_in_url && (
                                                                <a href={app.candidate.linked_in_url} target="_blank" rel="noreferrer" className="text-xs text-primary hover:underline">
                                                                    LinkedIn
                                                                </a>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <div className="flex flex-col items-end gap-1">
                                                        <span className="text-xs text-muted-foreground">Status</span>
                                                        <Select defaultValue={app.status} onValueChange={(val) => handleUpdateStatus(app.id, val)}>
                                                            <SelectTrigger className="h-8 w-[140px]">
                                                                <SelectValue />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="NEW">New</SelectItem>
                                                                <SelectItem value="SCREENING">Screening</SelectItem>
                                                                <SelectItem value="INTERVIEW">Interview</SelectItem>
                                                                <SelectItem value="OFFER">Offer</SelectItem>
                                                                <SelectItem value="HIRED">Hired</SelectItem>
                                                                <SelectItem value="REJECTED">Rejected</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                    <Button variant="outline" size="icon" onClick={() => handleMessageCandidate(app.candidate.id, app.candidate.email)}>
                                                        <MessageSquare className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </ConsultantPageLayout>
    );
}
