export type BusinessAlertType = 
  | 'profit_margin_low'
  | 'adoption_rate_declining'
  | 'revenue_target_missed'
  | 'client_churn_high'
  | 'cost_increase'
  | 'growth_stagnant';

export type BusinessAlertSeverity = 'critical' | 'warning' | 'info';

export type BusinessAlertModule = 'assessments' | 'background-checks' | 'overall';

export interface BusinessAlert {
  id: string;
  type: BusinessAlertType;
  severity: BusinessAlertSeverity;
  module: BusinessAlertModule;
  title: string;
  message: string;
  currentValue: number;
  threshold: number;
  trend: 'increasing' | 'decreasing' | 'stable';
  createdAt: string;
  acknowledged: boolean;
  acknowledgedAt?: string;
  acknowledgedBy?: string;
}

export interface AlertThreshold {
  metric: string;
  warningThreshold: number;
  criticalThreshold: number;
  comparison: 'above' | 'below';
  enabled: boolean;
}

export interface AlertConfiguration {
  profitMarginWarning: number; // e.g., 20%
  profitMarginCritical: number; // e.g., 10%
  adoptionRateWarning: number; // e.g., 5% decline
  adoptionRateCritical: number; // e.g., 10% decline
  revenueTargetWarning: number; // e.g., 90% of target
  revenueTargetCritical: number; // e.g., 80% of target
  churnRateWarning: number; // e.g., 15%
  churnRateCritical: number; // e.g., 25%
}

export interface BusinessAlertStats {
  total: number;
  critical: number;
  warning: number;
  info: number;
  unacknowledged: number;
  byModule: Record<BusinessAlertModule, number>;
}
