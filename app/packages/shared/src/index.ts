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
  | "DRAFT"
  | "SUBMITTED"
  | "UNDER_REVIEW"
  | "SELECTED"
  | "WAITLISTED"
  | "NOT_SELECTED"
  | "CANCELED";

export type SubmissionSlotStatus =
  | "NOT_SUBMITTED"
  | "PENDING"
  | "AUTO_CONFIRMED"
  | "MANUALLY_CONFIRMED"
  | "NEEDS_REVIEW"
  | "UNCONFIRMED"
  | "EXCLUDED";

export const exactMatchOnlyNotice =
  "출품 소속명/팀명은 실제 출품 시 입력하는 이름과 띄어쓰기까지 동일해야 합니다.";
