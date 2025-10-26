import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getAllConsultants } from "@/lib/consultantStorage";
import { formatConsultantName, getCapacityStatus } from "@/lib/consultantService";
import { Search, UserPlus, X, AlertCircle, CheckCircle2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface TeamMember {
  id: string;
  name: string;
  role: 'lead' | 'support';
  avatar?: string;
}

interface RPOTeamSelectorProps {
  selectedConsultants: TeamMember[];
  onConsultantsChange: (consultants: TeamMember[]) => void;
  requireLead?: boolean;
}

export function RPOTeamSelector({ 
  selectedConsultants, 
  onConsultantsChange,
  requireLead = true 
}: RPOTeamSelectorProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterAvailability, setFilterAvailability] = useState<string>("all");
  
  const allConsultants = useMemo(() => getAllConsultants(), []);
  
  const filteredConsultants = useMemo(() => {
    return allConsultants.filter(consultant => {
      // Exclude already selected
      if (selectedConsultants.some(sc => sc.id === consultant.id)) return false;
      
      // Exclude inactive consultants
      if (consultant.status !== 'active') return false;
      
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const name = formatConsultantName(consultant).toLowerCase();
        const title = consultant.title?.toLowerCase() || '';
        const specializations = consultant.specialization?.join(' ').toLowerCase() || '';
        
        if (!name.includes(query) && !title.includes(query) && !specializations.includes(query)) {
          return false;
        }
      }
      
      // Type filter
      if (filterType !== "all" && consultant.type !== filterType) return false;
      
      // Availability filter
      if (filterAvailability === "available") {
        const status = getCapacityStatus(consultant);
        if (status === 'at-capacity') return false;
      }
      
      return true;
    });
  }, [allConsultants, selectedConsultants, searchQuery, filterType, filterAvailability]);

  const addConsultant = (consultantId: string) => {
    const consultant = allConsultants.find(c => c.id === consultantId);
    if (!consultant) return;
    
    const hasLead = selectedConsultants.some(c => c.role === 'lead');
    const newMember: TeamMember = {
      id: consultant.id,
      name: formatConsultantName(consultant),
      role: hasLead ? 'support' : 'lead',
      avatar: consultant.photo
    };
    
    onConsultantsChange([...selectedConsultants, newMember]);
  };

  const removeConsultant = (id: string) => {
    const updatedConsultants = selectedConsultants.filter(c => c.id !== id);
    
    // If we're removing the lead and others remain, promote first support to lead
    if (requireLead && updatedConsultants.length > 0) {
      const hasLead = updatedConsultants.some(c => c.role === 'lead');
      if (!hasLead) {
        updatedConsultants[0].role = 'lead';
      }
    }
    
    onConsultantsChange(updatedConsultants);
  };

  const updateRole = (id: string, role: 'lead' | 'support') => {
    const updatedConsultants = selectedConsultants.map(c => {
      if (c.id === id) {
        return { ...c, role };
      }
      // If setting someone as lead, demote current lead to support
      if (role === 'lead' && c.role === 'lead') {
        return { ...c, role: 'support' as const };
      }
      return c;
    });
    
    onConsultantsChange(updatedConsultants);
  };

  const hasLead = selectedConsultants.some(c => c.role === 'lead');

  return (
    <div className="space-y-4">
      <div>
        <Label className="text-base">Team Members</Label>
        <p className="text-sm text-muted-foreground">
          Select consultants to work on this RPO engagement {requireLead && '(at least one lead required)'}
        </p>
      </div>

      {/* Selected Team Members */}
      {selectedConsultants.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium">Selected Team ({selectedConsultants.length})</span>
                {requireLead && !hasLead && (
                  <Badge variant="destructive" className="gap-1">
                    <AlertCircle className="h-3 w-3" />
                    No lead assigned
                  </Badge>
                )}
                {hasLead && (
                  <Badge variant="default" className="gap-1">
                    <CheckCircle2 className="h-3 w-3" />
                    Team ready
                  </Badge>
                )}
              </div>
              {selectedConsultants.map((member) => {
                const consultant = allConsultants.find(c => c.id === member.id);
                if (!consultant) return null;
                
                return (
                  <div key={member.id} className="flex items-center gap-3 p-3 border rounded-lg">
                    <Avatar>
                      <AvatarImage src={member.avatar} />
                      <AvatarFallback>
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium truncate">{member.name}</span>
                        <Badge 
                          variant={member.role === 'lead' ? 'default' : 'secondary'}
                          className="shrink-0"
                        >
                          {member.role}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground truncate">
                        {consultant.title}
                      </div>
                    </div>
                    <Select
                      value={member.role}
                      onValueChange={(value: 'lead' | 'support') => updateRole(member.id, value)}
                    >
                      <SelectTrigger className="w-[100px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="lead">Lead</SelectItem>
                        <SelectItem value="support">Support</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeConsultant(member.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search and Filters */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search consultants by name, title, or specialization..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        
        <div className="flex gap-2">
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="recruiter">Recruiters</SelectItem>
              <SelectItem value="sales-rep">Sales Reps</SelectItem>
              <SelectItem value="360-consultant">360 Consultants</SelectItem>
              <SelectItem value="industry-partner">Industry Partners</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterAvailability} onValueChange={setFilterAvailability}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Availability" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="available">Available Only</SelectItem>
            </SelectContent>
          </Select>

          <Badge variant="secondary" className="ml-auto self-center">
            {filteredConsultants.length} available
          </Badge>
        </div>
      </div>

      {/* Available Consultants */}
      <ScrollArea className="h-[400px] border rounded-lg">
        <div className="p-4 space-y-2">
          {filteredConsultants.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <UserPlus className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No consultants found</p>
              <p className="text-sm">Try adjusting your filters</p>
            </div>
          ) : (
            filteredConsultants.map((consultant) => {
              const capacityStatus = getCapacityStatus(consultant);
              const capacityPercent = (consultant.currentEmployers / consultant.maxEmployers) * 100;
              
              return (
                <Card key={consultant.id} className="hover:bg-muted/50 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Avatar>
                        <AvatarImage src={consultant.photo} />
                        <AvatarFallback>
                          {consultant.firstName[0]}{consultant.lastName[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <div className="flex-1 min-w-0">
                            <div className="font-medium truncate">
                              {formatConsultantName(consultant)}
                            </div>
                            <div className="text-sm text-muted-foreground truncate">
                              {consultant.title}
                            </div>
                          </div>
                          <Button
                            size="sm"
                            onClick={() => addConsultant(consultant.id)}
                          >
                            <UserPlus className="h-4 w-4 mr-1" />
                            Add
                          </Button>
                        </div>
                        
                        {consultant.specialization && consultant.specialization.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {consultant.specialization.slice(0, 3).map((spec, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {spec}
                              </Badge>
                            ))}
                          </div>
                        )}
                        
                        <div className="mt-3 space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">Capacity</span>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">
                                {consultant.currentEmployers}/{consultant.maxEmployers} employers
                              </span>
                              {capacityStatus === 'at-capacity' && (
                                <Badge variant="destructive" className="text-xs gap-1">
                                  <AlertCircle className="h-3 w-3" />
                                  Full
                                </Badge>
                              )}
                              {capacityStatus === 'near-capacity' && (
                                <Badge variant="secondary" className="text-xs gap-1">
                                  <AlertCircle className="h-3 w-3" />
                                  Near Full
                                </Badge>
                              )}
                            </div>
                          </div>
                          <Progress value={capacityPercent} className="h-1.5" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </ScrollArea>
    </div>
  );
}