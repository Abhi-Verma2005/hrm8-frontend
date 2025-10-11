import type { Employer, Job, Candidate, Consultant } from '@/types/entities';

// Helper functions to generate varied data
const industries = ['Technology', 'Finance', 'Healthcare', 'Retail', 'Education', 'Manufacturing', 'Media', 'Construction', 'Consulting', 'Legal', 'Transportation', 'Energy', 'Pharmaceuticals', 'Real Estate', 'Telecommunications'];
const locations = ['San Francisco, CA', 'New York, NY', 'Boston, MA', 'Chicago, IL', 'Austin, TX', 'Detroit, MI', 'Los Angeles, CA', 'Houston, TX', 'Seattle, WA', 'Denver, CO', 'Miami, FL', 'Atlanta, GA', 'Phoenix, AZ', 'Portland, OR', 'Dallas, TX'];
const statuses: ('active' | 'inactive' | 'pending')[] = ['active', 'active', 'active', 'pending', 'inactive'];

const companyNames = [
  'TechCorp Solutions', 'Global Finance Group', 'HealthPlus Medical', 'Retail Dynamics Inc', 'EduTech Academy',
  'Manufacturing Pro', 'Creative Studios', 'Construction Partners', 'Digital Innovations', 'Smart Systems LLC',
  'Enterprise Solutions', 'NextGen Technologies', 'Prime Healthcare', 'Metro Retail Group', 'Advanced Manufacturing',
  'Media Network Inc', 'BuildRight Construction', 'Quantum Computing Co', 'FinTech Ventures', 'MedLife Corporation',
  'Urban Retail Chain', 'Learning Solutions', 'Industrial Works', 'Content Creators Hub', 'Skyline Builders',
  'Cloud Services Inc', 'Investment Partners', 'Care Plus Hospitals', 'Fashion Retail Co', 'STEM Education Group',
  'Precision Manufacturing', 'Entertainment Media', 'Infrastructure Projects', 'AI Research Labs', 'Capital Management',
  'Wellness Centers', 'Luxury Retail', 'Online Education Platform', 'Automotive Parts Inc', 'Broadcast Media Group',
  'Green Energy Solutions', 'Wealth Advisors', 'Diagnostic Centers', 'E-Commerce Ventures', 'Tech Academy',
  'Assembly Line Systems', 'Production Studios', 'Urban Development', 'Data Analytics Corp', 'Asset Management',
  'Specialized Care', 'Marketplace Solutions', 'Virtual Learning', 'Component Manufacturing', 'Digital Media House',
  'Residential Construction', 'Innovation Labs', 'Private Equity Group', 'Medical Diagnostics', 'Retail Technology'
];

export const mockEmployers: Employer[] = Array.from({ length: 60 }, (_, i) => ({
  id: `${i + 1}`,
  name: companyNames[i],
  logo: i % 3 === 0 ? `https://api.dicebear.com/7.x/initials/svg?seed=${companyNames[i]}` : undefined,
  industry: industries[i % industries.length],
  location: locations[i % locations.length],
  status: statuses[i % statuses.length],
  activeJobs: Math.floor(Math.random() * 20),
  lastContact: new Date(2024, 0, Math.floor(Math.random() * 15) + 1),
  email: `contact@${companyNames[i].toLowerCase().replace(/\s+/g, '')}.com`
}));

