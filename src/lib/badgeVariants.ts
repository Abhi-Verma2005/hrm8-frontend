import { BadgeProps } from "@/components/ui/badge";

// Status-based badge variants
export const getStatusBadgeVariant = (status: string): BadgeProps['variant'] => {
  const statusMap: Record<string, BadgeProps['variant']> = {
    // Positive states (Green)
    'Active': 'success',
    'Open': 'success',
    'Available': 'success',
    'approved': 'success',
    'completed': 'success',
    'placed': 'success',
    
    // Warning/Pending states (Yellow/Orange)
    'pending': 'warning',
    'draft': 'warning',
    'In Progress': 'warning',
    'review': 'warning',
    
    // Negative/Inactive states (Red/Gray)
    'Inactive': 'outline',
    'Closed': 'outline',
    'unavailable': 'destructive',
    'rejected': 'destructive',
    'cancelled': 'destructive',
    
    // Assigned/Busy states (Blue)
    'Assigned': 'info',
    'Busy': 'info',
  };
  
  return statusMap[status] || 'outline';
};

// Industry/Category badge variants (Visual variety)
export const getIndustryBadgeVariant = (industry: string): BadgeProps['variant'] => {
  const industryMap: Record<string, BadgeProps['variant']> = {
    'Technology': 'info',
    'Finance': 'teal',
    'Healthcare': 'success',
    'Retail': 'purple',
    'Education': 'indigo',
    'Manufacturing': 'neutral',
    'Media': 'pink',
    'Construction': 'amber',
    'Consulting': 'info',
    'Legal': 'indigo',
  };
  
  return industryMap[industry] || 'neutral';
};

// Job type badge variants
export const getJobTypeBadgeVariant = (type: string): BadgeProps['variant'] => {
  const typeMap: Record<string, BadgeProps['variant']> = {
    'Full-time': 'info',
    'Part-time': 'purple',
    'Contract': 'amber',
    'Temporary': 'teal',
    'Internship': 'pink',
  };
  
  return typeMap[type] || 'neutral';
};

// Specialization badge variants
export const getSpecializationBadgeVariant = (spec: string): BadgeProps['variant'] => {
  const specMap: Record<string, BadgeProps['variant']> = {
    'IT': 'info',
    'Finance': 'teal',
    'HR': 'purple',
    'Operations': 'amber',
    'Marketing': 'pink',
    'Legal': 'indigo',
    'Change Management': 'info',
    'Risk': 'destructive',
  };
  
  return specMap[spec] || 'neutral';
};

// Skill badge variants (consistent color per skill)
const skillColors: BadgeProps['variant'][] = ['info', 'purple', 'teal', 'indigo', 'pink', 'amber'];

export const getSkillBadgeVariant = (skill: string, index: number): BadgeProps['variant'] => {
  // Use skill string hash for consistent color per skill
  const hash = skill.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return skillColors[hash % skillColors.length];
};
