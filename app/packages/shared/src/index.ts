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
  certificateStatus: "NOT_READY" | "READY";
  scoreReportStatus: "NOT_READY" | "READY";
  snackSupportLabel: string;
  nextAction: string;
  works: Array<{
    id: string;
    title: string;
    directorOrEntrant: string;
    affiliationName: string;
    submissionUrl?: string;
    preliminaryScore?: number;
    rank?: number;
    finalRoundStatus: "ADVANCED" | "NOT_ADVANCED" | "NOT_USED";
    matchStatus: MatchStatus;
    matchReason: string;
  }>;
};

export const eventTypeLabels: Record<EventType, string> = {
  TWENTY_NINE_SECONDS: "29초영화제",
  SHORTFORM_KING: "29역숏폼왕"
};

export const operationStatusLabels: Record<DreamOperationStatus, string> = {
  PREPARING: "행사 등록",
  RECRUITING: "모집중",
  SELECTING: "선정 검토",
  SUBMISSION_RUNNING: "출품 확인",
  FINAL_REVIEW: "최종 확인",
  CERTIFICATE_RUNNING: "확인서 발급",
  SCORE_REPORT_RUNNING: "심사표 반영",
  READY_TO_CLOSE: "종료 가능",
  CLOSED: "히스토리 보관"
};

export const exactMatchOnlyNotice =
  "학교명과 출품 소속명 또는 팀명은 띄어쓰기까지 동일해야 자동 매칭됩니다. 띄어쓰기나 한 글자 차이가 있으면 확인 필요로 분류됩니다.";

export const dreamWorkflowSteps = [
  "행사 등록",
  "꿈프 모집 시작",
  "신청 접수 및 선정",
  "쿠폰 지급 및 안내 메일 예약",
  "출품 엑셀 업로드 및 자동 매칭",
  "확인 필요 항목 조치",
  "최종 출품 리스트 승인",
  "활동확인서 발급",
  "심사 결과 반영",
  "꿈프 종료 및 히스토리 보관"
] as const;
