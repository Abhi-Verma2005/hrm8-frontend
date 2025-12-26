import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RoundEmailConfiguration } from './RoundEmailConfiguration';
import { jobRoundService, JobRound } from '@/lib/api/jobRoundService';
import { toast } from 'sonner';
import { Loader2, Mail } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ScrollArea } from '@/components/ui/scroll-area';

interface JobRoundAutomationTabProps {
  jobId: string;
}

export function JobRoundAutomationTab({ jobId }: JobRoundAutomationTabProps) {
  const [rounds, setRounds] = useState<JobRound[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadRounds();
  }, [jobId]);

  const loadRounds = async () => {
    setIsLoading(true);
    try {
      const response = await jobRoundService.getJobRounds(jobId);
      if (response.success && response.data?.rounds) {
        setRounds(response.data.rounds);
      }
    } catch (error: any) {
      toast.error('Failed to load job rounds');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Card className="flex-1">
        <CardContent className="py-12 text-center">
          <Loader2 className="h-8 w-8 mx-auto animate-spin text-muted-foreground" />
          <p className="text-muted-foreground mt-4">Loading rounds...</p>
        </CardContent>
      </Card>
    );
  }

  if (rounds.length === 0) {
    return (
      <Card className="flex-1">
        <CardContent className="py-12 text-center">
          <Mail className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No rounds found for this job</p>
          <p className="text-sm text-muted-foreground mt-2">
            Create rounds in the job configuration to set up email automation
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-h-0 space-y-4">
      <div>
        <h3 className="text-lg font-semibold">Round Email Automation</h3>
        <p className="text-sm text-muted-foreground">
          Configure automated emails for each round in this job
        </p>
      </div>

      <ScrollArea className="flex-1">
        <Accordion type="multiple" className="space-y-4">
          {rounds.map((round) => (
            <AccordionItem key={round.id} value={round.id} className="border rounded-lg">
              <AccordionTrigger className="px-4 py-3 hover:no-underline">
                <div className="flex items-center justify-between w-full pr-4">
                  <div className="flex items-center gap-3">
                    <span className="font-medium">{round.name}</span>
                    <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                      {round.type}
                    </span>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                <RoundEmailConfiguration
                  roundId={round.id}
                  roundName={round.name}
                />
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </ScrollArea>
    </div>
  );
}

