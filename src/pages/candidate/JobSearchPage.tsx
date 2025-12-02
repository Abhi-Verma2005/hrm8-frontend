/**
 * Candidate Job Search Page
 * Comprehensive job search with advanced filtering
 */

import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { jobService, PublicJob, JobFilterOptions } from '@/lib/jobService';
import { CandidatePageLayout } from '@/components/layouts/CandidatePageLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import {
  MapPin,
  Briefcase,
  Clock,
  DollarSign,
  Building2,
  Search,
  Loader2,
  Filter,
  X,
  TrendingUp,
  SlidersHorizontal,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';

export default function JobSearchPage() {
  const [jobs, setJobs] = useState<PublicJob[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterOptions, setFilterOptions] = useState<JobFilterOptions>({
    categories: [],
    departments: [],
    locations: [],
  });
  const [totalJobs, setTotalJobs] = useState(0);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Search and filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');
  const [employmentType, setEmploymentType] = useState('');
  const [workArrangement, setWorkArrangement] = useState('');
  const [category, setCategory] = useState('');
  const [department, setDepartment] = useState('');
  const [salaryMin, setSalaryMin] = useState('');
  const [salaryMax, setSalaryMax] = useState('');
  const [featuredOnly, setFeaturedOnly] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    loadFilterOptions();
    loadJobs();
  }, []);

  useEffect(() => {
    // Debounce search - reload jobs when filters change
    const timer = setTimeout(() => {
      loadJobs();
    }, 300);

    return () => clearTimeout(timer);
  }, [location, employmentType, workArrangement, category, department, salaryMin, salaryMax, featuredOnly]);

  const loadFilterOptions = async () => {
    try {
      const response = await jobService.getFilterOptions();
      setFilterOptions(response.data || { categories: [], departments: [], locations: [] });
    } catch (error) {
      console.error('Failed to load filter options:', error);
    }
  };

  const loadJobs = async () => {
    setIsLoading(true);
    try {
      const response = await jobService.getPublicJobs({
        search: searchQuery || undefined,
        location: location || undefined,
        employmentType: employmentType || undefined,
        workArrangement: workArrangement || undefined,
        category: category || undefined,
        department: department || undefined,
        salaryMin: salaryMin ? parseFloat(salaryMin) : undefined,
        salaryMax: salaryMax ? parseFloat(salaryMax) : undefined,
        featured: featuredOnly || undefined,
        limit: 50,
        offset: 0,
      });
      setJobs(response.data?.jobs || []);
      setTotalJobs(response.data?.total || 0);
    } catch (error) {
      console.error('Failed to load jobs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = () => {
    loadJobs();
  };

  const clearFilters = () => {
    setSearchQuery('');
    setLocation('');
    setEmploymentType('');
    setWorkArrangement('');
    setCategory('');
    setDepartment('');
    setSalaryMin('');
    setSalaryMax('');
    setFeaturedOnly(false);
  };

  const hasActiveFilters = () => {
    return !!(
      searchQuery ||
      location ||
      employmentType ||
      workArrangement ||
      category ||
      department ||
      salaryMin ||
      salaryMax ||
      featuredOnly
    );
  };

  const formatSalary = (job: PublicJob) => {
    if (!job.salaryMin && !job.salaryMax) {
      return job.salaryDescription || 'Salary not specified';
    }
    const min = job.salaryMin?.toLocaleString();
    const max = job.salaryMax?.toLocaleString();
    return `${job.salaryCurrency} ${min}${max ? ` - ${max}` : '+'}`;
  };

  return (
    <CandidatePageLayout
      title="Find Your Next Job"
      subtitle={totalJobs > 0 ? `${totalJobs} opportunities available` : 'Search for your dream job'}
    >
      <div className="bg-background">
        {/* Search Section */}
        <div className="border-b bg-card">
          <div className="container mx-auto px-4 py-6">

          {/* Main Search Bar */}
          <div className="space-y-4">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search jobs by title, keywords, company..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="pl-10"
                />
              </div>
              <Button onClick={handleSearch} size="default">
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </div>

            {/* Quick Filters */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <Select value={location || undefined} onValueChange={(val) => setLocation(val === 'all' ? '' : val)}>
                <SelectTrigger>
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  {filterOptions.locations.map((loc) => (
                    <SelectItem key={loc} value={loc}>
                      {loc}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={employmentType || undefined} onValueChange={(val) => setEmploymentType(val === 'all' ? '' : val)}>
                <SelectTrigger>
                  <SelectValue placeholder="Employment Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="FULL_TIME">Full Time</SelectItem>
                  <SelectItem value="PART_TIME">Part Time</SelectItem>
                  <SelectItem value="CONTRACT">Contract</SelectItem>
                  <SelectItem value="CASUAL">Casual</SelectItem>
                </SelectContent>
              </Select>

              <Select value={workArrangement || undefined} onValueChange={(val) => setWorkArrangement(val === 'all' ? '' : val)}>
                <SelectTrigger>
                  <SelectValue placeholder="Work Arrangement" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Arrangements</SelectItem>
                  <SelectItem value="ON_SITE">On Site</SelectItem>
                  <SelectItem value="REMOTE">Remote</SelectItem>
                  <SelectItem value="HYBRID">Hybrid</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex gap-2">
                <Button
                  variant={showAdvancedFilters ? 'default' : 'outline'}
                  onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                  className="flex-1"
                >
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  More Filters
                </Button>
                {hasActiveFilters() && (
                  <Button variant="ghost" size="icon" onClick={clearFilters} title="Clear all filters">
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>

            {/* Advanced Filters */}
            {showAdvancedFilters && (
              <div className="pt-4 border-t space-y-4 animate-in slide-in-from-top-2">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select value={category || undefined} onValueChange={(val) => setCategory(val === 'all' ? '' : val)}>
                      <SelectTrigger id="category">
                        <SelectValue placeholder="All Categories" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {filterOptions.categories.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Select value={department || undefined} onValueChange={(val) => setDepartment(val === 'all' ? '' : val)}>
                      <SelectTrigger id="department">
                        <SelectValue placeholder="All Departments" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Departments</SelectItem>
                        {filterOptions.departments.map((dept) => (
                          <SelectItem key={dept} value={dept}>
                            {dept}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Featured Jobs Only</Label>
                    <div className="flex items-center space-x-2 pt-2">
                      <Checkbox
                        id="featured"
                        checked={featuredOnly}
                        onCheckedChange={(checked) => setFeaturedOnly(checked === true)}
                      />
                      <Label htmlFor="featured" className="font-normal cursor-pointer">
                        Show only featured jobs
                      </Label>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="salaryMin">Minimum Salary</Label>
                    <Input
                      id="salaryMin"
                      type="number"
                      placeholder="e.g., 50000"
                      value={salaryMin}
                      onChange={(e) => setSalaryMin(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="salaryMax">Maximum Salary</Label>
                    <Input
                      id="salaryMax"
                      type="number"
                      placeholder="e.g., 100000"
                      value={salaryMax}
                      onChange={(e) => setSalaryMax(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Job Listings */}
      <div className="container mx-auto px-4 py-8">
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-12">
            <Briefcase className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-xl font-semibold mb-2">No jobs found</h3>
            <p className="text-muted-foreground mb-4">
              {hasActiveFilters()
                ? 'Try adjusting your filters to see more results.'
                : 'No job postings available at the moment.'}
            </p>
            {hasActiveFilters() && (
              <Button variant="outline" onClick={clearFilters}>
                Clear Filters
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {jobs.map((job) => (
              <Card
                key={job.id}
                className={cn(
                  'hover:shadow-lg transition-all duration-200 cursor-pointer border-l-4',
                  job.featured && 'border-l-primary bg-primary/5'
                )}
                onClick={() => navigate(`/jobs/${job.id}`)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start gap-3">
                        <div className="flex-1">
                          <CardTitle className="text-xl mb-2 flex items-center gap-2">
                            <Link
                              to={`/candidate/jobs/${job.id}`}
                              className="hover:text-primary transition-colors"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {job.title}
                            </Link>
                            {job.featured && (
                              <Badge variant="default" className="ml-2">
                                <TrendingUp className="h-3 w-3 mr-1" />
                                Featured
                              </Badge>
                            )}
                          </CardTitle>
                          <CardDescription className="flex items-center gap-4 flex-wrap text-sm">
                            <span className="flex items-center gap-1.5">
                              <Building2 className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">{job.company.name}</span>
                            </span>
                            <span className="flex items-center gap-1.5">
                              <MapPin className="h-4 w-4 text-muted-foreground" />
                              {job.location}
                            </span>
                            {job.department && (
                              <span className="flex items-center gap-1.5">
                                <Briefcase className="h-4 w-4 text-muted-foreground" />
                                {job.department}
                              </span>
                            )}
                            <span className="flex items-center gap-1.5">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              {job.postingDate
                                ? formatDistanceToNow(new Date(job.postingDate), { addSuffix: true })
                                : 'Recently'}
                            </span>
                          </CardDescription>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {job.jobSummary || job.description.substring(0, 200)}...
                  </p>
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-6 flex-wrap">
                      <div className="flex items-center gap-1.5 text-sm">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{formatSalary(job)}</span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {job.employmentType.replace('_', ' ')}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {job.workArrangement.replace('_', ' ')}
                      </Badge>
                      {job.category && (
                        <Badge variant="secondary" className="text-xs">
                          {job.category}
                        </Badge>
                      )}
                    </div>
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/candidate/jobs/${job.id}`);
                      }}
                      size="sm"
                    >
                      View Details
                    </Button>
                  </div>
                  {job.promotionalTags.length > 0 && (
                    <div className="flex gap-2 mt-4 flex-wrap">
                      {job.promotionalTags.map((tag, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
      </div>
    </CandidatePageLayout>
  );
}
