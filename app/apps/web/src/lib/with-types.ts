export type EventType = "TWENTY_NINE_SECONDS" | "SHORTFORM_KING";

export type EventStatus =
  | "PREPARING"
  | "RECRUITING"
  | "SELECTING"
  | "SUBMISSION_RUNNING"
  | "FINAL_REVIEW"
  | "CERTIFICATE_READY"
  | "SCORE_READY"
  | "CLOSED";

export type MatchStatus = "MATCHED" | "NEEDS_REVIEW" | "MISSING";

export type DreamEvent = {
  id: string;
  title: string;
  eventType: EventType;
  status: EventStatus;
  posterUrl: string;
  contestPeriod: string;
  topic: string;
  prize: string;
  homepageUrl: string;
  submissionUrl: string;
  notice: string;
  targetSubmissionCount: number;
  createdAt: string;
};

export type TeacherProfile = {
  id: string;
  schoolName: string;
  teacherName: string;
  email: string;
  phone: string;
  affiliationName: string;
  verificationFileName?: string;
  trustStatus: "BENEFIT" | "NORMAL" | "PENALTY";
};

export type DreamApplication = {
  id: string;
  eventId: string;
  teacherProfileId: string;
  schoolName: string;
  affiliationName: string;
  expectedSubmissionCount: number;
  usagePlan: string;
  plannedSubmissionDate: string;
  memo: string;
  status: "SUBMITTED" | "SELECTED" | "WAITLISTED" | "NOT_SELECTED";
  createdAt: string;
};

export type SubmissionWork = {
  id: string;
  eventId: string;
  applicationId?: string;
  schoolName: string;
  affiliationName: string;
  title: string;
  participantName: string;
  submissionUrl: string;
  preliminaryScore?: number;
  finalResult?: string;
  rank?: number;
  finalRoundStatus?: "ADVANCED" | "NOT_ADVANCED" | "NOT_USED";
  matchStatus: MatchStatus;
  matchReason: string;
};

export type Coupon = {
  id: string;
  couponNumber: string;
  status: "UNUSED" | "ASSIGNED";
  assignedApplicationId?: string;
  uploadedAt: string;
};

export type CertificateTemplate = {
  id: string;
  fileName: string;
  dataUrl?: string;
  uploadedAt: string;
};

export type AdminNotice = {
  id: string;
  type: string;
  message: string;
  status: "OPEN" | "DONE";
  createdAt: string;
};

export type AppState = {
  events: DreamEvent[];
  teachers: TeacherProfile[];
  applications: DreamApplication[];
  submissions: SubmissionWork[];
  coupons: Coupon[];
  certificateTemplates: CertificateTemplate[];
  notices: AdminNotice[];
};

export type DashboardResponse = AppState & {
  stats: {
    activeEventCount: number;
    selectedSchoolCount: number;
    expectedSubmissionCount: number;
    confirmedSubmissionCount: number;
    reviewRequiredCount: number;
    unusedCouponCount: number;
  };
};

export const eventTypeLabels: Record<EventType, string> = {
  TWENTY_NINE_SECONDS: "29초영화제",
  SHORTFORM_KING: "29역숏폼왕"
};

export const statusLabels: Record<EventStatus, string> = {
  PREPARING: "등록",
  RECRUITING: "모집중",
  SELECTING: "선정중",
  SUBMISSION_RUNNING: "출품 확인",
  FINAL_REVIEW: "최종 확인",
  CERTIFICATE_READY: "활동확인서",
  SCORE_READY: "심사표",
  CLOSED: "종료"
};
