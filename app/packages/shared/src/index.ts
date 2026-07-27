export type EventType = "TWENTY_NINE_SECONDS" | "SHORTFORM_KING";

export type DreamOperationStatus =
  | "PREPARING"
  | "RECRUITING"
  | "SELECTING"
  | "SUBMISSION_RUNNING"
  | "FINAL_REVIEW"
  | "CERTIFICATE_RUNNING"
  | "SCORE_REPORT_RUNNING"
  | "READY_TO_CLOSE"
  | "CLOSED";

export type ApplicationStatus =
  | "SUBMITTED"
  | "SELECTED"
  | "WAITLISTED"
  | "NOT_SELECTED"
  | "CANCELED";

export type MatchStatus = "MATCHED" | "NEEDS_REVIEW" | "MISSING";

export type TrustStatus = "BENEFIT" | "NORMAL" | "PENALTY";

export type WorkRecord = {
  id: string;
  title: string;
  directorOrEntrant: string;
  affiliationName: string;
  submissionUrl?: string;
  preliminaryScore?: number;
  rank?: number;
  finalRoundStatus?: "ADVANCED" | "NOT_ADVANCED" | "NOT_USED";
  matchStatus: MatchStatus;
  matchReason: string;
};

export type DreamEventSummary = {
  id: string;
  title: string;
  eventType: EventType;
  status: DreamOperationStatus;
  contestPeriod: string;
  submissionDeadlineLabel: string;
  topic: string;
  prize: string;
  selectedSchoolCount: number;
  expectedSubmissionCount: number;
  confirmedSubmissionCount: number;
  reviewRequiredCount: number;
  mailQueueCount: number;
};

export type TeacherParticipation = {
  id: string;
  dreamEventId: string;
  eventTitle: string;
  eventType: EventType;
  schoolName: string;
  affiliationName: string;
  teacherName: string;
  trustStatus: TrustStatus;
  expectedSubmissionCount: number;
  confirmedSubmissionCount: number;
  certificateStatus: "NOT_READY" | "READY" | "APPROVED";
  scoreReportStatus: "NOT_READY" | "READY" | "PUBLISHED";
  snackSupportLabel: string;
  nextAction: string;
  works: WorkRecord[];
};

export const eventTypeLabels: Record<EventType, string> = {
  TWENTY_NINE_SECONDS: "29s Film Festival",
  SHORTFORM_KING: "29 Shortform King"
};

export const operationStatusLabels: Record<DreamOperationStatus, string> = {
  PREPARING: "Preparing",
  RECRUITING: "Recruiting",
  SELECTING: "Selecting",
  SUBMISSION_RUNNING: "Submission Check",
  FINAL_REVIEW: "Final Review",
  CERTIFICATE_RUNNING: "Certificates",
  SCORE_REPORT_RUNNING: "Score Reports",
  READY_TO_CLOSE: "Ready To Close",
  CLOSED: "Closed"
};

export const exactMatchOnlyNotice =
  "Automatic matching is allowed only when the Dream Project school name exactly matches the Excel affiliation or team name.";

export const dreamWorkflowSteps = [
  "Create event",
  "Start recruitment",
  "Review applications",
  "Assign coupons and schedule mail",
  "Upload submission Excel",
  "Resolve review items",
  "Approve final submission list",
  "Issue certificates",
  "Publish score reports",
  "Close and archive"
] as const;
