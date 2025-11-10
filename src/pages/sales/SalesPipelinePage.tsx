import { useState } from "react";
import { DashboardPageLayout } from "@/components/layouts/DashboardPageLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { getAllOpportunities } from "@/lib/salesOpportunityStorage";
import type { SalesOpportunity, OpportunityStage } from "@/types/salesOpportunity";

export default function SalesPipelinePage() {
  const [opportunities] = useState<SalesOpportunity[]>(getAllOpportunities());

  const stages: OpportunityStage[] = ['prospecting', 'qualification', 'proposal', 'negotiation', 'closed-won', 'closed-lost'];

  const opportunitiesByStage = stages.reduce((acc, stage) => {
    acc[stage] = opportunities.filter(opp => opp.stage === stage);
    return acc;
  }, {} as Record<OpportunityStage, SalesOpportunity[]>);

  const stageColors: Record<OpportunityStage, string> = {
    prospecting: 'border-blue-300',
    qualification: 'border-purple-300',
    proposal: 'border-yellow-300',
    negotiation: 'border-orange-300',
    'closed-won': 'border-green-300',
    'closed-lost': 'border-red-300',
  };

  return (
    <DashboardPageLayout
      title="Sales Pipeline"
      subtitle="Visualize and manage your sales opportunities"
      fullWidth={true}
      actions={
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Opportunity
        </Button>
      }
    >
      <div className="flex gap-4 overflow-x-auto pb-4">
        {stages.map(stage => {
          const stageOpps = opportunitiesByStage[stage];
          const stageValue = stageOpps.reduce((sum, opp) => sum + opp.estimatedValue, 0);
          
          return (
            <div key={stage} className="flex-shrink-0 w-80">
              <Card className={`border-t-4 ${stageColors[stage]}`}>
                <div className="p-4 border-b">
                  <h3 className="font-semibold capitalize">
                    {stage.replace('-', ' ')}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {stageOpps.length} opportunities • ${(stageValue / 1000).toFixed(0)}K
                  </p>
                </div>
                <div className="p-2 space-y-2 max-h-[600px] overflow-y-auto">
                  {stageOpps.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-8">
                      No opportunities
                    </p>
                  ) : (
                    stageOpps.map(opp => (
                      <Card key={opp.id} className="p-3 cursor-pointer hover:shadow-md transition-shadow">
                        <h4 className="font-medium text-sm">{opp.name}</h4>
                        <p className="text-xs text-muted-foreground mt-1">{opp.employerName}</p>
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-sm font-semibold">${(opp.estimatedValue / 1000).toFixed(0)}K</span>
                          <span className="text-xs text-muted-foreground">{opp.probability}%</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{opp.salesAgentName}</p>
                      </Card>
                    ))
                  )}
                </div>
              </Card>
            </div>
          );
        })}
      </div>
    </DashboardPageLayout>
  );
}
