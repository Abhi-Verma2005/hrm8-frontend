import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Sparkles, TrendingUp, X, ExternalLink } from "lucide-react";
import { getModuleRecommendations, dismissRecommendation } from "@/lib/mockModuleUsageStorage";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface ModuleRecommendationsCardProps {
  employerId: string;
  onUpgrade?: (module: string) => void;
}

export function ModuleRecommendationsCard({ employerId, onUpgrade }: ModuleRecommendationsCardProps) {
  const { toast } = useToast();
  const [recommendations, setRecommendations] = useState(getModuleRecommendations(employerId));

  const handleDismiss = (recommendationId: string) => {
    dismissRecommendation(recommendationId);
    setRecommendations(recommendations.filter(r => r.id !== recommendationId));
    toast({
      title: "Recommendation dismissed",
      description: "We won't show this recommendation again.",
    });
  };

  const handleLearnMore = (module: string) => {
    toast({
      title: "Learn More",
      description: `Discover how ${module} module can help your business`,
    });
    // In production, this would navigate to module details
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-500';
      case 'medium': return 'text-orange-500';
      case 'low': return 'text-blue-500';
      default: return 'text-gray-500';
    }
  };

  const formatModuleName = (module: string) => {
    return module
      .replace('ats.', 'ATS: ')
      .replace('hrms.', 'HRMS: ')
      .replace('addon.', '')
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  if (recommendations.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            Smart Recommendations
          </CardTitle>
          <CardDescription>AI-powered module suggestions based on your usage</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground">No new recommendations at this time.</p>
            <p className="text-sm text-muted-foreground mt-2">
              We'll analyze your usage patterns and suggest relevant upgrades.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5" />
          Smart Recommendations
        </CardTitle>
        <CardDescription>AI-powered module suggestions based on your usage</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {recommendations.map((rec) => (
          <div key={rec.id} className="border rounded-lg p-4 space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="font-semibold">{formatModuleName(rec.recommendedModule)}</h4>
                  <Badge 
                    variant="outline" 
                    className={getPriorityColor(rec.priority)}
                  >
                    {rec.priority} priority
                  </Badge>
                </div>
                
                <div className="space-y-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Confidence:</span>
                    <Progress value={rec.confidence * 100} className="flex-1 max-w-[200px]" />
                    <span className="text-sm font-medium">{(rec.confidence * 100).toFixed(0)}%</span>
                  </div>
                </div>

                <div className="space-y-1 mb-3">
                  {rec.reasoning.map((reason, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-sm">
                      <span className="text-muted-foreground">•</span>
                      <span className="text-muted-foreground">{reason}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium text-green-500">
                    Estimated ROI: ${rec.estimatedROI.toLocaleString()}/year
                  </span>
                </div>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDismiss(rec.id)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex gap-2 pt-2 border-t">
              <Button
                size="sm"
                onClick={() => onUpgrade?.(rec.recommendedModule)}
              >
                Upgrade Now
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleLearnMore(rec.recommendedModule)}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Learn More
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
