import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plug, Mail, Calendar, Users, DollarSign, Shield, Database, BarChart3, Check, Settings as SettingsIcon, Plus, Trash2, ExternalLink } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Integration {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: any;
  status: 'connected' | 'available' | 'pending';
  lastSync?: string;
}

interface Webhook {
  id: string;
  name: string;
  url: string;
  events: string[];
  createdAt: string;
  isActive: boolean;
}

const mockIntegrations: Integration[] = [
  {
    id: '1',
    name: 'Gmail',
    description: 'Send and receive emails through Gmail',
    category: 'Email & Communication',
    icon: Mail,
    status: 'connected',
    lastSync: '2 hours ago',
  },
  {
    id: '2',
    name: 'Outlook',
    description: 'Microsoft Outlook email integration',
    category: 'Email & Communication',
    icon: Mail,
    status: 'available',
  },
  {
    id: '3',
    name: 'Google Calendar',
    description: 'Sync interviews and events',
    category: 'Calendar',
    icon: Calendar,
    status: 'connected',
    lastSync: '1 hour ago',
  },
  {
    id: '4',
    name: 'LinkedIn',
    description: 'Source candidates from LinkedIn',
    category: 'Recruitment',
    icon: Users,
    status: 'available',
  },
  {
    id: '5',
    name: 'Indeed',
    description: 'Post jobs and find candidates',
    category: 'Recruitment',
    icon: Users,
    status: 'available',
  },
  {
    id: '6',
    name: 'Stripe',
    description: 'Payment processing and invoicing',
    category: 'Payroll',
    icon: DollarSign,
    status: 'connected',
    lastSync: '30 minutes ago',
  },
  {
    id: '7',
    name: 'QuickBooks',
    description: 'Accounting and financial management',
    category: 'Payroll',
    icon: DollarSign,
    status: 'available',
  },
  {
    id: '8',
    name: 'Checkr',
    description: 'Background check integration',
    category: 'Background Checks',
    icon: Shield,
    status: 'available',
  },
  {
    id: '9',
    name: 'Google Drive',
    description: 'Cloud file storage and sharing',
    category: 'Storage',
    icon: Database,
    status: 'connected',
    lastSync: '5 minutes ago',
  },
  {
    id: '10',
    name: 'Google Analytics',
    description: 'Track website and application usage',
    category: 'Analytics',
    icon: BarChart3,
    status: 'available',
  },
];

