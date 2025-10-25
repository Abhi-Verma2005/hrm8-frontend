import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Building2, Briefcase, MoreVertical, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ConsultantAssignmentsSectionProps {
  consultantId: string;
}

export function ConsultantAssignmentsSection({ consultantId }: ConsultantAssignmentsSectionProps) {
  const [showAddDialog, setShowAddDialog] = useState(false);

  // Mock assignments data
  const assignments = [
    {
      id: '1',
      type: 'employer' as const,
      entityId: 'employer_1',
      entityName: 'TechCorp Solutions',
      role: 'Account Manager',
      isPrimary: true,
      assignedDate: '2024-01-15',
    },
    {
      id: '2',
      type: 'employer' as const,
      entityId: 'employer_2',
      entityName: 'Acme Corporation',
      role: 'Recruiter',
      isPrimary: false,
      assignedDate: '2024-03-20',
    },
    {
      id: '3',
      type: 'job' as const,
      entityId: 'job_1',
      entityName: 'Senior Software Engineer',
      role: 'Lead Recruiter',
      isPrimary: true,
      assignedDate: '2024-11-01',
    },
    {
      id: '4',
      type: 'job' as const,
      entityId: 'job_2',
      entityName: 'Product Manager',
      role: 'Supporting Recruiter',
      isPrimary: false,
      assignedDate: '2024-12-15',
    },
  ];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Current Assignments</CardTitle>
        <Button size="sm" onClick={() => setShowAddDialog(true)}>
          <Plus className="h-4 w-4 mr-1.5" />
          Add Assignment
        </Button>
      </CardHeader>
      <CardContent>
        {assignments.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Briefcase className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">No assignments yet</p>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-3"
              onClick={() => setShowAddDialog(true)}
            >
              Add First Assignment
            </Button>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {assignments.map((assignment) => (
              <Card key={assignment.id} className="border-muted">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {assignment.type === 'employer' ? (
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Briefcase className="h-4 w-4 text-muted-foreground" />
                      )}
                      <Badge variant="outline" className="text-xs">
                        {assignment.type === 'employer' ? 'Employer' : 'Job'}
                      </Badge>
                      {assignment.isPrimary && (
                        <Badge variant="default" className="text-xs">
                          Primary
                        </Badge>
                      )}
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          Remove
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  
                  <Link
                    to={assignment.type === 'employer' 
                      ? `/employers/${assignment.entityId}` 
                      : `/jobs/${assignment.entityId}`
                    }
                    className="group"
                  >
                    <h4 className="font-medium mb-1 group-hover:text-primary flex items-center gap-1">
                      {assignment.entityName}
                      <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </h4>
                  </Link>
                  
                  <p className="text-sm text-muted-foreground mb-2">{assignment.role}</p>
                  
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Assigned</span>
                    <span>{new Date(assignment.assignedDate).toLocaleDateString()}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
