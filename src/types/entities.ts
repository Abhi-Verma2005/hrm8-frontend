export interface Department {
  id: string;
  name: string;
  description?: string;
  headOfDepartment?: string;
  costCenter?: string;
  createdAt: Date;
}

export interface Location {
  id: string;
  name: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state?: string;
  postalCode?: string;
  country: string;
  isPrimary?: boolean;
  capacity?: number;
  createdAt: Date;
}

export interface Employer {
  id: string;
  name: string;
  logo?: string;
  industry: string;
  location: string;
  status: 'active' | 'inactive' | 'pending';
  activeJobs: number;
  lastContact: Date;
  email?: string;
  departments?: Department[];
  locations?: Location[];
}

export interface Job {
  id: string;
  title: string;
  employer: string;
  employerLogo?: string;
  location: string;
  type: 'Full-time' | 'Part-time' | 'Contract';
  salary: string;
  status: 'open' | 'closed' | 'draft';
  applicants: number;
  unreadApplicants?: number;
  postedDate: Date;
}

export interface Candidate {
  id: string;
  name: string;
  photo?: string;
  email: string;
  phone: string;
  position: string;
  experience: string;
  status: 'active' | 'placed' | 'inactive';
  skills: string[];
  appliedDate: Date;
}

export interface Consultant {
  id: string;
  name: string;
  photo?: string;
  email: string;
  specialization: string;
  availability: 'available' | 'assigned' | 'unavailable';
  activeClients: number;
  rating: number;
  joinedDate: Date;
}
