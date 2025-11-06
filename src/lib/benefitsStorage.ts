import type { BenefitPlan, BenefitEnrollment, BenefitsStats } from '@/types/benefits';

const PLANS_KEY = 'benefit_plans';
const ENROLLMENTS_KEY = 'benefit_enrollments';

export function getBenefitPlans(): BenefitPlan[] {
  const stored = localStorage.getItem(PLANS_KEY);
  return stored ? JSON.parse(stored) : [];
}

export function saveBenefitPlan(plan: Omit<BenefitPlan, 'id' | 'createdAt' | 'updatedAt'>): BenefitPlan {
  const plans = getBenefitPlans();
  const newPlan: BenefitPlan = {
    ...plan,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  plans.push(newPlan);
  localStorage.setItem(PLANS_KEY, JSON.stringify(plans));
  return newPlan;
}

export function getBenefitEnrollments(): BenefitEnrollment[] {
  const stored = localStorage.getItem(ENROLLMENTS_KEY);
  return stored ? JSON.parse(stored) : [];
}

export function saveBenefitEnrollment(enrollment: Omit<BenefitEnrollment, 'id' | 'enrolledAt' | 'updatedAt'>): BenefitEnrollment {
  const enrollments = getBenefitEnrollments();
  const newEnrollment: BenefitEnrollment = {
    ...enrollment,
    id: crypto.randomUUID(),
    enrolledAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  enrollments.push(newEnrollment);
  localStorage.setItem(ENROLLMENTS_KEY, JSON.stringify(enrollments));
  return newEnrollment;
}

export function updateBenefitEnrollment(id: string, updates: Partial<BenefitEnrollment>): BenefitEnrollment | null {
  const enrollments = getBenefitEnrollments();
  const index = enrollments.findIndex(e => e.id === id);
  if (index === -1) return null;
  
  enrollments[index] = {
    ...enrollments[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  localStorage.setItem(ENROLLMENTS_KEY, JSON.stringify(enrollments));
  return enrollments[index];
}

export function calculateBenefitsStats(): BenefitsStats {
  const plans = getBenefitPlans();
  const enrollments = getBenefitEnrollments();
  
  const totalPlans = plans.length;
  const totalEnrolled = enrollments.filter(e => e.status === 'enrolled').length;
  const employeeCost = enrollments.reduce((sum, e) => sum + e.employeeCost, 0);
  const employerCost = enrollments.reduce((sum, e) => sum + e.employerCost, 0);

  return {
    totalPlans,
    totalEnrolled,
    enrollmentRate: 0, // Would need employee count to calculate
    totalCost: employeeCost + employerCost,
    employeeCost,
    employerCost,
  };
}
