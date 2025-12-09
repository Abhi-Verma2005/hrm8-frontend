import { useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Lock, CheckCircle2, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { jobService } from "@/lib/api/jobService";
import { serviceTypeToHiringMode } from "@/lib/jobFormTransformers";

const MOCK_PAYMENT_PASSWORD = "vAbhi2678";

export default function ManagedRecruitmentCheckout() {
  const { jobId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const serviceType = searchParams.get("serviceType") as
    | "shortlisting"
    | "full-service"
    | "executive-search"
    | null;

  const [paymentPassword, setPaymentPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (!jobId || !serviceType) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Alert variant="destructive" className="max-w-lg">
          <AlertTitle>Invalid checkout link</AlertTitle>
          <AlertDescription>
            Missing job or service information. Please go back to the job and start the upgrade again.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const getServiceName = () => {
    switch (serviceType) {
      case "shortlisting":
        return "Shortlisting Service";
      case "full-service":
        return "Full Recruitment Service";
      case "executive-search":
        return "Executive Search";
      default:
        return "Managed Recruitment Service";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!paymentPassword) {
      setError("Please enter the mock payment password.");
      return;
    }

    setIsSubmitting(true);

    try {
      if (paymentPassword !== MOCK_PAYMENT_PASSWORD) {
        setSuccess(false);
        setError("Payment failed. Invalid mock payment password.");
        toast({
          title: "Payment failed",
          description: "The payment password you entered is incorrect.",
          variant: "destructive",
        });
        return;
      }

      // Mock payment success: now perform the actual upgrade API call
      const hiringMode = serviceTypeToHiringMode(serviceType);

      const response = await jobService.updateJob(jobId, {
        hiringMode: hiringMode as any,
      });

      if (!response.success) {
        setSuccess(false);
        setError(response.error || "Failed to upgrade job after payment.");
        toast({
          title: "Upgrade failed",
          description: response.error || "Something went wrong after payment.",
          variant: "destructive",
        });
        return;
      }

      setSuccess(true);
      toast({
        title: "Payment successful",
        description: `Job has been upgraded to ${getServiceName()}.`,
      });

      setTimeout(() => {
        navigate(`/jobs/${jobId}`);
      }, 1200);
    } catch (err: any) {
      setSuccess(false);
      setError(err?.message || "Unexpected error during checkout.");
      toast({
        title: "Checkout error",
        description: err?.message || "Unexpected error during checkout.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 px-4">
      <Card className="w-full max-w-xl border-0 shadow-lg bg-background/95 backdrop-blur">
        <CardHeader className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Lock className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold tracking-tight">
                Managed Recruitment Checkout (Mock)
              </CardTitle>
              <CardDescription>
                Confirm your upgrade to <span className="font-semibold">{getServiceName()}</span> for this job.
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <Alert className="bg-muted/60">
            <AlertTitle>Mock payment flow</AlertTitle>
            <AlertDescription>
              To simulate a successful payment, enter the password{" "}
              <span className="font-mono font-semibold">vAbhi2678</span>. Any other value will simulate a failed payment.
            </AlertDescription>
          </Alert>

          {error && (
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertTitle>Payment not completed</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="bg-emerald-50 dark:bg-emerald-900/20 border-emerald-400/50">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              <AlertTitle className="text-emerald-700 dark:text-emerald-200">
                Payment successful
              </AlertTitle>
              <AlertDescription className="text-emerald-700/90 dark:text-emerald-200/90">
                Your job has been upgraded. Redirecting you back to the job details...
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="paymentPassword">Mock payment password</Label>
              <Input
                id="paymentPassword"
                type="password"
                placeholder="Enter mock payment password"
                value={paymentPassword}
                onChange={(e) => setPaymentPassword(e.target.value)}
                disabled={isSubmitting || success}
                className="h-10"
              />
            </div>

            <div className="flex justify-between items-center pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(-1)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || success}
                className="min-w-[160px]"
              >
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isSubmitting ? "Processing..." : "Confirm & Pay (Mock)"}
              </Button>
            </div>
          </form>
        </CardContent>

        <CardFooter className="flex justify-between text-xs text-muted-foreground">
          <span>Job ID: {jobId}</span>
          <span>Service: {getServiceName()}</span>
        </CardFooter>
      </Card>
    </div>
  );
}


















