# Export Utilities with Currency Formatting

This guide explains how to use the export utilities with automatic currency formatting based on user preferences.

## Features

- **User Preference Respect**: All currency values are formatted according to the user's selected format (whole numbers or decimals)
- **CSV Export**: Export data to CSV files with proper formatting
- **Currency Field Detection**: Automatically format specified currency fields
- **Flexible Configuration**: Easy to specify which fields contain currency values

## Basic Usage

### Simple Export

```typescript
import { exportToCSV } from '@/utils/exportHelpers';

const data = [
  { name: 'Product A', price: 19999, quantity: 5 },
  { name: 'Product B', price: 29999, quantity: 3 }
];

exportToCSV(data, 'products');
```

### Export with Currency Formatting

```typescript
import { exportToCSV } from '@/utils/exportHelpers';

const salesData = [
  { 
    customer: 'Acme Corp',
    revenue: 150000,
    commission: 15000,
    netProfit: 135000
  },
  {
    customer: 'Tech Inc',
    revenue: 280000,
    commission: 28000,
    netProfit: 252000
  }
];

// Specify which fields contain currency values
exportToCSV(salesData, 'sales-report', {
  currencyFields: ['revenue', 'commission', 'netProfit']
});
```

## Using ExportButton Component

The `ExportButton` component makes it easy to add export functionality with preview to your pages.

### Basic Example with Preview (Recommended)

```tsx
import { ExportButton } from '@/components/common/ExportButton';

function MyComponent() {
  const data = [
    { name: 'Item 1', amount: 5000 },
    { name: 'Item 2', amount: 7500 }
  ];

  return (
    <ExportButton 
      data={data} 
      filename="my-export"
      currencyFields={['amount']}
      showPreview={true}  // Default is true
    />
  );
}
```

### Without Preview (Direct Export)

```tsx
import { ExportButton } from '@/components/common/ExportButton';

function MyComponent() {
  const data = [
    { name: 'Item 1', amount: 5000 }
  ];

  return (
    <ExportButton 
      data={data} 
      filename="quick-export"
      currencyFields={['amount']}
      showPreview={false}  // Skip preview dialog
    />
  );
}
```

### With Field Selection

```tsx
import { ExportButton } from '@/components/common/ExportButton';

function MyComponent() {
  const fullData = [
    { 
      id: '1',
      name: 'Item 1', 
      amount: 5000,
      internalNote: 'Private data'
    }
  ];

  return (
    <ExportButton 
      data={fullData}
      filename="public-export"
      fields={['name', 'amount']}  // Only export these fields
      currencyFields={['amount']}
      showPreview={true}
    />
  );
}
```

## Export Preview Dialog

The export preview dialog shows users exactly how their data will look before downloading, with all currency formatting applied according to their preferences.

### Features

- **Visual Data Preview**: See first 10 rows with formatted values
- **Currency Field Indicators**: Currency columns are clearly marked
- **Format Selection**: Choose between CSV and JSON export
- **Row/Column Count**: Quick summary of data size
- **Responsive Design**: Works on all screen sizes

### Direct Usage

```tsx
import { ExportPreviewDialog } from '@/components/common/ExportPreviewDialog';
import { useState } from 'react';

function MyComponent() {
  const [previewOpen, setPreviewOpen] = useState(false);
  
  const data = [
    { product: 'Widget A', revenue: 125000, cost: 80000 }
  ];

  return (
    <>
      <Button onClick={() => setPreviewOpen(true)}>
        Preview Export
      </Button>
      
      <ExportPreviewDialog
        open={previewOpen}
        onOpenChange={setPreviewOpen}
        data={data}
        filename="revenue-report"
        currencyFields={['revenue', 'cost']}
        title="Revenue Report Preview"
        description="Review your revenue data before exporting"
      />
    </>
  );
}
```

## Format Data Before Export

Use `formatDataForExport` to prepare data before exporting:

```typescript
import { formatDataForExport, exportToCSV } from '@/utils/exportHelpers';

const rawData = [...]; // Your data
const selectedFields = ['name', 'price', 'total'];

const formattedData = formatDataForExport(
  rawData,
  selectedFields,
  { currencyFields: ['price', 'total'] }
);

exportToCSV(formattedData, 'formatted-export');
```

## Export Options

```typescript
interface ExportOptions {
  currencyFields?: string[];  // Array of field names containing currency values
  dateFields?: string[];      // Reserved for future date formatting
}
```

## Currency Formatting Behavior

The export utilities use the same currency formatting as the rest of the application:

- **Whole Number Format**: `$1,234,567` (no decimals)
- **Decimal Format**: `$1,234,567.00` (always 2 decimals)

The format is controlled by the user's preference in Settings > Display & Formatting.

## Common Use Cases

### 1. Financial Reports

```typescript
const financialData = [
  { month: 'January', revenue: 125000, expenses: 80000, profit: 45000 }
];

exportToCSV(financialData, 'financial-report', {
  currencyFields: ['revenue', 'expenses', 'profit']
});
```

### 2. Sales Commissions

```typescript
const commissionData = [
  { 
    agent: 'John Doe',
    dealValue: 50000,
    commissionRate: '15%',
    commissionAmount: 7500
  }
];

exportToCSV(commissionData, 'commissions', {
  currencyFields: ['dealValue', 'commissionAmount']
});
```

### 3. Invoice Data

```typescript
const invoices = [
  {
    invoiceNumber: 'INV-001',
    subtotal: 10000,
    tax: 1000,
    total: 11000
  }
];

exportToCSV(invoices, 'invoices', {
  currencyFields: ['subtotal', 'tax', 'total']
});
```

## Best Practices

1. **Always Use Preview for Important Data**: Enable `showPreview={true}` for financial or sensitive data exports to let users verify formatting.

2. **Always Specify Currency Fields**: When exporting data with currency values, always specify the `currencyFields` option to ensure proper formatting.

3. **Use Consistent Field Names**: Use clear field names that indicate currency values (e.g., `amount`, `price`, `total`, `revenue`).

4. **Test Both Formats**: Test your exports with both whole number and decimal currency formats to ensure they work correctly.

5. **Field Selection**: When using `fields` parameter, make sure your `currencyFields` only reference fields that are actually exported.

6. **User Communication**: Let users know their export will respect their currency format preference with appropriate toast messages.

7. **Large Datasets**: For very large datasets (>1000 rows), consider adding a loading state or processing indicator.

## Migration from Old Code

### Before (Manual Formatting)

```typescript
const exportData = data.map(item => ({
  name: item.name,
  amount: `$${item.amount.toLocaleString('en-US', { 
    minimumFractionDigits: 2,
    maximumFractionDigits: 2 
  })}`
}));
```

### After (Automatic Formatting)

```typescript
exportToCSV(data, 'export', {
  currencyFields: ['amount']
});
```

## Related Files

- `src/utils/exportHelpers.ts` - Core export utilities
- `src/lib/currencyUtils.ts` - Currency formatting functions
- `src/contexts/CurrencyFormatContext.tsx` - Currency format context
- `src/components/common/ExportButton.tsx` - Reusable export button component
- `src/components/common/ExportPreviewDialog.tsx` - Export preview modal with visual data preview
