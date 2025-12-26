import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { EmailInbox } from './EmailInbox';
import { EmailDetail } from './EmailDetail';
import { EmailFilters } from './EmailFilters';
import { emailInboxService, EmailMessage, EmailFilters as EmailFiltersType } from '@/lib/api/emailInboxService';
import { toast } from 'sonner';
import { Search, Loader2 } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';

interface JobEmailInboxTabProps {
  jobId: string;
}

export function JobEmailInboxTab({ jobId }: JobEmailInboxTabProps) {
  const [emails, setEmails] = useState<EmailMessage[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<EmailMessage | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<EmailFiltersType>({
    jobId, // Pre-filter by job
  });

  useEffect(() => {
    loadEmails();
  }, [filters]);

  const loadEmails = async () => {
    setIsLoading(true);
    try {
      // Always include jobId in filters
      const data = await emailInboxService.getEmails({ ...filters, jobId });
      setEmails(data.sort((a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime()));
    } catch (error: any) {
      toast.error('Failed to load emails');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailClick = (email: EmailMessage) => {
    setSelectedEmail(email);
  };

  const handleFiltersChange = (newFilters: EmailFiltersType) => {
    // Ensure jobId is always included
    setFilters({ ...newFilters, jobId });
  };

  const handleClearFilters = () => {
    setFilters({ jobId }); // Keep jobId even when clearing
  };

  const filteredEmails = emails.filter((email) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      email.subject.toLowerCase().includes(query) ||
      email.to.toLowerCase().includes(query) ||
      email.body.toLowerCase().includes(query)
    );
  });

  return (
    <div className="flex-1 flex flex-col min-h-0 space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search emails..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      <div className="flex-1 flex gap-4 min-h-0">
        {/* Filters Sidebar */}
        <div className="w-64 flex-shrink-0">
          <EmailFilters
            filters={filters}
            onFiltersChange={handleFiltersChange}
            onClear={handleClearFilters}
          />
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-h-0">
          {isLoading ? (
            <Card className="flex-1">
              <CardContent className="py-12 text-center">
                <Loader2 className="h-8 w-8 mx-auto animate-spin text-muted-foreground" />
                <p className="text-muted-foreground mt-4">Loading emails...</p>
              </CardContent>
            </Card>
          ) : (
            <div className="flex-1 grid grid-cols-2 gap-4 min-h-0">
              <EmailInbox
                emails={filteredEmails}
                onEmailClick={handleEmailClick}
                className="overflow-hidden"
              />
              {selectedEmail && (
                <EmailDetail
                  email={selectedEmail}
                  onResend={loadEmails}
                  className="overflow-auto"
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