export function IntegrationsTab() {
  const [integrations, setIntegrations] = useState<Integration[]>(mockIntegrations);
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [webhooks, setWebhooks] = useState<Webhook[]>([
    {
      id: '1',
      name: 'Candidate Created',
      url: 'https://api.example.com/webhooks/candidates',
      events: ['candidate.created', 'candidate.updated'],
      createdAt: '2024-01-15',
      isActive: true,
    },
  ]);
  const [isAddWebhookOpen, setIsAddWebhookOpen] = useState(false);

  const categories = ['all', 'Email & Communication', 'Calendar', 'Recruitment', 'Payroll', 'Background Checks', 'Storage', 'Analytics'];

  const filteredIntegrations = integrations.filter(integration => {
    const matchesSearch = integration.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         integration.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || integration.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleConnect = (integration: Integration) => {
    setIntegrations(integrations.map(i =>
      i.id === integration.id ? { ...i, status: 'connected', lastSync: 'Just now' } : i
    ));
    setSelectedIntegration(null);
    toast({
      title: "Integration connected",
      description: `${integration.name} has been successfully connected.`,
    });
  };

  const handleDisconnect = (integration: Integration) => {
    setIntegrations(integrations.map(i =>
      i.id === integration.id ? { ...i, status: 'available', lastSync: undefined } : i
    ));
    setSelectedIntegration(null);
    toast({
      title: "Integration disconnected",
      description: `${integration.name} has been disconnected.`,
      variant: "destructive",
    });
  };

  const handleSync = (integration: Integration) => {
    setIntegrations(integrations.map(i =>
      i.id === integration.id ? { ...i, lastSync: 'Just now' } : i
    ));
    toast({
      title: "Sync initiated",
      description: `${integration.name} is syncing data...`,
    });
  };

  const handleAddWebhook = () => {
    const newWebhook: Webhook = {
      id: Date.now().toString(),
      name: 'New Webhook',
      url: 'https://api.example.com/webhook',
      events: ['all.events'],
      createdAt: new Date().toISOString().split('T')[0],
      isActive: true,
    };
    setWebhooks([...webhooks, newWebhook]);
    setIsAddWebhookOpen(false);
    toast({
      title: "Webhook added",
      description: "New webhook has been created successfully.",
    });
  };

  const handleDeleteWebhook = (id: string) => {
    setWebhooks(webhooks.filter(w => w.id !== id));
    toast({
      title: "Webhook deleted",
      description: "Webhook has been removed.",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'connected':
        return <Badge className="bg-green-500"><Check className="h-3 w-3 mr-1" />Connected</Badge>;
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>;
      default:
        return <Badge variant="outline">Available</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="integrations" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
        </TabsList>

        <TabsContent value="integrations" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Plug className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle>Integrations</CardTitle>
                  <CardDescription>
                    Connect and configure third-party services
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Search and Filter */}
              <div className="flex gap-4">
                <Input
                  placeholder="Search integrations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1"
                />
                <select
                  className="px-3 py-2 border rounded-md bg-background"
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>
                      {cat === 'all' ? 'All Categories' : cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Integrations Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredIntegrations.map((integration) => (
                  <Card
                    key={integration.id}
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => setSelectedIntegration(integration)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <integration.icon className="h-5 w-5 text-primary" />
                        </div>
                        {getStatusBadge(integration.status)}
                      </div>
                      <h3 className="font-semibold mb-1">{integration.name}</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        {integration.description}
                      </p>
                      <div className="text-xs text-muted-foreground">
                        {integration.lastSync && `Last sync: ${integration.lastSync}`}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredIntegrations.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No integrations found matching your criteria.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="webhooks" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Plug className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle>Webhooks</CardTitle>
                    <CardDescription>
                      Manage custom webhook endpoints
                    </CardDescription>
                  </div>
                </div>
                <Button onClick={() => setIsAddWebhookOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Webhook
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr className="border-b">
                      <th className="p-3 text-left text-sm font-medium">Name</th>
                      <th className="p-3 text-left text-sm font-medium">URL</th>
                      <th className="p-3 text-left text-sm font-medium">Events</th>
                      <th className="p-3 text-left text-sm font-medium">Status</th>
                      <th className="p-3 text-right text-sm font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {webhooks.map((webhook) => (
                      <tr key={webhook.id} className="border-b">
                        <td className="p-3 font-medium">{webhook.name}</td>
                        <td className="p-3">
                          <code className="text-sm">{webhook.url}</code>
                        </td>
                        <td className="p-3 text-sm text-muted-foreground">
                          {webhook.events.join(', ')}
                        </td>
                        <td className="p-3">
                          <Badge variant={webhook.isActive ? 'default' : 'secondary'}>
                            {webhook.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center justify-end gap-2">
                            <Button variant="ghost" size="sm">
                              <SettingsIcon className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteWebhook(webhook.id)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Integration Details Dialog */}
      <Dialog open={!!selectedIntegration} onOpenChange={(open) => !open && setSelectedIntegration(null)}>
        <DialogContent className="max-w-2xl">
          {selectedIntegration && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <selectedIntegration.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <DialogTitle>{selectedIntegration.name}</DialogTitle>
                    <DialogDescription>{selectedIntegration.description}</DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              <div className="space-y-4">
                <div>
                  <Label>Status</Label>
                  <div className="mt-2">
                    {getStatusBadge(selectedIntegration.status)}
                  </div>
                </div>

                {selectedIntegration.status === 'connected' && (
                  <>
                    <div>
                      <Label>Last Sync</Label>
                      <p className="text-sm text-muted-foreground mt-1">
                        {selectedIntegration.lastSync}
                      </p>
                    </div>

                    <div>
                      <Label>Configuration</Label>
                      <div className="mt-2 space-y-2">
                        <Input placeholder="API Key" type="password" value="••••••••••••" readOnly />
                        <Input placeholder="Endpoint URL" value="https://api.example.com" readOnly />
                      </div>
                    </div>
                  </>
                )}

                {selectedIntegration.status === 'available' && (
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Setup Instructions</h4>
                    <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                      <li>Create an account on {selectedIntegration.name}</li>
                      <li>Generate an API key in your account settings</li>
                      <li>Enter the API key below and click Connect</li>
                    </ol>
                  </div>
                )}
              </div>

              <DialogFooter>
                {selectedIntegration.status === 'connected' ? (
                  <>
                    <Button variant="outline" onClick={() => handleSync(selectedIntegration)}>
                      Sync Now
                    </Button>
                    <Button variant="destructive" onClick={() => handleDisconnect(selectedIntegration)}>
                      Disconnect
                    </Button>
                  </>
                ) : (
                  <Button onClick={() => handleConnect(selectedIntegration)}>
                    Connect
                  </Button>
                )}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Add Webhook Dialog */}
      <Dialog open={isAddWebhookOpen} onOpenChange={setIsAddWebhookOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Webhook</DialogTitle>
            <DialogDescription>
              Create a new webhook endpoint to receive events
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="webhookName">Name</Label>
              <Input id="webhookName" placeholder="My Webhook" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="webhookUrl">Endpoint URL</Label>
              <Input id="webhookUrl" placeholder="https://api.example.com/webhook" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="webhookEvents">Events (comma-separated)</Label>
              <Input id="webhookEvents" placeholder="candidate.created, application.submitted" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddWebhookOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddWebhook}>Add Webhook</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
