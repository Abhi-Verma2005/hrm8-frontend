import { Card, CardContent } from "@/components/ui/card";
import { Briefcase, FileText, CheckCircle, XCircle, Users } from "lucide-react";

interface EmployerJobStatsCardsProps {
  stats: {
    total: number;
    open: number;
    draft: number;
    closed: number;
    totalApplicants: number;
    avgApplicantsPerJob: number;
  };
}

export default function EmployerJobStatsCards({ stats }: EmployerJobStatsCardsProps) {
  const cards = [
    {
      label: "Total Jobs",
      value: stats.total,
      icon: Briefcase,
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      label: "Open Positions",
      value: stats.open,
      icon: CheckCircle,
      gradient: "from-emerald-500 to-green-500",
    },
    {
      label: "Draft Jobs",
      value: stats.draft,
      icon: FileText,
      gradient: "from-amber-500 to-orange-500",
    },
    {
      label: "Closed Jobs",
      value: stats.closed,
      icon: XCircle,
      gradient: "from-gray-500 to-slate-500",
    },
    {
      label: "Total Applicants",
      value: stats.totalApplicants,
      icon: Users,
      gradient: "from-purple-500 to-indigo-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Card key={card.label} className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{card.label}</p>
                  <p className="text-3xl font-bold mt-2">{card.value}</p>
                </div>
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${card.gradient} flex items-center justify-center`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
