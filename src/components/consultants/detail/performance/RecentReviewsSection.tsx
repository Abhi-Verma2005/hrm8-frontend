import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Star, Calendar, User, Plus, Eye } from "lucide-react";
import { getPerformanceReviews } from "@/lib/performanceStorage";
import { format } from "date-fns";
import type { PerformanceReview } from "@/types/performance";

interface RecentReviewsSectionProps {
  consultantId: string;
}

export function RecentReviewsSection({ consultantId }: RecentReviewsSectionProps) {
  const allReviews = getPerformanceReviews().filter(r => r.employeeId === consultantId);
  const completedReviews = allReviews.filter(r => r.status === 'completed').slice(0, 3);
  const upcomingReviews = allReviews.filter(r => r.status === 'not-started' || r.status === 'in-progress').slice(0, 2);

  const getStatusBadge = (review: PerformanceReview) => {
    const statusConfig = {
      'completed': { variant: 'outline' as const, label: 'Completed' },
      'in-progress': { variant: 'default' as const, label: 'In Progress' },
      'not-started': { variant: 'secondary' as const, label: 'Scheduled' },
      'overdue': { variant: 'destructive' as const, label: 'Overdue' },
    };
    return statusConfig[review.status] || statusConfig['not-started'];
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Performance Reviews
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {completedReviews.length} completed • {upcomingReviews.length} upcoming
            </p>
          </div>
          <Button variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Schedule Review
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Completed Reviews */}
        {completedReviews.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-muted-foreground">Recent Reviews</h4>
            {completedReviews.map((review) => {
              const statusBadge = getStatusBadge(review);
              return (
                <Card key={review.id} className="border">
                  <CardContent className="pt-4">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <h5 className="font-semibold">{review.templateName}</h5>
                            <Badge variant={statusBadge.variant}>{statusBadge.label}</Badge>
                          </div>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <User className="h-3 w-3" />
                            <span>Reviewer: {review.reviewerName}</span>
                          </div>
                        </div>
                        {review.overallRating && (
                          <div className="text-right">
                            <div className="text-2xl font-bold">{review.overallRating.toFixed(1)}</div>
                            {renderStars(review.overallRating)}
                          </div>
                        )}
                      </div>

                      {review.strengths && (
                        <div className="text-sm">
                          <p className="font-semibold mb-1">Key Strengths</p>
                          <p className="text-muted-foreground line-clamp-2">{review.strengths}</p>
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-2 border-t">
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          <span>
                            {format(new Date(review.reviewPeriodStart), "MMM d")} -{" "}
                            {format(new Date(review.reviewPeriodEnd), "MMM d, yyyy")}
                          </span>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          View Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Upcoming Reviews */}
        {upcomingReviews.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-muted-foreground">Upcoming Reviews</h4>
            {upcomingReviews.map((review) => {
              const statusBadge = getStatusBadge(review);
              return (
                <Card key={review.id} className="border border-dashed">
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h5 className="font-semibold">{review.templateName}</h5>
                          <Badge variant={statusBadge.variant}>{statusBadge.label}</Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            <span>{review.reviewerName}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>Due: {format(new Date(review.dueDate), "MMM d, yyyy")}</span>
                          </div>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        {review.status === 'in-progress' ? 'Continue' : 'Start Review'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Empty State */}
        {completedReviews.length === 0 && upcomingReviews.length === 0 && (
          <div className="text-center py-8">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
            <p className="text-muted-foreground">No reviews yet</p>
            <Button variant="outline" size="sm" className="mt-3">
              <Plus className="h-4 w-4 mr-2" />
              Schedule First Review
            </Button>
          </div>
        )}

        {/* View All Button */}
        {allReviews.length > 3 && (
          <Button variant="outline" className="w-full">
            View All Reviews ({allReviews.length})
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
