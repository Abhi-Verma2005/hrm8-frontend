import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Building2, MapPin, Globe, Briefcase, Search, ArrowRight } from "lucide-react";
import { apiClient } from "@/lib/api";

interface CompanyWithJobs {
  company: {
    id: string;
    name: string;
    website?: string;
    logo_url?: string;
    jobCount: number;
  };
  jobs: {
    id: string;
    title: string;
    location: string;
    employmentType: string;
    workArrangement: string;
  }[];
}

export default function CareersPage() {
  const [companies, setCompanies] = useState<CompanyWithJobs[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCompanies, setFilteredCompanies] = useState<CompanyWithJobs[]>([]);

  useEffect(() => {
    loadCompanies();
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      setFilteredCompanies(
        companies.filter((c) => c.company.name.toLowerCase().includes(query))
      );
    } else {
      setFilteredCompanies(companies);
    }
  }, [searchQuery, companies]);

  const loadCompanies = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get<{
        jobs: Array<{
          id: string;
          title: string;
          location: string;
          employmentType: string;
          workArrangement: string;
          company: { id: string; name: string; website?: string; logoUrl?: string };
        }>;
      }>("/api/public/jobs?limit=100");

      if (response.success && response.data?.jobs) {
        const companyMap = new Map<string, CompanyWithJobs>();

        response.data.jobs.forEach((job) => {
          if (!job.company) return;
          const existing = companyMap.get(job.company.id);
          if (existing) {
            existing.jobs.push({
              id: job.id,
              title: job.title,
              location: job.location,
              employmentType: job.employmentType,
              workArrangement: job.workArrangement,
            });
            existing.company.jobCount = existing.jobs.length;
          } else {
            companyMap.set(job.company.id, {
              company: {
                id: job.company.id,
                name: job.company.name,
                website: job.company.website,
                logo_url: job.company.logoUrl,
                jobCount: 1,
              },
              jobs: [{
                id: job.id,
                title: job.title,
                location: job.location,
                employmentType: job.employmentType,
                workArrangement: job.workArrangement,
              }],
            });
          }
        });

        const companiesList = Array.from(companyMap.values()).sort((a, b) => b.jobs.length - a.jobs.length);
        setCompanies(companiesList);
        setFilteredCompanies(companiesList);
      }
    } catch (error) {
      console.error("Failed to load companies:", error);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Hero */}
      <div className="bg-primary/5 border-b">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold tracking-tight mb-4">Explore Career Opportunities</h1>
            <p className="text-lg text-muted-foreground mb-8">Discover companies hiring now</p>
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search companies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 rounded-full border-2"
              />
            </div>
            <div className="mt-6 flex items-center justify-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1"><Building2 className="h-4 w-4" />{companies.length} Companies</span>
              <span className="flex items-center gap-1"><Briefcase className="h-4 w-4" />{companies.reduce((sum, c) => sum + c.jobs.length, 0)} Positions</span>
            </div>
          </div>
        </div>
      </div>

      {/* Companies Grid */}
      <div className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i}><CardHeader><Skeleton className="h-16 w-16" /></CardHeader></Card>
            ))}
          </div>
        ) : filteredCompanies.length === 0 ? (
          <div className="text-center py-16">
            <Building2 className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
            <h2 className="text-xl font-semibold mb-2">No Companies Found</h2>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCompanies.map(({ company, jobs }) => (
              <Card key={company.id} className="hover:shadow-lg transition-shadow group">
                <CardHeader className="pb-4">
                  <div className="flex items-start gap-4">
                    <div className="h-16 w-16 rounded-lg bg-primary/10 flex items-center justify-center">
                      {company.logo_url ? (
                        <img src={company.logo_url} alt={company.name} className="h-full w-full object-cover rounded-lg" />
                      ) : (
                        <Building2 className="h-8 w-8 text-primary" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg truncate">{company.name}</CardTitle>
                      {company.website && (
                        <a href={company.website} target="_blank" rel="noopener" className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1">
                          <Globe className="h-3 w-3" />
                          {company.website.replace(/(https?:\/\/)?(www\.)?/, "")}
                        </a>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Badge variant="secondary" className="bg-primary/10 text-primary">
                    <Briefcase className="h-3 w-3 mr-1" />{jobs.length} Open Positions
                  </Badge>
                  <div className="space-y-2">
                    {jobs.slice(0, 3).map((job) => (
                      <Link key={job.id} to={`/candidate/jobs/${job.id}`} className="block p-3 rounded-lg bg-muted/50 hover:bg-muted">
                        <p className="font-medium text-sm truncate">{job.title}</p>
                        <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                          <MapPin className="h-3 w-3" /><span className="truncate">{job.location}</span>
                        </div>
                      </Link>
                    ))}
                    {jobs.length > 3 && <p className="text-xs text-muted-foreground text-center">+{jobs.length - 3} more</p>}
                  </div>
                  <Button asChild variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground">
                    <Link to={`/candidate/jobs?companyId=${company.id}`}>View All Jobs<ArrowRight className="h-4 w-4 ml-2" /></Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!loading && companies.length > 0 && (
          <div className="mt-12 text-center">
            <Card className="inline-block p-8 bg-primary/5 border-primary/20">
              <h3 className="text-xl font-semibold mb-2">Looking for something specific?</h3>
              <p className="text-muted-foreground mb-4">Browse all available positions with advanced filters</p>
              <Button asChild size="lg"><Link to="/candidate/jobs"><Search className="h-4 w-4 mr-2" />Browse All Jobs</Link></Button>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
