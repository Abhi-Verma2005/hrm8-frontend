import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  CheckCircle, 
  DollarSign, 
  Calendar, 
  FileText, 
  File,
  Briefcase,
  ArrowRight,
  Search,
  User,
} from 'lucide-react';
import { getConsultantActivities } from '@/lib/consultantCRMStorage';
import { formatDistanceToNow, format, isToday, isYesterday, isThisWeek } from 'date-fns';

interface EnhancedActivityTimelineProps {
  consultantId: string;
}

type ActivityType = 'all' | 'placement' | 'commission' | 'meeting' | 'note-added' | 'document-uploaded' | 'task-created' | 'assignment' | 'status-change';

const activityConfig = {
  'placement': { 
    icon: CheckCircle, 
    color: 'text-success',
    bgColor: 'bg-success/10',
    label: 'Placement' 
  },
  'commission': { 
    icon: DollarSign, 
    color: 'text-primary',
    bgColor: 'bg-primary/10',
    label: 'Commission' 
  },
  'meeting': { 
    icon: Calendar, 
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
    label: 'Meeting' 
  },
  'note-added': { 
    icon: FileText, 
    color: 'text-muted-foreground',
    bgColor: 'bg-muted',
    label: 'Note' 
  },
  'document-uploaded': { 
    icon: File, 
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
    label: 'Document' 
  },
  'task-created': {
    icon: CheckCircle,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    label: 'Task'
  },
  'task-completed': {
    icon: CheckCircle,
    color: 'text-success',
    bgColor: 'bg-success/10',
    label: 'Task Completed'
  },
  'assignment': { 
    icon: Briefcase, 
    color: 'text-teal-600',
    bgColor: 'bg-teal-100',
    label: 'Assignment' 
  },
  'status-change': { 
    icon: ArrowRight, 
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100',
    label: 'Status Change' 
  },
  'profile-updated': {
    icon: User,
    color: 'text-muted-foreground',
    bgColor: 'bg-muted',
    label: 'Profile Update'
  }
};

export function EnhancedActivityTimeline({ consultantId }: EnhancedActivityTimelineProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<ActivityType>('all');
  const [dateRange, setDateRange] = useState('30'); // days

  const activities = getConsultantActivities(consultantId);

  // Filter and search activities
  const filteredActivities = useMemo(() => {
    let filtered = activities;

    // Filter by type
    if (filterType !== 'all') {
      filtered = filtered.filter(a => a.type === filterType);
    }

    // Filter by date range
    const daysAgo = parseInt(dateRange);
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysAgo);
    filtered = filtered.filter(a => new Date(a.createdAt) >= cutoffDate);

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(a => 
        a.title.toLowerCase().includes(query) ||
        a.description?.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [activities, filterType, dateRange, searchQuery]);

  // Group activities by date
  const groupedActivities = useMemo(() => {
    const groups: Record<string, typeof activities> = {};
    
    filteredActivities.forEach(activity => {
      const date = new Date(activity.createdAt);
      let groupKey: string;
      
      if (isToday(date)) {
        groupKey = 'Today';
      } else if (isYesterday(date)) {
        groupKey = 'Yesterday';
      } else if (isThisWeek(date)) {
        groupKey = 'This Week';
      } else {
        groupKey = format(date, 'MMMM yyyy');
      }
      
      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(activity);
    });
    
    return groups;
  }, [filteredActivities]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity History</CardTitle>
        <div className="flex flex-col sm:flex-row gap-3 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search activities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          
          <Select value={filterType} onValueChange={(v) => setFilterType(v as ActivityType)}>
            <SelectTrigger className="w-full sm:w-[160px]">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="placement">Placements</SelectItem>
              <SelectItem value="commission">Commissions</SelectItem>
              <SelectItem value="meeting">Meetings</SelectItem>
              <SelectItem value="note-added">Notes</SelectItem>
              <SelectItem value="document-uploaded">Documents</SelectItem>
              <SelectItem value="task-created">Tasks</SelectItem>
            </SelectContent>
          </Select>

          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-full sm:w-[140px]">
              <SelectValue placeholder="Date Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 Days</SelectItem>
              <SelectItem value="30">Last 30 Days</SelectItem>
              <SelectItem value="90">Last 90 Days</SelectItem>
              <SelectItem value="365">Last Year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      
      <CardContent>
        {filteredActivities.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">No activities found</p>
            {(searchQuery || filterType !== 'all') && (
              <p className="text-xs mt-1">Try adjusting your filters</p>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedActivities).map(([groupKey, groupActivities]) => (
              <div key={groupKey}>
                <h4 className="text-sm font-semibold text-muted-foreground mb-3">
                  {groupKey}
                </h4>
                <div className="space-y-3 relative pl-6 border-l-2 border-border">
                  {groupActivities.map((activity, index) => {
                    const config = activityConfig[activity.type as keyof typeof activityConfig] || activityConfig['note-added'];
                    const Icon = config.icon;
                    
                    return (
                      <div key={activity.id} className="relative">
                        {/* Timeline dot */}
                        <div className={`absolute -left-[27px] top-1 w-6 h-6 rounded-full flex items-center justify-center ${config.bgColor}`}>
                          <Icon className={`h-3 w-3 ${config.color}`} />
                        </div>
                        
                        {/* Activity content */}
                        <div className="pb-3">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-medium text-sm">{activity.title}</span>
                              <Badge variant="secondary" className="text-xs">
                                {config.label}
                              </Badge>
                            </div>
                            <span className="text-xs text-muted-foreground whitespace-nowrap">
                              {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
                            </span>
                          </div>
                          
                          {activity.description && (
                            <p className="text-sm text-muted-foreground">
                              {activity.description}
                            </p>
                          )}
                          
                          {activity.metadata && Object.keys(activity.metadata).length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-2">
                              {Object.entries(activity.metadata).slice(0, 3).map(([key, value]) => (
                                <span key={key} className="text-xs text-muted-foreground">
                                  {key}: <span className="font-medium">{String(value)}</span>
                                </span>
                              ))}
                            </div>
                          )}
                          
                          {activity.userName && (
                            <p className="text-xs text-muted-foreground mt-1">
                              by {activity.userName}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
