import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, ExternalLink } from 'lucide-react';
import { UpgradeOpportunity } from '@/types/platformAdmin';
import { useNavigate } from 'react-router-dom';

interface UpgradeOpportunitiesCardProps {
  opportunities: UpgradeOpportunity[];
}

export function UpgradeOpportunitiesCard({ opportunities }: UpgradeOpportunitiesCardProps) {
  const navigate = useNavigate();

  const getLikelihoodColor = (likelihood: UpgradeOpportunity['likelihood']) => {
    switch (likelihood) {
      case 'high':
        return 'bg-green-500/10 text-green-600 border-green-500/20';
      case 'medium':
        return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20';
      case 'low':
        return 'bg-gray-500/10 text-gray-600 border-gray-500/20';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Upgrade Opportunities
        </CardTitle>
        <CardDescription>High-potential upsell opportunities</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {opportunities.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">No opportunities identified</p>
        ) : (
          opportunities.map((opp) => (
            <div
              key={opp.employerId}
              className="flex items-start justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="outline" className={getLikelihoodColor(opp.likelihood)}>
                    {opp.likelihood} likelihood
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {opp.currentTier} → {opp.suggestedTier}
                  </span>
                </div>
                <div>
                  <h4 className="font-medium text-sm">{opp.employerName}</h4>
                  <p className="text-xs text-muted-foreground mt-1">{opp.reason}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-green-600">
                    +${opp.potentialMRR.toLocaleString()} MRR
                  </span>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(`/employers/${opp.employerId}`)}
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
