import { DashboardPageLayout } from "@/components/layouts/DashboardPageLayout";
import { Settings as SettingsIcon, DollarSign, Bell, Globe, Eye, Shield } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useCurrencyFormat } from "@/contexts/CurrencyFormatContext";
import { toast } from "sonner";

export default function Settings() {
  const { currencyFormat, setCurrencyFormat, formatCurrency } = useCurrencyFormat();

  const handleCurrencyFormatChange = (checked: boolean) => {
    const newFormat = checked ? 'decimal' : 'whole';
    setCurrencyFormat(newFormat);
    toast.success(
      `Currency format updated to ${newFormat === 'whole' ? 'whole numbers' : 'decimals'}`,
      {
        description: `Example: ${formatCurrency(1234567.89)}`,
      }
    );
  };

  return (
    <DashboardPageLayout>
      <div className="p-6">
        <div className="space-y-6 max-w-4xl">
          <div>
            <h1 className="text-3xl font-bold">Settings</h1>
            <p className="text-muted-foreground mt-2">
              Manage your application preferences and configurations
            </p>
          </div>

          {/* Display & Formatting */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Display & Formatting
              </CardTitle>
              <CardDescription>
                Customize how information is displayed throughout the application
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="currency-format" className="text-base">
                    Currency Format
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Display currency values with or without decimal places
                  </p>
                  <div className="flex gap-4 mt-2">
                    <div className="text-sm">
                      <span className="text-muted-foreground">Whole: </span>
                      <span className="font-medium">{formatCurrency(1234567.89, 'USD').replace(/\.\d+$/, '')}</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-muted-foreground">Decimal: </span>
                      <span className="font-medium">$1,234,567.89</span>
                    </div>
                  </div>
                </div>
                <Switch
                  id="currency-format"
                  checked={currencyFormat === 'decimal'}
                  onCheckedChange={handleCurrencyFormatChange}
                />
              </div>
            </CardContent>
          </Card>

          {/* Regional Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Regional Settings
              </CardTitle>
              <CardDescription>
                Configure language, timezone, and regional preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Regional settings coming soon...</p>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notifications
              </CardTitle>
              <CardDescription>
                Manage how you receive notifications and alerts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Notification preferences coming soon...</p>
            </CardContent>
          </Card>

          {/* Privacy & Security */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Privacy & Security
              </CardTitle>
              <CardDescription>
                Control your privacy and security settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Privacy and security settings coming soon...</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardPageLayout>
  );
}
