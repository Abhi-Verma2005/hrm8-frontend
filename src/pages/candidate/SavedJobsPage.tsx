/**
 * Saved Jobs Page
 * Saved jobs list (structure only)
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bookmark, Briefcase } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function SavedJobsPage() {
  const navigate = useNavigate();

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Saved Jobs</h1>
        <p className="text-muted-foreground">Jobs you've saved for later</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Saved Jobs</CardTitle>
          <CardDescription>Coming soon - Save jobs feature</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">
            <Bookmark className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="mb-2">No saved jobs yet</p>
            <p className="text-sm mb-4">
              The save jobs feature will be available soon. You'll be able to save jobs and come back to them later.
            </p>
            <Button
              variant="outline"
              onClick={() => navigate('/jobs')}
            >
              <Briefcase className="h-4 w-4 mr-2" />
              Browse Jobs
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

