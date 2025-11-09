import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, ExternalLink } from 'lucide-react';
import { EmployerHealth } from '@/types/platformAdmin';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';

interface ChurnRiskListProps {
  employers: EmployerHealth[];
}

export function ChurnRiskList({ employers }: ChurnRiskListProps) {
  const navigate = useNavigate();

  const getRiskColor = (riskLevel: EmployerHealth['riskLevel']) => {
    switch (riskLevel) {
      case 'critical':
        return 'bg-red-500/10 text-red-600 border-red-500/20';
      case 'high':
        return 'bg-orange-500/10 text-orange-600 border-orange-500/20';
      case 'medium':
        return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20';
      case 'low':
        return 'bg-green-500/10 text-green-600 border-green-500/20';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          At-Risk Employers
        </CardTitle>
        <CardDescription>Employers requiring attention</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {employers.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">No at-risk employers</p>
        ) : (
          employers.map((employer) => (
            <div
              key={employer.employerId}
              className="flex items-start justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="outline" className={getRiskColor(employer.riskLevel)}>
                    {employer.riskLevel} risk
                  </Badge>
                  <Badge variant="outline">{employer.subscriptionTier}</Badge>
                  <span className="text-xs text-muted-foreground">
                    Score: {employer.healthScore}/100
                  </span>
                </div>
                <div>
                  <h4 className="font-medium text-sm">{employer.employerName}</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    MRR: ${employer.mrr.toLocaleString()} • {employer.activeUsers} users
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Last active: {formatDistanceToNow(new Date(employer.lastActivity), { addSuffix: true })}
                  </p>
                </div>
                <div className="space-y-1">
                  {employer.issues.map((issue, idx) => (
                    <p key={idx} className="text-xs text-orange-600">• {issue}</p>
                  ))}
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(`/employers/${employer.employerId}`)}
                className="ml-2"
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
