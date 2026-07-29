"use client";

import { useEffect, useMemo, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import { Bell, CheckCircle2, FileCheck2, Gift, Home, Mail, Plus, RefreshCw, Upload } from "lucide-react";
import type { DashboardResponse, DreamApplication, DreamEvent, EventType, ProfileChangeRequest, SubmissionWork, TeacherProfile } from "@/lib/with-types";
import { applicationStatusLabels, eventTypeLabels, matchStatusLabels, statusLabels } from "@/lib/with-types";

type ViewMode = "teacher" | "admin";
type TeacherPage = "home" | "available" | "works" | "benefits" | "docs" | "profile";
type AdminPage = "dashboard" | "events" | "teachers" | "applications" | "submissions" | "benefits" | "documents" | "mails" | "history";
type SessionUser = { id: string; userType: "ADMIN" | "TEACHER"; name: string; email: string; emailVerified?: boolean };

const teacherPages: Array<{ key: TeacherPage; label: string }> = [
  { key: "home", label: "내 대시보드" },
  { key: "available", label: "신청 가능한 행사" },
  { key: "works", label: "학생/작품 관리" },
  { key: "benefits", label: "혜택/지원" },
  { key: "docs", label: "확인서/심사표" },
  { key: "profile", label: "내 프로필" }
];

const adminPages: Array<{ key: AdminPage; label: string }> = [
  { key: "dashboard", label: "꿈프 대시보드" },
  { key: "events", label: "행사 운영" },
  { key: "teachers", label: "선생님 DB" },
  { key: "applications", label: "신청/선정" },
  { key: "submissions", label: "출품 확인" },
  { key: "benefits", label: "혜택/지원" },
  { key: "documents", label: "활동확인서" },
  { key: "mails", label: "메일/공지" },
  { key: "history", label: "히스토리" }
];

const eventWorkflow: DreamEvent["status"][] = [
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

const nextActionLabels: Partial<Record<DreamEvent["status"], string>> = {
  PREPARING: "모집 시작",
  RECRUITING: "신청 마감·선정 시작",
  SELECTING: "선정 완료·출품 확인 시작",
  SUBMISSION_RUNNING: "출품 마감·최종 검토",
  FINAL_REVIEW: "출품 리스트 승인·확인서 발급",
  CERTIFICATE_RUNNING: "심사 결과 반영",
  SCORE_REPORT_RUNNING: "종료 검토",
  READY_TO_CLOSE: "꿈프 종료"
};

const emptyDashboard: DashboardResponse = {
  events: [],
  registeredTeachers: [],
  teachers: [],
  applications: [],
  submissions: [],
  coupons: [],
  certificateTemplates: [],
  notices: [],
  profileChangeRequests: [],
  stats: {
    activeEventCount: 0,
    selectedSchoolCount: 0,
    expectedSubmissionCount: 0,
    confirmedSubmissionCount: 0,
    reviewRequiredCount: 0,
    unusedCouponCount: 0
  }
};

export default function HomePage() {
  const [data, setData] = useState<DashboardResponse>(emptyDashboard);
  const [mode, setMode] = useState<ViewMode>("teacher");
  const [teacherPage, setTeacherPage] = useState<TeacherPage>("home");
  const [adminPage, setAdminPage] = useState<AdminPage>("dashboard");
  const [selectedEventId, setSelectedEventId] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<SessionUser | null>(null);
  const [authPanel, setAuthPanel] = useState<"login" | "signup">("login");
  const [pendingApplicationEventId, setPendingApplicationEventId] = useState("");

  useEffect(() => {
    void (async () => {
      const user = await loadSession();
      if (user) await loadDashboard();
      else setIsLoading(false);
    })();
  }, []);

  useEffect(() => {
    if (!selectedEventId && data.events[0]) setSelectedEventId(data.events[0].id);
  }, [data.events, selectedEventId]);

  const selectedEvent = useMemo(() => data.events.find((event) => event.id === selectedEventId), [data.events, selectedEventId]);

  async function loadDashboard() {
    setIsLoading(true);
    const response = await fetch("/api/dashboard", { cache: "no-store" });
    if (response.ok) setData(await response.json());
    setIsLoading(false);
  }

  async function loadSession() {
    const response = await fetch("/api/auth/me", { cache: "no-store" });
    if (!response.ok) return null;
    const body = (await response.json()) as { user?: SessionUser | null };
    if (body.user) {
      setCurrentUser(body.user);
      setMode(body.user.userType === "ADMIN" ? "admin" : "teacher");
    }
    return body.user ?? null;
  }

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: formData.get("email"), password: formData.get("password") })
    });
    if (!response.ok) {
      setMessage(await readErrorMessage(response));
      return;
    }
    const body = (await response.json()) as { user: SessionUser };
    setCurrentUser(body.user);
    setMode(body.user.userType === "ADMIN" ? "admin" : "teacher");
    setAuthPanel("login");
    setMessage("");
    await loadDashboard();
  }

  async function handleSignup(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const response = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: formData.get("name"), email: formData.get("email"), password: formData.get("password") })
    });
    const body = await response.json();
    if (!response.ok) {
      setMessage(body?.message || "회원가입을 처리하지 못했습니다.");
      return;
    }
    event.currentTarget.reset();
    setAuthPanel("login");
    setMessage(body?.message || "인증 메일을 확인하세요.");
  }

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setCurrentUser(null);
    setData(emptyDashboard);
    setMode("teacher");
    setMessage("");
  }

  async function postJson(url: string, body?: unknown, doneMessage = "저장되었습니다.", method = "POST") {
    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: body == null ? undefined : JSON.stringify(body)
    });
    if (!response.ok) {
      setMessage(await readErrorMessage(response));
      return null;
    }
    const nextData = (await response.json()) as DashboardResponse;
    setData(nextData);
    setMessage(doneMessage);
    return nextData;
  }

  async function handleCreateEvent(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const posterFile = formData.get("posterFile");
    const posterUrl = posterFile instanceof File && posterFile.size ? await fileToDataUrl(posterFile) : "";
    const nextData = await postJson(
      "/api/events",
      {
        title: formData.get("title"),
        eventType: formData.get("eventType"),
        contestPeriod: formData.get("contestPeriod"),
        topic: formData.get("topic"),
        prize: formData.get("prize"),
        posterUrl,
        homepageUrl: formData.get("submissionUrl"),
        submissionUrl: formData.get("submissionUrl"),
        notice: formData.get("notice"),
        targetSubmissionCount: formData.get("targetSubmissionCount"),
        status: "RECRUITING"
      },
      "꿈프 행사를 등록했습니다."
    );
    if (nextData) {
      event.currentTarget.reset();
      setSelectedEventId(nextData.events[0]?.id ?? "");
      setAdminPage("dashboard");
    }
  }

  async function handleCouponUpload(file?: File) {
    if (!file) return;
    try {
      const couponNumbers = (await readSheetCellValues(file))
        .map((value) => String(value ?? "").trim())
        .filter((value) => value && !/^(쿠폰|쿠폰번호|번호|coupon|couponcode|code)$/i.test(value.replace(/\s/g, "")));
      await postJson("/api/coupons", { couponNumbers, fileName: file.name, dataUrl: await fileToDataUrl(file) }, `쿠폰 ${couponNumbers.length}개를 인식했습니다.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "쿠폰 파일을 읽지 못했습니다.");
    }
  }

  async function handleSubmissionUpload(file?: File) {
    if (!file || !selectedEvent) return;
    try {
      await postJson(
        "/api/submissions/analyze",
        { eventId: selectedEvent.id, rows: await readSheetRows(file), fileName: file.name, dataUrl: await fileToDataUrl(file) },
        "출품 엑셀 분석을 완료했습니다."
      );
      setAdminPage("submissions");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "출품 파일을 읽지 못했습니다.");
    }
  }

  async function handleApply(eventItem: DreamEvent, formData: FormData) {
    const profile = data.teachers[0];
    if (!profile) {
      setPendingApplicationEventId(eventItem.id);
      setTeacherPage("profile");
      setMessage("행사 신청 전에 내 프로필을 먼저 완료해 주세요.");
      return false;
    }
    const nextData = await postJson(
      "/api/applications",
      {
        eventId: eventItem.id,
        schoolName: profile.schoolName,
        teacherName: currentUser?.name,
        email: currentUser?.email,
        phone: profile.phone,
        affiliationName: profile.affiliationName,
        expectedSubmissionCount: Number(formData.get("expectedSubmissionCount") || 1),
        plannedSubmissionDate: formData.get("plannedSubmissionDate"),
        usagePlan: formData.get("usagePlan"),
        memo: formData.get("memo")
      },
      "꿈프 신청을 접수했습니다."
    );
    if (nextData) {
      setTeacherPage("home");
      setPendingApplicationEventId("");
    }
    return Boolean(nextData);
  }

  async function handleSaveProfile(formData: FormData) {
    const verificationFile = formData.get("verificationFile");
    const nextData = await postJson(
      "/api/profile",
      {
        profileId: data.teachers[0]?.id,
        schoolName: formData.get("schoolName"),
        phone: formData.get("phone"),
        affiliationName: formData.get("affiliationName"),
        verificationFileName: verificationFile instanceof File && verificationFile.size ? verificationFile.name : "",
        verificationDataUrl: verificationFile instanceof File && verificationFile.size ? await fileToDataUrl(verificationFile) : ""
      },
      "내 프로필을 저장했습니다."
    );
    if (nextData && pendingApplicationEventId) setTeacherPage("available");
    return Boolean(nextData);
  }

  async function handleProfileChangeRequest(formData: FormData) {
    const nextData = await postJson(
      "/api/profile",
      {
        requestedSchoolName: formData.get("requestedSchoolName"),
        requestedAffiliationName: formData.get("requestedAffiliationName"),
        reason: formData.get("reason"),
        teacherConfirmed: formData.get("teacherConfirmed") === "on"
      },
      "프로필 변경 요청을 관리자에게 전달했습니다.",
      "PUT"
    );
    return Boolean(nextData);
  }

  async function handleProfileChangeReview(requestId: string, status: "APPROVED" | "REJECTED", adminReply: string) {
    await postJson("/api/profile", { requestId, status, adminReply }, status === "APPROVED" ? "변경 요청을 승인했습니다." : "변경 요청을 반려했습니다.", "PATCH");
  }

  async function handleApplicationStatus(applicationId: string, status: DreamApplication["status"]) {
    await postJson("/api/applications", { applicationId, status }, "신청 상태를 변경했습니다.", "PATCH");
  }

  async function handleEventStatus(eventId: string, status: DreamEvent["status"]) {
    await postJson("/api/events", { eventId, status }, "행사 운영 단계를 변경했습니다.", "PATCH");
  }

  async function handleConfirmMatch(externalSubmissionId: string, applicationId: string) {
    await postJson(
      "/api/submissions/analyze",
      { externalSubmissionId, applicationId },
      "출품작과 신청 학교의 매칭을 확정했습니다.",
      "PATCH"
    );
  }

  async function handleMailSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const response = await fetch("/api/mails", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        recipientEmails: formData.get("recipientEmails"),
        subject: formData.get("subject"),
        body: formData.get("body"),
        scheduledAt: formData.get("scheduledAt"),
        action: formData.get("action")
      })
    });
    if (!response.ok) {
      setMessage(await readErrorMessage(response));
      return;
    }
    const action = formData.get("action");
    setMessage(action === "send" ? "운영 공지를 발송했습니다." : action === "schedule" ? "예약 메일을 저장했습니다." : "메일 초안을 저장했습니다.");
    event.currentTarget.reset();
    await loadDashboard();
  }

  const navItems = mode === "teacher" ? teacherPages : adminPages;
  const activeKey = mode === "teacher" ? teacherPage : adminPage;

  if (!currentUser) {
    return (
      <main className="login-shell">
        <section className="login-brand">
          <div className="brand-box login-brand-box">
            <img alt="29초영화제 심볼" className="brand-symbol" src="/brand/29film-symbol.jpg" />
            <div>
              <img alt="29초영화제" className="login-main-logo" src="/brand/29film-logo-black.png" />
              <small>영상 꿈나무 양성 프로젝트</small>
            </div>
          </div>
          <img alt="한국경제신문" className="login-sub-logo" src="/brand/hankyung-logo-color.png" />
          <h1>영상을 꿈꾸는 학생들 곁의 선생님을 위한 공간입니다.</h1>
          <p>꿈나무 양성 프로젝트는 학생들이 직접 만들고 출품하는 과정을 학교 현장에서 이끌어 주시는 선생님을 지원하기 위해 운영됩니다.</p>
          <div className="login-highlights">
            <span>꿈프 신청</span>
            <span>출품 현황 확인</span>
            <span>활동확인서와 지원 안내</span>
          </div>
        </section>
        <section className="login-panel-wrap">
          {message ? <div className="toast-inline">{message}</div> : null}
          {isLoading ? <section className="panel">로그인 상태를 확인하는 중입니다.</section> : <AuthPanel mode={authPanel} onLogin={handleLogin} onSignup={handleSignup} />}
          {!isLoading ? (
            <div className="auth-switch">
              {authPanel === "login" ? (
                <button className="ghost-button" onClick={() => setAuthPanel("signup")} type="button">선생님 회원가입</button>
              ) : (
                <button className="ghost-button" onClick={() => setAuthPanel("login")} type="button">이미 계정이 있어요</button>
              )}
            </div>
          ) : null}
        </section>
      </main>
    );
  }

  return (
    <main className={`app-shell ${mode === "teacher" ? "teacher-shell" : "admin-shell"}`}>
      <aside className="side-nav">
        <div className="brand-box">
          <img alt="29초영화제 심볼" className="brand-symbol" src="/brand/29film-symbol.jpg" />
          <div>
            <img alt="29초영화제" className="side-logo" src="/brand/29film-logo-white.png" />
            <small>{mode === "teacher" ? "선생님 포털" : "운영 관리자"}</small>
          </div>
        </div>
        <nav>
          {navItems.map((item) => (
            <button className={activeKey === item.key ? "active" : ""} key={item.key} onClick={() => (mode === "teacher" ? setTeacherPage(item.key as TeacherPage) : setAdminPage(item.key as AdminPage))} type="button">
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      <section className="content-area">
        <header className="top-bar">
          <div>
            <p>{mode === "teacher" ? "영상 꿈나무 양성 프로젝트" : "29 Platform 대외협력 관리 시스템"}</p>
            <h1>{mode === "teacher" ? "선생님 포털" : "꿈프 운영"}</h1>
          </div>
          <div className="top-actions">
            {mode === "teacher" ? <BrandPortalLinks compact /> : null}
            {mode === "admin" ? (
              <select value={selectedEventId} onChange={(event) => setSelectedEventId(event.target.value)}>
                {data.events.length === 0 ? <option>등록된 꿈프 없음</option> : null}
                {data.events.map((event) => <option key={event.id} value={event.id}>{event.title}</option>)}
              </select>
            ) : null}
            <button className="ghost-button" onClick={loadDashboard} type="button"><RefreshCw size={16} /> 새로고침</button>
            {currentUser ? (
              <button className="ghost-button" onClick={handleLogout} type="button">
                {currentUser.userType === "ADMIN" ? "관리자" : "선생님"} {currentUser.emailVerified ? "인증됨" : "미인증"} · 로그아웃
              </button>
            ) : null}
          </div>
        </header>

        {message ? <div className="toast-inline">{message}</div> : null}
        {isLoading ? <section className="panel">불러오는 중입니다.</section> : null}

        {!isLoading && mode === "teacher" ? (
          <TeacherPortal
            page={teacherPage}
            data={data}
            setPage={setTeacherPage}
            onApply={handleApply}
            onSaveProfile={handleSaveProfile}
            onProfileChangeRequest={handleProfileChangeRequest}
            currentUser={currentUser}
            pendingApplicationEventId={pendingApplicationEventId}
            onRequireProfile={(eventId) => {
              setPendingApplicationEventId(eventId);
              setTeacherPage("profile");
              setMessage("행사 신청 전에 내 프로필을 먼저 완료해 주세요.");
            }}
          />
        ) : null}
        {!isLoading && mode === "admin" && adminPage === "dashboard" ? <AdminDashboard data={data} selectedEvent={selectedEvent} setPage={setAdminPage} onSelectEvent={setSelectedEventId} onEventStatus={handleEventStatus} /> : null}
        {!isLoading && mode === "admin" && adminPage === "events" ? <EventsPage data={data} selectedEvent={selectedEvent} onCreateEvent={handleCreateEvent} onSelectEvent={setSelectedEventId} onEventStatus={handleEventStatus} /> : null}
        {!isLoading && mode === "admin" && adminPage === "teachers" ? <TeachersDbPage data={data} selectedEvent={selectedEvent} onProfileChangeReview={handleProfileChangeReview} /> : null}
        {!isLoading && mode === "admin" && adminPage === "applications" ? <ApplicationsPage data={data} selectedEvent={selectedEvent} onApplicationStatus={handleApplicationStatus} /> : null}
        {!isLoading && mode === "admin" && adminPage === "submissions" ? <SubmissionsPage data={data} selectedEvent={selectedEvent} onUpload={handleSubmissionUpload} onConfirmMatch={handleConfirmMatch} /> : null}
        {!isLoading && mode === "admin" && adminPage === "benefits" ? <BenefitsPage data={data} onCouponUpload={handleCouponUpload} /> : null}
        {!isLoading && mode === "admin" && adminPage === "documents" ? <DocumentsPage data={data} selectedEvent={selectedEvent} /> : null}
        {!isLoading && mode === "admin" && adminPage === "mails" ? <MailsPage data={data} selectedEvent={selectedEvent} onSubmit={handleMailSubmit} /> : null}
        {!isLoading && mode === "admin" && adminPage === "history" ? <HistoryPage data={data} /> : null}
        {!isLoading && mode === "teacher" ? (
          <footer className="teacher-footer">
            <div>
              <strong>학생들의 다음 장면을 함께 만들어 주세요.</strong>
              <p>영화제 정보와 실제 출품은 각 공식 사이트에서 확인할 수 있습니다.</p>
            </div>
            <BrandPortalLinks />
            <small>29 WITH · 영상 꿈나무 양성 프로젝트</small>
          </footer>
        ) : null}
      </section>
    </main>
  );
}

function BrandPortalLinks({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`brand-portal-links ${compact ? "compact" : ""}`}>
      <a aria-label="29초영화제 공식 사이트 바로가기" href="https://www.29sfilm.com" rel="noreferrer" target="_blank">
        <img alt="29초영화제" src="/brand/29film-logo-white.png" />
        <span>공식 사이트</span>
      </a>
      <a aria-label="29역숏폼왕 공식 사이트 바로가기" href="https://www.29sking.com" rel="noreferrer" target="_blank">
        <img alt="29역숏폼왕" src="/brand/29shortform-logo.png" />
        <span>공식 사이트</span>
      </a>
    </div>
  );
}

function TeacherPortal({
  page,
  data,
  setPage,
  onApply,
  onSaveProfile,
  onProfileChangeRequest,
  currentUser,
  pendingApplicationEventId,
  onRequireProfile
}: {
  page: TeacherPage;
  data: DashboardResponse;
  setPage: (page: TeacherPage) => void;
  onApply: (eventItem: DreamEvent, formData: FormData) => Promise<boolean>;
  onSaveProfile: (formData: FormData) => Promise<boolean>;
  onProfileChangeRequest: (formData: FormData) => Promise<boolean>;
  currentUser: SessionUser | null;
  pendingApplicationEventId: string;
  onRequireProfile: (eventId: string) => void;
}) {
  const teacherApplications = data.applications;
  const availableEvents = data.events.filter((event) => event.status === "RECRUITING");
  const teacherWorks = data.submissions;
  const profile = data.teachers[0];
  const trustLabel = profile?.trustStatus === "BENEFIT" ? "우선 선정" : profile?.trustStatus === "PENALTY" ? "선정 후순위" : "일반";

  if (page === "available") {
    return (
      <TeacherAvailableEvents
        events={availableEvents}
        onApply={onApply}
        currentUser={currentUser}
        profile={profile}
        initialOpenEventId={pendingApplicationEventId}
        onRequireProfile={onRequireProfile}
      />
    );
  }
  if (page === "works") return <TeacherWorks works={teacherWorks} events={data.events} />;
  if (page === "benefits") return <TeacherBenefits data={data} applications={teacherApplications} />;
  if (page === "docs") return <TeacherDocuments works={teacherWorks} events={data.events} applications={teacherApplications} />;
  if (page === "profile") {
    return (
      <TeacherProfilePanel
        profile={profile}
        currentUser={currentUser}
        requests={data.profileChangeRequests}
        onSave={onSaveProfile}
        onChangeRequest={onProfileChangeRequest}
        returningToApplication={Boolean(pendingApplicationEventId)}
      />
    );
  }

  return (
    <>
      <section className="teacher-hero">
        <div>
          <p className="eyebrow">선생님용 화면</p>
          <h2>신청 상태, 출품 확인, 혜택과 문서를 한 곳에서 확인합니다.</h2>
          <p>여러 꿈프가 동시에 진행되어도 행사별로 분리해서 보여줍니다. 신청 내역이 없으면 신청 가능한 행사부터 안내합니다.</p>
        </div>
        <button className="primary-button" onClick={() => setPage("available")} type="button">신청 가능한 행사 보기</button>
      </section>

      <section className="teacher-status-grid">
        <TeacherStatusCard icon={<Home size={19} />} label="내 신청" value={`${teacherApplications.length}건`} text="접수 또는 선정된 꿈프 신청" />
        <TeacherStatusCard icon={<CheckCircle2 size={19} />} label="출품 확인" value={`${teacherWorks.length}편`} text="관리자 엑셀 분석 후 표시" />
        <TeacherStatusCard icon={<Gift size={19} />} label="참여 상태" value={trustLabel} text="과거 참여 이력을 반영한 선정 기준" />
        <TeacherStatusCard icon={<Bell size={19} />} label="확인할 일" value={`${teacherWorks.filter((work) => work.matchStatus !== "MATCHED").length}건`} text="출품 매칭 또는 문서 확인" />
      </section>

      <section className="panel teacher-panel">
        <SectionHead title="내 꿈프 신청 현황" text="선생님이 확인해야 할 신청과 진행 상태만 보여줍니다." />
        {teacherApplications.length ? (
          <div className="teacher-application-list">{teacherApplications.map((application) => <TeacherApplicationCard key={application.id} application={application} events={data.events} />)}</div>
        ) : (
          <EmptyState title="아직 신청 내역이 없습니다." text="모집중인 행사를 선택해 신청하면 이곳에 진행 상태가 표시됩니다." />
        )}
      </section>
    </>
  );
}

function AuthPanel({ mode, onLogin, onSignup }: { mode: "login" | "signup"; onLogin: (event: FormEvent<HTMLFormElement>) => void; onSignup: (event: FormEvent<HTMLFormElement>) => void }) {
  const authText = mode === "login" ? "가입한 이메일과 비밀번호로 로그인합니다." : "선생님 전용 가입입니다. 업무용 이메일로 가입하고 인증 메일을 확인하세요.";
  return (
    <section className="panel auth-panel">
      <SectionHead title={mode === "login" ? "이메일 로그인" : "회원가입"} />
      <p className="auth-note">{authText}</p>
      {mode === "login" ? (
        <form className="form-grid" onSubmit={onLogin}>
          <label>이메일<input name="email" required type="email" placeholder="teacher@example.com" /></label>
          <label>비밀번호<input name="password" required type="password" /></label>
          <div className="form-actions"><button className="primary-button" type="submit">로그인</button></div>
        </form>
      ) : (
        <form className="form-grid" onSubmit={onSignup}>
          <label>이름<input name="name" required placeholder="홍길동" /></label>
          <label>이메일<input name="email" required type="email" placeholder="teacher@example.com" /></label>
          <label>비밀번호<input name="password" minLength={6} required type="password" /></label>
          <div className="form-actions"><button className="primary-button" type="submit">가입하고 인증 메일 받기</button></div>
        </form>
      )}
    </section>
  );
}

function TeacherAvailableEvents({
  events,
  onApply,
  currentUser,
  profile,
  initialOpenEventId,
  onRequireProfile
}: {
  events: DreamEvent[];
  onApply: (eventItem: DreamEvent, formData: FormData) => Promise<boolean>;
  currentUser: SessionUser | null;
  profile?: TeacherProfile;
  initialOpenEventId: string;
  onRequireProfile: (eventId: string) => void;
}) {
  const [openEventId, setOpenEventId] = useState(initialOpenEventId);

  async function submitApplication(eventItem: DreamEvent, submitEvent: FormEvent<HTMLFormElement>) {
    submitEvent.preventDefault();
    if (await onApply(eventItem, new FormData(submitEvent.currentTarget))) {
      submitEvent.currentTarget.reset();
      setOpenEventId("");
    }
  }

  return (
    <section className="panel teacher-panel">
      <SectionHead title="신청 가능한 행사" text="관리자가 모집중으로 등록한 꿈프 행사만 표시됩니다." />
      {events.length ? (
        <div className="teacher-event-grid">
          {events.map((event) => (
            <article className="teacher-event-card" key={event.id}>
              {event.posterUrl ? <img alt={`${event.title} 포스터`} src={event.posterUrl} /> : <div className="poster-placeholder">29</div>}
              <div>
                <span className="status-pill success">{eventTypeLabels[event.eventType]}</span>
                <h3>{event.title}</h3>
                <dl>
                  <div><dt>기간</dt><dd>{event.contestPeriod || "미입력"}</dd></div>
                  <div><dt>상금/혜택</dt><dd>{event.prize || "미입력"}</dd></div>
                  <div><dt>주제</dt><dd>{event.topic || "미입력"}</dd></div>
                </dl>
                <p className="event-notice">{event.notice || "등록된 안내사항이 없습니다."}</p>
                <div className="button-row">
                  {event.submissionUrl ? <a className="ghost-button" href={event.submissionUrl} rel="noreferrer" target="_blank">출품하기</a> : null}
                  <button
                    className="primary-button"
                    onClick={() => (profile ? setOpenEventId(openEventId === event.id ? "" : event.id) : onRequireProfile(event.id))}
                    type="button"
                  >
                    신청하기
                  </button>
                </div>
                {openEventId === event.id ? (
                  currentUser?.emailVerified ? (
                    <form className="form-grid sub-panel" onSubmit={(submitEvent) => submitApplication(event, submitEvent)}>
                      <div className="wide saved-profile-summary">
                        <div><span>학교명</span><strong>{profile?.schoolName}</strong></div>
                        <div><span>담당교사</span><strong>{currentUser.name}</strong></div>
                        <div><span>업무용 이메일</span><strong>{currentUser.email}</strong></div>
                        <div><span>연락처</span><strong>{profile?.phone}</strong></div>
                      </div>
                      <div className="wide affiliation-warning">
                        <strong>출품 소속명/팀명: {profile?.affiliationName}</strong>
                        <p>실제 출품 시 입력하는 소속명 또는 팀명과 글자와 띄어쓰기까지 동일해야 자동으로 출품작이 확인됩니다.</p>
                      </div>
                      <label>예상 작품 수<input name="expectedSubmissionCount" required min="1" type="number" defaultValue={1} /></label>
                      <label>출품 예정일<input name="plannedSubmissionDate" required type="date" /></label>
                      <label className="wide application-confirm">
                        <input required type="checkbox" />
                        <span>학교명과 출품 소속명/팀명을 다시 확인했습니다. 실제 출품 정보와 다르면 자동 매칭되지 않을 수 있습니다.</span>
                      </label>
                      <label className="wide">활용 계획<textarea name="usagePlan" rows={3} placeholder="수업 또는 동아리에서 어떻게 참여할지 입력" /></label>
                      <label className="wide">메모<textarea name="memo" rows={2} placeholder="관리자에게 전달할 내용" /></label>
                      <div className="form-actions"><button className="primary-button" type="submit">신청 접수</button></div>
                    </form>
                  ) : (
                    <div className="empty-state"><strong>로그인과 이메일 인증이 필요합니다.</strong><p>회원가입 후 받은 인증 메일을 먼저 확인하세요.</p></div>
                  )
                ) : null}
              </div>
            </article>
          ))}
        </div>
      ) : (
        <EmptyState title="현재 모집중인 행사가 없습니다." text="관리자가 행사 운영에서 새 꿈프를 등록하면 이곳에 표시됩니다." />
      )}
    </section>
  );
}

function TeacherWorks({ works, events }: { works: SubmissionWork[]; events: DreamEvent[] }) {
  return <section className="panel teacher-panel"><SectionHead title="학생/작품 관리" text="출품 엑셀 분석 후 우리 학교와 매칭된 작품을 확인합니다." /><WorksTable works={works} events={events} emptyText="아직 확인된 출품작이 없습니다." /></section>;
}

function TeacherBenefits({ data, applications }: { data: DashboardResponse; applications: DreamApplication[] }) {
  const assignedCoupons = data.coupons.filter((coupon) => coupon.status === "ASSIGNED");
  return (
    <section className="panel teacher-panel">
      <SectionHead title="혜택/지원" text="선정 후 지급되는 쿠폰, 간식비 안내, 운영 알림을 확인합니다." />
      <div className="metric-grid compact">
        <MetricCard label="내 선정 신청" value={`${applications.filter((item) => item.status === "SELECTED").length}건`} />
        <MetricCard label="지급된 구독권" value={`${assignedCoupons.length}개`} />
        <MetricCard label="간식비 지급 예정" value="관리자 입력 대기" />
      </div>
      {assignedCoupons.length ? (
        <div className="compact-list">
          {assignedCoupons.map((coupon) => <div className="compact-row" key={coupon.id}><strong>한국경제신문 구독권</strong><span>{coupon.couponNumber}</span></div>)}
        </div>
      ) : (
        <EmptyState title="아직 지급된 혜택이 없습니다." text="선정 시 쿠폰 재고가 있으면 자동 지급되며 이 화면에 표시됩니다." />
      )}
    </section>
  );
}

function TeacherDocuments({ works, events, applications }: { works: SubmissionWork[]; events: DreamEvent[]; applications: DreamApplication[] }) {
  return (
    <section className="panel teacher-panel">
      <SectionHead title="활동확인서/심사표" text="행사별 출품 확인 결과와 발급 가능한 문서를 확인합니다." />
      {applications.filter((application) => application.status === "SELECTED").length ? (
        <div className="document-list">
          {applications.filter((application) => application.status === "SELECTED").map((application) => {
            const eventItem = events.find((event) => event.id === application.eventId);
            const matchedWorks = works.filter((work) => work.applicationId === application.id && work.matchStatus === "MATCHED");
            const canDownload = matchedWorks.length > 0 && ["CERTIFICATE_RUNNING", "SCORE_REPORT_RUNNING", "READY_TO_CLOSE", "CLOSED"].includes(eventItem?.status || "");
            return (
              <article className="document-row" key={application.id}>
                <div><strong>{eventItem?.title || "행사"}</strong><small>{application.schoolName} · 출품 확인 {matchedWorks.length}편</small></div>
                {canDownload ? <CertificateDownloadButton application={application} eventItem={eventItem} works={matchedWorks} /> : <span className="status-pill">관리자 최종 확인 대기</span>}
              </article>
            );
          })}
        </div>
      ) : <EmptyState title="발급 가능한 문서가 아직 없습니다." text="선정 후 출품작 최종 확인이 완료되면 활동확인서를 받을 수 있습니다." />}
    </section>
  );
}

function TeacherProfilePanel({
  profile,
  currentUser,
  requests,
  onSave,
  onChangeRequest,
  returningToApplication
}: {
  profile?: TeacherProfile;
  currentUser: SessionUser | null;
  requests: ProfileChangeRequest[];
  onSave: (formData: FormData) => Promise<boolean>;
  onChangeRequest: (formData: FormData) => Promise<boolean>;
  returningToApplication: boolean;
}) {
  const [editing, setEditing] = useState(!profile);
  const [changeRequestOpen, setChangeRequestOpen] = useState(false);
  const pendingRequest = requests.find((request) => request.status === "SUBMITTED");

  async function submitProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (await onSave(new FormData(event.currentTarget))) setEditing(false);
  }

  async function submitChangeRequest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (await onChangeRequest(new FormData(event.currentTarget))) setChangeRequestOpen(false);
  }

  return (
    <section className="panel teacher-panel">
      <SectionHead
        title={profile ? "내 프로필" : "신청 전 프로필 작성"}
        text={returningToApplication ? "프로필을 저장하면 선택했던 행사 신청서로 돌아갑니다." : undefined}
      />
      {editing ? (
        <form className="form-grid profile-form" onSubmit={submitProfile}>
          <label>담당교사명<input readOnly value={currentUser?.name || ""} /></label>
          <label>업무용 이메일<input readOnly type="email" value={currentUser?.email || ""} /></label>
          <label>학교명<input defaultValue={profile?.schoolName || ""} name="schoolName" readOnly={profile?.profileLocked} required placeholder="정식 학교명을 입력해 주세요" /></label>
          <label>연락처<input defaultValue={profile?.phone || ""} name="phone" required placeholder="010-0000-0000" /></label>
          <label className="wide">
            출품 소속명/팀명
            <input defaultValue={profile?.affiliationName || ""} name="affiliationName" readOnly={profile?.profileLocked} required placeholder="실제 출품 시 사용할 소속명 또는 팀명" />
          </label>
          <div className="wide affiliation-warning">
            <strong>출품 확인을 위한 필수 기준입니다.</strong>
            <p>29초영화제 출품 시 입력하는 ‘소속명’ 또는 29역숏폼왕 출품 시 입력하는 ‘팀명’과 글자 및 띄어쓰기까지 동일하게 입력해 주세요. 다르면 출품 확인이 지연되거나 지원 대상에서 제외될 수 있습니다.</p>
          </div>
          <label className="wide">
            교사 증빙자료 {profile?.verificationFileName ? <small>현재 파일: {profile.verificationFileName}</small> : null}
            <input accept=".pdf,.png,.jpg,.jpeg" name="verificationFile" required={!profile?.verificationFileName} type="file" />
            <small>교사 확인증 등 재직 사실을 확인할 수 있는 PDF 또는 이미지 파일</small>
          </label>
          <label className="wide application-confirm">
            <input required type="checkbox" />
            <span>학교명과 출품 소속명/팀명을 실제 출품 정보와 동일하게 입력했는지 다시 확인했습니다.</span>
          </label>
          <div className="form-actions">
            {profile ? <button className="ghost-button" onClick={() => setEditing(false)} type="button">취소</button> : null}
            <button className="primary-button" type="submit">{returningToApplication ? "저장하고 신청 계속하기" : "프로필 저장"}</button>
          </div>
        </form>
      ) : (
        <>
          <div className="profile-grid">
            <TeacherInfoCard label="담당교사명" value={currentUser?.name || profile?.teacherName || "-"} text="회원가입 정보에서 자동 입력" />
            <TeacherInfoCard label="업무용 이메일" value={currentUser?.email || profile?.email || "-"} text="회원가입 정보에서 자동 입력" />
            <TeacherInfoCard label="학교명" value={profile?.schoolName || "-"} text={profile?.profileLocked ? "신청 후 변경 요청 필요" : "수정 가능"} />
            <TeacherInfoCard label="연락처" value={profile?.phone || "-"} text="운영 안내 연락처" />
            <TeacherInfoCard label="출품 소속명/팀명" value={profile?.affiliationName || "-"} text="실제 출품 정보와 정확히 일치해야 합니다." />
            <TeacherInfoCard label="교사 증빙" value={profile?.verificationFileName || "미등록"} text={profile?.verificationStatus === "APPROVED" ? "확인 완료" : "관리자 확인 대기"} />
          </div>
          <div className="panel-action profile-actions">
            <button className="ghost-button" onClick={() => setEditing(true)} type="button">연락처·증빙 수정</button>
            {profile?.profileLocked ? (
              <button className="ghost-button" disabled={Boolean(pendingRequest)} onClick={() => setChangeRequestOpen(true)} type="button">
                {pendingRequest ? "변경 요청 처리 대기" : "학교명·출품 소속명 변경 요청"}
              </button>
            ) : null}
          </div>
          {requests.filter((request) => request.status !== "SUBMITTED").slice(0, 1).map((request) => (
            <div className="request-result" key={request.id}>
              <strong>최근 변경 요청: {request.status === "APPROVED" ? "승인" : "반려"}</strong>
              {request.adminReply ? <p>{request.adminReply}</p> : null}
            </div>
          ))}
        </>
      )}
      {changeRequestOpen && profile ? (
        <div className="modal-backdrop" role="presentation">
          <section aria-modal="true" className="modal-panel" role="dialog">
            <SectionHead title="학교명·출품 소속명 변경 요청" text="선생님이 요청 내용을 재확인한 뒤 관리자가 승인해야 반영됩니다." />
            <form className="form-grid" onSubmit={submitChangeRequest}>
              <label>현재 학교명<input readOnly value={profile.schoolName} /></label>
              <label>변경할 학교명<input defaultValue={profile.schoolName} name="requestedSchoolName" required /></label>
              <label>현재 출품 소속명<input readOnly value={profile.affiliationName} /></label>
              <label>변경할 출품 소속명<input defaultValue={profile.affiliationName} name="requestedAffiliationName" required /></label>
              <label className="wide">변경 사유<textarea name="reason" required rows={3} /></label>
              <label className="wide application-confirm">
                <input name="teacherConfirmed" required type="checkbox" />
                <span>변경 후 실제 출품할 소속명 또는 팀명과 정확히 일치하는지 확인했습니다.</span>
              </label>
              <div className="form-actions">
                <button className="ghost-button" onClick={() => setChangeRequestOpen(false)} type="button">취소</button>
                <button className="primary-button" type="submit">변경 요청 보내기</button>
              </div>
            </form>
          </section>
        </div>
      ) : null}
    </section>
  );
}

function AdminDashboard({ data, selectedEvent, setPage, onSelectEvent, onEventStatus }: { data: DashboardResponse; selectedEvent?: DreamEvent; setPage: (page: AdminPage) => void; onSelectEvent: (eventId: string) => void; onEventStatus: (eventId: string, status: DreamEvent["status"]) => void }) {
  const selectedApplications = selectedEvent ? data.applications.filter((item) => item.eventId === selectedEvent.id) : [];
  const selectedWorks = selectedEvent ? data.submissions.filter((item) => item.eventId === selectedEvent.id) : [];
  const selectedReview = selectedWorks.filter((item) => item.matchStatus !== "MATCHED").length;
  return (
    <>
      <section className="metric-grid">
        <MetricCard label="진행 꿈프" value={`${data.stats.activeEventCount}개`} />
        <MetricCard label="선정 학교" value={`${data.stats.selectedSchoolCount}교`} />
        <MetricCard label="출품 확인" value={`${data.stats.confirmedSubmissionCount}/${data.stats.expectedSubmissionCount}편`} />
        <MetricCard label="확인 필요" value={`${data.stats.reviewRequiredCount}건`} danger />
      </section>

      <section className="panel">
        <SectionHead title="행사별 현황" />
        {data.events.length ? (
          <div className="event-list">{data.events.map((event) => <EventSummaryCard key={event.id} event={event} applications={data.applications} works={data.submissions} selected={event.id === selectedEvent?.id} onSelect={() => onSelectEvent(event.id)} />)}</div>
        ) : (
          <EmptyState title="등록된 꿈프 행사가 없습니다." text="새 행사를 등록해 주세요." />
        )}
        <div className="panel-action">
          <button className="primary-button" onClick={() => setPage("events")} type="button"><Plus size={16} /> 새 행사 등록</button>
          {selectedEvent ? <button className="ghost-button" onClick={() => setPage(selectedReview ? "submissions" : "applications")} type="button">{selectedReview ? "매칭 검토" : "신청 검토"}</button> : null}
        </div>
      </section>

      {selectedEvent ? <section className="action-grid">
        <ActionCard icon={<FileCheck2 size={18} />} title="신청/선정 검토" text={`${selectedApplications.length}건의 신청을 선착순, 패널티, 성실 참여 기준으로 확인`} onClick={() => setPage("applications")} />
        <ActionCard icon={<Upload size={18} />} title="출품 엑셀 분석" text={`${selectedWorks.length}편 분석됨. 확인 필요 ${selectedReview}건`} onClick={() => setPage("submissions")} />
        <ActionCard icon={<Home size={18} />} title="선생님 DB" text="가입 선생님, 학교, 연락처, 참여 이력을 확인" onClick={() => setPage("teachers")} />
        <ActionCard icon={<Mail size={18} />} title="메일/공지 관리" text="예약 메일, 리마인드, 확인서 발급 안내를 작성" onClick={() => setPage("mails")} />
      </section> : null}
      {selectedEvent ? <EventWorkflowBar eventItem={selectedEvent} onAdvance={onEventStatus} /> : null}
    </>
  );
}

function EventsPage({ data, selectedEvent, onCreateEvent, onSelectEvent, onEventStatus }: { data: DashboardResponse; selectedEvent?: DreamEvent; onCreateEvent: (event: FormEvent<HTMLFormElement>) => Promise<void> | void; onSelectEvent: (eventId: string) => void; onEventStatus: (eventId: string, status: DreamEvent["status"]) => void }) {
  const [posterPreview, setPosterPreview] = useState("");

  function handlePosterChange(file?: File) {
    if (!file) {
      setPosterPreview("");
      return;
    }
    void fileToDataUrl(file).then(setPosterPreview);
  }

  return (
    <section className="panel">
      <SectionHead title="행사 운영" />
      <form className="event-editor" onSubmit={async (event) => {
        await onCreateEvent(event);
        setPosterPreview("");
      }}>
        <div className="event-fields">
          <label className="field-title">행사명<input name="title" required placeholder="예: 제13회 박카스 29초영화제" /></label>
          <div className="event-field-row">
            <label>행사 유형<select name="eventType" defaultValue={"TWENTY_NINE_SECONDS" satisfies EventType}><option value="TWENTY_NINE_SECONDS">29초영화제</option><option value="SHORTFORM_KING">29역숏폼왕</option></select></label>
            <label className="field-number">목표 작품 수<input name="targetSubmissionCount" min="1" step="1" type="number" defaultValue={10} inputMode="numeric" /></label>
          </div>
          <div className="event-field-row">
            <label>공모기간<input name="contestPeriod" placeholder="2026.04.08 - 2026.05.21" /></label>
            <label>총상금/혜택<input name="prize" placeholder="총상금 또는 혜택" /></label>
          </div>
          <label>주제<input name="topic" placeholder="행사 주제" /></label>
          <label>출품 URL<input name="submissionUrl" placeholder="https://..." /></label>
          <label>안내사항<textarea name="notice" rows={4} placeholder="선생님에게 보여줄 주요 안내" /></label>
          <div className="form-actions"><button className="primary-button" type="submit">행사 등록</button></div>
        </div>
        <aside className="poster-uploader">
          <label className="poster-drop">
            <input accept="image/*" name="posterFile" onChange={(event) => handlePosterChange(event.currentTarget.files?.[0])} type="file" />
            {posterPreview ? <img alt="등록할 포스터 미리보기" src={posterPreview} /> : <span><strong>포스터를 여기에 올려주세요</strong><small>PNG, JPG 이미지를 선택하면 바로 미리보기됩니다.</small></span>}
          </label>
        </aside>
      </form>
      <div className="sub-panel">
        <h3>등록된 행사</h3>
        {data.events.length ? <div className="event-list">{data.events.map((event) => <button className={"event-row event-row-button " + (selectedEvent?.id === event.id ? "active" : "")} key={event.id} onClick={() => onSelectEvent(event.id)} type="button"><div><strong>{event.title}</strong><small>{eventTypeLabels[event.eventType]} · {event.contestPeriod || "기간 미입력"}</small></div><span className="status-pill success">{statusLabels[event.status]}</span></button>)}</div> : <EmptyState title="아직 등록된 행사가 없습니다." text="첫 꿈프 행사를 등록해 주세요." />}
      </div>
      {selectedEvent ? <EventWorkflowBar eventItem={selectedEvent} onAdvance={onEventStatus} /> : null}
    </section>
  );
}

function ApplicationsPage({ data, selectedEvent, onApplicationStatus }: { data: DashboardResponse; selectedEvent?: DreamEvent; onApplicationStatus: (applicationId: string, status: DreamApplication["status"]) => void }) {
  const trustOrder = { BENEFIT: 0, NORMAL: 1, PENALTY: 2 };
  const rows = (selectedEvent ? data.applications.filter((application) => application.eventId === selectedEvent.id) : data.applications)
    .slice()
    .sort((left, right) => {
      const leftTeacher = data.teachers.find((teacher) => teacher.id === left.teacherProfileId);
      const rightTeacher = data.teachers.find((teacher) => teacher.id === right.teacherProfileId);
      const trustDifference = trustOrder[leftTeacher?.trustStatus || "NORMAL"] - trustOrder[rightTeacher?.trustStatus || "NORMAL"];
      return trustDifference || new Date(left.createdAt).getTime() - new Date(right.createdAt).getTime();
    });
  return (
    <section className="panel">
      <SectionHead title="신청/선정" text={selectedEvent ? `${selectedEvent.title} 신청 학교를 검토하고 선정 상태를 처리합니다.` : "행사를 선택하면 신청/선정 목록을 확인할 수 있습니다."} />
      {data.stats.unusedCouponCount === 0 && rows.some((application) => application.status === "SUBMITTED") ? <div className="attention-strip"><strong>지급 가능한 쿠폰이 없습니다.</strong><span>선정 전에 혜택/지원에서 쿠폰 엑셀을 업로드해 주세요.</span></div> : null}
      {rows.length ? (
        <div className="table-wrap"><table><thead><tr><th>순서</th><th>학교</th><th>소속/팀명</th><th>참여 기준</th><th>예상 작품</th><th>신청일</th><th>상태</th><th>처리</th></tr></thead><tbody>{rows.map((application, index) => {
          const teacher = data.teachers.find((item) => item.id === application.teacherProfileId);
          const trustLabel = teacher?.trustStatus === "BENEFIT" ? "우선" : teacher?.trustStatus === "PENALTY" ? "후순위" : "일반";
          return <tr key={application.id}><td>{index + 1}</td><td>{application.schoolName}</td><td>{application.affiliationName}</td><td>{trustLabel}</td><td>{application.expectedSubmissionCount}편</td><td>{new Date(application.createdAt).toLocaleDateString("ko-KR")}</td><td>{applicationStatusLabels[application.status]}</td><td><div className="button-row"><button className="ghost-button" onClick={() => onApplicationStatus(application.id, "SELECTED")} type="button">선정</button><button className="ghost-button" onClick={() => onApplicationStatus(application.id, "WAITLISTED")} type="button">예비</button><button className="ghost-button" onClick={() => onApplicationStatus(application.id, "NOT_SELECTED")} type="button">미선정</button></div></td></tr>;
        })}</tbody></table></div>
      ) : (
        <EmptyState title="접수된 신청이 없습니다." text="선생님 신청이 들어오면 선착순, 패널티, 성실 참여 이력을 기준으로 검토합니다." />
      )}
    </section>
  );
}

function TeachersDbPage({
  data,
  selectedEvent,
  onProfileChangeReview
}: {
  data: DashboardResponse;
  selectedEvent?: DreamEvent;
  onProfileChangeReview: (requestId: string, status: "APPROVED" | "REJECTED", adminReply: string) => void;
}) {
  const rows = data.teachers.map((teacher) => {
    const teacherApplications = data.applications.filter((application) => application.teacherProfileId === teacher.id);
    const eventApplications = selectedEvent ? teacherApplications.filter((application) => application.eventId === selectedEvent.id) : teacherApplications;
    const works = data.submissions.filter((work) => eventApplications.some((application) => application.id === work.applicationId));
    return { teacher, applications: teacherApplications, eventApplications, works };
  });

  return (
    <section className="panel">
      <SectionHead title="선생님 DB" text="꿈프 가입 선생님과 학교별 신청, 선정, 출품 현황을 관리합니다." />
      <div className="metric-grid compact">
        <MetricCard label="가입 선생님" value={`${data.registeredTeachers.length}명`} />
        <MetricCard label="프로필 완료" value={`${data.teachers.length}명`} />
        <MetricCard label="변경 확인 대기" value={`${data.profileChangeRequests.filter((request) => request.status === "SUBMITTED").length}건`} />
      </div>
      {data.registeredTeachers.some((teacher) => !teacher.profileId) ? (
        <div className="attention-strip">
          <strong>프로필 미완성 {data.registeredTeachers.filter((teacher) => !teacher.profileId).length}명</strong>
          <span>가입은 완료했지만 아직 첫 행사 신청을 하지 않은 선생님입니다.</span>
        </div>
      ) : null}
      {data.registeredTeachers.some((teacher) => !teacher.profileId) ? (
        <div className="compact-list pending-teachers">
          {data.registeredTeachers.filter((teacher) => !teacher.profileId).map((teacher) => (
            <div className="compact-row" key={teacher.id}>
              <div><strong>{teacher.name}</strong><small>{teacher.email}</small></div>
              <span>{teacher.status === "ACTIVE" ? "이메일 인증 완료" : "인증 대기"}</span>
            </div>
          ))}
        </div>
      ) : null}
      {rows.length ? (
        <div className="table-wrap">
          <table>
            <thead><tr><th>학교</th><th>담당 선생님</th><th>이메일</th><th>연락처</th><th>소속/팀명</th><th>교사 증빙</th><th>신청/선정</th><th>출품 확인</th></tr></thead>
            <tbody>
              {rows.map(({ teacher, applications, eventApplications, works }) => {
                const selectedCount = applications.filter((application) => application.status === "SELECTED").length;
                return (
                  <tr key={teacher.id}>
                    <td>{teacher.schoolName || "-"}</td>
                    <td>{teacher.teacherName || "-"}</td>
                    <td>{teacher.email || "-"}</td>
                    <td>{teacher.phone || "-"}</td>
                    <td>{teacher.affiliationName || "-"}</td>
                    <td>{teacher.verificationFileName ? <a href={`/api/profile/verification?profileId=${encodeURIComponent(teacher.id)}`} rel="noreferrer" target="_blank">증빙 보기</a> : "미제출"}</td>
                    <td>{selectedEvent ? `${eventApplications.length}건` : `${applications.length}건 · 선정 ${selectedCount}건`}</td>
                    <td>{works.length}편</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState title="등록된 선생님이 없습니다." text="선생님이 회원가입하거나 꿈프를 신청하면 이곳에 학교 DB가 쌓입니다." />
      )}
      {data.profileChangeRequests.length ? (
        <div className="sub-panel profile-request-list">
          <h3>학교명·출품 소속명 변경 요청</h3>
          {data.profileChangeRequests.map((request) => (
            <ProfileChangeRequestRow key={request.id} request={request} onReview={onProfileChangeReview} />
          ))}
        </div>
      ) : null}
    </section>
  );
}

function ProfileChangeRequestRow({
  request,
  onReview
}: {
  request: ProfileChangeRequest;
  onReview: (requestId: string, status: "APPROVED" | "REJECTED", adminReply: string) => void;
}) {
  const [reply, setReply] = useState(request.adminReply);
  return (
    <article className="profile-request-row">
      <div>
        <strong>{request.teacherName} · {request.email}</strong>
        <p>학교명: {request.currentSchoolName} → {request.requestedSchoolName}</p>
        <p>출품 소속명: {request.currentAffiliationName} → {request.requestedAffiliationName}</p>
        <small>사유: {request.reason || "미입력"}</small>
      </div>
      {request.status === "SUBMITTED" ? (
        <div className="request-review">
          <input onChange={(event) => setReply(event.currentTarget.value)} placeholder="선생님에게 전달할 답변" value={reply} />
          <div className="button-row">
            <button className="ghost-button" onClick={() => onReview(request.id, "REJECTED", reply)} type="button">반려</button>
            <button className="primary-button" onClick={() => onReview(request.id, "APPROVED", reply)} type="button">확인 후 승인</button>
          </div>
        </div>
      ) : (
        <span className={`status-pill ${request.status === "APPROVED" ? "success" : ""}`}>{request.status === "APPROVED" ? "승인" : "반려"}</span>
      )}
    </article>
  );
}

function SubmissionsPage({ data, selectedEvent, onUpload, onConfirmMatch }: { data: DashboardResponse; selectedEvent?: DreamEvent; onUpload: (file?: File) => void; onConfirmMatch: (externalSubmissionId: string, applicationId: string) => void }) {
  const works = selectedEvent ? data.submissions.filter((work) => work.eventId === selectedEvent.id) : [];
  const selectedApplications = selectedEvent
    ? data.applications.filter((application) => application.eventId === selectedEvent.id && application.status === "SELECTED")
    : [];
  return (
    <section className="panel">
      <SectionHead title="출품 확인" text="관리자가 업로드한 출품 엑셀만 분석합니다. 학교명/소속명 기준으로 자동 매칭하고 유사 항목은 확인 필요로 분류합니다." />
      {selectedEvent ? (
        <>
          <div className="event-row active"><div><strong>{selectedEvent.title}</strong><small>{eventTypeLabels[selectedEvent.eventType]} · 출품 소속명/팀명 기준 매칭</small></div><UploadButton label="출품 엑셀 업로드" accept=".xlsx,.xls,.csv" onFile={onUpload} /></div>
          <SubmissionReviewTable works={works} events={data.events} applications={selectedApplications} onConfirmMatch={onConfirmMatch} />
        </>
      ) : (
        <EmptyState title="먼저 행사를 등록해 주세요." text="행사 운영에서 꿈프 행사를 만든 뒤 출품 엑셀을 업로드할 수 있습니다." />
      )}
    </section>
  );
}

function BenefitsPage({ data, onCouponUpload }: { data: DashboardResponse; onCouponUpload: (file?: File) => void }) {
  return (
    <section className="panel">
      <SectionHead title="혜택/지원" text="한국경제신문 구독권 쿠폰 엑셀을 업로드해 재고를 관리합니다." />
      <UploadButton label="쿠폰 엑셀 업로드" accept=".xlsx,.xls,.csv" onFile={onCouponUpload} />
      <div className="metric-grid compact"><MetricCard label="총 쿠폰" value={`${data.coupons.length}개`} /><MetricCard label="미사용" value={`${data.stats.unusedCouponCount}개`} /><MetricCard label="지급완료" value={`${data.coupons.filter((coupon) => coupon.status === "ASSIGNED").length}개`} /></div>
      {data.coupons.length ? <div className="table-wrap"><table><thead><tr><th>쿠폰번호</th><th>상태</th><th>지급 학교</th><th>업로드일</th></tr></thead><tbody>{data.coupons.map((coupon) => {
        const application = data.applications.find((item) => item.id === coupon.assignedApplicationId);
        return <tr key={coupon.id}><td>{coupon.couponNumber}</td><td>{coupon.status === "UNUSED" ? "미사용" : "지급완료"}</td><td>{application?.schoolName || "-"}</td><td>{new Date(coupon.uploadedAt).toLocaleString("ko-KR")}</td></tr>;
      })}</tbody></table></div> : <EmptyState title="업로드된 쿠폰이 없습니다." text="쿠폰 번호가 들어 있는 엑셀을 업로드하면 자동으로 번호를 인식합니다." />}
    </section>
  );
}

function DocumentsPage({ data, selectedEvent }: { data: DashboardResponse; selectedEvent?: DreamEvent }) {
  const selectedApplications = data.applications.filter((application) => application.status === "SELECTED" && (!selectedEvent || application.eventId === selectedEvent.id));
  return (
    <section className="panel">
      <SectionHead title="활동확인서" text="고정 활동확인서 양식에 학교명, 작품명, 학생명, 활동 기간을 자동으로 넣어 PDF를 발급합니다." />
      {selectedApplications.length ? (
        <div className="document-list">
          {selectedApplications.map((application) => {
            const eventItem = data.events.find((event) => event.id === application.eventId);
            const applicationWorks = data.submissions.filter((work) => work.applicationId === application.id);
            const matchedWorks = applicationWorks.filter((work) => work.matchStatus === "MATCHED");
            const unresolvedCount = applicationWorks.filter((work) => work.matchStatus !== "MATCHED").length;
            const canIssue = matchedWorks.length > 0 && unresolvedCount === 0 && ["CERTIFICATE_RUNNING", "SCORE_REPORT_RUNNING", "READY_TO_CLOSE", "CLOSED"].includes(eventItem?.status || "");
            return (
              <article className="document-row" key={application.id}>
                <div>
                  <strong>{application.schoolName}</strong>
                  <small>{eventItem?.title || "선택된 행사"} · 확인 {matchedWorks.length}편{unresolvedCount ? ` · 검토 필요 ${unresolvedCount}편` : ""}</small>
                </div>
                {canIssue ? <CertificateDownloadButton application={application} eventItem={eventItem} works={matchedWorks} teacherName={data.teachers.find((teacher) => teacher.id === application.teacherProfileId)?.teacherName} /> : <span className="status-pill">발급 조건 확인 필요</span>}
              </article>
            );
          })}
        </div>
      ) : (
        <EmptyState title="발급 가능한 선정 학교가 없습니다." text="신청/선정에서 학교를 선정하고 출품 확인이 완료되면 활동확인서를 발급할 수 있습니다." />
      )}
    </section>
  );
}

type MailHistoryItem = {
  id: string;
  subject: string;
  body: string;
  status: string;
  scheduledAt?: string | null;
  sentAt?: string | null;
  createdAt: string;
  recipients?: Array<{ email: string; schoolName?: string | null; teacherName?: string | null; isExcluded?: boolean }>;
};

function MailsPage({ data, selectedEvent, onSubmit }: { data: DashboardResponse; selectedEvent?: DreamEvent; onSubmit: (event: FormEvent<HTMLFormElement>) => void }) {
  const recipientCandidates = data.applications
    .filter((application) => application.status === "SELECTED" && (!selectedEvent || application.eventId === selectedEvent.id))
    .map((application) => {
      const teacher = data.teachers.find((item) => item.id === application.teacherProfileId);
      const eventItem = data.events.find((item) => item.id === application.eventId);
      return teacher?.email ? { application, teacher, eventItem, email: teacher.email } : null;
    })
    .filter(Boolean) as Array<{ application: DreamApplication; teacher: TeacherProfile; eventItem?: DreamEvent; email: string }>;
  const recipientKey = (selectedEvent?.id || "all") + ":" + recipientCandidates.map((candidate) => candidate.application.id).join("|");
  const [checkedEmails, setCheckedEmails] = useState<string[]>(() => [...new Set(recipientCandidates.map((candidate) => candidate.email))]);
  const [recipientText, setRecipientText] = useState(checkedEmails.join("\n"));
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");
  const [mailHistory, setMailHistory] = useState<MailHistoryItem[]>([]);

  useEffect(() => {
    const nextEmails = [...new Set(recipientCandidates.map((candidate) => candidate.email))];
    setCheckedEmails(nextEmails);
    setRecipientText(nextEmails.join("\n"));
  }, [recipientKey]);

  useEffect(() => {
    void loadMailHistory();
  }, []);

  async function loadMailHistory() {
    const response = await fetch("/api/mails");
    if (!response.ok) return;
    const result = (await response.json()) as { mails?: MailHistoryItem[] };
    setMailHistory(result.mails ?? []);
  }

  function toggleRecipient(email: string) {
    setCheckedEmails((current) => {
      const nextEmails = current.includes(email) ? current.filter((item) => item !== email) : [...current, email];
      setRecipientText(nextEmails.join("\n"));
      return nextEmails;
    });
  }

  function selectAllRecipients() {
    const nextEmails = [...new Set(recipientCandidates.map((candidate) => candidate.email))];
    setCheckedEmails(nextEmails);
    setRecipientText(nextEmails.join("\n"));
  }

  function clearRecipients() {
    setCheckedEmails([]);
    setRecipientText("");
  }

  function loadMail(mail: MailHistoryItem) {
    const emails = (mail.recipients ?? []).filter((recipient) => !recipient.isExcluded).map((recipient) => recipient.email);
    setRecipientText(emails.join("\n"));
    setCheckedEmails(emails);
    setSubject(mail.subject);
    setBody(mail.body);
    setScheduledAt(mail.scheduledAt ? mail.scheduledAt.slice(0, 16) : "");
  }

  async function submitAndRefresh(event: FormEvent<HTMLFormElement>) {
    await onSubmit(event);
    await loadMailHistory();
  }

  return (
    <section className="panel">
      <SectionHead title="메일/공지" text="초안 저장, 예약 저장, 즉시 발송을 분리해 관리합니다." />
      <form className="form-grid" onSubmit={submitAndRefresh}>
        <div className="wide recipient-picker">
          <div className="recipient-picker-head">
            <strong>수신 학교 선택</strong>
            <div className="button-row">
              <button className="ghost-button" onClick={selectAllRecipients} type="button">전체 선택</button>
              <button className="ghost-button" onClick={clearRecipients} type="button">선택 해제</button>
            </div>
          </div>
          {recipientCandidates.length ? (
            <div className="recipient-grid">
              {recipientCandidates.map(({ application, teacher, eventItem, email }) => (
                <label className="recipient-option" key={application.id}>
                  <input checked={checkedEmails.includes(email)} onChange={() => toggleRecipient(email)} type="checkbox" />
                  <span>
                    <strong>{teacher.schoolName}</strong>
                    <small>{teacher.teacherName} · {email} · {eventItem?.title || "행사 미지정"}</small>
                  </span>
                </label>
              ))}
            </div>
          ) : (
            <EmptyState title="선정된 학교가 없습니다." text="현재 선택한 꿈프에서 학교를 선정하면 메일 수신 후보로 자동 표시됩니다." />
          )}
        </div>
        <label className="wide">수신자 이메일<textarea name="recipientEmails" rows={4} value={recipientText} onChange={(event) => setRecipientText(event.currentTarget.value)} placeholder="teacher@example.com&#10;teacher2@example.com" required /></label>
        <label className="wide">제목<input name="subject" required value={subject} onChange={(event) => setSubject(event.currentTarget.value)} placeholder="꿈프 선정 및 출품 안내" /></label>
        <label className="wide">본문<textarea name="body" rows={8} required value={body} onChange={(event) => setBody(event.currentTarget.value)} placeholder="발송 전 관리자가 검토할 메일 본문" /></label>
        <label>예약 시각<input name="scheduledAt" type="datetime-local" value={scheduledAt} onChange={(event) => setScheduledAt(event.currentTarget.value)} /></label>
        <div className="mail-actions">
          <button className="ghost-button" name="action" type="submit" value="save">초안 저장</button>
          <button className="ghost-button" name="action" type="submit" value="schedule">예약 저장</button>
          <button className="primary-button" name="action" type="submit" value="send">즉시 발송</button>
          {recipientText ? <a className="ghost-button" href={"mailto:?bcc=" + encodeURIComponent(recipientText.replace(/\n/g, ","))}>메일앱 열기</a> : null}
        </div>
      </form>
      <div className="sub-panel">
        <div className="recipient-picker-head">
          <h3>저장한 메일</h3>
          <button className="ghost-button" onClick={loadMailHistory} type="button">새로고침</button>
        </div>
        {mailHistory.length ? (
          <div className="mail-history-list">
            {mailHistory.map((mail) => (
              <button className="mail-history-item" key={mail.id} onClick={() => loadMail(mail)} type="button">
                <strong>{mail.subject}</strong>
                <small>{mail.status} · {(mail.recipients ?? []).filter((recipient) => !recipient.isExcluded).length}명 · {new Date(mail.createdAt).toLocaleString("ko-KR")}</small>
              </button>
            ))}
          </div>
        ) : (
          <EmptyState title="저장된 메일이 없습니다." text="초안 저장 또는 예약 저장을 하면 이곳에서 다시 불러올 수 있습니다." />
        )}
      </div>
    </section>
  );
}

function HistoryPage({ data }: { data: DashboardResponse }) {
  return <section className="panel"><SectionHead title="히스토리" text="운영 변경과 업로드 기록을 보관합니다." />{data.notices.length ? <div className="compact-list">{data.notices.map((notice) => <div className="compact-row" key={notice.id}><div><strong>{notice.type}</strong><small>{notice.message}</small></div><span>{new Date(notice.createdAt).toLocaleString("ko-KR")}</span></div>)}</div> : <EmptyState title="아직 히스토리가 없습니다." text="운영 작업이 발생하면 자동으로 기록합니다." />}</section>;
}

function WorksTable({ works, events, emptyText }: { works: SubmissionWork[]; events: DreamEvent[]; emptyText: string }) {
  if (!works.length) return <EmptyState title={emptyText} text="실제 엑셀 업로드 또는 관리자 승인 후 데이터가 표시됩니다." />;
  return (
    <div className="table-wrap"><table><thead><tr><th>행사</th><th>소속/팀명</th><th>작품명</th><th>감독/출품자</th><th>평점</th><th>순위</th><th>본심</th><th>매칭</th></tr></thead><tbody>{works.map((work) => <tr key={work.id}><td>{events.find((event) => event.id === work.eventId)?.title ?? "-"}</td><td>{work.affiliationName || "-"}</td><td>{work.submissionUrl ? <a href={work.submissionUrl} rel="noreferrer" target="_blank">{work.title || "작품 링크"}</a> : work.title || "-"}</td><td>{work.participantName || "-"}</td><td>{work.preliminaryScore ?? "-"}</td><td>{work.rank ?? "-"}</td><td>{work.finalRoundStatus === "ADVANCED" ? "진출" : work.finalRoundStatus === "NOT_ADVANCED" ? "미진출" : "-"}</td><td><span className={work.matchStatus === "NEEDS_REVIEW" ? "danger-text" : ""}>{matchStatusLabels[work.matchStatus]}</span></td></tr>)}</tbody></table></div>
  );
}

function SubmissionReviewTable({ works, events, applications, onConfirmMatch }: { works: SubmissionWork[]; events: DreamEvent[]; applications: DreamApplication[]; onConfirmMatch: (externalSubmissionId: string, applicationId: string) => void }) {
  const [targets, setTargets] = useState<Record<string, string>>({});
  if (!works.length) return <EmptyState title="아직 업로드된 출품 엑셀이 없습니다." text="행사에 맞는 출품 엑셀을 업로드하면 소속명/팀명 기준으로 분석합니다." />;
  return (
    <div className="table-wrap">
      <table>
        <thead><tr><th>소속/팀명</th><th>작품명</th><th>감독/출품자</th><th>평점</th><th>순위</th><th>매칭 상태</th><th>학교 확인</th></tr></thead>
        <tbody>
          {works.map((work) => {
            const currentApplicationId = work.applicationId || "";
            const selectedTarget = targets[work.id] ?? currentApplicationId;
            return (
              <tr key={work.id}>
                <td>{work.affiliationName || "-"}</td>
                <td>{work.submissionUrl ? <a href={work.submissionUrl} rel="noreferrer" target="_blank">{work.title || "작품 링크"}</a> : work.title || "-"}</td>
                <td>{work.participantName || "-"}</td>
                <td>{work.preliminaryScore ?? "-"}</td>
                <td>{work.rank ?? "-"}</td>
                <td><span className={work.matchStatus === "MATCHED" ? "success-text" : "danger-text"}>{matchStatusLabels[work.matchStatus]}</span><small className="cell-note">{work.matchReason}</small></td>
                <td>
                  {work.matchStatus === "MATCHED" ? (
                    <span>{applications.find((application) => application.id === work.applicationId)?.schoolName || work.schoolName}</span>
                  ) : (
                    <div className="match-control">
                      <select value={selectedTarget} onChange={(event) => setTargets((current) => ({ ...current, [work.id]: event.target.value }))}>
                        <option value="">학교 선택</option>
                        {applications.map((application) => <option key={application.id} value={application.id}>{application.schoolName} · {application.affiliationName}</option>)}
                      </select>
                      <button className="ghost-button" disabled={!selectedTarget} onClick={() => onConfirmMatch(work.id, selectedTarget)} type="button">매칭 확정</button>
                    </div>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function CertificateDownloadButton({ application, eventItem, works, teacherName = "" }: { application: DreamApplication; eventItem?: DreamEvent; works: SubmissionWork[]; teacherName?: string }) {
  const [isDownloading, setIsDownloading] = useState(false);
  async function download() {
    setIsDownloading(true);
    try {
      const response = await fetch("/api/certificates/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          applicationId: application.id,
          certificateNo: String(Date.now()).slice(-4),
          schoolName: application.schoolName,
          teacherName,
          eventTitle: eventItem?.title || "영상 꿈나무 양성 프로젝트",
          activityPeriod: eventItem?.contestPeriod || "",
          works: works.map((work) => ({ title: work.title, participantName: work.participantName }))
        })
      });
      if (!response.ok) return;
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `${application.schoolName}-활동확인서.pdf`;
      anchor.click();
      URL.revokeObjectURL(url);
    } finally {
      setIsDownloading(false);
    }
  }
  return <button className="primary-button" disabled={isDownloading} onClick={download} type="button">{isDownloading ? "생성 중" : "활동확인서 PDF"}</button>;
}

function EventWorkflowBar({ eventItem, onAdvance }: { eventItem: DreamEvent; onAdvance: (eventId: string, status: DreamEvent["status"]) => void }) {
  const currentIndex = eventWorkflow.indexOf(eventItem.status);
  const nextStatus = eventWorkflow[currentIndex + 1];
  return (
    <section className="workflow-panel">
      <div>
        <span>현재 단계</span>
        <strong>{statusLabels[eventItem.status]}</strong>
        <small>{eventItem.title}</small>
      </div>
      <div className="workflow-track" aria-label="꿈프 운영 단계">
        {eventWorkflow.map((status, index) => <span className={index <= currentIndex ? "complete" : ""} key={status} title={statusLabels[status]} />)}
      </div>
      {nextStatus ? <button className="primary-button" onClick={() => onAdvance(eventItem.id, nextStatus)} type="button">{nextActionLabels[eventItem.status] || `다음: ${statusLabels[nextStatus]}`}</button> : <span className="status-pill success">운영 종료</span>}
    </section>
  );
}

function EventSummaryCard({ event, applications, works, selected, onSelect }: { event: DreamEvent; applications: DreamApplication[]; works: SubmissionWork[]; selected: boolean; onSelect: () => void }) {
  const eventApplications = applications.filter((item) => item.eventId === event.id);
  const selectedCount = eventApplications.filter((item) => item.status === "SELECTED").length;
  const eventWorks = works.filter((item) => item.eventId === event.id);
  const reviewCount = eventWorks.filter((item) => item.matchStatus !== "MATCHED").length;
  return (
    <button className={`event-summary-card ${selected ? "active" : ""}`} onClick={onSelect} type="button">
      <div><span className="status-pill success">{statusLabels[event.status]}</span><h3>{event.title}</h3><p>{eventTypeLabels[event.eventType]} · {event.contestPeriod || "기간 미입력"}</p></div>
      <div className="mini-stats"><span>신청 {eventApplications.length}건</span><span>선정 {selectedCount}교</span><span>출품 {eventWorks.length}편</span><span className={reviewCount ? "danger-text" : ""}>확인 {reviewCount}건</span></div>
    </button>
  );
}

function ActionCard({ icon, title, text, onClick }: { icon: ReactNode; title: string; text: string; onClick: () => void }) {
  return <button className="action-card" onClick={onClick} type="button"><span className="action-icon">{icon}</span><span><strong>{title}</strong><p>{text}</p></span></button>;
}

function TeacherStatusCard({ icon, label, value, text }: { icon: ReactNode; label: string; value: string; text: string }) {
  return <article className="teacher-status-card"><div className="teacher-icon">{icon}</div><span>{label}</span><strong>{value}</strong><p>{text}</p></article>;
}

function TeacherInfoCard({ label, value, text }: { label: string; value: string; text: string }) {
  return <article className="teacher-info-card"><span>{label}</span><strong>{value}</strong><p>{text}</p></article>;
}

function TeacherApplicationCard({ application, events }: { application: DreamApplication; events: DreamEvent[] }) {
  const event = events.find((item) => item.id === application.eventId);
  return <article className="teacher-application-card"><div><h3>{event?.title ?? "삭제된 행사"}</h3><p>{application.schoolName} · {application.affiliationName} · 예상 {application.expectedSubmissionCount}편</p></div><span className="status-pill success">{applicationStatusLabels[application.status]}</span></article>;
}

function MetricCard({ label, value, danger = false }: { label: string; value: string; danger?: boolean }) {
  return <article className="metric-card"><span>{label}</span><strong className={danger ? "danger-text" : ""}>{value}</strong></article>;
}

function SectionHead({ title }: { title: string; text?: string }) {
  return <div className="section-head"><div><h2>{title}</h2></div></div>;
}

function EmptyState({ title, text }: { title: string; text: string }) {
  return <div className="empty-state"><strong>{title}</strong><p>{text}</p></div>;
}

function UploadButton({ label, accept, onFile }: { label: string; accept: string; onFile: (file?: File) => void }) {
  return <label className="upload-button"><Upload size={16} /> {label}<input accept={accept} hidden type="file" onChange={(event) => onFile(event.target.files?.[0])} /></label>;
}

async function readSheetRows(file: File): Promise<Array<Record<string, string | number | undefined>>> {
  const XLSX = await import("xlsx");
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: "array" });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  return XLSX.utils.sheet_to_json<Record<string, string | number | undefined>>(sheet, { defval: "" });
}

async function readSheetCellValues(file: File) {
  const XLSX = await import("xlsx");
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: "array" });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json<Array<string | number>>(sheet, { header: 1, defval: "" });
  return rows.flat();
}

function fileToDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("파일을 읽지 못했습니다."));
    reader.readAsDataURL(file);
  });
}

async function readErrorMessage(response: Response) {
  try {
    const body = await response.json();
    return body?.message || "요청을 처리하지 못했습니다.";
  } catch {
    return "요청을 처리하지 못했습니다.";
  }
}

function normalize(value: string) {
  return value.replace(/\s/g, "").trim();
}
