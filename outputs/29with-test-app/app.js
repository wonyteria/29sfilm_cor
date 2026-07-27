const STORAGE_KEY = "29with-real-empty-v1";

const emptyState = () => ({
  role: "admin",
  page: "adminDashboard",
  selectedEventId: "",
  events: [],
  submissions: [],
  coupons: [],
  certificateTemplates: [],
  audit: []
});

let state = loadState();

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? { ...emptyState(), ...JSON.parse(saved) } : emptyState();
  } catch {
    return emptyState();
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function render() {
  document.body.dataset.role = state.role;
  document.querySelectorAll("[data-role]").forEach((button) => {
    button.classList.toggle("active", button.dataset.role === state.role);
  });
  document.querySelector("#adminNav").classList.toggle("hidden", state.role !== "admin");
  document.querySelector("#teacherNav").classList.toggle("hidden", state.role !== "teacher");
  document.querySelectorAll(".nav button").forEach((button) => {
    button.classList.toggle("active", button.dataset.page === state.page);
  });

  renderEventSelect();
  const title = pageTitle();
  document.querySelector("#pageTitle").textContent = title;
  document.querySelector("#app").innerHTML = state.role === "admin" ? renderAdminPage() : renderTeacherPage();
  bindDynamicEvents();
}

function renderEventSelect() {
  const select = document.querySelector("#eventSelect");
  select.innerHTML = state.events.length
    ? state.events.map((event) => `<option value="${event.id}">${escapeHtml(event.title)}</option>`).join("")
    : `<option value="">등록된 꿈프 없음</option>`;
  select.value = state.selectedEventId || "";
}

function pageTitle() {
  const labels = {
    adminDashboard: "꿈프 대시보드",
    eventOps: "행사 운영",
    submissions: "출품 확인",
    benefits: "혜택/지원",
    certificates: "활동확인서",
    history: "히스토리",
    teacherDashboard: "내 대시보드",
    availableEvents: "신청 가능한 행사",
    teacherWorks: "학생/작품 관리",
    teacherDocs: "활동확인서/심사표",
    teacherProfile: "내 프로필"
  };
  return labels[state.page] || "29 WITH";
}

function renderAdminPage() {
  if (state.page === "eventOps") return renderEventOps();
  if (state.page === "submissions") return renderSubmissions();
  if (state.page === "benefits") return renderBenefits();
  if (state.page === "certificates") return renderCertificates();
  if (state.page === "history") return renderHistory();
  return renderAdminDashboard();
}

function renderTeacherPage() {
  if (state.page === "availableEvents") return renderAvailableEvents();
  if (state.page === "teacherWorks") return renderTeacherWorks();
  if (state.page === "teacherDocs") return renderTeacherDocs();
  if (state.page === "teacherProfile") return renderTeacherProfile();
  return renderTeacherDashboard();
}

function renderAdminDashboard() {
  const selected = selectedEvent();
  return `
    <section class="panel">
      <div class="panel-head">
        <div>
          <h2>진행 중인 꿈프</h2>
          <span>샘플 데이터 없이, 관리자가 등록한 행사만 표시됩니다.</span>
        </div>
        <button class="primary" data-page-go="eventOps" type="button">새 행사 등록</button>
      </div>
      ${state.events.length ? `<div class="event-grid">${state.events.map(eventCard).join("")}</div>` : emptyBox("등록된 꿈프 행사가 없습니다.", "처음 테스트는 '새 행사 등록'에서 행사 정보를 입력하는 것부터 시작합니다.")}
    </section>
    <div class="grid four">
      ${stat("운영 중", `${state.events.length}개`, "등록된 꿈프")}
      ${stat("쿠폰", `${state.coupons.length}개`, "업로드 인식")}
      ${stat("출품 확인", `${worksForSelected().length}편`, "엑셀 분석 기준")}
      ${stat("확인 필요", `${worksForSelected().filter((work) => work.matchStatus === "확인 필요").length}건`, "유사 매칭")}
    </div>
    <section class="panel">
      <div class="panel-head"><h2>${selected ? escapeHtml(selected.title) : "선택된 행사 없음"}</h2><span>행사를 등록하면 신청/출품/확인서 작업을 이어갈 수 있습니다.</span></div>
      ${selected ? actionGrid() : emptyBox("관리할 행사가 없습니다.", "행사 운영에서 실제 꿈프 행사를 등록해 주세요.")}
    </section>
  `;
}

function renderEventOps() {
  return `
    <section class="panel">
      <div class="panel-head"><h2>새 행사 등록</h2><span>선생님 화면의 모집중 행사 리스트에 표시될 정보입니다.</span></div>
      <form id="eventForm" class="form-grid">
        <label>행사명<input name="title" required placeholder="행사명을 입력하세요" /></label>
        <label>행사 유형<select name="type"><option>29초영화제</option><option>29역숏폼왕</option></select></label>
        <label>공모기간<input name="contestPeriod" placeholder="2026.04.08 - 2026.05.21" /></label>
        <label>총상금/혜택<input name="totalPrize" placeholder="총상금 또는 혜택" /></label>
        <label>목표 작품 수<input name="targetWorks" min="0" type="number" /></label>
        <label>포스터 URL<input name="posterUrl" placeholder="https://..." /></label>
        <label class="wide">주제<input name="theme" placeholder="행사 주제" /></label>
        <label>홈페이지 URL<input name="homepageUrl" placeholder="https://..." /></label>
        <label>출품 URL<input name="submissionUrl" placeholder="https://..." /></label>
        <label class="wide">안내사항<textarea name="organizerNotice" rows="4" placeholder="선생님에게 보여줄 안내사항"></textarea></label>
        <div class="form-actions"><button class="primary" type="submit">행사 등록</button></div>
      </form>
    </section>
    <section class="panel">
      <div class="panel-head"><h2>등록된 행사</h2><span>현재 저장된 실제 테스트 데이터</span></div>
      ${state.events.length ? `<div class="event-list">${state.events.map(eventRow).join("")}</div>` : emptyBox("등록된 행사가 없습니다.", "새 행사를 등록하면 이곳에 표시됩니다.")}
    </section>
  `;
}

function renderSubmissions() {
  const event = selectedEvent();
  return `
    <section class="panel">
      <div class="panel-head"><h2>출품 엑셀 업로드</h2><span>소속/소속명/팀명 컬럼을 기준으로 작품을 분석합니다.</span></div>
      ${event ? `
        <div class="toolbar">
          <strong>${escapeHtml(event.title)}</strong>
          <input id="submissionFile" type="file" accept=".xls,.xlsx,.csv" />
          <button class="primary" data-action="upload-submissions" type="button">출품 엑셀 분석</button>
        </div>
        ${worksTable(worksForSelected())}
      ` : emptyBox("먼저 행사를 등록해 주세요.", "행사가 있어야 출품 엑셀을 분석할 수 있습니다.")}
    </section>
  `;
}

function renderBenefits() {
  return `
    <section class="panel">
      <div class="panel-head"><h2>쿠폰 엑셀 업로드</h2><span>쿠폰번호가 들어 있는 셀을 자동으로 인식합니다.</span></div>
      <div class="toolbar">
        <input id="couponFile" type="file" accept=".xls,.xlsx,.csv" />
        <button class="primary" data-action="upload-coupons" type="button">쿠폰 번호 인식</button>
      </div>
      ${state.coupons.length ? `<div class="table-wrap"><table><thead><tr><th>쿠폰번호</th><th>상태</th></tr></thead><tbody>${state.coupons.map((coupon) => `<tr><td>${escapeHtml(coupon.code)}</td><td>${coupon.status}</td></tr>`).join("")}</tbody></table></div>` : emptyBox("업로드된 쿠폰이 없습니다.", "쿠폰 엑셀을 업로드하면 이곳에 표시됩니다.")}
    </section>
  `;
}

function renderCertificates() {
  return `
    <section class="panel">
      <div class="panel-head"><h2>활동확인서 템플릿</h2><span>관리자가 업로드한 파일을 발급 기준으로 보관합니다.</span></div>
      <div class="toolbar">
        <input id="templateFile" type="file" accept=".png,.jpg,.jpeg,.pdf" />
        <button class="primary" data-action="upload-template" type="button">템플릿 저장</button>
      </div>
      ${state.certificateTemplates.length ? `<div class="event-list">${state.certificateTemplates.map((item) => `<div class="event-row"><strong>${escapeHtml(item.name)}</strong><span>${item.date}</span></div>`).join("")}</div>` : emptyBox("등록된 템플릿이 없습니다.", "활동확인서 레퍼런스를 업로드해 주세요.")}
    </section>
  `;
}

function renderHistory() {
  return `
    <section class="panel">
      <div class="panel-head"><h2>히스토리</h2><span>관리자가 수행한 작업 기록</span></div>
      ${state.audit.length ? `<div class="event-list">${state.audit.map((item) => `<div class="event-row"><strong>${escapeHtml(item.action)}</strong><span>${escapeHtml(item.detail)}</span></div>`).join("")}</div>` : emptyBox("기록이 없습니다.", "행사 등록, 엑셀 업로드 등 작업을 하면 기록됩니다.")}
    </section>
  `;
}

function renderTeacherDashboard() {
  return `
    <section class="panel">
      <div class="panel-head"><h2>내 꿈프 현황</h2><span>신청 이후 내 활동 상태가 표시됩니다.</span></div>
      ${emptyBox("아직 신청 내역이 없습니다.", "신청 가능한 행사에서 꿈프를 신청하면 이곳에 상태가 표시됩니다.")}
    </section>
    <div class="grid three">
      ${stat("신청", "0건", "접수/선정 내역")}
      ${stat("출품 확인", "0편", "관리자 승인 후 표시")}
      ${stat("알림", "0건", "메일/문서 발급")}
    </div>
  `;
}

function renderAvailableEvents() {
  const events = state.events.filter((event) => event.status === "모집중");
  return `
    <section class="panel">
      <div class="panel-head"><h2>신청 가능한 행사</h2><span>관리자가 등록한 모집중 행사만 표시됩니다.</span></div>
      ${events.length ? `<div class="event-grid">${events.map(teacherEventCard).join("")}</div>` : emptyBox("현재 모집중인 행사가 없습니다.", "관리자가 새 행사를 등록하면 이곳에 표시됩니다.")}
    </section>
  `;
}

function renderTeacherWorks() {
  return `<section class="panel"><div class="panel-head"><h2>학생/작품 관리</h2><span>출품 확인 후 표시됩니다.</span></div>${emptyBox("아직 확인된 작품이 없습니다.", "관리자가 출품 엑셀을 분석하고 매칭을 승인하면 작품이 표시됩니다.")}</section>`;
}

function renderTeacherDocs() {
  return `<section class="panel"><div class="panel-head"><h2>활동확인서/심사표</h2><span>관리자 승인 후 다운로드 가능합니다.</span></div>${emptyBox("발급 가능한 문서가 없습니다.", "출품 마감 후 관리자가 최종 승인하면 문서가 표시됩니다.")}</section>`;
}

function renderTeacherProfile() {
  return `
    <section class="panel">
      <div class="panel-head"><h2>내 프로필</h2><span>학교명과 출품 소속명은 매칭 기준입니다.</span></div>
      <div class="grid two">
        ${info("학교명", "미등록", "최초 신청 시 입력")}
        ${info("출품 소속명/팀명", "미등록", "엑셀 소속/팀명과 완전 일치 필요")}
        ${info("연락처", "미등록", "업무용 이메일 권장")}
        ${info("교사 증빙", "미등록", "선생님 확인증 등")}
      </div>
    </section>
  `;
}

function bindDynamicEvents() {
  document.querySelectorAll("[data-page-go]").forEach((button) => {
    button.addEventListener("click", () => {
      state.page = button.dataset.pageGo;
      saveState();
      render();
    });
  });
  document.querySelector("#eventForm")?.addEventListener("submit", addEvent);
  document.querySelector("[data-action='upload-submissions']")?.addEventListener("click", uploadSubmissions);
  document.querySelector("[data-action='upload-coupons']")?.addEventListener("click", uploadCoupons);
  document.querySelector("[data-action='upload-template']")?.addEventListener("click", uploadTemplate);
  document.querySelectorAll("[data-event-id]").forEach((item) => {
    item.addEventListener("click", () => {
      state.selectedEventId = item.dataset.eventId;
      saveState();
      render();
    });
  });
}

function addEvent(event) {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  const next = {
    id: `event_${Date.now()}`,
    title: String(form.get("title") || "").trim(),
    type: String(form.get("type") || "29초영화제"),
    status: "모집중",
    contestPeriod: String(form.get("contestPeriod") || "").trim(),
    totalPrize: String(form.get("totalPrize") || "").trim(),
    targetWorks: Number(form.get("targetWorks") || 0),
    posterUrl: String(form.get("posterUrl") || "").trim(),
    theme: String(form.get("theme") || "").trim(),
    homepageUrl: String(form.get("homepageUrl") || "").trim(),
    submissionUrl: String(form.get("submissionUrl") || "").trim(),
    organizerNotice: String(form.get("organizerNotice") || "").trim()
  };
  if (!next.title) return toast("행사명을 입력해 주세요.");
  state.events.unshift(next);
  state.selectedEventId = next.id;
  audit("행사 등록", next.title);
  saveState();
  toast("행사를 등록했습니다.");
  state.page = "adminDashboard";
  render();
}

async function uploadSubmissions() {
  const event = selectedEvent();
  const file = document.querySelector("#submissionFile")?.files?.[0];
  if (!event) return toast("먼저 행사를 등록해 주세요.");
  if (!file) return toast("출품 엑셀 파일을 선택해 주세요.");
  const rows = await readRows(file);
  const works = rows.map((row, index) => ({
    id: `work_${Date.now()}_${index}`,
    eventId: event.id,
    affiliation: pick(row, ["소속", "소속명", "팀명", "affiliation", "team"]),
    title: pick(row, ["작품명", "작품제목", "제목", "title"]),
    student: pick(row, ["감독", "출품자", "이름", "participant", "director"]),
    url: pick(row, ["출품 URL", "출품URL", "보기 URL", "영상 URL", "URL", "url", "링크"]),
    score: pick(row, ["예심평점", "평점", "일반평점", "score"]),
    result: pick(row, ["수상결과", "본심", "finalResult"]),
    matchStatus: "확인 필요"
  })).filter((work) => work.affiliation || work.title || work.student);
  state.submissions = state.submissions.filter((work) => work.eventId !== event.id).concat(works);
  audit("출품 엑셀 분석", `${event.title} · ${works.length}건`);
  saveState();
  toast(`출품작 ${works.length}건을 인식했습니다.`);
  render();
}

async function uploadCoupons() {
  const file = document.querySelector("#couponFile")?.files?.[0];
  if (!file) return toast("쿠폰 엑셀 파일을 선택해 주세요.");
  const values = (await readCellValues(file)).map(String);
  const codes = [...new Set(values.flatMap((value) => value.match(/[A-Z0-9]{2,}(?:-[A-Z0-9]{2,})+/gi) || []).map((code) => code.toUpperCase()))];
  const existing = new Set(state.coupons.map((coupon) => coupon.code));
  codes.filter((code) => !existing.has(code)).forEach((code) => state.coupons.push({ code, status: "미사용" }));
  audit("쿠폰 엑셀 업로드", `${codes.length}개 인식`);
  saveState();
  toast(`쿠폰 번호 ${codes.length}개를 인식했습니다.`);
  render();
}

function uploadTemplate() {
  const file = document.querySelector("#templateFile")?.files?.[0];
  if (!file) return toast("활동확인서 템플릿 파일을 선택해 주세요.");
  state.certificateTemplates.unshift({ name: file.name, date: new Date().toLocaleString("ko-KR") });
  audit("활동확인서 템플릿 업로드", file.name);
  saveState();
  toast("활동확인서 템플릿을 저장했습니다.");
  render();
}

async function readRows(file) {
  if (globalThis.XLSX && /\.(xlsx|xls)$/i.test(file.name)) {
    const workbook = globalThis.XLSX.read(await file.arrayBuffer(), { type: "array" });
    return globalThis.XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]], { defval: "" });
  }
  return parseCsv(await file.text());
}

