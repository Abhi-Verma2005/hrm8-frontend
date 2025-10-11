import type { Employer, Job, Candidate, Consultant } from '@/types/entities';

export const mockEmployers: Employer[] = [
  {
    id: '1',
    name: 'TechCorp Solutions',
    logo: 'https://api.dicebear.com/7.x/initials/svg?seed=TechCorp',
    industry: 'Technology',
    location: 'San Francisco, CA',
    status: 'active',
    activeJobs: 12,
    lastContact: new Date('2024-01-15'),
    email: 'contact@techcorp.com'
  },
  {
    id: '2',
    name: 'Global Finance Group',
    industry: 'Finance',
    location: 'New York, NY',
    status: 'active',
    activeJobs: 8,
    lastContact: new Date('2024-01-10'),
    email: 'hr@globalfinance.com'
  },
  {
    id: '3',
    name: 'HealthPlus Medical',
    logo: 'https://api.dicebear.com/7.x/initials/svg?seed=HealthPlus',
    industry: 'Healthcare',
    location: 'Boston, MA',
    status: 'pending',
    activeJobs: 5,
    lastContact: new Date('2024-01-08'),
    email: 'careers@healthplus.com'
  },
  {
    id: '4',
    name: 'Retail Dynamics Inc',
    industry: 'Retail',
    location: 'Chicago, IL',
    status: 'active',
    activeJobs: 15,
    lastContact: new Date('2024-01-12'),
    email: 'jobs@retaildynamics.com'
  },
  {
    id: '5',
    name: 'EduTech Academy',
    logo: 'https://api.dicebear.com/7.x/initials/svg?seed=EduTech',
    industry: 'Education',
    location: 'Austin, TX',
    status: 'inactive',
    activeJobs: 0,
    lastContact: new Date('2023-12-20'),
    email: 'admin@edutech.com'
  },
  {
    id: '6',
    name: 'Manufacturing Pro',
    industry: 'Manufacturing',
    location: 'Detroit, MI',
    status: 'active',
    activeJobs: 10,
    lastContact: new Date('2024-01-14'),
    email: 'recruiting@mfgpro.com'
  },
  {
    id: '7',
    name: 'Creative Studios',
    logo: 'https://api.dicebear.com/7.x/initials/svg?seed=Creative',
    industry: 'Media',
    location: 'Los Angeles, CA',
    status: 'active',
    activeJobs: 6,
    lastContact: new Date('2024-01-11'),
    email: 'talent@creativestudios.com'
  },
  {
    id: '8',
    name: 'Construction Partners',
    industry: 'Construction',
    location: 'Houston, TX',
    status: 'pending',
    activeJobs: 4,
    lastContact: new Date('2024-01-09'),
    email: 'hr@constructionpartners.com'
  }
];

export const mockJobs: Job[] = [
  {
    id: '1',
    title: 'Senior Software Engineer',
    employer: 'TechCorp Solutions',
    employerLogo: 'https://api.dicebear.com/7.x/initials/svg?seed=TechCorp',
    location: 'San Francisco, CA',
    type: 'Full-time',
    salary: '$120,000 - $180,000',
    status: 'open',
    applicants: 45,
    postedDate: new Date('2024-01-10')
  },
  {
    id: '2',
    title: 'Financial Analyst',
    employer: 'Global Finance Group',
    location: 'New York, NY',
    type: 'Full-time',
    salary: '$80,000 - $110,000',
    status: 'open',
    applicants: 32,
    postedDate: new Date('2024-01-08')
  },
  {
    id: '3',
    title: 'Registered Nurse',
    employer: 'HealthPlus Medical',
    employerLogo: 'https://api.dicebear.com/7.x/initials/svg?seed=HealthPlus',
    location: 'Boston, MA',
    type: 'Full-time',
    salary: '$65,000 - $85,000',
    status: 'open',
    applicants: 28,
    postedDate: new Date('2024-01-12')
  },
  {
    id: '4',
    title: 'Store Manager',
    employer: 'Retail Dynamics Inc',
    location: 'Chicago, IL',
    type: 'Full-time',
    salary: '$50,000 - $65,000',
    status: 'open',
    applicants: 19,
    postedDate: new Date('2024-01-11')
  },
  {
    id: '5',
    title: 'Marketing Consultant',
    employer: 'Creative Studios',
    employerLogo: 'https://api.dicebear.com/7.x/initials/svg?seed=Creative',
    location: 'Los Angeles, CA',
    type: 'Contract',
    salary: '$95/hour',
    status: 'open',
    applicants: 15,
    postedDate: new Date('2024-01-09')
  },
  {
    id: '6',
    title: 'Product Designer',
    employer: 'TechCorp Solutions',
    employerLogo: 'https://api.dicebear.com/7.x/initials/svg?seed=TechCorp',
    location: 'San Francisco, CA',
    type: 'Full-time',
    salary: '$100,000 - $140,000',
    status: 'closed',
    applicants: 67,
    postedDate: new Date('2023-12-15')
  },
  {
    id: '7',
    title: 'Data Scientist',
    employer: 'TechCorp Solutions',
    employerLogo: 'https://api.dicebear.com/7.x/initials/svg?seed=TechCorp',
    location: 'Remote',
    type: 'Full-time',
    salary: '$130,000 - $170,000',
    status: 'draft',
    applicants: 0,
    postedDate: new Date('2024-01-14')
  },
  {
    id: '8',
    title: 'Project Manager',
    employer: 'Construction Partners',
    location: 'Houston, TX',
    type: 'Full-time',
    salary: '$85,000 - $115,000',
    status: 'open',
    applicants: 23,
    postedDate: new Date('2024-01-13')
  }
];

