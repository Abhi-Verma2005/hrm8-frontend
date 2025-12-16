import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useConsultantAuth } from "@/contexts/ConsultantAuthContext";
import { consultantService, ConsultantProfile } from "@/lib/consultant/consultantService";

const DISMISS_KEY = "hrm8_consultant_profile_reminder_dismissed_until";

function isProfileComplete(profile: ConsultantProfile): boolean {
  const hasBasicInfo =
    !!profile.firstName &&
    !!profile.lastName &&
    !!profile.phone &&
    !!profile.address &&
    !!profile.city &&
    !!profile.stateProvince &&
    !!profile.country;

  const hasLanguages =
    Array.isArray(profile.languages) &&
    profile.languages.length > 0 &&
    profile.languages.every((l) => l.language && l.proficiency);

  const hasIndustries =
    Array.isArray(profile.industryExpertise) &&
    profile.industryExpertise.length > 0 &&
    profile.industryExpertise.length <= 5;

  const hasPayment =
    !!profile.paymentMethod && Object.keys(profile.paymentMethod || {}).length > 0;

  const hasTax =
    !!profile.taxInformation && Object.keys(profile.taxInformation || {}).length > 0;

  return hasBasicInfo && hasLanguages && hasIndustries && hasPayment && hasTax;
}

export function ConsultantProfileCompletionDialog() {
  const { isAuthenticated } = useConsultantAuth();
  const [open, setOpen] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isAuthenticated) {
      setOpen(false);
      return;
    }

    // Don't show the dialog on the profile page itself
    if (location.pathname.startsWith("/consultant/profile")) {
      return;
    }

    const dismissedUntilRaw = localStorage.getItem(DISMISS_KEY);
    if (dismissedUntilRaw) {
      const ts = Number(dismissedUntilRaw);
      if (!Number.isNaN(ts) && ts > Date.now()) {
        setLoadingProfile(false);
        return;
      }
    }

    const checkProfile = async () => {
      try {
        const response = await consultantService.getProfile();
        const profile = response.success ? response.data?.consultant : null;
        if (profile && !isProfileComplete(profile)) {
          setOpen(true);
        }
      } finally {
        setLoadingProfile(false);
      }
    };

    checkProfile();
  }, [isAuthenticated, location.pathname]);

  const handleCompleteNow = () => {
    setOpen(false);
    navigate("/consultant/profile?onboarding=1");
  };

  const handleRemindLater = () => {
    // Snooze for 24 hours
    const until = Date.now() + 24 * 60 * 60 * 1000;
    localStorage.setItem(DISMISS_KEY, String(until));
    setOpen(false);
  };

  if (!isAuthenticated || loadingProfile) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Complete your consultant profile</DialogTitle>
          <DialogDescription>
            To receive managed recruitment assignments and commissions, please finish setting up your profile.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-1 text-sm text-muted-foreground">
          <p>Required before we can fully allocate jobs to you:</p>
          <ul className="list-disc list-inside space-y-0.5">
            <li>Contact & address details</li>
            <li>Languages & proficiency</li>
            <li>Up to 5 industry expertise niches</li>
            <li>Payment and tax information</li>
          </ul>
        </div>
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={handleRemindLater}>
            Remind me later
          </Button>
          <Button onClick={handleCompleteNow}>
            Complete profile now
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}