async function readCellValues(file) {
  if (globalThis.XLSX && /\.(xlsx|xls)$/i.test(file.name)) {
    const workbook = globalThis.XLSX.read(await file.arrayBuffer(), { type: "array" });
    return globalThis.XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]], { header: 1, defval: "" }).flat();
  }
  return (await file.text()).split(/[\n,;\t]/g);
}

function parseCsv(text) {
  const lines = text.trim().split(/\r?\n/);
  const headers = (lines.shift() || "").split(",").map((item) => item.trim());
  return lines.map((line) => {
    const cells = line.split(",");
    return Object.fromEntries(headers.map((header, index) => [header, cells[index] || ""]));
  });
}

function pick(row, keys) {
  const map = new Map(Object.entries(row || {}).map(([key, value]) => [normalizeKey(key), String(value || "").trim()]));
  for (const key of keys) {
    const value = row[key] || map.get(normalizeKey(key));
    if (value) return String(value).trim();
  }
  return "";
}

function selectedEvent() {
  return state.events.find((event) => event.id === state.selectedEventId) || state.events[0];
}

function worksForSelected() {
  const event = selectedEvent();
  return event ? state.submissions.filter((work) => work.eventId === event.id) : [];
}

function eventCard(event) {
  return `<button class="event-card ${event.id === state.selectedEventId ? "selected" : ""}" data-event-id="${event.id}" type="button"><span class="pill">${event.status}</span><h3>${escapeHtml(event.title)}</h3><p>${event.type} · 목표 ${event.targetWorks || 0}편</p></button>`;
}

