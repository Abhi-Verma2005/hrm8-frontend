export interface FeedbackConflict {
  feedbackId: string;
  field: string;
  localValue: any;
  remoteValue: any;
  localUser: string;
  remoteUser: string;
  localTimestamp: Date;
  remoteTimestamp: Date;
}

export interface ConflictResolution {
  feedbackId: string;
  field: string;
  chosenValue: any;
  resolution: 'keep-local' | 'accept-remote' | 'merge';
  resolvedBy: string;
  resolvedAt: Date;
}

export type ConflictDetectionResult = {
  hasConflicts: boolean;
  conflicts: FeedbackConflict[];
};
