# Phase 5 Implementation: Analytics & Reporting Dashboard

## Overview
Phase 5 adds a comprehensive analytics and reporting dashboard with recruitment metrics, pipeline visualization, time-to-hire tracking, and source effectiveness analysis.

## Features Implemented

### 1. Analytics Service (`analyticsService.ts`)
Core calculation engine for all recruitment metrics:

- **Recruitment Metrics**
  - Total, active, hired, and rejected candidates
  - Average time to hire
  - Conversion rate (hired/total)
  - Month-over-month growth tracking
  - Monthly candidate comparison

- **Pipeline Stage Metrics**
  - Candidate distribution across stages
  - Stage percentages
  - Average time spent in each stage
  - Stage bottleneck identification

- **Source Effectiveness**
  - Candidate count by source
  - Hire count and conversion rate per source
  - Average time to hire by source
  - Average candidate rating by source

- **Time-to-Hire Trends**
  - Monthly average days to hire
  - Trend analysis over 3/6/12 months
  - Candidate count per period

- **Candidate Trends**
  - Monthly candidate inflow
  - Hired vs rejected trends
  - Multi-month comparison

- **Conversion Funnel**
  - Stage-by-stage progression
  - Conversion rates between stages
  - Drop-off analysis

### 2. Dashboard Components

#### MetricsOverview
- **4 Key Metric Cards:**
  - Total Candidates with MoM growth indicator
  - Active Candidates count
  - Hired This Month with conversion rate
  - Average Time to Hire

#### PipelineFunnelChart
- Horizontal bar chart showing conversion funnel
- Color-coded stages
- Conversion rate percentages
- Interactive tooltips

#### SourceEffectivenessChart
- Dual-bar chart comparing total vs hired candidates
- Source-by-source breakdown
- Performance metrics in tooltips

#### TimeToHireTrendChart
- Line chart showing time-to-hire over months
- Average days trend line
- Candidate count overlay

#### CandidateTrendChart
- Multi-line chart with three metrics:
  - Total candidates (purple)
  - Hired candidates (green)
  - Rejected candidates (red)
- Month-over-month trends

#### PipelineStageMetrics
- Pie chart with stage distribution
- Detailed breakdown list with:
  - Stage name and color indicator
  - Candidate count and percentage
  - Average time in stage

### 3. Analytics Page (`Analytics.tsx`)
Comprehensive dashboard with:

- **Header Section**
  - Time range selector (3/6/12 months)
  - Export report button
  - Page title and description

- **Metrics Overview**
  - 4 key metric cards at the top

- **Tabbed Navigation**
  - **Overview Tab**: Combined view with trends and funnel
  - **Pipeline Tab**: Detailed pipeline analysis with bottleneck identification
  - **Sources Tab**: Source performance comparison and details
  - **Time Tab**: Time-to-hire trends and statistics

- **Additional Insights**
  - Top bottleneck identification
  - Longest stage analysis
  - Fastest source for hiring
  - Trend indicators (improving/declining)

## File Structure

```
src/
├── lib/
│   └── analyticsService.ts (new)
├── components/
│   └── analytics/
│       ├── MetricsOverview.tsx (new)
│       ├── PipelineFunnelChart.tsx (new)
│       ├── SourceEffectivenessChart.tsx (new)
│       ├── TimeToHireTrendChart.tsx (new)
│       ├── CandidateTrendChart.tsx (new)
│       └── PipelineStageMetrics.tsx (new)
└── pages/
    └── Analytics.tsx (new)
```

## Integration with Existing Code

### Data Source
- Uses `getCandidates()` from mockCandidateStorage
- All calculations performed client-side
- Real-time data updates

### Candidate Requirements
Analytics service expects Candidate objects with:
- `status`: 'active' | 'hired' | 'rejected' | 'inactive'
- `stage`: Pipeline stage name
- `source`: Candidate source/channel
- `appliedDate`: Date of application
- `updatedAt`: Last update date
- `rating`: Candidate rating (optional)

## Technical Details

### Chart Library
- Uses **Recharts** (already installed)
- Responsive containers
- Custom tooltips
- Color-coded visualizations

### Date Handling
- Uses **date-fns** for date calculations
- Month-over-month comparisons
- Flexible time ranges (3/6/12 months)

### Color Palette
- Primary: `#8b5cf6` (purple)
- Success: `#22c55e` (green)
- Error: `#ef4444` (red)
- Gradient: Purple shades for stages

### Performance
- All metrics calculated using `useMemo`
- Recalculated only when candidates or time range changes
- Client-side processing for instant updates

## Usage Examples

### Accessing Analytics
Navigate to `/analytics` route to view the dashboard.

### Time Range Selection
```typescript
// Change time range (affects trends and time-to-hire charts)
setTimeRange('3'); // Last 3 months
setTimeRange('6'); // Last 6 months (default)
setTimeRange('12'); // Last 12 months
```

### Export Report
```typescript
// Triggered by Export Report button
handleExportReport(); // Shows toast notification
// In production: would generate PDF/Excel report
```

### Calculating Custom Metrics
```typescript
import { calculateRecruitmentMetrics } from '@/lib/analyticsService';

const metrics = calculateRecruitmentMetrics(candidates);
console.log(`Conversion Rate: ${metrics.conversionRate}%`);
console.log(`Avg Time to Hire: ${metrics.averageTimeToHire} days`);
```

## Key Insights Provided

### For Recruiters
- Bottlenecks in the pipeline
- Most effective sourcing channels
- Time-to-hire trends and targets
- Conversion rate tracking

### For Managers
- Overall recruitment efficiency
- Month-over-month performance
- Resource allocation insights
- ROI by candidate source

### For Leadership
- High-level metrics overview
- Trend analysis and forecasting
- Strategic sourcing decisions
- Process optimization opportunities

## Future Enhancements

### Recommended Next Steps:
1. **Real Report Export** - Generate PDF/Excel reports with full analytics
2. **Custom Date Ranges** - Allow specific date range selection
3. **Goal Setting** - Set and track KPI targets
4. **Predictive Analytics** - Forecast hiring needs and trends
5. **Comparative Analysis** - Compare performance across teams/departments
6. **Real-time Notifications** - Alert on metric thresholds
7. **Dashboard Customization** - Allow users to customize dashboard layout
8. **Advanced Filters** - Filter analytics by job, department, location, etc.
9. **Data Export** - Export raw data for external analysis
10. **Benchmark Comparisons** - Compare against industry standards

## Notes
- All metrics are calculated from mock candidate data
- Production implementation should use database aggregations for large datasets
- Consider caching calculated metrics for improved performance
- Add loading states for asynchronous data fetching
- Implement error boundaries for chart rendering failures
- Add accessibility features for screen readers
- Consider mobile-responsive chart alternatives
