import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  FileText, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Calendar,
  AlertCircle,
  RefreshCw,
  UserPlus,
  ExternalLink,
  CheckCircle
} from 'lucide-react';
import { getRPODashboardMetrics } from '@/lib/rpoTrackingUtils';
import { format, differenceInDays } from 'date-fns';
import { RPOConsultantAssignmentDialog } from '@/components/rpo/RPOConsultantAssignmentDialog';
import { getServiceProjectById } from '@/lib/recruitmentServiceStorage';

interface RPOContractsTabProps {
  employerId: string;
}

export function RPOContractsTab({ employerId }: RPOContractsTabProps) {
  const navigate = useNavigate();
  const [selectedContractId, setSelectedContractId] = useState<string | null>(null);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);

  const metrics = getRPODashboardMetrics();
  const employerContracts = metrics.contracts.filter(
    contract => contract.clientName === employerId || contract.id.includes(employerId)
  );

  const selectedContract = selectedContractId ? getServiceProjectById(selectedContractId) : null;

  const activeContracts = employerContracts.filter(c => c.status === 'active');
  const totalMRR = activeContracts.reduce((sum, c) => sum + c.monthlyRetainer, 0);
  const totalConsultants = activeContracts.reduce((sum, c) => sum + c.numberOfConsultants, 0);
  const expiringCount = activeContracts.filter(c => c.isExpiring).length;

  const statusColors = {
    'active': 'bg-green-500',
    'on-hold': 'bg-yellow-500',
    'completed': 'bg-blue-500',
    'cancelled': 'bg-destructive'
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const handleRenewContract = (contractId: string) => {
    // Navigate to renewal workflow or open renewal dialog
    navigate(`/rpo/renewals?contract=${contractId}`);
  };

  const handleAssignConsultant = (contractId: string) => {
    setSelectedContractId(contractId);
    setIsAssignDialogOpen(true);
  };

  if (employerContracts.length === 0) {
    return (
      <div className="space-y-4">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No RPO Contracts</h3>
            <p className="text-muted-foreground text-center mb-4">
              This employer doesn't have any RPO contracts yet.
            </p>
            <Button onClick={() => navigate('/services?type=rpo')}>
              <FileText className="h-4 w-4 mr-2" />
              Create RPO Contract
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Metrics */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Active Contracts</CardDescription>
            <CardTitle className="text-3xl">{activeContracts.length}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {expiringCount > 0 && (
                <span className="text-destructive font-medium">
                  {expiringCount} expiring soon
                </span>
              )}
              {expiringCount === 0 && "All contracts healthy"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Monthly Recurring Revenue</CardDescription>
            <CardTitle className="text-3xl">${totalMRR.toLocaleString()}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              From {activeContracts.length} active contract{activeContracts.length !== 1 ? 's' : ''}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Assigned Consultants</CardDescription>
            <CardTitle className="text-3xl">{totalConsultants}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Across all active contracts
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Contract Value</CardDescription>
            <CardTitle className="text-3xl">
              ${activeContracts.reduce((sum, c) => sum + c.totalContractValue, 0).toLocaleString()}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Lifetime value
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Expiring Contracts Alert */}
      {expiringCount > 0 && (
        <Card className="border-destructive">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              <CardTitle className="text-destructive">Action Required: {expiringCount} Contract{expiringCount !== 1 ? 's' : ''} Expiring Soon</CardTitle>
            </div>
            <CardDescription>
              The following contracts are expiring within 30 days and require renewal attention
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {activeContracts.filter(c => c.isExpiring).map(contract => (
                <div key={contract.id} className="flex items-center justify-between p-3 bg-destructive/10 rounded-lg">
                  <div>
                    <p className="font-medium">{contract.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {contract.daysRemaining} days remaining • Expires {contract.endDate ? format(new Date(contract.endDate), 'PP') : 'N/A'}
                    </p>
                  </div>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => handleRenewContract(contract.id)}
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Renew Now
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Contract Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">All RPO Contracts</h3>
          <Button onClick={() => navigate('/services?type=rpo')}>
            <FileText className="h-4 w-4 mr-2" />
            New RPO Contract
          </Button>
        </div>

        <div className="grid gap-4">
          {employerContracts.map(contract => (
            <Card key={contract.id} className={contract.isExpiring ? 'border-destructive' : ''}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    {contract.clientLogo && (
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={contract.clientLogo} alt={contract.clientName} />
                        <AvatarFallback>{getInitials(contract.clientName)}</AvatarFallback>
                      </Avatar>
                    )}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <CardTitle className="text-lg">{contract.name}</CardTitle>
                        <Badge className={statusColors[contract.status]}>
                          {contract.status.toUpperCase()}
                        </Badge>
                        {contract.isExpiring && (
                          <Badge variant="destructive">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            Expiring in {contract.daysRemaining} days
                          </Badge>
                        )}
                      </div>
                      <div className="grid md:grid-cols-4 gap-4 mt-3">
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Duration</p>
                          <p className="font-medium">{contract.duration} months</p>
                          {contract.daysRemaining !== undefined && (
                            <p className="text-xs text-muted-foreground">{contract.daysRemaining} days left</p>
                          )}
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Monthly Retainer</p>
                          <p className="font-medium">${contract.monthlyRetainer.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Consultants</p>
                          <p className="font-medium">{contract.numberOfConsultants} assigned</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Progress</p>
                          <div className="flex items-center gap-2">
                            <Progress value={contract.progress} className="flex-1 h-2" />
                            <span className="text-sm font-medium">{contract.progress}%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                {/* Assigned Consultants */}
                {contract.assignedConsultants.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm font-medium mb-2">Assigned Consultants</p>
                    <div className="flex items-center gap-2 flex-wrap">
                      {contract.assignedConsultants.slice(0, 5).map(assignment => (
                        <div key={assignment.id} className="flex items-center gap-2 bg-muted px-2 py-1 rounded">
                          <Avatar className="h-6 w-6">
                            {assignment.avatar && <AvatarImage src={assignment.avatar} />}
                            <AvatarFallback className="text-xs">
                              {getInitials(assignment.consultantName)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm">{assignment.consultantName}</span>
                          <Badge variant={assignment.isActive ? "default" : "secondary"} className="text-xs">
                            {assignment.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                      ))}
                      {contract.assignedConsultants.length > 5 && (
                        <Badge variant="outline">
                          +{contract.assignedConsultants.length - 5} more
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                {/* Performance Metrics */}
                <div className="grid md:grid-cols-3 gap-4 mb-4 p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Placements</p>
                      <p className="text-sm font-medium">
                        {contract.currentPlacements}{contract.targetPlacements ? ` / ${contract.targetPlacements}` : ''}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Contract Period</p>
                      <p className="text-sm font-medium">
                        {format(new Date(contract.startDate), 'MMM yyyy')} - 
                        {contract.endDate ? format(new Date(contract.endDate), 'MMM yyyy') : 'Ongoing'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Total Value</p>
                      <p className="text-sm font-medium">${contract.totalContractValue.toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2">
                  <Button 
                    variant="default" 
                    size="sm"
                    onClick={() => navigate(`/rpo/contracts/${contract.id}`)}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleAssignConsultant(contract.id)}
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Manage Consultants
                  </Button>
                  {contract.isExpiring && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                      onClick={() => handleRenewContract(contract.id)}
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Renew Contract
                    </Button>
                  )}
                  {contract.status === 'active' && !contract.isExpiring && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleRenewContract(contract.id)}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Early Renewal
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Consultant Assignment Dialog */}
      {selectedContract && (
        <RPOConsultantAssignmentDialog
          open={isAssignDialogOpen}
          onOpenChange={setIsAssignDialogOpen}
          contract={selectedContract}
          onAssignmentComplete={() => {
            setIsAssignDialogOpen(false);
            setSelectedContractId(null);
            window.location.reload();
          }}
        />
      )}
    </div>
  );
}
