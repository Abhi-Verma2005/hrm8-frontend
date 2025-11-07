import { useState, useEffect } from "react";
import { DashboardPageLayout } from "@/components/layouts/DashboardPageLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Plus, Mail } from "lucide-react";
import { getOffers } from "@/lib/mockOfferStorage";
import { OfferLetter } from "@/types/offer";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";

export default function Offers() {
  const [offers, setOffers] = useState<OfferLetter[]>([]);

  useEffect(() => {
    loadOffers();
  }, []);

  const loadOffers = () => {
    setOffers(getOffers());
  };

  const getStatusBadge = (status: OfferLetter['status']) => {
    const variants: Record<OfferLetter['status'], any> = {
      draft: "outline",
      'pending-approval': "secondary",
      approved: "default",
      sent: "secondary",
      accepted: "default",
      declined: "destructive",
      expired: "outline",
      withdrawn: "destructive",
    };
    return <Badge variant={variants[status]}>{status.replace('-', ' ')}</Badge>;
  };

  return (
    <DashboardPageLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Offer Letters</h1>
            <p className="text-muted-foreground">
              Create and manage employment offers
            </p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Offer
          </Button>
        </div>

        <div className="grid gap-4">
          {offers.map((offer) => (
            <Card key={offer.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>{offer.candidateName}</CardTitle>
                    <p className="text-sm text-muted-foreground">{offer.jobTitle}</p>
                  </div>
                  {getStatusBadge(offer.status)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="text-sm">
                      <span className="font-medium">Salary:</span>{" "}
                      ${offer.salary.toLocaleString()} {offer.salaryCurrency} per {offer.salaryPeriod}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Start Date: {new Date(offer.startDate).toLocaleDateString()}
                    </div>
                    {offer.createdAt && (
                      <div className="text-xs text-muted-foreground">
                        Created {formatDistanceToNow(new Date(offer.createdAt), { addSuffix: true })}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <FileText className="h-4 w-4 mr-2" />
                      View
                    </Button>
                    {offer.status === 'approved' && (
                      <Button size="sm">
                        <Mail className="h-4 w-4 mr-2" />
                        Send
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {offers.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-lg font-medium mb-2">No Offers Yet</p>
                <p className="text-sm text-muted-foreground">
                  Generate offer letters for selected candidates
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </DashboardPageLayout>
  );
}
