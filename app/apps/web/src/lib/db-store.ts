import type { Prisma } from "@prisma/client";
import { prisma } from "./prisma";
import { storeFileAsset } from "./file-storage";
import type {
  AdminNotice,
  AppState,
  Coupon,
  DashboardResponse,
  DreamApplication,
  DreamEvent,
  EventStatus,
  SubmissionWork,
  TeacherProfile
} from "./with-types";

type Row = Record<string, string | number | undefined>;
type UploadedSubmissionWork = SubmissionWork & { eventType: "TWENTY_NINE_SECONDS" | "SHORTFORM_KING" };
type ApplicationForMatch = {
  id: string;
  schoolNameSnapshot: string;
  affiliationNameSnapshot: string;
  participation: { id: string } | null;
  dreamEvent: { event: { eventType: "TWENTY_NINE_SECONDS" | "SHORTFORM_KING" } };
};

export async function readDbState(): Promise<AppState> {
  const [events, teachers, applications, submissions, coupons, certificateTemplates, notices] = await Promise.all([
    prisma.dreamEvent.findMany({ include: { event: true }, orderBy: { createdAt: "desc" } }),
    prisma.teacherProfile.findMany({ include: { user: true }, orderBy: { createdAt: "desc" } }),
    prisma.dreamApplication.findMany({ orderBy: { appliedAt: "desc" } }),
    prisma.externalSubmission.findMany({
      include: {
        matches: { include: { participation: { include: { application: true } } } },
        connection: { include: { dreamEvent: true } }
      },
      orderBy: { syncedAt: "desc" }
    }),
    prisma.coupon.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.certificateTemplate.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.auditLog.findMany({ orderBy: { createdAt: "desc" }, take: 100 })
  ]);

  return {
    events: events.map((item) => ({
      id: item.id,
      title: item.event.title,
      eventType: item.event.eventType,
      status: item.operationStatus as EventStatus,
      posterUrl: item.event.posterFileId ?? "",
      contestPeriod: formatPeriod(item.event.contestStartAt, item.event.contestEndAt),
      topic: item.event.topic ?? "",
      prize: extractPrize(item.event.notice),
      homepageUrl: item.event.homepageUrl ?? "",
      submissionUrl: item.event.submissionUrl ?? "",
      notice: item.event.notice ?? "",
      targetSubmissionCount: item.targetSubmissionCount ?? 0,
      createdAt: item.createdAt.toISOString()
    })),
    teachers: teachers.map((item) => ({
      id: item.id,
      schoolName: item.schoolName,
      teacherName: item.teacherName,
      email: item.contactEmail || item.user.email,
      phone: item.contactPhone || item.user.phone || "",
      affiliationName: item.affiliationName,
      trustStatus: "NORMAL"
    } satisfies TeacherProfile)),
    applications: applications.map((item) => ({
      id: item.id,
      eventId: item.dreamEventId,
      teacherProfileId: item.teacherProfileId,
      schoolName: item.schoolNameSnapshot,
      affiliationName: item.affiliationNameSnapshot,
      expectedSubmissionCount: item.expectedSubmissionCount,
      usagePlan: item.usagePlan ?? "",
      plannedSubmissionDate: item.plannedSubmissionDate?.toISOString() ?? "",
      memo: item.memo ?? "",
      status: normalizeApplicationStatus(item.status),
      createdAt: item.appliedAt.toISOString()
    } satisfies DreamApplication)),
    submissions: submissions.map((item) => {
      const match = item.matches[0];
      const application = match?.participation.application;
      const matchStatus = match ? (match.matchType === "EXACT" ? "MATCHED" : "NEEDS_REVIEW") : "MISSING";
      const raw = (item.rawData ?? {}) as Record<string, unknown>;
      return {
        id: item.id,
        eventId: item.connection.dreamEventId,
        applicationId: application?.id,
        schoolName: application?.schoolNameSnapshot ?? "",
        affiliationName: item.affiliationName,
        title: item.title,
        participantName: item.participantName ?? "",
        submissionUrl: item.submissionUrl ?? "",
        preliminaryScore: item.preliminaryScore == null ? undefined : Number(item.preliminaryScore),
        finalResult: item.finalResult ?? "",
        rank: typeof raw.rank === "number" ? raw.rank : undefined,
        finalRoundStatus: item.finalResult === "1차통과" ? "ADVANCED" : item.finalResult ? "NOT_ADVANCED" : "NOT_USED",
        matchStatus,
        matchReason: matchReasonFor(matchStatus)
      } satisfies SubmissionWork;
    }),
    coupons: coupons.map((item) => ({
      id: item.id,
      couponNumber: item.couponNumber,
      status: item.status === "ASSIGNED" ? "ASSIGNED" : "UNUSED",
      uploadedAt: item.createdAt.toISOString()
    } satisfies Coupon)),
    certificateTemplates: certificateTemplates.map((item) => ({
      id: item.id,
      fileName: item.name,
      uploadedAt: item.createdAt.toISOString()
    })),
    notices: notices.map((item) => ({
      id: item.id,
      type: item.action,
      message: `${item.entityType} ${item.entityId}`,
      status: "OPEN",
      createdAt: item.createdAt.toISOString()
    } satisfies AdminNotice))
  };
}

