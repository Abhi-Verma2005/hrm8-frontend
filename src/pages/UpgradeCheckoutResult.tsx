import { useEffect } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, CheckCircle2, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function UpgradeCheckoutResult() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  const isSuccess = location.pathname.includes("upgrade-success");
  const tier = searchParams.get("tier");
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    toast({
      title: isSuccess ? "Payment received" : "Payment canceled",
      description: isSuccess
        ? "Your payment was completed. We will update your account shortly."
        : "You canceled the checkout. No charge was made.",
      variant: isSuccess ? "default" : "destructive",
    });
  }, [isSuccess, toast]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <Card className="max-w-xl w-full shadow-lg">
        <CardHeader className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-full bg-primary/10 flex items-center justify-center">
              {isSuccess ? (
                <CheckCircle2 className="h-6 w-6 text-primary" />
              ) : (
                <AlertCircle className="h-6 w-6 text-destructive" />
              )}
            </div>
            <div>
              <CardTitle className="text-2xl font-bold">
                {isSuccess ? "Payment successful" : "Payment canceled"}
              </CardTitle>
              <CardDescription>
                {isSuccess
                  ? "Thank you for your payment. If your upgrade does not appear automatically, please refresh."
                  : "You can restart the checkout at any time from the upgrade screen."}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg border bg-muted/30 p-4 text-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Package</span>
              <span className="font-semibold">{tier || "Not specified"}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Stripe session</span>
              <span className="font-mono text-xs truncate max-w-[220px]">
                {sessionId || "N/A"}
              </span>
            </div>
          </div>

          <div className="flex justify-between">
            <Button variant="outline" onClick={() => navigate(-1)}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go back
            </Button>
            <Button onClick={() => navigate("/home")}>
              Return to dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}










