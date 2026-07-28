import { promises as fs } from "node:fs";
import path from "node:path";
import type {
  AdminNotice,
  AppState,
  Coupon,
  DashboardResponse,
  DreamApplication,
  DreamEvent,
  SubmissionWork,
  TeacherProfile
} from "./with-types";
import { isDatabaseConfigured } from "./prisma";
import {
  addDbApplication,
  addDbCertificateTemplate,
  addDbCoupons,
  addDbEvent,
  analyzeDbSubmissions,
  buildDbDashboard,
  readDbState,
  resetDbState,
  updateDbApplicationStatus
} from "./db-store";

const emptyState: AppState = {
  events: [],
  registeredTeachers: [],
  teachers: [],
  applications: [],
  submissions: [],
  coupons: [],
  certificateTemplates: [],
  notices: []
};

const dataDir =
  process.env.DATA_DIR ||
  (process.env.VERCEL ? "/tmp/29with-data" : path.join(process.cwd(), ".data"));

const dataFile = path.join(dataDir, "29with-state.json");

function cloneState(state: AppState): AppState {
  return JSON.parse(JSON.stringify(state)) as AppState;
}

function now() {
  return new Date().toISOString();
}

function id(prefix: string) {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

async function ensureDataFile() {
  await fs.mkdir(dataDir, { recursive: true });
  try {
    await fs.access(dataFile);
  } catch {
    await fs.writeFile(dataFile, JSON.stringify(emptyState, null, 2), "utf8");
  }
}

export async function readState(): Promise<AppState> {
  if (isDatabaseConfigured()) return readDbState();
  await ensureDataFile();
  const raw = await fs.readFile(dataFile, "utf8");
  return { ...cloneState(emptyState), ...(JSON.parse(raw) as Partial<AppState>) };
}

export async function writeState(state: AppState): Promise<AppState> {
  await fs.mkdir(dataDir, { recursive: true });
  await fs.writeFile(dataFile, JSON.stringify(state, null, 2), "utf8");
  return state;
}

export function buildDashboard(state: AppState): DashboardResponse {
  if (isDatabaseConfigured()) return buildDbDashboard(state);
  const activeEventIds = new Set(
    state.events.filter((event) => event.status !== "CLOSED").map((event) => event.id)
  );
  const selectedApplications = state.applications.filter((application) => application.status === "SELECTED");
  const confirmedSubmissions = state.submissions.filter((work) => work.matchStatus === "MATCHED");
  const reviewRequired = state.submissions.filter((work) => work.matchStatus === "NEEDS_REVIEW");

  return {
    ...state,
    stats: {
      activeEventCount: activeEventIds.size,
      selectedSchoolCount: selectedApplications.length,
      expectedSubmissionCount: selectedApplications.reduce(
        (sum, application) => sum + application.expectedSubmissionCount,
        0
      ),
      confirmedSubmissionCount: confirmedSubmissions.length,
      reviewRequiredCount: reviewRequired.length,
      unusedCouponCount: state.coupons.filter((coupon) => coupon.status === "UNUSED").length
    }
  };
}

export async function resetState() {
  if (isDatabaseConfigured()) return resetDbState();
  return writeState(cloneState(emptyState));
}

export async function addEvent(input: Omit<DreamEvent, "id" | "createdAt">) {
  if (isDatabaseConfigured()) return addDbEvent(input);
  const state = await readState();
  const event: DreamEvent = {
    id: id("event"),
    createdAt: now(),
    ...input
  };
  state.events.unshift(event);
  state.notices.unshift(makeNotice("행사 등록", `${event.title} 행사가 등록되었습니다.`));
  await writeState(state);
  return buildDashboard(state);
}

export async function addCoupons(couponNumbers: string[], upload?: { fileName?: string; dataUrl?: string }) {
  if (isDatabaseConfigured()) return addDbCoupons(couponNumbers, upload);
  const state = await readState();
  const existing = new Set(state.coupons.map((coupon) => coupon.couponNumber.toUpperCase()));
  const seenInUpload = new Set<string>();
  const normalized = couponNumbers
    .map((couponNumber) => couponNumber.trim())
    .filter(isCouponLike)
    .filter((couponNumber) => {
      const key = couponNumber.toUpperCase();
      if (existing.has(key) || seenInUpload.has(key)) return false;
      seenInUpload.add(key);
      return true;
    });

  const coupons: Coupon[] = normalized.map((couponNumber) => ({
    id: id("coupon"),
    couponNumber,
    status: "UNUSED",
    uploadedAt: now()
  }));
  if (!coupons.length) throw new Error("새로 등록할 쿠폰 번호가 없습니다. 중복 번호 또는 파일 형식을 확인해 주세요.");

  state.coupons.unshift(...coupons);
  state.notices.unshift(makeNotice("쿠폰 업로드", `쿠폰 번호 ${coupons.length}개를 인식했습니다.`));
  await writeState(state);
  return buildDashboard(state);
}

export async function addCertificateTemplate(fileName: string, dataUrl?: string) {
  if (isDatabaseConfigured()) return addDbCertificateTemplate(fileName, dataUrl);
  const state = await readState();
  state.certificateTemplates.unshift({
    id: id("template"),
    fileName,
    dataUrl,
    uploadedAt: now()
  });
  state.notices.unshift(makeNotice("활동확인서 템플릿", `${fileName} 파일을 저장했습니다.`));
  await writeState(state);
  return buildDashboard(state);
}

export async function analyzeSubmissions(
  eventId: string,
  rows: Array<Record<string, string | number | undefined>>,
  upload?: { fileName?: string; dataUrl?: string }
) {
  if (isDatabaseConfigured()) return analyzeDbSubmissions(eventId, rows, upload);
  const state = await readState();
  const event = state.events.find((item) => item.id === eventId);
  if (!event) throw new Error("행사를 찾을 수 없습니다.");

  const applications = state.applications.filter((application) => application.eventId === eventId && application.status === "SELECTED");
  if (!applications.length) throw new Error("선정된 학교가 없습니다. 신청/선정을 먼저 완료해 주세요.");
  const works = rows
    .map((row) => normalizeSubmissionRow(eventId, row, applications))
    .filter((work) => work.affiliationName || work.title || work.participantName);
  if (!works.length || !works.some((work) => work.affiliationName)) {
    throw new Error("엑셀에서 소속/소속명/팀명 열을 찾지 못했습니다. 파일의 첫 행 제목을 확인해 주세요.");
  }

  state.submissions = state.submissions.filter((work) => work.eventId !== eventId).concat(rankWorks(works));
  state.notices.unshift(
    makeNotice(
      "출품 목록 분석",
      `총 ${works.length}건 분석, 자동 확인 ${works.filter((work) => work.matchStatus === "MATCHED").length}건, 확인 필요 ${works.filter((work) => work.matchStatus === "NEEDS_REVIEW").length}건`
    )
  );
  await writeState(state);
  return buildDashboard(state);
}

export async function addApplication(input: {
  eventId: string;
  schoolName: string;
  teacherName: string;
  email: string;
  phone?: string;
  affiliationName: string;
  expectedSubmissionCount: number;
  plannedSubmissionDate?: string;
  usagePlan?: string;
  memo?: string;
}) {
  if (isDatabaseConfigured()) return addDbApplication(input);
  const state = await readState();
  if (state.applications.some((application) => application.eventId === input.eventId && application.teacherProfileId === state.teachers.find((teacher) => teacher.email === input.email)?.id)) {
    throw new Error("이미 신청한 행사입니다. 신청 현황에서 상태를 확인해 주세요.");
  }
  const teacher =
    state.teachers.find((item) => item.email === input.email) ??
    ({
      id: id("teacher"),
      schoolName: input.schoolName,
      teacherName: input.teacherName,
      email: input.email,
      phone: input.phone || "",
      affiliationName: input.affiliationName,
      trustStatus: "NORMAL"
    } satisfies TeacherProfile);
  if (!state.teachers.some((item) => item.id === teacher.id)) state.teachers.unshift(teacher);
  state.applications.unshift({
    id: id("application"),
    eventId: input.eventId,
    teacherProfileId: teacher.id,
    schoolName: input.schoolName,
    affiliationName: input.affiliationName,
    expectedSubmissionCount: Math.max(1, input.expectedSubmissionCount || 1),
    usagePlan: input.usagePlan || "",
    plannedSubmissionDate: input.plannedSubmissionDate || "",
    memo: input.memo || "",
    status: "SUBMITTED",
    createdAt: now()
  });
  state.notices.unshift(makeNotice("신청 접수", `${input.schoolName} ${input.teacherName} 선생님의 신청을 접수했습니다.`));
  await writeState(state);
  return buildDashboard(state);
}

export async function updateApplicationStatus(applicationId: string, status: "SELECTED" | "WAITLISTED" | "NOT_SELECTED") {
  if (isDatabaseConfigured()) return updateDbApplicationStatus(applicationId, status);
  const state = await readState();
  const application = state.applications.find((item) => item.id === applicationId);
  if (!application) throw new Error("신청을 찾을 수 없습니다.");
  application.status = status;
  if (status === "SELECTED") {
    const coupon = state.coupons.find((item) => item.status === "UNUSED");
    if (coupon) {
      coupon.status = "ASSIGNED";
      coupon.assignedApplicationId = application.id;
    }
  }
  state.notices.unshift(makeNotice("신청 상태 변경", `${application.schoolName} 신청을 ${status} 처리했습니다.`));
  await writeState(state);
  return buildDashboard(state);
}

export async function updateEventStatus(eventId: string, status: DreamEvent["status"]) {
  if (isDatabaseConfigured()) {
    const { updateDbEventStatus } = await import("./db-store");
    return updateDbEventStatus(eventId, status);
  }
  const state = await readState();
  const event = state.events.find((item) => item.id === eventId);
  if (!event) throw new Error("행사를 찾을 수 없습니다.");
  assertNextEventStatus(event.status, status);
  event.status = status;
  state.notices.unshift(makeNotice("행사 단계 변경", `${event.title} 상태를 ${status} 단계로 변경했습니다.`));
  await writeState(state);
  return buildDashboard(state);
}

export async function confirmSubmissionMatch(externalSubmissionId: string, applicationId: string) {
  if (isDatabaseConfigured()) {
    const { confirmDbSubmissionMatch } = await import("./db-store");
    return confirmDbSubmissionMatch(externalSubmissionId, applicationId);
  }
  const state = await readState();
  const work = state.submissions.find((item) => item.id === externalSubmissionId);
  const application = state.applications.find((item) => item.id === applicationId);
  if (!work || !application || work.eventId !== application.eventId) throw new Error("매칭할 신청 정보를 찾을 수 없습니다.");
  work.applicationId = application.id;
  work.schoolName = application.schoolName;
  work.matchStatus = "MATCHED";
  work.matchReason = "관리자가 신청 학교와 출품작을 직접 확인했습니다.";
  state.notices.unshift(makeNotice("출품 수동 매칭", `${application.schoolName} · ${work.title}`));
  await writeState(state);
  return buildDashboard(state);
}

const eventStatusSequence: DreamEvent["status"][] = [
  "PREPARING",
  "RECRUITING",
  "SELECTING",
  "SUBMISSION_RUNNING",
  "FINAL_REVIEW",
  "CERTIFICATE_RUNNING",
  "SCORE_REPORT_RUNNING",
  "READY_TO_CLOSE",
  "CLOSED"
];

function assertNextEventStatus(current: DreamEvent["status"], next: DreamEvent["status"]) {
  const currentIndex = eventStatusSequence.indexOf(current);
  if (eventStatusSequence[currentIndex + 1] !== next) {
    throw new Error("행사 단계는 운영 순서에 따라 한 단계씩 변경할 수 있습니다.");
  }
}

function normalizeSubmissionRow(
  eventId: string,
  row: Record<string, string | number | undefined>,
  applications: DreamApplication[]
): SubmissionWork {
  const affiliationName = text(pick(row, ["소속", "소속명", "팀명", "affiliation", "team"]));
  const title = text(pick(row, ["작품명", "작품제목", "제목", "title"]));
  const participantName = text(pick(row, ["감독", "출품자", "이름", "participant", "director"]));
  const submissionUrl = text(pick(row, ["출품 URL", "출품URL", "보기 URL", "영상 URL", "URL", "url", "링크"]));
  const score = number(pick(row, ["예심평점", "평점", "일반평점", "score"]));
  const finalResult = text(pick(row, ["수상결과", "본심", "finalResult"]));
  const exact = applications.find(
    (application) => application.affiliationName === affiliationName || application.schoolName === affiliationName
  );
  const similar = exact
    ? undefined
    : applications.find(
        (application) => isSimilar(application.affiliationName, affiliationName) || isSimilar(application.schoolName, affiliationName)
      );

  return {
    id: id("work"),
    eventId,
    applicationId: exact?.id ?? similar?.id,
    schoolName: exact?.schoolName ?? similar?.schoolName ?? "",
    affiliationName,
    title,
    participantName,
    submissionUrl,
    preliminaryScore: score,
    finalResult,
    finalRoundStatus: finalResult === "1차통과" ? "ADVANCED" : finalResult ? "NOT_ADVANCED" : "NOT_USED",
    matchStatus: exact ? "MATCHED" : similar ? "NEEDS_REVIEW" : "MISSING",
    matchReason: exact
      ? "신청한 출품 소속명과 완전히 일치합니다."
      : similar
        ? "띄어쓰기 또는 한 글자 차이가 있어 관리자 확인이 필요합니다."
        : "일치하는 신청 학교가 없습니다."
  };
}

function rankWorks(works: SubmissionWork[]) {
  const grouped = new Map<string, SubmissionWork[]>();
  for (const work of works) {
    const key = work.affiliationName || "미분류";
    grouped.set(key, [...(grouped.get(key) ?? []), work]);
  }

  for (const group of grouped.values()) {
    group
      .sort((left, right) => (right.preliminaryScore ?? -1) - (left.preliminaryScore ?? -1))
      .forEach((work, index) => {
        work.rank = index + 1;
      });
  }

  return works;
}

function pick(row: Record<string, string | number | undefined>, keys: string[]) {
  const normalizedEntries = new Map(
    Object.entries(row).map(([key, value]) => [normalizeKey(key), value])
  );
  for (const key of keys) {
    const value = row[key] ?? normalizedEntries.get(normalizeKey(key));
    if (value != null && value !== "") return value;
  }
  return undefined;
}

function normalizeKey(value: string) {
  return value.replace(/\s/g, "").toLowerCase();
}

function isSimilar(left: string, right: string) {
  const normalizedLeft = left.replace(/\s/g, "");
  const normalizedRight = right.replace(/\s/g, "");
  if (!normalizedLeft || !normalizedRight) return false;
  if (normalizedLeft === normalizedRight) return true;
  return levenshtein(normalizedLeft, normalizedRight) <= 1;
}

function levenshtein(left: string, right: string) {
  const dp = Array.from({ length: left.length + 1 }, () => Array(right.length + 1).fill(0));
  for (let i = 0; i <= left.length; i += 1) dp[i][0] = i;
  for (let j = 0; j <= right.length; j += 1) dp[0][j] = j;
  for (let i = 1; i <= left.length; i += 1) {
    for (let j = 1; j <= right.length; j += 1) {
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + (left[i - 1] === right[j - 1] ? 0 : 1)
      );
    }
  }
  return dp[left.length][right.length];
}

function isCouponLike(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return false;
  if (/^(쿠폰|쿠폰번호|번호|coupon|couponcode|code)$/i.test(trimmed.replace(/\s/g, ""))) return false;
  return /[A-Za-z0-9]{2,}(?:-[A-Za-z0-9]{2,})+/.test(trimmed) || /^[A-Za-z0-9]{6,}$/.test(trimmed);
}

function text(value: string | number | undefined) {
  return value == null ? "" : String(value).trim();
}

function number(value: string | number | undefined) {
  if (value == null || value === "") return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function makeNotice(type: string, message: string): AdminNotice {
  return {
    id: id("notice"),
    type,
    message,
    status: "OPEN",
    createdAt: now()
  };
}
