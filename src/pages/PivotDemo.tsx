import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PivotTable } from "@/components/tables/PivotTable";
import { Button } from "@/components/ui/button";
import { Download, RefreshCw } from "lucide-react";

// Sample sales data with various dimensions
const generateSampleData = () => {
  const categories = ["Electronics", "Clothing", "Food", "Books", "Home"];
  const regions = ["North", "South", "East", "West"];
  const quarters = ["Q1", "Q2", "Q3", "Q4"];
  const years = [2023, 2024];
  const data = [];

  for (let i = 0; i < 100; i++) {
    data.push({
      id: i + 1,
      category: categories[Math.floor(Math.random() * categories.length)],
      region: regions[Math.floor(Math.random() * regions.length)],
      quarter: quarters[Math.floor(Math.random() * quarters.length)],
      year: years[Math.floor(Math.random() * years.length)],
      sales: Math.floor(Math.random() * 10000) + 1000,
      quantity: Math.floor(Math.random() * 100) + 1,
      cost: Math.floor(Math.random() * 5000) + 500,
      discount: Math.random() * 0.3,
      date: new Date(2023 + Math.floor(Math.random() * 2), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString(),
    });
  }

  return data;
};

export default function PivotDemo() {
  const [data, setData] = useState(generateSampleData());

  const availableFields = [
    { key: "category", label: "Category", type: "string" as const },
    { key: "region", label: "Region", type: "string" as const },
    { key: "quarter", label: "Quarter", type: "string" as const },
    { key: "year", label: "Year", type: "number" as const },
    { key: "sales", label: "Sales Amount", type: "number" as const },
    { key: "quantity", label: "Quantity", type: "number" as const },
    { key: "cost", label: "Cost", type: "number" as const },
    { key: "discount", label: "Discount Rate", type: "number" as const },
    { key: "date", label: "Date", type: "date" as const },
  ];

  const refreshData = () => {
    setData(generateSampleData());
  };

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2">Advanced Pivot Table Demo</h1>
          <p className="text-muted-foreground">
            Explore all the advanced features including calculated fields, grouping, comparison mode, and enhanced formatting
          </p>
        </div>
        <Button onClick={refreshData} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh Data
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Feature Highlights</CardTitle>
          <CardDescription>
            This pivot table includes the following advanced features:
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <FeatureCard
              title="Calculated Fields"
              description="Create custom fields using formulas like Profit = Sales - Cost"
              icon="🧮"
            />
            <FeatureCard
              title="Grouping & Bucketing"
              description="Group numeric ranges or date intervals (daily, monthly, quarterly)"
              icon="📊"
            />
            <FeatureCard
              title="Comparison Mode"
              description="Compare different time periods or segments side-by-side"
              icon="⚖️"
            />
            <FeatureCard
              title="Advanced Aggregations"
              description="Use median, mode, standard deviation, percentiles, and more"
              icon="📈"
            />
            <FeatureCard
              title="Enhanced Formatting"
              description="Create sophisticated conditional formatting rules with icons"
              icon="🎨"
            />
            <FeatureCard
              title="Auto-Save"
              description="Automatically saves your configuration to local storage"
              icon="💾"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Interactive Pivot Table</CardTitle>
          <CardDescription>
            Configure your pivot table using the tools above. All changes are automatically saved.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PivotTable
            data={data}
            availableFields={availableFields}
            initialConfig={{
              rows: ["category"],
              columns: ["quarter"],
              values: [
                { field: "sales", aggregation: "sum", label: "Total Sales" },
                { field: "quantity", aggregation: "sum", label: "Total Quantity" },
              ],
              showTotals: true,
              showChart: false,
              sortConfig: [],
              filters: [],
              numberFormat: {
                type: "currency",
                decimals: 0,
                currencySymbol: "$",
                thousandsSeparator: true,
              },
              calculatedFields: [],
              groupings: [],
              comparison: {
                enabled: false,
                mode: "period",
                showDifference: true,
                showPercentage: true,
              },
              enhancedFormatting: [],
            }}
          />
        </CardContent>
      </Card>

      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle>Quick Start Guide</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <GuideStep
            number={1}
            title="Configure Basic Layout"
            description="Add fields to Rows, Columns, and Values to create your base pivot table"
          />
          <GuideStep
            number={2}
            title="Try Calculated Fields"
            description="Open Advanced Options → Calculated Fields and create a formula like [sales] - [cost] for profit"
          />
          <GuideStep
            number={3}
            title="Set Up Grouping"
            description="Group sales amounts into ranges (0-1000, 1000-5000, 5000+) or dates by month/quarter"
          />
          <GuideStep
            number={4}
            title="Add Formatting Rules"
            description="Create conditional formatting rules to highlight top/bottom performers with colors and icons"
          />
          <GuideStep
            number={5}
            title="Save & Export"
            description="Your configuration auto-saves. Export to Excel/CSV when ready to share"
          />
        </CardContent>
      </Card>
    </div>
  );
}

function FeatureCard({ title, description, icon }: { title: string; description: string; icon: string }) {
  return (
    <div className="p-4 border rounded-lg bg-card hover:shadow-md transition-shadow">
      <div className="text-3xl mb-2">{icon}</div>
      <h3 className="font-semibold mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

function GuideStep({ number, title, description }: { number: number; title: string; description: string }) {
  return (
    <div className="flex gap-3">
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
        {number}
      </div>
      <div>
        <h4 className="font-medium mb-1">{title}</h4>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
