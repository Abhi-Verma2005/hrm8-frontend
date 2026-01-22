/**
 * Shared Settings Page
 * Used by both Consultant and Sales Agent portals
 * Configurable via portalType prop
 */

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { StripeConnectCard } from '@/components/shared/wallet';
import { Settings, CreditCard, Bell, User } from 'lucide-react';
import { useWallet } from '@/hooks/useWallet';

interface SettingsPageProps {
    portalType: 'consultant' | 'sales';
    profilePath?: string;
}

export default function SettingsPage({ portalType, profilePath }: SettingsPageProps) {
    const [activeTab, setActiveTab] = useState('payments');
    const { refreshBalance } = useWallet();

    const portalLabel = portalType === 'consultant' ? 'Consultant' : 'Sales Agent';
    const defaultProfilePath = portalType === 'consultant' ? '/consultant/profile' : '/sales-agent/profile';

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Settings className="h-5 w-5 text-primary" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold">Settings</h1>
                    <p className="text-muted-foreground">
                        Manage your {portalLabel.toLowerCase()} account settings
                    </p>
                </div>
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-3 max-w-[500px]">
                    <TabsTrigger value="payments" className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4" />
                        <span className="hidden sm:inline">Payments</span>
                    </TabsTrigger>
                    <TabsTrigger value="notifications" className="flex items-center gap-2">
                        <Bell className="h-4 w-4" />
                        <span className="hidden sm:inline">Notifications</span>
                    </TabsTrigger>
                    <TabsTrigger value="profile" className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <span className="hidden sm:inline">Profile</span>
                    </TabsTrigger>
                </TabsList>

                {/* Payments Tab */}
                <TabsContent value="payments" className="mt-6 space-y-6">
                    <div className="grid gap-6 md:grid-cols-2">
                        {/* Stripe Connect Card */}
                        <StripeConnectCard onStatusChange={refreshBalance} />

                        {/* Payout Info Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Payout Information</CardTitle>
                                <CardDescription>
                                    How commission payouts work
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4 text-sm">
                                <div className="flex items-start gap-3">
                                    <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-600">
                                        1
                                    </div>
                                    <div>
                                        <p className="font-medium">Earn Commissions</p>
                                        <p className="text-muted-foreground">
                                            Commissions are earned when your referred clients complete payments.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-600">
                                        2
                                    </div>
                                    <div>
                                        <p className="font-medium">Request Withdrawal</p>
                                        <p className="text-muted-foreground">
                                            Submit a withdrawal request from your wallet (minimum $50).
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-600">
                                        3
                                    </div>
                                    <div>
                                        <p className="font-medium">Admin Approval</p>
                                        <p className="text-muted-foreground">
                                            Once approved, funds are credited to your wallet.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center text-xs font-bold text-green-600">
                                        4
                                    </div>
                                    <div>
                                        <p className="font-medium">Receive Payout</p>
                                        <p className="text-muted-foreground">
                                            Withdraw to your connected Stripe account instantly.
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* Notifications Tab */}
                <TabsContent value="notifications" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Notification Preferences</CardTitle>
                            <CardDescription>
                                Manage how you receive notifications
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">
                                Notification preferences coming soon.
                            </p>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Profile Tab */}
                <TabsContent value="profile" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Profile Settings</CardTitle>
                            <CardDescription>
                                View and edit your profile information
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <a
                                href={profilePath || defaultProfilePath}
                                className="text-sm text-primary hover:underline"
                            >
                                Go to your full profile →
                            </a>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
