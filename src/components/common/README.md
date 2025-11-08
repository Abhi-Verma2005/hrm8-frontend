# Common Components

This directory contains reusable components and utilities used across the application.

## Form Fields

Reusable form field components with consistent styling and validation error display.

### Usage Example

```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form } from '@/components/ui/form';
import { FormInput, FormSelect, FormTextarea, FormCheckbox } from '@/components/common/form-fields';

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  role: z.string().min(1, 'Role is required'),
  bio: z.string().optional(),
  active: z.boolean(),
});

function MyForm() {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      email: '',
      role: '',
      bio: '',
      active: true,
    },
  });

  return (
    <Form {...form}>
      <form>
        <FormInput
          form={form}
          name="name"
          label="Full Name"
          placeholder="Enter your name"
          required
        />

        <FormInput
          form={form}
          name="email"
          label="Email"
          type="email"
          placeholder="email@example.com"
          required
        />

        <FormSelect
          form={form}
          name="role"
          label="Role"
          placeholder="Select a role"
          required
          options={[
            { value: 'admin', label: 'Administrator' },
            { value: 'user', label: 'User' },
          ]}
        />

        <FormTextarea
          form={form}
          name="bio"
          label="Bio"
          placeholder="Tell us about yourself"
          rows={4}
        />

        <FormCheckbox
          form={form}
          name="active"
          label="Active"
          description="Enable or disable the account"
        />
      </form>
    </Form>
  );
}
```

## Error Boundary

Global error boundary component that catches React errors and displays a user-friendly fallback UI.

### Features
- Catches and displays React component errors
- Shows error details in development mode
- Provides "Try Again" and "Go Home" actions
- Can be customized with custom fallback UI

### Usage

Already implemented at the app root level in `App.tsx`. You can also use it for specific sections:

```tsx
import { ErrorBoundary } from '@/components/common/ErrorBoundary';

function MyComponent() {
  return (
    <ErrorBoundary>
      <YourComponent />
    </ErrorBoundary>
  );
}

// With custom fallback
<ErrorBoundary fallback={<div>Custom error UI</div>}>
  <YourComponent />
</ErrorBoundary>
```

## Notification System

Centralized notification system for consistent toast messages.

### Using the Hook

```tsx
import { useNotification } from '@/hooks/use-notification';

function MyComponent() {
  const notify = useNotification();

  const handleSave = async () => {
    try {
      await saveData();
      notify.success('Data saved successfully');
    } catch (error) {
      notify.error('Failed to save data', {
        description: error.message,
        action: {
          label: 'Retry',
          onClick: () => handleSave(),
        },
      });
    }
  };

  // CRUD operations
  const handleCreate = async () => {
    try {
      await createEmployee();
      notify.created('Employee');
    } catch (error) {
      notify.createFailed('Employee', error.message);
    }
  };

  // Promise-based helper
  const handleUpdate = () => {
    notify.promise(
      updateEmployee(),
      {
        loading: 'Updating employee...',
        success: 'Employee updated successfully',
        error: 'Failed to update employee',
      }
    );
  };

  return <button onClick={handleSave}>Save</button>;
}
```

### Using the Service

```tsx
import { notify } from '@/lib/notifications';

// Direct usage without hooks
notify.success('Operation successful');
notify.error('Operation failed');
notify.info('Information message');
notify.warning('Warning message');

// CRUD helpers
notify.crud.created('Employee');
notify.crud.updated('Employer');
notify.crud.deleted('Consultant');
notify.crud.createFailed('Employee', 'Validation error');

// Promise-based
notify.promise(
  fetchData(),
  {
    loading: 'Loading...',
    success: 'Data loaded',
    error: 'Failed to load data',
  }
);
```

## Form Wizard

Reusable wizard component for multi-step forms with standardized navigation, progress tracking, and validation.

### Usage

```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormWizard, WizardStep } from '@/components/common/FormWizard';
import { mySchema, type MyFormData } from '@/lib/validations';

const STEPS: WizardStep<MyFormData>[] = [
  { title: 'Basic Info', component: BasicInfoStep, fields: ['name', 'email'] },
  { title: 'Details', component: DetailsStep, fields: ['address', 'phone'] },
];

function MyWizard() {
  const form = useForm<MyFormData>({
    resolver: zodResolver(mySchema),
    defaultValues: { ... },
  });

  const handleSave = async () => {
    const values = form.getValues();
    await saveData(values);
  };

  return (
    <FormWizard
      steps={STEPS}
      form={form}
      onSave={handleSave}
      onCancel={() => router.back()}
      entityName="Employee"
    />
  );
}
```

## Data Table

Comprehensive data table component with sorting, filtering, pagination, and more.

See `src/components/tables/DataTable.tsx` for full documentation and examples.
