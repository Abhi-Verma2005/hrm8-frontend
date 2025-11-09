import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertCircle, Clock, ExternalLink } from 'lucide-react';
import { ActionItem } from '@/types/platformAdmin';
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';

interface ActionItemsCardProps {
  items: ActionItem[];
}

export function ActionItemsCard({ items }: ActionItemsCardProps) {
  const navigate = useNavigate();

  const getPriorityColor = (priority: ActionItem['priority']) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-500/10 text-red-600 border-red-500/20';
      case 'high':
        return 'bg-orange-500/10 text-orange-600 border-orange-500/20';
      case 'medium':
        return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20';
      case 'low':
        return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
    }
  };

  const getTypeLabel = (type: ActionItem['type']) => {
    const labels = {
      service: 'Service',
      ticket: 'Support',
      payment: 'Payment',
      integration: 'Integration',
      approval: 'Approval',
    };
    return labels[type];
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Critical Action Items
            </CardTitle>
            <CardDescription>Items requiring immediate attention</CardDescription>
          </div>
          <Badge variant="outline" className="bg-red-500/10 text-red-600 border-red-500/20">
            {items.filter(i => i.priority === 'critical' || i.priority === 'high').length} urgent
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">No action items at the moment</p>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className="flex items-start justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="outline" className={getPriorityColor(item.priority)}>
                    {item.priority}
                  </Badge>
                  <Badge variant="outline">{getTypeLabel(item.type)}</Badge>
                  {item.employerName && (
                    <span className="text-xs text-muted-foreground">{item.employerName}</span>
                  )}
                </div>
                <div>
                  <h4 className="font-medium text-sm">{item.title}</h4>
                  <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
                  </span>
                  {item.dueDate && (
                    <span className="text-orange-600">
                      Due: {new Date(item.dueDate).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(item.link)}
                className="ml-4"
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