export async function resetDbState(): Promise<AppState> {
  await prisma.$transaction(async (tx) => {
    await tx.mailSendLog.deleteMany();
    await tx.mailRecipient.deleteMany();
    await tx.scheduledMail.deleteMany();
    await tx.mailTemplate.deleteMany();
    await tx.scoreReportEntry.deleteMany();
    await tx.scoreReport.deleteMany();
    await tx.activityCertificate.deleteMany();
    await tx.certificateTemplate.deleteMany();
    await tx.snackSupport.deleteMany();
    await tx.couponAssignment.deleteMany();
    await tx.coupon.deleteMany();
    await tx.teacherRequest.deleteMany();
    await tx.submissionMatch.deleteMany();
    await tx.submissionSlot.deleteMany();
    await tx.externalSubmission.deleteMany();
    await tx.externalEventConnection.deleteMany();
    await tx.dreamParticipation.deleteMany();
    await tx.dreamApplication.deleteMany();
    await tx.dreamEvent.deleteMany();
    await tx.event.deleteMany();
    await tx.schoolAdminMemo.deleteMany();
    await tx.schoolParticipationSummary.deleteMany();
    await tx.teacherProfile.deleteMany();
    await tx.fileAsset.deleteMany();
    await tx.auditLog.deleteMany();
    await tx.user.deleteMany({ where: { userType: "TEACHER" } });
  });
  return readDbState();
}

export function buildDbDashboard(state: AppState): DashboardResponse {
  return {
    ...state,
    stats: {
      activeEventCount: state.events.filter((event) => event.status !== "CLOSED").length,
      selectedSchoolCount: state.applications.filter((application) => application.status === "SELECTED").length,
      expectedSubmissionCount: state.applications
        .filter((application) => application.status === "SELECTED")
        .reduce((sum, application) => sum + application.expectedSubmissionCount, 0),
      confirmedSubmissionCount: state.submissions.filter((work) => work.matchStatus === "MATCHED").length,
      reviewRequiredCount: state.submissions.filter((work) => work.matchStatus === "NEEDS_REVIEW").length,
      unusedCouponCount: state.coupons.filter((coupon) => coupon.status === "UNUSED").length
    }
  };
}

export async function addDbEvent(input: Omit<DreamEvent, "id" | "createdAt">) {
  await prisma.$transaction(async (tx) => {
    const event = await tx.event.create({
      data: {
        title: input.title,
        eventType: input.eventType,
        posterFileId: input.posterUrl || null,
        topic: input.topic || null,
        homepageUrl: input.homepageUrl || null,
        submissionUrl: input.submissionUrl || null,
        notice: [input.prize ? `총상금: ${input.prize}` : "", input.notice].filter(Boolean).join("\n") || null,
        status: input.status === "RECRUITING" ? "RECRUITING" : "UPCOMING"
      }
    });
    const dreamEvent = await tx.dreamEvent.create({
      data: {
        eventId: event.id,
        operationStatus: toDreamOperationStatus(input.status),
        targetSubmissionCount: input.targetSubmissionCount
      }
    });
    await audit(tx, "행사 등록", "DreamEvent", dreamEvent.id);
  });
  return buildDbDashboard(await readDbState());
}

export async function addDbApplication(input: {
  eventId: string;
  schoolName: string;
  teacherName: string;
  email: string;
  phone?: string;
  affiliationName: string;
  expectedSubmissionCount: number;
  usagePlan?: string;
  memo?: string;
}) {
  await prisma.$transaction(async (tx) => {
    const user = await tx.user.upsert({
      where: { email: input.email },
      update: { name: input.teacherName, phone: input.phone || null },
      create: {
        userType: "TEACHER",
        name: input.teacherName,
        email: input.email,
        phone: input.phone || null,
        passwordHash: "SET_PASSWORD_ON_FIRST_LOGIN"
      }
    });
    const profile = await tx.teacherProfile.upsert({
      where: { userId: user.id },
      update: {
        schoolName: input.schoolName,
        teacherName: input.teacherName,
        contactPhone: input.phone || null,
        contactEmail: input.email,
        affiliationName: input.affiliationName
      },
      create: {
        userId: user.id,
        schoolName: input.schoolName,
        teacherName: input.teacherName,
        contactPhone: input.phone || null,
        contactEmail: input.email,
        affiliationName: input.affiliationName
      }
    });
    const application = await tx.dreamApplication.create({
      data: {
        dreamEventId: input.eventId,
        teacherProfileId: profile.id,
        schoolNameSnapshot: input.schoolName,
        affiliationNameSnapshot: input.affiliationName,
        expectedSubmissionCount: Math.max(1, input.expectedSubmissionCount || 1),
        usagePlan: input.usagePlan || null,
        memo: input.memo || null,
        status: "SUBMITTED"
      }
    });
    await audit(tx, "신청 접수", "DreamApplication", application.id);
  });
  return buildDbDashboard(await readDbState());
}

