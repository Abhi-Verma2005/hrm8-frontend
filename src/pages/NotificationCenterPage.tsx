import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  Bell, CheckCircle, Clock, AlertTriangle, Info, Trash2, Check, Filter, Calendar, MessageSquare, Target, FileText, Users
} from "lucide-react";
import { DashboardPageLayout } from "@/components/layouts/DashboardPageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";
import { toast } from "sonner";

interface Notification {
  id: string;
  type: 'goal' | 'review' | 'feedback' | 'leave' | 'approval' | 'reminder' | 'system';
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  isRead: boolean;
  actionUrl?: string;
  actionLabel?: string;
  timestamp: string;
  metadata?: {
    employeeName?: string;
    dueDate?: string;
    status?: string;
  };
}

const mockNotifications: Notification[] = [
  {
    id: 'N001',
    type: 'approval',
    title: 'Leave Request Pending Approval',
    message: 'John Doe has submitted a leave request for your approval',
    priority: 'high',
    isRead: false,
    actionUrl: '/leave',
    actionLabel: 'Review Request',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    metadata: {
      employeeName: 'John Doe',
      status: 'pending'
    }
  },
  {
    id: 'N002',
    type: 'review',
    title: 'Performance Review Due Soon',
    message: 'Your performance review for Jane Smith is due in 3 days',
    priority: 'high',
    isRead: false,
    actionUrl: '/performance/reviews/REV-001',
    actionLabel: 'Complete Review',
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    metadata: {
      employeeName: 'Jane Smith',
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString()
    }
  },
  {
    id: 'N003',
    type: 'feedback',
    title: '360 Feedback Request',
    message: 'You have been selected to provide feedback for Mike Johnson',
    priority: 'medium',
    isRead: false,
    actionUrl: '/performance/feedback/FB360-001',
    actionLabel: 'Provide Feedback',
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    metadata: {
      employeeName: 'Mike Johnson'
    }
  },
  {
    id: 'N004',
    type: 'goal',
    title: 'Goal Update Required',
    message: 'Please update progress on your Q1 sales goal',
    priority: 'medium',
    isRead: true,
    actionUrl: '/performance/goals/GOAL-001',
    actionLabel: 'Update Goal',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'N005',
    type: 'reminder',
    title: 'Team Meeting Tomorrow',
    message: 'Reminder: Performance calibration session at 2:00 PM',
    priority: 'low',
    isRead: true,
    actionUrl: '/calendar',
    actionLabel: 'View Calendar',
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'N006',
    type: 'system',
    title: 'System Maintenance Scheduled',
    message: 'The system will be under maintenance this Saturday from 2-4 AM',
    priority: 'low',
    isRead: true,
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'N007',
    type: 'approval',
    title: 'Expense Report Approved',
    message: 'Your expense report #EXP-2024-001 has been approved',
    priority: 'low',
    isRead: true,
    actionUrl: '/expenses',
    actionLabel: 'View Details',
    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export default function NotificationCenterPage() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([]);
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'all' | 'unread'>('all');

  const filteredNotifications = useMemo(() => {
    return notifications.filter(notification => {
      const matchesPriority = priorityFilter === 'all' || notification.priority === priorityFilter;
      const matchesType = typeFilter === 'all' || notification.type === typeFilter;
      const matchesTab = activeTab === 'all' || (activeTab === 'unread' && !notification.isRead);
      return matchesPriority && matchesType && matchesTab;
    });
  }, [notifications, priorityFilter, typeFilter, activeTab]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'goal': return Target;
      case 'review': return FileText;
      case 'feedback': return MessageSquare;
      case 'leave': return Calendar;
      case 'approval': return CheckCircle;
      case 'reminder': return Clock;
      case 'system': return Info;
      default: return Bell;
    }
  };

  const getPriorityBadge = (priority: string) => {
    const variants: Record<string, { variant: any; label: string }> = {
      urgent: { variant: 'destructive', label: 'Urgent' },
      high: { variant: 'default', label: 'High' },
      medium: { variant: 'secondary', label: 'Medium' },
      low: { variant: 'outline', label: 'Low' },
    };
    return variants[priority] || variants.low;
  };

  const handleMarkAsRead = (ids: string[]) => {
    setNotifications(notifications.map(n => 
      ids.includes(n.id) ? { ...n, isRead: true } : n
    ));
    setSelectedNotifications([]);
    toast.success(`${ids.length} notification(s) marked as read`);
  };

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
    toast.success("All notifications marked as read");
  };

  const handleDelete = (ids: string[]) => {
    setNotifications(notifications.filter(n => !ids.includes(n.id)));
    setSelectedNotifications([]);
    toast.success(`${ids.length} notification(s) deleted`);
  };

  const handleSelectAll = () => {
    if (selectedNotifications.length === filteredNotifications.length) {
      setSelectedNotifications([]);
    } else {
      setSelectedNotifications(filteredNotifications.map(n => n.id));
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedNotifications(prev =>
      prev.includes(id) ? prev.filter(n => n !== id) : [...prev, id]
    );
  };

  const handleNotificationClick = (notification: Notification) => {
    handleMarkAsRead([notification.id]);
    if (notification.actionUrl) {
      navigate(notification.actionUrl);
    }
  };

  return (
    <DashboardPageLayout>
      <Helmet>
        <title>Notifications</title>
      </Helmet>

      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
              <Bell className="h-8 w-8" />
              Notifications
            </h1>
            <p className="text-muted-foreground">Stay updated with important events and actions</p>
          </div>
          {unreadCount > 0 && (
            <Button onClick={handleMarkAllAsRead} variant="outline">
              <Check className="h-4 w-4 mr-2" />
              Mark All as Read
            </Button>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Unread</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{unreadCount}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">High Priority</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {notifications.filter(n => n.priority === 'high' || n.priority === 'urgent').length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Pending Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {notifications.filter(n => n.actionUrl && !n.isRead).length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Total</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{notifications.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={selectedNotifications.length === filteredNotifications.length && filteredNotifications.length > 0}
                  onCheckedChange={handleSelectAll}
                />
                <span className="text-sm text-muted-foreground">Select All</span>
              </div>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="goal">Goals</SelectItem>
                  <SelectItem value="review">Reviews</SelectItem>
                  <SelectItem value="feedback">Feedback</SelectItem>
                  <SelectItem value="leave">Leave</SelectItem>
                  <SelectItem value="approval">Approvals</SelectItem>
                  <SelectItem value="reminder">Reminders</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
              {selectedNotifications.length > 0 && (
                <div className="flex gap-2 ml-auto">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleMarkAsRead(selectedNotifications)}
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Mark Read
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(selectedNotifications)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Notifications List */}
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'all' | 'unread')}>
          <TabsList>
            <TabsTrigger value="all">
              All ({notifications.length})
            </TabsTrigger>
            <TabsTrigger value="unread">
              Unread ({unreadCount})
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6 space-y-3">
            {filteredNotifications.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Bell className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Notifications</h3>
                  <p className="text-muted-foreground">
                    {activeTab === 'unread' 
                      ? "You're all caught up! No unread notifications."
                      : "You don't have any notifications yet."}
                  </p>
                </CardContent>
              </Card>
            ) : (
              filteredNotifications.map((notification) => {
                const TypeIcon = getTypeIcon(notification.type);
                const priorityBadge = getPriorityBadge(notification.priority);
                const isSelected = selectedNotifications.includes(notification.id);

                return (
                  <Card 
                    key={notification.id}
                    className={`cursor-pointer transition-all ${
                      !notification.isRead ? 'border-l-4 border-l-primary bg-accent/50' : ''
                    } ${isSelected ? 'ring-2 ring-primary' : ''}`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() => handleToggleSelect(notification.id)}
                          onClick={(e) => e.stopPropagation()}
                        />
                        <div 
                          className="flex-1 space-y-2"
                          onClick={() => handleNotificationClick(notification)}
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex items-start gap-3 flex-1">
                              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 flex-shrink-0">
                                <TypeIcon className="h-5 w-5 text-primary" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <h4 className={`font-semibold ${!notification.isRead ? 'text-foreground' : 'text-muted-foreground'}`}>
                                    {notification.title}
                                  </h4>
                                  {!notification.isRead && (
                                    <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                                  )}
                                </div>
                                <p className="text-sm text-muted-foreground">
                                  {notification.message}
                                </p>
                                {notification.metadata && (
                                  <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                                    {notification.metadata.employeeName && (
                                      <span className="flex items-center gap-1">
                                        <Users className="h-3 w-3" />
                                        {notification.metadata.employeeName}
                                      </span>
                                    )}
                                    {notification.metadata.dueDate && (
                                      <span className="flex items-center gap-1">
                                        <Clock className="h-3 w-3" />
                                        Due {format(new Date(notification.metadata.dueDate), 'MMM d')}
                                      </span>
                                    )}
                                  </div>
                                )}
                                <div className="flex items-center gap-3 mt-2">
                                  <span className="text-xs text-muted-foreground">
                                    {format(new Date(notification.timestamp), 'MMM d, yyyy h:mm a')}
                                  </span>
                                  {notification.priority !== 'low' && (
                                    <Badge variant={priorityBadge.variant} className="text-xs">
                                      {priorityBadge.label}
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                          {notification.actionUrl && !notification.isRead && (
                            <div className="pl-13">
                              <Button size="sm" variant="outline">
                                {notification.actionLabel || 'View Details'}
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardPageLayout>
  );
}
