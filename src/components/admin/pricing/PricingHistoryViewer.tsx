import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getPricingHistory } from '@/lib/pricingStorage';
import { PricingHistory } from '@/types/pricing';
import { Download, Search, Clock } from 'lucide-react';
import { format } from 'date-fns';

export function PricingHistoryViewer() {
  const [history, setHistory] = useState<PricingHistory[]>(getPricingHistory());
  const [entityTypeFilter, setEntityTypeFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredHistory = history.filter((item) => {
    const matchesType = entityTypeFilter === 'all' || item.entityType === entityTypeFilter;
    const matchesSearch = 
      searchQuery === '' ||
      item.entityId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.changedBy.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const exportHistory = () => {
    const csv = [
      ['Date', 'Entity Type', 'Entity ID', 'Changed By', 'Reason', 'Changes'],
      ...filteredHistory.map((item) => [
        format(new Date(item.changedAt), 'yyyy-MM-dd HH:mm:ss'),
        item.entityType,
        item.entityId,
        item.changedBy,
        item.reason || '',
        JSON.stringify(item.changes),
      ]),
    ]
      .map((row) => row.join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pricing-history-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getEntityTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      tier: 'ATS Tier',
      addon: 'Add-on Service',
      recruitment: 'Recruitment Service',
      custom: 'Custom Pricing',
    };
    return labels[type] || type;
  };

  const getEntityTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      tier: 'bg-blue-500/10 text-blue-500',
      addon: 'bg-green-500/10 text-green-500',
      recruitment: 'bg-purple-500/10 text-purple-500',
      custom: 'bg-orange-500/10 text-orange-500',
    };
    return colors[type] || 'bg-gray-500/10 text-gray-500';
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Pricing Change History</CardTitle>
            <CardDescription>Track all changes made to pricing configurations</CardDescription>
          </div>
          <Button onClick={exportHistory} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="flex gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by entity ID or user..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Select value={entityTypeFilter} onValueChange={setEntityTypeFilter}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="tier">ATS Tiers</SelectItem>
              <SelectItem value="addon">Add-on Services</SelectItem>
              <SelectItem value="recruitment">Recruitment Services</SelectItem>
              <SelectItem value="custom">Custom Pricing</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* History List */}
        <div className="space-y-4">
          {filteredHistory.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No pricing changes found</p>
            </div>
          ) : (
            filteredHistory.map((item) => (
              <div key={item.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Badge className={getEntityTypeColor(item.entityType)} variant="secondary">
                      {getEntityTypeLabel(item.entityType)}
                    </Badge>
                    <div>
                      <p className="font-medium">{item.entityId}</p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(item.changedAt), 'PPpp')}
                      </p>
                    </div>
                  </div>
                  <div className="text-right text-sm">
                    <p className="font-medium">{item.changedBy}</p>
                    {item.reason && <p className="text-muted-foreground">{item.reason}</p>}
                  </div>
                </div>

                {/* Changes */}
                <div className="bg-muted/50 rounded p-3 space-y-2">
                  <p className="text-sm font-medium">Changes:</p>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {Object.entries(item.changes).map(([key, value]) => (
                      <div key={key}>
                        <span className="text-muted-foreground">{key}:</span>{' '}
                        <span className="font-medium">
                          {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Previous Values */}
                {Object.keys(item.previousValues).length > 0 && (
                  <details className="text-sm">
                    <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
                      View previous values
                    </summary>
                    <div className="mt-2 bg-muted/30 rounded p-3 space-y-1">
                      {Object.entries(item.previousValues).map(([key, value]) => (
                        <div key={key}>
                          <span className="text-muted-foreground">{key}:</span>{' '}
                          <span>{typeof value === 'object' ? JSON.stringify(value) : String(value)}</span>
                        </div>
                      ))}
                    </div>
                  </details>
                )}
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
