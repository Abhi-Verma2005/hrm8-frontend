# Phase 4 Implementation: Import/Export & Integrations

## Overview
Phase 4 adds comprehensive import/export functionality and integrations with external services including email providers, calendar systems, and ATS platforms.

## Features Implemented

### 1. Candidate Import/Export
- **Import Dialog** (`CandidateImportDialog.tsx`)
  - Multi-step wizard for importing candidates
  - CSV and Excel file support
  - Column mapping interface
  - Data validation and error reporting
  - Duplicate detection and handling (skip/update/create)
  - Preview before import
  - Field transformation support

- **Export Dialog** (`CandidateExportDialog.tsx`)
  - Export to CSV or Excel formats
  - Export all or selected candidates
  - Customizable field selection
  - Default and custom field sets
  - Automatic file naming with timestamps

### 2. Email Integrations
- **Service Layer** (`emailIntegrationService.ts`)
  - Gmail and Outlook integration support
  - OAuth connection flow (mock)
  - Email sending functionality
  - Email synchronization
  - Template management
  - Connection management (connect/disconnect)

- **UI Component** (`EmailIntegrationCard.tsx`)
  - Connect/disconnect email accounts
  - Connection status display
  - Email sync functionality
  - Last sync timestamp tracking
  - Connected account details

### 3. Calendar Integrations
- **Service Layer** (`calendarIntegrationService.ts`)
  - Google Calendar and Outlook Calendar support
  - OAuth connection flow (mock)
  - Event creation, updating, deletion
  - Available time slot detection
  - Calendar synchronization
  - Meeting link support

- **UI Component** (`CalendarIntegrationCard.tsx`)
  - Connect/disconnect calendar accounts
  - Connection status display
  - Calendar sync functionality
  - Last sync timestamp tracking
  - Connected account details

### 4. ATS System Integrations
- **Service Layer** (`atsIntegrationService.ts`)
  - Support for major ATS platforms:
    - Greenhouse
    - Lever
    - Workday
    - iCIMS
    - Oracle Taleo
    - Jobvite
  - API key-based authentication
  - Bidirectional sync (import/export/both)
  - Candidate and job syncing
  - Connection testing
  - Provider information and setup guides

- **UI Component** (`ATSIntegrationCard.tsx`)
  - Connect ATS systems with credentials
  - Configure sync direction
  - Manual sync trigger
  - Sync statistics display
  - Connection management
  - Setup guide links

## File Structure

```
src/
├── components/
│   ├── candidates/
│   │   └── import-export/
│   │       ├── CandidateImportDialog.tsx
│   │       └── CandidateExportDialog.tsx
│   └── integrations/
│       ├── EmailIntegrationCard.tsx
│       ├── CalendarIntegrationCard.tsx
│       └── ATSIntegrationCard.tsx
├── lib/
│   └── integrations/
│       ├── emailIntegrationService.ts
│       ├── calendarIntegrationService.ts
│       └── atsIntegrationService.ts
└── pages/
    ├── Candidates.tsx (updated)
    └── Integrations.tsx (updated)
```

## Integration with Existing Code

### Candidates Page Updates
- Added Import and Export buttons to the toolbar
- Integrated import/export dialogs
- Handlers for import functionality with duplicate handling
- Export support for all or selected candidates

### Integrations Page Updates
- Complete redesign with tabbed interface
- Email integrations tab with Gmail and Outlook cards
- Calendar integrations tab with Google and Outlook cards
- ATS integrations tab with 6 major ATS providers
- Real-time connection status display

## Technical Details

### Import Process
1. **File Upload**: Accept CSV/Excel files
2. **Parsing**: Extract headers and data rows
3. **Mapping**: Map file columns to candidate fields
4. **Validation**: Validate each row against schema
5. **Duplicate Detection**: Compare with existing candidates
6. **Preview**: Show statistics and errors
7. **Import**: Transform and save data

### Export Process
1. **Scope Selection**: Choose all or selected candidates
2. **Format Selection**: Choose CSV or Excel
3. **Field Selection**: Select which fields to export
4. **Transform**: Format data for export
5. **Download**: Generate and download file

### Integration Storage
- All integration data stored in localStorage
- Mock OAuth flows for demonstration
- Real API calls would replace mock implementations
- Secure credential storage in production

## Mock vs Production

### Current (Mock):
- OAuth flows simulate delays
- API calls are mocked with timeouts
- Data stored in localStorage
- No actual external API calls

### Production Requirements:
- Real OAuth 2.0 implementation
- Actual API integrations with providers
- Secure credential storage (backend)
- Webhook support for real-time sync
- Error handling and retry logic
- Rate limiting and quota management

## Email Templates
Pre-configured templates available:
- Interview Invitation
- Job Offer
- Application Status Update
- Follow-up Communication

Templates support variable substitution:
- `{{candidateName}}`
- `{{position}}`
- `{{date}}`, `{{time}}`, `{{location}}`
- `{{recruiterName}}`
- `{{customMessage}}`

## ATS Provider Details
Each provider includes:
- Official name and description
- Website URL
- Developer documentation link
- API setup guide
- Sync direction configuration
- Custom API endpoint support

## Usage Examples

### Importing Candidates
```typescript
// Import with skip duplicates
await handleImportCandidates(candidates, 'skip');

// Import with update existing
await handleImportCandidates(candidates, 'update');

// Import creating duplicates as new
await handleImportCandidates(candidates, 'create');
```

### Email Integration
```typescript
// Connect Gmail
await connectEmailProvider('gmail');

// Send email
await sendEmail('gmail', 'candidate@example.com', 'Subject', 'Body');

// Sync emails
await syncEmails('gmail');
```

### Calendar Integration
```typescript
// Connect Google Calendar
await connectCalendarProvider('google');

// Create event
await createCalendarEvent('google', {
  title: 'Interview with John Doe',
  start: '2024-01-15T10:00:00Z',
  end: '2024-01-15T11:00:00Z',
  attendees: ['john@example.com'],
});
```

### ATS Integration
```typescript
// Connect Greenhouse
await connectATSProvider('greenhouse', 'Company Name', 'api_key', '', 'bidirectional');

// Sync data
const result = await syncWithATS(integrationId);
console.log(`Imported: ${result.candidatesImported}, Exported: ${result.candidatesExported}`);
```

## Next Steps

### Recommended Phase 5 Options:
1. **Analytics & Reporting Dashboard** - Visualize recruitment metrics and KPIs
2. **Automation & Workflows** - Create automated recruitment workflows
3. **Advanced Candidate Scoring** - AI-powered candidate ranking
4. **Mobile Optimization** - Responsive mobile views for all features
5. **Real-time Collaboration** - Team collaboration features with live updates

## Notes
- All integrations use mock implementations for demonstration
- Production deployment requires real OAuth and API implementations
- Consider security best practices for credential storage
- Implement proper error handling and retry logic for production
- Add rate limiting and quota management for API calls