function teacherEventCard(event) {
  return `<article class="event-card"><span class="pill">${event.type}</span><h3>${escapeHtml(event.title)}</h3><p>${escapeHtml(event.contestPeriod || "기간 미입력")}</p><p>${escapeHtml(event.theme || "주제 미입력")}</p><button class="primary" type="button">신청하기</button></article>`;
}

function eventRow(event) {
  return `<button class="event-row" data-event-id="${event.id}" type="button"><strong>${escapeHtml(event.title)}</strong><span>${event.type} · ${event.status}</span></button>`;
}

function actionGrid() {
  return `<div class="grid three">${info("신청/선정", "대기", "신청 접수 후 선정 처리")}${info("출품 확인", "엑셀 업로드", "소속/팀명 기준 분석")}${info("활동확인서", "대기", "최종 승인 후 발급")}</div>`;
}

function worksTable(works) {
  if (!works.length) return emptyBox("아직 업로드된 출품 엑셀이 없습니다.", "파일을 업로드하면 작품 목록이 표시됩니다.");
  return `<div class="table-wrap"><table><thead><tr><th>소속/팀명</th><th>작품명</th><th>감독/출품자</th><th>평점</th><th>수상결과</th><th>매칭</th></tr></thead><tbody>${works.map((work) => `<tr><td>${escapeHtml(work.affiliation)}</td><td>${work.url ? `<a href="${escapeHtml(work.url)}" target="_blank" rel="noreferrer">${escapeHtml(work.title || "작품 링크")}</a>` : escapeHtml(work.title || "-")}</td><td>${escapeHtml(work.student || "-")}</td><td>${escapeHtml(work.score || "-")}</td><td>${escapeHtml(work.result || "-")}</td><td>${work.matchStatus}</td></tr>`).join("")}</tbody></table></div>`;
}

