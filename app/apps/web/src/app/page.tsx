"use client";

import { useEffect, useMemo, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import { Bell, CheckCircle2, FileCheck2, Gift, Home, Mail, Plus, RefreshCw, RotateCcw, Upload } from "lucide-react";
import type { DashboardResponse, DreamApplication, DreamEvent, EventType, SubmissionWork } from "@/lib/with-types";
import { applicationStatusLabels, eventTypeLabels, matchStatusLabels, statusLabels } from "@/lib/with-types";

type ViewMode = "teacher" | "admin";
type TeacherPage = "home" | "available" | "works" | "benefits" | "docs" | "profile";
type AdminPage = "dashboard" | "events" | "applications" | "submissions" | "benefits" | "documents" | "mails" | "history";
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
  { key: "applications", label: "신청/선정" },
  { key: "submissions", label: "출품 확인" },
  { key: "benefits", label: "혜택/지원" },
  { key: "documents", label: "활동확인서" },
  { key: "mails", label: "메일/공지" },
  { key: "history", label: "히스토리" }
];

const emptyDashboard: DashboardResponse = {
  events: [],
  teachers: [],
  applications: [],
  submissions: [],
  coupons: [],
  certificateTemplates: [],
  notices: [],
  stats: {
    activeEventCount: 0,
    selectedSchoolCount: 0,
    expectedSubmissionCount: 0,
    confirmedSubmissionCount: 0,
    reviewRequiredCount: 0,
    unusedCouponCount: 0
  }
};

const teacherSnapshot = {
  name: "",
  school: "",
  email: "",
  phone: "",
  trust: "일반",
  affiliation: ""
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

  useEffect(() => {
    void loadDashboard();
    void loadSession();
  }, []);

  useEffect(() => {
    if (!selectedEventId && data.events[0]) setSelectedEventId(data.events[0].id);
  }, [data.events, selectedEventId]);

  const selectedEvent = useMemo(() => data.events.find((event) => event.id === selectedEventId), [data.events, selectedEventId]);

  async function loadDashboard() {
    setIsLoading(true);
    const response = await fetch("/api/dashboard", { cache: "no-store" });
    setData(await response.json());
    setIsLoading(false);
  }

  async function loadSession() {
    const response = await fetch("/api/auth/me", { cache: "no-store" });
    if (!response.ok) return;
    const body = (await response.json()) as { user?: SessionUser | null };
    if (body.user) {
      setCurrentUser(body.user);
      setMode(body.user.userType === "ADMIN" ? "admin" : "teacher");
    }
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
    setMessage(`${body.user.name} 계정으로 로그인했습니다.`);
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
    setMode("teacher");
    setMessage("로그아웃했습니다.");
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
    const nextData = await postJson(
      "/api/events",
      {
        title: formData.get("title"),
        eventType: formData.get("eventType"),
        contestPeriod: formData.get("contestPeriod"),
        topic: formData.get("topic"),
        prize: formData.get("prize"),
        posterUrl: formData.get("posterUrl"),
        homepageUrl: formData.get("homepageUrl"),
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

  async function handleTemplateUpload(file?: File) {
    if (!file) return;
    await postJson("/api/certificate-templates", { fileName: file.name, dataUrl: await fileToDataUrl(file) }, "활동확인서 템플릿을 저장했습니다.");
  }

  async function handleApply(eventItem: DreamEvent, formData: FormData) {
    await postJson(
      "/api/applications",
      {
        eventId: eventItem.id,
        schoolName: formData.get("schoolName"),
        teacherName: formData.get("teacherName"),
        email: formData.get("email"),
        phone: formData.get("phone"),
        affiliationName: formData.get("affiliationName"),
        expectedSubmissionCount: Number(formData.get("expectedSubmissionCount") || 1),
        usagePlan: formData.get("usagePlan"),
        memo: formData.get("memo")
      },
      "꿈프 신청을 접수했습니다."
    );
    setTeacherPage("home");
  }

  async function handleApplicationStatus(applicationId: string, status: DreamApplication["status"]) {
    await postJson("/api/applications", { applicationId, status }, "신청 상태를 변경했습니다.", "PATCH");
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
        sendNow: formData.get("sendNow") === "on"
      })
    });
    if (!response.ok) {
      setMessage(await readErrorMessage(response));
      return;
    }
    setMessage(formData.get("sendNow") === "on" ? "운영 공지를 발송했습니다." : "메일 초안/예약을 저장했습니다.");
    event.currentTarget.reset();
    await loadDashboard();
  }

  async function handleReset() {
    if (!confirm("등록된 행사, 쿠폰, 출품 분석 데이터를 모두 초기화할까요?")) return;
    await postJson("/api/reset", undefined, "운영 데이터를 초기화했습니다.");
    setSelectedEventId("");
  }

  const navItems = mode === "teacher" ? teacherPages : adminPages;
  const activeKey = mode === "teacher" ? teacherPage : adminPage;

  if (!currentUser) {
    return (
      <main className="login-shell">
        <section className="login-brand">
          <div className="brand-box login-brand-box">
            <span>29</span>
            <div>
              <strong>29 WITH</strong>
              <small>영상 꿈나무 양성 프로젝트</small>
            </div>
          </div>
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
          <span>29</span>
          <div>
            <strong>29 WITH</strong>
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
            {mode === "admin" ? <button className="ghost-button danger-button" onClick={handleReset} type="button"><RotateCcw size={16} /> 초기화</button> : null}
          </div>
        </header>

        {message ? <div className="toast-inline">{message}</div> : null}
        {isLoading ? <section className="panel">불러오는 중입니다.</section> : null}

        {!isLoading && mode === "teacher" ? <TeacherPortal page={teacherPage} data={data} setPage={setTeacherPage} onApply={handleApply} currentUser={currentUser} /> : null}
        {!isLoading && mode === "admin" && adminPage === "dashboard" ? <AdminDashboard data={data} selectedEvent={selectedEvent} setPage={setAdminPage} /> : null}
        {!isLoading && mode === "admin" && adminPage === "events" ? <EventsPage data={data} selectedEvent={selectedEvent} onCreateEvent={handleCreateEvent} /> : null}
        {!isLoading && mode === "admin" && adminPage === "applications" ? <ApplicationsPage data={data} selectedEvent={selectedEvent} onApplicationStatus={handleApplicationStatus} /> : null}
        {!isLoading && mode === "admin" && adminPage === "submissions" ? <SubmissionsPage data={data} selectedEvent={selectedEvent} onUpload={handleSubmissionUpload} /> : null}
        {!isLoading && mode === "admin" && adminPage === "benefits" ? <BenefitsPage data={data} onCouponUpload={handleCouponUpload} /> : null}
        {!isLoading && mode === "admin" && adminPage === "documents" ? <DocumentsPage data={data} onTemplateUpload={handleTemplateUpload} /> : null}
        {!isLoading && mode === "admin" && adminPage === "mails" ? <MailsPage data={data} onSubmit={handleMailSubmit} /> : null}
        {!isLoading && mode === "admin" && adminPage === "history" ? <HistoryPage data={data} /> : null}
      </section>
    </main>
  );
}

