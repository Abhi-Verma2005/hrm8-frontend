# Currency Format Migration Guide

This guide helps you migrate existing currency formatting code to use the new centralized currency format system.

## What Changed

We've implemented a user-configurable currency format preference that allows switching between whole numbers and decimal display:

- **Before**: Currency always displayed with 2 decimal places (e.g., "$1,234,567.00")
- **Now**: Users can choose between whole numbers (e.g., "$1,234,567") or decimals (e.g., "$1,234,567.89")

## Migration Steps

### 1. For React Components

**Before:**
```tsx
<div className="text-2xl font-bold">
  ${value.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
</div>
```

**After:**
```tsx
import { useCurrencyFormat } from '@/contexts/CurrencyFormatContext';

function MyComponent() {
  const { formatCurrency } = useCurrencyFormat();
  
  return (
    <div className="text-2xl font-bold">
      {formatCurrency(value)}
    </div>
  );
}
```

### 2. For Utility Functions

**Before:**
```typescript
function calculateTotal(items: Item[]): string {
  const total = items.reduce((sum, item) => sum + item.price, 0);
  return total.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}
```

**After:**
```typescript
import { formatCurrency } from '@/lib/currencyUtils';

function calculateTotal(items: Item[]): string {
  const total = items.reduce((sum, item) => sum + item.price, 0);
  return formatCurrency(total);
}
```

### 3. For Export/Report Functions

**Before:**
```typescript
const exportData = data.map(row => ({
  ...row,
  amount: row.amount.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
}));
```

**After:**
```typescript
import { formatCurrency } from '@/lib/currencyUtils';

const exportData = data.map(row => ({
  ...row,
  amount: formatCurrency(row.amount)
}));
```

## Benefits

1. **User Control**: Users can now choose their preferred format in Settings
2. **Consistency**: Single source of truth for currency formatting
3. **Maintainability**: Easy to update formatting logic globally
4. **Flexibility**: Can force specific formats when needed

## Examples

### Basic Usage
```tsx
import { useCurrencyFormat } from '@/contexts/CurrencyFormatContext';

function StatCard() {
  const { formatCurrency } = useCurrencyFormat();
  
  return (
    <div>
      <p>Total Revenue</p>
      <p className="text-2xl font-bold">{formatCurrency(1234567.89)}</p>
    </div>
  );
}
```

### With Different Currencies
```tsx
const { formatCurrency } = useCurrencyFormat();

<div>
  <p>USD: {formatCurrency(1000, 'USD')}</p>
  <p>EUR: {formatCurrency(1000, 'EUR')}</p>
  <p>GBP: {formatCurrency(1000, 'GBP')}</p>
</div>
```

### Force Specific Format (when needed)
```tsx
import { formatCurrency } from '@/lib/currencyUtils';

// Always show decimals for invoices
const invoiceTotal = formatCurrency(invoice.total, 'USD', 'decimal');

// Always show whole numbers for budget
const budget = formatCurrency(budgetAmount, 'USD', 'whole');
```

## Testing Your Changes

1. Navigate to Settings > Display & Formatting
2. Toggle the Currency Format switch
3. Verify that all currency values update correctly
4. Test with both whole numbers and decimal formats

## Common Patterns to Update

### Pattern 1: Simple toLocaleString
```typescript
// Before
${amount.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}

// After
{formatCurrency(amount)}
```

### Pattern 2: toLocaleString without currency symbol
```typescript
// Before
amount.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })

// After
import { formatCurrencyNumber } from '@/lib/currencyUtils';
formatCurrencyNumber(amount)
```

### Pattern 3: Fixed decimal places
```typescript
// Before
amount.toFixed(2)

// After (if currency)
formatCurrency(amount, 'USD', 'decimal')

// After (if just number)
amount.toFixed(2) // Keep as is for non-currency
```

## Notes

- The preference is stored in localStorage as `hrm8_currency_format`
- Default format is `'whole'` (no decimals)
- The context automatically persists user preferences
- All currency formatting should eventually use this system for consistency

## Export Functionality

All export functions (CSV, Excel, PDF) automatically respect the user's currency format preference. When exporting data with currency values, the format will match what the user sees in the UI.

### Using Export Functions

```typescript
import { exportToCSV } from '@/utils/exportHelpers';

const data = [
  { name: 'Item', price: 1234567, total: 9876543 }
];

// Specify which fields contain currency
exportToCSV(data, 'my-export', {
  currencyFields: ['price', 'total']
});
```

See `src/utils/EXPORT_GUIDE.md` for complete export documentation.

## Related Files

- `src/contexts/CurrencyFormatContext.tsx` - Context and hook for currency formatting
- `src/lib/currencyUtils.ts` - Standalone utility functions
- `src/pages/Settings.tsx` - User preference toggle
- `src/utils/exportHelpers.ts` - Export utilities with currency formatting
- `src/utils/EXPORT_GUIDE.md` - Complete export documentation
