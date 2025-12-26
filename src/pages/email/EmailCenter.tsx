import { useState, useEffect } from 'react';
import { DashboardPageLayout } from '@/components/layouts/DashboardPageLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { EmailInbox } from '@/components/email/EmailInbox';
import { EmailDetail } from '@/components/email/EmailDetail';
import { EmailFilters } from '@/components/email/EmailFilters';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { emailInboxService, EmailMessage, EmailFilters as EmailFiltersType } from '@/lib/api/emailInboxService';
import { toast } from 'sonner';
import { Search, Loader2, Mail } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

export default function EmailCenter() {
  const [emails, setEmails] = useState<EmailMessage[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<EmailMessage | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<EmailFiltersType>({});

  useEffect(() => {
    loadEmails();
  }, [filters]);

  const loadEmails = async () => {
    setIsLoading(true);
    try {
      const data = await emailInboxService.getEmails(filters);
      setEmails(data);
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
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({});
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
    <DashboardPageLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Email Center</h1>
          <p className="text-muted-foreground mt-1">
            View and manage all sent emails
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <EmailFilters
              filters={filters}
              onFiltersChange={handleFiltersChange}
              onClear={handleClearFilters}
            />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Emails</CardTitle>
                  <div className="relative w-64">
                    <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search emails..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="py-12 text-center">
                    <Loader2 className="h-8 w-8 mx-auto animate-spin text-muted-foreground" />
                    <p className="text-muted-foreground mt-4">Loading emails...</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <EmailInbox
                      emails={filteredEmails}
                      onEmailClick={handleEmailClick}
                      className="lg:col-span-1"
                    />
                    {selectedEmail && (
                      <EmailDetail
                        email={selectedEmail}
                        onResend={loadEmails}
                        className="lg:col-span-1"
                      />
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardPageLayout>
  );
}

