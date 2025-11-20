import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

const ONBOARDING_SKIP_KEY = 'hrm8OnboardingSkipUntil';

const isOnboardingSnoozed = (): boolean => {
  const skipUntilRaw = localStorage.getItem(ONBOARDING_SKIP_KEY);
  if (!skipUntilRaw) {
    return false;
  }
  const skipUntil = new Date(skipUntilRaw).getTime();
  if (Number.isNaN(skipUntil) || skipUntil < Date.now()) {
    localStorage.removeItem(ONBOARDING_SKIP_KEY);
    return false;
  }
  return true;
};

export function OnboardingReminderBanner() {
  const { profileSummary, snoozeOnboardingReminder } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSnoozed, setIsSnoozed] = useState(() => isOnboardingSnoozed());

  // Check snooze status periodically and on storage changes
  useEffect(() => {
    const checkSnooze = () => {
      setIsSnoozed(isOnboardingSnoozed());
    };
    
    checkSnooze();
    const interval = setInterval(checkSnooze, 60000); // Check every minute
    
    // Listen for storage changes (e.g., from other tabs)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === ONBOARDING_SKIP_KEY) {
        checkSnooze();
      }
    };
    
    // Check when window regains focus (user returns to tab)
    const handleFocus = () => {
      checkSnooze();
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('focus', handleFocus);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  if (!profileSummary || profileSummary.status === 'COMPLETED' || isSnoozed) {
    return null;
  }

  const handleRemindLater = () => {
    snoozeOnboardingReminder();
    setIsSnoozed(true);
    toast({
      title: 'We will remind you again soon',
      description: 'Onboarding reminders are snoozed for 12 hours.',
    });
  };

  const handleContinue = () => {
    if (location.pathname !== '/company-profile') {
      navigate('/company-profile');
    }
  };

  return (
    <Alert className="mb-4">
      <AlertTitle>Complete your company profile</AlertTitle>
      <AlertDescription className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          Finish onboarding to unlock job posting, billing, and branding features. You are{' '}
          <span className="font-semibold">{profileSummary.completionPercentage}%</span> done.
        </div>
        <div className="flex gap-2">
          <Button size="sm" onClick={handleContinue}>
            Continue setup
          </Button>
          <Button variant="ghost" size="sm" onClick={handleRemindLater}>
            Remind me later
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
}