const jobTitles = [
  'Senior Software Engineer', 'Financial Analyst', 'Registered Nurse', 'Store Manager', 'Marketing Consultant',
  'Product Designer', 'Data Scientist', 'Project Manager', 'DevOps Engineer', 'Business Analyst',
  'Account Executive', 'UX Researcher', 'Network Administrator', 'Content Strategist', 'Operations Manager',
  'Sales Representative', 'HR Specialist', 'Quality Assurance Engineer', 'Graphic Designer', 'Systems Analyst',
  'Customer Success Manager', 'Full Stack Developer', 'Compliance Officer', 'Brand Manager', 'Supply Chain Analyst',
  'Technical Writer', 'Product Manager', 'Security Analyst', 'Creative Director', 'Finance Manager',
  'Clinical Coordinator', 'Regional Manager', 'Digital Marketing Specialist', 'Backend Developer', 'Risk Analyst',
  'UI Designer', 'Machine Learning Engineer', 'Construction Manager', 'Frontend Developer', 'Investment Analyst',
  'Nurse Practitioner', 'District Manager', 'SEO Specialist', 'Cloud Architect', 'Treasury Analyst',
  'Medical Assistant', 'Retail Supervisor', 'Content Manager', 'Site Reliability Engineer', 'Portfolio Manager',
  'Physical Therapist', 'Assistant Store Manager', 'Social Media Manager', 'Mobile Developer', 'Credit Analyst',
  'Healthcare Administrator', 'Sales Manager', 'Email Marketing Specialist', 'Platform Engineer', 'Financial Planner'
];

const jobTypes: ('Full-time' | 'Part-time' | 'Contract')[] = ['Full-time', 'Full-time', 'Full-time', 'Part-time', 'Contract'];
const jobStatuses: ('open' | 'closed' | 'draft')[] = ['open', 'open', 'open', 'closed', 'draft'];

export const mockJobs: Job[] = Array.from({ length: 60 }, (_, i) => {
  const employer = companyNames[i % companyNames.length];
  return {
    id: `${i + 1}`,
    title: jobTitles[i % jobTitles.length],
    employer: employer,
    employerLogo: i % 4 === 0 ? `https://api.dicebear.com/7.x/initials/svg?seed=${employer}` : undefined,
    location: i % 5 === 0 ? 'Remote' : locations[i % locations.length],
    type: jobTypes[i % jobTypes.length],
    salary: `$${50 + (i % 15) * 10},000 - $${80 + (i % 20) * 10},000`,
    status: jobStatuses[i % jobStatuses.length],
    applicants: Math.floor(Math.random() * 100),
    postedDate: new Date(2024, 0, Math.floor(Math.random() * 15) + 1)
  };
});

const firstNames = ['Sarah', 'Michael', 'Emily', 'James', 'Lisa', 'David', 'Maria', 'Robert', 'Jennifer', 'William', 'Patricia', 'Richard', 'Linda', 'Thomas', 'Elizabeth', 'Charles', 'Susan', 'Christopher', 'Jessica', 'Daniel', 'Karen', 'Matthew', 'Nancy', 'Anthony', 'Betty', 'Mark', 'Margaret', 'Donald', 'Sandra', 'Steven', 'Ashley', 'Paul', 'Kimberly', 'Andrew', 'Emily', 'Joshua', 'Donna', 'Kenneth', 'Michelle', 'Kevin', 'Carol', 'Brian', 'Amanda', 'George', 'Dorothy', 'Timothy', 'Melissa', 'Ronald', 'Deborah', 'Edward', 'Stephanie', 'Jason', 'Rebecca', 'Jeffrey', 'Sharon', 'Ryan', 'Laura', 'Jacob', 'Cynthia', 'Gary'];
const lastNames = ['Johnson', 'Chen', 'Rodriguez', 'Wilson', 'Anderson', 'Kim', 'Garcia', 'Taylor', 'Martinez', 'Brown', 'Lee', 'Davis', 'Miller', 'Moore', 'Jackson', 'Martin', 'Thompson', 'White', 'Lopez', 'Harris', 'Clark', 'Lewis', 'Robinson', 'Walker', 'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores', 'Green', 'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell', 'Mitchell', 'Carter', 'Roberts', 'Gomez', 'Phillips', 'Evans', 'Turner', 'Diaz', 'Parker', 'Cruz', 'Edwards', 'Collins', 'Reyes', 'Stewart', 'Morris', 'Morales', 'Murphy', 'Cook', 'Rogers', 'Morgan'];