export async function updateDbApplicationStatus(applicationId: string, status: "SELECTED" | "WAITLISTED" | "NOT_SELECTED") {
  await prisma.$transaction(async (tx) => {
    const application = await tx.dreamApplication.update({
      where: { id: applicationId },
      data: { status, selectedAt: status === "SELECTED" ? new Date() : null }
    });
    if (status === "SELECTED") {
      const participation = await tx.dreamParticipation.upsert({
        where: { applicationId },
        update: { status: "ACTIVE", expectedSubmissionCount: application.expectedSubmissionCount },
        create: {
          dreamEventId: application.dreamEventId,
          applicationId,
          teacherProfileId: application.teacherProfileId,
          selectedAt: new Date(),
          expectedSubmissionCount: application.expectedSubmissionCount
        }
      });
      for (let slotNo = 1; slotNo <= application.expectedSubmissionCount; slotNo += 1) {
        await tx.submissionSlot.upsert({
          where: { participationId_slotNo: { participationId: participation.id, slotNo } },
          update: {},
          create: { participationId: participation.id, slotNo }
        });
      }
    }
    await audit(tx, "신청 상태 변경", "DreamApplication", applicationId, { status });
  });
  return buildDbDashboard(await readDbState());
}

export async function addDbCoupons(couponNumbers: string[], upload?: { fileName?: string; dataUrl?: string }) {
  const normalized = [...new Set(couponNumbers.map((value) => value.trim()).filter(isCouponLike))];
  await prisma.coupon.createMany({
    data: normalized.map((couponNumber) => ({ couponNumber })),
    skipDuplicates: true
  });
  await prisma.auditLog.create({ data: { action: "쿠폰 업로드", entityType: "Coupon", entityId: `${normalized.length}` } });
  if (upload?.fileName) await storeFileAsset({ originalName: upload.fileName, dataUrl: upload.dataUrl, folder: "coupons" });
  return buildDbDashboard(await readDbState());
}

export async function addDbCertificateTemplate(fileName: string, dataUrl?: string) {
  const file = await storeFileAsset({ originalName: fileName, dataUrl, folder: "certificate-templates" });
  await prisma.certificateTemplate.create({
    data: { name: fileName, fileId: file?.id, isDefault: true }
  });
  await prisma.auditLog.create({ data: { action: "활동확인서 템플릿", entityType: "FileAsset", entityId: file?.id ?? fileName } });
  return buildDbDashboard(await readDbState());
}

export async function analyzeDbSubmissions(eventId: string, rows: Row[], upload?: { fileName?: string; dataUrl?: string }) {
  const applications = await prisma.dreamApplication.findMany({
    where: { dreamEventId: eventId },
    include: { participation: true, dreamEvent: { include: { event: true } } }
  });
  const works = rankWorks(
    rows.map((row) => normalizeSubmissionRow(eventId, row, applications)).filter((work) => work.affiliationName || work.title)
  );

  await prisma.$transaction(async (tx) => {
    const connection = await tx.externalEventConnection.create({
      data: {
        dreamEventId: eventId,
        externalEventKey: `upload-${Date.now()}`,
        externalEventName: upload?.fileName || "관리자 출품 엑셀 업로드",
        status: "SYNCED"
      }
    });
    for (const work of works) {
      const external = await tx.externalSubmission.create({
        data: {
          connectionId: connection.id,
          externalSubmissionKey: work.id,
          eventType: work.eventType,
          affiliationName: work.affiliationName,
          title: work.title || "제목 없음",
          participantName: work.participantName || null,
          submissionUrl: work.submissionUrl || null,
          preliminaryScore: work.preliminaryScore,
          finalResult: work.finalResult || null,
          rawData: { rank: work.rank, matchReason: work.matchReason }
        }
      });
      const application = applications.find((item) => item.id === work.applicationId);
      if (application?.participation) {
        await tx.submissionMatch.create({
          data: {
            participationId: application.participation.id,
            externalSubmissionId: external.id,
            matchType: work.matchStatus === "MATCHED" ? "EXACT" : "SIMILAR",
            matchStatus: "ACTIVE"
          }
        });
      }
    }
    await audit(tx, "출품 목록 분석", "ExternalSubmission", `${works.length}`);
  });
  if (upload?.fileName) await storeFileAsset({ originalName: upload.fileName, dataUrl: upload.dataUrl, folder: "submissions" });
  return buildDbDashboard(await readDbState());
}

