import type { RefereeDetails } from '@/types/referee';
import { updateReferee, getPendingReferees, getOverdueReferees } from './refereeStorage';
import { generateReminderEmail } from './emailTemplates';

export function scheduleReminders(refereeId: string, refereeName: string): void {
  console.log(`📅 Scheduled reminders for referee ${refereeName}:`);
  console.log('  - Day 3: First reminder');
  console.log('  - Day 7: Second reminder');
  console.log('  - Day 10: Mark as overdue');
}

export function sendReminder(
  referee: RefereeDetails,
  candidateName: string,
  reminderNumber: number
): void {
  const questionnaireUrl = `${window.location.origin}/reference/${referee.token}`;
  const emailHtml = generateReminderEmail(referee, candidateName, questionnaireUrl, reminderNumber);
  
  console.log(`📧 Sending reminder ${reminderNumber} to:`, referee.email);
  console.log('Email HTML:', emailHtml);
  
  updateReferee(referee.id, {
    lastReminderDate: new Date().toISOString()
  });
}

export function processScheduledReminders(): void {
  const pending = getPendingReferees();
  const now = new Date();
  
  pending.forEach(referee => {
    if (!referee.invitedDate) return;
    
    const invitedDate = new Date(referee.invitedDate);
    const daysSinceInvite = Math.floor((now.getTime() - invitedDate.getTime()) / (1000 * 60 * 60 * 24));
    
    const lastReminderDate = referee.lastReminderDate ? new Date(referee.lastReminderDate) : null;
    const daysSinceLastReminder = lastReminderDate
      ? Math.floor((now.getTime() - lastReminderDate.getTime()) / (1000 * 60 * 60 * 24))
      : daysSinceInvite;
    
    // Send first reminder after 3 days
    if (daysSinceInvite >= 3 && daysSinceInvite < 7 && !lastReminderDate) {
      console.log('Sending first reminder for referee:', referee.id);
      // sendReminder would be called here with actual candidate name
    }
    
    // Send second reminder after 7 days
    if (daysSinceInvite >= 7 && daysSinceLastReminder >= 4) {
      console.log('Sending second reminder for referee:', referee.id);
      // sendReminder would be called here with actual candidate name
    }
  });
}

export function markOverdueReferees(): void {
  const overdue = getOverdueReferees();
  
  overdue.forEach(referee => {
    if (referee.status !== 'overdue') {
      console.log('Marking referee as overdue:', referee.id);
      updateReferee(referee.id, { status: 'overdue' });
    }
  });
}

export function getReminderStats(): {
  pendingReminders: number;
  overdueCount: number;
} {
  const pending = getPendingReferees();
  const overdue = getOverdueReferees();
  
  return {
    pendingReminders: pending.length,
    overdueCount: overdue.length
  };
}
