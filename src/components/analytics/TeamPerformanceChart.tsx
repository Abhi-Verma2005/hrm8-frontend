import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TeamPerformanceMetrics } from '@/lib/analytics/recruitmentMetrics';
import { Users, TrendingUp } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface TeamPerformanceChartProps {
  data: TeamPerformanceMetrics[];
}

export function TeamPerformanceChart({ data }: TeamPerformanceChartProps) {
  const topPerformer = data[0];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          Team Performance
        </CardTitle>
        <CardDescription>
          Track recruiting team productivity and effectiveness
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Top performer highlight */}
        {topPerformer && (
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12 border-2 border-primary">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {topPerformer.teamMember.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-semibold">{topPerformer.teamMember}</p>
                  <Badge variant="default">🏆 Top Performer</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{topPerformer.role}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-primary">{topPerformer.hires}</p>
                <p className="text-xs text-muted-foreground">Hires</p>
              </div>
            </div>
          </div>
        )}

        {/* Team members table */}
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr>
                <th className="text-left p-3 font-medium">Team Member</th>
                <th className="text-right p-3 font-medium">Reviews</th>
                <th className="text-right p-3 font-medium">Interviews</th>
                <th className="text-right p-3 font-medium">Offers</th>
                <th className="text-right p-3 font-medium">Hires</th>
                <th className="text-right p-3 font-medium">Efficiency</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {data.map((member, index) => {
                const efficiency = member.applicationsReviewed > 0
                  ? Math.round((member.hires / member.applicationsReviewed) * 100)
                  : 0;

                return (
                  <tr key={member.teamMember} className="hover:bg-accent/50">
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs">
                            {member.teamMember.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{member.teamMember}</p>
                          <p className="text-xs text-muted-foreground">{member.role}</p>
                        </div>
                      </div>
                    </td>
                    <td className="text-right p-3">{member.applicationsReviewed}</td>
                    <td className="text-right p-3">{member.interviewsConducted}</td>
                    <td className="text-right p-3 font-medium text-blue-600">
                      {member.offersExtended}
                    </td>
                    <td className="text-right p-3 font-bold text-primary">
                      {member.hires}
                    </td>
                    <td className="text-right p-3">
                      <div className="flex items-center justify-end gap-2">
                        <Progress value={efficiency} className="w-16 h-2" />
                        <span className="text-xs font-medium w-10">{efficiency}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Performance stats */}
        <div className="grid grid-cols-4 gap-4">
          <div className="border rounded-lg p-4">
            <p className="text-sm text-muted-foreground mb-1">Total Reviews</p>
            <p className="text-2xl font-bold">
              {data.reduce((sum, m) => sum + m.applicationsReviewed, 0)}
            </p>
          </div>
          <div className="border rounded-lg p-4">
            <p className="text-sm text-muted-foreground mb-1">Total Interviews</p>
            <p className="text-2xl font-bold">
              {data.reduce((sum, m) => sum + m.interviewsConducted, 0)}
            </p>
          </div>
          <div className="border rounded-lg p-4">
            <p className="text-sm text-muted-foreground mb-1">Total Offers</p>
            <p className="text-2xl font-bold text-blue-600">
              {data.reduce((sum, m) => sum + m.offersExtended, 0)}
            </p>
          </div>
          <div className="border rounded-lg p-4">
            <p className="text-sm text-muted-foreground mb-1">Total Hires</p>
            <p className="text-2xl font-bold text-primary">
              {data.reduce((sum, m) => sum + m.hires, 0)}
            </p>
          </div>
        </div>

        {/* Insights */}
        <div className="border rounded-lg p-4 bg-muted/30">
          <h4 className="font-medium mb-2 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" />
            Team Insights
          </h4>
          <ul className="space-y-1 text-sm text-muted-foreground">
            <li>
              • Average reviews per team member: {Math.round(
                data.reduce((sum, m) => sum + m.applicationsReviewed, 0) / data.length
              )}
            </li>
            <li>
              • Team hire rate: {Math.round(
                (data.reduce((sum, m) => sum + m.hires, 0) / 
                data.reduce((sum, m) => sum + m.applicationsReviewed, 0)) * 100
              )}%
            </li>
            <li>
              • Most active recruiter: {data[0]?.teamMember}
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
