import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Clock, CheckCircle2, XCircle, Sparkles } from "lucide-react";
import { getActiveTrials, startTrial, updateTrialStatus } from "@/lib/mockModuleTrialStorage";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface ModuleTrialCardProps {
  employerId: string;
}

export function ModuleTrialCard({ employerId }: ModuleTrialCardProps) {
  const { toast } = useToast();
  const [trials, setTrials] = useState(getActiveTrials(employerId));

  const availableTrials = [
    { module: 'hrms.payroll', name: 'Payroll Management', description: 'Automated payroll processing' },
    { module: 'hrms.performance', name: 'Performance Reviews', description: 'Employee performance tracking' },
    { module: 'ats.ai-screening', name: 'AI Candidate Screening', description: 'Automated resume analysis' },
    { module: 'addon.video-interviewing', name: 'Video Interviewing', description: 'Built-in video calls' }
  ];

  const handleStartTrial = (moduleName: string) => {
    const newTrial = startTrial(employerId, moduleName);
    setTrials([...trials, newTrial]);
    toast({
      title: "Trial Started!",
      description: "Your 14-day trial has begun. Enjoy full access to all features.",
    });
  };

  const handleConvert = (trialId: string) => {
    updateTrialStatus(trialId, 'converted', new Date());
    setTrials(trials.filter(t => t.id !== trialId));
    toast({
      title: "Converted to Paid!",
      description: "Thank you for upgrading. You now have full access.",
    });
  };

  const handleCancel = (trialId: string) => {
    updateTrialStatus(trialId, 'cancelled', undefined, 'User cancelled trial');
    setTrials(trials.filter(t => t.id !== trialId));
    toast({
      title: "Trial Cancelled",
      description: "Your trial has been cancelled. Access will end on the trial end date.",
    });
  };

  const getDaysRemaining = (endDate: Date) => {
    const now = new Date();
    const diff = endDate.getTime() - now.getTime();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5" />
          Module Trials
        </CardTitle>
        <CardDescription>Try premium features free for 14 days</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Active Trials */}
        {trials.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-semibold">Active Trials</h3>
            {trials.map((trial) => {
              const daysRemaining = getDaysRemaining(trial.endDate);
              const progress = ((14 - daysRemaining) / 14) * 100;

              return (
                <div key={trial.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold">{formatModuleName(trial.moduleName)}</h4>
                        <Badge variant="default">Trial Active</Badge>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                        <Clock className="h-4 w-4" />
                        <span>{daysRemaining} days remaining</span>
                      </div>

                      <div className="space-y-2">
                        <Progress value={progress} className="h-2" />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Started {trial.startDate.toLocaleDateString()}</span>
                          <span>Ends {trial.endDate.toLocaleDateString()}</span>
                        </div>
                      </div>

                      <div className="mt-3 text-sm">
                        <span className="text-muted-foreground">Usage: </span>
                        <span className="font-medium">{trial.usageCount} sessions</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2 border-t">
                    <Button
                      size="sm"
                      onClick={() => handleConvert(trial.id)}
                    >
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Convert to Paid
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCancel(trial.id)}
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Cancel Trial
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Available Trials */}
        <div className="space-y-4">
          <h3 className="font-semibold">Available Trials</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {availableTrials
              .filter(at => !trials.some(t => t.moduleName === at.module))
              .map((available) => (
                <div key={available.module} className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-1">{available.name}</h4>
                  <p className="text-sm text-muted-foreground mb-3">{available.description}</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => handleStartTrial(available.module)}
                  >
                    Start 14-Day Trial
                  </Button>
                </div>
              ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
