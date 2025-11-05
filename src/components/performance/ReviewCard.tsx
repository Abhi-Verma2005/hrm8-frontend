import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { PerformanceReview } from "@/types/performance";
import { format } from "date-fns";
import { Calendar, FileText, Star, Eye } from "lucide-react";

interface ReviewCardProps {
  review: PerformanceReview;
  onView?: (id: string) => void;
}

export function ReviewCard({ review, onView }: ReviewCardProps) {
  const getStatusBadge = () => {
    const variants: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
      'not-started': { label: 'Not Started', variant: 'secondary' },
      'in-progress': { label: 'In Progress', variant: 'default' },
      'completed': { label: 'Completed', variant: 'default' },
      'overdue': { label: 'Overdue', variant: 'destructive' },
    };
    const { label, variant } = variants[review.status] || variants['not-started'];
    return <Badge variant={variant}>{label}</Badge>;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <CardTitle className="text-base">{review.templateName}</CardTitle>
              {getStatusBadge()}
            </div>
            <p className="text-sm text-muted-foreground">
              Reviewer: {review.reviewerName}
            </p>
          </div>
          {review.overallRating && (
            <div className="flex items-center gap-1 text-lg font-semibold">
              <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              {review.overallRating.toFixed(1)}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-muted-foreground flex items-center gap-1 mb-1">
              <Calendar className="h-3 w-3" />
              Review Period
            </p>
            <p className="font-medium">
              {format(new Date(review.reviewPeriodStart), "MMM d")} - {format(new Date(review.reviewPeriodEnd), "MMM d, yyyy")}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground flex items-center gap-1 mb-1">
              <FileText className="h-3 w-3" />
              Due Date
            </p>
            <p className="font-medium">{format(new Date(review.dueDate), "MMM d, yyyy")}</p>
          </div>
        </div>

        {review.status === 'completed' && review.completedDate && (
          <div className="text-sm">
            <p className="text-muted-foreground mb-1">Completed</p>
            <p className="font-medium">{format(new Date(review.completedDate), "MMM d, yyyy 'at' h:mm a")}</p>
          </div>
        )}

        {review.strengths && (
          <div className="pt-3 border-t">
            <p className="text-sm font-semibold mb-1">Strengths</p>
            <p className="text-sm text-muted-foreground line-clamp-2">{review.strengths}</p>
          </div>
        )}

        {onView && (
          <Button variant="outline" size="sm" onClick={() => onView(review.id)} className="w-full mt-3">
            <Eye className="mr-2 h-4 w-4" />
            View Details
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
