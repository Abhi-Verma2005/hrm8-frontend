import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Play, CheckCircle, XCircle, Clock, Award } from 'lucide-react';
import { startTraining, completeTraining } from '@/lib/onboardingStorage';
import { toast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import type { OnboardingWorkflow, TrainingModule } from '@/types/onboarding';

interface OnboardingTrainingProps {
  workflow: OnboardingWorkflow;
}

export function OnboardingTraining({ workflow }: OnboardingTrainingProps) {
  const handleStart = (trainingId: string) => {
    startTraining(workflow.id, trainingId);
    toast({
      title: "Training Started",
      description: "You can now begin the training module",
    });
    window.location.reload();
  };

  const handleComplete = (trainingId: string, score: number) => {
    completeTraining(workflow.id, trainingId, score);
    
    const training = workflow.training.find(t => t.id === trainingId);
    const passed = training && score >= training.passingScore;
    
    toast({
      title: passed ? "Training Passed!" : "Training Failed",
      description: passed 
        ? `You scored ${score}% and passed the training`
        : `You scored ${score}%. Minimum passing score is ${training?.passingScore}%`,
      variant: passed ? 'default' : 'destructive',
    });
    
    window.location.reload();
  };

  const getStatusIcon = (status: TrainingModule['status']) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'failed': return <XCircle className="h-5 w-5 text-red-500" />;
      case 'in-progress': return <Clock className="h-5 w-5 text-blue-500" />;
      default: return <Play className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const categories = Array.from(new Set(workflow.training.map(t => t.category)));

  return (
    <div className="space-y-6">
      {categories.map(category => {
        const modules = workflow.training
          .filter(t => t.category === category)
          .sort((a, b) => a.order - b.order);

        return (
          <Card key={category}>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-4">
                <h3 className="font-semibold capitalize">{category.replace('-', ' ')}</h3>
                <Badge variant="outline">
                  {modules.filter(m => m.status === 'completed').length} / {modules.length}
                </Badge>
              </div>

              <div className="space-y-4">
                {modules.map(module => (
                  <div key={module.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          {getStatusIcon(module.status)}
                          <span className="font-medium">{module.title}</span>
                          {module.isRequired && (
                            <Badge variant="destructive" className="text-xs">Required</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{module.description}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                          <span>Duration: {module.duration} min</span>
                          <span>Passing Score: {module.passingScore}%</span>
                          <span>Attempts: {module.attempts}/{module.maxAttempts}</span>
                        </div>
                      </div>
                      <Badge variant={
                        module.status === 'completed' ? 'default' :
                        module.status === 'failed' ? 'destructive' :
                        module.status === 'in-progress' ? 'secondary' :
                        'outline'
                      }>
                        {module.status.replace('-', ' ')}
                      </Badge>
                    </div>

                    {/* Not Started */}
                    {module.status === 'not-started' && (
                      <Button
                        onClick={() => handleStart(module.id)}
                        className="w-full"
                        variant="default"
                      >
                        <Play className="h-4 w-4 mr-2" />
                        Start Training
                      </Button>
                    )}

                    {/* In Progress */}
                    {module.status === 'in-progress' && (
                      <div className="space-y-3">
                        {module.startedDate && (
                          <div className="text-xs text-muted-foreground">
                            Started {format(new Date(module.startedDate), 'MMM dd, yyyy')}
                          </div>
                        )}
                        <Button
                          onClick={() => handleComplete(module.id, Math.floor(Math.random() * 40) + 60)}
                          className="w-full"
                        >
                          Continue Training
                        </Button>
                        {module.attempts > 0 && module.score !== undefined && (
                          <div className="p-3 bg-muted rounded">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium">Last Attempt Score</span>
                              <span className="text-sm font-bold">{module.score}%</span>
                            </div>
                            <Progress value={module.score} />
                          </div>
                        )}
                      </div>
                    )}

                    {/* Completed */}
                    {module.status === 'completed' && (
                      <div className="space-y-3">
                        <div className="p-4 bg-green-500/10 border border-green-500/50 rounded">
                          <div className="flex items-center gap-2 mb-2">
                            <Award className="h-5 w-5 text-green-500" />
                            <span className="font-medium text-green-700">Completed Successfully</span>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-muted-foreground">Score:</span>
                              <span className="ml-2 font-bold text-green-600">{module.score}%</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Completed:</span>
                              <span className="ml-2">
                                {module.completedDate && format(new Date(module.completedDate), 'MMM dd, yyyy')}
                              </span>
                            </div>
                          </div>
                        </div>
                        {module.certificateUrl && (
                          <Button variant="outline" className="w-full">
                            <Award className="h-4 w-4 mr-2" />
                            Download Certificate
                          </Button>
                        )}
                      </div>
                    )}

                    {/* Failed */}
                    {module.status === 'failed' && (
                      <div className="p-4 bg-red-500/10 border border-red-500/50 rounded">
                        <div className="flex items-center gap-2 mb-2">
                          <XCircle className="h-5 w-5 text-red-500" />
                          <span className="font-medium text-red-700">Maximum Attempts Reached</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          You've used all {module.maxAttempts} attempts. Please contact your coordinator for assistance.
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
