import { OnboardingWorkflow } from "@/types/onboarding";
import { scheduleEmail, getScheduledEmails } from "./scheduledEmails";
import { getAllTemplates } from "./emailTemplates";

export interface AutomationRule {
  id: string;
  name: string;
  enabled: boolean;
  daysBeforeStart: number;
  emailTemplateId: string;
  targetStatuses: string[];
  createdAt: Date;
}

const STORAGE_KEY = "automation_rules";

export function getAutomationRules(): AutomationRule[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return getDefaultRules();
    const rules = JSON.parse(saved);
    return rules.map((rule: any) => ({
      ...rule,
      createdAt: new Date(rule.createdAt),
    }));
  } catch (error) {
    console.error("Error loading automation rules:", error);
    return getDefaultRules();
  }
}

function getDefaultRules(): AutomationRule[] {
  return [
    {
      id: "default-welcome",
      name: "Welcome Email (7 days before)",
      enabled: true,
      daysBeforeStart: 7,
      emailTemplateId: "welcome",
      targetStatuses: ["not-started", "in-progress"],
      createdAt: new Date(),
    },
    {
      id: "default-reminder",
      name: "Onboarding Reminder (3 days before)",
      enabled: true,
      daysBeforeStart: 3,
      emailTemplateId: "reminder",
      targetStatuses: ["not-started", "in-progress"],
      createdAt: new Date(),
    },
  ];
}

export function saveAutomationRule(rule: Omit<AutomationRule, "id" | "createdAt">): AutomationRule {
  const rules = getAutomationRules();
  const newRule: AutomationRule = {
    ...rule,
    id: `rule-${Date.now()}`,
    createdAt: new Date(),
  };
  
  const updatedRules = [...rules, newRule];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedRules));
  
  return newRule;
}

export function updateAutomationRule(id: string, updates: Partial<AutomationRule>): void {
  const rules = getAutomationRules();
  const updatedRules = rules.map(rule => 
    rule.id === id ? { ...rule, ...updates } : rule
  );
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedRules));
}

export function deleteAutomationRule(id: string): void {
  const rules = getAutomationRules();
  const updatedRules = rules.filter(rule => rule.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedRules));
}

export function processAutomations(workflows: OnboardingWorkflow[]): {
  created: number;
  skipped: number;
  errors: string[];
} {
  const rules = getAutomationRules().filter(r => r.enabled);
  const scheduledEmails = getScheduledEmails();
  const templates = getAllTemplates();
  
  let created = 0;
  let skipped = 0;
  const errors: string[] = [];
  
  workflows.forEach(workflow => {
    // Parse start date
    const startDate = new Date(workflow.startDate);
    if (isNaN(startDate.getTime())) {
      errors.push(`Invalid start date for ${workflow.employeeName}`);
      return;
    }
    
    rules.forEach(rule => {
      // Check if workflow status matches target statuses
      if (!rule.targetStatuses.includes(workflow.status)) {
        return;
      }
      
      // Calculate scheduled date
      const scheduledDate = new Date(startDate);
      scheduledDate.setDate(scheduledDate.getDate() - rule.daysBeforeStart);
      scheduledDate.setHours(9, 0, 0, 0); // Default to 9 AM
      
      // Skip if scheduled date is in the past
      if (scheduledDate <= new Date()) {
        skipped++;
        return;
      }
      
      // Check if email already scheduled for this workflow with similar timing
      const alreadyScheduled = scheduledEmails.some(email => {
        const sameWorkflow = email.recipientIds.includes(workflow.id);
        const sameDay = new Date(email.scheduledFor).toDateString() === scheduledDate.toDateString();
        const sameTemplate = email.emailType === rule.emailTemplateId;
        return sameWorkflow && sameDay && sameTemplate && email.status === 'pending';
      });
      
      if (alreadyScheduled) {
        skipped++;
        return;
      }
      
      // Get template message
      const template = templates.find(t => t.id === rule.emailTemplateId);
      if (!template) {
        errors.push(`Template not found: ${rule.emailTemplateId}`);
        return;
      }
      
      // Create scheduled email
      try {
        scheduleEmail(
          rule.emailTemplateId,
          template.message,
          [workflow.id],
          scheduledDate
        );
        created++;
      } catch (error) {
        errors.push(`Failed to schedule for ${workflow.employeeName}: ${error}`);
      }
    });
  });
  
  return { created, skipped, errors };
}