function normalizeSubmissionRow(eventId: string, row: Row, applications: ApplicationForMatch[]): UploadedSubmissionWork {
  const affiliationName = text(pick(row, ["소속", "소속명", "팀명", "affiliation", "team"]));
  const title = text(pick(row, ["작품명", "작품제목", "제목", "title"]));
  const participantName = text(pick(row, ["감독", "출품자", "이름", "participant", "director"]));
  const submissionUrl = text(pick(row, ["출품 URL", "출품URL", "보기 URL", "영상 URL", "URL", "url", "링크"]));
  const score = number(pick(row, ["예심평점", "평점", "일반평점", "score"]));
  const finalResult = text(pick(row, ["수상결과", "본심", "finalResult"]));
  const exact = applications.find((application) => application.affiliationNameSnapshot === affiliationName);
  const similar = exact ? undefined : applications.find((application) => isSimilar(application.affiliationNameSnapshot, affiliationName));
  const matchStatus = exact ? "MATCHED" : similar ? "NEEDS_REVIEW" : "MISSING";
  return {
    id: `work_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    eventId,
    applicationId: exact?.id ?? similar?.id,
    schoolName: exact?.schoolNameSnapshot ?? similar?.schoolNameSnapshot ?? "",
    affiliationName,
    title,
    participantName,
    submissionUrl,
    preliminaryScore: score,
    finalResult,
    finalRoundStatus: finalResult === "1차통과" ? "ADVANCED" : finalResult ? "NOT_ADVANCED" : "NOT_USED",
    matchStatus,
    matchReason: matchReasonFor(matchStatus),
    eventType: exact?.dreamEvent.event.eventType ?? similar?.dreamEvent.event.eventType ?? "TWENTY_NINE_SECONDS"
  };
}

function rankWorks<T extends SubmissionWork>(works: T[]) {
  const grouped = new Map<string, SubmissionWork[]>();
  for (const work of works) {
    const key = work.affiliationName || "미분류";
    grouped.set(key, [...(grouped.get(key) ?? []), work]);
  }
  for (const group of grouped.values()) {
    group.sort((left, right) => (right.preliminaryScore ?? -1) - (left.preliminaryScore ?? -1)).forEach((work, index) => {
      work.rank = index + 1;
    });
  }
  return works;
}

async function audit(
  tx: Prisma.TransactionClient,
  action: string,
  entityType: string,
  entityId: string,
  afterData?: Prisma.InputJsonValue
) {
  await tx.auditLog.create({ data: { action, entityType, entityId, afterData } });
}

function formatPeriod(start?: Date | null, end?: Date | null) {
  if (!start && !end) return "";
  return [start?.toISOString().slice(0, 10), end?.toISOString().slice(0, 10)].filter(Boolean).join(" - ");
}

function extractPrize(notice?: string | null) {
  const match = notice?.match(/^총상금:\s*(.+)$/m);
  return match?.[1] ?? "";
}

function toDreamOperationStatus(status: EventStatus) {
  if (status === "CERTIFICATE_READY") return "CERTIFICATE_RUNNING";
  if (status === "SCORE_READY") return "SCORE_REPORT_RUNNING";
  return status;
}

function normalizeApplicationStatus(status: string): DreamApplication["status"] {
  if (status === "SELECTED" || status === "WAITLISTED" || status === "NOT_SELECTED") return status;
  return "SUBMITTED";
}

function pick(row: Row, keys: string[]) {
  const normalizedEntries = new Map(Object.entries(row).map(([key, value]) => [normalizeKey(key), value]));
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
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + (left[i - 1] === right[j - 1] ? 0 : 1));
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

function matchReasonFor(matchStatus: SubmissionWork["matchStatus"]) {
  if (matchStatus === "MATCHED") return "신청한 출품 소속명과 완전히 일치합니다.";
  if (matchStatus === "NEEDS_REVIEW") return "띄어쓰기 또는 한 글자 차이가 있어 관리자 확인이 필요합니다.";
  return "일치하는 신청 학교가 없습니다.";
}

function text(value: string | number | undefined) {
  return value == null ? "" : String(value).trim();
}

function number(value: string | number | undefined) {
  if (value == null || value === "") return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}
