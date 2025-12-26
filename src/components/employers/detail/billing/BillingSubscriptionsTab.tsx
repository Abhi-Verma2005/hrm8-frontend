import { useState } from "react";
import { Employer } from "@/types/entities";
import { Invoice } from "@/types/billing";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SubscriptionManagementCard } from "./SubscriptionManagementCard";
import { AccountBalanceCard } from "./AccountBalanceCard";
import { InvoiceListCard } from "./InvoiceListCard";
import { PaymentHistoryTable } from "./PaymentHistoryTable";
import { TransactionTimeline } from "./TransactionTimeline";
import { ChangePlanDialog } from "./ChangePlanDialog";
import { InvoiceDetailDialog } from "./InvoiceDetailDialog";
import { GenerateInvoiceDialog } from "./GenerateInvoiceDialog";
import { SendInvoiceDialog } from "./SendInvoiceDialog";
import { SubscriptionTier } from "@/lib/subscriptionConfig";
import { toast } from "@/hooks/use-toast";

interface BillingSubscriptionsTabProps {
  employer: Employer;
  onEmployerUpdate?: (updates: Partial<Employer>) => void;
}

export function BillingSubscriptionsTab({ employer, onEmployerUpdate }: BillingSubscriptionsTabProps) {
  const [changePlanOpen, setChangePlanOpen] = useState(false);
  const [generateInvoiceOpen, setGenerateInvoiceOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [invoiceDetailOpen, setInvoiceDetailOpen] = useState(false);
  const [sendInvoiceOpen, setSendInvoiceOpen] = useState(false);

  const handlePlanChanged = (newTier: SubscriptionTier) => {
    if (onEmployerUpdate) {
      onEmployerUpdate({ subscriptionTier: newTier });
    }
  };

  const handleViewInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setInvoiceDetailOpen(true);
  };

  const handleSendInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setSendInvoiceOpen(true);
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="payments">Payment History</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Top Row: Subscription & Balance */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SubscriptionManagementCard
              employer={employer}
              onChangePlan={() => setChangePlanOpen(true)}
            />
            <AccountBalanceCard
              employerId={employer.id}
              onGenerateInvoice={() => setGenerateInvoiceOpen(true)}
            />
          </div>

          {/* Recent Invoices */}
          <InvoiceListCard
            employerId={employer.id}
            onViewInvoice={handleViewInvoice}
            onSendInvoice={handleSendInvoice}
          />
        </TabsContent>

        <TabsContent value="invoices" className="space-y-6">
          <InvoiceListCard
            employerId={employer.id}
            onViewInvoice={handleViewInvoice}
            onSendInvoice={handleSendInvoice}
          />
        </TabsContent>

        <TabsContent value="payments" className="space-y-6">
          <PaymentHistoryTable employerId={employer.id} />
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <TransactionTimeline employerId={employer.id} />
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      <ChangePlanDialog
        open={changePlanOpen}
        onOpenChange={setChangePlanOpen}
        employer={employer}
        onPlanChanged={handlePlanChanged}
      />

      <GenerateInvoiceDialog
        open={generateInvoiceOpen}
        onOpenChange={setGenerateInvoiceOpen}
        employerId={employer.id}
        employerName={employer.name}
      />

      <InvoiceDetailDialog
        open={invoiceDetailOpen}
        onOpenChange={setInvoiceDetailOpen}
        invoice={selectedInvoice}
      />

      <SendInvoiceDialog
        open={sendInvoiceOpen}
        onOpenChange={setSendInvoiceOpen}
        invoice={selectedInvoice}
      />
    </div>
  );
}
