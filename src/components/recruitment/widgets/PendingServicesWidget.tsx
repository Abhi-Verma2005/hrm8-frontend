import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Briefcase, MapPin, CheckCircle, UserPlus } from "lucide-react";
import { getAllServiceProjects, updateServiceProject } from "@/lib/recruitmentServiceStorage";
import { useNavigate } from "react-router-dom";
import { useState, useMemo } from "react";
import { useToast } from "@/hooks/use-toast";
import type { ServiceProject } from "@/types/recruitmentService";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const SERVICE_TYPE_STYLES = {
  'shortlisting': {
    label: 'Shortlisting',
    className: 'bg-teal-500/10 text-teal-700 dark:text-teal-300 border-teal-500/20',
    borderColor: 'border-teal-500'
  },
  'full-service': {
    label: 'Full-Service',
    className: 'bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/20',
    borderColor: 'border-purple-500'
  },
  'executive-search': {
    label: 'Executive Search',
    className: 'bg-coral-500/10 text-coral-700 dark:text-coral-300 border-coral-500/20',
    borderColor: 'border-coral-500'
  },
  'rpo': {
    label: 'RPO',
    className: 'bg-orange-500/10 text-orange-700 dark:text-orange-300 border-orange-500/20',
    borderColor: 'border-orange-500'
  }
};

// Mock consultant data - in a real app, this would come from a consultants API/storage
const AVAILABLE_CONSULTANTS = [
  { id: 'cons_001', name: 'Sarah Mitchell', role: 'lead' as const },
  { id: 'cons_002', name: 'James Wilson', role: 'lead' as const },
  { id: 'cons_003', name: 'Emily Chen', role: 'support' as const },
  { id: 'cons_004', name: 'Michael Brown', role: 'support' as const },
  { id: 'cons_005', name: 'Lisa Anderson', role: 'lead' as const },
];

interface PendingServicesWidgetProps {
  maxItems?: number;
}

export function PendingServicesWidget({ maxItems = 5 }: PendingServicesWidgetProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<ServiceProject | null>(null);
  const [selectedConsultantId, setSelectedConsultantId] = useState<string>('');
  const [refreshKey, setRefreshKey] = useState(0);
  
  const pendingServices = useMemo(() => {
    const all = getAllServiceProjects();
    return all.filter(s => 
      s.status === 'active' && 
      s.stage === 'initiated' &&
      s.consultants.length === 0
    ).slice(0, maxItems);
  }, [maxItems, refreshKey]);

  const handleServiceClick = (service: ServiceProject) => {
    navigate(`/recruitment-services?id=${service.id}`);
  };

  const handleAssignClick = (e: React.MouseEvent, service: ServiceProject) => {
    e.stopPropagation(); // Prevent navigating to detail view
    setSelectedService(service);
    setSelectedConsultantId('');
    setIsAssignDialogOpen(true);
  };

  const handleAssignConsultant = () => {
    if (!selectedService || !selectedConsultantId) return;

    const consultant = AVAILABLE_CONSULTANTS.find(c => c.id === selectedConsultantId);
    if (!consultant) return;

    const updated = updateServiceProject(selectedService.id, {
      consultants: [
        {
          id: consultant.id,
          name: consultant.name,
          role: consultant.role,
        }
      ],
      stage: 'in-progress', // Move from 'initiated' to 'in-progress'
    });

    if (updated) {
      toast({
        title: "Consultant Assigned",
        description: `${consultant.name} has been assigned to ${selectedService.name}`,
      });
      setRefreshKey(prev => prev + 1); // Trigger refresh
      setIsAssignDialogOpen(false);
      setSelectedService(null);
    } else {
      toast({
        title: "Assignment Failed",
        description: "Could not assign consultant. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-primary" />
            Pending Service Requests
          </CardTitle>
          {pendingServices.length > 0 && (
            <Badge variant="destructive" className="bg-coral-500 hover:bg-coral-600">
              {pendingServices.length}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {pendingServices.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <CheckCircle className="h-12 w-12 text-success mb-3" />
            <p className="font-medium text-foreground">All service requests assigned! 🎉</p>
            <p className="text-sm text-muted-foreground mt-1">No pending services require action</p>
          </div>
        ) : (
          <div className="space-y-2 max-h-[400px] overflow-y-auto">
            {pendingServices.map((service) => {
              const typeStyle = SERVICE_TYPE_STYLES[service.serviceType];
              return (
                <div
                  key={service.id}
                  onClick={() => handleServiceClick(service)}
                  className={`p-3 rounded-lg border-l-3 ${typeStyle.borderColor} bg-card hover:bg-muted/50 cursor-pointer transition-colors group`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={`${typeStyle.className} text-xs`}>
                        {typeStyle.label}
                      </Badge>
                      {service.priority === 'high' && (
                        <div className="h-2 w-2 rounded-full bg-orange-500" />
                      )}
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => handleAssignClick(e, service)}
                      title="Quick Assign Consultant"
                    >
                      <UserPlus className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="font-semibold text-foreground text-sm mb-1">
                    {service.clientName}
                  </p>
                  <p className="text-sm text-foreground/80 mb-1 line-clamp-1">
                    {service.name}
                  </p>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    <span className="line-clamp-1">{service.location}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>

      {/* Quick Assign Dialog */}
      <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Consultant</DialogTitle>
            <DialogDescription>
              Select a consultant to assign to {selectedService?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Consultant</label>
              <Select value={selectedConsultantId} onValueChange={setSelectedConsultantId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a consultant" />
                </SelectTrigger>
                <SelectContent>
                  {AVAILABLE_CONSULTANTS.map((consultant) => (
                    <SelectItem key={consultant.id} value={consultant.id}>
                      {consultant.name} ({consultant.role})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setIsAssignDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleAssignConsultant}
                disabled={!selectedConsultantId}
              >
                Assign
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
