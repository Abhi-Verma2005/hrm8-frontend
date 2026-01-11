/**
 * Duplicate Company Warning Component
 * Shows potential duplicate companies when creating a new company
 */

import { useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle, ExternalLink, Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DuplicateMatch {
  companyId: string;
  companyName: string;
  domain?: string | null;
  matchScore: number;
  matchReasons: string[];
  createdAt: Date | string;
}

interface DuplicateWarningProps {
  duplicates: DuplicateMatch[];
  onDismiss: () => void;
  onSelectExisting: (companyId: string) => void;
  onProceedAnyway: () => void;
  className?: string;
}

export function DuplicateWarning({
  duplicates,
  onDismiss,
  onSelectExisting,
  onProceedAnyway,
  className,
}: DuplicateWarningProps) {
  const [expanded, setExpanded] = useState(true);

  if (duplicates.length === 0) return null;

  const highConfidenceMatches = duplicates.filter((d) => d.matchScore >= 90);
  const mediumConfidenceMatches = duplicates.filter((d) => d.matchScore >= 70 && d.matchScore < 90);

  return (
    <Alert variant="destructive" className={cn('border-amber-500 bg-amber-50', className)}>
      <AlertTriangle className="h-5 w-5 text-amber-600" />
      <AlertTitle className="text-amber-800">Potential Duplicate Detected</AlertTitle>
      <AlertDescription className="text-amber-700">
        <p className="mb-3">
          We found {duplicates.length} company/companies that might be duplicates. Please review before proceeding.
        </p>

        {expanded && (
          <div className="space-y-2 mb-4">
            {duplicates.map((match) => (
              <Card key={match.companyId} className="border-amber-200 bg-white">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900">{match.companyName}</span>
                        <Badge
                          variant={match.matchScore >= 90 ? 'destructive' : 'secondary'}
                          className={cn(
                            'text-xs',
                            match.matchScore >= 90 && 'bg-red-100 text-red-700',
                            match.matchScore >= 70 && match.matchScore < 90 && 'bg-amber-100 text-amber-700'
                          )}
                        >
                          {match.matchScore}% match
                        </Badge>
                      </div>
                      {match.domain && (
                        <p className="text-xs text-gray-500">{match.domain}</p>
                      )}
                      <p className="text-xs text-gray-500 mt-1">
                        {match.matchReasons.join(' • ')}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onSelectExisting(match.companyId)}
                      className="ml-2"
                    >
                      <ExternalLink className="h-3 w-3 mr-1" />
                      Use This
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="flex gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setExpanded(!expanded)}
            className="text-amber-700 border-amber-300"
          >
            {expanded ? 'Hide Details' : 'Show Details'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onProceedAnyway}
            className="text-amber-700 border-amber-300"
          >
            <Check className="h-3 w-3 mr-1" />
            Not a Duplicate - Proceed
          </Button>
          <Button variant="ghost" size="sm" onClick={onDismiss} className="text-gray-500">
            <X className="h-3 w-3 mr-1" />
            Cancel
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
}

/**
 * Hook to check for duplicates
 */
export function useDuplicateCheck() {
  const [checking, setChecking] = useState(false);
  const [duplicates, setDuplicates] = useState<DuplicateMatch[]>([]);
  const [hasChecked, setHasChecked] = useState(false);

  const checkDuplicates = async (data: {
    name: string;
    domain?: string;
    email?: string;
  }) => {
    if (!data.name || data.name.length < 3) {
      setDuplicates([]);
      return;
    }

    setChecking(true);
    try {
      const response = await fetch('/api/companies/check-duplicates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const result = await response.json();
        setDuplicates(result.data?.duplicates || []);
      } else {
        setDuplicates([]);
      }
    } catch (error) {
      console.error('Duplicate check failed:', error);
      setDuplicates([]);
    } finally {
      setChecking(false);
      setHasChecked(true);
    }
  };

  const clearDuplicates = () => {
    setDuplicates([]);
    setHasChecked(false);
  };

  return {
    checking,
    duplicates,
    hasChecked,
    hasDuplicates: duplicates.length > 0,
    checkDuplicates,
    clearDuplicates,
  };
}