const positions = ['Software Engineer', 'Data Analyst', 'Marketing Manager', 'Product Designer', 'Financial Advisor', 'DevOps Engineer', 'HR Specialist', 'Sales Executive', 'Account Manager', 'Business Analyst', 'Content Writer', 'UX Designer', 'Network Engineer', 'Project Coordinator', 'Operations Analyst', 'Customer Support', 'Brand Strategist', 'Quality Engineer', 'Creative Director', 'Systems Administrator'];

const skillSets = [
  ['React', 'TypeScript', 'Node.js', 'AWS', 'GraphQL'],
  ['Python', 'SQL', 'Tableau', 'Excel', 'PowerBI'],
  ['SEO', 'Content Strategy', 'Analytics', 'Social Media', 'Brand Management'],
  ['Figma', 'UI/UX', 'Prototyping', 'Design Systems', 'User Research'],
  ['Investment Strategy', 'Risk Management', 'Portfolio Analysis', 'Client Relations'],
  ['Docker', 'Kubernetes', 'CI/CD', 'Terraform', 'AWS'],
  ['Recruitment', 'Employee Relations', 'HRIS', 'Training', 'Compliance'],
  ['B2B Sales', 'Negotiation', 'CRM', 'Lead Generation', 'Account Management'],
  ['Project Management', 'Agile', 'Scrum', 'JIRA', 'Stakeholder Management'],
  ['JavaScript', 'Vue.js', 'Angular', 'REST APIs', 'MongoDB']
];

const candidateStatuses: ('active' | 'placed' | 'inactive')[] = ['active', 'active', 'active', 'placed', 'inactive'];

export const mockCandidates: Candidate[] = Array.from({ length: 60 }, (_, i) => ({
  id: `${i + 1}`,
  name: `${firstNames[i % firstNames.length]} ${lastNames[i % lastNames.length]}`,
  photo: i % 3 === 0 ? `https://api.dicebear.com/7.x/avataaars/svg?seed=${firstNames[i % firstNames.length]}${i}` : undefined,
  email: `${firstNames[i % firstNames.length].toLowerCase()}.${lastNames[i % lastNames.length].toLowerCase()}@email.com`,
  phone: `(555) ${100 + i}-${1000 + i}`,
  position: positions[i % positions.length],
  experience: `${1 + (i % 15)} years`,
  status: candidateStatuses[i % candidateStatuses.length],
  skills: skillSets[i % skillSets.length],
  appliedDate: new Date(2024, 0, Math.floor(Math.random() * 15) + 1)
}));

const specializations = ['IT Strategy', 'Financial Planning', 'HR Transformation', 'Operations', 'Marketing', 'Legal Compliance', 'Change Management', 'Risk Management', 'Supply Chain', 'Digital Transformation', 'Cybersecurity', 'M&A Advisory', 'Organizational Design', 'Process Optimization', 'Data Analytics', 'Customer Experience', 'Product Strategy', 'Business Development', 'Sustainability', 'Innovation'];

const availability: ('available' | 'assigned' | 'unavailable')[] = ['available', 'available', 'assigned', 'unavailable'];

export const mockConsultants: Consultant[] = Array.from({ length: 60 }, (_, i) => ({
  id: `${i + 1}`,
  name: `${i % 10 < 3 ? 'Dr. ' : ''}${firstNames[i % firstNames.length]} ${lastNames[i % lastNames.length]}`,
  photo: i % 2 === 0 ? `https://api.dicebear.com/7.x/avataaars/svg?seed=${firstNames[i % firstNames.length]}${lastNames[i % lastNames.length]}` : undefined,
  email: `${firstNames[i % firstNames.length].toLowerCase()}.${lastNames[i % lastNames.length].toLowerCase()}@consulting.com`,
  specialization: specializations[i % specializations.length],
  availability: availability[i % availability.length],
  activeClients: Math.floor(Math.random() * 7),
  rating: 4.5 + Math.random() * 0.5,
  joinedDate: new Date(2020 + (i % 5), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1)
}));
