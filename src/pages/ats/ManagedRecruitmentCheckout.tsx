import { useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { jobService } from "@/lib/api/jobService";
import { serviceTypeToHiringMode } from "@/lib/jobFormTransformers";
import { createUpgradeCheckoutSession, type UpgradeTier } from "@/lib/payments";

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
  const companyId = searchParams.get("companyId");

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

  const mapServiceToTier = (): UpgradeTier | null => {
    switch (serviceType) {
      case "shortlisting":
        return "shortlisting";
      case "full-service":
        return "full_service";
      case "executive-search":
        return "executive_search";
      default:
        return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!companyId) {
      setError("Missing company ID for checkout.");
      return;
    }

    const tier = mapServiceToTier();
    if (!tier) {
      setError("Invalid service tier.");
      return;
    }

    setIsSubmitting(true);

    try {
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

      const checkout = await createUpgradeCheckoutSession({
        tier,
        companyId,
      });

      if (!checkout.success || !checkout.data?.checkoutUrl) {
        throw new Error(checkout.error || "Failed to start payment.");
      }

      setSuccess(true);
      toast({
        title: "Redirecting to checkout",
        description: "Secure Stripe Checkout is opening.",
      });

      window.location.href = checkout.data.checkoutUrl;
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
                Managed Recruitment Checkout
              </CardTitle>
              <CardDescription>
                Confirm your upgrade to <span className="font-semibold">{getServiceName()}</span> for this job.
              </CardDescription>
            </div>
          </div>
        </CardHeader>

          <CardContent className="space-y-4">
          <Alert className="bg-primary/5 border-primary/40">
            <AlertTitle>Stripe checkout</AlertTitle>
            <AlertDescription>
              You will be redirected to Stripe to securely complete this payment.
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
                {isSubmitting ? "Redirecting..." : "Confirm & Pay"}
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































