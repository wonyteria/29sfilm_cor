import { promises as fs } from "node:fs";
import path from "node:path";
import type { AdminNotice, AppState, Coupon, DashboardResponse, DreamApplication, DreamEvent, SubmissionWork } from "./with-types";

const emptyState: AppState = {
  events: [],
  teachers: [],
  applications: [],
  submissions: [],
  coupons: [],
  certificateTemplates: [],
  notices: []
};

const dataDir = process.env.DATA_DIR || (process.env.VERCEL ? "/tmp/29with-data" : path.join(process.cwd(), ".data"));
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
  const activeEventIds = new Set(state.events.filter((event) => event.status !== "CLOSED").map((event) => event.id));
  const selectedApplications = state.applications.filter((application) => application.status === "SELECTED");
  const confirmedSubmissions = state.submissions.filter((work) => work.matchStatus === "MATCHED");
  const reviewRequired = state.submissions.filter((work) => work.matchStatus === "NEEDS_REVIEW");

  return {
    ...state,
    stats: {
      activeEventCount: activeEventIds.size,
      selectedSchoolCount: selectedApplications.length,
      expectedSubmissionCount: selectedApplications.reduce((sum, application) => sum + application.expectedSubmissionCount, 0),
      confirmedSubmissionCount: confirmedSubmissions.length,
      reviewRequiredCount: reviewRequired.length,
      unusedCouponCount: state.coupons.filter((coupon) => coupon.status === "UNUSED").length
    }
  };
}

export async function resetState() {
  return writeState(cloneState(emptyState));
}

export async function addEvent(input: Omit<DreamEvent, "id" | "createdAt" | "status"> & { status?: DreamEvent["status"] }) {
  const state = await readState();
  const event: DreamEvent = {
    id: id("event"),
    status: input.status ?? "PREPARING",
    createdAt: now(),
    ...input
  };
  state.events.unshift(event);
  state.notices.unshift(makeNotice("행사 등록", `${event.title} 행사가 등록되었습니다.`));
  await writeState(state);
  return buildDashboard(state);
}

export async function addCoupons(couponNumbers: string[]) {
  const state = await readState();
  const existing = new Set(state.coupons.map((coupon) => coupon.couponNumber));
  const coupons: Coupon[] = couponNumbers
    .map((couponNumber) => couponNumber.trim())
    .filter(Boolean)
    .filter((couponNumber) => !existing.has(couponNumber))
    .map((couponNumber) => ({
      id: id("coupon"),
      couponNumber,
      status: "UNUSED",
      uploadedAt: now()
    }));

  state.coupons.unshift(...coupons);
  state.notices.unshift(makeNotice("쿠폰 업로드", `쿠폰 번호 ${coupons.length}개를 인식했습니다.`));
  await writeState(state);
  return buildDashboard(state);
}

export async function addCertificateTemplate(fileName: string, dataUrl?: string) {
  const state = await readState();
  state.certificateTemplates.unshift({
    id: id("template"),
    fileName,
    dataUrl,
    uploadedAt: now()
  });
  state.notices.unshift(makeNotice("활동확인서 템플릿", `${fileName} 템플릿을 저장했습니다.`));
  await writeState(state);
  return buildDashboard(state);
}

export async function analyzeSubmissions(eventId: string, rows: Array<Record<string, string | number | undefined>>) {
  const state = await readState();
  const event = state.events.find((item) => item.id === eventId);
  if (!event) throw new Error("행사를 찾을 수 없습니다.");

  const applications = state.applications.filter((application) => application.eventId === eventId);
  const works = rows.map((row) => normalizeSubmissionRow(eventId, row, applications));
  state.submissions = state.submissions.filter((work) => work.eventId !== eventId).concat(works);
  state.notices.unshift(
    makeNotice(
      "출품 엑셀 분석",
      `자동 매칭 ${works.filter((work) => work.matchStatus === "MATCHED").length}건, 확인 필요 ${works.filter((work) => work.matchStatus === "NEEDS_REVIEW").length}건`
    )
  );
  await writeState(state);
  return buildDashboard(state);
}

function normalizeSubmissionRow(eventId: string, row: Record<string, string | number | undefined>, applications: DreamApplication[]): SubmissionWork {
  const affiliationName = text(row["소속"] ?? row["소속명"] ?? row["팀명"] ?? row["affiliation"] ?? row["team"]);
  const title = text(row["작품명"] ?? row["작품제목"] ?? row["제목"] ?? row["title"]);
  const participantName = text(row["감독"] ?? row["출품자"] ?? row["이름"] ?? row["participant"] ?? row["director"]);
  const submissionUrl = text(row["출품 URL"] ?? row["URL"] ?? row["url"] ?? row["링크"]);
  const score = number(row["예심평점"] ?? row["평점"] ?? row["score"]);
  const finalResult = text(row["수상결과"] ?? row["본심"] ?? row["finalResult"]);
  const exact = applications.find((application) => application.affiliationName === affiliationName);
  const similar = exact ? undefined : applications.find((application) => isSimilar(application.affiliationName, affiliationName));

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
    matchReason: exact ? "학교명/소속명이 완전히 일치합니다." : similar ? "띄어쓰기 또는 일부 글자 차이를 확인해야 합니다." : "일치하는 신청 학교가 없습니다."
  };
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
