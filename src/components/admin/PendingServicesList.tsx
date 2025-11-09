import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ClipboardList, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getAllServiceProjects } from '@/lib/recruitmentServiceStorage';

export function PendingServicesList() {
  const navigate = useNavigate();
  const services = getAllServiceProjects().filter(s => s.status === 'active' && s.stage === 'initiated').slice(0, 5);

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'initiated':
        return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
      case 'in-progress':
        return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ClipboardList className="h-5 w-5" />
          Pending Services
        </CardTitle>
        <CardDescription>Recruitment services awaiting action</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {services.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">No pending services</p>
        ) : (
          services.map((service) => (
            <div
              key={service.id}
              className="flex items-start justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className={getStageColor(service.stage)}>
                    {service.stage}
                  </Badge>
                  <Badge variant="outline">{service.serviceType}</Badge>
                </div>
                <h4 className="font-medium text-sm">{service.clientName}</h4>
                <p className="text-xs text-muted-foreground">
                  {service.consultants.length} consultant{service.consultants.length !== 1 ? 's' : ''} assigned
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(`/recruitment-services/${service.id}`)}
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          ))
        )}
        {services.length > 0 && (
          <Button
            variant="outline"
            className="w-full mt-2"
            onClick={() => navigate('/recruitment-services')}
          >
            View All Services
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
