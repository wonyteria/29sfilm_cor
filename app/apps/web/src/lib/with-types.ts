export type EventType = "TWENTY_NINE_SECONDS" | "SHORTFORM_KING";

export type EventStatus =
  | "PREPARING"
  | "RECRUITING"
  | "SELECTING"
  | "SUBMISSION_RUNNING"
  | "FINAL_REVIEW"
  | "CERTIFICATE_RUNNING"
  | "CERTIFICATE_READY"
  | "SCORE_REPORT_RUNNING"
  | "SCORE_READY"
  | "READY_TO_CLOSE"
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
  PREPARING: "준비",
  RECRUITING: "모집중",
  SELECTING: "선정중",
  SUBMISSION_RUNNING: "출품 확인",
  FINAL_REVIEW: "최종 확인",
  CERTIFICATE_RUNNING: "확인서 발급",
  CERTIFICATE_READY: "확인서 완료",
  SCORE_REPORT_RUNNING: "심사 반영",
  SCORE_READY: "심사 공개",
  READY_TO_CLOSE: "종료 준비",
  CLOSED: "종료"
};

export const applicationStatusLabels: Record<DreamApplication["status"], string> = {
  SUBMITTED: "신청접수",
  SELECTED: "선정",
  WAITLISTED: "예비",
  NOT_SELECTED: "미선정"
};

export const matchStatusLabels: Record<MatchStatus, string> = {
  MATCHED: "자동 확인",
  NEEDS_REVIEW: "확인 필요",
  MISSING: "미매칭"
};