function stat(label, value, text) {
  return `<div class="stat"><span>${label}</span><strong>${value}</strong><small>${text}</small></div>`;
}

function info(label, value, text) {
  return `<article class="mini-card"><strong>${label}</strong><p>${value}</p><small>${text}</small></article>`;
}

function emptyBox(title, text) {
  return `<div class="empty-state"><strong>${title}</strong><p>${text}</p></div>`;
}

function audit(action, detail) {
  state.audit.unshift({ action, detail, date: new Date().toISOString() });
}

function toast(message) {
  const el = document.querySelector("#toast");
  el.textContent = message;
  el.classList.add("show");
  setTimeout(() => el.classList.remove("show"), 2200);
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[char]);
}

function normalizeKey(value) {
  return String(value || "").replace(/\s/g, "").toLowerCase();
}

document.querySelectorAll("[data-role]").forEach((button) => {
  button.addEventListener("click", () => {
    state.role = button.dataset.role;
    state.page = state.role === "admin" ? "adminDashboard" : "teacherDashboard";
    saveState();
    render();
  });
});

document.querySelectorAll(".nav button").forEach((button) => {
  button.addEventListener("click", () => {
    state.page = button.dataset.page;
    saveState();
    render();
  });
});

document.querySelector("#eventSelect").addEventListener("change", (event) => {
  state.selectedEventId = event.target.value;
  saveState();
  render();
});

document.querySelector("#resetDemoBtn").addEventListener("click", () => {
  if (!confirm("현재 브라우저에 저장된 테스트 데이터를 모두 초기화할까요?")) return;
  localStorage.removeItem(STORAGE_KEY);
  state = emptyState();
  toast("초기화되었습니다.");
  render();
});

render();
