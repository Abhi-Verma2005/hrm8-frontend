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

The `ExportButton` component makes it easy to add export functionality to your pages.

### Basic Example

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
    />
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

1. **Always Specify Currency Fields**: When exporting data with currency values, always specify the `currencyFields` option to ensure proper formatting.

2. **Use Consistent Field Names**: Use clear field names that indicate currency values (e.g., `amount`, `price`, `total`, `revenue`).

3. **Test Both Formats**: Test your exports with both whole number and decimal currency formats to ensure they work correctly.

4. **Field Selection**: When using `fields` parameter, make sure your `currencyFields` only reference fields that are actually exported.

5. **User Communication**: Let users know their export will respect their currency format preference with appropriate toast messages.

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
