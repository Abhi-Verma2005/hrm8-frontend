import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { MessageSquare, CheckCircle, Star } from "lucide-react";
import { getFeedback360, saveFeedback360 } from "@/lib/performanceStorage";
import { toast } from "sonner";
import type { Feedback360, FeedbackResponse } from "@/types/performance";

export default function PublicFeedbackForm() {
  const { feedbackId, providerId } = useParams();
  const navigate = useNavigate();

  const feedbacks = useMemo(() => getFeedback360(), []);
  const feedback = feedbacks.find(f => f.id === feedbackId);
  const provider = feedback?.providers.find(p => p.id === providerId);

  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [comments, setComments] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(provider?.status === 'submitted');

  if (!feedback || !provider) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="py-12 text-center">
            <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Feedback Not Found</h3>
            <p className="text-muted-foreground">This feedback request link is invalid or has expired.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="py-12 text-center">
            <CheckCircle className="h-16 w-16 mx-auto text-green-500 mb-4" />
            <h3 className="text-2xl font-bold mb-2">Thank You!</h3>
            <p className="text-muted-foreground mb-4">
              Your feedback for <span className="font-semibold">{feedback.employeeName}</span> has been submitted successfully.
            </p>
            <p className="text-sm text-muted-foreground">
              Your insights are valuable and will help in their professional development.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleRatingChange = (questionId: string, value: string) => {
    setRatings({ ...ratings, [questionId]: parseInt(value) });
  };

  const handleCommentChange = (questionId: string, value: string) => {
    setComments({ ...comments, [questionId]: value });
  };

  const handleSubmit = async () => {
    // Validate all questions have ratings
    const missingRatings = feedback.questions.some(q => !ratings[q.id]);
    if (missingRatings) {
      toast.error("Please provide ratings for all questions");
      return;
    }

    setLoading(true);

    try {
      // Create feedback responses
      const newResponses: FeedbackResponse[] = feedback.questions.map(question => ({
        id: `response-${Date.now()}-${question.id}`,
        providerId: provider.id,
        providerName: provider.providerName,
        relationship: provider.relationship,
        questionId: question.id,
        question: question.question,
        rating: ratings[question.id],
        comment: comments[question.id] || '',
        submittedAt: new Date().toISOString(),
      }));

      // Update feedback with new responses
      const updatedFeedback: Feedback360 = {
        ...feedback,
        responses: [...(feedback.responses || []), ...newResponses],
        providers: feedback.providers.map(p =>
          p.id === provider.id
            ? { ...p, status: 'submitted' as const, submittedAt: new Date().toISOString() }
            : p
        ),
        status: feedback.providers.every(p => 
          p.id === provider.id || p.status === 'submitted'
        ) ? 'completed' : 'in-progress',
      };

      saveFeedback360(updatedFeedback);

      toast.success("Feedback submitted successfully!");
      setSubmitted(true);
    } catch (error) {
      toast.error("Failed to submit feedback. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>360° Feedback for {feedback.employeeName}</title>
      </Helmet>

      <div className="min-h-screen bg-background py-8 px-4">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Header */}
          <Card>
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <Star className="h-8 w-8 text-primary" />
                </div>
              </div>
              <CardTitle className="text-2xl">360° Feedback Request</CardTitle>
              <CardDescription className="text-base mt-2">
                You've been asked to provide feedback for <span className="font-semibold">{feedback.employeeName}</span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center gap-8 text-sm">
                <div className="text-center">
                  <p className="text-muted-foreground">Review Cycle</p>
                  <p className="font-semibold">{feedback.reviewCycle}</p>
                </div>
                <div className="text-center">
                  <p className="text-muted-foreground">Your Role</p>
                  <p className="font-semibold capitalize">{provider.relationship}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Instructions */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2 text-sm">
                <p className="font-medium">Instructions:</p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Please answer all questions honestly and constructively</li>
                  <li>Rate each question on a scale of 1-5 (1 = Needs Improvement, 5 = Excellent)</li>
                  <li>Provide specific examples in your comments when possible</li>
                  <li>Your feedback will be kept confidential and aggregated with others</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Questions */}
          {feedback.questions.map((question, index) => (
            <Card key={question.id}>
              <CardHeader>
                <CardTitle className="text-base">
                  Question {index + 1}: {question.question}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Rating */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Rating *</Label>
                  <RadioGroup
                    value={ratings[question.id]?.toString()}
                    onValueChange={(value) => handleRatingChange(question.id, value)}
                    className="flex gap-4"
                  >
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <div key={rating} className="flex flex-col items-center gap-2">
                        <RadioGroupItem
                          value={rating.toString()}
                          id={`${question.id}-${rating}`}
                          className="h-6 w-6"
                        />
                        <Label
                          htmlFor={`${question.id}-${rating}`}
                          className="text-xs font-normal cursor-pointer"
                        >
                          {rating}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Needs Improvement</span>
                    <span>Excellent</span>
                  </div>
                </div>

                {/* Comment */}
                <div className="space-y-2">
                  <Label htmlFor={`comment-${question.id}`} className="text-sm">
                    Comments (Optional)
                  </Label>
                  <Textarea
                    id={`comment-${question.id}`}
                    placeholder="Provide specific examples or additional context..."
                    value={comments[question.id] || ''}
                    onChange={(e) => handleCommentChange(question.id, e.target.value)}
                    rows={3}
                    className="resize-none"
                  />
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Submit Button */}
          <Card>
            <CardContent className="pt-6">
              <Button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full"
                size="lg"
              >
                {loading ? "Submitting..." : "Submit Feedback"}
              </Button>
              <p className="text-xs text-center text-muted-foreground mt-4">
                By submitting, you confirm that your feedback is honest and constructive
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
