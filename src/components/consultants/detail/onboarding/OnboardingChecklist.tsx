import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { CheckCircle, Circle, Clock, AlertCircle } from 'lucide-react';
import { completeChecklistItem } from '@/lib/onboardingStorage';
import { toast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import type { OnboardingWorkflow, OnboardingChecklistItem } from '@/types/onboarding';

interface OnboardingChecklistProps {
  workflow: OnboardingWorkflow;
}

export function OnboardingChecklist({ workflow }: OnboardingChecklistProps) {
  const handleToggle = (item: OnboardingChecklistItem) => {
    if (item.status === 'completed') return;

    completeChecklistItem(workflow.id, item.id, 'current-user');
    
    toast({
      title: "Task Completed",
      description: `"${item.title}" marked as complete`,
    });

    window.location.reload();
  };

  const categories = Array.from(new Set(workflow.checklist.map(item => item.category)));

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      hr: 'bg-blue-500',
      it: 'bg-purple-500',
      training: 'bg-green-500',
      documentation: 'bg-orange-500',
      admin: 'bg-cyan-500',
      compliance: 'bg-red-500',
    };
    return colors[category] || 'bg-gray-500';
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'medium':
        return <Clock className="h-4 w-4 text-orange-500" />;
      default:
        return <Circle className="h-4 w-4 text-green-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {categories.map(category => {
        const items = workflow.checklist
          .filter(item => item.category === category)
          .sort((a, b) => a.order - b.order);

        return (
          <Card key={category}>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-4">
                <div className={`w-3 h-3 rounded-full ${getCategoryColor(category)}`} />
                <h3 className="font-semibold capitalize">{category}</h3>
                <Badge variant="outline">
                  {items.filter(i => i.status === 'completed').length} / {items.length}
                </Badge>
              </div>

              <div className="space-y-3">
                {items.map(item => (
                  <div
                    key={item.id}
                    className={`flex items-start gap-4 p-4 border rounded-lg transition-colors ${
                      item.status === 'completed' ? 'bg-muted/50' : 'hover:bg-muted/30'
                    }`}
                  >
                    <Checkbox
                      checked={item.status === 'completed'}
                      onCheckedChange={() => handleToggle(item)}
                      disabled={item.status === 'completed'}
                    />

                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`font-medium ${
                              item.status === 'completed' ? 'line-through text-muted-foreground' : ''
                            }`}>
                              {item.title}
                            </span>
                            {item.isRequired && (
                              <Badge variant="destructive" className="text-xs">Required</Badge>
                            )}
                            {getPriorityIcon(item.priority)}
                          </div>
                          <p className="text-sm text-muted-foreground">{item.description}</p>
                          
                          {item.dueDate && (
                            <div className="text-xs text-muted-foreground mt-2">
                              Due: {format(new Date(item.dueDate), 'MMM dd, yyyy')}
                            </div>
                          )}
                          
                          {item.completedDate && (
                            <div className="text-xs text-green-600 mt-2 flex items-center gap-1">
                              <CheckCircle className="h-3 w-3" />
                              Completed {format(new Date(item.completedDate), 'MMM dd, yyyy')}
                              {item.completedBy && ` by ${item.completedBy}`}
                            </div>
                          )}

                          {item.notes && (
                            <div className="mt-2 p-2 bg-muted rounded text-xs">
                              {item.notes}
                            </div>
                          )}
                        </div>

                        <Badge variant={
                          item.status === 'completed' ? 'default' :
                          item.status === 'in-progress' ? 'secondary' :
                          'outline'
                        }>
                          {item.status.replace('-', ' ')}
                        </Badge>
                      </div>
                    </div>
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
