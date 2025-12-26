import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, FileSpreadsheet, FileText } from 'lucide-react';
import { getATSSubscriptionTiers, getAddonServices, getRecruitmentServices } from '@/lib/pricingStorage';
import { useToast } from '@/hooks/use-toast';

export function PricingExportTools() {
  const { toast } = useToast();

  const exportToCSV = () => {
    const tiers = getATSSubscriptionTiers();
    const addons = getAddonServices();
    const services = getRecruitmentServices();

    // ATS Tiers CSV
    const tiersCSV = [
      ['Type', 'Name', 'Description', 'Monthly Price', 'Annual Price', 'Max Jobs', 'Max Users', 'Status'],
      ...tiers.map((tier) => [
        'ATS Tier',
        tier.name,
        tier.description,
        tier.monthlyPrice,
        tier.annualPrice,
        tier.maxJobs,
        tier.maxUsers,
        tier.status,
      ]),
      [],
      ['Type', 'Name', 'Description', 'Pricing Model', 'Base Price', 'Price Per Unit', 'Status'],
      ...addons.map((addon) => [
        'Add-on',
        addon.name,
        addon.description,
        addon.pricingModel,
        addon.basePrice,
        addon.pricePerUnit || '',
        addon.status,
      ]),
      [],
      ['Type', 'Name', 'Service Type', 'Pricing Model', 'Base Fee', 'Percentage Fee', 'Status'],
      ...services.map((service) => [
        'Recruitment',
        service.name,
        service.serviceType,
        service.pricingModel,
        service.baseFee,
        service.percentageFee || '',
        service.status,
      ]),
    ]
      .map((row) => row.join(','))
      .join('\n');

    const blob = new Blob([tiersCSV], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pricing-export-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: 'Export successful',
      description: 'Pricing data has been exported to CSV.',
    });
  };

  const exportToJSON = () => {
    const data = {
      atsTiers: getATSSubscriptionTiers(),
      addons: getAddonServices(),
      recruitmentServices: getRecruitmentServices(),
      exportedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pricing-export-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: 'Export successful',
      description: 'Pricing data has been exported to JSON.',
    });
  };

  const generatePricingReport = () => {
    const tiers = getATSSubscriptionTiers();
    const addons = getAddonServices();
    const services = getRecruitmentServices();

    let report = `PRICING REPORT\nGenerated: ${new Date().toLocaleString()}\n\n`;
    
    report += `=== ATS SUBSCRIPTION TIERS ===\n`;
    report += `Total: ${tiers.length} (${tiers.filter(t => t.status === 'active').length} active)\n\n`;
    tiers.forEach((tier) => {
      report += `${tier.name}\n`;
      report += `  Monthly: £${tier.monthlyPrice} | Annual: £${tier.annualPrice}\n`;
      report += `  Limits: ${tier.maxJobs} jobs, ${tier.maxUsers} users\n`;
      report += `  Status: ${tier.status}\n\n`;
    });

    report += `\n=== ADD-ON SERVICES ===\n`;
    report += `Total: ${addons.length} (${addons.filter(a => a.status === 'active').length} active)\n\n`;
    addons.forEach((addon) => {
      report += `${addon.name}\n`;
      report += `  Model: ${addon.pricingModel}\n`;
      report += `  Base Price: £${addon.basePrice}\n`;
      if (addon.pricePerUnit) {
        report += `  Per Unit: £${addon.pricePerUnit} ${addon.unitLabel}\n`;
      }
      report += `  Status: ${addon.status}\n\n`;
    });

    report += `\n=== RECRUITMENT SERVICES ===\n`;
    report += `Total: ${services.length} (${services.filter(s => s.status === 'active').length} active)\n\n`;
    services.forEach((service) => {
      report += `${service.name}\n`;
      report += `  Type: ${service.serviceType}\n`;
      report += `  Base Fee: £${service.baseFee}\n`;
      if (service.percentageFee) {
        report += `  Percentage: ${service.percentageFee}%\n`;
      }
      report += `  Status: ${service.status}\n\n`;
    });

    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pricing-report-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: 'Report generated',
      description: 'Pricing report has been downloaded.',
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Export & Reporting Tools</CardTitle>
        <CardDescription>Generate reports and export pricing data for sales teams</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-3">
          <Button onClick={exportToCSV} variant="outline" className="h-auto flex-col items-start p-4">
            <FileSpreadsheet className="h-8 w-8 mb-2 text-green-600" />
            <div className="text-left">
              <p className="font-semibold">Export to CSV</p>
              <p className="text-sm text-muted-foreground">
                Spreadsheet format for Excel or Google Sheets
              </p>
            </div>
          </Button>

          <Button onClick={exportToJSON} variant="outline" className="h-auto flex-col items-start p-4">
            <FileText className="h-8 w-8 mb-2 text-blue-600" />
            <div className="text-left">
              <p className="font-semibold">Export to JSON</p>
              <p className="text-sm text-muted-foreground">
                Structured data format for developers
              </p>
            </div>
          </Button>

          <Button onClick={generatePricingReport} variant="outline" className="h-auto flex-col items-start p-4">
            <Download className="h-8 w-8 mb-2 text-purple-600" />
            <div className="text-left">
              <p className="font-semibold">Generate Report</p>
              <p className="text-sm text-muted-foreground">
                Text summary of all pricing configurations
              </p>
            </div>
          </Button>
        </div>

        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <h4 className="font-medium mb-2">Export Contents</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• All ATS subscription tiers with pricing and features</li>
            <li>• Add-on services with pricing models</li>
            <li>• Recruitment services with fee structures</li>
            <li>• Status and configuration details</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
