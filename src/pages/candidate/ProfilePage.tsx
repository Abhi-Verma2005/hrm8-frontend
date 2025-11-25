/**
 * Candidate Profile Page
 * Basic profile management (structure only, minimal fields)
 */

import { useState, useEffect } from 'react';
import { useCandidateAuth } from '@/contexts/CandidateAuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { apiClient } from '@/lib/api';
import { Loader2 } from 'lucide-react';

export default function ProfilePage() {
  const { candidate, refreshCandidate } = useCandidateAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: candidate?.firstName || '',
    lastName: candidate?.lastName || '',
    phone: candidate?.phone || '',
    city: candidate?.city || '',
    state: candidate?.state || '',
    country: candidate?.country || 'United States',
    linkedInUrl: candidate?.linkedInUrl || '',
  });

  useEffect(() => {
    if (candidate) {
      setFormData({
        firstName: candidate.firstName || '',
        lastName: candidate.lastName || '',
        phone: candidate.phone || '',
        city: candidate.city || '',
        state: candidate.state || '',
        country: candidate.country || 'United States',
        linkedInUrl: candidate.linkedInUrl || '',
      });
    }
  }, [candidate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await apiClient.put('/api/candidate/profile', formData);
      await refreshCandidate();
      toast({
        title: 'Profile updated',
        description: 'Your profile has been updated successfully.',
      });
    } catch (error: any) {
      toast({
        title: 'Update failed',
        description: error.response?.data?.error || 'Failed to update profile',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Profile</h1>
        <p className="text-muted-foreground">Manage your candidate profile</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Update your personal details</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="linkedInUrl">LinkedIn Profile URL</Label>
              <Input
                id="linkedInUrl"
                type="url"
                value={formData.linkedInUrl}
                onChange={(e) => setFormData({ ...formData, linkedInUrl: e.target.value })}
                placeholder="https://linkedin.com/in/yourprofile"
              />
            </div>

            <div className="pt-4">
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Work History</CardTitle>
          <CardDescription>Coming soon - Upload resume to auto-fill</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Work history management will be available soon. For now, you can upload your resume in the application form.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Qualifications</CardTitle>
          <CardDescription>Coming soon</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Qualifications management will be available soon.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

