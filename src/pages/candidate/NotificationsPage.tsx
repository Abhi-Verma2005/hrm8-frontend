import { useState, useEffect } from 'react';
import { Bell, Check, Trash2, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { apiClient } from '@/lib/api';
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { CandidatePageLayout } from '@/components/layouts/CandidatePageLayout';
import { AtsPageHeader } from '@/components/layouts/AtsPageHeader';

interface Notification {
    id: string;
    type: string;
    title: string;
    message: string;
    data?: {
        jobId?: string;
        jobTitle?: string;
        company?: string;
        location?: string;
        workArrangement?: string;
        employmentType?: string;
    };
    read: boolean;
    createdAt: string;
}

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [unreadCount, setUnreadCount] = useState(0);
    const navigate = useNavigate();

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const response = await apiClient.get('/candidate/notifications');
            const data = response.data as { success: boolean; data: { notifications: Notification[]; unreadCount: number } };
            if (data.success) {
                setNotifications(data.data.notifications);
                setUnreadCount(data.data.unreadCount);
            }
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (id: string) => {
        try {
            await apiClient.put(`/candidate/notifications/${id}/read`);
            setNotifications(prev =>
                prev.map(n => (n.id === id ? { ...n, read: true } : n))
            );
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error('Failed to mark notification as read:', error);
        }
    };

    const markAllAsRead = async () => {
        try {
            await apiClient.put('/candidate/notifications/mark-all-read');
            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
            setUnreadCount(0);
        } catch (error) {
            console.error('Failed to mark all as read:', error);
        }
    };

    const deleteNotification = async (id: string) => {
        try {
            await apiClient.delete(`/candidate/notifications/${id}`);
            setNotifications(prev => prev.filter(n => n.id !== id));
            const notification = notifications.find(n => n.id === id);
            if (notification && !notification.read) {
                setUnreadCount(prev => Math.max(0, prev - 1));
            }
        } catch (error) {
            console.error('Failed to delete notification:', error);
        }
    };

    const handleNotificationClick = (notification: Notification) => {
        if (!notification.read) {
            markAsRead(notification.id);
        }

        // Navigate to job if it's a job alert
        if (notification.type === 'JOB_ALERT' && notification.data?.jobId) {
            navigate(`/candidate/jobs/${notification.data.jobId}`);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    const getNotificationIcon = (type: string) => {
        switch (type) {
            case 'JOB_ALERT':
                return <Bell className="h-5 w-5 text-blue-500" />;
            default:
                return <Bell className="h-5 w-5" />;
        }
    };

    return (
        <CandidatePageLayout>
            <div className="p-6 space-y-6">
                <AtsPageHeader
                    title="Notifications"
                    subtitle="Stay updated with job alerts and important updates"
                >
                    {unreadCount > 0 && (
                        <Button onClick={markAllAsRead} variant="outline" size="sm">
                            <Check className="h-4 w-4 mr-2" />
                            Mark all as read
                        </Button>
                    )}
                </AtsPageHeader>

                {loading ? (
                <Card>
                    <CardContent className="flex items-center justify-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </CardContent>
                </Card>
            ) : notifications.length === 0 ? (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <Bell className="h-16 w-16 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No notifications yet</h3>
                        <p className="text-sm text-muted-foreground text-center max-w-sm">
                            When you receive job alerts or updates, they'll appear here
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-4">
                    {notifications.map((notification) => (
                        <Card
                            key={notification.id}
                            className={`cursor-pointer ${!notification.read ? 'bg-accent/30' : ''
                                }`}
                            onClick={() => handleNotificationClick(notification)}
                        >
                            <CardHeader className="pb-3">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start gap-3 flex-1">
                                        <div className="mt-1">{getNotificationIcon(notification.type)}</div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <CardTitle className="text-base font-semibold">{notification.title}</CardTitle>
                                                {!notification.read && (
                                                    <Badge variant="outline" className="h-6 px-2 text-xs rounded-full bg-primary/10 text-primary border-primary/20">
                                                        New
                                                    </Badge>
                                                )}
                                            </div>
                                            <CardDescription className="text-sm">
                                                {notification.message}
                                            </CardDescription>
                                        </div>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            deleteNotification(notification.id);
                                        }}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </CardHeader>
                            {notification.data?.jobTitle && (
                                <>
                                    <Separator />
                                    <CardContent className="pt-3 pb-3">
                                        <div className="flex flex-col gap-1 text-sm">
                                            <div className="font-medium">{notification.data.jobTitle}</div>
                                            <div className="text-muted-foreground flex flex-wrap gap-2">
                                                {notification.data.company && <span>{notification.data.company}</span>}
                                                {notification.data.location && (
                                                    <>
                                                        <span>•</span>
                                                        <span>{notification.data.location}</span>
                                                    </>
                                                )}
                                                {notification.data.workArrangement && (
                                                    <>
                                                        <span>•</span>
                                                        <Badge variant="outline" className="h-6 px-2 text-xs rounded-full">
                                                            {notification.data.workArrangement}
                                                        </Badge>
                                                    </>
                                                )}
                                                {notification.data.employmentType && (
                                                    <Badge variant="outline" className="h-6 px-2 text-xs rounded-full">
                                                        {notification.data.employmentType}
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>
                                    </CardContent>
                                </>
                            )}
                            <Separator />
                            <CardContent className="pt-2 pb-2">
                                <p className="text-xs text-muted-foreground">
                                    {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
            </div>
        </CandidatePageLayout>
    );
}
