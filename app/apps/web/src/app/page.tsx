"use client";

import { useEffect, useMemo, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import { Bell, CheckCircle2, FileCheck2, Gift, Home, Plus, RefreshCw, RotateCcw, Upload } from "lucide-react";
import type { DashboardResponse, DreamApplication, DreamEvent, EventType, SubmissionWork } from "@/lib/with-types";
import { applicationStatusLabels, eventTypeLabels, matchStatusLabels, statusLabels } from "@/lib/with-types";

type ViewMode = "teacher" | "admin";
type TeacherPage = "home" | "available" | "works" | "benefits" | "docs" | "profile";
type AdminPage = "dashboard" | "events" | "submissions" | "benefits" | "documents" | "mails" | "history";

const teacherPages: Array<{ key: TeacherPage; label: string }> = [
  { key: "home", label: "내 대시보드" },
  { key: "available", label: "신청 가능한 행사" },
  { key: "works", label: "학생/작품 관리" },
  { key: "benefits", label: "혜택/지원" },
  { key: "docs", label: "활동확인서/심사표" },
  { key: "profile", label: "내 프로필" }
];

const adminPages: Array<{ key: AdminPage; label: string }> = [
  { key: "dashboard", label: "관리자 대시보드" },
  { key: "events", label: "행사 운영" },
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

  useEffect(() => {
    void loadDashboard();
  }, []);

  useEffect(() => {
    if (!selectedEventId && data.events[0]) setSelectedEventId(data.events[0].id);
  }, [data.events, selectedEventId]);

  const selectedEvent = useMemo(
    () => data.events.find((event) => event.id === selectedEventId),
    [data.events, selectedEventId]
  );

  async function loadDashboard() {
    setIsLoading(true);
    const response = await fetch("/api/dashboard", { cache: "no-store" });
    setData(await response.json());
    setIsLoading(false);
  }

  async function postJson(url: string, body?: unknown, doneMessage = "저장되었습니다.") {
    const response = await fetch(url, {
      method: "POST",
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
        .filter((value) => value && !/쿠폰|coupon/i.test(value));
      await postJson("/api/coupons", { couponNumbers }, `쿠폰 ${couponNumbers.length}개를 인식했습니다.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "쿠폰 파일을 읽지 못했습니다.");
    }
  }

  async function handleSubmissionUpload(file?: File) {
    if (!file || !selectedEvent) return;
    try {
      await postJson(
        "/api/submissions/analyze",
        { eventId: selectedEvent.id, rows: await readSheetRows(file) },
        "출품 엑셀 분석을 완료했습니다."
      );
      setAdminPage("submissions");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "출품 파일을 읽지 못했습니다.");
    }
  }

  async function handleTemplateUpload(file?: File) {
    if (!file) return;
    await postJson(
      "/api/certificate-templates",
      { fileName: file.name, dataUrl: await fileToDataUrl(file) },
      "활동확인서 템플릿을 저장했습니다."
    );
  }

  async function handleReset() {
    if (!confirm("등록된 행사, 쿠폰, 출품 분석 데이터를 모두 초기화할까요?")) return;
    await postJson("/api/reset", undefined, "운영 데이터를 초기화했습니다.");
    setSelectedEventId("");
  }

  const navItems = mode === "teacher" ? teacherPages : adminPages;
  const activeKey = mode === "teacher" ? teacherPage : adminPage;

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
        <div className="mode-switch" aria-label="화면 전환">
          <button className={mode === "teacher" ? "active" : ""} onClick={() => setMode("teacher")} type="button">
            선생님
          </button>
          <button className={mode === "admin" ? "active" : ""} onClick={() => setMode("admin")} type="button">
            관리자
          </button>
        </div>
        <nav>
          {navItems.map((item) => (
            <button
              className={activeKey === item.key ? "active" : ""}
              key={item.key}
              onClick={() => (mode === "teacher" ? setTeacherPage(item.key as TeacherPage) : setAdminPage(item.key as AdminPage))}
              type="button"
            >
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      <section className="content-area">
        <header className="top-bar">
          <div>
            <p>{mode === "teacher" ? "영상 꿈나무 양성 프로젝트" : "29 Platform 대외협력 관리 시스템"}</p>
            <h1>{mode === "teacher" ? "선생님 포털" : "29 WITH 관리자"}</h1>
          </div>
          <div className="top-actions">
            {mode === "admin" ? (
              <select value={selectedEventId} onChange={(event) => setSelectedEventId(event.target.value)}>
                {data.events.length === 0 ? <option>등록된 꿈프 없음</option> : null}
                {data.events.map((event) => (
                  <option key={event.id} value={event.id}>
                    {event.title}
                  </option>
                ))}
              </select>
            ) : null}
            <button className="ghost-button" onClick={loadDashboard} type="button">
              <RefreshCw size={16} /> 새로고침
            </button>
            {mode === "admin" ? (
              <button className="ghost-button" onClick={handleReset} type="button">
                <RotateCcw size={16} /> 초기화
              </button>
            ) : null}
          </div>
        </header>

        {message ? <div className="toast-inline">{message}</div> : null}
        {isLoading ? <section className="panel">불러오는 중입니다.</section> : null}

        {!isLoading && mode === "teacher" ? (
          <TeacherPortal page={teacherPage} data={data} setPage={setTeacherPage} />
        ) : null}
        {!isLoading && mode === "admin" && adminPage === "dashboard" ? (
          <AdminDashboard data={data} selectedEvent={selectedEvent} setPage={setAdminPage} />
        ) : null}
        {!isLoading && mode === "admin" && adminPage === "events" ? (
          <EventsPage data={data} selectedEvent={selectedEvent} onCreateEvent={handleCreateEvent} />
        ) : null}
        {!isLoading && mode === "admin" && adminPage === "submissions" ? (
          <SubmissionsPage data={data} selectedEvent={selectedEvent} onUpload={handleSubmissionUpload} />
        ) : null}
        {!isLoading && mode === "admin" && adminPage === "benefits" ? (
          <BenefitsPage data={data} onCouponUpload={handleCouponUpload} />
        ) : null}
        {!isLoading && mode === "admin" && adminPage === "documents" ? (
          <DocumentsPage data={data} onTemplateUpload={handleTemplateUpload} />
        ) : null}
        {!isLoading && mode === "admin" && adminPage === "mails" ? <MailsPage /> : null}
        {!isLoading && mode === "admin" && adminPage === "history" ? <HistoryPage data={data} /> : null}
      </section>
    </main>
  );
}

function TeacherPortal({
  page,
  data,
  setPage
}: {
  page: TeacherPage;
  data: DashboardResponse;
  setPage: (page: TeacherPage) => void;
}) {
  const teacherApplications = data.applications.filter((application) => {
    if (!teacherSnapshot.school && !teacherSnapshot.affiliation) return false;
    return (
      normalize(application.schoolName) === normalize(teacherSnapshot.school) ||
      normalize(application.affiliationName) === normalize(teacherSnapshot.affiliation)
    );
  });
  const availableEvents = data.events.filter((event) => event.status === "RECRUITING");
  const teacherWorks = data.submissions.filter((work) => {
    if (!teacherSnapshot.affiliation) return false;
    return normalize(work.affiliationName) === normalize(teacherSnapshot.affiliation);
  });

  if (page === "available") return <TeacherAvailableEvents events={availableEvents} />;
  if (page === "works") return <TeacherWorks works={teacherWorks} events={data.events} />;
  if (page === "benefits") return <TeacherBenefits data={data} applications={teacherApplications} />;
  if (page === "docs") return <TeacherDocuments works={teacherWorks} events={data.events} />;
  if (page === "profile") return <TeacherProfilePanel />;

  return (
    <>
      <section className="teacher-hero">
        <div>
          <p className="eyebrow">선생님용 화면</p>
          <h2>내 신청, 출품 확인, 혜택, 확인서를 한 곳에서 확인합니다.</h2>
          <p>
            실제 운영 데이터만 표시합니다. 신청 내역이 없으면 관리자 승인 또는 행사 신청 후 이곳에 표시됩니다.
          </p>
        </div>
        <button className="primary-button" onClick={() => setPage("available")} type="button">
          신청 가능한 행사 보기
        </button>
      </section>

      <section className="teacher-status-grid">
        <TeacherStatusCard icon={<Home size={19} />} label="내 신청" value={`${teacherApplications.length}건`} text="접수 또는 선정된 꿈프 신청" />
        <TeacherStatusCard icon={<CheckCircle2 size={19} />} label="출품 확인" value={`${teacherWorks.length}편`} text="관리자 엑셀 분석 후 표시" />
        <TeacherStatusCard icon={<Gift size={19} />} label="혜택 상태" value={teacherSnapshot.trust} text="패널티/베네핏은 참여 이력 기준" />
        <TeacherStatusCard icon={<Bell size={19} />} label="알림" value={`${data.notices.length}건`} text="발급, 요청 답변, 공지" />
      </section>

      <section className="panel teacher-panel">
        <SectionHead title="내 꿈프 신청 현황" text="현재 로그인한 선생님의 실제 신청 내역만 표시됩니다." />
        {teacherApplications.length ? (
          <div className="teacher-application-list">
            {teacherApplications.map((application) => (
              <TeacherApplicationCard key={application.id} application={application} events={data.events} />
            ))}
          </div>
        ) : (
          <EmptyState title="아직 신청 내역이 없습니다." text="모집중인 행사를 선택해 신청하면 이곳에 진행 상태가 표시됩니다." />
        )}
      </section>
    </>
  );
}

function TeacherAvailableEvents({ events }: { events: DreamEvent[] }) {
  return (
    <section className="panel teacher-panel">
      <SectionHead title="신청 가능한 행사" text="관리자가 등록하고 모집중으로 둔 꿈프 행사만 표시됩니다." />
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
                  <div><dt>상금</dt><dd>{event.prize || "미입력"}</dd></div>
                  <div><dt>주제</dt><dd>{event.topic || "미입력"}</dd></div>
                </dl>
                <p className="event-notice">{event.notice || "관리자가 등록한 안내사항이 없습니다."}</p>
                <div className="button-row">
                  {event.homepageUrl ? <a className="ghost-button" href={event.homepageUrl} rel="noreferrer" target="_blank">홈페이지</a> : null}
                  <button className="primary-button" type="button">신청하기</button>
                </div>
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
  return (
    <section className="panel teacher-panel">
      <SectionHead title="학생/작품 관리" text="출품 엑셀 분석 후 내 학교와 매칭된 작품이 표시됩니다." />
      <WorksTable works={works} events={events} emptyText="아직 확인된 출품작이 없습니다." />
    </section>
  );
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
      <EmptyState title="지급 내역은 선정 후 표시됩니다." text="쿠폰 번호, 간식비 지급 예정일, 관리자 안내 메일을 이곳에서 확인할 수 있습니다." />
    </section>
  );
}

function TeacherDocuments({ works, events }: { works: SubmissionWork[]; events: DreamEvent[] }) {
  return (
    <section className="panel teacher-panel">
      <SectionHead title="활동확인서/심사표" text="관리자 승인 후 다운로드 가능한 문서가 표시됩니다." />
      <WorksTable works={works} events={events} emptyText="발급 가능한 문서가 아직 없습니다." />
    </section>
  );
}

function TeacherProfilePanel() {
  return (
    <section className="panel teacher-panel">
      <SectionHead title="내 프로필" text="학교명과 출품 소속명은 출품 매칭 기준이므로 변경 요청으로 관리합니다." />
      <div className="profile-grid">
        <TeacherInfoCard label="학교명" value="미등록" text="회원가입 후 최초 신청 시 입력" />
        <TeacherInfoCard label="출품 소속명/팀명" value="미등록" text="엑셀 소속/팀명과 완전 일치 필요" />
        <TeacherInfoCard label="연락처" value="미등록" text="업무용 이메일과 연락처를 권장" />
        <TeacherInfoCard label="교사 증빙" value="미등록" text="선생님 확인증 또는 재직 확인 자료" />
      </div>
      <div className="panel-action">
        <button className="ghost-button" type="button">프로필 수정</button>
        <button className="ghost-button" type="button">학교명 변경 요청</button>
      </div>
    </section>
  );
}

function AdminDashboard({
  data,
  selectedEvent,
  setPage
}: {
  data: DashboardResponse;
  selectedEvent?: DreamEvent;
  setPage: (page: AdminPage) => void;
}) {
  return (
    <>
      <section className="metric-grid">
        <MetricCard label="운영 프로젝트" value={`${data.stats.activeEventCount}개`} />
        <MetricCard label="선정 학교" value={`${data.stats.selectedSchoolCount}개`} />
        <MetricCard label="출품 확인" value={`${data.stats.confirmedSubmissionCount}편`} />
        <MetricCard label="확인 필요" value={`${data.stats.reviewRequiredCount}건`} danger />
      </section>

      <section className="panel">
        <SectionHead title="행사별 현황" text="실제 등록된 꿈프 행사만 표시됩니다." />
        {data.events.length ? (
          <div className="event-list">
            {data.events.map((event) => (
              <article className={`event-row ${event.id === selectedEvent?.id ? "active" : ""}`} key={event.id}>
                <div>
                  <strong>{event.title}</strong>
                  <small>{eventTypeLabels[event.eventType]} · {statusLabels[event.status]} · 목표 {event.targetSubmissionCount || 0}편</small>
                </div>
                <span className="status-pill success">{statusLabels[event.status]}</span>
              </article>
            ))}
          </div>
        ) : (
          <EmptyState title="등록된 꿈프 행사가 없습니다." text="행사 운영에서 새 행사를 등록하면 대시보드가 채워집니다." />
        )}
        <div className="panel-action">
          <button className="primary-button" onClick={() => setPage("events")} type="button">
            <Plus size={16} /> 새 행사 등록
          </button>
          <button className="ghost-button" onClick={() => setPage("submissions")} type="button">출품 엑셀 분석</button>
        </div>
      </section>

      <section className="panel">
        <SectionHead title="관리자 작업함" text="최근 처리해야 할 운영 알림입니다." />
        {data.notices.length ? (
          <div className="compact-list">
            {data.notices.slice(0, 8).map((notice) => (
              <div className="compact-row" key={notice.id}>
                <div>
                  <strong>{notice.type}</strong>
                  <small>{notice.message}</small>
                </div>
                <span>{new Date(notice.createdAt).toLocaleString("ko-KR")}</span>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState title="처리할 알림이 없습니다." text="행사 등록, 엑셀 업로드, 확인서 템플릿 저장 이력이 생기면 표시됩니다." />
        )}
      </section>
    </>
  );
}

function EventsPage({
  data,
  selectedEvent,
  onCreateEvent
}: {
  data: DashboardResponse;
  selectedEvent?: DreamEvent;
  onCreateEvent: (event: FormEvent<HTMLFormElement>) => void;
}) {
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
        {data.events.length ? (
          <div className="event-list">
            {data.events.map((event) => (
              <div className={`event-row ${selectedEvent?.id === event.id ? "active" : ""}`} key={event.id}>
                <div><strong>{event.title}</strong><small>{eventTypeLabels[event.eventType]} · {event.contestPeriod || "기간 미입력"}</small></div>
                <span className="status-pill success">{statusLabels[event.status]}</span>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState title="아직 등록된 행사가 없습니다." text="첫 실제 꿈프 행사를 등록해 주세요." />
        )}
      </div>
    </section>
  );
}

function SubmissionsPage({
  data,
  selectedEvent,
  onUpload
}: {
  data: DashboardResponse;
  selectedEvent?: DreamEvent;
  onUpload: (file?: File) => void;
}) {
  const works = selectedEvent ? data.submissions.filter((work) => work.eventId === selectedEvent.id) : [];
  return (
    <section className="panel">
      <SectionHead title="출품 확인" text="관리자가 업로드한 출품 엑셀만 분석합니다. 샘플 데이터는 사용하지 않습니다." />
      {selectedEvent ? (
        <>
          <div className="event-row active">
            <div><strong>{selectedEvent.title}</strong><small>{eventTypeLabels[selectedEvent.eventType]} · 출품 소속명/팀명 기준 매칭</small></div>
            <UploadButton label="출품 엑셀 업로드" accept=".xlsx,.xls,.csv" onFile={onUpload} />
          </div>
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
      <div className="metric-grid compact">
        <MetricCard label="총 쿠폰" value={`${data.coupons.length}개`} />
        <MetricCard label="미사용" value={`${data.stats.unusedCouponCount}개`} />
        <MetricCard label="지급완료" value={`${data.coupons.filter((coupon) => coupon.status === "ASSIGNED").length}개`} />
      </div>
      {data.coupons.length ? (
        <div className="table-wrap"><table><thead><tr><th>쿠폰번호</th><th>상태</th><th>업로드일</th></tr></thead><tbody>{data.coupons.map((coupon) => <tr key={coupon.id}><td>{coupon.couponNumber}</td><td>{coupon.status === "UNUSED" ? "미사용" : "지급완료"}</td><td>{new Date(coupon.uploadedAt).toLocaleString("ko-KR")}</td></tr>)}</tbody></table></div>
      ) : (
        <EmptyState title="업로드된 쿠폰이 없습니다." text="쿠폰 번호가 들어 있는 엑셀을 업로드하면 자동으로 번호를 인식합니다." />
      )}
    </section>
  );
}

function DocumentsPage({ data, onTemplateUpload }: { data: DashboardResponse; onTemplateUpload: (file?: File) => void }) {
  return (
    <section className="panel">
      <SectionHead title="활동확인서" text="관리자가 업로드한 템플릿을 저장하고 발급 준비 상태를 확인합니다." />
      <UploadButton label="확인서 템플릿 업로드" accept=".png,.jpg,.jpeg,.pdf" onFile={onTemplateUpload} />
      {data.certificateTemplates.length ? (
        <div className="compact-list">
          {data.certificateTemplates.map((template) => (
            <div className="compact-row" key={template.id}>
              <strong>{template.fileName}</strong>
              <span>{new Date(template.uploadedAt).toLocaleString("ko-KR")}</span>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState title="등록된 활동확인서 템플릿이 없습니다." text="최종 디자인 파일을 업로드하면 발급 기준 템플릿으로 저장됩니다." />
      )}
    </section>
  );
}

function MailsPage() {
  return (
    <section className="panel">
      <SectionHead title="메일/공지" text="D-14, D-10, D-5, D-1 안내와 발송 전 검수 기능이 들어갈 영역입니다." />
      <EmptyState title="메일 템플릿은 아직 등록되지 않았습니다." text="운영 메일은 발송 전 관리자 확인/수정 후 예약 발송하는 구조로 확장합니다." />
    </section>
  );
}

function HistoryPage({ data }: { data: DashboardResponse }) {
  return (
    <section className="panel">
      <SectionHead title="히스토리" text="모든 운영 변경과 업로드 기록을 보관합니다." />
      {data.notices.length ? (
        <div className="compact-list">
          {data.notices.map((notice) => (
            <div className="compact-row" key={notice.id}>
              <div><strong>{notice.type}</strong><small>{notice.message}</small></div>
              <span>{new Date(notice.createdAt).toLocaleString("ko-KR")}</span>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState title="아직 히스토리가 없습니다." text="운영 작업이 발생하면 자동으로 기록됩니다." />
      )}
    </section>
  );
}

function WorksTable({ works, events, emptyText }: { works: SubmissionWork[]; events: DreamEvent[]; emptyText: string }) {
  if (!works.length) return <EmptyState title={emptyText} text="실제 엑셀 업로드 또는 관리자 승인 후 데이터가 표시됩니다." />;
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>행사</th>
            <th>소속/팀명</th>
            <th>작품명</th>
            <th>감독/출품자</th>
            <th>평점</th>
            <th>순위</th>
            <th>본심</th>
            <th>매칭</th>
          </tr>
        </thead>
        <tbody>
          {works.map((work) => (
            <tr key={work.id}>
              <td>{events.find((event) => event.id === work.eventId)?.title ?? "-"}</td>
              <td>{work.affiliationName || "-"}</td>
              <td>{work.submissionUrl ? <a href={work.submissionUrl} rel="noreferrer" target="_blank">{work.title || "작품 링크"}</a> : work.title || "-"}</td>
              <td>{work.participantName || "-"}</td>
              <td>{work.preliminaryScore ?? "-"}</td>
              <td>{work.rank ?? "-"}</td>
              <td>{work.finalRoundStatus === "ADVANCED" ? "진출" : work.finalRoundStatus === "NOT_ADVANCED" ? "미진출" : "-"}</td>
              <td><span className={work.matchStatus === "NEEDS_REVIEW" ? "danger-text" : ""}>{matchStatusLabels[work.matchStatus]}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TeacherStatusCard({ icon, label, value, text }: { icon: ReactNode; label: string; value: string; text: string }) {
  return <article className="teacher-status-card"><div className="teacher-icon">{icon}</div><span>{label}</span><strong>{value}</strong><p>{text}</p></article>;
}

function TeacherInfoCard({ label, value, text }: { label: string; value: string; text: string }) {
  return <article className="teacher-info-card"><span>{label}</span><strong>{value}</strong><p>{text}</p></article>;
}

function TeacherApplicationCard({ application, events }: { application: DreamApplication; events: DreamEvent[] }) {
  const event = events.find((item) => item.id === application.eventId);
  return (
    <article className="teacher-application-card">
      <div>
        <h3>{event?.title ?? "삭제된 행사"}</h3>
        <p>{application.schoolName} · {application.affiliationName} · 예상 {application.expectedSubmissionCount}편</p>
      </div>
      <span className="status-pill success">{applicationStatusLabels[application.status]}</span>
    </article>
  );
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
  return (
    <label className="upload-button">
      <Upload size={16} /> {label}
      <input accept={accept} hidden type="file" onChange={(event) => onFile(event.target.files?.[0])} />
    </label>
  );
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
