import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { ServiceProject } from "@/types/recruitmentService";
import { ServiceStatusBadge } from "@/components/recruitment-services/ServiceStatusBadge";
import { PriorityIndicator } from "@/components/recruitment-services/PriorityIndicator";
import { calculateRPOProgress } from "@/lib/rpoServiceStorage";
import { getEmployerContacts } from "@/lib/employerContactStorage";
import { getAllConsultants } from "@/lib/consultantStorage";
import { formatConsultantName, getCapacityStatus } from "@/lib/consultantService";
import { 
  DollarSign, Calendar, Users, Target, TrendingUp, 
  FileText, Clock, CheckCircle2, Mail, Phone, 
  MapPin, Edit, Pause, RotateCcw, AlertCircle
} from "lucide-react";
import { format } from "date-fns";

interface RPOServiceDetailDialogProps {
  service: ServiceProject | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit?: () => void;
}

export function RPOServiceDetailDialog({ 
  service, 
  open, 
  onOpenChange,
  onEdit 
}: RPOServiceDetailDialogProps) {
  const [activeTab, setActiveTab] = useState("overview");

  if (!service) return null;

  const progress = calculateRPOProgress(service);
  const contacts = getEmployerContacts(service.clientId);
  const primaryContact = contacts.find(c => c.id === service.rpoPrimaryContactId);
  const additionalContacts = contacts.filter(c => 
    service.rpoAdditionalContactIds?.includes(c.id)
  );
  const allConsultants = getAllConsultants();
  const teamMembers = service.consultants?.map(c => 
    allConsultants.find(consultant => consultant.id === c.id)
  ).filter(Boolean);

  const daysElapsed = Math.floor(
    (new Date().getTime() - new Date(service.rpoStartDate || service.startDate).getTime()) / 
    (1000 * 60 * 60 * 24)
  );
  const totalDays = Math.floor(
    (new Date(service.rpoEndDate || service.deadline).getTime() - 
     new Date(service.rpoStartDate || service.startDate).getTime()) / 
    (1000 * 60 * 60 * 24)
  );

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-4xl overflow-y-auto">
        <SheetHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <SheetTitle className="text-2xl">{service.name}</SheetTitle>
              <div className="flex items-center gap-2 flex-wrap">
                <ServiceStatusBadge status={service.status} />
                <PriorityIndicator priority={service.priority} />
                {service.rpoAutoRenew && (
                  <Badge variant="outline" className="gap-1">
                    <RotateCcw className="h-3 w-3" />
                    Auto-Renew
                  </Badge>
                )}
              </div>
            </div>
            {onEdit && (
              <Button variant="outline" size="sm" onClick={onEdit}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            )}
          </div>
        </SheetHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="contract">Contract</TabsTrigger>
            <TabsTrigger value="fees">Fees</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
            <TabsTrigger value="progress">Progress</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6 mt-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
                    <DollarSign className="h-4 w-4" />
                    Contract Value
                  </div>
                  <div className="text-2xl font-bold">
                    ${service.rpoTotalContractValue?.toLocaleString() || '0'}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
                    <Clock className="h-4 w-4" />
                    Time Elapsed
                  </div>
                  <div className="text-2xl font-bold">{progress.timeProgress}%</div>
                  <Progress value={progress.timeProgress} className="mt-2" />
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
                    <Target className="h-4 w-4" />
                    Placements
                  </div>
                  <div className="text-2xl font-bold">{progress.placementProgress}%</div>
                  <Progress value={progress.placementProgress} className="mt-2" />
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
                    <Users className="h-4 w-4" />
                    Team Size
                  </div>
                  <div className="text-2xl font-bold">{service.consultants?.length || 0}</div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Info */}
            <Card>
              <CardHeader>
                <CardTitle>Service Information</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Client</div>
                    <div className="text-base font-medium">{service.clientName}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Country</div>
                    <div className="text-base font-medium flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      {service.country || service.location}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Start Date</div>
                    <div className="text-base font-medium">
                      {format(new Date(service.rpoStartDate || service.startDate), 'MMM dd, yyyy')}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">End Date</div>
                    <div className="text-base font-medium">
                      {format(new Date(service.rpoEndDate || service.deadline), 'MMM dd, yyyy')}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Duration</div>
                    <div className="text-base font-medium">{service.rpoDuration} months</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Auto-Renewal</div>
                    <div className="text-base font-medium">
                      {service.rpoAutoRenew ? 'Yes' : 'No'}
                    </div>
                  </div>
                </div>

                {service.description && (
                  <>
                    <Separator />
                    <div>
                      <div className="text-sm font-medium text-muted-foreground mb-2">Description</div>
                      <p className="text-sm">{service.description}</p>
                    </div>
                  </>
                )}

                {/* Primary Contact */}
                {primaryContact && (
                  <>
                    <Separator />
                    <div>
                      <div className="text-sm font-medium text-muted-foreground mb-3">Primary Contact</div>
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                        <Avatar>
                          <AvatarFallback>
                            {primaryContact.firstName[0]}{primaryContact.lastName[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="font-medium">
                            {primaryContact.firstName} {primaryContact.lastName}
                          </div>
                          <div className="text-sm text-muted-foreground">{primaryContact.title}</div>
                          <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {primaryContact.email}
                            </span>
                            <span className="flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              {primaryContact.phone}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* Additional Contacts */}
                {additionalContacts.length > 0 && (
                  <>
                    <Separator />
                    <div>
                      <div className="text-sm font-medium text-muted-foreground mb-3">
                        Additional Contacts ({additionalContacts.length})
                      </div>
                      <div className="space-y-2">
                        {additionalContacts.map(contact => (
                          <div key={contact.id} className="flex items-center gap-2 text-sm">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="text-xs">
                                {contact.firstName[0]}{contact.lastName[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">
                                {contact.firstName} {contact.lastName}
                              </div>
                              <div className="text-xs text-muted-foreground">{contact.title}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Contract Tab */}
          <TabsContent value="contract" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Contract Timeline</CardTitle>
                <CardDescription>
                  {daysElapsed} of {totalDays} days elapsed
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Progress value={progress.timeProgress} className="h-2" />
                  <div className="flex justify-between text-sm">
                    <div className="text-muted-foreground">
                      Start: {format(new Date(service.rpoStartDate || service.startDate), 'MMM dd, yyyy')}
                    </div>
                    <div className="font-medium">Today: {format(new Date(), 'MMM dd, yyyy')}</div>
                    <div className="text-muted-foreground">
                      End: {format(new Date(service.rpoEndDate || service.deadline), 'MMM dd, yyyy')}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contract Terms</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">Duration</div>
                      <div className="text-base font-medium">{service.rpoDuration} months</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">Auto-Renewal</div>
                      <div className="text-base font-medium">
                        <Badge variant={service.rpoAutoRenew ? "default" : "secondary"}>
                          {service.rpoAutoRenew ? 'Enabled' : 'Disabled'}
                        </Badge>
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">Notice Period</div>
                      <div className="text-base font-medium">{service.rpoNoticePeriod || 30} days</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">Status</div>
                      <div className="text-base font-medium">
                        <ServiceStatusBadge status={service.status} />
                      </div>
                    </div>
                  </div>

                  {service.rpoNotes && (
                    <>
                      <Separator />
                      <div>
                        <div className="text-sm font-medium text-muted-foreground mb-2">Contract Notes</div>
                        <p className="text-sm bg-muted/50 p-3 rounded-lg">{service.rpoNotes}</p>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-3">
              <Button variant="outline" className="flex-1">
                <Calendar className="h-4 w-4 mr-2" />
                Extend Contract
              </Button>
              <Button variant="outline" className="flex-1">
                <Pause className="h-4 w-4 mr-2" />
                Pause Service
              </Button>
              <Button variant="destructive" className="flex-1">
                <AlertCircle className="h-4 w-4 mr-2" />
                Cancel Service
              </Button>
            </div>
          </TabsContent>

          {/* Fees Tab */}
          <TabsContent value="fees" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Fee Structures</CardTitle>
                <CardDescription>Breakdown of all fees for this engagement</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {service.rpoFeeStructures?.map((fee, index) => (
                    <div key={fee.id} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="font-medium">{fee.name}</div>
                          <div className="text-sm text-muted-foreground">{fee.description}</div>
                        </div>
                        <Badge variant="secondary">{fee.type}</Badge>
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <div className="text-sm text-muted-foreground">
                          Frequency: <span className="font-medium">{fee.frequency}</span>
                        </div>
                        <div className="text-lg font-bold">
                          ${fee.amount.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Financial Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-primary/5 rounded-lg">
                    <span className="font-medium">Total Contract Value</span>
                    <span className="text-2xl font-bold text-primary">
                      ${service.rpoTotalContractValue?.toLocaleString() || '0'}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Invoiced to Date</span>
                    <span className="font-medium">${service.upfrontPaid?.toLocaleString() || '0'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Paid to Date</span>
                    <span className="font-medium">${service.upfrontPaid?.toLocaleString() || '0'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Outstanding Balance</span>
                    <span className="font-medium">${service.balanceDue?.toLocaleString() || '0'}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Team Tab */}
          <TabsContent value="team" className="space-y-6 mt-6">
            <div className="space-y-4">
              {teamMembers?.map((consultant) => {
                if (!consultant) return null;
                const role = service.consultants?.find(c => c.id === consultant.id)?.role;
                const capacityStatus = getCapacityStatus(consultant);
                
                return (
                  <Card key={consultant.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={consultant.photo} />
                          <AvatarFallback>
                            {consultant.firstName[0]}{consultant.lastName[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium">
                              {formatConsultantName(consultant)}
                            </span>
                            <Badge variant={role === 'lead' ? 'default' : 'secondary'}>
                              {role}
                            </Badge>
                          </div>
                          <div className="text-sm text-muted-foreground mb-2">
                            {consultant.title}
                          </div>
                          <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {consultant.email}
                            </div>
                            {consultant.phone && (
                              <div className="flex items-center gap-1">
                                <Phone className="h-3 w-3" />
                                {consultant.phone}
                              </div>
                            )}
                          </div>
                          <div className="mt-3">
                            <div className="flex items-center justify-between text-xs mb-1">
                              <span className="text-muted-foreground">Capacity</span>
                              <span className="font-medium">
                                {consultant.currentEmployers}/{consultant.maxEmployers} employers
                              </span>
                            </div>
                            <Progress 
                              value={(consultant.currentEmployers / consultant.maxEmployers) * 100} 
                              className="h-2"
                            />
                            {capacityStatus === 'at-capacity' && (
                              <div className="flex items-center gap-1 text-xs text-destructive mt-1">
                                <AlertCircle className="h-3 w-3" />
                                At capacity
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Progress Tab */}
          <TabsContent value="progress" className="space-y-6 mt-6">
            <div className="grid grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Time Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold mb-2">{progress.timeProgress}%</div>
                  <Progress value={progress.timeProgress} />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Placement Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold mb-2">{progress.placementProgress}%</div>
                  <Progress value={progress.placementProgress} />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Overall Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold mb-2">{progress.overallProgress}%</div>
                  <Progress value={progress.overallProgress} />
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recruitment Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <div className="text-sm text-muted-foreground mb-1">Target Placements</div>
                    <div className="text-2xl font-bold">{service.targetPlacements || service.numberOfVacancies}</div>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <div className="text-sm text-muted-foreground mb-1">Actual Placements</div>
                    <div className="text-2xl font-bold">{service.candidatesInterviewed || 0}</div>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <div className="text-sm text-muted-foreground mb-1">Candidates Shortlisted</div>
                    <div className="text-2xl font-bold">{service.candidatesShortlisted || 0}</div>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <div className="text-sm text-muted-foreground mb-1">Interviews Arranged</div>
                    <div className="text-2xl font-bold">{service.candidatesInterviewed || 0}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Activity Timeline</CardTitle>
                <CardDescription>Recent activities and milestones</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="rounded-full bg-primary p-2">
                        <CheckCircle2 className="h-4 w-4 text-primary-foreground" />
                      </div>
                      <div className="w-px h-full bg-border mt-2" />
                    </div>
                    <div className="pb-4">
                      <div className="font-medium">Service Created</div>
                      <div className="text-sm text-muted-foreground">
                        {format(new Date(service.createdAt), 'MMM dd, yyyy HH:mm')}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="rounded-full bg-muted p-2">
                        <Users className="h-4 w-4" />
                      </div>
                      <div className="w-px h-full bg-border mt-2" />
                    </div>
                    <div className="pb-4">
                      <div className="font-medium">Team Assigned</div>
                      <div className="text-sm text-muted-foreground">
                        {service.consultants?.length || 0} consultants added to the project
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="rounded-full bg-muted p-2">
                        <TrendingUp className="h-4 w-4" />
                      </div>
                    </div>
                    <div>
                      <div className="font-medium">Last Updated</div>
                      <div className="text-sm text-muted-foreground">
                        {format(new Date(service.updatedAt), 'MMM dd, yyyy HH:mm')}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}