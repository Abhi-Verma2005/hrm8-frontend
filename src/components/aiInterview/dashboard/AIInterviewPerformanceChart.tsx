import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getAIInterviewSessions } from '@/lib/aiInterview/aiInterviewStorage';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export function AIInterviewPerformanceChart() {
  const sessions = getAIInterviewSessions();
  const completedSessions = sessions.filter(s => s.status === 'completed' && s.analysis);

  const performanceData = completedSessions.reduce((acc, session) => {
    const score = session.analysis?.overallScore || 0;
    const category = score >= 80 ? 'Excellent' : score >= 60 ? 'Good' : score >= 40 ? 'Average' : 'Below Average';
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const chartData = [
    { category: 'Below Average', count: performanceData['Below Average'] || 0 },
    { category: 'Average', count: performanceData['Average'] || 0 },
    { category: 'Good', count: performanceData['Good'] || 0 },
    { category: 'Excellent', count: performanceData['Excellent'] || 0 },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Interview Performance Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="hsl(var(--primary))" name="Candidates" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