export const mockCandidates: Candidate[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    email: 'sarah.j@email.com',
    phone: '(555) 123-4567',
    position: 'Software Engineer',
    experience: '5 years',
    status: 'active',
    skills: ['React', 'TypeScript', 'Node.js', 'AWS', 'GraphQL'],
    appliedDate: new Date('2024-01-12')
  },
  {
    id: '2',
    name: 'Michael Chen',
    photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael',
    email: 'mchen@email.com',
    phone: '(555) 234-5678',
    position: 'Data Analyst',
    experience: '3 years',
    status: 'active',
    skills: ['Python', 'SQL', 'Tableau', 'Excel', 'PowerBI'],
    appliedDate: new Date('2024-01-11')
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    email: 'emily.r@email.com',
    phone: '(555) 345-6789',
    position: 'Marketing Manager',
    experience: '7 years',
    status: 'placed',
    skills: ['SEO', 'Content Strategy', 'Analytics', 'Social Media', 'Brand Management'],
    appliedDate: new Date('2024-01-05')
  },
  {
    id: '4',
    name: 'James Wilson',
    photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James',
    email: 'jwilson@email.com',
    phone: '(555) 456-7890',
    position: 'Product Designer',
    experience: '4 years',
    status: 'active',
    skills: ['Figma', 'UI/UX', 'Prototyping', 'Design Systems', 'User Research'],
    appliedDate: new Date('2024-01-13')
  },
  {
    id: '5',
    name: 'Lisa Anderson',
    photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa',
    email: 'lisa.a@email.com',
    phone: '(555) 567-8901',
    position: 'Financial Advisor',
    experience: '6 years',
    status: 'active',
    skills: ['Investment Strategy', 'Risk Management', 'Portfolio Analysis', 'Client Relations'],
    appliedDate: new Date('2024-01-10')
  },
  {
    id: '6',
    name: 'David Kim',
    email: 'dkim@email.com',
    phone: '(555) 678-9012',
    position: 'DevOps Engineer',
    experience: '5 years',
    status: 'inactive',
    skills: ['Docker', 'Kubernetes', 'CI/CD', 'Terraform', 'AWS'],
    appliedDate: new Date('2023-12-28')
  },
  {
    id: '7',
    name: 'Maria Garcia',
    photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria',
    email: 'maria.g@email.com',
    phone: '(555) 789-0123',
    position: 'HR Specialist',
    experience: '4 years',
    status: 'active',
    skills: ['Recruitment', 'Employee Relations', 'HRIS', 'Training', 'Compliance'],
    appliedDate: new Date('2024-01-14')
  },
  {
    id: '8',
    name: 'Robert Taylor',
    photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Robert',
    email: 'rtaylor@email.com',
    phone: '(555) 890-1234',
    position: 'Sales Executive',
    experience: '8 years',
    status: 'placed',
    skills: ['B2B Sales', 'Negotiation', 'CRM', 'Lead Generation', 'Account Management'],
    appliedDate: new Date('2024-01-06')
  }
];

export const mockConsultants: Consultant[] = [
  {
    id: '1',
    name: 'Dr. Amanda Stevens',
    photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Amanda',
    email: 'astevens@consulting.com',
    specialization: 'IT Strategy',
    availability: 'available',
    activeClients: 3,
    rating: 4.9,
    joinedDate: new Date('2022-03-15')
  },
  {
    id: '2',
    name: 'John Martinez',
    photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
    email: 'jmartinez@consulting.com',
    specialization: 'Financial Planning',
    availability: 'assigned',
    activeClients: 5,
    rating: 4.8,
    joinedDate: new Date('2021-07-22')
  },
  {
    id: '3',
    name: 'Patricia Lee',
    email: 'plee@consulting.com',
    specialization: 'HR Transformation',
    availability: 'available',
    activeClients: 2,
    rating: 4.7,
    joinedDate: new Date('2023-01-10')
  },
  {
    id: '4',
    name: 'Thomas Wright',
    photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Thomas',
    email: 'twright@consulting.com',
    specialization: 'Operations',
    availability: 'assigned',
    activeClients: 4,
    rating: 4.9,
    joinedDate: new Date('2020-11-05')
  },
  {
    id: '5',
    name: 'Jennifer Brown',
    photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jennifer',
    email: 'jbrown@consulting.com',
    specialization: 'Marketing',
    availability: 'available',
    activeClients: 1,
    rating: 4.6,
    joinedDate: new Date('2023-06-18')
  },
  {
    id: '6',
    name: 'Christopher Davis',
    email: 'cdavis@consulting.com',
    specialization: 'Legal Compliance',
    availability: 'unavailable',
    activeClients: 0,
    rating: 4.8,
    joinedDate: new Date('2022-09-30')
  },
  {
    id: '7',
    name: 'Michelle Thompson',
    photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michelle',
    email: 'mthompson@consulting.com',
    specialization: 'Change Management',
    availability: 'assigned',
    activeClients: 6,
    rating: 5.0,
    joinedDate: new Date('2021-02-14')
  },
  {
    id: '8',
    name: 'Daniel White',
    photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Daniel',
    email: 'dwhite@consulting.com',
    specialization: 'Risk Management',
    availability: 'available',
    activeClients: 2,
    rating: 4.7,
    joinedDate: new Date('2022-12-08')
  }
];
