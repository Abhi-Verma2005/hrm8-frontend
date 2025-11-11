import { BusinessAlert, AlertConfiguration, BusinessAlertStats, BusinessAlertSeverity, BusinessAlertModule } from '@/types/businessAlerts';
import { getAssessmentRevenueMetrics, getAssessmentUsageMetrics, getAssessmentProfitability } from '@/lib/assessments/businessAnalytics';
import { getBackgroundCheckRevenueMetrics, getBackgroundCheckUsageMetrics, getBackgroundCheckProfitability } from '@/lib/backgroundChecks/businessAnalytics';

const DEFAULT_ALERT_CONFIG: AlertConfiguration = {
  profitMarginWarning: 20,
  profitMarginCritical: 10,
  adoptionRateWarning: 5,
  adoptionRateCritical: 10,
  revenueTargetWarning: 90,
  revenueTargetCritical: 80,
  churnRateWarning: 15,
  churnRateCritical: 25,
};

// Mock storage for alerts
const STORAGE_KEY = 'business_alerts';
const CONFIG_KEY = 'alert_configuration';

export function getAlertConfiguration(): AlertConfiguration {
  const stored = localStorage.getItem(CONFIG_KEY);
  return stored ? JSON.parse(stored) : DEFAULT_ALERT_CONFIG;
}

export function updateAlertConfiguration(config: Partial<AlertConfiguration>): AlertConfiguration {
  const current = getAlertConfiguration();
  const updated = { ...current, ...config };
  localStorage.setItem(CONFIG_KEY, JSON.stringify(updated));
  return updated;
}

export function getBusinessAlerts(): BusinessAlert[] {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
}

function saveAlerts(alerts: BusinessAlert[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(alerts));
}

