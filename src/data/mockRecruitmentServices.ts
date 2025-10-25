import type { ServiceProject } from '@/types/recruitmentService';

export const mockServiceProjects: ServiceProject[] = [
  {
    id: 'service_1',
    name: 'Senior Software Engineer - TechCorp',
    serviceType: 'full-service',
    status: 'active',
    priority: 'high',
    stage: 'shortlisting',
    clientId: 'employer_1',
    clientName: 'TechCorp Solutions',
    consultants: [
      { id: 'consultant_1', name: 'John Smith', role: 'lead' },
      { id: 'consultant_2', name: 'Sarah Johnson', role: 'support' }
    ],
    progress: 45,
    targetPositions: 1,
    positionsFilled: 0,
    candidatesShortlisted: 1,
    candidatesInterviewed: 1,
    projectValue: 5990, // Full-service: $5,990 per vacancy
    currency: 'USD',
    startDate: '2025-01-15',
    deadline: '2025-03-31',
    description: 'Full-service recruitment for senior software engineering position',
    requirements: ['React', 'Node.js', '5+ years experience', 'Team lead experience'],
    tags: ['tech', 'software', 'senior'],
    createdAt: '2025-01-10T00:00:00Z',
    updatedAt: '2025-01-20T00:00:00Z'
  },
  {
    id: 'service_2',
    name: 'Executive Search - CFO Position',
    serviceType: 'executive-search',
    status: 'active',
    priority: 'high',
    stage: 'interviewing',
    clientId: 'employer_2',
    clientName: 'Finance Global Inc',
    consultants: [
      { id: 'consultant_3', name: 'Michael Chen', role: 'lead' }
    ],
    progress: 70,
    targetPositions: 1,
    positionsFilled: 0,
    candidatesShortlisted: 1,
    candidatesInterviewed: 1,
    projectValue: 14990, // Executive-search: $14,990 for CFO over $100K
    currency: 'USD',
    startDate: '2024-12-01',
    deadline: '2025-02-28',
    description: 'Executive search for Chief Financial Officer position',
    requirements: ['CPA', '15+ years finance leadership', 'Public company experience'],
    tags: ['executive', 'finance', 'c-level'],
    createdAt: '2024-11-25T00:00:00Z',
    updatedAt: '2025-01-18T00:00:00Z'
  },
  {
    id: 'service_3',
    name: 'Marketing Specialist - Shortlisting',
    serviceType: 'shortlisting',
    status: 'active',
    priority: 'medium',
    stage: 'shortlisting',
    clientId: 'employer_3',
    clientName: 'Retail Giant Co',
    consultants: [
      { id: 'consultant_4', name: 'Emily Davis', role: 'lead' }
    ],
    progress: 35,
    targetPositions: 1,
    positionsFilled: 0,
    candidatesShortlisted: 1,
    candidatesInterviewed: 0,
    projectValue: 1990, // Shortlisting: $1,990 per vacancy
    currency: 'USD',
    startDate: '2025-01-20',
    deadline: '2025-02-15',
    description: 'Shortlisting candidates for marketing specialist position',
    requirements: ['Digital marketing', 'Social media', 'Content creation'],
    tags: ['marketing', 'digital', 'mid-level'],
    createdAt: '2025-01-18T00:00:00Z',
    updatedAt: '2025-01-22T00:00:00Z'
  },
  {
    id: 'service_4',
    name: 'Healthcare Nurse Position - Shortlisting',
    serviceType: 'shortlisting',
    status: 'active',
    priority: 'high',
    stage: 'in-progress',
    clientId: 'employer_4',
    clientName: 'HealthCare Systems',
    consultants: [
      { id: 'consultant_1', name: 'John Smith', role: 'lead' },
      { id: 'consultant_5', name: 'David Wilson', role: 'support' },
      { id: 'consultant_6', name: 'Lisa Anderson', role: 'support' }
    ],
    progress: 55,
    targetPositions: 1,
    positionsFilled: 0,
    candidatesShortlisted: 1,
    candidatesInterviewed: 1,
    projectValue: 1990, // Shortlisting: $1,990 per vacancy
    currency: 'USD',
    startDate: '2024-10-01',
    deadline: '2025-12-31',
    description: 'Shortlisting candidates for healthcare nurse position',
    requirements: ['Registered Nurse', 'Healthcare experience', 'Patient care'],
    tags: ['shortlisting', 'healthcare', 'nursing'],
    createdAt: '2024-09-15T00:00:00Z',
    updatedAt: '2025-01-23T00:00:00Z'
  },
  {
    id: 'service_5',
    name: 'Sales Representative - Quick Hire',
    serviceType: 'shortlisting',
    status: 'active',
    priority: 'medium',
    stage: 'completed',
    clientId: 'employer_5',
    clientName: 'Sales Corp',
    consultants: [
      { id: 'consultant_2', name: 'Sarah Johnson', role: 'lead' }
    ],
    progress: 100,
    targetPositions: 1,
    positionsFilled: 1,
    candidatesShortlisted: 1,
    candidatesInterviewed: 1,
    projectValue: 1990, // Shortlisting: $1,990 per vacancy
    currency: 'USD',
    startDate: '2024-12-01',
    deadline: '2025-01-15',
    completedDate: '2025-01-12',
    description: 'Shortlisting for sales representative position',
    requirements: ['B2B sales', '2+ years experience', 'Strong communication'],
    tags: ['sales', 'b2b', 'completed'],
    createdAt: '2024-11-28T00:00:00Z',
    updatedAt: '2025-01-12T00:00:00Z'
  },
  {
    id: 'service_6',
    name: 'Data Scientist - Full Service',
    serviceType: 'full-service',
    status: 'active',
    priority: 'high',
    stage: 'interviewing',
    clientId: 'employer_1',
    clientName: 'TechCorp Solutions',
    consultants: [
      { id: 'consultant_3', name: 'Michael Chen', role: 'lead' },
      { id: 'consultant_4', name: 'Emily Davis', role: 'support' }
    ],
    progress: 60,
    targetPositions: 1,
    positionsFilled: 0,
    candidatesShortlisted: 1,
    candidatesInterviewed: 1,
    projectValue: 5990, // Full-service: $5,990 per vacancy
    currency: 'USD',
    startDate: '2025-01-05',
    deadline: '2025-03-15',
    description: 'Full-service recruitment for data scientist position',
    requirements: ['Python', 'Machine Learning', 'PhD preferred', 'Research experience'],
    tags: ['tech', 'data-science', 'senior'],
    createdAt: '2025-01-02T00:00:00Z',
    updatedAt: '2025-01-21T00:00:00Z'
  },
  {
    id: 'service_7',
    name: 'Legal Counsel - Executive Search',
    serviceType: 'executive-search',
    status: 'on-hold',
    priority: 'low',
    stage: 'initiated',
    clientId: 'employer_6',
    clientName: 'Legal Partners LLP',
    consultants: [
      { id: 'consultant_5', name: 'David Wilson', role: 'lead' }
    ],
    progress: 15,
    targetPositions: 1,
    positionsFilled: 0,
    candidatesShortlisted: 1,
    candidatesInterviewed: 0,
    projectValue: 14990, // Executive-search: $14,990 for General Counsel over $100K
    currency: 'USD',
    startDate: '2025-01-10',
    deadline: '2025-04-30',
    description: 'Executive search for general counsel position',
    requirements: ['JD required', '10+ years experience', 'Corporate law expertise'],
    tags: ['legal', 'executive', 'on-hold'],
    createdAt: '2025-01-08T00:00:00Z',
    updatedAt: '2025-01-19T00:00:00Z'
  },
  {
    id: 'service_8',
    name: 'Engineering Intern - Shortlisting',
    serviceType: 'shortlisting',
    status: 'completed',
    priority: 'low',
    stage: 'completed',
    clientId: 'employer_1',
    clientName: 'TechCorp Solutions',
    consultants: [
      { id: 'consultant_6', name: 'Lisa Anderson', role: 'lead' }
    ],
    progress: 100,
    targetPositions: 1,
    positionsFilled: 1,
    candidatesShortlisted: 1,
    candidatesInterviewed: 1,
    projectValue: 1990, // Shortlisting: $1,990 per vacancy
    currency: 'USD',
    startDate: '2024-11-01',
    deadline: '2024-12-20',
    completedDate: '2024-12-18',
    description: 'Shortlisting for engineering internship position',
    requirements: ['Computer Science students', 'GPA 3.5+', 'Programming skills'],
    tags: ['intern', 'tech', 'completed'],
    createdAt: '2024-10-25T00:00:00Z',
    updatedAt: '2024-12-18T00:00:00Z'
  }
];
