import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Briefcase, MapPin, CheckCircle } from "lucide-react";
import { getAllServiceProjects } from "@/lib/recruitmentServiceStorage";
import { useNavigate } from "react-router-dom";
import { useMemo } from "react";
import type { ServiceProject } from "@/types/recruitmentService";

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

interface PendingServicesWidgetProps {
  maxItems?: number;
}

export function PendingServicesWidget({ maxItems = 5 }: PendingServicesWidgetProps) {
  const navigate = useNavigate();
  
  const pendingServices = useMemo(() => {
    const all = getAllServiceProjects();
    return all.filter(s => 
      s.status === 'active' && 
      s.stage === 'initiated' &&
      s.consultants.length === 0
    ).slice(0, maxItems);
  }, [maxItems]);

  const handleServiceClick = (service: ServiceProject) => {
    navigate(`/recruitment-services?id=${service.id}`);
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
                  className={`p-3 rounded-lg border-l-3 ${typeStyle.borderColor} bg-card hover:bg-muted/50 cursor-pointer transition-colors`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <Badge variant="outline" className={`${typeStyle.className} text-xs`}>
                      {typeStyle.label}
                    </Badge>
                    {service.priority === 'high' && (
                      <div className="h-2 w-2 rounded-full bg-orange-500 mt-1" />
                    )}
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
    </Card>
  );
}
