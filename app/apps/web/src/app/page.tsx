"use client";

import { useEffect, useMemo, useState } from "react";
import { FileSpreadsheet, Mail, Plus, RefreshCw, RotateCcw, Upload } from "lucide-react";
import type { DashboardResponse, DreamEvent, EventType } from "@/lib/with-types";
import { eventTypeLabels, statusLabels } from "@/lib/with-types";

type PageKey = "dashboard" | "events" | "applications" | "submissions" | "benefits" | "documents" | "mails" | "history";

const pages: Array<{ key: PageKey; label: string }> = [
  { key: "dashboard", label: "대시보드" },
  { key: "events", label: "행사 운영" },
  { key: "applications", label: "신청/선정" },
  { key: "submissions", label: "출품 확인" },
  { key: "benefits", label: "혜택/지원" },
  { key: "documents", label: "활동확인서/심사표" },
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

export default function HomePage() {
  const [data, setData] = useState<DashboardResponse>(emptyDashboard);
  const [page, setPage] = useState<PageKey>("dashboard");
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
    if (!response.ok) throw new Error(await response.text());
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
        status: "PREPARING"
      },
      "새 꿈프 행사를 등록했습니다."
    );
    setPage("dashboard");
  }

  async function handleCouponUpload(file?: File) {
    if (!file) return;
    const rows = await readSheetRows(file);
    const couponNumbers = rows
      .flatMap((row) => Object.values(row))
      .map((value) => String(value ?? "").trim())
      .filter((value) => value && !/쿠폰|coupon/i.test(value));
    await postJson("/api/coupons", { couponNumbers }, `쿠폰 ${couponNumbers.length}개를 인식했습니다.`);
  }

  async function handleSubmissionUpload(file?: File) {
    if (!file || !selectedEvent) return;
    await postJson(
      "/api/submissions/analyze",
      { eventId: selectedEvent.id, rows: await readSheetRows(file) },
      "출품 엑셀 분석이 완료되었습니다."
    );
    setPage("submissions");
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
    if (!confirm("테스트용으로 들어간 모든 정보를 초기화할까요?")) return;
    await postJson("/api/reset", undefined, "테스트 데이터를 초기화했습니다.");
    setSelectedEventId("");
  }

  return (
    <main className="app-shell">
      <aside className="side-nav">
        <div className="brand-box">
          <span>29</span>
          <div>
            <strong>29 WITH</strong>
            <small>꿈프 운영</small>
          </div>
        </div>
        <nav>
          {pages.map((item) => (
            <button className={page === item.key ? "active" : ""} key={item.key} onClick={() => setPage(item.key)}>
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      <section className="content-area">
        <header className="top-bar">
          <div>
            <p>29 Platform 대외협력 관리 시스템</p>
            <h1>영상 꿈나무 양성 프로젝트</h1>
          </div>
          <div className="top-actions">
            <select value={selectedEventId} onChange={(event) => setSelectedEventId(event.target.value)}>
              {data.events.length === 0 ? <option>등록된 꿈프 없음</option> : null}
              {data.events.map((event) => (
                <option key={event.id} value={event.id}>{event.title}</option>
              ))}
            </select>
            <button className="ghost-button" onClick={loadDashboard} type="button"><RefreshCw size={16} />새로고침</button>
            <button className="ghost-button" onClick={handleReset} type="button"><RotateCcw size={16} />초기화</button>
          </div>
        </header>

        {message ? <div className="toast-inline">{message}</div> : null}
        {isLoading ? <section className="panel">불러오는 중입니다.</section> : null}
        {!isLoading && page === "dashboard" ? <Dashboard data={data} selectedEvent={selectedEvent} setPage={setPage} /> : null}
        {!isLoading && page === "events" ? <EventsPage data={data} selectedEvent={selectedEvent} onCreateEvent={handleCreateEvent} /> : null}
        {!isLoading && page === "applications" ? <ApplicationsPage data={data} selectedEvent={selectedEvent} /> : null}
        {!isLoading && page === "submissions" ? <SubmissionsPage data={data} selectedEvent={selectedEvent} onUpload={handleSubmissionUpload} /> : null}
        {!isLoading && page === "benefits" ? <BenefitsPage data={data} onCouponUpload={handleCouponUpload} /> : null}
        {!isLoading && page === "documents" ? <DocumentsPage data={data} onTemplateUpload={handleTemplateUpload} /> : null}
        {!isLoading && page === "mails" ? <MailsPage /> : null}
        {!isLoading && page === "history" ? <HistoryPage data={data} /> : null}
      </section>
    </main>
  );
}

function Dashboard({ data, selectedEvent, setPage }: { data: DashboardResponse; selectedEvent?: DreamEvent; setPage: (page: PageKey) => void }) {
  return (
    <>
      <section className="metric-grid">
        <Metric label="진행 꿈프" value={`${data.stats.activeEventCount}개`} />
        <Metric label="선정 학교" value={`${data.stats.selectedSchoolCount}곳`} />
        <Metric label="출품 확인" value={`${data.stats.confirmedSubmissionCount}/${data.stats.expectedSubmissionCount}편`} />
        <Metric label="확인 필요" value={`${data.stats.reviewRequiredCount}건`} danger />
      </section>
      <section className="panel">
        <div className="section-head"><div><p className="eyebrow">행사별 현황</p><h2>진행 중인 꿈프</h2></div><button className="primary-button" onClick={() => setPage("events")} type="button"><Plus size={16} />새 행사 등록</button></div>
        {data.events.length === 0 ? <EmptyState title="등록된 꿈프가 없습니다" description="먼저 행사 정보를 등록하면 신청, 선정, 출품 확인, 활동확인서 발급 흐름이 행사별로 분리됩니다." action="행사 등록하기" onAction={() => setPage("events")} /> : <div className="event-list">{data.events.map((event) => <article className="event-row" key={event.id}><span><strong>{event.title}</strong><small>{eventTypeLabels[event.eventType]} · {statusLabels[event.status]} · {event.contestPeriod || "기간 미입력"}</small></span><span>{event.targetSubmissionCount || 0}편 목표</span></article>)}</div>}
      </section>
      <section className="panel">
        <div className="section-head"><div><p className="eyebrow">선택 꿈프</p><h2>{selectedEvent?.title ?? "선택된 꿈프 없음"}</h2></div><div className="button-row"><button className="ghost-button" onClick={() => setPage("submissions")} type="button">출품 확인</button><button className="primary-button" onClick={() => setPage("applications")} type="button">신청/선정</button></div></div>
        <div className="action-grid"><ActionCard icon={<FileSpreadsheet size={18} />} title="출품 엑셀 매칭" text="학교명과 소속/팀명을 비교해 자동 확인, 확인 필요, 미매칭으로 분류합니다." /><ActionCard icon={<Upload size={18} />} title="쿠폰/확인서 업로드" text="쿠폰 번호와 확인서 템플릿은 업로드 즉시 저장됩니다." /><ActionCard icon={<Mail size={18} />} title="메일 예약" text="발송 전 관리자가 내용, 날짜, 수신자를 확인하는 구조입니다." /></div>
      </section>
    </>
  );
}

function EventsPage({ data, selectedEvent, onCreateEvent }: { data: DashboardResponse; selectedEvent?: DreamEvent; onCreateEvent: (formData: FormData) => Promise<void> }) {
  return <section className="panel"><div className="section-head"><div><p className="eyebrow">행사 운영</p><h2>새 꿈프 등록</h2></div></div><form className="form-grid" onSubmit={(event) => { event.preventDefault(); void onCreateEvent(new FormData(event.currentTarget)); event.currentTarget.reset(); }}><label>행사명<input name="title" required placeholder="예: 제13회 박카스 29초영화제" /></label><label>유형<select name="eventType" required defaultValue={"TWENTY_NINE_SECONDS" satisfies EventType}><option value="TWENTY_NINE_SECONDS">29초영화제</option><option value="SHORTFORM_KING">29역숏폼왕</option></select></label><label>공모기간<input name="contestPeriod" placeholder="2026.04.08 - 2026.05.21" /></label><label>총상금<input name="prize" placeholder="총상금 2,000만원" /></label><label>주제<input name="topic" placeholder="행사 주제" /></label><label>목표 작품 수<input min="0" name="targetSubmissionCount" type="number" /></label><label>포스터 URL<input name="posterUrl" /></label><label>홈페이지 URL<input name="homepageUrl" /></label><label>출품 URL<input name="submissionUrl" /></label><label className="wide">안내사항<textarea name="notice" rows={4} /></label><div className="form-actions"><button className="primary-button" type="submit">등록</button></div></form><ExistingEvents events={data.events} selectedEvent={selectedEvent} /></section>;
}

function ExistingEvents({ events, selectedEvent }: { events: DreamEvent[]; selectedEvent?: DreamEvent }) {
  return <div className="sub-panel"><h3>등록된 꿈프</h3>{events.length === 0 ? <p className="muted">아직 등록된 행사가 없습니다.</p> : null}{events.map((event) => <div className={`compact-row ${selectedEvent?.id === event.id ? "active" : ""}`} key={event.id}><strong>{event.title}</strong><span>{eventTypeLabels[event.eventType]} · {statusLabels[event.status]}</span></div>)}</div>;
}

function ApplicationsPage({ data, selectedEvent }: { data: DashboardResponse; selectedEvent?: DreamEvent }) {
  const rows = data.applications.filter((application) => application.eventId === selectedEvent?.id);
  return <section className="panel"><SectionTitle eyebrow="신청/선정" title={selectedEvent?.title ?? "행사를 선택하세요"} />{rows.length === 0 ? <EmptyState title="접수된 신청이 없습니다" description="선생님 신청이 들어오면 선착순, 패널티, 성실 참여 이력을 기준으로 이곳에서 검토합니다." /> : <DataTable headers={["학교", "소속/팀명", "예상 편수", "상태"]} rows={rows.map((row) => [row.schoolName, row.affiliationName, `${row.expectedSubmissionCount}편`, row.status])} />}</section>;
}

function SubmissionsPage({ data, selectedEvent, onUpload }: { data: DashboardResponse; selectedEvent?: DreamEvent; onUpload: (file?: File) => void }) {
  const rows = data.submissions.filter((work) => work.eventId === selectedEvent?.id);
  return <section className="panel"><div className="section-head"><div><p className="eyebrow">출품 확인</p><h2>{selectedEvent?.title ?? "행사를 선택하세요"}</h2></div><label className="upload-button"><Upload size={16} />출품 엑셀 업로드<input accept=".xlsx,.xls,.csv,.tsv,.txt" hidden type="file" onChange={(event) => onUpload(event.target.files?.[0])} /></label></div><p className="muted">29초영화제는 소속명, 29역숏폼왕은 팀명 기준으로 신청 학교와 매칭합니다.</p>{rows.length === 0 ? <EmptyState title="분석된 출품작이 없습니다" description="출품작 엑셀을 업로드하면 작품명, 감독/출품자, URL, 점수, 본심 여부를 인식합니다." /> : <DataTable headers={["매칭", "소속/팀명", "작품명", "감독/출품자", "점수", "본심"]} rows={rows.map((row) => [matchLabel(row.matchStatus), row.affiliationName, row.title, row.participantName, row.preliminaryScore?.toString() ?? "-", row.finalRoundStatus === "ADVANCED" ? "진출" : "-"])} />}</section>;
}

function BenefitsPage({ data, onCouponUpload }: { data: DashboardResponse; onCouponUpload: (file?: File) => void }) {
  return <section className="panel"><div className="section-head"><div><p className="eyebrow">혜택/지원</p><h2>구독권 쿠폰과 간식비</h2></div><label className="upload-button"><Upload size={16} />쿠폰 파일 업로드<input accept=".xlsx,.xls,.csv,.txt" hidden type="file" onChange={(event) => onCouponUpload(event.target.files?.[0])} /></label></div><section className="metric-grid compact"><Metric label="전체 쿠폰" value={`${data.coupons.length}개`} /><Metric label="미사용" value={`${data.stats.unusedCouponCount}개`} /><Metric label="지급완료" value={`${data.coupons.length - data.stats.unusedCouponCount}개`} /></section></section>;
}

function DocumentsPage({ data, onTemplateUpload }: { data: DashboardResponse; onTemplateUpload: (file?: File) => void }) {
  return <section className="panel"><div className="section-head"><div><p className="eyebrow">활동확인서/심사표</p><h2>문서 발급 준비</h2></div><label className="upload-button"><Upload size={16} />확인서 레퍼런스 업로드<input accept="image/*,.pdf" hidden type="file" onChange={(event) => onTemplateUpload(event.target.files?.[0])} /></label></div>{data.certificateTemplates.length === 0 ? <EmptyState title="등록된 확인서 레퍼런스가 없습니다" description="관리자가 템플릿을 업로드하면 행사별 확인서 발급 기준으로 사용합니다." /> : <DataTable headers={["파일명", "업로드일"]} rows={data.certificateTemplates.map((template) => [template.fileName, new Date(template.uploadedAt).toLocaleString("ko-KR")])} />}</section>;
}

function MailsPage() {
  return <section className="panel"><SectionTitle eyebrow="메일/공지" title="발송 전 확인 구조" /><div className="notice-card"><Mail size={20} /><p>D-14, D-10, D-5, D-1 안내 메일은 자동 생성 후 관리자가 내용, 발송 시간, 수신자를 확인하고 예약 발송합니다.</p></div></section>;
}

function HistoryPage({ data }: { data: DashboardResponse }) {
  return <section className="panel"><SectionTitle eyebrow="히스토리" title="운영 기록" />{data.notices.length === 0 ? <EmptyState title="아직 운영 기록이 없습니다" description="행사 등록, 파일 업로드, 분석 같은 주요 작업을 기록합니다." /> : <div className="event-list">{data.notices.map((notice) => <article className="event-row" key={notice.id}><span><strong>{notice.type}</strong><small>{notice.message}</small></span><span>{new Date(notice.createdAt).toLocaleString("ko-KR")}</span></article>)}</div>}</section>;
}

function SectionTitle({ eyebrow, title }: { eyebrow: string; title: string }) { return <div className="section-head"><div><p className="eyebrow">{eyebrow}</p><h2>{title}</h2></div></div>; }
function Metric({ label, value, danger = false }: { label: string; value: string; danger?: boolean }) { return <article className="metric-card"><span>{label}</span><strong className={danger ? "danger-text" : ""}>{value}</strong></article>; }
function ActionCard({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) { return <article className="action-card"><div className="action-icon">{icon}</div><div><strong>{title}</strong><p>{text}</p></div></article>; }
function EmptyState({ title, description, action, onAction }: { title: string; description: string; action?: string; onAction?: () => void }) { return <div className="empty-state"><strong>{title}</strong><p>{description}</p>{action ? <button className="primary-button" onClick={onAction} type="button">{action}</button> : null}</div>; }
function DataTable({ headers, rows }: { headers: string[]; rows: string[][] }) { return <div className="table-wrap"><table><thead><tr>{headers.map((header) => <th key={header}>{header}</th>)}</tr></thead><tbody>{rows.map((row, rowIndex) => <tr key={`${rowIndex}-${row.join("-")}`}>{row.map((cell, cellIndex) => <td key={`${cellIndex}-${cell}`}>{cell}</td>)}</tr>)}</tbody></table></div>; }
function matchLabel(status: string) { if (status === "MATCHED") return "자동 확인"; if (status === "NEEDS_REVIEW") return "확인 필요"; return "미매칭"; }

function parseDelimitedRows(text: string) {
  const lines = text.split(/\r?\n/).filter((line) => line.trim());
  const headers = splitLine(lines[0] || "");
  return lines.slice(1).map((line) => {
    const values = splitLine(line);
    return Object.fromEntries(headers.map((header, index) => [header, values[index] ?? ""]));
  });
}

async function readSheetRows(file: File): Promise<Array<Record<string, string | number>>> {
  const lowerName = file.name.toLowerCase();
  if (lowerName.endsWith(".xlsx") || lowerName.endsWith(".xls")) {
    const XLSX = await loadSheetJs();
    const workbook = XLSX.read(await file.arrayBuffer(), { type: "array" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    return XLSX.utils.sheet_to_json(sheet, { defval: "" }) as Array<Record<string, string | number>>;
  }
  return parseDelimitedRows(await file.text());
}

function loadSheetJs(): Promise<SheetJsApi> {
  const existing = (window as WindowWithSheetJs).XLSX;
  if (existing) return Promise.resolve(existing);
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://cdn.sheetjs.com/xlsx-0.20.3/package/dist/xlsx.full.min.js";
    script.async = true;
    script.onload = () => {
      const loaded = (window as WindowWithSheetJs).XLSX;
      if (loaded) resolve(loaded);
      else reject(new Error("엑셀 파서를 불러오지 못했습니다."));
    };
    script.onerror = () => reject(new Error("엑셀 파서를 불러오지 못했습니다."));
    document.head.appendChild(script);
  });
}

type SheetJsApi = { read: (data: ArrayBuffer, options: { type: "array" }) => { SheetNames: string[]; Sheets: Record<string, unknown> }; utils: { sheet_to_json: (sheet: unknown, options: { defval: string }) => unknown[] } };
type WindowWithSheetJs = Window & { XLSX?: SheetJsApi };
function splitLine(line: string) { const separator = line.includes("\t") ? "\t" : ","; return line.split(separator).map((value) => value.trim().replace(/^"|"$/g, "")); }
function fileToDataUrl(file: File) { return new Promise<string>((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(String(reader.result)); reader.onerror = () => reject(reader.error); reader.readAsDataURL(file); }); }
