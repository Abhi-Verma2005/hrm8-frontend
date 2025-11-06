import { 
  OnboardingWorkflow, 
  OnboardingTask, 
  OnboardingDocument, 
  OnboardingNotification,
  OnboardingTemplate,
  OnboardingStats
} from "@/types/onboarding";
import { 
  mockOnboardingWorkflows, 
  mockOnboardingTasks, 
  mockOnboardingDocuments,
  mockOnboardingNotifications,
  mockOnboardingTemplates
} from "@/data/mockOnboardingData";

const STORAGE_KEYS = {
  WORKFLOWS: 'onboarding_workflows',
  TASKS: 'onboarding_tasks',
  DOCUMENTS: 'onboarding_documents',
  NOTIFICATIONS: 'onboarding_notifications',
  TEMPLATES: 'onboarding_templates',
};

// Workflows
export function getOnboardingWorkflows(): OnboardingWorkflow[] {
  const stored = localStorage.getItem(STORAGE_KEYS.WORKFLOWS);
  return stored ? JSON.parse(stored) : mockOnboardingWorkflows;
}

export function getOnboardingWorkflowById(id: string): OnboardingWorkflow | undefined {
  return getOnboardingWorkflows().find(w => w.id === id);
}

export function saveOnboardingWorkflow(workflow: OnboardingWorkflow): void {
  const workflows = getOnboardingWorkflows();
  const index = workflows.findIndex(w => w.id === workflow.id);
  
  if (index >= 0) {
    workflows[index] = { ...workflow, updatedAt: new Date().toISOString() };
  } else {
    workflows.push({ ...workflow, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
  }
  
  localStorage.setItem(STORAGE_KEYS.WORKFLOWS, JSON.stringify(workflows));
}

export function deleteOnboardingWorkflow(id: string): void {
  const workflows = getOnboardingWorkflows().filter(w => w.id !== id);
  localStorage.setItem(STORAGE_KEYS.WORKFLOWS, JSON.stringify(workflows));
  
  // Also delete related tasks, documents, and notifications
  const tasks = getOnboardingTasks(id);
  tasks.forEach(task => deleteOnboardingTask(task.id));
  
  const documents = getOnboardingDocuments(id);
  documents.forEach(doc => deleteOnboardingDocument(doc.id));
}

// Tasks
export function getOnboardingTasks(workflowId: string): OnboardingTask[] {
  const stored = localStorage.getItem(STORAGE_KEYS.TASKS);
  const allTasks = stored ? JSON.parse(stored) : mockOnboardingTasks;
  return allTasks.filter((t: OnboardingTask) => t.workflowId === workflowId);
}

export function getAllOnboardingTasks(): OnboardingTask[] {
  const stored = localStorage.getItem(STORAGE_KEYS.TASKS);
  return stored ? JSON.parse(stored) : mockOnboardingTasks;
}

export function getOnboardingTaskById(id: string): OnboardingTask | undefined {
  return getAllOnboardingTasks().find(t => t.id === id);
}

export function saveOnboardingTask(task: OnboardingTask): void {
  const tasks = getAllOnboardingTasks();
  const index = tasks.findIndex(t => t.id === task.id);
  
  if (index >= 0) {
    tasks[index] = { ...task, updatedAt: new Date().toISOString() };
  } else {
    tasks.push({ ...task, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
  }
  
  localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
  
  // Update workflow progress
  updateWorkflowProgress(task.workflowId);
}

export function deleteOnboardingTask(id: string): void {
  const tasks = getAllOnboardingTasks().filter(t => t.id !== id);
  localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
}

// Documents
export function getOnboardingDocuments(workflowId: string): OnboardingDocument[] {
  const stored = localStorage.getItem(STORAGE_KEYS.DOCUMENTS);
  const allDocuments = stored ? JSON.parse(stored) : mockOnboardingDocuments;
  return allDocuments.filter((d: OnboardingDocument) => d.workflowId === workflowId);
}

export function getAllOnboardingDocuments(): OnboardingDocument[] {
  const stored = localStorage.getItem(STORAGE_KEYS.DOCUMENTS);
  return stored ? JSON.parse(stored) : mockOnboardingDocuments;
}

export function getOnboardingDocumentById(id: string): OnboardingDocument | undefined {
  return getAllOnboardingDocuments().find(d => d.id === id);
}

export function saveOnboardingDocument(document: OnboardingDocument): void {
  const documents = getAllOnboardingDocuments();
  const index = documents.findIndex(d => d.id === document.id);
  
  if (index >= 0) {
    documents[index] = { ...document, updatedAt: new Date().toISOString() };
  } else {
    documents.push({ ...document, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
  }
  
  localStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(documents));
  
  // Update workflow progress
  updateWorkflowProgress(document.workflowId);
}

export function deleteOnboardingDocument(id: string): void {
  const documents = getAllOnboardingDocuments().filter(d => d.id !== id);
  localStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(documents));
}

// Notifications
export function getOnboardingNotifications(workflowId: string): OnboardingNotification[] {
  const stored = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
  const allNotifications = stored ? JSON.parse(stored) : mockOnboardingNotifications;
  return allNotifications.filter((n: OnboardingNotification) => n.workflowId === workflowId);
}

export function saveOnboardingNotification(notification: OnboardingNotification): void {
  const stored = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
  const notifications = stored ? JSON.parse(stored) : mockOnboardingNotifications;
  notifications.push(notification);
  localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
}

// Templates
export function getOnboardingTemplates(): OnboardingTemplate[] {
  const stored = localStorage.getItem(STORAGE_KEYS.TEMPLATES);
  return stored ? JSON.parse(stored) : mockOnboardingTemplates;
}

export function getOnboardingTemplateById(id: string): OnboardingTemplate | undefined {
  return getOnboardingTemplates().find(t => t.id === id);
}

export function saveOnboardingTemplate(template: OnboardingTemplate): void {
  const templates = getOnboardingTemplates();
  const index = templates.findIndex(t => t.id === template.id);
  
  if (index >= 0) {
    templates[index] = { ...template, updatedAt: new Date().toISOString() };
  } else {
    templates.push({ ...template, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
  }
  
  localStorage.setItem(STORAGE_KEYS.TEMPLATES, JSON.stringify(templates));
}

export function deleteOnboardingTemplate(id: string): void {
  const templates = getOnboardingTemplates().filter(t => t.id !== id);
  localStorage.setItem(STORAGE_KEYS.TEMPLATES, JSON.stringify(templates));
}

// Helper functions
function updateWorkflowProgress(workflowId: string): void {
  const workflow = getOnboardingWorkflowById(workflowId);
  if (!workflow) return;
  
  const tasks = getOnboardingTasks(workflowId);
  const documents = getOnboardingDocuments(workflowId);
  
  const totalItems = tasks.length + documents.length;
  if (totalItems === 0) return;
  
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const completedDocuments = documents.filter(d => d.status === 'approved' || (d.required === false && d.status !== 'pending')).length;
  
  const progress = Math.round(((completedTasks + completedDocuments) / totalItems) * 100);
  
  let status = workflow.status;
  if (progress === 0) status = 'not-started';
  else if (progress === 100) status = 'completed';
  else if (new Date(workflow.dueDate) < new Date() && progress < 100) status = 'overdue';
  else status = 'in-progress';
  
  saveOnboardingWorkflow({
    ...workflow,
    progress,
    status,
    completedDate: progress === 100 ? new Date().toISOString() : undefined,
  });
}

export function getOnboardingStats(): OnboardingStats {
  const workflows = getOnboardingWorkflows();
  const tasks = getAllOnboardingTasks();
  const documents = getAllOnboardingDocuments();
  
  const completedWorkflows = workflows.filter(w => w.status === 'completed');
  const completionTimes = completedWorkflows
    .filter(w => w.completedDate)
    .map(w => {
      const start = new Date(w.startDate).getTime();
      const end = new Date(w.completedDate!).getTime();
      return (end - start) / (1000 * 60 * 60 * 24); // days
    });
  
  const avgCompletionTime = completionTimes.length > 0
    ? Math.round(completionTimes.reduce((a, b) => a + b, 0) / completionTimes.length)
    : 0;
  
  const avgProgress = workflows.length > 0
    ? Math.round(workflows.reduce((sum, w) => sum + w.progress, 0) / workflows.length)
    : 0;
  
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const taskCompletionRate = tasks.length > 0
    ? Math.round((completedTasks / tasks.length) * 100)
    : 0;
  
  const approvedDocuments = documents.filter(d => d.status === 'approved').length;
  const documentCompletionRate = documents.length > 0
    ? Math.round((approvedDocuments / documents.length) * 100)
    : 0;
  
  return {
    total: workflows.length,
    notStarted: workflows.filter(w => w.status === 'not-started').length,
    inProgress: workflows.filter(w => w.status === 'in-progress').length,
    completed: workflows.filter(w => w.status === 'completed').length,
    overdue: workflows.filter(w => w.status === 'overdue').length,
    avgCompletionTime,
    avgProgress,
    taskCompletionRate,
    documentCompletionRate,
  };
}

export function createWorkflowFromTemplate(
  templateId: string,
  employeeData: {
    employeeId: string;
    employeeName: string;
    employeeEmail: string;
    jobTitle: string;
    department: string;
    startDate: string;
    assignedTo: string;
    assignedToName: string;
  }
): string {
  const template = getOnboardingTemplateById(templateId);
  if (!template) throw new Error('Template not found');
  
  const workflowId = `workflow-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  const dueDate = new Date(employeeData.startDate);
  dueDate.setDate(dueDate.getDate() + template.duration);
  
  const workflow: OnboardingWorkflow = {
    id: workflowId,
    ...employeeData,
    status: 'not-started',
    progress: 0,
    dueDate: dueDate.toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: 'current-user', // Replace with actual user
  };
  
  saveOnboardingWorkflow(workflow);
  
  // Create tasks from template
  template.tasks.forEach((taskTemplate, index) => {
    const taskDueDate = new Date(employeeData.startDate);
    taskDueDate.setDate(taskDueDate.getDate() + (index + 1) * 2); // Spread tasks over time
    
    const task: OnboardingTask = {
      id: `task-${Date.now()}-${index}-${Math.random().toString(36).substr(2, 9)}`,
      workflowId,
      ...taskTemplate,
      assignedTo: employeeData.assignedTo,
      assignedToName: employeeData.assignedToName,
      status: 'pending',
      dueDate: taskDueDate.toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    saveOnboardingTask(task);
  });
  
  // Create documents from template
  template.documents.forEach((docTemplate, index) => {
    const document: OnboardingDocument = {
      id: `doc-${Date.now()}-${index}-${Math.random().toString(36).substr(2, 9)}`,
      workflowId,
      ...docTemplate,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    saveOnboardingDocument(document);
  });
  
  return workflowId;
}