function createAlert(
  type: BusinessAlert['type'],
  severity: BusinessAlertSeverity,
  module: BusinessAlertModule,
  title: string,
  message: string,
  currentValue: number,
  threshold: number,
  trend: BusinessAlert['trend']
): BusinessAlert {
  return {
    id: `alert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    type,
    severity,
    module,
    title,
    message,
    currentValue,
    threshold,
    trend,
    createdAt: new Date().toISOString(),
    acknowledged: false,
  };
}

export function monitorBusinessMetrics(): BusinessAlert[] {
  const config = getAlertConfiguration();
  const alerts: BusinessAlert[] = [];

  // Monitor Assessments
  const assessmentRevenue = getAssessmentRevenueMetrics();
  const assessmentUsage = getAssessmentUsageMetrics();
  const assessmentProfit = getAssessmentProfitability();

  // Check profit margin - Assessments
  if (assessmentProfit.marginPercentage < config.profitMarginCritical) {
    alerts.push(createAlert(
      'profit_margin_low',
      'critical',
      'assessments',
      'Critical: Assessments Profit Margin Too Low',
      `Assessments profit margin has dropped to ${assessmentProfit.marginPercentage.toFixed(1)}%, below critical threshold of ${config.profitMarginCritical}%`,
      assessmentProfit.marginPercentage,
      config.profitMarginCritical,
      'decreasing'
    ));
  } else if (assessmentProfit.marginPercentage < config.profitMarginWarning) {
    alerts.push(createAlert(
      'profit_margin_low',
      'warning',
      'assessments',
      'Warning: Assessments Profit Margin Declining',
      `Assessments profit margin is ${assessmentProfit.marginPercentage.toFixed(1)}%, below target of ${config.profitMarginWarning}%`,
      assessmentProfit.marginPercentage,
      config.profitMarginWarning,
      'decreasing'
    ));
  }

  // Check client adoption rate - Assessments
  if (assessmentUsage.clientAdoptionRate < (100 - config.adoptionRateCritical)) {
    alerts.push(createAlert(
      'adoption_rate_declining',
      'critical',
      'assessments',
      'Critical: Assessments Adoption Rate Declining',
      `Client adoption rate has declined to ${assessmentUsage.clientAdoptionRate.toFixed(1)}%, a significant drop`,
      assessmentUsage.clientAdoptionRate,
      100 - config.adoptionRateCritical,
      'decreasing'
    ));
  } else if (assessmentUsage.clientAdoptionRate < (100 - config.adoptionRateWarning)) {
    alerts.push(createAlert(
      'adoption_rate_declining',
      'warning',
      'assessments',
      'Warning: Assessments Adoption Rate Needs Attention',
      `Client adoption rate is ${assessmentUsage.clientAdoptionRate.toFixed(1)}%, showing decline`,
      assessmentUsage.clientAdoptionRate,
      100 - config.adoptionRateWarning,
      'decreasing'
    ));
  }

  // Check revenue target - Assessments (mock target: $50,000/month)
  const assessmentRevenueTarget = 50000;
  const assessmentRevenuePercentage = (assessmentRevenue.totalRevenue / assessmentRevenueTarget) * 100;
  
  if (assessmentRevenuePercentage < config.revenueTargetCritical) {
    alerts.push(createAlert(
      'revenue_target_missed',
      'critical',
      'assessments',
      'Critical: Assessments Revenue Target Missed',
      `Revenue is only ${assessmentRevenuePercentage.toFixed(1)}% of target ($${assessmentRevenue.totalRevenue.toLocaleString()} vs $${assessmentRevenueTarget.toLocaleString()})`,
      assessmentRevenuePercentage,
      config.revenueTargetCritical,
      'decreasing'
    ));
  } else if (assessmentRevenuePercentage < config.revenueTargetWarning) {
    alerts.push(createAlert(
      'revenue_target_missed',
      'warning',
      'assessments',
      'Warning: Assessments Revenue Below Target',
      `Revenue is ${assessmentRevenuePercentage.toFixed(1)}% of monthly target`,
      assessmentRevenuePercentage,
      config.revenueTargetWarning,
      'stable'
    ));
  }

  // Monitor Background Checks
  const bgCheckRevenue = getBackgroundCheckRevenueMetrics();
  const bgCheckUsage = getBackgroundCheckUsageMetrics();
  const bgCheckProfit = getBackgroundCheckProfitability();

  // Check profit margin - Background Checks
  if (bgCheckProfit.marginPercentage < config.profitMarginCritical) {
    alerts.push(createAlert(
      'profit_margin_low',
      'critical',
      'background-checks',
      'Critical: Background Checks Profit Margin Too Low',
      `Background checks profit margin has dropped to ${bgCheckProfit.marginPercentage.toFixed(1)}%, below critical threshold`,
      bgCheckProfit.marginPercentage,
      config.profitMarginCritical,
      'decreasing'
    ));
  } else if (bgCheckProfit.marginPercentage < config.profitMarginWarning) {
    alerts.push(createAlert(
      'profit_margin_low',
      'warning',
      'background-checks',
      'Warning: Background Checks Profit Margin Declining',
      `Background checks profit margin is ${bgCheckProfit.marginPercentage.toFixed(1)}%, below target`,
      bgCheckProfit.marginPercentage,
      config.profitMarginWarning,
      'decreasing'
    ));
  }

  // Check client adoption rate - Background Checks
  if (bgCheckUsage.clientAdoptionRate < (100 - config.adoptionRateCritical)) {
    alerts.push(createAlert(
      'adoption_rate_declining',
      'critical',
      'background-checks',
      'Critical: Background Checks Adoption Rate Declining',
      `Client adoption rate has declined to ${bgCheckUsage.clientAdoptionRate.toFixed(1)}%`,
      bgCheckUsage.clientAdoptionRate,
      100 - config.adoptionRateCritical,
      'decreasing'
    ));
  } else if (bgCheckUsage.clientAdoptionRate < (100 - config.adoptionRateWarning)) {
    alerts.push(createAlert(
      'adoption_rate_declining',
      'warning',
      'background-checks',
      'Warning: Background Checks Adoption Rate Needs Attention',
      `Client adoption rate is ${bgCheckUsage.clientAdoptionRate.toFixed(1)}%`,
      bgCheckUsage.clientAdoptionRate,
      100 - config.adoptionRateWarning,
      'decreasing'
    ));
  }

  // Check revenue target - Background Checks (mock target: $40,000/month)
  const bgCheckRevenueTarget = 40000;
  const bgCheckRevenuePercentage = (bgCheckRevenue.totalRevenue / bgCheckRevenueTarget) * 100;
  
  if (bgCheckRevenuePercentage < config.revenueTargetCritical) {
    alerts.push(createAlert(
      'revenue_target_missed',
      'critical',
      'background-checks',
      'Critical: Background Checks Revenue Target Missed',
      `Revenue is only ${bgCheckRevenuePercentage.toFixed(1)}% of target ($${bgCheckRevenue.totalRevenue.toLocaleString()} vs $${bgCheckRevenueTarget.toLocaleString()})`,
      bgCheckRevenuePercentage,
      config.revenueTargetCritical,
      'decreasing'
    ));
  } else if (bgCheckRevenuePercentage < config.revenueTargetWarning) {
    alerts.push(createAlert(
      'revenue_target_missed',
      'warning',
      'background-checks',
      'Warning: Background Checks Revenue Below Target',
      `Revenue is ${bgCheckRevenuePercentage.toFixed(1)}% of monthly target`,
      bgCheckRevenuePercentage,
      config.revenueTargetWarning,
      'stable'
    ));
  }

  // Overall metrics
  const totalRevenue = assessmentRevenue.totalRevenue + bgCheckRevenue.totalRevenue;
  const totalProfit = assessmentProfit.netProfit + bgCheckProfit.netProfit;
  const overallMargin = (totalProfit / totalRevenue) * 100;

  if (overallMargin < config.profitMarginCritical) {
    alerts.push(createAlert(
      'profit_margin_low',
      'critical',
      'overall',
      'Critical: Overall Profit Margin Too Low',
      `Combined profit margin across all modules is ${overallMargin.toFixed(1)}%`,
      overallMargin,
      config.profitMarginCritical,
      'decreasing'
    ));
  }

  // Save new alerts (deduplicate based on type+module)
  const existingAlerts = getBusinessAlerts();
  const newAlerts = alerts.filter(alert => {
    return !existingAlerts.some(existing => 
      existing.type === alert.type && 
      existing.module === alert.module && 
      !existing.acknowledged &&
      new Date(existing.createdAt).getTime() > Date.now() - 24 * 60 * 60 * 1000 // Within 24 hours
    );
  });

  if (newAlerts.length > 0) {
    saveAlerts([...existingAlerts, ...newAlerts]);
  }

  return getBusinessAlerts();
}

export function acknowledgeAlert(alertId: string, userId: string): void {
  const alerts = getBusinessAlerts();
  const updated = alerts.map(alert => 
    alert.id === alertId 
      ? { ...alert, acknowledged: true, acknowledgedAt: new Date().toISOString(), acknowledgedBy: userId }
      : alert
  );
  saveAlerts(updated);
}

export function dismissAlert(alertId: string): void {
  const alerts = getBusinessAlerts();
  const filtered = alerts.filter(alert => alert.id !== alertId);
  saveAlerts(filtered);
}

export function getAlertStats(): BusinessAlertStats {
  const alerts = getBusinessAlerts();
  const unacknowledged = alerts.filter(a => !a.acknowledged);

  return {
    total: alerts.length,
    critical: alerts.filter(a => a.severity === 'critical').length,
    warning: alerts.filter(a => a.severity === 'warning').length,
    info: alerts.filter(a => a.severity === 'info').length,
    unacknowledged: unacknowledged.length,
    byModule: {
      assessments: alerts.filter(a => a.module === 'assessments').length,
      'background-checks': alerts.filter(a => a.module === 'background-checks').length,
      overall: alerts.filter(a => a.module === 'overall').length,
    },
  };
}

export function clearOldAlerts(daysOld: number = 30): void {
  const alerts = getBusinessAlerts();
  const cutoff = Date.now() - (daysOld * 24 * 60 * 60 * 1000);
  const filtered = alerts.filter(alert => 
    new Date(alert.createdAt).getTime() > cutoff
  );
  saveAlerts(filtered);
}
