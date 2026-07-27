"use client";

import { useEffect, useMemo, useState } from "react";
import { Bell, CheckCircle2, FileCheck2, Gift, HelpCircle, Home, Plus, RefreshCw, RotateCcw, Upload } from "lucide-react";
import type { DashboardResponse, DreamEvent, EventType, SubmissionWork } from "@/lib/with-types";
import { applicationStatusLabels, eventTypeLabels, matchStatusLabels, statusLabels } from "@/lib/with-types";

type ViewMode = "teacher" | "admin";
type TeacherPage = "home" | "available" | "works" | "benefits" | "docs" | "profile";
type AdminPage = "dashboard" | "events" | "submissions" | "benefits" | "documents" | "mails" | "history";

const teacherPages: Array<{ key: TeacherPage; label: string }> = [
  { key: "home", label: "내 대시보드" },
  { key: "available", label: "신청 가능한 행사" },
  { key: "works", label: "학생/작품 관리" },
  { key: "benefits", label: "혜택/지원" },
  { key: "docs", label: "확인서/심사표" },
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
  name: "김선생",
  school: "서울당현초등학교",
  email: "teacher@school.kr",
  phone: "010-0000-0000",
  trust: "성실 참여",
  affiliation: "서울당현초등학교"
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
      return;
    }
    setData(await response.json());
    setMessage(doneMessage);
  }

  async function handleCreateEvent(formData: FormData) {
    await postJson(
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
      "새 꿈프 행사를 등록했습니다."
    );
    setAdminPage("dashboard");
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
        "출품 엑셀 분석이 완료되었습니다."
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
    if (!confirm("테스트 데이터와 업로드 정보를 초기화할까요?")) return;
    await postJson("/api/reset", undefined, "테스트 데이터를 초기화했습니다.");
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
            <p>{mode === "teacher" ? `${teacherSnapshot.school} 담당자 페이지` : "29 Platform 대외협력 관리 시스템"}</p>
            <h1>{mode === "teacher" ? "영상 꿈나무 양성 프로젝트" : "29 WITH 관리자"}</h1>
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
  const teacherWorks = data.submissions.filter((work) => normalize(work.affiliationName) === normalize(teacherSnapshot.affiliation));
  const activeEvents = data.events.filter((event) => event.status !== "CLOSED");
  const myApplications = buildTeacherApplications(data.events);

  if (page === "available") return <TeacherAvailableEvents events={activeEvents} />;
  if (page === "works") return <TeacherWorks works={teacherWorks} events={data.events} />;
  if (page === "benefits") return <TeacherBenefits />;
  if (page === "docs") return <TeacherDocuments works={teacherWorks} />;
  if (page === "profile") return <TeacherProfile />;

  return (
    <>
      <section className="teacher-hero">
        <div>
          <p className="eyebrow">오늘 확인할 것</p>
          <h2>{teacherSnapshot.name}님, 신청과 출품 상태를 한눈에 확인하세요.</h2>
          <p>선생님에게 필요한 신청 결과, 학생 출품 확인, 혜택 지급, 활동확인서와 심사표만 모아 보여드립니다.</p>
        </div>
        <button className="primary-button" onClick={() => setPage("available")} type="button">
          신청 가능한 행사 보기
        </button>
      </section>

      <section className="teacher-status-grid">
        <TeacherStatusCard icon={<Home size={20} />} label="학교" value={teacherSnapshot.school} note="출품 소속명과 정확히 일치해야 합니다." />
        <TeacherStatusCard icon={<FileCheck2 size={20} />} label="확인된 출품" value={`${teacherWorks.length}편`} note={teacherWorks.length ? "관리자가 올린 출품 엑셀 기준입니다." : "아직 확인된 작품이 없습니다."} />
        <TeacherStatusCard icon={<Gift size={20} />} label="참여 상태" value={teacherSnapshot.trust} note="다음 선정 때 우선 검토 대상입니다." />
        <TeacherStatusCard icon={<Bell size={20} />} label="알림" value="2건" note="확인서와 안내 메일 상태를 알려드립니다." />
      </section>

      <section className="panel teacher-panel">
        <SectionTitle eyebrow="내 신청 현황" title="진행 중인 꿈프" />
        <div className="teacher-application-list">
          {myApplications.length === 0 ? (
            <EmptyState title="현재 신청 내역이 없습니다" description="모집 중인 행사를 확인하고 꿈프 참여를 신청해 주세요." />
          ) : (
            myApplications.map((application) => (
              <article className="teacher-application-card" key={application.event.id}>
                <div>
                  <span className="status-pill success">{application.status}</span>
                  <h3>{application.event.title}</h3>
                  <p>{application.event.contestPeriod || "기간 미입력"} · 예상 출품 {application.expectedCount}편</p>
                </div>
                <button className="ghost-button" onClick={() => setPage("works")} type="button">
                  출품 확인
                </button>
              </article>
            ))
          )}
        </div>
      </section>

      <section className="teacher-card-grid">
        <TeacherActionCard title="신청이 정상 접수됐나요?" text="행사별 신청 상태와 선정 여부를 확인합니다." action="신청 행사 보기" onClick={() => setPage("available")} />
        <TeacherActionCard title="학생 출품이 잘 잡혔나요?" text="엑셀 매칭 결과에서 우리 학교 작품만 정리해 보여드립니다." action="작품 확인" onClick={() => setPage("works")} />
        <TeacherActionCard title="필요한 문서가 준비됐나요?" text="활동확인서와 심사표 발급 상태, 수정 요청을 확인합니다." action="문서 보기" onClick={() => setPage("docs")} />
      </section>
    </>
  );
}