function TeacherPortal({ page, data, setPage, onApply, currentUser }: { page: TeacherPage; data: DashboardResponse; setPage: (page: TeacherPage) => void; onApply: (eventItem: DreamEvent, formData: FormData) => void; currentUser: SessionUser | null }) {
  const teacherApplications = data.applications.filter((application) => {
    if (!teacherSnapshot.school && !teacherSnapshot.affiliation) return true;
    return normalize(application.schoolName) === normalize(teacherSnapshot.school) || normalize(application.affiliationName) === normalize(teacherSnapshot.affiliation);
  });
  const availableEvents = data.events.filter((event) => event.status === "RECRUITING");
  const teacherWorks = data.submissions.filter((work) => !teacherSnapshot.affiliation || normalize(work.affiliationName) === normalize(teacherSnapshot.affiliation));

  if (page === "available") return <TeacherAvailableEvents events={availableEvents} onApply={onApply} currentUser={currentUser} />;
  if (page === "works") return <TeacherWorks works={teacherWorks} events={data.events} />;
  if (page === "benefits") return <TeacherBenefits data={data} applications={teacherApplications} />;
  if (page === "docs") return <TeacherDocuments works={teacherWorks} events={data.events} />;
  if (page === "profile") return <TeacherProfilePanel />;

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
        <TeacherStatusCard icon={<Gift size={19} />} label="참여 상태" value={teacherSnapshot.trust} text="패널티와 베네핏 이력 기준" />
        <TeacherStatusCard icon={<Bell size={19} />} label="알림" value={`${data.notices.length}건`} text="발급, 요청 답변, 공지" />
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
  return (
    <section className="panel auth-panel">
      <SectionHead title={mode === "login" ? "이메일 로그인" : "회원가입"} text={mode === "login" ? "가입한 이메일과 비밀번호로 로그인합니다." : "선생님 전용 가입입니다. 업무용 이메일로 가입하고 인증 메일을 확인하세요."} />
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

function TeacherAvailableEvents({ events, onApply, currentUser }: { events: DreamEvent[]; onApply: (eventItem: DreamEvent, formData: FormData) => void; currentUser: SessionUser | null }) {
  const [openEventId, setOpenEventId] = useState("");

  function submitApplication(eventItem: DreamEvent, submitEvent: FormEvent<HTMLFormElement>) {
    submitEvent.preventDefault();
    onApply(eventItem, new FormData(submitEvent.currentTarget));
    submitEvent.currentTarget.reset();
    setOpenEventId("");
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
                  {event.homepageUrl ? <a className="ghost-button" href={event.homepageUrl} rel="noreferrer" target="_blank">홈페이지</a> : null}
                  <button className="primary-button" onClick={() => setOpenEventId(openEventId === event.id ? "" : event.id)} type="button">신청하기</button>
                </div>
                {openEventId === event.id ? (
                  currentUser?.emailVerified ? (
                    <form className="form-grid sub-panel" onSubmit={(submitEvent) => submitApplication(event, submitEvent)}>
                      <label>학교명<input name="schoolName" required placeholder="예: 미림마이스터고" /></label>
                      <label>담당 선생님<input name="teacherName" required defaultValue={currentUser.name} /></label>
                      <label>업무용 이메일<input name="email" required type="email" defaultValue={currentUser.email} /></label>
                      <label>연락처<input name="phone" placeholder="010-0000-0000" /></label>
                      <label>출품 소속명/팀명<input name="affiliationName" required placeholder="출품 엑셀의 소속/팀명과 정확히 동일하게 입력" /></label>
                      <label>예상 작품 수<input name="expectedSubmissionCount" required min="1" type="number" defaultValue={1} /></label>
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
  return (
    <section className="panel teacher-panel">
      <SectionHead title="혜택/지원" text="선정 후 지급되는 쿠폰, 간식비 안내, 운영 알림을 확인합니다." />
      <div className="metric-grid compact">
        <MetricCard label="내 선정 신청" value={`${applications.filter((item) => item.status === "SELECTED").length}건`} />
        <MetricCard label="미사용 쿠폰 재고" value={`${data.stats.unusedCouponCount}개`} />
        <MetricCard label="간식비 지급 예정" value="관리자 입력 대기" />
      </div>
      <EmptyState title="지급 이력은 선정 후 표시됩니다." text="쿠폰 번호와 간식비 지급 예정일은 관리자 안내 메일과 이 화면에서 확인할 수 있습니다." />
    </section>
  );
}

function TeacherDocuments({ works, events }: { works: SubmissionWork[]; events: DreamEvent[] }) {
  return <section className="panel teacher-panel"><SectionHead title="활동확인서/심사표" text="관리자 승인 후 다운로드 가능한 문서와 심사 결과를 확인합니다." /><WorksTable works={works} events={events} emptyText="발급 가능한 문서가 아직 없습니다." /></section>;
}

function TeacherProfilePanel() {
  return (
    <section className="panel teacher-panel">
      <SectionHead title="내 프로필" text="학교명과 출품 소속명은 매칭 기준이므로 변경 요청으로 관리합니다." />
      <div className="profile-grid">
        <TeacherInfoCard label="학교명" value="미등록" text="첫 신청 시 입력" />
        <TeacherInfoCard label="출품 소속명/팀명" value="미등록" text="출품 엑셀의 소속/팀명과 완전 일치 필요" />
        <TeacherInfoCard label="연락처" value="미등록" text="업무용 이메일과 연락처 권장" />
        <TeacherInfoCard label="교사 증빙" value="미등록" text="선생님 확인증 또는 재직 확인 자료" />
      </div>
      <div className="panel-action"><button className="ghost-button" type="button">프로필 수정</button><button className="ghost-button" type="button">학교명 변경 요청</button></div>
    </section>
  );
}

function AdminDashboard({ data, selectedEvent, setPage }: { data: DashboardResponse; selectedEvent?: DreamEvent; setPage: (page: AdminPage) => void }) {
  const selectedApplications = selectedEvent ? data.applications.filter((item) => item.eventId === selectedEvent.id) : [];
  const selectedWorks = selectedEvent ? data.submissions.filter((item) => item.eventId === selectedEvent.id) : [];
  const selectedReview = selectedWorks.filter((item) => item.matchStatus !== "MATCHED").length;
  return (
    <>
      <section className="admin-command">
        <div>
          <p className="eyebrow">오늘 처리할 일</p>
          <h2>{selectedEvent ? selectedEvent.title : "진행 중인 꿈프를 선택하세요"}</h2>
          <p>{selectedEvent ? `${eventTypeLabels[selectedEvent.eventType]} · ${statusLabels[selectedEvent.status]} · 목표 ${selectedEvent.targetSubmissionCount || 0}편` : "행사를 등록하면 신청, 출품, 쿠폰, 확인서 업무가 행사 기준으로 정리됩니다."}</p>
        </div>
        <div className="top-actions">
          <button className="ghost-button" onClick={() => setPage("events")} type="button"><Plus size={16} /> 새 행사</button>
          <button className="primary-button" onClick={() => setPage(selectedReview ? "submissions" : "applications")} type="button">{selectedReview ? "매칭 검토" : "신청 검토"}</button>
        </div>
      </section>

      <section className="metric-grid">
        <MetricCard label="진행 꿈프" value={`${data.stats.activeEventCount}개`} />
        <MetricCard label="선정 학교" value={`${data.stats.selectedSchoolCount}교`} />
        <MetricCard label="출품 확인" value={`${data.stats.confirmedSubmissionCount}/${data.stats.expectedSubmissionCount}편`} />
        <MetricCard label="확인 필요" value={`${data.stats.reviewRequiredCount}건`} danger />
      </section>

      <section className="panel">
        <SectionHead title="행사별 현황" text="ATS 파이프라인처럼 행사마다 접수, 선정, 출품 확인 상태를 한눈에 봅니다." />
        {data.events.length ? (
          <div className="event-list">{data.events.map((event) => <EventSummaryCard key={event.id} event={event} applications={data.applications} works={data.submissions} selected={event.id === selectedEvent?.id} />)}</div>
        ) : (
          <EmptyState title="등록된 꿈프 행사가 없습니다." text="새 행사를 등록하면 대시보드와 선생님 신청 화면이 채워집니다." />
        )}
      </section>

      <section className="action-grid">
        <ActionCard icon={<FileCheck2 size={18} />} title="신청/선정 검토" text={`${selectedApplications.length}건의 신청을 선착순, 패널티, 성실 참여 기준으로 확인`} onClick={() => setPage("applications")} />
        <ActionCard icon={<Upload size={18} />} title="출품 엑셀 분석" text={`${selectedWorks.length}편 분석됨. 확인 필요 ${selectedReview}건`} onClick={() => setPage("submissions")} />
        <ActionCard icon={<Mail size={18} />} title="메일/공지 관리" text="예약 메일, 리마인드, 확인서 발급 안내를 작성" onClick={() => setPage("mails")} />
      </section>
    </>
  );
}

function EventsPage({ data, selectedEvent, onCreateEvent }: { data: DashboardResponse; selectedEvent?: DreamEvent; onCreateEvent: (event: FormEvent<HTMLFormElement>) => void }) {
  return (
    <section className="panel">
      <SectionHead title="행사 운영" text="선생님 화면에 노출될 모집중 행사 정보를 등록합니다." />
      <form className="form-grid" onSubmit={onCreateEvent}>
        <label>행사명<input name="title" required placeholder="예: 제13회 박카스 29초영화제" /></label>
        <label>행사 유형<select name="eventType" defaultValue={"TWENTY_NINE_SECONDS" satisfies EventType}><option value="TWENTY_NINE_SECONDS">29초영화제</option><option value="SHORTFORM_KING">29역숏폼왕</option></select></label>
        <label>공모기간<input name="contestPeriod" placeholder="2026.04.08 - 2026.05.21" /></label>
        <label>총상금/혜택<input name="prize" placeholder="총상금 또는 혜택" /></label>
        <label>목표 작품 수<input name="targetSubmissionCount" min="0" type="number" /></label>
        <label>포스터 URL<input name="posterUrl" placeholder="https://..." /></label>
        <label className="wide">주제<input name="topic" placeholder="행사 주제" /></label>
        <label>홈페이지 URL<input name="homepageUrl" placeholder="https://..." /></label>
        <label>출품 URL<input name="submissionUrl" placeholder="https://..." /></label>
        <label className="wide">안내사항<textarea name="notice" rows={4} placeholder="선생님에게 보여줄 주요 안내" /></label>
        <div className="form-actions"><button className="primary-button" type="submit">행사 등록</button></div>
      </form>
      <div className="sub-panel">
        <h3>등록된 행사</h3>
        {data.events.length ? <div className="event-list">{data.events.map((event) => <div className={`event-row ${selectedEvent?.id === event.id ? "active" : ""}`} key={event.id}><div><strong>{event.title}</strong><small>{eventTypeLabels[event.eventType]} · {event.contestPeriod || "기간 미입력"}</small></div><span className="status-pill success">{statusLabels[event.status]}</span></div>)}</div> : <EmptyState title="아직 등록된 행사가 없습니다." text="첫 꿈프 행사를 등록해 주세요." />}
      </div>
    </section>
  );
}

function ApplicationsPage({ data, selectedEvent, onApplicationStatus }: { data: DashboardResponse; selectedEvent?: DreamEvent; onApplicationStatus: (applicationId: string, status: DreamApplication["status"]) => void }) {
  const rows = selectedEvent ? data.applications.filter((application) => application.eventId === selectedEvent.id) : data.applications;
  return (
    <section className="panel">
      <SectionHead title="신청/선정" text={selectedEvent ? `${selectedEvent.title} 신청 학교를 검토하고 선정 상태를 처리합니다.` : "행사를 선택하면 신청/선정 목록을 확인할 수 있습니다."} />
      {rows.length ? (
        <div className="table-wrap"><table><thead><tr><th>학교</th><th>소속/팀명</th><th>예상 작품</th><th>상태</th><th>처리</th></tr></thead><tbody>{rows.map((application) => <tr key={application.id}><td>{application.schoolName}</td><td>{application.affiliationName}</td><td>{application.expectedSubmissionCount}편</td><td>{applicationStatusLabels[application.status]}</td><td><div className="button-row"><button className="ghost-button" onClick={() => onApplicationStatus(application.id, "SELECTED")} type="button">선정</button><button className="ghost-button" onClick={() => onApplicationStatus(application.id, "WAITLISTED")} type="button">예비</button><button className="ghost-button" onClick={() => onApplicationStatus(application.id, "NOT_SELECTED")} type="button">미선정</button></div></td></tr>)}</tbody></table></div>
      ) : (
        <EmptyState title="접수된 신청이 없습니다." text="선생님 신청이 들어오면 선착순, 패널티, 성실 참여 이력을 기준으로 검토합니다." />
      )}
    </section>
  );
}

function SubmissionsPage({ data, selectedEvent, onUpload }: { data: DashboardResponse; selectedEvent?: DreamEvent; onUpload: (file?: File) => void }) {
  const works = selectedEvent ? data.submissions.filter((work) => work.eventId === selectedEvent.id) : [];
  return (
    <section className="panel">
      <SectionHead title="출품 확인" text="관리자가 업로드한 출품 엑셀만 분석합니다. 학교명/소속명 기준으로 자동 매칭하고 유사 항목은 확인 필요로 분류합니다." />
      {selectedEvent ? (
        <>
          <div className="event-row active"><div><strong>{selectedEvent.title}</strong><small>{eventTypeLabels[selectedEvent.eventType]} · 출품 소속명/팀명 기준 매칭</small></div><UploadButton label="출품 엑셀 업로드" accept=".xlsx,.xls,.csv" onFile={onUpload} /></div>
          <WorksTable works={works} events={data.events} emptyText="아직 업로드된 출품 엑셀이 없습니다." />
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
      {data.coupons.length ? <div className="table-wrap"><table><thead><tr><th>쿠폰번호</th><th>상태</th><th>업로드일</th></tr></thead><tbody>{data.coupons.map((coupon) => <tr key={coupon.id}><td>{coupon.couponNumber}</td><td>{coupon.status === "UNUSED" ? "미사용" : "지급완료"}</td><td>{new Date(coupon.uploadedAt).toLocaleString("ko-KR")}</td></tr>)}</tbody></table></div> : <EmptyState title="업로드된 쿠폰이 없습니다." text="쿠폰 번호가 들어 있는 엑셀을 업로드하면 자동으로 번호를 인식합니다." />}
    </section>
  );
}

function DocumentsPage({ data, onTemplateUpload }: { data: DashboardResponse; onTemplateUpload: (file?: File) => void }) {
  const firstSelectedApplication = data.applications.find((application) => application.status === "SELECTED");
  const works = firstSelectedApplication ? data.submissions.filter((work) => work.applicationId === firstSelectedApplication.id).map((work) => work.title).filter(Boolean) : [];
  async function downloadCertificate() {
    if (!firstSelectedApplication) return;
    const response = await fetch("/api/certificates/generate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ schoolName: firstSelectedApplication.schoolName, teacherName: data.teachers.find((teacher) => teacher.id === firstSelectedApplication.teacherProfileId)?.teacherName || "", works }) });
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "activity-certificate.pdf";
    anchor.click();
    URL.revokeObjectURL(url);
  }
  return (
    <section className="panel">
      <SectionHead title="활동확인서" text="관리자가 업로드한 템플릿을 저장하고 발급 준비 상태를 확인합니다." />
      <div className="button-row"><UploadButton label="확인서 템플릿 업로드" accept=".png,.jpg,.jpeg,.pdf" onFile={onTemplateUpload} /><button className="primary-button" disabled={!firstSelectedApplication} onClick={downloadCertificate} type="button">샘플 확인서 PDF 생성</button></div>
      {data.certificateTemplates.length ? <div className="compact-list">{data.certificateTemplates.map((template) => <div className="compact-row" key={template.id}><strong>{template.fileName}</strong><span>{new Date(template.uploadedAt).toLocaleString("ko-KR")}</span></div>)}</div> : <EmptyState title="등록된 활동확인서 템플릿이 없습니다." text="최종 디자인 파일을 업로드하면 발급 기준 템플릿으로 저장됩니다." />}
    </section>
  );
}

function MailsPage({ data, onSubmit }: { data: DashboardResponse; onSubmit: (event: FormEvent<HTMLFormElement>) => void }) {
  const selectedEmails = data.applications.filter((application) => application.status === "SELECTED").map((application) => data.teachers.find((teacher) => teacher.id === application.teacherProfileId)?.email).filter(Boolean).join("\n");
  return (
    <section className="panel">
      <SectionHead title="메일/공지" text="선정 안내, 출품 리마인드, 확인서 발급 공지를 저장하거나 Gmail SMTP로 즉시 발송합니다." />
      <form className="form-grid" onSubmit={onSubmit}>
        <label className="wide">수신자 이메일<textarea name="recipientEmails" rows={4} defaultValue={selectedEmails} placeholder="teacher@example.com&#10;teacher2@example.com" required /></label>
        <label className="wide">제목<input name="subject" required placeholder="꿈프 선정 및 출품 안내" /></label>
        <label className="wide">본문<textarea name="body" rows={8} required placeholder="발송 전 관리자가 검토할 메일 본문" /></label>
        <label>예약 시각<input name="scheduledAt" type="datetime-local" /></label>
        <label className="checkbox-line"><input name="sendNow" type="checkbox" /> 즉시 발송</label>
        <div className="form-actions"><button className="primary-button" type="submit">메일 저장/발송</button>{selectedEmails ? <a className="ghost-button" href={`mailto:?bcc=${encodeURIComponent(selectedEmails.replace(/\n/g, ","))}`}>메일앱 열기</a> : null}</div>
      </form>
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

function EventSummaryCard({ event, applications, works, selected }: { event: DreamEvent; applications: DreamApplication[]; works: SubmissionWork[]; selected: boolean }) {
  const eventApplications = applications.filter((item) => item.eventId === event.id);
  const selectedCount = eventApplications.filter((item) => item.status === "SELECTED").length;
  const eventWorks = works.filter((item) => item.eventId === event.id);
  const reviewCount = eventWorks.filter((item) => item.matchStatus !== "MATCHED").length;
  return (
    <article className={`event-summary-card ${selected ? "active" : ""}`}>
      <div><span className="status-pill success">{statusLabels[event.status]}</span><h3>{event.title}</h3><p>{eventTypeLabels[event.eventType]} · {event.contestPeriod || "기간 미입력"}</p></div>
      <div className="mini-stats"><span>신청 {eventApplications.length}건</span><span>선정 {selectedCount}교</span><span>출품 {eventWorks.length}편</span><span className={reviewCount ? "danger-text" : ""}>확인 {reviewCount}건</span></div>
    </article>
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

function SectionHead({ title, text }: { title: string; text: string }) {
  return <div className="section-head"><div><h2>{title}</h2><p className="muted">{text}</p></div></div>;
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
