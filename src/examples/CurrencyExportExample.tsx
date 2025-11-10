/**
 * Example Component: Currency Export with User Preference
 * 
 * This example demonstrates how to export data with currency fields
 * that respect the user's currency format preference (whole/decimal).
 * 
 * The exported data will automatically format currency values based on
 * what the user has selected in Settings > Display & Formatting.
 */

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, DollarSign } from 'lucide-react';
import { exportToCSV } from '@/utils/exportHelpers';
import { ExportButton } from '@/components/common/ExportButton';
import { useCurrencyFormat } from '@/contexts/CurrencyFormatContext';
import { useToast } from '@/hooks/use-toast';

// Sample data with currency values
const sampleSalesData = [
  {
    id: '1',
    customer: 'Acme Corporation',
    orderDate: '2024-01-15',
    subtotal: 125000,
    tax: 12500,
    shipping: 2500,
    total: 140000,
    status: 'Paid'
  },
  {
    id: '2',
    customer: 'Tech Innovations Ltd',
    orderDate: '2024-01-18',
    subtotal: 87500,
    tax: 8750,
    shipping: 1500,
    total: 97750,
    status: 'Pending'
  },
  {
    id: '3',
    customer: 'Global Solutions Inc',
    orderDate: '2024-01-22',
    subtotal: 245000,
    tax: 24500,
    shipping: 3000,
    total: 272500,
    status: 'Paid'
  }
];

export function CurrencyExportExample() {
  const { formatCurrency, currencyFormat } = useCurrencyFormat();
  const { toast } = useToast();

  // Method 1: Using the exportToCSV function directly
  const handleDirectExport = () => {
    exportToCSV(sampleSalesData, 'sales-report', {
      currencyFields: ['subtotal', 'tax', 'shipping', 'total']
    });

    toast({
      title: 'Export Complete',
      description: `Sales data exported in ${currencyFormat} format`,
    });
  };

  // Method 2: Using ExportButton component (recommended)
  const currencyFields = ['subtotal', 'tax', 'shipping', 'total'];

  // Method 3: Custom export with transformed data
  const handleCustomExport = () => {
    const transformedData = sampleSalesData.map(order => ({
      'Order ID': order.id,
      'Customer Name': order.customer,
      'Order Date': order.orderDate,
      'Subtotal': order.subtotal,
      'Tax': order.tax,
      'Shipping': order.shipping,
      'Total': order.total,
      'Status': order.status
    }));

    exportToCSV(transformedData, 'custom-sales-report', {
      currencyFields: ['Subtotal', 'Tax', 'Shipping', 'Total']
    });

    toast({
      title: 'Custom Export Complete',
      description: 'Data exported with custom column names',
    });
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <h2 className="text-2xl font-bold">Currency Export Examples</h2>
        <p className="text-muted-foreground">
          Demonstrates exporting data with currency formatting based on user preferences
        </p>
      </div>

      {/* Current Format Indicator */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Current Currency Format
          </CardTitle>
          <CardDescription>
            Your current preference: <strong>{currencyFormat === 'whole' ? 'Whole Numbers' : 'Decimals'}</strong>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Example formatting:</p>
            <div className="grid grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
              <div>
                <p className="text-xs text-muted-foreground">Subtotal</p>
                <p className="text-lg font-semibold">{formatCurrency(125000)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total</p>
                <p className="text-lg font-semibold">{formatCurrency(140000)}</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              💡 Change your preference in Settings → Display & Formatting
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Sample Data Table */}
      <Card>
        <CardHeader>
          <CardTitle>Sample Sales Data</CardTitle>
          <CardDescription>
            This is the data that will be exported with currency formatting
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Customer</th>
                  <th className="text-right p-2">Subtotal</th>
                  <th className="text-right p-2">Tax</th>
                  <th className="text-right p-2">Total</th>
                  <th className="text-left p-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {sampleSalesData.map((order) => (
                  <tr key={order.id} className="border-b">
                    <td className="p-2">{order.customer}</td>
                    <td className="text-right p-2">{formatCurrency(order.subtotal)}</td>
                    <td className="text-right p-2">{formatCurrency(order.tax)}</td>
                    <td className="text-right p-2 font-semibold">{formatCurrency(order.total)}</td>
                    <td className="p-2">{order.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Export Methods */}
      <Card>
        <CardHeader>
          <CardTitle>Export Methods</CardTitle>
          <CardDescription>
            Different ways to export data with automatic currency formatting
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Method 1: Direct Export */}
          <div className="space-y-2">
            <h4 className="font-semibold">Method 1: Direct Export Function</h4>
            <p className="text-sm text-muted-foreground">
              Use <code className="bg-muted px-1 rounded">exportToCSV()</code> directly with currency fields specified
            </p>
            <Button onClick={handleDirectExport} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export with Direct Function
            </Button>
            <pre className="bg-muted p-2 rounded text-xs overflow-x-auto">
{`exportToCSV(data, 'filename', {
  currencyFields: ['subtotal', 'tax', 'total']
});`}
            </pre>
          </div>

          {/* Method 2: ExportButton Component */}
          <div className="space-y-2">
            <h4 className="font-semibold">Method 2: ExportButton Component with Preview (Recommended)</h4>
            <p className="text-sm text-muted-foreground">
              Use the reusable <code className="bg-muted px-1 rounded">ExportButton</code> component with built-in preview
            </p>
            <ExportButton
              data={sampleSalesData}
              filename="sales-report"
              currencyFields={currencyFields}
              showPreview={true}
            />
            <pre className="bg-muted p-2 rounded text-xs overflow-x-auto">
{`<ExportButton
  data={data}
  filename="sales-report"
  currencyFields={['subtotal', 'tax', 'total']}
  showPreview={true}
/>`}
            </pre>
          </div>

          {/* Method 3: Custom Export */}
          <div className="space-y-2">
            <h4 className="font-semibold">Method 3: Custom Export with Transformation</h4>
            <p className="text-sm text-muted-foreground">
              Transform data before export with custom column names
            </p>
            <Button onClick={handleCustomExport} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export with Custom Names
            </Button>
            <pre className="bg-muted p-2 rounded text-xs overflow-x-auto">
{`const transformed = data.map(item => ({
  'Order ID': item.id,
  'Total': item.total
}));
exportToCSV(transformed, 'report', {
  currencyFields: ['Total']
});`}
            </pre>
          </div>
        </CardContent>
      </Card>

      {/* Best Practices */}
      <Card>
        <CardHeader>
          <CardTitle>Best Practices</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            <li className="flex gap-2">
              <span className="text-green-600">✓</span>
              <span>Always specify <code className="bg-muted px-1 rounded">currencyFields</code> when exporting financial data</span>
            </li>
            <li className="flex gap-2">
              <span className="text-green-600">✓</span>
              <span>Use consistent field names that clearly indicate currency values</span>
            </li>
            <li className="flex gap-2">
              <span className="text-green-600">✓</span>
              <span>Test exports with both 'whole' and 'decimal' format preferences</span>
            </li>
            <li className="flex gap-2">
              <span className="text-green-600">✓</span>
              <span>Provide user feedback with toast notifications after export</span>
            </li>
            <li className="flex gap-2">
              <span className="text-red-600">✗</span>
              <span>Don't manually format currency in export data - let the utility handle it</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