function TeacherAvailableEvents({ events }: { events: DreamEvent[] }) {
  return (
    <section className="panel teacher-panel">
      <SectionTitle eyebrow="신청 가능한 행사" title="참여할 꿈프를 선택하세요" />
      {events.length === 0 ? (
        <EmptyState title="현재 신청 가능한 행사가 없습니다" description="관리자가 모집을 시작하면 이곳에 행사 정보가 표시됩니다." />
      ) : (
        <div className="teacher-event-grid">
          {events.map((event) => (
            <article className="teacher-event-card" key={event.id}>
              {event.posterUrl ? <img alt="" src={event.posterUrl} /> : <div className="poster-placeholder">29</div>}
              <div>
                <span className="status-pill success">{statusLabels[event.status]}</span>
                <h3>{event.title}</h3>
                <dl>
                  <div><dt>유형</dt><dd>{eventTypeLabels[event.eventType]}</dd></div>
                  <div><dt>기간</dt><dd>{event.contestPeriod || "미입력"}</dd></div>
                  <div><dt>주제</dt><dd>{event.topic || "미입력"}</dd></div>
                  <div><dt>총상금</dt><dd>{event.prize || "미입력"}</dd></div>
                </dl>
                <p className="event-notice">{event.notice || "신청 전 학교명과 출품 소속명을 정확히 확인해 주세요."}</p>
                <div className="button-row">
                  <button className="ghost-button" type="button">자세히 보기</button>
                  <button className="primary-button" type="button">신청하기</button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

function TeacherWorks({ works, events }: { works: SubmissionWork[]; events: DreamEvent[] }) {
  return (
    <section className="panel teacher-panel">
      <SectionTitle eyebrow="학생/작품 관리" title="우리 학교 출품 현황" />
      <p className="muted">관리자가 업로드한 출품 엑셀에서 출품 소속명과 학교명이 일치하는 작품만 표시합니다.</p>
      {works.length === 0 ? (
        <EmptyState title="확인된 출품작이 없습니다" description="출품 직후에는 반영까지 시간이 걸릴 수 있습니다. 문제가 있으면 문의하기로 확인 요청을 보내 주세요." />
      ) : (
        <DataTable
          headers={["행사", "순위", "작품명", "감독/출품자", "점수", "본심", "URL"]}
          rows={works.map((work) => [
            events.find((event) => event.id === work.eventId)?.title ?? "-",
            work.rank?.toString() ?? "-",
            work.title || "-",
            work.participantName || "-",
            work.preliminaryScore?.toString() ?? "-",
            work.finalRoundStatus === "ADVANCED" ? "진출" : "-",
            work.submissionUrl ? "있음" : "없음"
          ])}
        />
      )}
      <button className="ghost-button panel-action" type="button">
        <HelpCircle size={16} /> 출품 확인 문의
      </button>
    </section>
  );
}

function TeacherBenefits() {
  return (
    <section className="panel teacher-panel">
      <SectionTitle eyebrow="혜택/지원" title="받을 혜택과 지급 상태" />
      <div className="teacher-card-grid">
        <TeacherInfoCard title="한국경제신문 구독권" value="선정 후 지급" text="쿠폰이 배정되면 번호와 사용 상태가 이곳에 표시됩니다." />
        <TeacherInfoCard title="간식비" value="지급일 입력 대기" text="관리자가 지급 예정일을 입력하면 선생님 화면에 바로 표시됩니다." />
        <TeacherInfoCard title="참여 이력" value="성실 참여" text="향후 선착순 선정과 활동 우수 학교 검토에 반영됩니다." />
      </div>
    </section>
  );
}

function TeacherDocuments({ works }: { works: SubmissionWork[] }) {
  return (
    <section className="panel teacher-panel">
      <SectionTitle eyebrow="확인서/심사표" title="발급 문서 확인" />
      <div className="teacher-card-grid">
        <TeacherInfoCard title="활동확인서" value={works.length ? "승인 대기" : "출품 확인 전"} text="관리자가 최종 출품 리스트를 승인하면 PDF 다운로드가 열립니다." />
        <TeacherInfoCard title="심사표" value="수상 발표 후 공개" text="예심점수, 학교 내 순위, 본심 진출 여부를 확인합니다." />
        <TeacherInfoCard title="수정 요청" value="가능" text="이름, 작품명, 학교명 표기가 다르면 수정 요청을 보낼 수 있습니다." />
      </div>
      <button className="ghost-button panel-action" type="button">수정 요청하기</button>
    </section>
  );
}

function TeacherProfile() {
  return (
    <section className="panel teacher-panel">
      <SectionTitle eyebrow="내 프로필" title="학교와 담당자 정보" />
      <div className="profile-grid">
        <TeacherInfoCard title="학교명" value={teacherSnapshot.school} text="변경이 필요하면 변경 요청을 보내 주세요." />
        <TeacherInfoCard title="출품 소속명" value={teacherSnapshot.affiliation} text="출품 시 입력하는 소속명/팀명과 정확히 같아야 합니다." />
        <TeacherInfoCard title="연락처" value={teacherSnapshot.phone} text={teacherSnapshot.email} />
        <TeacherInfoCard title="선생님 증빙" value="등록 필요" text="재직증명서, 교원 확인증 등 증빙 파일을 등록합니다." />
      </div>
      <div className="button-row panel-action">
        <button className="ghost-button" type="button">수정하기</button>
        <button className="ghost-button" type="button">학교명 변경 요청</button>
      </div>
    </section>
  );
}

function AdminDashboard({ data, selectedEvent, setPage }: { data: DashboardResponse; selectedEvent?: DreamEvent; setPage: (page: AdminPage) => void }) {
  return (
    <>
      <section className="metric-grid">
        <Metric label="진행 꿈프" value={`${data.stats.activeEventCount}개`} />
        <Metric label="선정 학교" value={`${data.stats.selectedSchoolCount}곳`} />
        <Metric label="출품 확인" value={`${data.stats.confirmedSubmissionCount}/${data.stats.expectedSubmissionCount}편`} />
        <Metric label="확인 필요" value={`${data.stats.reviewRequiredCount}건`} danger />
      </section>
      <section className="panel">
        <div className="section-head">
          <div>
            <p className="eyebrow">행사별 현황</p>
            <h2>진행 중인 꿈프</h2>
          </div>
          <button className="primary-button" onClick={() => setPage("events")} type="button">
            <Plus size={16} /> 새 행사 등록
          </button>
        </div>
        {data.events.length === 0 ? (
          <EmptyState title="등록된 꿈프가 없습니다" description="행사를 등록하면 신청, 출품 확인, 쿠폰, 확인서 흐름을 행사별로 관리할 수 있습니다." />
        ) : (
          <div className="event-list">
            {data.events.map((event) => (
              <article className="event-row" key={event.id}>
                <span>
                  <strong>{event.title}</strong>
                  <small>{eventTypeLabels[event.eventType]} · {statusLabels[event.status]} · {event.contestPeriod || "기간 미입력"}</small>
                </span>
                <span>{event.targetSubmissionCount || 0}편 목표</span>
              </article>
            ))}
          </div>
        )}
      </section>
      <section className="panel">
        <SectionTitle eyebrow="선택 꿈프" title={selectedEvent?.title ?? "선택된 꿈프 없음"} />
        <div className="action-grid">
          <ActionCard title="출품 엑셀 매칭" text="학교명과 소속/팀명을 비교해 자동 확인, 확인 필요, 미매칭으로 분류합니다." />
          <ActionCard title="쿠폰 업로드" text="헤더가 없는 쿠폰 파일도 모든 셀에서 쿠폰 번호를 인식합니다." />
          <ActionCard title="활동확인서" text="템플릿 파일을 저장하고 추후 승인 후 PDF 발급 흐름으로 연결합니다." />
        </div>
      </section>
    </>
  );
}

function EventsPage({ data, selectedEvent, onCreateEvent }: { data: DashboardResponse; selectedEvent?: DreamEvent; onCreateEvent: (formData: FormData) => Promise<void> }) {
  return (
    <section className="panel">
      <SectionTitle eyebrow="행사 운영" title="새 꿈프 등록" />
      <form className="form-grid" onSubmit={(event) => { event.preventDefault(); void onCreateEvent(new FormData(event.currentTarget)); event.currentTarget.reset(); }}>
        <label>행사명<input name="title" required placeholder="예: 제13회 박카스 29초영화제" /></label>
        <label>유형<select name="eventType" required defaultValue={"TWENTY_NINE_SECONDS" satisfies EventType}><option value="TWENTY_NINE_SECONDS">29초영화제</option><option value="SHORTFORM_KING">29역숏폼왕</option></select></label>
        <label>공모기간<input name="contestPeriod" placeholder="2026.04.08 - 2026.05.21" /></label>
        <label>총상금<input name="prize" placeholder="총상금 2,000만원" /></label>
        <label>주제<input name="topic" placeholder="행사 주제" /></label>
        <label>목표 작품 수<input min="0" name="targetSubmissionCount" type="number" /></label>
        <label>포스터 URL<input name="posterUrl" /></label>
        <label>홈페이지 URL<input name="homepageUrl" /></label>
        <label>출품 URL<input name="submissionUrl" /></label>
        <label className="wide">안내사항<textarea name="notice" rows={4} /></label>
        <div className="form-actions"><button className="primary-button" type="submit">등록</button></div>
      </form>
      <div className="sub-panel">
        <h3>등록된 꿈프</h3>
        {data.events.length === 0 ? <p className="muted">아직 등록된 행사가 없습니다.</p> : null}
        {data.events.map((event) => (
          <div className={`compact-row ${selectedEvent?.id === event.id ? "active" : ""}`} key={event.id}>
            <strong>{event.title}</strong>
            <span>{eventTypeLabels[event.eventType]} · {statusLabels[event.status]}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function SubmissionsPage({ data, selectedEvent, onUpload }: { data: DashboardResponse; selectedEvent?: DreamEvent; onUpload: (file?: File) => void }) {
  const works = data.submissions.filter((work) => !selectedEvent || work.eventId === selectedEvent.id);
  return (
    <section className="panel">
      <SectionTitle eyebrow="출품 확인" title={selectedEvent ? `${selectedEvent.title} 출품 엑셀 업로드` : "출품 엑셀 업로드"} />
      <UploadInput accept=".xlsx,.xls,.csv,.txt" label="출품 엑셀 업로드" onFile={onUpload} />
      <p className="muted">필수 열: 소속 또는 팀명, 작품명 또는 작품제목, 감독 또는 출품자. URL 열이 있으면 함께 저장됩니다.</p>
      {works.length === 0 ? (
        <EmptyState title="분석된 출품작이 없습니다" description="관리자 페이지에서 내려받은 출품 엑셀을 업로드해 주세요." />
      ) : (
        <DataTable
          headers={["매칭", "소속/팀명", "작품명", "감독/출품자", "점수", "본심", "사유"]}
          rows={works.map((work) => [
            matchStatusLabels[work.matchStatus],
            work.affiliationName || "-",
            work.title || "-",
            work.participantName || "-",
            work.preliminaryScore?.toString() ?? "-",
            work.finalRoundStatus === "ADVANCED" ? "진출" : "-",
            work.matchReason
          ])}
        />
      )}
    </section>
  );
}

function BenefitsPage({ data, onCouponUpload }: { data: DashboardResponse; onCouponUpload: (file?: File) => void }) {
  return (
    <section className="panel">
      <SectionTitle eyebrow="혜택/지원" title="구독권 쿠폰 관리" />
      <UploadInput accept=".xlsx,.xls,.csv,.txt" label="쿠폰 엑셀 업로드" onFile={onCouponUpload} />
      <div className="metric-grid compact">
        <Metric label="전체 쿠폰" value={`${data.coupons.length}개`} />
        <Metric label="미사용" value={`${data.stats.unusedCouponCount}개`} />
        <Metric label="지급완료" value={`${data.coupons.filter((coupon) => coupon.status === "ASSIGNED").length}개`} />
      </div>
    </section>
  );
}

function DocumentsPage({ data, onTemplateUpload }: { data: DashboardResponse; onTemplateUpload: (file?: File) => void }) {
  return (
    <section className="panel">
      <SectionTitle eyebrow="활동확인서" title="템플릿 관리" />
      <UploadInput accept=".png,.jpg,.jpeg,.pdf" label="확인서 레퍼런스 업로드" onFile={onTemplateUpload} />
      {data.certificateTemplates.length === 0 ? (
        <EmptyState title="등록된 템플릿이 없습니다" description="활동확인서 디자인 파일을 한 번 업로드해 주세요." />
      ) : (
        <div className="compact-list">
          {data.certificateTemplates.map((template) => (
            <div className="compact-row" key={template.id}><strong>{template.fileName}</strong><span>저장됨</span></div>
          ))}
        </div>
      )}
    </section>
  );
}

function MailsPage() {
  return (
    <section className="panel">
      <SectionTitle eyebrow="메일/공지" title="발송 전 확인" />
      <div className="action-grid">
        <ActionCard title="D-day 안내 메일" text="D-14, D-10, D-5, D-1 메일 문구와 발송 시간을 관리자가 확인합니다." />
        <ActionCard title="선정 안내" text="선정 상태, 출품 URL, 쿠폰번호, 담당자 페이지 안내를 포함합니다." />
        <ActionCard title="발급 알림" text="확인서와 심사표가 준비되면 선생님에게 안내합니다." />
      </div>
    </section>
  );
}

function HistoryPage({ data }: { data: DashboardResponse }) {
  return (
    <section className="panel">
      <SectionTitle eyebrow="히스토리" title="최근 작업 이력" />
      {data.notices.length === 0 ? (
        <EmptyState title="기록된 작업이 없습니다" description="행사 등록, 업로드, 분석 작업이 이곳에 남습니다." />
      ) : (
        <div className="compact-list">
          {data.notices.map((notice) => (
            <div className="compact-row" key={notice.id}><strong>{notice.type}</strong><span>{notice.message}</span></div>
          ))}
        </div>
      )}
    </section>
  );
}

function SectionTitle({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="section-head">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2>{title}</h2>
      </div>
    </div>
  );
}

function TeacherStatusCard({ icon, label, value, note }: { icon: React.ReactNode; label: string; value: string; note: string }) {
  return <article className="teacher-status-card"><div className="teacher-icon">{icon}</div><span>{label}</span><strong>{value}</strong><p>{note}</p></article>;
}

function TeacherActionCard({ title, text, action, onClick }: { title: string; text: string; action: string; onClick: () => void }) {
  return <article className="teacher-action-card"><h3>{title}</h3><p>{text}</p><button className="ghost-button" onClick={onClick} type="button">{action}</button></article>;
}

function TeacherInfoCard({ title, value, text }: { title: string; value: string; text: string }) {
  return <article className="teacher-info-card"><span>{title}</span><strong>{value}</strong><p>{text}</p></article>;
}

function Metric({ label, value, danger }: { label: string; value: string; danger?: boolean }) {
  return <article className="metric-card"><span>{label}</span><strong className={danger ? "danger-text" : ""}>{value}</strong></article>;
}

function ActionCard({ title, text }: { title: string; text: string }) {
  return <article className="action-card"><div className="action-icon"><CheckCircle2 size={18} /></div><div><strong>{title}</strong><p>{text}</p></div></article>;
}

function EmptyState({ title, description }: { title: string; description: string }) {
  return <div className="empty-state"><strong>{title}</strong><p>{description}</p></div>;
}

function DataTable({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div className="table-wrap">
      <table>
        <thead><tr>{headers.map((header) => <th key={header}>{header}</th>)}</tr></thead>
        <tbody>{rows.map((row, rowIndex) => <tr key={rowIndex}>{row.map((cell, cellIndex) => <td key={`${rowIndex}-${cellIndex}`}>{cell}</td>)}</tr>)}</tbody>
      </table>
    </div>
  );
}

function UploadInput({ accept, label, onFile }: { accept: string; label: string; onFile: (file?: File) => void }) {
  return (
    <label className="upload-button">
      <Upload size={16} /> {label}
      <input accept={accept} hidden onChange={(event) => onFile(event.target.files?.[0])} type="file" />
    </label>
  );
}

function buildTeacherApplications(events: DreamEvent[]): Array<{ event: DreamEvent; status: string; expectedCount: number }> {
  return events.slice(0, 2).map((event, index) => ({
    event,
    status: index === 0 ? applicationStatusLabels.SELECTED : applicationStatusLabels.SUBMITTED,
    expectedCount: index === 0 ? 8 : 5
  }));
}

function normalize(value: string) {
  return value.replace(/\s/g, "");
}

async function readErrorMessage(response: Response) {
  try {
    const data = await response.json();
    return data.message || "작업을 완료하지 못했습니다.";
  } catch {
    return "작업을 완료하지 못했습니다.";
  }
}

async function readSheetRows(file: File) {
  const table = await readSheetTable(file);
  const headerIndex = table.findIndex((row) => row.some((cell) => /소속|소속명|팀명|작품명|작품제목|감독|출품자/.test(String(cell))));
  if (headerIndex < 0) throw new Error("엑셀에서 소속/팀명, 작품명, 감독/출품자 열을 찾지 못했습니다.");
  const headers = table[headerIndex].map((cell) => String(cell ?? "").trim());
  return table.slice(headerIndex + 1).map((row) => {
    const record: Record<string, string | number | undefined> = {};
    headers.forEach((header, index) => {
      if (header) record[header] = row[index] as string | number | undefined;
    });
    return record;
  });
}

async function readSheetCellValues(file: File) {
  const table = await readSheetTable(file);
  return table.flat().filter((value) => value != null && String(value).trim());
}

async function readSheetTable(file: File): Promise<Array<Array<string | number | undefined>>> {
  const buffer = await file.arrayBuffer();
  const firstText = new TextDecoder("utf-8", { fatal: false }).decode(buffer.slice(0, 1024));
  if (/^\s*<html/i.test(firstText) && /sheet\d+\.htm/i.test(firstText)) {
    throw new Error("이 .xls 파일은 여러 HTML 조각을 참조하는 형식입니다. 엑셀에서 .xlsx 또는 .csv로 다시 저장한 뒤 업로드해 주세요.");
  }
  if (file.name.toLowerCase().endsWith(".csv") || file.name.toLowerCase().endsWith(".txt")) {
    const text = new TextDecoder("utf-8", { fatal: false }).decode(buffer);
    return text.split(/\r?\n/).map((line) => line.split(",").map((cell) => cell.trim()));
  }
  const XLSX = await import("xlsx");
  const workbook = XLSX.read(buffer, { type: "array" });
  const sheetName = workbook.SheetNames[0];
  if (!sheetName) return [];
  return XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1, raw: false, defval: "" }) as Array<Array<string | number | undefined>>;
}

function fileToDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
