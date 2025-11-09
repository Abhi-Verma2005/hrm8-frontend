import { ActionItem } from '@/types/platformAdmin';

export function getActionItems(): ActionItem[] {
  return [
    {
      id: 'act-1',
      type: 'service',
      priority: 'critical',
      title: 'Urgent: RPO Service Approval Required',
      description: 'TechCorp Inc. awaiting service initiation approval',
      employerName: 'TechCorp Inc.',
      dueDate: '2024-01-15',
      link: '/recruitment-services/srv-001',
      createdAt: '2024-01-10T09:00:00Z',
    },
    {
      id: 'act-2',
      type: 'payment',
      priority: 'high',
      title: 'Payment Failed - Retry Required',
      description: 'GlobalTech Solutions subscription payment declined',
      employerName: 'GlobalTech Solutions',
      link: '/employers/emp-014',
      createdAt: '2024-01-12T14:30:00Z',
    },
    {
      id: 'act-3',
      type: 'ticket',
      priority: 'high',
      title: 'Critical Support Ticket',
      description: 'Integration failure reported by Enterprise Co.',
      employerName: 'Enterprise Co.',
      link: '/support-tickets/tkt-089',
      createdAt: '2024-01-13T08:15:00Z',
    },
    {
      id: 'act-4',
      type: 'approval',
      priority: 'medium',
      title: 'Enterprise Tier Upgrade Request',
      description: 'InnovateTech requesting upgrade to Enterprise plan',
      employerName: 'InnovateTech',
      link: '/employers/emp-032',
      createdAt: '2024-01-11T16:45:00Z',
    },
    {
      id: 'act-5',
      type: 'integration',
      priority: 'medium',
      title: 'API Key Renewal Required',
      description: 'Email integration expiring in 7 days',
      link: '/integrations',
      createdAt: '2024-01-09T10:00:00Z',
    },
  ];
}
