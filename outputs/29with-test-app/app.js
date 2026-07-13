const initialState = () => ({
  role: "admin",
  page: "adminDashboard",
  selectedEventId: "e1",
  selectedTeacherParticipationId: "p1",
  selectedApplicationIds: [],
  filters: {
    applications: "",
    members: "",
    submissions: ""
  },
  teacherProfile: {
    schoolName: "방학중학교",
    teacherName: "김하늘",
    email: "teacher@school.kr",
    phone: "010-1234-5678",
    verificationDoc: "교직원 확인증.pdf",
    editMode: false,
    trustStatus: "성실 참여",
    history: { applications: 4, selected: 3, completed: 3, missed: 0 }
  },
  events: [
    {
      id: "e1",
      title: "제13회 박카스 29초영화제",
      type: "29초영화제",
      status: "모집중",
      deadlineLabel: "D-5",
      externalKey: "festival_2026_bacchus_13",
      homepageUrl: "https://29sfilm.example/bacchus",
      submissionUrl: "https://29sfilm.example/submit/bacchus",
      adminUrl: "/external/admin/submissions/festival_2026_bacchus_13",
      posterUrl: "https://dummyimage.com/420x594/edf2ff/24315f&text=Bacchus+29s+Film",
      applicationPeriod: "2026.04.08 - 2026.05.21",
      contestPeriod: "2026.04.08 - 2026.05.21",
      totalPrize: "총상금 2,000만원",
      theme: "나를 깨우는 순간",
      organizerNotice: "박카스 브랜드 메시지를 29초 안에 담아내는 영화제입니다. 꿈프 선정 학교는 출품 소속명을 학교명과 정확히 일치시켜야 합니다.",
      targetWorks: 12,
      selectedSchools: 2,
      expectedWorks: 10,
      confirmedWorks: 7,
      needsAction: 3,
      closed: false
    },
    {
      id: "e2",
      title: "제1회 동반성장 29역숏폼왕",
      type: "29역숏폼왕",
      status: "모집중",
      deadlineLabel: "D-12",
      externalKey: "shortform_2026_growth_01",
      homepageUrl: "https://shortform.example/growth",
      submissionUrl: "https://shortform.example/submit/growth",
      adminUrl: "/external/admin/submissions/shortform_2026_growth_01",
      posterUrl: "https://dummyimage.com/420x594/eafaf0/145c36&text=Growth+Shortform",
      applicationPeriod: "2026.06.01 - 2026.07.10",
      contestPeriod: "2026.06.01 - 2026.07.10",
      totalPrize: "총상금 1,000만원",
      theme: "함께 성장하는 우리",
      organizerNotice: "사회적 가치와 동반성장을 주제로 숏폼 영상을 제작합니다. 출품 시 팀명을 꿈프 신청 학교명과 동일하게 입력해 주세요.",
      targetWorks: 8,
      selectedSchools: 1,
      expectedWorks: 3,
      confirmedWorks: 0,
      needsAction: 3,
      closed: false
    },
    {
      id: "e3",
      title: "간단요리사 29역숏폼왕",
      type: "29역숏폼왕",
      status: "심사반영",
      deadlineLabel: "마감",
      externalKey: "shortform_2026_cook_01",
      homepageUrl: "https://shortform.example/cook",
      submissionUrl: "https://shortform.example/submit/cook",
      adminUrl: "/external/admin/submissions/shortform_2026_cook_01",
      posterUrl: "https://dummyimage.com/420x594/fff4e6/7a3d00&text=Simple+Cook+Shortform",
      applicationPeriod: "2026.05.01 - 2026.06.12",
      contestPeriod: "2026.05.01 - 2026.06.12",
      totalPrize: "총상금 500만원",
      theme: "간단하지만 특별한 요리",
      organizerNotice: "일상 속 간단한 요리 아이디어를 숏폼으로 소개하는 행사입니다.",
      targetWorks: 36,
      selectedSchools: 0,
      expectedWorks: 0,
      confirmedWorks: 0,
      needsAction: 0,
      closed: false
    }
  ],
  applications: [
    { id: "a1", eventId: "e1", school: "방학중학교", affiliation: "방학중학교", teacher: "김하늘", email: "teacher@school.kr", expected: 5, date: "2026.05.18", trust: "성실 참여", order: 1, status: "선정" },
    { id: "a2", eventId: "e1", school: "서울고등학교", affiliation: "서울고등학교", teacher: "박민수", email: "park@school.kr", expected: 5, date: "2026.05.19", trust: "확인 필요 이력", order: 2, status: "선정" },
    { id: "a3", eventId: "e1", school: "한빛고등학교", affiliation: "한빛고등학교", teacher: "정유진", email: "jung@school.kr", expected: 8, date: "2026.05.21", trust: "첫 참여", order: 3, status: "예비" },
    { id: "a4", eventId: "e1", school: "푸른중학교", affiliation: "푸른중학교", teacher: "이소라", email: "lee@school.kr", expected: 2, date: "2026.05.14", trust: "첫 참여", order: 4, status: "신청접수" },
    { id: "a5", eventId: "e2", school: "방학중학교", affiliation: "방학중학교", teacher: "김하늘", email: "teacher@school.kr", expected: 3, date: "2026.06.02", trust: "성실 참여", order: 1, status: "선정" }
  ],
  schools: [
    { school: "방학중학교", teacher: "김하늘", email: "teacher@school.kr", history: "신청 4 · 선정 3 · 완료 3 · 미이행 0", memo: "응답 빠름, 출품명 정확" },
    { school: "서울고등학교", teacher: "박민수", email: "park@school.kr", history: "신청 2 · 선정 2 · 완료 1 · 미이행 1", memo: "공백 차이 자주 발생" },
    { school: "한빛고등학교", teacher: "정유진", email: "jung@school.kr", history: "신청 1 · 선정 1 · 완료 1 · 미이행 0", memo: "학생 이름 확인 필요" }
  ],
  submissions: [
    {
      id: "p1",
      eventId: "e1",
      school: "방학중학교",
      affiliation: "방학중학교",
      requested: 5,
      couponCode: "ABC-0001",
      snackStatus: "지급 예정",
      snackDate: "2026-07-15",
      certificate: "관리자 확인 중",
      score: "발표 후 제공",
      works: [
        { title: "똑같은 고민, 달라진 속도", student: "강하은", url: "https://29sfilm.example/w/1", status: "자동확인", preliminaryScore: 9.2, rank: 1, finalRound: "진출" },
        { title: "달라진 교실", student: "김희야", url: "https://29sfilm.example/w/2", status: "자동확인", preliminaryScore: 8.7, rank: 2, finalRound: "-" },
        { title: "내일의 속도", student: "노유림", url: "https://29sfilm.example/w/3", status: "자동확인", preliminaryScore: 8.1, rank: 3, finalRound: "-" },
        { title: "비 오는 운동장", student: "이다은", url: "https://29sfilm.example/w/4", status: "자동확인", preliminaryScore: 7.8, rank: 4, finalRound: "-" },
        { title: "", student: "", url: "", status: "미확인", preliminaryScore: null, rank: null, finalRound: "-" }
      ]
    },
    {
      id: "p2",
      eventId: "e1",
      school: "서울고등학교",
      affiliation: "서울고등학교",
      requested: 5,
      couponCode: "ABC-0002",
      snackStatus: "검토 중",
      snackDate: "",
      certificate: "발급 전",
      score: "발표 후 제공",
      works: [
        { title: "우리들의 여름", student: "최도윤", url: "https://29sfilm.example/w/11", status: "수동확인", preliminaryScore: 8.9, rank: 1, finalRound: "진출" },
        { title: "골목 끝에서", student: "윤지후", url: "https://29sfilm.example/w/12", status: "자동확인", preliminaryScore: 7.4, rank: 2, finalRound: "-" },
        { title: "종례 후", student: "김민재", url: "https://29sfilm.example/w/13", status: "자동확인", preliminaryScore: 6.9, rank: 3, finalRound: "-" }
      ]
    },
    {
      id: "p3",
      eventId: "e2",
      school: "방학중학교",
      affiliation: "방학중학교",
      requested: 3,
      couponCode: "ABC-0003",
      snackStatus: "지급 일정 확인 중",
      snackDate: "",
      certificate: "발급 전",
      score: "발표 후 제공",
      works: [
        { title: "", student: "", url: "", status: "미확인", preliminaryScore: null, rank: null, finalRound: "" },
        { title: "", student: "", url: "", status: "미확인", preliminaryScore: null, rank: null, finalRound: "" },
        { title: "", student: "", url: "", status: "미확인", preliminaryScore: null, rank: null, finalRound: "" }
      ]
    }
  ],
  mails: [
    { id: "m1", eventId: "e1", type: "D-5 출품 안내", subject: "[29 WITH] 출품 마감 D-5 안내", sender: "29 WITH <no-reply@29with.kr>", scheduledAt: "2026-05-16 10:00", recipients: 28, status: "예약" },
    { id: "m2", eventId: "e1", type: "선정 안내", subject: "[29 WITH] 꿈프 선정 안내", sender: "29 WITH <no-reply@29with.kr>", scheduledAt: "2026-04-05 10:00", recipients: 28, status: "발송완료" },
    { id: "m3", eventId: "e1", type: "활동확인서 발급", subject: "[29 WITH] 활동확인서 다운로드 안내", sender: "29 WITH <no-reply@29with.kr>", scheduledAt: "승인 후", recipients: 0, status: "조건대기" }
  ],
  requests: [
    { id: "r1", eventId: "e1", school: "서울고등학교", type: "작품 확인", message: "학생 1명이 출품했는데 확인되지 않습니다.", status: "접수" },
    { id: "r2", eventId: "e1", school: "방학중학교", type: "활동확인서 수정", message: "학생 이름 표기를 확인하고 싶습니다.", status: "접수" }
  ],
  coupons: [
    { code: "ABC-0001", status: "지급완료", school: "방학중학교" },
    { code: "ABC-0002", status: "지급완료", school: "서울고등학교" },
    { code: "ABC-0003", status: "지급완료", school: "방학중학교" },
    { code: "ABC-0004", status: "미사용", school: "" }
  ],
  certificateTemplate: {
    name: "기본 활동확인서 템플릿",
    status: "등록 완료",
    updatedAt: "2026.07.01"
  },
  integrationSettings: {
    e1: { dbType: "29초영화제 엑셀", accessStatus: "엑셀 업로드 사용", requiredFields: "소속, 작품제목, 감독, 예심평점, 수상결과", host: "", lastTest: "미실행" },
    e2: { dbType: "29역숏폼왕 엑셀", accessStatus: "엑셀 업로드 사용", requiredFields: "소속, 제목, 출품자, 원본URL, 평점", host: "", lastTest: "미실행" },
    e3: { dbType: "29역숏폼왕 엑셀", accessStatus: "엑셀 업로드 사용", requiredFields: "소속, 제목, 출품자, 원본URL, 평점", host: "", lastTest: "미실행" }
  },
  adminPreferences: {
    senderName: "29 WITH 운영팀",
    senderEmail: "no-reply@29with.kr",
    signupNotice: "회원가입 시 업무용 이메일 사용을 권장합니다."
  },
  admins: [
    { id: "admin1", name: "메인 관리자", email: "29sfilm@gmail.com", role: "메인 관리자", status: "활성" },
    { id: "admin2", name: "꿈프 운영자", email: "dream@29with.kr", role: "운영 관리자", status: "활성" }
  ],
  mailTemplates: [
    { id: "t1", name: "모집 안내", subject: "[29 WITH] 꿈프 참여 신청 안내", sender: "29 WITH <no-reply@29with.kr>", body: "꿈프 참여 신청이 시작되었습니다. 신청 전 출품 소속명/팀명을 정확히 확인해 주세요." },
    { id: "t2", name: "D-5 출품 안내", subject: "[29 WITH] 출품 마감 D-5 안내", sender: "29 WITH <no-reply@29with.kr>", body: "출품 마감이 다가오고 있습니다. 학생 출품 현황을 확인해 주세요." },
    { id: "t3", name: "활동확인서 발급", subject: "[29 WITH] 활동확인서 다운로드 안내", sender: "29 WITH <no-reply@29with.kr>", body: "최종 출품 리스트가 승인되어 활동확인서 다운로드가 가능합니다." }
  ],
  audit: []
});

let state = loadState();

function loadState() {
  try {
    return migrateState(JSON.parse(localStorage.getItem("with29State")) || initialState());
  } catch {
    return migrateState(initialState());
  }
}

function migrateState(savedState) {
  const base = initialState();
  const next = {
    ...base,
    ...savedState,
    teacherProfile: { ...base.teacherProfile, ...(savedState.teacherProfile || {}) },
    filters: { ...base.filters, ...(savedState.filters || {}) },
    adminPreferences: { ...base.adminPreferences, ...(savedState.adminPreferences || {}) },
    integrationSettings: { ...base.integrationSettings, ...(savedState.integrationSettings || {}) },
    excelImports: savedState.excelImports || {},
    selectedApplicationIds: savedState.selectedApplicationIds || []
  };
  const eventDefaultsById = Object.fromEntries(base.events.map((event) => [event.id, event]));
  next.events = (savedState.events || base.events).map((event) => {
    const defaults = eventDefaultsById[event.id] || {};
    return {
      posterUrl: "https://dummyimage.com/420x594/edf2ff/24315f&text=29+WITH",
      applicationPeriod: event.contestPeriod || event.deadlineLabel || "",
      contestPeriod: event.deadlineLabel || "",
      totalPrize: "총상금 추후 공지",
      theme: "주제 추후 공지",
      organizerNotice: "행사 안내사항을 확인해 주세요.",
      ...defaults,
      ...event
    };
  });
  next.teacherProfile.phone = next.teacherProfile.phone || "";
  next.teacherProfile.verificationDoc = next.teacherProfile.verificationDoc || "";
  next.teacherProfile.editMode = Boolean(next.teacherProfile.editMode);
  next.mails = savedState.mails || base.mails || [];
  next.requests = savedState.requests || base.requests || [];
  next.submissions = savedState.submissions || base.submissions || [];
  next.applications = savedState.applications || base.applications || [];
  next.schools = savedState.schools || base.schools || [];
  next.coupons = savedState.coupons || base.coupons || [];
  next.admins = savedState.admins || base.admins || [];
  next.mailTemplates = savedState.mailTemplates || base.mailTemplates || [];
  next.audit = savedState.audit || [];
  return next;
}

function saveState() {
  localStorage.setItem("with29State", JSON.stringify(state));
}

function currentEvent() {
  return state.events.find((event) => event.id === state.selectedEventId) || state.events[0];
}

function eventApplications() {
  return state.applications.filter((item) => item.eventId === state.selectedEventId);
}

function eventParticipations() {
  return state.submissions.filter((item) => item.eventId === state.selectedEventId);
}

function teacherParticipations() {
  return state.submissions.filter((item) => item.school === state.teacherProfile.schoolName);
}

function currentTeacherParticipation() {
  const projects = teacherParticipations();
  return projects.find((item) => item.id === state.selectedTeacherParticipationId) || projects[0];
}

function matchesSearch(values, query) {
  const normalized = String(query || "").trim().toLowerCase();
  if (!normalized) return true;
  return values.some((value) => String(value || "").toLowerCase().includes(normalized));
}

function refreshEventStats(eventId) {
  const event = state.events.find((item) => item.id === eventId);
  if (!event) return;
  const rows = state.submissions.filter((item) => item.eventId === eventId);
  event.selectedSchools = rows.length;
  event.expectedWorks = rows.reduce((sum, item) => sum + item.requested, 0);
  event.confirmedWorks = rows.reduce((sum, item) => sum + item.works.filter(isConfirmedWork).length, 0);
  event.needsAction = Math.max(event.expectedWorks - event.confirmedWorks, 0);
}

function isConfirmedWork(work) {
  return work.status === "자동확인" || work.status === "수동확인";
}

function isPendingMatch(work) {
  return work.status === "확인필요" || work.status === "관리자확인중";
}

function badge(value) {
  const map = {
    선정: "ok",
    성실: "ok",
    "성실 참여": "ok",
    완료: "ok",
    발송완료: "ok",
    자동확인: "ok",
    수동확인: "warn",
    확인필요: "warn",
    예약: "warn",
    예비: "warn",
    접수: "warn",
    신청접수: "warn",
    미확인: "bad",
    실패: "bad",
    미선정: "bad",
    조건대기: "info",
    "검토 중": "info",
    "관리자 확인 중": "info"
  };
  const key = Object.keys(map).find((name) => String(value).includes(name));
  return `<span class="badge ${key ? map[key] : "info"}">${value}</span>`;
}

function setRole(role) {
  state.role = role;
  state.page = role === "admin" ? "adminDashboard" : "teacherDashboard";
  if (role === "teacher" && !currentTeacherParticipation()) {
    state.selectedTeacherParticipationId = teacherParticipations()[0]?.id || "";
  }
  saveState();
  render();
}

function setPage(page) {
  state.page = page;
  saveState();
  render();
}

function setEvent(eventId) {
  state.selectedEventId = eventId;
  if (state.role === "teacher") {
    const matched = teacherParticipations().find((item) => item.eventId === eventId);
    if (matched) {
      state.selectedTeacherParticipationId = matched.id;
    }
  }
  saveState();
  render();
}

function audit(action, entity) {
  state.audit.unshift({
    action,
    entity,
    at: new Date().toLocaleString("ko-KR")
  });
}

function toast(message) {
  const node = document.querySelector("#toast");
  node.textContent = message;
  node.classList.add("show");
  setTimeout(() => node.classList.remove("show"), 1800);
}

function downloadMockFile(filename, content) {
  if (typeof Blob === "undefined" || typeof URL === "undefined" || !document.createElement) {
    toast(`${filename} 다운로드 파일이 생성되었습니다.`);
    return;
  }
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(link.href);
  toast(`${filename} 다운로드를 시작했습니다.`);
}

function openModal(title, body, actions = []) {
  document.querySelector("#modalTitle").textContent = title;
  document.querySelector("#modalBody").innerHTML = body;
  document.querySelector("#modalActions").innerHTML = actions.map((action, index) => {
    const cls = action.danger ? "danger" : action.primary ? "primary" : "secondary";
    return `<button class="${cls}" data-modal-action="${index}" value="default" type="button">${action.label}</button>`;
  }).join("");
  document.querySelectorAll("[data-modal-action]").forEach((button) => {
    const action = actions[Number(button.dataset.modalAction)];
    button.addEventListener("click", () => {
      const result = action.onClick ? action.onClick() : undefined;
      if (result === false) return;
      document.querySelector("#modal").close();
      saveState();
      render();
    });
  });
  document.querySelector("#modal").showModal();
}

function confirmAction(title, body, onConfirm, confirmLabel = "실행") {
  openModal(title, body, [
    { label: "취소" },
    { label: confirmLabel, primary: true, onClick: onConfirm }
  ]);
}

function cardStat(label, value, extra = "") {
  return `<div class="stat"><span>${label}</span><strong>${value}</strong>${extra ? `<small class="muted">${extra}</small>` : ""}</div>`;
}

function renderAdminDashboard() {
  const totalActions = state.events.reduce((sum, event) => sum + event.needsAction, 0);
  const event = currentEvent();
  const selectedParticipations = eventParticipations();
  const selectedApplications = eventApplications();
  const confirmedSchools = selectedParticipations.filter((item) => item.works.some(isConfirmedWork)).length;
  const pendingReview = selectedParticipations.reduce((sum, item) => sum + item.works.filter(isPendingMatch).length, 0);
  const pendingApplications = selectedApplications.filter((app) => app.status === "신청접수").length;
  const reservedMails = state.mails.filter((mail) => mail.eventId === event.id && mail.status === "예약").length;
  return `
    <div class="grid four">
      ${cardStat("진행 중인 꿈프", state.events.filter((event) => !event.closed).length)}
      ${cardStat("처리 필요", `${totalActions}건`)}
      ${cardStat("예약 메일", state.mails.filter((mail) => mail.status === "예약").length)}
      ${cardStat("문의/요청", state.requests.filter((request) => request.status !== "완료").length)}
    </div>
    <section class="panel">
      <div class="panel-head">
        <div><h2>진행 중인 꿈프</h2><p class="muted">행사를 선택하면 모든 관리자 메뉴가 해당 행사 기준으로 바뀝니다.</p></div>
        <div class="modal-actions compact-actions">
          <button class="secondary" data-page="workbox" type="button">작업함 보기</button>
          <button class="primary" data-action="create-event" type="button">새 행사 등록</button>
        </div>
      </div>
      <div class="grid three">
        ${state.events.map((event) => `
          <button class="card event-card ${event.id === state.selectedEventId ? "active" : ""}" data-select-event="${event.id}" type="button">
            <div class="card-top">
              <div>
                <h3>${event.title}</h3>
                <p class="muted">${event.type} · ${event.status} · ${event.deadlineLabel}</p>
              </div>
              ${badge(event.needsAction ? `처리 ${event.needsAction}건` : "정상")}
            </div>
            <div class="stats">
              ${cardStat("선정", `${event.selectedSchools}교`)}
              ${cardStat("출품", `${event.confirmedWorks}/${event.expectedWorks}`)}
              ${cardStat("행사 식별값", event.externalKey ? "등록" : "필요")}
            </div>
          </button>
        `).join("")}
      </div>
    </section>
    <section class="panel">
      <div class="panel-head">
        <div>
          <h2>${event.title}</h2>
          <p class="muted">${event.type} · ${event.status} · ${event.deadlineLabel} · 목표 ${event.targetWorks || 0}편</p>
        </div>
        <div class="modal-actions compact-actions">
          <button class="secondary" data-page="eventOps" type="button">행사 정보 수정</button>
          <button class="secondary" data-page="applications" type="button">신청/선정</button>
          <button class="secondary" data-page="submissions" type="button">출품 확인</button>
          <button class="primary" data-page="workbox" type="button">처리할 일 보기</button>
        </div>
      </div>
      <div class="grid four">
        ${cardStat("신청 접수", `${pendingApplications}건`, "선정 전")}
        ${cardStat("선정 학교", `${event.selectedSchools}교`, `신청 작품 ${event.expectedWorks}편`)}
        ${cardStat("출품 확인", `${event.confirmedWorks}편`, `${confirmedSchools}교 확인됨`)}
        ${cardStat("확인 필요", `${pendingReview + event.needsAction}건`, `예약 메일 ${reservedMails}건`)}
      </div>
      <div class="quick-list">
        <div><strong>다음 추천 작업</strong><span>${pendingApplications ? "신청/선정에서 접수 학교를 검토하세요." : pendingReview ? "출품 확인에서 유사 매칭 후보를 수동 확인하세요." : event.needsAction ? "작업함에서 남은 처리 건을 확인하세요." : "현재 급한 처리 건이 없습니다."}</span></div>
        <div><strong>출품 엑셀 기준</strong><span>학교명과 엑셀 소속이 완전 일치하면 자동확인, 유사 일치는 확인 필요입니다.</span></div>
      </div>
    </section>
    <section class="panel">
      <div class="panel-head"><h2>최근 작업 이력</h2><span>모든 관리자 작업 저장</span></div>
      ${renderAudit()}
    </section>
  `;
}

function renderWorkbox() {
  const event = currentEvent();
  const missingSchools = eventParticipations()
    .map((item) => {
      const confirmed = item.works.filter(isConfirmedWork).length;
      return { ...item, missing: Math.max(item.requested - confirmed, 0) };
    })
    .filter((item) => item.missing > 0);
  const pendingCertificates = eventParticipations().filter((item) => item.certificate !== "발급 완료");
  const scheduledMails = state.mails.filter((mail) => mail.eventId === event.id && mail.status !== "발송완료");
  const openRequests = state.requests.filter((request) => request.eventId === event.id && request.status !== "완료");
  const items = [
    ...missingSchools.map((item) => ({ type: "출품 확인", title: item.school, detail: `${item.missing}편 미확인`, page: "submissions", priority: "높음" })),
    ...pendingCertificates.map((item) => ({ type: "활동확인서", title: item.school, detail: item.certificate, page: "certificates", priority: "보통" })),
    ...scheduledMails.map((mail) => ({ type: "메일", title: mail.type, detail: `${mail.scheduledAt} · ${mail.status}`, page: "mails", priority: mail.status === "예약" ? "보통" : "낮음" })),
    ...openRequests.map((request) => ({ type: "요청", title: request.school, detail: `${request.type} · ${request.status}`, page: "requests", priority: "높음" }))
  ];
  return `
    <div class="grid four">
      ${cardStat("출품 미확인", `${missingSchools.length}교`)}
      ${cardStat("확인서 대기", `${pendingCertificates.length}건`)}
      ${cardStat("메일 확인", `${scheduledMails.length}건`)}
      ${cardStat("문의/요청", `${openRequests.length}건`)}
    </div>
    <section class="panel">
      <div class="panel-head"><h2>관리자 작업함</h2><span>${event.title} 기준으로 처리할 일만 모아봅니다.</span></div>
      <div class="table-wrap">
        <table>
          <thead><tr><th>구분</th><th>대상</th><th>내용</th><th>우선순위</th><th>이동</th></tr></thead>
          <tbody>
            ${items.length ? items.map((item) => `
              <tr>
                <td>${badge(item.type)}</td>
                <td><strong>${item.title}</strong></td>
                <td>${item.detail}</td>
                <td>${badge(item.priority)}</td>
                <td><button class="secondary" data-page="${item.page}" type="button">열기</button></td>
              </tr>
            `).join("") : `<tr><td colspan="5"><div class="empty">현재 선택된 꿈프에 처리할 작업이 없습니다.</div></td></tr>`}
          </tbody>
        </table>
      </div>
    </section>
  `;
}

function renderEventOps() {
  const event = currentEvent();
  const steps = [
    ["행사 등록", "완료", "포스터, 기간, URL, 목표 작품 수 입력"],
    ["꿈프 모집 시작", event.status === "모집중" ? "완료" : "대기", "신청 버튼 활성화와 모집 메일 예약"],
    ["신청/선정", "진행 중", "선착순, 성실 참여 우선, 미이행 이력 후순위"],
    ["출품 엑셀 확인", event.confirmedWorks ? "진행 중" : "대기", "관리자 엑셀 업로드와 학교명/소속 매칭"],
    ["최종 리스트 승인", "대기", "출품 마감 후 관리자 승인"],
    ["활동확인서/심사표", "대기", "PDF 생성 후 안내 메일"],
    ["종료", event.closed ? "완료" : "대기", "히스토리 저장과 참여 이력 반영"]
  ];
  return `
    <div class="toolbar">
      <button class="primary" data-action="create-event" type="button">새 행사 등록</button>
      <button class="secondary" data-page="adminDashboard" type="button">대시보드로 돌아가기</button>
    </div>
    <div class="grid two">
      <section class="panel">
        <div class="panel-head"><h2>${event.title}</h2>${badge(`${event.type} · ${event.status}`)}</div>
        <div class="form-grid">
          <label>행사명<input id="eventTitleInput" value="${event.title}" /></label>
          <label>행사 유형
            <select id="eventTypeInput">
              <option ${event.type === "29초영화제" ? "selected" : ""}>29초영화제</option>
              <option ${event.type === "29역숏폼왕" ? "selected" : ""}>29역숏폼왕</option>
            </select>
          </label>
          <label>출품 마감<input id="eventDeadlineInput" value="${event.deadlineLabel}" /></label>
          <label>목표 작품 수<input id="eventTargetWorksInput" type="number" min="0" value="${event.targetWorks || 0}" /></label>
          <label>행사 식별값<input id="eventExternalKeyInput" value="${event.externalKey}" /></label>
          <label>공모기간<input id="eventContestPeriodInput" value="${event.contestPeriod || ""}" /></label>
          <label>총상금<input id="eventTotalPrizeInput" value="${event.totalPrize || ""}" /></label>
          <label class="wide">주제<input id="eventThemeInput" value="${event.theme || ""}" /></label>
          <label class="wide">포스터 URL<input id="eventPosterUrlInput" value="${event.posterUrl || ""}" /></label>
          <label>홈페이지 URL<input id="eventHomepageUrlInput" value="${event.homepageUrl || ""}" /></label>
          <label>출품 URL<input id="eventSubmissionUrlInput" value="${event.submissionUrl || ""}" /></label>
          <label class="wide">안내사항<textarea id="eventOrganizerNoticeInput">${event.organizerNotice || ""}</textarea></label>
          <label class="wide">출품작 엑셀 출처 메모<input id="eventAdminUrlInput" value="${event.adminUrl || `${event.type} 관리자 엑셀`}" /></label>
        </div>
        <div class="modal-actions">
          <button class="secondary" data-action="mail-preview" type="button">모집 메일 확인</button>
          <button class="secondary" data-action="save-event" type="button">행사 저장</button>
          <button class="secondary danger" data-action="deactivate-event" type="button">비활성화</button>
          <button class="primary" data-action="start-recruitment" type="button">꿈프 모집 시작</button>
        </div>
      </section>
      <section class="panel">
        <div class="panel-head"><h2>운영 단계</h2><span>현재 단계 기준으로 다음 버튼만 강조</span></div>
        <div class="step-list">
          ${steps.map((step, index) => `
            <div class="step">
              <div class="step-number">${index + 1}</div>
              <div><strong>${step[0]}</strong><p class="muted">${step[2]}</p></div>
              ${badge(step[1])}
            </div>
          `).join("")}
        </div>
      </section>
    </div>
  `;
}

function renderApplications() {
  const event = currentEvent();
  const query = state.filters.applications || "";
  const allRows = eventApplications();
  const rows = selectionRankedApplications(allRows.filter((app) => matchesSearch([app.school, app.affiliation, app.teacher, app.email, app.status, app.trust], query)));
  const rankById = new Map(selectionRankedApplications(allRows).map((app, index) => [app.id, index + 1]));
  const selectedWorks = selectedExpectedWorks(event.id);
  const pendingWorks = allRows.filter((app) => app.status === "신청접수" || app.status === "예비").reduce((sum, app) => sum + app.expected, 0);
  const targetWorks = event.targetWorks || event.expectedWorks || 0;
  const overTarget = targetWorks > 0 && selectedWorks + pendingWorks > targetWorks;
  return `
    <div class="grid four">
      ${cardStat("목표 작품 수", `${targetWorks}편`, "관리자 입력 기준")}
      ${cardStat("선정 작품 수", `${selectedWorks}편`, "선정 상태 합계")}
      ${cardStat("대기 작품 수", `${pendingWorks}편`, "신청접수/예비")}
      ${cardStat("목표 초과", overTarget ? `${selectedWorks + pendingWorks - targetWorks}편` : "없음", overTarget ? "신청은 가능, 선정은 검토" : "현재 목표 이내")}
    </div>
    <div class="toolbar">
      <input data-filter="applications" placeholder="학교명, 담당교사, 이메일 검색" value="${query}" />
      <button class="secondary" data-action="mail-preview" type="button">메일 미리보기</button>
      <button class="primary" data-action="select-submitted" type="button">신청접수 선정 처리</button>
      <button class="secondary" data-action="select-recommended" type="button">추천 선정 대상 선택</button>
      <button class="secondary" data-action="select-visible-applications" type="button">현재 목록 선택</button>
      <button class="primary" data-action="bulk-select" type="button">선택 선정</button>
      <button class="secondary" data-action="bulk-wait" type="button">선택 예비</button>
      <button class="secondary" data-action="bulk-reject" type="button">선택 미선정</button>
      <button class="secondary" data-action="bulk-resend" type="button">선택 메일 재발송</button>
      <button class="secondary" data-action="bulk-export" type="button">선택 엑셀</button>
    </div>
    ${overTarget ? `<section class="notice-panel"><strong>목표 작품 수 초과</strong><span>신청은 계속 가능하지만 최종 선정은 운영 상황에 따라 조정될 수 있습니다.</span></section>` : ""}
    <section class="panel">
      <div class="panel-head"><h2>신청/선정</h2><span>기본 선착순, 성실 참여 우선, 미이행 이력 후순위</span></div>
      <div class="table-wrap">
        <table>
          <thead><tr><th>선택</th><th>추천</th><th>신청순번</th><th>학교</th><th>출품 소속명/팀명</th><th>담당자</th><th>예상 작품</th><th>선정 기준</th><th>참여 상태</th><th>목표 영향</th><th>신청 상태</th><th>조치</th></tr></thead>
          <tbody>
            ${rows.length ? rows.map((app) => `
              <tr>
                <td><input type="checkbox" data-application-check="${app.id}" ${state.selectedApplicationIds.includes(app.id) ? "checked" : ""} /></td>
                <td>${rankById.get(app.id)}순위</td>
                <td>${app.order}</td>
                <td><strong>${app.school}</strong><small>${app.email}</small></td>
                <td>${app.affiliation || app.school}</td>
                <td>${app.teacher}</td>
                <td>${app.expected}편</td>
                <td>${selectionReason(app)}</td>
                <td>${badge(app.trust)}</td>
                <td>${targetWorks && selectedWorks + app.expected > targetWorks && app.status !== "선정" ? badge("목표 초과 가능") : "목표 내 검토"}</td>
                <td>${badge(app.status)}</td>
                <td>
                  <button class="secondary" data-select-application="${app.id}" type="button">선정</button>
                  <button class="secondary" data-wait-application="${app.id}" type="button">예비</button>
                </td>
              </tr>
            `).join("") : `<tr><td colspan="12"><div class="empty">검색 결과가 없습니다.</div></td></tr>`}
          </tbody>
        </table>
      </div>
    </section>
  `;
}

function renderMembers() {
  const currentApps = eventApplications();
  const query = state.filters.members || "";
  const rows = state.schools.filter((school) => matchesSearch([school.school, school.teacher, school.email, school.history, school.memo], query));
  return `
    <div class="toolbar">
      <input data-filter="members" placeholder="학교명, 담당교사, 이메일 검색" value="${query}" />
      <button class="secondary" data-action="export-members" type="button">회원/이력 다운로드</button>
      <button class="primary" data-action="request-missing" type="button">확인 요청 작성</button>
    </div>
    <section class="panel">
      <div class="panel-head"><h2>회원/참여 학교</h2><span>학교 단위 이력과 관리자 메모를 누적 관리합니다.</span></div>
      <div class="table-wrap">
        <table>
          <thead><tr><th>학교</th><th>담당교사</th><th>이메일</th><th>현재 신청</th><th>참여 이력</th><th>관리자 메모</th><th>조치</th></tr></thead>
          <tbody>
            ${rows.length ? rows.map((school) => {
              const apps = currentApps.filter((app) => app.school === school.school);
              const duplicate = apps.length > 1;
              return `
                <tr>
                  <td><strong>${school.school}</strong>${duplicate ? `<small>${badge("중복 확인 필요")}</small>` : ""}</td>
                  <td>${school.teacher}</td>
                  <td>${school.email}</td>
                  <td>${apps.length ? apps.map((app) => `${app.affiliation || app.school} · ${app.status}`).join("<br />") : "-"}</td>
                  <td>${school.history}</td>
                  <td>${school.memo}</td>
                  <td><button class="secondary" data-school-memo="${school.school}" type="button">메모 수정</button></td>
                </tr>
              `;
            }).join("") : `<tr><td colspan="7"><div class="empty">검색 결과가 없습니다.</div></td></tr>`}
          </tbody>
        </table>
      </div>
    </section>
  `;
}

function renderSubmissions() {
  const query = state.filters.submissions || "";
  const rows = eventParticipations().filter((item) => matchesSearch([item.school, item.affiliation, item.certificate, item.score, ...item.works.map((work) => `${work.title} ${work.student} ${work.status}`)], query));
  const event = currentEvent();
  const importState = state.excelImports?.[event.id];
  return `
    <div class="grid four">
      ${cardStat("최근 엑셀", importState?.fileName || "업로드 전", importState ? `${importState.importedAt} · ${importState.source || "분석"}` : "행사별 출품작 엑셀 업로드")}
      ${cardStat("자동 매칭", `${importState?.autoMatched || 0}편`, "학교명=소속 완전 일치")}
      ${cardStat("확인 필요", `${importState?.needsReview || 0}편`, "띄어쓰기/1글자 차이 등")}
      ${cardStat("미매칭", `${importState?.unmatched || 0}편`, "후보 없음")}
    </div>
    <div class="toolbar">
      <input data-filter="submissions" placeholder="학교명 또는 출품 소속명/팀명 검색" value="${query}" />
      <input id="submissionExcelInput" type="file" accept=".xls,.xlsx,.csv" />
      <button class="secondary" data-action="upload-submission-excel" type="button">출품 엑셀 분석</button>
      <button class="primary" data-action="request-missing" type="button">미확인 확인 요청</button>
    </div>
    <section class="notice-panel"><strong>매칭 기준</strong><span>꿈프 신청 학교명과 엑셀의 소속이 완전 일치하면 자동 매칭, 띄어쓰기/특수문자/글자 1개 차이는 확인 필요로 분류합니다.</span></section>
    <section class="panel">
      <div class="panel-head"><h2>학교별 출품 확인</h2><span>전체 작품이 아니라 학교 단위로 먼저 확인합니다.</span></div>
      <div class="table-wrap">
        <table>
          <thead><tr><th>학교</th><th>엑셀 소속 기준</th><th>신청</th><th>확정</th><th>확인필요</th><th>미확인</th><th>대표 사유</th><th>최종 승인</th><th>상태</th><th>조치</th></tr></thead>
          <tbody>
            ${rows.length ? rows.map((item) => {
              const confirmed = item.works.filter(isConfirmedWork).length;
              const pending = item.works.filter(isPendingMatch).length;
              const firstMissing = item.works.find((work) => work.status === "미확인" || isPendingMatch(work));
              const missing = Math.max(item.requested - confirmed, 0);
              return `
                <tr class="clickable" data-open-participation="${item.id}">
                  <td><strong>${item.school}</strong></td>
                  <td>${item.school}</td>
                  <td>${item.requested}편</td>
                  <td>${confirmed}편</td>
                  <td>${pending}편</td>
                  <td>${missing}편</td>
                  <td>${firstMissing ? workIssueReason(firstMissing, item) : "확인 완료"}</td>
                  <td>${badge(item.finalApproved ? "승인 완료" : "승인 대기")}</td>
                  <td>${badge(pending ? "확인 필요" : missing ? "미확인" : "완료")}</td>
                  <td>
                    <button class="secondary" data-open-participation="${item.id}" type="button">작품 보기</button>
                    <button class="secondary" data-request-participation="${item.id}" type="button">확인 요청</button>
                    <button class="primary" data-approve-submission="${item.id}" type="button">최종 승인</button>
                  </td>
                </tr>
              `;
            }).join("") : `<tr><td colspan="10"><div class="empty">검색 결과가 없습니다.</div></td></tr>`}
          </tbody>
        </table>
      </div>
    </section>
  `;
}

function renderBenefits() {
  return `
    <div class="grid three">
      ${cardStat("구독권 재고", `${state.coupons.filter((coupon) => coupon.status === "미사용").length}개`, "미사용 쿠폰")}
      ${cardStat("지급 완료", `${state.coupons.filter((coupon) => coupon.status === "지급완료").length}개`, "선정 학교 자동 지급")}
      <div class="stat action-stat"><span>쿠폰 엑셀</span><strong>업로드</strong><button class="secondary" data-action="upload-coupons" type="button">쿠폰 업로드</button></div>
    </div>
    <section class="panel">
      <div class="panel-head"><h2>혜택/지원</h2><span>간식비 지급 예정일은 선생님 대시보드에 표시됩니다.</span></div>
      <div class="table-wrap">
        <table>
          <thead><tr><th>학교</th><th>구독권</th><th>쿠폰번호</th><th>간식비</th><th>예정일</th><th>문구</th><th>조치</th></tr></thead>
          <tbody>
            ${eventParticipations().map((item) => `
              <tr>
                <td><strong>${item.school}</strong></td>
                <td>${badge(item.couponCode ? "지급 완료" : "재고 없음")}</td>
                <td>${item.couponCode || "-"}</td>
                <td>${badge(item.snackStatus)}</td>
                <td>${item.snackDate || "-"}</td>
                <td>${item.snackDate ? "출품 확인 완료 학교 대상으로 순차 지급됩니다." : "일정이 확정되면 안내됩니다."}</td>
                <td><button class="secondary" data-snack="${item.id}" type="button">예정일 입력</button></td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    </section>
  `;
}

function renderCertificates() {
  const rows = eventParticipations();
  return `
    <div class="toolbar">
      <button class="secondary" data-action="upload-template" type="button">확인서 템플릿 업로드</button>
      <span class="muted">현재 템플릿: ${state.certificateTemplate.name} · ${state.certificateTemplate.status} · ${state.certificateTemplate.updatedAt}</span>
    </div>
    <div class="grid two">
      <section class="panel">
        <div class="panel-head"><h2>활동확인서</h2><span>최종 승인 후 PDF 다운로드 가능</span></div>
        <div class="table-wrap">
          <table>
            <thead><tr><th>학교</th><th>작품</th><th>학생 이름</th><th>출품 리스트</th><th>발급 상태</th><th>다음 단계</th><th>조치</th></tr></thead>
            <tbody>
              ${rows.map((item) => {
                const confirmed = item.works.filter(isConfirmedWork);
                const missingNames = confirmed.some((work) => !work.student);
                return `
                  <tr>
                    <td><strong>${item.school}</strong></td>
                    <td>${confirmed.length}편</td>
                    <td>${missingNames ? badge("이름 확인 필요") : "확인 완료"}</td>
                    <td>${badge(item.finalApproved ? "최종 승인" : "승인 대기")}</td>
                    <td>${badge(item.certificate)}</td>
                    <td>${certificateBlockReason(item)}</td>
                    <td>
                      <button class="secondary" data-certificate-preview="${item.id}" type="button">미리보기</button>
                      <button class="primary" ${item.finalApproved && !missingNames ? "" : "disabled"} data-certificate-approve="${item.id}" type="button">승인/PDF</button>
                    </td>
                  </tr>
                `;
              }).join("")}
            </tbody>
          </table>
        </div>
      </section>
      ${certificatePreview(rows[0])}
    </div>
  `;
}

function certificatePreview(item) {
  const works = item?.works.filter(isConfirmedWork) || [];
  return `
    <section class="certificate-preview">
      <span>제 2602 호</span>
      <div class="logo">29</div>
      <h2>활동확인서</h2>
      <p><b>학교:</b> ${item?.school || "학교명"}</p>
      <p><b>작품명:</b> ${works.map((work) => work.title).filter(Boolean).join(", ") || "작품명"}</p>
      <p><b>이름:</b> ${works.map((work) => work.student).filter(Boolean).join(", ") || "학생명"}</p>
      <p>위 학생은 2026년 4월 8일부터 2026년 5월 21일까지<br />영상 꿈나무 양성 프로젝트에서 성실히 활동하였기에 이 증서를 수여합니다.</p>
      <strong>2026. 7. 1.</strong>
    </section>
  `;
}

function renderScores() {
  const event = currentEvent();
  const allWorks = eventParticipations().flatMap((item) => item.works.filter(isConfirmedWork).map((work) => ({ item, work })));
  const publishedCount = eventParticipations().filter((item) => item.score === "공개 완료").length;
  return `
    <div class="grid four">
      ${cardStat("확인 작품", `${allWorks.length}편`)}
      ${cardStat("심사표 공개", `${publishedCount}교`, "학교별 공개 상태")}
      ${cardStat("행사 유형", event.type)}
      ${cardStat("본심 표시", event.type === "29초영화제" ? "사용" : "미사용")}
    </div>
    <div class="toolbar">
      <button class="secondary" data-action="sync-scores" type="button">심사 결과 반영</button>
      <button class="primary" data-action="publish-scores" type="button">심사표 공개 메일 예약</button>
    </div>
    <section class="panel">
      <div class="panel-head"><h2>심사 결과</h2><span>${event.type === "29역숏폼왕" ? "본심 여부 미표시" : "1차통과는 본심 진출로 표시"}</span></div>
      <div class="table-wrap">
        <table>
          <thead><tr><th>학교</th><th>작품</th><th>감독/출품자</th><th>예심점수/평점</th><th>순위</th>${event.type === "29초영화제" ? "<th>본심</th>" : ""}<th>PDF</th></tr></thead>
          <tbody>
            ${allWorks.map(({ item, work }) => `
              <tr>
                <td><strong>${item.school}</strong></td>
                <td>${work.title}</td>
                <td>${work.student}</td>
                <td>${work.preliminaryScore ?? "-"}</td>
                <td>${work.rank ? `${work.rank}위` : "-"}</td>
                ${event.type === "29초영화제" ? `<td>${badge(work.finalRound || "-")}</td>` : ""}
                <td><button class="secondary" data-action="download-pdf" type="button">PDF</button></td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    </section>
  `;
}

function renderMails() {
  return `
    <div class="toolbar">
      <button class="primary" data-action="add-template" type="button">템플릿 추가</button>
      <span class="muted">예약 메일은 발송 전 제목, 발신자, 발송일시를 수정할 수 있습니다.</span>
    </div>
    <section class="panel">
      <div class="panel-head"><h2>메일/공지</h2><span>발송 전 내용, 시간, 발신자, 수신자 수정 가능</span></div>
      <div class="grid three">
        ${state.mails.filter((mail) => !mail.eventId || mail.eventId === state.selectedEventId).map((mail) => `
          <article class="mail-card">
            <div>${badge(mail.status)} <strong>${mail.type}</strong></div>
            <p>${mail.subject}</p>
            <p class="muted">${mail.sender} · ${mail.scheduledAt} · 수신 ${mail.recipients}명</p>
            <div>
              <button class="secondary" data-mail-edit="${mail.id}" type="button">확인/수정</button>
              <button class="primary" data-mail-send="${mail.id}" type="button">즉시 발송</button>
            </div>
          </article>
        `).join("")}
      </div>
    </section>
    <section class="panel">
      <div class="panel-head"><h2>메일 템플릿</h2><span>D-14, D-10, D-5, D-1 등 단계별 문구 관리</span></div>
      <div class="table-wrap">
        <table>
          <thead><tr><th>템플릿</th><th>제목</th><th>발신자</th><th>본문 요약</th><th>조치</th></tr></thead>
          <tbody>
            ${state.mailTemplates.map((template) => `
              <tr>
                <td><strong>${template.name}</strong></td>
                <td>${template.subject}</td>
                <td>${template.sender}</td>
                <td>${template.body.slice(0, 34)}${template.body.length > 34 ? "..." : ""}</td>
                <td><button class="secondary" data-template-edit="${template.id}" type="button">수정</button></td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    </section>
  `;
}

function renderRequests() {
  return `
    <section class="panel">
      <div class="panel-head"><h2>문의/요청</h2><span>전화/메일 문의를 시스템 요청으로 구조화</span></div>
      <div class="grid three">
        ${state.requests.filter((request) => request.eventId === state.selectedEventId).map((request) => `
          <article class="request-card">
            <div>${badge(request.status)} <strong>${request.type}</strong></div>
            <p><b>${request.school}</b></p>
            <p class="muted">${request.message}</p>
            ${request.reply ? `<p class="reply-note"><b>답변</b> ${request.reply}</p>` : ""}
            <div>
              <button class="secondary" data-request-reply="${request.id}" type="button">답변</button>
              <button class="primary" data-request-done="${request.id}" type="button">처리 완료</button>
            </div>
          </article>
        `).join("")}
      </div>
    </section>
  `;
}

function renderSettings() {
  const event = currentEvent();
  const integration = state.integrationSettings?.[event.id] || {};
  const preferences = state.adminPreferences || {};
  return `
    <div class="grid two">
      <section class="panel">
        <div class="panel-head"><h2>출품 엑셀 설정</h2><span>마지막 점검: ${integration.lastTest || "미실행"}</span></div>
        <div class="form-grid">
          <label>행사 식별값<input id="settingExternalKeyInput" value="${event.externalKey}" /></label>
          <label>행사 유형<input id="settingEventTypeInput" value="${event.type}" /></label>
          <label>엑셀 양식<select id="settingDbTypeInput"><option ${integration.dbType === "29초영화제 엑셀" ? "selected" : ""}>29초영화제 엑셀</option><option ${integration.dbType === "29역숏폼왕 엑셀" ? "selected" : ""}>29역숏폼왕 엑셀</option><option ${integration.dbType === "직접 지정" ? "selected" : ""}>직접 지정</option></select></label>
          <label>업로드 상태<input id="settingAccessStatusInput" value="${integration.accessStatus || "엑셀 업로드 사용"}" /></label>
          <label class="wide">엑셀 출처 메모<input id="settingHostInput" value="${integration.host || ""}" placeholder="예: 관리자 페이지에서 다운로드한 출품작 목록" /></label>
          <label class="wide">필수 필드<input id="settingRequiredFieldsInput" value="${integration.requiredFields || (event.type === "29초영화제" ? "소속, 작품제목, 감독, 예심평점, 수상결과" : "소속, 제목, 출품자, 원본URL, 평점")}" /></label>
        </div>
        <div class="modal-actions"><button class="secondary" data-action="test-connection" type="button">양식 점검</button><button class="primary" data-action="save-settings" type="button">저장</button></div>
      </section>
      <section class="panel">
        <div class="panel-head"><h2>관리자 개인 설정</h2><span>발신자 주소 관리</span></div>
        <div class="form-grid">
          <label>발신자 이름<input id="prefSenderNameInput" value="${preferences.senderName || "29 WITH 운영팀"}" /></label>
          <label>발신자 이메일<input id="prefSenderEmailInput" value="${preferences.senderEmail || "no-reply@29with.kr"}" /></label>
          <label class="wide">업무 메일 안내 문구<input id="prefSignupNoticeInput" value="${preferences.signupNotice || "회원가입 시 업무용 이메일 사용을 권장합니다."}" /></label>
        </div>
        <div class="modal-actions"><button class="secondary" data-action="mail-preview" type="button">발송 미리보기</button><button class="primary" data-action="save-settings" type="button">저장</button></div>
      </section>
    </div>
    <section class="panel">
      <div class="panel-head">
        <div><h2>관리자 계정</h2><p class="muted">메인 관리자는 관리자를 추가하거나 비활성화할 수 있습니다.</p></div>
        <button class="primary" data-action="add-admin" type="button">관리자 추가</button>
      </div>
      <div class="table-wrap">
        <table>
          <thead><tr><th>이름</th><th>이메일</th><th>권한</th><th>상태</th><th>조치</th></tr></thead>
          <tbody>
            ${state.admins.map((admin) => `
              <tr>
                <td><strong>${admin.name}</strong></td>
                <td>${admin.email}</td>
                <td>${admin.role}</td>
                <td>${badge(admin.status)}</td>
                <td><button class="secondary" ${admin.role === "메인 관리자" ? "disabled" : ""} data-admin-toggle="${admin.id}" type="button">${admin.status === "활성" ? "비활성화" : "활성화"}</button></td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    </section>
  `;
}

function renderHistory() {
  const event = currentEvent();
  return `
    <section class="panel">
      <div class="panel-head">
        <div>
          <h2>히스토리</h2>
          <p class="muted">상단 행사 선택 또는 행별 선택 버튼으로 종료할 꿈프를 먼저 지정합니다.</p>
        </div>
        ${badge(`현재 선택: ${event.title}`)}
      </div>
      <section class="notice-panel"><strong>종료 대상</strong><span>${event.title} · ${event.status} · 출품 ${event.confirmedWorks}/${event.expectedWorks}편</span></section>
      <div class="modal-actions compact-actions">
        <button class="secondary" data-page="adminDashboard" type="button">대시보드에서 선택</button>
        <button class="danger" ${event.closed ? "disabled" : ""} data-action="close-event" type="button">${event.title} 종료</button>
      </div>
      <div class="table-wrap">
        <table>
          <thead><tr><th>행사</th><th>상태</th><th>종료일</th><th>선정</th><th>출품</th><th>요약</th><th>처리</th></tr></thead>
          <tbody>
            ${state.events.map((event) => `
              <tr class="${event.id === state.selectedEventId ? "selected-row" : ""}">
                <td><strong>${event.title}</strong></td>
                <td>${badge(event.closed ? "종료" : event.status)}</td>
                <td>${event.closedAt || "-"}</td>
                <td>${event.selectedSchools}교</td>
                <td>${event.confirmedWorks}/${event.expectedWorks}</td>
                <td>${event.closedSummary || "진행 중"}</td>
                <td>
                  <button class="secondary" data-select-event="${event.id}" type="button">${event.id === state.selectedEventId ? "선택됨" : "이 행사 선택"}</button>
                  <button class="secondary" data-history-download="${event.id}" type="button">운영 기록</button>
                </td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    </section>
  `;
}

function renderQaChecklist() {
  const items = [
    ["행사 운영", "행사 생성, 수정, 비활성화, 모집 시작, 목표 작품 수 저장", "eventOps", "행사 운영"],
    ["신청/선정", "선정 추천 기준, 목표 초과 안내, 일괄 선정/예비/미선정, 쿠폰 지급", "applications", "신청/선정"],
    ["출품 확인", "엑셀 업로드 분석, 매칭 실패 사유, 선생님 확인 요청, 수동 매칭, 최종 승인", "submissions", "출품 확인"],
    ["혜택/지원", "구독권 쿠폰, 간식비 지급 예정일, 선생님 혜택 노출", "benefits", "혜택/지원"],
    ["활동확인서", "템플릿 업로드, 승인 전제조건, PDF 발급 가능 상태, 선생님 다운로드 안내", "certificates", "활동확인서"],
    ["심사 결과", "점수 반영, 순위, 29초영화제 본심 여부, 심사표 공개 메일", "scores", "심사 결과"],
    ["메일/공지", "예약 메일 제목/발신자/발송일시/수신자/본문 수정, 템플릿 관리, 즉시 발송", "mails", "메일/공지"],
    ["문의/요청", "선생님 요청 접수, 관리자 답변, 처리 완료, 선생님 답변 확인", "requests", "문의/요청"],
    ["엑셀/관리 설정", "행사별 출품 엑셀 양식 저장, 양식 점검 상태 저장, 관리자 발신자 설정", "settings", "엑셀/관리 설정"],
    ["히스토리", "꿈프 종료, 종료일, 운영 요약, 기록 다운로드", "history", "히스토리"],
    ["선생님 화면", "여러 꿈프 전환, 신청 상태, 작품 입력, 혜택, 문서, 참여 이력, 프로필 변경 요청", "teacherDashboard", "선생님 전환"]
  ];
  return `
    <div class="grid four">
      ${cardStat("관리자 화면", "14개", "대시보드 포함")}
      ${cardStat("선생님 화면", "8개", "다중 꿈프 기준")}
      ${cardStat("검증 흐름", "29개", "자동 검증 기준")}
      ${cardStat("UI 체크", "7개", "반응형/상태 포함")}
    </div>
    <section class="panel">
      <div class="panel-head"><h2>테스트 체크리스트</h2><span>각 항목을 눌러 실제 화면에서 바로 확인합니다.</span></div>
      <div class="qa-list">
        ${items.map((item, index) => `
          <article class="qa-item">
            <div class="step-number">${index + 1}</div>
            <div>
              <strong>${item[0]}</strong>
              <p class="muted">${item[1]}</p>
            </div>
            <button class="secondary" data-page="${item[2]}" type="button">${item[3]}</button>
          </article>
        `).join("")}
      </div>
    </section>
    <section class="panel">
      <div class="panel-head"><h2>완성도 기준</h2><span>실 DB, 도메인, 실제 메일/PDF는 추후 연결 항목으로 분리</span></div>
      <div class="grid three">
        <article class="request-card"><strong>테스트 가능</strong><p class="muted">모든 주요 버튼은 로컬 상태를 변경하고 결과를 화면에서 확인할 수 있습니다.</p></article>
        <article class="request-card"><strong>겹치는 꿈프 대응</strong><p class="muted">관리자/선생님 모두 선택한 행사 기준으로 신청, 출품, 혜택, 문서를 분리합니다.</p></article>
        <article class="request-card"><strong>엑셀 검증 준비</strong><p class="muted">행사별 출품 엑셀 양식과 필수 컬럼을 저장하고 업로드 분석 흐름으로 확인합니다.</p></article>
      </div>
    </section>
  `;
}

function renderTeacherDashboard() {
  const projects = teacherParticipations();
  const applications = state.applications.filter((app) => app.school === state.teacherProfile.schoolName);
  if (!projects.length) {
    return `<section class="panel"><div class="empty">현재 참여 중인 꿈프가 없습니다. 신청 가능한 행사를 확인해 주세요.</div></section>`;
  }
  return `
    <section class="panel">
      <div class="panel-head"><h2>내 대시보드</h2><span>참여 중인 꿈프를 행사별로 분리해 보여줍니다.</span></div>
      <div class="grid two equal-grid">
        ${projects.map((item) => {
          const event = state.events.find((event) => event.id === item.eventId);
          const confirmed = item.works.filter(isConfirmedWork).length;
          const missing = Math.max(item.requested - confirmed, 0);
          return `
            <article class="card equal-card">
              <div class="card-top">
                <div><h3>${event.title}</h3><p class="muted">${event.type} · ${event.deadlineLabel}</p></div>
                ${badge(missing ? "확인 필요" : "정상 진행")}
              </div>
              <div class="stats">
                ${cardStat("신청", `${item.requested}편`)}
                ${cardStat("확인", `${confirmed}편`)}
                ${cardStat("미확인", `${missing}편`)}
              </div>
              <p class="muted">${missing ? "미확인 작품 상태를 확인해 주세요." : "현재 추가로 할 일이 없습니다."}</p>
              <button class="primary" data-teacher-project="${item.id}" type="button">작품 상태 보기</button>
            </article>
          `;
        }).join("")}
      </div>
    </section>
    <section class="panel">
      <div class="panel-head"><h2>내 신청 현황</h2><span>신청, 선정, 예비, 미선정 상태를 행사별로 확인합니다.</span></div>
      <div class="table-wrap">
        <table>
          <thead><tr><th>행사</th><th>출품 소속명/팀명</th><th>예상 작품</th><th>신청 상태</th><th>신청일</th></tr></thead>
          <tbody>
            ${applications.map((app) => {
              const event = state.events.find((item) => item.id === app.eventId);
              return `
                <tr>
                  <td><strong>${event?.title || app.eventId}</strong><small>${event?.type || ""}</small></td>
                  <td>${app.affiliation || app.school}</td>
                  <td>${app.expected}편</td>
                  <td>${badge(app.status)}</td>
                  <td>${app.date}</td>
                </tr>
              `;
            }).join("")}
          </tbody>
        </table>
      </div>
    </section>
  `;
}

function renderTeacherProjectSwitcher() {
  const projects = teacherParticipations();
  if (projects.length <= 1) return "";
  return `
    <section class="project-switcher">
      ${projects.map((item) => {
        const event = state.events.find((row) => row.id === item.eventId);
          const confirmed = item.works.filter(isConfirmedWork).length;
        return `
          <button class="${item.id === state.selectedTeacherParticipationId ? "active" : ""}" data-teacher-project="${item.id}" type="button">
            <strong>${event?.title || item.eventId}</strong>
            <span>${event?.type || ""} · ${confirmed}/${item.requested}편 · ${item.affiliation}</span>
          </button>
        `;
      }).join("")}
    </section>
  `;
}

function renderAvailableEvents() {
  return `
    <section class="panel">
      <div class="panel-head"><h2>신청 가능한 행사</h2><span>모집중인 꿈프만 신청할 수 있습니다.</span></div>
      <div class="grid three">
        ${state.events.map((event) => {
          const existing = state.applications.find((app) => app.eventId === event.id && app.school === state.teacherProfile.schoolName);
          const already = Boolean(existing);
          const canApply = event.status === "모집중" && !event.closed && !already;
          return `
            <article class="card">
              <div class="event-mini-poster">${event.posterUrl ? `<img src="${event.posterUrl}" alt="${event.title} 포스터" />` : `<span>${event.type}</span>`}</div>
              <h3>${event.title}</h3>
              <p class="muted">${event.type} · ${event.status} · ${event.deadlineLabel}</p>
              <div class="detail-stack compact-detail">
                <div class="detail-row"><span>공모기간</span><strong>${event.contestPeriod || event.deadlineLabel}</strong></div>
                <div class="detail-row"><span>주제</span><strong>${event.theme || "주제 확인 중"}</strong></div>
                <div class="detail-row"><span>총상금</span><strong>${event.totalPrize || "추후 공지"}</strong></div>
              </div>
              ${existing ? `<p>${badge(existing.status)} <span class="muted">${existing.affiliation || existing.school} · ${existing.expected}편 신청</span></p>` : ""}
              <div class="modal-actions">
                <button class="secondary" data-event-detail="${event.id}" type="button">자세히 보기</button>
                <button class="primary" ${canApply ? "" : "disabled"} data-apply-event="${event.id}" type="button">${already ? "신청 완료" : event.status === "모집중" ? "신청하기" : "신청 대기"}</button>
              </div>
            </article>
          `;
        }).join("")}
      </div>
    </section>
  `;
}

function renderTeacherWorks() {
  const item = currentTeacherParticipation();
  if (!item) return renderTeacherDashboard();
  const event = state.events.find((event) => event.id === item.eventId);
  return `
    ${renderTeacherProjectSwitcher()}
    <section class="panel">
      <div class="panel-head"><h2>학생/작품 관리</h2><span>${event?.title || ""} · 출품 소속명/팀명: ${item.affiliation}</span></div>
      <div class="work-list">
        ${item.works.map((work, index) => `
          <article class="work-card">
            <div>
              <strong>작품 ${index + 1}. ${work.title || "미확인"}</strong>
              <p class="muted">${work.student || "학생 이름 확인 필요"} · ${work.url || "링크 없음"}</p>
            </div>
            <div>
              ${badge(work.status)}
              ${work.status === "미확인" ? `<button class="secondary" data-input-work="${index}" type="button">작품 링크 입력</button>` : ""}
            </div>
          </article>
        `).join("")}
      </div>
    </section>
  `;
}

function renderTeacherBenefits() {
  const item = currentTeacherParticipation();
  const event = item ? state.events.find((event) => event.id === item.eventId) : null;
  return `
    ${renderTeacherProjectSwitcher()}
    <section class="panel">
      <div class="panel-head"><h2>혜택/지원</h2><span>${event?.title || "참여 꿈프"} 기준으로 확인합니다.</span></div>
      <div class="grid four">
        ${cardStat("구독권", item?.couponCode ? "지급 완료" : "확인 중", item?.couponCode || "쿠폰 재고 확인 중")}
        ${cardStat("간식비", item?.snackStatus || "확인 중", item?.snackDate || "일정 확정 후 안내")}
        ${cardStat("활동확인서", item?.certificate || "발급 전")}
        ${cardStat("심사표", item?.score || "발표 후 제공")}
      </div>
    </section>
  `;
}

function teacherAlerts(item, event, requests) {
  const alerts = [];
  if (item?.certificate === "발급 완료") {
    alerts.push({ title: "활동확인서가 발급되었어요", message: `${event?.title || "참여 꿈프"} 활동확인서를 다운로드할 수 있습니다.`, status: "완료", page: "teacherDocs", action: "문서 확인" });
  } else {
    alerts.push({ title: "활동확인서 준비 상태", message: certificateBlockReason(item), status: item?.certificate || "발급 전", page: "teacherDocs", action: "상태 보기" });
  }
  if (item?.score === "공개 완료") {
    alerts.push({ title: "심사표가 공개되었어요", message: "작품별 예심점수와 순위를 확인할 수 있습니다.", status: "공개 완료", page: "teacherDocs", action: "심사표 보기" });
  }
  const latestReply = requests.find((request) => request.reply);
  if (latestReply) {
    alerts.push({ title: "관리자 답변 도착", message: `${latestReply.type}: ${latestReply.reply}`, status: "답변", page: "teacherInbox", action: "답변 확인" });
  }
  const missing = item ? Math.max(item.requested - item.works.filter(isConfirmedWork).length, 0) : 0;
  if (missing) {
    alerts.push({ title: "출품 확인 필요", message: `${missing}편의 출품 확인이 필요합니다.`, status: "확인 필요", page: "teacherWorks", action: "작품 확인" });
  }
  return alerts.slice(0, 4);
}

function renderTeacherInbox() {
  const item = currentTeacherParticipation();
  const event = item ? state.events.find((event) => event.id === item.eventId) : null;
  const mails = state.mails.filter((mail) => !event || !mail.eventId || mail.eventId === event.id);
  const requests = state.requests.filter((request) => (
    request.school === state.teacherProfile.schoolName &&
    (!event || request.eventId === event.id)
  ));
  const alerts = teacherAlerts(item, event, requests);
  return `
    ${renderTeacherProjectSwitcher()}
    <section class="panel">
      <div class="panel-head"><h2>중요 알림</h2><span>문서 발급, 심사표 공개, 관리자 답변을 먼저 확인합니다.</span></div>
      <div class="grid three equal-grid">
        ${alerts.map((alert) => `
          <article class="request-card equal-card">
            <div>${badge(alert.status)} <strong>${alert.title}</strong></div>
            <p class="muted">${alert.message}</p>
            <button class="secondary" data-page="${alert.page}" type="button">${alert.action}</button>
          </article>
        `).join("")}
      </div>
    </section>
    <section class="panel">
      <div class="panel-head"><h2>공지/메일함</h2><span>${event?.title || "전체"} 기준으로 다시 확인합니다.</span></div>
      <div class="grid three equal-grid">
        ${mails.map((mail) => `
          <article class="mail-card equal-card">
            <strong>${mail.type}</strong>
            <p>${mail.subject}</p>
            <p class="muted">${mail.scheduledAt} · ${mail.status}</p>
            <button class="secondary" data-mail-edit="${mail.id}" type="button">보기</button>
          </article>
        `).join("")}
      </div>
    </section>
    <section class="panel">
      <div class="panel-head"><h2>내 문의/요청</h2><span>관리자 답변과 처리 상태를 확인합니다.</span></div>
      <div class="grid three equal-grid">
        ${requests.length ? requests.map((request) => `
          <article class="request-card equal-card">
            <div>${badge(request.status)} <strong>${request.type}</strong></div>
            <p class="muted">${request.message}</p>
            ${request.reply ? `<p class="reply-note"><b>답변</b> ${request.reply}</p>` : `<p class="muted">아직 관리자 답변이 없습니다.</p>`}
          </article>
        `).join("") : `<div class="empty">현재 문의/요청이 없습니다.</div>`}
      </div>
    </section>
  `;
}

function renderTeacherDocs() {
  const item = currentTeacherParticipation();
  const event = item ? state.events.find((event) => event.id === item.eventId) : null;
  const certificateReason = certificateBlockReason(item);
  const scoreReason = scoreBlockReason(item);
  const works = item?.works.filter(isConfirmedWork) || [];
  return `
    ${renderTeacherProjectSwitcher()}
    <div class="grid two equal-grid">
      <section class="panel equal-card">
        <div class="panel-head"><h2>활동확인서</h2>${badge(item?.certificate || "발급 전")}</div>
        <p class="muted">${event?.title || "선택된 꿈프"} 기준 문서입니다.</p>
        <p class="muted">${certificateReason}</p>
        <div class="modal-actions"><button class="primary" ${item?.certificate === "발급 완료" ? "" : "disabled"} data-action="download-pdf" type="button">전체 PDF 다운로드</button><button class="secondary" data-action="request-doc-change" type="button">수정 요청</button></div>
      </section>
      <section class="panel equal-card">
        <div class="panel-head"><h2>심사표</h2>${badge(item?.score || "발표 후 제공")}</div>
        <p class="muted">${event?.title || "선택된 꿈프"} 기준 심사표입니다.</p>
        <p class="muted">${scoreReason} · ${event?.type === "29역숏폼왕" ? "29역숏폼왕은 본심 여부가 표시되지 않습니다." : "예심점수, 순위, 본심 진출 여부가 표시됩니다."}</p>
        <div class="modal-actions"><button class="primary" ${item?.score === "공개 완료" ? "" : "disabled"} data-action="download-pdf" type="button">심사표 다운로드</button><button class="secondary" data-action="teacher-question" type="button">문의하기</button></div>
      </section>
    </div>
    <section class="panel">
      <div class="panel-head"><h2>작품별 문서 준비 상태</h2><span>출품 확인된 작품 기준으로 정렬됩니다.</span></div>
      <div class="table-wrap">
        <table>
          <thead><tr><th>작품</th><th>학생/감독</th><th>활동확인서</th><th>심사표</th><th>점수/순위</th><th>조치</th></tr></thead>
          <tbody>
            ${works.length ? works.map((work, index) => `
              <tr>
                <td><strong>${work.title || `작품 ${index + 1}`}</strong><small>${work.url || "URL 없음"}</small></td>
                <td>${work.student || "이름 확인 필요"}</td>
                <td>${badge(item.certificate === "발급 완료" ? "다운로드 가능" : "준비 중")}</td>
                <td>${badge(item.score === "공개 완료" ? "공개 완료" : "발표 후 제공")}</td>
                <td>${work.preliminaryScore ? `${work.preliminaryScore}점` : "-"} ${work.rank ? `· ${work.rank}위` : ""}</td>
                <td>
                  <button class="secondary" data-teacher-doc-detail="${item.id}:${index}" type="button">자세히</button>
                  <button class="secondary" data-teacher-doc-request="${item.id}:${index}" type="button">수정 요청</button>
                </td>
              </tr>
            `).join("") : `<tr><td colspan="6"><div class="empty">아직 확인된 출품 작품이 없습니다.</div></td></tr>`}
          </tbody>
        </table>
      </div>
    </section>
  `;
}

function renderTeacherHistory() {
  const h = state.teacherProfile.history;
  return `
    <section class="panel">
      <div class="panel-head"><h2>참여 이력</h2>${badge(state.teacherProfile.trustStatus)}</div>
      <div class="grid four">
        ${cardStat("신청", `${h.applications}회`)}
        ${cardStat("선정", `${h.selected}회`)}
        ${cardStat("출품 완료", `${h.completed}회`)}
        ${cardStat("미이행", `${h.missed}회`)}
      </div>
      <p class="muted">성실 참여 이력은 향후 선착순 선정 및 활동 우수 학교 선정에 긍정적으로 반영됩니다.</p>
    </section>
  `;
}

function renderTeacherProfile() {
  const profile = state.teacherProfile;
  const editing = Boolean(profile.editMode);
  return `
    <section class="panel">
      <div class="panel-head">
        <div><h2>내 프로필</h2><p class="muted">학교명 변경은 요청 후 관리자 확인이 필요합니다.</p></div>
        ${badge(editing ? "수정 중" : "확인 완료")}
      </div>
      ${editing ? `
        <div class="form-grid">
          <label>학교명<input value="${profile.schoolName}" readonly /></label>
          <label>담당교사명<input id="profileTeacherInput" value="${profile.teacherName}" /></label>
          <label>업무용 이메일<input id="profileEmailInput" value="${profile.email}" /></label>
          <label>연락처<input id="profilePhoneInput" value="${profile.phone || ""}" /></label>
          <label class="wide">선생님 증빙자료<input id="profileVerificationInput" value="${profile.verificationDoc || ""}" placeholder="예: 교직원 확인증.pdf" /></label>
          <label class="wide">소속명 안내<input value="학교명/출품 소속명 변경은 아래 변경 요청 버튼으로만 접수됩니다." readonly /></label>
        </div>
        <div class="modal-actions"><button class="secondary" data-action="cancel-profile-edit" type="button">취소</button><button class="primary" data-action="save-profile" type="button">저장</button></div>
      ` : `
        <div class="detail-stack">
          <div class="detail-row"><span>학교명</span><strong>${profile.schoolName}</strong></div>
          <div class="detail-row"><span>담당교사명</span><strong>${profile.teacherName}</strong></div>
          <div class="detail-row"><span>업무용 이메일</span><strong>${profile.email}</strong></div>
          <div class="detail-row"><span>연락처</span><strong>${profile.phone || "미입력"}</strong></div>
          <div class="detail-row"><span>선생님 증빙자료</span><strong>${profile.verificationDoc || "미등록"}</strong></div>
        </div>
        <div class="modal-actions"><button class="secondary" data-action="profile-change" type="button">학교명 변경 요청</button><button class="primary" data-action="edit-profile" type="button">수정</button></div>
      `}
    </section>
  `;
}

function renderAudit() {
  if (!state.audit.length) return `<div class="empty">아직 작업 이력이 없습니다.</div>`;
  return `
    <div class="table-wrap">
      <table><thead><tr><th>시간</th><th>작업</th><th>대상</th></tr></thead><tbody>
        ${state.audit.slice(0, 8).map((item) => `<tr><td>${item.at}</td><td>${item.action}</td><td>${item.entity}</td></tr>`).join("")}
      </tbody></table>
    </div>
  `;
}

function renderApp() {
  const map = {
    adminDashboard: renderAdminDashboard,
    workbox: renderWorkbox,
    eventOps: renderEventOps,
    members: renderMembers,
    applications: renderApplications,
    submissions: renderSubmissions,
    benefits: renderBenefits,
    certificates: renderCertificates,
    scores: renderScores,
    mails: renderMails,
    requests: renderRequests,
    settings: renderSettings,
    history: renderHistory,
    qaChecklist: renderQaChecklist,
    teacherDashboard: renderTeacherDashboard,
    availableEvents: renderAvailableEvents,
    teacherWorks: renderTeacherWorks,
    teacherBenefits: renderTeacherBenefits,
    teacherInbox: renderTeacherInbox,
    teacherDocs: renderTeacherDocs,
    teacherHistory: renderTeacherHistory,
    teacherProfile: renderTeacherProfile
  };
  return (map[state.page] || renderAdminDashboard)();
}

function pageTitle() {
  const labels = {
    adminDashboard: "꿈프 대시보드",
    workbox: "관리자 작업함",
    eventOps: "행사 운영",
    members: "회원/참여 학교",
    applications: "신청/선정",
    submissions: "출품 확인",
    benefits: "혜택/지원",
    certificates: "활동확인서",
    scores: "심사 결과",
    mails: "메일/공지",
    requests: "문의/요청",
    settings: "엑셀/관리 설정",
    history: "히스토리",
    qaChecklist: "테스트 체크리스트",
    teacherDashboard: "내 대시보드",
    availableEvents: "신청 가능한 행사",
    teacherWorks: "학생/작품 관리",
    teacherBenefits: "혜택/지원",
    teacherInbox: "공지/메일함",
    teacherDocs: "활동확인서/심사표",
    teacherHistory: "참여 이력",
    teacherProfile: "내 프로필"
  };
  return labels[state.page] || "29 WITH";
}

function render() {
  const event = currentEvent();
  document.querySelector("#app").innerHTML = renderApp();
  document.querySelector("#pageTitle").textContent = pageTitle();
  document.querySelector("#sideEventName").textContent = event.title;
  document.querySelector("#sideEventMeta").textContent = `${event.type} · ${event.status} · ${event.deadlineLabel}`;

  document.querySelector("#adminNav").classList.toggle("hidden", state.role !== "admin");
  document.querySelector("#teacherNav").classList.toggle("hidden", state.role !== "teacher");
  document.querySelectorAll("[data-role]").forEach((button) => button.classList.toggle("active", button.dataset.role === state.role));
  document.querySelectorAll("[data-page]").forEach((button) => button.classList.toggle("active", button.dataset.page === state.page));

  const select = document.querySelector("#eventSelect");
  select.innerHTML = state.events.map((item) => `<option value="${item.id}">${item.title}</option>`).join("");
  select.value = state.selectedEventId;
  bindActions();
}

function bindActions() {
  document.querySelectorAll("[data-role]").forEach((button) => button.onclick = () => setRole(button.dataset.role));
  document.querySelectorAll("[data-page]").forEach((button) => button.onclick = () => setPage(button.dataset.page));
  document.querySelector("#eventSelect").onchange = (event) => setEvent(event.target.value);
  document.querySelector("#resetDemoBtn").onclick = () => {
    confirmAction("데모 초기화", "모든 테스트 상태를 처음으로 되돌립니다.", () => {
      state = initialState();
      normalizeSampleContent();
      toast("데모가 초기화되었습니다.");
    }, "초기화");
  };

  document.querySelectorAll("[data-select-event]").forEach((button) => button.onclick = () => setEvent(button.dataset.selectEvent));

  document.querySelectorAll("[data-action]").forEach((button) => {
    button.onclick = () => handleAction(button.dataset.action);
  });

  document.querySelectorAll("[data-select-application]").forEach((button) => {
    button.onclick = () => selectApplication(button.dataset.selectApplication, "선정");
  });
  document.querySelectorAll("[data-wait-application]").forEach((button) => {
    button.onclick = () => selectApplication(button.dataset.waitApplication, "예비");
  });
  document.querySelectorAll("[data-open-participation]").forEach((row) => {
    row.onclick = () => openParticipation(row.dataset.openParticipation);
  });
  document.querySelectorAll("[data-approve-submission]").forEach((button) => {
    button.onclick = (event) => {
      event.stopPropagation();
      approveSubmissionList(button.dataset.approveSubmission);
    };
  });
  document.querySelectorAll("[data-request-participation]").forEach((button) => {
    button.onclick = (event) => {
      event.stopPropagation();
      requestParticipationCheck(button.dataset.requestParticipation);
    };
  });
  document.querySelectorAll("[data-snack]").forEach((button) => {
    button.onclick = () => openSnackModal(button.dataset.snack);
  });
  document.querySelectorAll("[data-certificate-approve]").forEach((button) => {
    button.onclick = () => approveCertificate(button.dataset.certificateApprove);
  });
  document.querySelectorAll("[data-certificate-preview]").forEach((button) => {
    button.onclick = () => previewCertificate(button.dataset.certificatePreview);
  });
  document.querySelectorAll("[data-mail-edit]").forEach((button) => {
    button.onclick = () => editMail(button.dataset.mailEdit);
  });
  document.querySelectorAll("[data-mail-send]").forEach((button) => {
    button.onclick = () => sendMail(button.dataset.mailSend);
  });
  document.querySelectorAll("[data-request-done]").forEach((button) => {
    button.onclick = () => completeRequest(button.dataset.requestDone);
  });
  document.querySelectorAll("[data-request-reply]").forEach((button) => {
    button.onclick = () => replyRequest(button.dataset.requestReply);
  });
  document.querySelectorAll("[data-apply-event]").forEach((button) => {
    button.onclick = () => applyEvent(button.dataset.applyEvent);
  });
  document.querySelectorAll("[data-event-detail]").forEach((button) => {
    button.onclick = () => showEventDetail(button.dataset.eventDetail);
  });
  document.querySelectorAll("[data-input-work]").forEach((button) => {
    button.onclick = () => teacherInputWork(Number(button.dataset.inputWork));
  });
  document.querySelectorAll("[data-teacher-project]").forEach((button) => {
    button.onclick = () => openTeacherProject(button.dataset.teacherProject);
  });
  document.querySelectorAll("[data-filter]").forEach((input) => {
    input.oninput = () => setFilter(input.dataset.filter, input.value);
  });
  document.querySelectorAll("[data-application-check]").forEach((input) => {
    input.onchange = () => toggleApplicationSelection(input.dataset.applicationCheck, input.checked);
  });
  document.querySelectorAll("[data-school-memo]").forEach((button) => {
    button.onclick = () => openSchoolMemo(button.dataset.schoolMemo);
  });
  document.querySelectorAll("[data-template-edit]").forEach((button) => {
    button.onclick = () => editTemplate(button.dataset.templateEdit);
  });
  document.querySelectorAll("[data-admin-toggle]").forEach((button) => {
    button.onclick = () => toggleAdmin(button.dataset.adminToggle);
  });
  document.querySelectorAll("[data-history-download]").forEach((button) => {
    button.onclick = () => downloadHistory(button.dataset.historyDownload);
  });
  document.querySelectorAll("[data-teacher-doc-detail]").forEach((button) => {
    button.onclick = () => showTeacherDocDetail(button.dataset.teacherDocDetail);
  });
  document.querySelectorAll("[data-teacher-doc-request]").forEach((button) => {
    button.onclick = () => openTeacherWorkDocRequest(button.dataset.teacherDocRequest);
  });
}

function setFilter(name, value) {
  state.filters = state.filters || {};
  state.filters[name] = value;
  saveState();
  render();
}

function toggleApplicationSelection(id, checked) {
  state.selectedApplicationIds = state.selectedApplicationIds || [];
  if (checked && !state.selectedApplicationIds.includes(id)) state.selectedApplicationIds.push(id);
  if (!checked) state.selectedApplicationIds = state.selectedApplicationIds.filter((item) => item !== id);
  saveState();
  render();
}

function visibleApplicationIds() {
  const query = state.filters.applications || "";
  return eventApplications()
    .filter((app) => matchesSearch([app.school, app.affiliation, app.teacher, app.email, app.status, app.trust], query))
    .map((app) => app.id);
}

function selectionScore(app) {
  let score = app.order;
  if (String(app.trust).includes("성실")) score -= 0.5;
  if (String(app.trust).includes("확인 필요")) score += 100;
  return score;
}

function selectionReason(app) {
  if (String(app.trust).includes("성실")) return "성실 참여 우선";
  if (String(app.trust).includes("확인 필요")) return "미이행 이력 후순위";
  return "선착순";
}

function selectionRankedApplications(apps = eventApplications()) {
  return [...apps].sort((a, b) => selectionScore(a) - selectionScore(b) || a.order - b.order);
}

function selectedExpectedWorks(eventId = state.selectedEventId) {
  return state.applications
    .filter((app) => app.eventId === eventId && app.status === "선정")
    .reduce((sum, app) => sum + app.expected, 0);
}

function certificateBlockReason(item) {
  if (!item) return "참여 프로젝트를 먼저 선택해 주세요.";
  if (!item.finalApproved) return "출품 리스트 최종 승인 대기";
  if (item.certificate !== "발급 완료") return "활동확인서 PDF 생성 대기";
  return "다운로드 가능";
}

function scoreBlockReason(item) {
  if (!item) return "참여 프로젝트를 먼저 선택해 주세요.";
  if (item.score !== "공개 완료") return "수상작 발표 후 심사표 공개 대기";
  return "다운로드 가능";
}

function workIssueReason(work, item) {
  if (isConfirmedWork(work)) return work.issueReason || "확인 완료";
  if (work.issueReason) return work.issueReason;
  if (work.status === "확인필요") return "학교명과 엑셀 소속이 유사하지만 완전 일치하지 않아 확인이 필요합니다.";
  if (!work.url) return `엑셀 소속에서 ${item?.school || "학교명"} 완전 일치 작품을 찾지 못했습니다.`;
  if (!work.student) return "감독/출품자 이름이 누락되었습니다.";
  return "학교명 또는 엑셀 소속 확인이 필요합니다.";
}

function normalizeSchoolName(value) {
  return String(value || "").replace(/[\s\-_()[\]{}·.,]/g, "").toLowerCase();
}

function levenshteinDistance(a, b) {
  const left = Array.from(a);
  const right = Array.from(b);
  const dp = Array.from({ length: left.length + 1 }, () => Array(right.length + 1).fill(0));
  for (let i = 0; i <= left.length; i += 1) dp[i][0] = i;
  for (let j = 0; j <= right.length; j += 1) dp[0][j] = j;
  for (let i = 1; i <= left.length; i += 1) {
    for (let j = 1; j <= right.length; j += 1) {
      const cost = left[i - 1] === right[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost);
    }
  }
  return dp[left.length][right.length];
}

function schoolMatchType(schoolName, excelAffiliation) {
  const school = String(schoolName || "").trim();
  const affiliation = String(excelAffiliation || "").trim();
  if (!school || !affiliation) return "none";
  if (school === affiliation) return "exact";
  const normalizedSchool = normalizeSchoolName(school);
  const normalizedAffiliation = normalizeSchoolName(affiliation);
  if (normalizedSchool && normalizedSchool === normalizedAffiliation) return "similar";
  if (Math.abs(normalizedSchool.length - normalizedAffiliation.length) <= 1 && levenshteinDistance(normalizedSchool, normalizedAffiliation) <= 1) return "similar";
  if (normalizedSchool.length >= 4 && normalizedAffiliation.length >= 4 && (normalizedSchool.includes(normalizedAffiliation) || normalizedAffiliation.includes(normalizedSchool))) return "similar";
  return "none";
}

function sampleExcelRowsForEvent(event) {
  if (event.type === "29역숏폼왕") {
    return [
      { affiliation: "방학중학교", title: "함께 성장하는 시선", student: "김하늘", url: "https://youtube.com/shorts/sample-growth", score: 8.5, award: "" },
      { affiliation: "방학 중학교", title: "띄어쓰기 확인 후보", student: "박서윤", url: "https://instagram.com/reel/sample", score: 7.0, award: "" },
      { affiliation: "서울고등", title: "한 글자 차이 후보", student: "이도현", url: "https://youtube.com/shorts/sample-seoul", score: 6.5, award: "" }
    ];
  }
  return [
    { affiliation: "방학중학교", title: "우리들의 이야기", student: "김연우, 김채원, 강하은", url: "excel://film/1363", score: 2.17, award: "" },
    { affiliation: "서울 고등학교", title: "띄어쓰기 확인 작품", student: "박민수", url: "excel://film/similar-1", score: 3.2, award: "1차통과" },
    { affiliation: "푸른중학교", title: "정확 매칭 작품", student: "이소라", url: "excel://film/green", score: 4.1, award: "" }
  ];
}

function normalizeColumnName(value) {
  return String(value || "").replace(/\s+/g, "").trim();
}

function pickValue(row, keys) {
  const normalizedRow = Object.fromEntries(Object.entries(row).map(([key, value]) => [normalizeColumnName(key), value]));
  const key = keys.map(normalizeColumnName).find((candidate) => normalizedRow[candidate] !== undefined && normalizedRow[candidate] !== "");
  return key ? normalizedRow[key] : "";
}

function mapRawSubmissionRows(rawRows, event) {
  return rawRows.map((row) => ({
    affiliation: pickValue(row, ["소속", "소속명", "팀명", "출품소속명"]),
    title: pickValue(row, ["작품제목", "제목", "작품명"]),
    student: event.type === "29초영화제" ? pickValue(row, ["감독", "감독명", "이름"]) : pickValue(row, ["출품자", "회원명", "이름"]),
    url: pickValue(row, ["원본URL", "출품URL", "영상URL", "URL", "링크"]),
    score: Number(pickValue(row, ["예심평점", "평점", "일반평점", "심사평점"]) || 0),
    award: pickValue(row, ["수상결과", "수상", "수상기록", "진행상태"])
  })).filter((row) => row.affiliation);
}

function parseCsvRows(text) {
  const rows = String(text || "").trim().split(/\r?\n/).map((line) => {
    const values = [];
    let current = "";
    let quoted = false;
    for (let index = 0; index < line.length; index += 1) {
      const char = line[index];
      if (char === '"' && line[index + 1] === '"') {
        current += '"';
        index += 1;
      } else if (char === '"') {
        quoted = !quoted;
      } else if (char === "," && !quoted) {
        values.push(current.trim());
        current = "";
      } else {
        current += char;
      }
    }
    values.push(current.trim());
    return values;
  }).filter((row) => row.length);
  const headers = rows.shift() || [];
  return rows.map((row) => Object.fromEntries(headers.map((header, index) => [header, row[index] || ""])));
}

function parseHtmlTableRows(text) {
  const parser = typeof DOMParser !== "undefined" ? new DOMParser() : null;
  if (!parser) return [];
  const doc = parser.parseFromString(text, "text/html");
  const tableRows = [...doc.querySelectorAll("tr")].map((row) => [...row.querySelectorAll("th,td")].map((cell) => cell.textContent.trim()));
  const headerIndex = tableRows.findIndex((row) => row.some((cell) => ["소속", "작품제목", "제목", "감독", "출품자"].includes(normalizeColumnName(cell))));
  if (headerIndex < 0) return [];
  const headers = tableRows[headerIndex];
  return tableRows.slice(headerIndex + 1)
    .filter((row) => row.some(Boolean))
    .map((row) => Object.fromEntries(headers.map((header, index) => [header, row[index] || ""])));
}

async function parseSubmissionFile(file, event) {
  if (!file) {
    return { rows: sampleExcelRowsForEvent(event), source: "샘플 데이터" };
  }
  const lowerName = file.name.toLowerCase();
  const spreadsheetParser = globalThis.XLSX;
  if ((lowerName.endsWith(".xlsx") || lowerName.endsWith(".xls")) && spreadsheetParser) {
    const workbook = spreadsheetParser.read(await file.arrayBuffer(), { type: "array" });
    const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
    const rawRows = spreadsheetParser.utils.sheet_to_json(firstSheet, { defval: "" });
    return { rows: mapRawSubmissionRows(rawRows, event), source: "실제 엑셀 파일" };
  }
  const text = await file.text();
  const rawRows = lowerName.endsWith(".csv") ? parseCsvRows(text) : parseHtmlTableRows(text);
  if (!rawRows.length && (lowerName.endsWith(".xlsx") || lowerName.endsWith(".xls"))) {
    throw new Error("엑셀 파서가 로드되지 않았습니다. 인터넷 연결 후 다시 열거나 CSV/HTML XLS 파일을 사용해 주세요.");
  }
  return { rows: mapRawSubmissionRows(rawRows, event), source: "실제 업로드 파일" };
}

function applySubmissionMatches(event, excelRows, fileName, source) {
  let autoMatched = 0;
  let needsReview = 0;
  const usedRows = new Set();
  eventParticipations().forEach((item) => {
    item.works.forEach((work) => {
      if (isConfirmedWork(work)) return;
      const matchIndex = excelRows.findIndex((row, index) => !usedRows.has(index) && schoolMatchType(item.school, row.affiliation) !== "none");
      if (matchIndex < 0) {
        work.status = "미확인";
        work.issueReason = `엑셀 소속에서 ${item.school} 후보를 찾지 못했습니다.`;
        return;
      }
      const row = excelRows[matchIndex];
      const matchType = schoolMatchType(item.school, row.affiliation);
      usedRows.add(matchIndex);
      work.title = row.title;
      work.student = row.student;
      work.url = row.url || "엑셀 내 URL 없음";
      work.preliminaryScore = row.score;
      work.finalRound = event.type === "29초영화제" && row.award === "1차통과" ? "진출" : event.type === "29초영화제" ? "-" : "";
      work.excelAffiliation = row.affiliation;
      if (matchType === "exact") {
        work.status = "자동확인";
        work.issueReason = "학교명과 엑셀 소속 완전 일치";
        autoMatched += 1;
      } else {
        work.status = "확인필요";
        work.issueReason = `학교명(${item.school})과 엑셀 소속(${row.affiliation}) 유사 일치`;
        needsReview += 1;
      }
    });
  });
  refreshEventStats(event.id);
  state.excelImports = state.excelImports || {};
  state.excelImports[event.id] = {
    fileName,
    importedAt: new Date().toLocaleString("ko-KR"),
    source,
    totalRows: excelRows.length,
    autoMatched,
    needsReview,
    unmatched: eventParticipations().reduce((sum, item) => sum + item.works.filter((work) => work.status === "미확인").length, 0)
  };
  audit("출품 엑셀 분석", `${fileName} · ${source} · 자동 ${autoMatched} · 확인필요 ${needsReview}`);
  toast(`엑셀 분석 완료: 자동 ${autoMatched}편, 확인 필요 ${needsReview}편`);
}

function assignCouponToSchool(schoolName) {
  const existing = state.coupons.find((coupon) => coupon.school === schoolName && coupon.status === "지급완료");
  if (existing) return existing.code;
  const coupon = state.coupons.find((item) => item.status === "미사용");
  if (!coupon) return "";
  coupon.status = "지급완료";
  coupon.school = schoolName;
  return coupon.code;
}

function ensureParticipationForApplication(app) {
  const affiliation = app.affiliation || app.school;
  const exists = state.submissions.some((item) => (
    item.applicationId === app.id ||
    (!item.applicationId && item.eventId === app.eventId && item.school === app.school && item.affiliation === affiliation)
  ));
  if (exists) return false;
  state.submissions.push({
    id: `p${Date.now()}${Math.floor(Math.random() * 1000)}`,
    applicationId: app.id,
    eventId: app.eventId,
    school: app.school,
    affiliation,
    requested: app.expected,
    couponCode: assignCouponToSchool(app.school),
    snackStatus: "검토 중",
    snackDate: "",
    certificate: "발급 전",
    score: "발표 후 제공",
    works: Array.from({ length: app.expected }, () => ({ title: "", student: "", url: "", status: "미확인", preliminaryScore: null, rank: null, finalRound: "" }))
  });
  refreshEventStats(app.eventId);
  return true;
}

function bulkApplicationAction(status) {
  const selected = (state.selectedApplicationIds || [])
    .map((id) => state.applications.find((app) => app.id === id))
    .filter(Boolean);
  if (!selected.length) {
    toast("선택된 신청자가 없습니다.");
    return;
  }
  confirmAction(`선택 ${status} 처리`, `${selected.length}건을 ${status} 처리합니다.`, () => {
    selected.forEach((app) => {
      app.status = status;
      if (status === "선정") ensureParticipationForApplication(app);
    });
    state.mails.unshift({ id: `m${Date.now()}`, eventId: state.selectedEventId, type: `선택 ${status} 안내`, subject: `[29 WITH] 선택 ${status} 안내`, sender: "29 WITH <no-reply@29with.kr>", scheduledAt: "관리자 확인 후", recipients: selected.length, status: "예약" });
    audit(`선택 ${status} 처리`, `${selected.length}건`);
    state.selectedApplicationIds = [];
    toast(`${selected.length}건이 ${status} 처리되었습니다.`);
  }, `${status} 처리`);
}

function handleAction(action) {
  const event = currentEvent();
  if (action === "create-event") {
    openModal("새 행사 등록", `
      <div class="form-grid">
        <label>행사명<input id="newEventTitleInput" value="새 꿈프 행사" /></label>
        <label>행사 유형
          <select id="newEventTypeInput">
            <option>29초영화제</option>
            <option>29역숏폼왕</option>
          </select>
        </label>
        <label>상태
          <select id="newEventStatusInput">
            <option>예정</option>
            <option>모집중</option>
            <option>종료</option>
          </select>
        </label>
        <label>출품 마감<input id="newEventDeadlineInput" value="D-30" /></label>
        <label>목표 작품 수<input id="newEventTargetWorksInput" type="number" min="0" value="100" /></label>
        <label>행사 식별값<input id="newEventExternalKeyInput" value="new_event_${Date.now()}" /></label>
        <label>공모기간<input id="newEventContestPeriodInput" value="2026.00.00 - 2026.00.00" /></label>
        <label>총상금<input id="newEventTotalPrizeInput" value="총상금 입력" /></label>
        <label class="wide">주제<input id="newEventThemeInput" value="행사 주제 입력" /></label>
        <label class="wide">포스터 URL<input id="newEventPosterUrlInput" placeholder="https://..." /></label>
        <label>홈페이지 URL<input id="newEventHomepageUrlInput" placeholder="https://..." /></label>
        <label>출품 URL<input id="newEventSubmissionUrlInput" placeholder="https://..." /></label>
        <label class="wide">안내사항<textarea id="newEventOrganizerNoticeInput">선생님이 자세히 보기에서 확인할 행사 안내를 입력합니다.</textarea></label>
        <label class="wide">출품작 엑셀 출처 메모<input id="newEventAdminUrlInput" placeholder="예: 29초영화제 관리자 출품작 목록 엑셀" /></label>
      </div>
      <section class="notice-panel"><strong>등록 후 흐름</strong><span>등록한 행사가 바로 선택되며, 행사 운영 화면에서 모집 시작/메일 확인/수정이 가능합니다.</span></section>
    `, [
      { label: "취소" },
      { label: "등록", primary: true, onClick: () => {
        const title = document.querySelector("#newEventTitleInput")?.value.trim();
        const type = document.querySelector("#newEventTypeInput")?.value.trim();
        const status = document.querySelector("#newEventStatusInput")?.value.trim();
        const deadlineLabel = document.querySelector("#newEventDeadlineInput")?.value.trim();
        const targetWorks = Number(document.querySelector("#newEventTargetWorksInput")?.value || 0);
        const externalKey = document.querySelector("#newEventExternalKeyInput")?.value.trim();
        if (!title || !type || !deadlineLabel || !externalKey || Number.isNaN(targetWorks) || targetWorks < 0) {
          toast("행사명, 유형, 마감, 행사 식별값, 목표 작품 수를 확인해 주세요.");
          return false;
        }
      const id = `e${state.events.length + 1}`;
      state.events.push({
        id,
        title,
        type,
        status,
        deadlineLabel,
        externalKey,
        homepageUrl: document.querySelector("#newEventHomepageUrlInput")?.value.trim() || "",
        submissionUrl: document.querySelector("#newEventSubmissionUrlInput")?.value.trim() || "",
        adminUrl: document.querySelector("#newEventAdminUrlInput")?.value.trim() || `${type} 관리자 엑셀`,
        posterUrl: document.querySelector("#newEventPosterUrlInput")?.value.trim() || "https://dummyimage.com/420x594/edf2ff/24315f&text=29+WITH",
        applicationPeriod: document.querySelector("#newEventContestPeriodInput")?.value.trim() || deadlineLabel,
        contestPeriod: document.querySelector("#newEventContestPeriodInput")?.value.trim() || deadlineLabel,
        totalPrize: document.querySelector("#newEventTotalPrizeInput")?.value.trim() || "총상금 추후 공지",
        theme: document.querySelector("#newEventThemeInput")?.value.trim() || "주제 추후 공지",
        organizerNotice: document.querySelector("#newEventOrganizerNoticeInput")?.value.trim() || "행사 안내사항을 확인해 주세요.",
        targetWorks,
        selectedSchools: 0,
        expectedWorks: 0,
        confirmedWorks: 0,
        needsAction: 0,
        closed: false
      });
      state.integrationSettings[id] = {
        dbType: type === "29초영화제" ? "29초영화제 엑셀" : "29역숏폼왕 엑셀",
        accessStatus: "엑셀 업로드 사용",
        requiredFields: type === "29초영화제" ? "소속, 작품제목, 감독, 예심평점, 수상결과" : "소속, 제목, 출품자, 원본URL, 평점",
        host: "",
        lastTest: "미실행"
      };
      state.selectedEventId = id;
      state.page = "eventOps";
      audit("새 행사 등록", id);
      toast("새 행사가 등록되었습니다.");
      }}
    ]);
  }
  if (action === "save-event") {
    const title = document.querySelector("#eventTitleInput")?.value.trim();
    const type = document.querySelector("#eventTypeInput")?.value.trim();
    const deadlineLabel = document.querySelector("#eventDeadlineInput")?.value.trim();
    const externalKey = document.querySelector("#eventExternalKeyInput")?.value.trim();
    const contestPeriod = document.querySelector("#eventContestPeriodInput")?.value.trim();
    const totalPrize = document.querySelector("#eventTotalPrizeInput")?.value.trim();
    const theme = document.querySelector("#eventThemeInput")?.value.trim();
    const posterUrl = document.querySelector("#eventPosterUrlInput")?.value.trim();
    const homepageUrl = document.querySelector("#eventHomepageUrlInput")?.value.trim();
    const submissionUrl = document.querySelector("#eventSubmissionUrlInput")?.value.trim();
    const organizerNotice = document.querySelector("#eventOrganizerNoticeInput")?.value.trim();
    const adminUrl = document.querySelector("#eventAdminUrlInput")?.value.trim();
    const targetWorks = Number(document.querySelector("#eventTargetWorksInput")?.value || 0);
    if (!title || !type || !deadlineLabel || !externalKey || Number.isNaN(targetWorks) || targetWorks < 0) {
      toast("행사명, 유형, 마감, 행사 식별값, 목표 작품 수를 확인해 주세요.");
      return;
    }
    event.title = title;
    event.type = type;
    event.deadlineLabel = deadlineLabel;
    event.externalKey = externalKey;
    event.contestPeriod = contestPeriod;
    event.applicationPeriod = contestPeriod;
    event.totalPrize = totalPrize;
    event.theme = theme;
    event.posterUrl = posterUrl;
    event.homepageUrl = homepageUrl;
    event.submissionUrl = submissionUrl;
    event.organizerNotice = organizerNotice;
    event.adminUrl = adminUrl || `${type} 관리자 엑셀`;
    event.targetWorks = targetWorks;
    audit("행사 정보 저장", event.title);
    toast("행사 정보가 저장되었습니다.");
    saveState();
    render();
  }
  if (action === "deactivate-event") {
    confirmAction("행사 비활성화", "행사를 삭제하지 않고 목록에서 운영 중지 상태로 보관합니다.", () => {
      event.closed = true;
      event.status = "비활성";
      event.closedAt = new Date().toLocaleDateString("ko-KR");
      event.closedSummary = "관리자 비활성화 처리";
      audit("행사 비활성화", event.title);
      toast("행사가 비활성화되었습니다.");
    }, "비활성화");
  }
  if (action === "start-recruitment") {
    confirmAction("꿈프 모집 시작", "신청 버튼이 활성화되고 모집 안내 메일이 예약됩니다.", () => {
      event.status = "모집중";
      state.mails.unshift({
        id: `m${Date.now()}`,
        eventId: event.id,
        type: "모집 안내",
        subject: `[29 WITH] ${event.title} 꿈프 모집 안내`,
        sender: "29 WITH <no-reply@29with.kr>",
        scheduledAt: "관리자 확인 후",
        recipients: 326,
        status: "예약"
      });
      audit("꿈프 모집 시작", event.title);
      toast("모집 안내 메일이 예약되었습니다.");
    }, "모집 시작");
  }
  if (action === "mail-preview") setPage("mails");
  if (action === "select-submitted") {
    const target = eventApplications().find((item) => item.status === "신청접수");
    if (target) selectApplication(target.id, "선정");
    else toast("선정 처리할 신청접수 건이 없습니다.");
  }
  if (action === "select-visible-applications") {
    state.selectedApplicationIds = visibleApplicationIds();
    audit("현재 신청 목록 선택", `${state.selectedApplicationIds.length}건`);
    toast(`${state.selectedApplicationIds.length}건이 선택되었습니다.`);
    saveState();
    render();
  }
  if (action === "select-recommended") {
    const event = currentEvent();
    const targetWorks = event.targetWorks || event.expectedWorks || 0;
    let running = selectedExpectedWorks(event.id);
    const candidates = selectionRankedApplications(eventApplications())
      .filter((app) => app.status === "신청접수" || app.status === "예비");
    const picked = [];
    candidates.forEach((app) => {
      if (!targetWorks || running + app.expected <= targetWorks) {
        picked.push(app.id);
        running += app.expected;
      }
    });
    state.selectedApplicationIds = picked.length ? picked : candidates.slice(0, 1).map((app) => app.id);
    audit("추천 선정 대상 선택", `${state.selectedApplicationIds.length}건`);
    toast(`${state.selectedApplicationIds.length}건이 추천 기준으로 선택되었습니다.`);
    saveState();
    render();
  }
  if (action === "bulk-select") bulkApplicationAction("선정");
  if (action === "bulk-wait") bulkApplicationAction("예비");
  if (action === "bulk-reject") bulkApplicationAction("미선정");
  if (action === "bulk-resend") {
    const count = (state.selectedApplicationIds || []).length;
    if (!count) {
      toast("선택된 신청자가 없습니다.");
    } else {
      state.mails.unshift({ id: `m${Date.now()}`, eventId: event.id, type: "선택 메일 재발송", subject: `[29 WITH] ${event.title} 안내 재발송`, sender: "29 WITH <no-reply@29with.kr>", scheduledAt: "관리자 확인 후", recipients: count, status: "예약" });
      audit("선택 메일 재발송", `${count}명`);
      toast(`${count}명에게 재발송 메일이 예약되었습니다.`);
    }
  }
  if (action === "bulk-export") {
    const selected = (state.selectedApplicationIds || [])
      .map((id) => state.applications.find((app) => app.id === id))
      .filter(Boolean);
    downloadMockFile("29with-selected-applications.csv", [
      "school,affiliation,teacher,email,expected,status",
      ...selected.map((app) => `${app.school},${app.affiliation},${app.teacher},${app.email},${app.expected},${app.status}`)
    ].join("\n"));
    audit("선택 신청자 엑셀 다운로드", `${selected.length}건`);
  }
  if (action === "upload-submission-excel") {
    confirmAction("출품 엑셀 분석", "관리자가 업로드한 출품작 엑셀의 소속 컬럼을 꿈프 신청 학교명과 비교합니다. 완전 일치만 자동 매칭하고 유사 일치는 확인 필요로 분류합니다. 파일을 선택하지 않으면 샘플 데이터로 분석합니다.", () => {
      try {
        const event = currentEvent();
        const fileInput = document.querySelector("#submissionExcelInput");
        const file = fileInput?.files?.[0];
        const fileName = file?.name || `${event.type} 출품작 목록 샘플`;
        if (!file) {
          applySubmissionMatches(event, sampleExcelRowsForEvent(event), fileName, "샘플 데이터");
          return;
        }
        parseSubmissionFile(file, event).then((parsed) => {
          if (!parsed.rows.length) {
            toast("엑셀에서 소속 컬럼을 찾지 못했습니다. 필수 컬럼을 확인해 주세요.");
            return;
          }
          applySubmissionMatches(event, parsed.rows, fileName, parsed.source);
          saveState();
          render();
        }).catch((error) => toast(error.message || "엑셀 분석 중 오류가 발생했습니다."));
      } catch (error) {
        toast(error.message || "엑셀 분석 중 오류가 발생했습니다.");
      }
    }, "분석");
  }
  if (action === "request-missing") {
    const targets = eventParticipations().filter((item) => item.works.some((work) => work.status === "미확인" || isPendingMatch(work)));
    if (!targets.length) {
      toast("확인 요청이 필요한 작품이 없습니다.");
    } else {
      targets.forEach((item) => requestParticipationCheck(item.id));
      audit("미확인 작품 일괄 확인 요청", `${targets.length}개 학교`);
      toast(`${targets.length}개 학교에 확인 요청이 생성되었습니다.`);
    }
  }
  if (action === "sync-scores") {
    eventParticipations().forEach((item) => {
      const confirmed = item.works
        .filter(isConfirmedWork)
        .sort((a, b) => (b.preliminaryScore || 0) - (a.preliminaryScore || 0));
      confirmed.forEach((work, index) => {
        work.rank = index + 1;
        if (event.type === "29초영화제" && work.rank === 1) work.finalRound = "진출";
      });
      item.score = "공개 준비";
    });
    audit("심사 결과 반영", event.title);
    toast("심사 결과가 반영되었습니다.");
  }
  if (action === "publish-scores") {
    eventParticipations().forEach((item) => item.score = "공개 완료");
    state.mails.unshift({ id: `m${Date.now()}`, eventId: event.id, type: "심사 결과 반영", subject: `[29 WITH] ${event.title} 심사 결과 안내`, sender: "29 WITH <no-reply@29with.kr>", scheduledAt: "관리자 확인 후", recipients: event.selectedSchools, status: "예약" });
    audit("심사 결과 메일 예약", event.title);
    toast("심사 결과 안내 메일이 예약되었습니다.");
  }
  if (action === "test-connection") {
    state.integrationSettings = state.integrationSettings || {};
    state.integrationSettings[event.id] = {
      ...(state.integrationSettings[event.id] || {}),
      dbType: document.querySelector("#settingDbTypeInput")?.value || state.integrationSettings[event.id]?.dbType || "직접 지정",
      accessStatus: "양식 점검 완료",
      requiredFields: document.querySelector("#settingRequiredFieldsInput")?.value || state.integrationSettings[event.id]?.requiredFields || "",
      host: document.querySelector("#settingHostInput")?.value || state.integrationSettings[event.id]?.host || "",
      lastTest: new Date().toLocaleString("ko-KR")
    };
    audit("출품 엑셀 양식 점검", event.title);
    toast("출품 엑셀 양식 점검이 완료된 것으로 기록되었습니다.");
    saveState();
    render();
  }
  if (action === "upload-coupons") {
    state.coupons.push(
      { code: `ABC-${String(state.coupons.length + 1).padStart(4, "0")}`, status: "미사용", school: "" },
      { code: `ABC-${String(state.coupons.length + 2).padStart(4, "0")}`, status: "미사용", school: "" }
    );
    audit("쿠폰 엑셀 업로드", `${state.coupons.length}개 재고`);
    toast("샘플 쿠폰 2개가 추가되었습니다.");
  }
  if (action === "upload-template") {
    state.certificateTemplate = {
      name: "업로드 활동확인서 템플릿",
      status: "분석 완료",
      updatedAt: new Date().toLocaleDateString("ko-KR")
    };
    audit("확인서 템플릿 업로드", state.certificateTemplate.name);
    toast("활동확인서 템플릿 업로드가 완료되었습니다.");
  }
  if (action === "export-members") {
    audit("회원/참여 학교 다운로드", `${state.schools.length}개 학교`);
    downloadMockFile("29with-members.csv", [
      "school,teacher,email,history,memo",
      ...state.schools.map((school) => `${school.school},${school.teacher},${school.email},${school.history},${school.memo}`)
    ].join("\n"));
  }
  if (action === "add-admin") {
    state.admins.push({
      id: `admin${Date.now()}`,
      name: "추가 관리자",
      email: `admin${state.admins.length + 1}@29with.kr`,
      role: "운영 관리자",
      status: "활성"
    });
    audit("관리자 추가", "추가 관리자");
    toast("관리자가 추가되었습니다.");
  }
  if (action === "add-template") {
    state.mailTemplates.push({
      id: `t${Date.now()}`,
      name: "새 안내 템플릿",
      subject: "[29 WITH] 새 안내",
      sender: "29 WITH <no-reply@29with.kr>",
      body: "새 안내 메일 본문입니다."
    });
    audit("메일 템플릿 추가", "새 안내 템플릿");
    toast("메일 템플릿이 추가되었습니다.");
  }
  if (action === "save-settings") {
    state.integrationSettings = state.integrationSettings || {};
    state.adminPreferences = state.adminPreferences || {};
    if (document.querySelector("#settingExternalKeyInput")) {
      event.externalKey = document.querySelector("#settingExternalKeyInput").value.trim() || event.externalKey;
      event.type = document.querySelector("#settingEventTypeInput").value.trim() || event.type;
      state.integrationSettings[event.id] = {
        ...(state.integrationSettings[event.id] || {}),
        dbType: document.querySelector("#settingDbTypeInput").value,
        accessStatus: document.querySelector("#settingAccessStatusInput").value,
        requiredFields: document.querySelector("#settingRequiredFieldsInput").value,
        host: document.querySelector("#settingHostInput").value,
        lastTest: state.integrationSettings[event.id]?.lastTest || "미실행"
      };
    }
    if (document.querySelector("#prefSenderNameInput")) {
      state.adminPreferences.senderName = document.querySelector("#prefSenderNameInput").value;
      state.adminPreferences.senderEmail = document.querySelector("#prefSenderEmailInput").value;
      state.adminPreferences.signupNotice = document.querySelector("#prefSignupNoticeInput").value;
    }
    audit("연동/발신자 설정 저장", event.title);
    toast("설정이 저장되었습니다.");
    saveState();
    render();
  }
  if (action === "download-pdf") {
    audit("PDF 다운로드", event.title);
    downloadMockFile("29with-document-test.txt", `${event.title}\n문서 다운로드 파일입니다.\n실제 PDF 생성은 서버/PDF 엔진 연동 후 대체됩니다.`);
  }
  if (action === "request-doc-change") {
    openTeacherRequestModal("문서 수정 요청", "문서 수정 요청", "수정이 필요한 문서와 내용을 적어 주세요.");
  }
  if (action === "teacher-question") {
    openTeacherRequestModal("문의하기", "문서/심사표 문의", "문의 내용을 적어 주세요.");
  }
  if (action === "edit-profile") {
    state.teacherProfile.editMode = true;
    saveState();
    render();
  }
  if (action === "cancel-profile-edit") {
    state.teacherProfile.editMode = false;
    saveState();
    render();
  }
  if (action === "save-profile") {
    const teacher = document.querySelector("#profileTeacherInput")?.value?.trim();
    const email = document.querySelector("#profileEmailInput")?.value?.trim();
    const phone = document.querySelector("#profilePhoneInput")?.value?.trim();
    const verificationDoc = document.querySelector("#profileVerificationInput")?.value?.trim();
    if (!teacher || !email || !phone || !verificationDoc) {
      toast("담당교사명, 이메일, 연락처, 증빙자료를 확인해 주세요.");
      return;
    }
    state.teacherProfile.teacherName = teacher;
    state.teacherProfile.email = email;
    state.teacherProfile.phone = phone;
    state.teacherProfile.verificationDoc = verificationDoc;
    state.teacherProfile.editMode = false;
    audit("선생님 프로필 저장", state.teacherProfile.schoolName);
    toast("프로필이 저장되었습니다.");
    saveState();
    render();
  }
  if (action === "profile-change") {
    openModal("학교명 변경 요청", `
      <div class="form-grid">
        <label>기존 학교명<input value="${state.teacherProfile.schoolName}" readonly /></label>
        <label>변경 희망 학교명<input id="schoolChangeNewNameInput" placeholder="변경할 학교명을 입력" /></label>
        <label class="wide">변경 사유<textarea id="schoolChangeReasonInput" placeholder="예: 학교명 오기재, 담당 학교 변경 등"></textarea></label>
      </div>
    `, [
      { label: "취소" },
      { label: "요청", primary: true, onClick: () => {
        const newName = document.querySelector("#schoolChangeNewNameInput").value.trim();
        const reason = document.querySelector("#schoolChangeReasonInput").value.trim();
        if (!newName || !reason) {
          toast("변경 희망 학교명과 사유를 입력해 주세요.");
          return false;
        }
        state.requests.unshift({ id: `r${Date.now()}`, eventId: state.selectedEventId, school: state.teacherProfile.schoolName, type: "학교명 변경", message: `기존: ${state.teacherProfile.schoolName} / 변경 희망: ${newName} / 사유: ${reason}`, status: "접수" });
        audit("학교명 변경 요청", `${state.teacherProfile.schoolName} → ${newName}`);
        toast("학교명 변경 요청이 접수되었습니다.");
      }}
    ]);
  }
  if (action === "close-event") {
    confirmAction("꿈프 종료", "종료 전 점검이 완료된 것으로 보고 히스토리에 보관합니다. 선생님은 종료 후에도 문서를 다운로드할 수 있습니다.", () => {
      event.closed = true;
      event.status = "종료";
      event.closedAt = new Date().toLocaleDateString("ko-KR");
      event.closedSummary = `선정 ${event.selectedSchools}교 · 출품 확인 ${event.confirmedWorks}/${event.expectedWorks}편 · 처리 필요 ${event.needsAction}건`;
      audit("꿈프 종료", event.title);
      toast("꿈프가 종료되었습니다.");
    }, "종료");
  }
}

function selectApplication(id, status) {
  const app = state.applications.find((item) => item.id === id);
  if (!app) return;
  confirmAction(`${status} 처리`, `${app.school}을 ${status} 처리합니다. 메일, 쿠폰, 담당자 페이지, 작품 슬롯이 함께 처리됩니다.`, () => {
    app.status = status;
    if (status === "선정") ensureParticipationForApplication(app);
    state.mails.unshift({ id: `m${Date.now()}`, eventId: app.eventId, type: `${status} 안내`, subject: `[29 WITH] ${status} 안내`, sender: "29 WITH <no-reply@29with.kr>", scheduledAt: "관리자 확인 후", recipients: 1, status: "예약" });
    audit(`${status} 처리`, app.school);
    toast(`${status} 처리되었습니다.`);
  }, `${status} 처리`);
}

function openParticipation(id) {
  const item = state.submissions.find((row) => row.id === id);
  if (!item) return;
  openModal(`${item.school} 작품 상세`, `
    <div class="detail-stack">
      <div class="detail-row"><span>출품 소속명/팀명</span><strong>${item.affiliation}</strong></div>
      ${item.works.map((work, index) => `
        <div class="work-card">
          <div>
            <strong>${index + 1}. ${work.title || "미확인"}</strong>
            <p class="muted">${work.student || "학생 이름 없음"} · ${work.url || "URL 없음"}</p>
            <p class="muted">${workIssueReason(work, item)}</p>
          </div>
          <div>${badge(work.status)}</div>
        </div>
      `).join("")}
    </div>
  `, [
    { label: "닫기" },
    { label: "선생님 확인 요청", onClick: () => requestParticipationCheck(item.id) },
    { label: "수동 매칭", primary: true, onClick: () => {
      const missing = item.works.find((work) => work.status === "미확인" || isPendingMatch(work));
      if (missing) {
        missing.title = "관리자 수동 매칭 작품";
        missing.student = "확인 필요";
        missing.url = "https://manual.example/work";
        missing.status = "수동확인";
        missing.issueReason = "관리자 수동 매칭 완료";
      }
      refreshEventStats(item.eventId);
      audit("수동 매칭", item.school);
      toast("수동 매칭되었습니다.");
    }}
  ]);
}

function requestParticipationCheck(id) {
  const item = state.submissions.find((row) => row.id === id);
  if (!item) return;
  const missing = item.works.filter((work) => work.status === "미확인" || isPendingMatch(work));
  const reason = missing[0] ? workIssueReason(missing[0], item) : "추가 확인이 필요합니다.";
  state.requests.unshift({
    id: `r${Date.now()}`,
    eventId: item.eventId,
    school: item.school,
    type: "출품 매칭 확인",
    message: `${item.affiliation} 기준 미확인 ${missing.length}편. ${reason}`,
    status: "접수"
  });
  audit("출품 매칭 확인 요청", item.school);
  toast(`${item.school} 선생님 확인 요청이 생성되었습니다.`);
  saveState();
}

function openSnackModal(id) {
  const item = state.submissions.find((row) => row.id === id);
  openModal("간식비 지급 예정일 입력", `
    <label>지급 예정일<input id="snackDateInput" type="date" value="${item.snackDate || "2026-07-15"}" /></label>
    <label>선생님 노출 문구<textarea id="snackMessageInput">출품 확인 완료 학교 대상으로 순차 지급됩니다.</textarea></label>
  `, [
    { label: "취소" },
    { label: "저장", primary: true, onClick: () => {
      item.snackDate = document.querySelector("#snackDateInput").value;
      item.snackStatus = "지급 예정";
      audit("간식비 예정일 입력", item.school);
      toast("간식비 예정일이 저장되었습니다.");
    }}
  ]);
}

function approveSubmissionList(id) {
  const item = state.submissions.find((row) => row.id === id);
  if (!item) return;
  const confirmed = item.works.filter(isConfirmedWork).length;
  const pending = item.works.filter(isPendingMatch).length;
  if (!confirmed) {
    toast("확인된 출품작이 없어 최종 승인할 수 없습니다.");
    return;
  }
  if (pending) {
    toast("확인 필요 작품을 먼저 수동 매칭하거나 미확인으로 정리해 주세요.");
    return;
  }
  confirmAction("출품 리스트 최종 승인", `${item.school}의 확인 작품 ${confirmed}편을 최종 승인합니다. 승인 후 활동확인서 발급 단계로 넘어갑니다.`, () => {
    item.finalApproved = true;
    state.mails.unshift({ id: `m${Date.now()}`, eventId: item.eventId, type: "출품 확인 완료", subject: `[29 WITH] 출품 확인 완료 및 활동확인서 안내`, sender: "29 WITH <no-reply@29with.kr>", scheduledAt: "관리자 확인 후", recipients: 1, status: "예약" });
    audit("출품 리스트 최종 승인", `${item.school} · ${confirmed}편`);
    toast("출품 리스트가 최종 승인되었습니다.");
  }, "최종 승인");
}

function approveCertificate(id) {
  const item = state.submissions.find((row) => row.id === id);
  if (!item.finalApproved) {
    toast("출품 리스트 최종 승인 후 활동확인서를 발급할 수 있습니다.");
    return;
  }
  const missing = item.works.filter(isConfirmedWork).some((work) => !work.student);
  if (missing) {
    toast("학생 이름 누락으로 PDF 생성이 불가합니다.");
    return;
  }
  confirmAction("활동확인서 승인/PDF 생성", `${item.school}의 최종 출품 리스트를 승인하고 PDF를 생성합니다.`, () => {
    item.certificate = "발급 완료";
    state.mails.unshift({ id: `m${Date.now()}`, eventId: item.eventId, type: "활동확인서 발급", subject: `[29 WITH] 활동확인서 다운로드 안내`, sender: "29 WITH <no-reply@29with.kr>", scheduledAt: "관리자 확인 후", recipients: 1, status: "예약" });
    audit("활동확인서 승인/PDF 생성", item.school);
    toast("활동확인서가 발급 완료 상태가 되었습니다.");
  }, "승인/PDF 생성");
}

function previewCertificate(id) {
  const item = state.submissions.find((row) => row.id === id);
  openModal("활동확인서 미리보기", certificatePreview(item), [{ label: "닫기" }]);
}

function editMail(id) {
  const mail = state.mails.find((item) => item.id === id);
  openModal("예약 메일 확인/수정", `
    <div class="form-grid">
      <label class="wide">제목<input id="mailSubjectInput" value="${mail.subject}" /></label>
      <label>발신자<input id="mailSenderInput" value="${mail.sender}" /></label>
      <label>발송일시<input id="mailDateInput" value="${mail.scheduledAt}" /></label>
      <label>수신자 수<input id="mailRecipientsInput" type="number" min="0" value="${mail.recipients}" /></label>
      <label class="wide">수신자 메모<input id="mailRecipientNoteInput" value="${mail.recipientNote || "선정/신청 상태 기준 자동 수신자"}" /></label>
      <label class="wide">본문<textarea id="mailBodyInput">${mail.body || `${mail.type} 메일 본문 초안입니다. 관리자가 발송 전 수정할 수 있습니다.`}</textarea></label>
    </div>
  `, [
    { label: "취소" },
    { label: "저장", primary: true, onClick: () => {
      const recipients = Number(document.querySelector("#mailRecipientsInput").value || 0);
      if (Number.isNaN(recipients) || recipients < 0) {
        toast("수신자 수를 확인해 주세요.");
        return false;
      }
      mail.subject = document.querySelector("#mailSubjectInput").value;
      mail.sender = document.querySelector("#mailSenderInput").value;
      mail.scheduledAt = document.querySelector("#mailDateInput").value;
      mail.recipients = recipients;
      mail.recipientNote = document.querySelector("#mailRecipientNoteInput").value;
      mail.body = document.querySelector("#mailBodyInput").value;
      audit("예약 메일 수정", mail.type);
      toast("예약 메일이 수정되었습니다.");
    }}
  ]);
}

function sendMail(id) {
  const mail = state.mails.find((item) => item.id === id);
  confirmAction("메일 즉시 발송", `${mail.subject} 메일을 지금 발송합니다. 발송 후 원본 수정은 불가하고 재발송만 가능합니다.`, () => {
    mail.status = "발송완료";
    mail.scheduledAt = new Date().toLocaleString("ko-KR");
    audit("메일 즉시 발송", mail.type);
    toast("메일이 발송 완료되었습니다.");
  }, "즉시 발송");
}

function completeRequest(id) {
  const request = state.requests.find((item) => item.id === id);
  request.status = "완료";
  audit("요청 처리 완료", request.type);
  toast("요청이 처리 완료되었습니다.");
}

function replyRequest(id) {
  const request = state.requests.find((item) => item.id === id);
  openModal("요청 답변", `
    <p><b>${request.school}</b> · ${request.type}</p>
    <p class="muted">${request.message}</p>
    <textarea id="replyInput">${request.reply || "확인 후 처리하겠습니다."}</textarea>
  `, [
    { label: "취소" },
    { label: "답변 등록", primary: true, onClick: () => {
      const reply = document.querySelector("#replyInput").value.trim();
      if (!reply) {
        toast("답변 내용을 입력해 주세요.");
        return false;
      }
      request.reply = reply;
      request.status = "답변완료";
      audit("요청 답변 등록", request.type);
      toast("답변이 등록되었습니다.");
    }}
  ]);
}

function applyEvent(eventId) {
  const event = state.events.find((item) => item.id === eventId);
  openModal("꿈프 신청서 제출", `
    <div class="form-grid">
      <label>학교명<input id="applySchoolInput" value="${state.teacherProfile.schoolName}" /></label>
      <label>출품 소속명/팀명<input id="applyAffiliationInput" value="${state.teacherProfile.schoolName}" /></label>
      <label>예상 출품편수<input id="applyCountInput" type="number" value="5" /></label>
      <label>출품 예정일<input value="2026-05-18" /></label>
      <label class="wide">중요 안내<input value="출품 소속명/팀명은 실제 출품 시 입력하는 이름과 띄어쓰기까지 동일해야 합니다." /></label>
      <label class="wide">출품 소속명/팀명 재확인<input id="applyAffiliationConfirmInput" value="${state.teacherProfile.schoolName}" /></label>
    </div>
  `, [
    { label: "취소" },
    { label: "신청서 제출", primary: true, onClick: () => {
      const count = Number(document.querySelector("#applyCountInput").value || 1);
      const school = document.querySelector("#applySchoolInput").value.trim();
      const affiliation = document.querySelector("#applyAffiliationInput").value.trim();
      const confirmAffiliation = document.querySelector("#applyAffiliationConfirmInput").value.trim();
      if (!school || !affiliation || !confirmAffiliation || count < 1) {
        toast("학교명, 출품 소속명/팀명, 예상 출품편수를 확인해 주세요.");
        return false;
      }
      if (affiliation !== confirmAffiliation) {
        toast("출품 소속명/팀명 재확인이 일치하지 않습니다.");
        return false;
      }
      const id = `a${Date.now()}`;
      const eventOrder = state.applications.filter((app) => app.eventId === eventId).length + 1;
      state.applications.push({ id, eventId, school, affiliation, teacher: state.teacherProfile.teacherName, email: state.teacherProfile.email, expected: count, date: "2026.05.18", trust: state.teacherProfile.trustStatus, order: eventOrder, status: "신청접수" });
      state.mails.unshift({ id: `m${Date.now()}`, eventId, type: "신청 완료", subject: `[29 WITH] ${event.title} 신청 완료 안내`, sender: "29 WITH <no-reply@29with.kr>", scheduledAt: "즉시", recipients: 1, status: "발송완료" });
      audit("선생님 신청서 제출", event.title);
      toast("신청이 접수되었습니다.");
    }}
  ]);
}

function showEventDetail(eventId) {
  const event = state.events.find((item) => item.id === eventId);
  openModal("행사 상세", `
    <div class="event-detail-layout">
      <div class="event-detail-poster">
        ${event.posterUrl ? `<img src="${event.posterUrl}" alt="${event.title} 포스터" />` : `<span>${event.type}</span>`}
      </div>
      <div class="detail-stack">
        <div class="detail-row"><span>행사명</span><strong>${event.title}</strong></div>
        <div class="detail-row"><span>유형</span><strong>${event.type}</strong></div>
        <div class="detail-row"><span>상태</span><strong>${event.status}</strong></div>
        <div class="detail-row"><span>공모기간</span><strong>${event.contestPeriod || event.deadlineLabel}</strong></div>
        <div class="detail-row"><span>총상금</span><strong>${event.totalPrize || "추후 공지"}</strong></div>
        <div class="detail-row"><span>주제</span><strong>${event.theme || "주제 확인 중"}</strong></div>
        <div class="detail-row"><span>홈페이지</span><strong>${event.homepageUrl || "홈페이지 준비 중"}</strong></div>
        <div class="detail-row"><span>출품 URL</span><strong>${event.submissionUrl || "출품 URL 준비 중"}</strong></div>
        <p class="muted">${event.organizerNotice || "행사 안내사항을 확인해 주세요."}</p>
        <section class="notice-panel"><strong>출품 소속명/팀명 주의</strong><span>${event.type === "29초영화제" ? "29초영화제 출품 시 입력하는 소속명" : "29역숏폼왕 출품 시 입력하는 팀명"}은 꿈프 신청 학교명과 띄어쓰기까지 동일해야 합니다.</span></section>
      </div>
    </div>
  `, [{ label: "닫기" }]);
}

function teacherInputWork(index) {
  const item = currentTeacherParticipation();
  const work = item.works[index];
  openModal("작품 링크 입력", `
    <label>작품명<input id="teacherWorkTitle" value="직접 입력 작품" /></label>
    <label>감독/출품자명<input id="teacherWorkStudent" value="학생명" /></label>
    <label>출품 URL<input id="teacherWorkUrl" value="https://submit.example/work" /></label>
  `, [
    { label: "취소" },
    { label: "저장", primary: true, onClick: () => {
      work.title = document.querySelector("#teacherWorkTitle").value;
      work.student = document.querySelector("#teacherWorkStudent").value;
      work.url = document.querySelector("#teacherWorkUrl").value;
      work.status = "관리자확인중";
      audit("선생님 작품 링크 입력", item.school);
      toast("작품 링크가 저장되었습니다.");
    }}
  ]);
}

function openTeacherProject(id) {
  const item = state.submissions.find((row) => row.id === id);
  if (!item) return;
  state.selectedTeacherParticipationId = id;
  state.selectedEventId = item.eventId;
  state.page = "teacherWorks";
  saveState();
  render();
}

function openSchoolMemo(schoolName) {
  const school = state.schools.find((item) => item.school === schoolName);
  if (!school) return;
  openModal("관리자 메모 수정", `
    <p><b>${school.school}</b> · ${school.teacher}</p>
    <label>누적 관리자 메모<textarea id="schoolMemoInput">${school.memo}</textarea></label>
  `, [
    { label: "취소" },
    { label: "저장", primary: true, onClick: () => {
      school.memo = document.querySelector("#schoolMemoInput").value;
      audit("학교 관리자 메모 수정", school.school);
      toast("학교 관리자 메모가 저장되었습니다.");
    }}
  ]);
}

function editTemplate(id) {
  const template = state.mailTemplates.find((item) => item.id === id);
  if (!template) return;
  openModal("메일 템플릿 수정", `
    <div class="form-grid">
      <label>템플릿명<input id="templateNameInput" value="${template.name}" /></label>
      <label>발신자<input id="templateSenderInput" value="${template.sender}" /></label>
      <label class="wide">제목<input id="templateSubjectInput" value="${template.subject}" /></label>
      <label class="wide">본문<textarea id="templateBodyInput">${template.body}</textarea></label>
    </div>
  `, [
    { label: "취소" },
    { label: "저장", primary: true, onClick: () => {
      template.name = document.querySelector("#templateNameInput").value;
      template.sender = document.querySelector("#templateSenderInput").value;
      template.subject = document.querySelector("#templateSubjectInput").value;
      template.body = document.querySelector("#templateBodyInput").value;
      audit("메일 템플릿 수정", template.name);
      toast("메일 템플릿이 저장되었습니다.");
    }}
  ]);
}

function toggleAdmin(id) {
  const admin = state.admins.find((item) => item.id === id);
  if (!admin || admin.role === "메인 관리자") return;
  admin.status = admin.status === "활성" ? "비활성" : "활성";
  audit("관리자 상태 변경", `${admin.email} · ${admin.status}`);
  toast(`관리자 상태가 ${admin.status}(으)로 변경되었습니다.`);
  saveState();
  render();
}

function downloadHistory(eventId) {
  const event = state.events.find((item) => item.id === eventId);
  if (!event) return;
  audit("운영 기록 다운로드", event.title);
  downloadMockFile(`29with-history-${event.id}.txt`, [
    event.title,
    `상태: ${event.closed ? "종료" : event.status}`,
    `종료일: ${event.closedAt || "-"}`,
    `선정 학교: ${event.selectedSchools}교`,
    `출품 확인: ${event.confirmedWorks}/${event.expectedWorks}`,
    `요약: ${event.closedSummary || "진행 중"}`
  ].join("\n"));
}

function openTeacherRequestModal(title, type, placeholder, work = null) {
  const project = currentTeacherParticipation();
  const event = project ? state.events.find((item) => item.id === project.eventId) : currentEvent();
  openModal(title, `
    <div class="detail-stack">
      <div class="detail-row"><span>대상 행사</span><strong>${event?.title || "선택된 꿈프"}</strong></div>
      ${work ? `<div class="detail-row"><span>대상 작품</span><strong>${work.title || "작품명 미확인"}</strong></div>` : ""}
    </div>
    <label>요청 내용<textarea id="teacherRequestMessageInput" placeholder="${placeholder}"></textarea></label>
  `, [
    { label: "취소" },
    { label: "전송", primary: true, onClick: () => {
      const message = document.querySelector("#teacherRequestMessageInput").value.trim();
      if (!message) {
        toast("요청 내용을 입력해 주세요.");
        return false;
      }
      state.requests.unshift({
        id: `r${Date.now()}`,
        eventId: project?.eventId || state.selectedEventId,
        school: state.teacherProfile.schoolName,
        type,
        message: work ? `${work.title || "작품"}: ${message}` : message,
        status: "접수"
      });
      audit(type, state.teacherProfile.schoolName);
      toast("요청이 관리자에게 전달되었습니다.");
    }}
  ]);
}

function parseDocKey(key) {
  const [participationId, indexText] = String(key || "").split(":");
  const item = state.submissions.find((row) => row.id === participationId);
  const work = item?.works[Number(indexText)];
  return { item, work, index: Number(indexText) };
}

function showTeacherDocDetail(key) {
  const { item, work, index } = parseDocKey(key);
  if (!item || !work) return;
  const event = state.events.find((row) => row.id === item.eventId);
  openModal("작품별 문서 상세", `
    <div class="detail-stack">
      <div class="detail-row"><span>행사</span><strong>${event?.title || item.eventId}</strong></div>
      <div class="detail-row"><span>작품</span><strong>${work.title || `작품 ${index + 1}`}</strong></div>
      <div class="detail-row"><span>학생/감독</span><strong>${work.student || "이름 확인 필요"}</strong></div>
      <div class="detail-row"><span>활동확인서</span><strong>${item.certificate}</strong></div>
      <div class="detail-row"><span>심사표</span><strong>${item.score}</strong></div>
      <div class="detail-row"><span>점수/순위</span><strong>${work.preliminaryScore || "-"}점 ${work.rank ? `· ${work.rank}위` : ""}</strong></div>
      <div class="detail-row"><span>작품 URL</span><strong>${work.url || "URL 없음"}</strong></div>
    </div>
  `, [{ label: "닫기" }]);
}

function openTeacherWorkDocRequest(key) {
  const { work } = parseDocKey(key);
  if (!work) return;
  openTeacherRequestModal("작품 문서 수정 요청", "작품 문서 수정 요청", "수정이 필요한 항목과 올바른 내용을 적어 주세요.", work);
}

function projectHealth(item) {
  const confirmed = item.works.filter(isConfirmedWork).length;
  const review = item.works.filter(isPendingMatch).length;
  const missing = Math.max(item.requested - confirmed, 0);
  const event = state.events.find((row) => row.id === item.eventId);
  return { event, confirmed, review, missing };
}

function eventActionSummary(event) {
  const rows = state.submissions.filter((item) => item.eventId === event.id);
  const applications = state.applications.filter((item) => item.eventId === event.id);
  const pendingApplications = applications.filter((item) => item.status === "신청접수").length;
  const reviewWorks = rows.reduce((sum, item) => sum + item.works.filter(isPendingMatch).length, 0);
  const missingWorks = rows.reduce((sum, item) => {
    const confirmed = item.works.filter(isConfirmedWork).length;
    return sum + Math.max(item.requested - confirmed, 0);
  }, 0);
  const openRequests = state.requests.filter((item) => item.eventId === event.id && item.status !== "완료").length;
  const pendingDocs = rows.filter((item) => item.finalApproved && item.certificate !== "발급 완료").length;
  return { pendingApplications, reviewWorks, missingWorks, openRequests, pendingDocs };
}

function renderAdminDashboard() {
  const event = currentEvent();
  const totals = state.events.reduce((acc, item) => {
    const summary = eventActionSummary(item);
    acc.actions += summary.pendingApplications + summary.reviewWorks + summary.missingWorks + summary.openRequests + summary.pendingDocs;
    acc.open += item.closed ? 0 : 1;
    acc.selected += item.selectedSchools || 0;
    acc.confirmed += item.confirmedWorks || 0;
    acc.expected += item.expectedWorks || 0;
    return acc;
  }, { actions: 0, open: 0, selected: 0, confirmed: 0, expected: 0 });
  const current = eventActionSummary(event);
  const nextAction = current.pendingApplications ? ["applications", "신청/선정 검토", `${current.pendingApplications}건의 신청접수를 선착순, 패널티, 성실 참여 기준으로 확인하세요.`]
    : current.reviewWorks || current.missingWorks ? ["submissions", "출품 엑셀 확인", `확인 필요 ${current.reviewWorks}건, 미확인 ${current.missingWorks}편을 정리하세요.`]
    : current.openRequests ? ["requests", "문의/요청 답변", `${current.openRequests}건의 선생님 요청에 답변이 필요합니다.`]
    : current.pendingDocs ? ["certificates", "활동확인서 승인", `${current.pendingDocs}건의 확인서 발급 상태를 마무리하세요.`]
    : ["workbox", "작업함 확인", "현재 긴급 처리 건은 없습니다. 전체 작업함에서 다음 일정을 확인하세요."];
  return `
    <section class="panel focus-panel">
      <div class="panel-head">
        <div>
          <h2>진행 중인 꿈프</h2>
          <p class="muted">여러 행사가 겹쳐도 행사별로 분리해서 보고, 카드를 누르면 모든 관리 메뉴가 해당 행사 기준으로 바뀝니다.</p>
        </div>
        <div class="modal-actions compact-actions">
          <button class="secondary" data-page="workbox" type="button">작업함</button>
          <button class="primary" data-action="create-event" type="button">새 행사 등록</button>
        </div>
      </div>
      <div class="event-strip">
        ${state.events.map((item) => {
          const summary = eventActionSummary(item);
          const workload = summary.pendingApplications + summary.reviewWorks + summary.missingWorks + summary.openRequests + summary.pendingDocs;
          return `
            <button class="event-summary ${item.id === state.selectedEventId ? "active" : ""}" data-select-event="${item.id}" type="button">
              <span>${badge(item.status)}</span>
              <strong>${item.title}</strong>
              <small>${item.type} · ${item.deadlineLabel}</small>
              <div class="mini-metrics">
                <b>선정 ${item.selectedSchools || 0}교</b>
                <b>출품 ${item.confirmedWorks || 0}/${item.expectedWorks || 0}편</b>
                <b class="${workload ? "danger-text" : ""}">처리 ${workload}건</b>
              </div>
            </button>
          `;
        }).join("")}
      </div>
    </section>
    <div class="grid four">
      ${cardStat("운영 중", `${totals.open}개`, "겹쳐 진행되는 꿈프")}
      ${cardStat("선정 학교", `${totals.selected}교`, "전체 진행 행사")}
      ${cardStat("출품 확인", `${totals.confirmed}/${totals.expected}편`, "엑셀 매칭 기준")}
      ${cardStat("처리 필요", `${totals.actions}건`, "신청, 매칭, 요청, 문서")}
    </div>
    <section class="panel action-panel">
      <div class="panel-head">
        <div>
          <h2>${event.title}</h2>
          <p class="muted">${event.type} · ${event.status} · ${event.deadlineLabel} · 목표 ${event.targetWorks || 0}편</p>
        </div>
        <div class="modal-actions compact-actions">
          <button class="secondary" data-page="eventOps" type="button">행사 설정</button>
          <button class="secondary" data-page="mails" type="button">메일 확인</button>
          <button class="primary" data-page="${nextAction[0]}" type="button">${nextAction[1]}</button>
        </div>
      </div>
      <div class="decision-row">
        <div>
          <span class="eyebrow">다음 추천 작업</span>
          <strong>${nextAction[1]}</strong>
          <p class="muted">${nextAction[2]}</p>
        </div>
        <div class="status-stack">
          ${badge(`신청 ${current.pendingApplications}건`)}
          ${badge(`매칭 확인 ${current.reviewWorks}건`)}
          ${badge(`미확인 ${current.missingWorks}편`)}
          ${badge(`요청 ${current.openRequests}건`)}
        </div>
      </div>
      <div class="ops-grid">
        <button data-page="applications" type="button"><strong>신청/선정</strong><span>선착순, 패널티, 성실 참여 기준으로 선정 처리</span></button>
        <button data-page="submissions" type="button"><strong>출품 확인</strong><span>관리자 엑셀 업로드 후 학교명/소속명 매칭 검토</span></button>
        <button data-page="benefits" type="button"><strong>혜택/지원</strong><span>구독권, 간식비 지급 예정일, 지원 상태 관리</span></button>
        <button data-page="certificates" type="button"><strong>확인서</strong><span>최종 출품 리스트 승인 후 PDF 발급</span></button>
        <button data-page="scores" type="button"><strong>심사 결과</strong><span>예심점수, 순위, 본심 진출 여부 공개</span></button>
        <button data-page="requests" type="button"><strong>문의/요청</strong><span>선생님 수정 요청과 답변 처리</span></button>
      </div>
    </section>
    <section class="panel">
      <div class="panel-head"><h2>최근 작업 이력</h2><span>등록된 모든 관리자의 주요 작업이 남습니다.</span></div>
      ${renderAudit()}
    </section>
  `;
}

function renderTeacherDashboard() {
  const projects = teacherParticipations();
  const applications = state.applications.filter((app) => app.school === state.teacherProfile.schoolName);
  const openRequests = state.requests.filter((request) => request.school === state.teacherProfile.schoolName && request.status !== "완료");
  if (!projects.length) {
    return `
      <section class="panel focus-panel">
        <div class="panel-head">
          <div><h2>아직 참여 중인 꿈프가 없습니다</h2><p class="muted">신청 가능한 행사를 먼저 확인해 주세요. 신청 후 선정 상태와 안내 메일이 이곳에 정리됩니다.</p></div>
          <button class="primary" data-page="availableEvents" type="button">신청 가능한 행사 보기</button>
        </div>
      </section>
    `;
  }
  const selected = currentTeacherParticipation() || projects[0];
  const selectedHealth = projectHealth(selected);
  const important = selectedHealth.missing ? ["teacherWorks", "미확인 작품 확인", `${selectedHealth.missing}편이 아직 출품 확인되지 않았습니다.`]
    : selected.certificate === "발급 완료" ? ["teacherDocs", "활동확인서 확인", "활동확인서가 발급되어 다운로드할 수 있습니다."]
    : selected.score === "공개 완료" ? ["teacherDocs", "심사표 확인", "심사표가 공개되었습니다."]
    : openRequests.length ? ["teacherInbox", "요청 답변 확인", `${openRequests.length}건의 문의/요청 상태를 확인하세요.`]
    : ["teacherBenefits", "혜택 일정 확인", "구독권, 간식비, 문서 발급 일정을 확인할 수 있습니다."];
  return `
    <section class="panel focus-panel">
      <div class="panel-head">
        <div>
          <h2>내 꿈프 현황</h2>
          <p class="muted">여러 행사에 동시에 참여해도 행사별로 따로 관리됩니다. 먼저 확인이 필요한 항목만 크게 보여줍니다.</p>
        </div>
        <div class="modal-actions compact-actions">
          <button class="secondary" data-page="teacherInbox" type="button">알림함</button>
          <button class="primary" data-page="${important[0]}" type="button">${important[1]}</button>
        </div>
      </div>
      <div class="event-strip">
        ${projects.map((item) => {
          const health = projectHealth(item);
          return `
            <button class="event-summary ${item.id === state.selectedTeacherParticipationId ? "active" : ""}" data-teacher-project="${item.id}" type="button">
              <span>${badge(health.missing ? "확인 필요" : "정상 진행")}</span>
              <strong>${health.event?.title || item.eventId}</strong>
              <small>${health.event?.type || ""} · 출품 소속명/팀명: ${item.affiliation}</small>
              <div class="mini-metrics">
                <b>신청 ${item.requested}편</b>
                <b>확인 ${health.confirmed}편</b>
                <b class="${health.missing ? "danger-text" : ""}">미확인 ${health.missing}편</b>
              </div>
            </button>
          `;
        }).join("")}
      </div>
    </section>
    <section class="panel action-panel">
      <div class="decision-row">
        <div>
          <span class="eyebrow">지금 확인할 일</span>
          <strong>${important[1]}</strong>
          <p class="muted">${important[2]}</p>
        </div>
        <div class="status-stack">
          ${badge(selected.certificate)}
          ${badge(selected.score)}
          ${badge(selected.snackDate ? `간식비 ${selected.snackDate}` : selected.snackStatus)}
        </div>
      </div>
      <div class="ops-grid">
        <button data-page="teacherWorks" type="button"><strong>학생/작품</strong><span>출품 확인 여부와 누락 작품 확인</span></button>
        <button data-page="teacherBenefits" type="button"><strong>혜택/지원</strong><span>구독권, 간식비 지급 예정일 확인</span></button>
        <button data-page="teacherDocs" type="button"><strong>문서</strong><span>활동확인서와 심사표 다운로드/수정 요청</span></button>
        <button data-page="teacherInbox" type="button"><strong>알림/문의</strong><span>관리자 답변, 메일, 기능 알림 확인</span></button>
      </div>
    </section>
    <section class="panel">
      <div class="panel-head"><h2>내 신청 현황</h2><span>신청이 접수되었는지, 선정되었는지 행사별로 확인합니다.</span></div>
      <div class="table-wrap">
        <table>
          <thead><tr><th>행사</th><th>출품 소속명/팀명</th><th>예상 작품</th><th>상태</th><th>신청일</th></tr></thead>
          <tbody>
            ${applications.map((app) => {
              const event = state.events.find((item) => item.id === app.eventId);
              return `<tr><td><strong>${event?.title || app.eventId}</strong><small>${event?.type || ""}</small></td><td>${app.affiliation || app.school}</td><td>${app.expected}편</td><td>${badge(app.status)}</td><td>${app.date}</td></tr>`;
            }).join("")}
          </tbody>
        </table>
      </div>
    </section>
  `;
}

function normalizeSampleContent() {
  const eventMap = {
    e1: {
      title: "제13회 박카스 29초영화제",
      type: "29초영화제",
      status: "모집중",
      deadlineLabel: "D-5",
      totalPrize: "총상금 2,000만원",
      theme: "나를 깨우는 순간",
      organizerNotice: "박카스 브랜드 메시지를 29초 안에 담아내는 영화제입니다. 꿈프 선정 학교는 출품 소속명을 학교명과 정확히 일치시켜야 합니다."
    },
    e2: {
      title: "제1회 동반성장 29역숏폼왕",
      type: "29역숏폼왕",
      status: "모집중",
      deadlineLabel: "D-12",
      totalPrize: "총상금 1,000만원",
      theme: "함께 성장하는 우리",
      organizerNotice: "사회적 가치와 동반성장을 주제로 숏폼 영상을 제작합니다. 출품 팀명을 꿈프 신청 학교명과 동일하게 입력해 주세요."
    },
    e3: {
      title: "간단요리사 29역숏폼왕",
      type: "29역숏폼왕",
      status: "심사반영",
      deadlineLabel: "마감",
      totalPrize: "총상금 500만원",
      theme: "간단하지만 특별한 요리",
      organizerNotice: "일상 속 간단한 요리 아이디어를 숏폼으로 소개하는 행사입니다."
    }
  };
  state.events.forEach((event) => {
    if (eventMap[event.id]) Object.assign(event, eventMap[event.id]);
  });
  Object.assign(state.teacherProfile, {
    schoolName: "방학중학교",
    teacherName: "김하늘",
    phone: state.teacherProfile.phone || "010-1234-5678",
    verificationDoc: state.teacherProfile.verificationDoc || "교직원 확인증.pdf",
    trustStatus: "성실 참여"
  });
  const appMap = {
    a1: ["방학중학교", "방학중학교", "김하늘", "성실 참여", "선정"],
    a2: ["서울고등학교", "서울고등학교", "박민수", "확인 필요 이력", "선정"],
    a3: ["한빛고등학교", "한빛고등학교", "정유진", "첫 참여", "예비"],
    a4: ["푸른중학교", "푸른중학교", "이소라", "첫 참여", "신청접수"],
    a5: ["방학중학교", "방학중학교", "김하늘", "성실 참여", "선정"]
  };
  state.applications.forEach((app) => {
    const row = appMap[app.id];
    if (!row) return;
    [app.school, app.affiliation, app.teacher, app.trust, app.status] = row;
  });
  state.schools = [
    { school: "방학중학교", teacher: "김하늘", email: "teacher@school.kr", history: "신청 4 · 선정 3 · 완료 3 · 미이행 0", memo: "응답 빠름, 출품명 정확" },
    { school: "서울고등학교", teacher: "박민수", email: "park@school.kr", history: "신청 2 · 선정 2 · 완료 1 · 미이행 1", memo: "공백 차이 자주 발생" },
    { school: "한빛고등학교", teacher: "정유진", email: "jung@school.kr", history: "신청 1 · 선정 1 · 완료 1 · 미이행 0", memo: "학생 이름 확인 필요" }
  ];
  const participationMap = {
    p1: ["방학중학교", "방학중학교", "지급 예정", "관리자 확인 중", "발표 후 제공", [
      ["똑같은 고민, 달라진 속도", "강하은", "자동확인", 9.2, 1, "진출"],
      ["달라진 교실", "김희야", "자동확인", 8.7, 2, "-"],
      ["내일의 속도", "노유림", "자동확인", 8.1, 3, "-"],
      ["비 오는 운동장", "이다은", "자동확인", 7.8, 4, "-"],
      ["", "", "미확인", null, null, "-"]
    ]],
    p2: ["서울고등학교", "서울고등학교", "검토 중", "발급 전", "발표 후 제공", [
      ["우리들의 여름", "최도윤", "수동확인", 8.9, 1, "진출"],
      ["골목 끝에서", "윤지후", "자동확인", 7.4, 2, "-"],
      ["종례 후", "김민재", "자동확인", 6.9, 3, "-"]
    ]],
    p3: ["방학중학교", "방학중학교", "지급 일정 확인 중", "발급 전", "발표 후 제공", [
      ["", "", "미확인", null, null, ""],
      ["", "", "미확인", null, null, ""],
      ["", "", "미확인", null, null, ""]
    ]]
  };
  state.submissions.forEach((item) => {
    const row = participationMap[item.id];
    if (!row) return;
    item.school = row[0];
    item.affiliation = row[1];
    item.snackStatus = row[2];
    item.certificate = row[3];
    item.score = row[4];
    item.works.forEach((work, index) => {
      const source = row[5][index];
      if (!source) return;
      work.title = source[0];
      work.student = source[1];
      work.status = source[2];
      work.preliminaryScore = source[3];
      work.rank = source[4];
      work.finalRound = source[5];
    });
  });
  state.requests = state.requests.map((request, index) => index === 0
    ? { ...request, school: "서울고등학교", type: "작품 확인", message: "학생 1명이 출품했는데 확인되지 않습니다.", status: "접수" }
    : { ...request, school: "방학중학교", type: "활동확인서 수정", message: "학생 이름 표기를 확인하고 싶습니다.", status: "접수" });
  state.coupons.forEach((coupon) => {
    if (coupon.code === "ABC-0001" || coupon.code === "ABC-0003") coupon.school = "방학중학교";
    if (coupon.code === "ABC-0002") coupon.school = "서울고등학교";
    if (coupon.status !== "미사용") coupon.status = "지급완료";
  });
  saveState();
}

function extractCouponCodes(rawRows) {
  const codes = [];
  rawRows.forEach((row) => {
    const entries = Array.isArray(row) ? row : Object.entries(row || {}).map(([key, value]) => [key, value]);
    entries.forEach(([key, value]) => {
      const label = normalizeColumnName(key);
      const text = String(value || "").trim();
      if (!text) return;
      const looksLikeCouponColumn = /쿠폰|coupon|code|번호/i.test(label);
      const matches = text.match(/[A-Z0-9]{2,}(?:-[A-Z0-9]{2,})+/gi) || [];
      if (looksLikeCouponColumn && !matches.length && text.length >= 3) codes.push(text);
      matches.forEach((code) => codes.push(code.toUpperCase()));
    });
  });
  return [...new Set(codes.map((code) => code.trim()).filter(Boolean))];
}

async function parseCouponFile(file) {
  if (!file) return ["ABC-0005", "ABC-0006"];
  const lowerName = file.name.toLowerCase();
  if ((lowerName.endsWith(".xlsx") || lowerName.endsWith(".xls")) && globalThis.XLSX) {
    const workbook = globalThis.XLSX.read(await file.arrayBuffer(), { type: "array" });
    const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
    const rawRows = globalThis.XLSX.utils.sheet_to_json(firstSheet, { defval: "" });
    return extractCouponCodes(rawRows);
  }
  const text = await file.text();
  const rawRows = lowerName.endsWith(".csv") ? parseCsvRows(text) : parseHtmlTableRows(text);
  if (!rawRows.length && (lowerName.endsWith(".xlsx") || lowerName.endsWith(".xls"))) {
    throw new Error("엑셀 파서가 로드되지 않았습니다. 인터넷 연결 후 다시 열거나 CSV/HTML XLS 파일을 사용해 주세요.");
  }
  return extractCouponCodes(rawRows);
}

async function readTemplateReference(file) {
  if (!file) {
    return {
      name: "샘플 활동확인서 레퍼런스",
      status: "분석 완료",
      updatedAt: new Date().toLocaleDateString("ko-KR"),
      mimeType: "sample",
      dataUrl: ""
    };
  }
  const dataUrl = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("템플릿 파일을 읽지 못했습니다."));
    reader.readAsDataURL(file);
  });
  return {
    name: file.name,
    status: file.type.includes("image") ? "이미지 레퍼런스 적용" : "레퍼런스 등록 완료",
    updatedAt: new Date().toLocaleDateString("ko-KR"),
    mimeType: file.type || "unknown",
    dataUrl
  };
}

function renderBenefits() {
  return `
    <div class="grid three">
      ${cardStat("구독권 재고", `${state.coupons.filter((coupon) => coupon.status === "미사용").length}개`, "미사용 쿠폰")}
      ${cardStat("지급 완료", `${state.coupons.filter((coupon) => coupon.status === "지급완료").length}개`, "선정 학교 자동 지급")}
      <div class="stat action-stat">
        <span>쿠폰 엑셀</span>
        <strong>업로드</strong>
        <input id="couponExcelInput" type="file" accept=".xls,.xlsx,.csv" />
        <button class="secondary" data-action="upload-coupons" type="button">쿠폰 번호 인식</button>
      </div>
    </div>
    <section class="notice-panel"><strong>쿠폰 인식 기준</strong><span>쿠폰번호, coupon, code, 번호 컬럼을 우선 확인하고, 값 안의 ABC-0001 같은 번호 패턴도 자동 추출합니다. 중복 번호는 추가하지 않습니다.</span></section>
    <section class="panel">
      <div class="panel-head"><h2>혜택/지원</h2><span>간식비 지급 예정일은 선생님 대시보드에 표시됩니다.</span></div>
      <div class="table-wrap">
        <table>
          <thead><tr><th>학교</th><th>구독권</th><th>쿠폰번호</th><th>간식비</th><th>예정일</th><th>문구</th><th>조치</th></tr></thead>
          <tbody>
            ${eventParticipations().map((item) => `
              <tr>
                <td><strong>${item.school}</strong></td>
                <td>${badge(item.couponCode ? "지급 완료" : "재고 없음")}</td>
                <td>${item.couponCode || "-"}</td>
                <td>${badge(item.snackStatus)}</td>
                <td>${item.snackDate || "-"}</td>
                <td>${item.snackDate ? "출품 확인 완료 학교 대상으로 순차 지급됩니다." : "일정이 확정되면 안내됩니다."}</td>
                <td><button class="secondary" data-snack="${item.id}" type="button">예정일 입력</button></td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    </section>
  `;
}

function renderCertificates() {
  const rows = eventParticipations();
  return `
    <div class="toolbar">
      <input id="certificateTemplateInput" type="file" accept=".png,.jpg,.jpeg,.webp,.pdf" />
      <button class="secondary" data-action="upload-template" type="button">확인서 레퍼런스 적용</button>
      <span class="muted">현재 템플릿: ${state.certificateTemplate.name} · ${state.certificateTemplate.status} · ${state.certificateTemplate.updatedAt}</span>
    </div>
    <div class="grid two">
      <section class="panel">
        <div class="panel-head"><h2>활동확인서</h2><span>최종 승인 후 PDF 다운로드 가능</span></div>
        <div class="table-wrap">
          <table>
            <thead><tr><th>학교</th><th>작품</th><th>학생 이름</th><th>출품 리스트</th><th>발급 상태</th><th>다음 단계</th><th>조치</th></tr></thead>
            <tbody>
              ${rows.map((item) => {
                const confirmed = item.works.filter(isConfirmedWork);
                const missingNames = confirmed.some((work) => !work.student);
                return `
                  <tr>
                    <td><strong>${item.school}</strong></td>
                    <td>${confirmed.length}편</td>
                    <td>${missingNames ? badge("이름 확인 필요") : "확인 완료"}</td>
                    <td>${badge(item.finalApproved ? "최종 승인" : "승인 대기")}</td>
                    <td>${badge(item.certificate)}</td>
                    <td>${certificateBlockReason(item)}</td>
                    <td>
                      <button class="secondary" data-certificate-preview="${item.id}" type="button">미리보기</button>
                      <button class="primary" ${item.finalApproved && !missingNames ? "" : "disabled"} data-certificate-approve="${item.id}" type="button">승인/PDF</button>
                    </td>
                  </tr>
                `;
              }).join("")}
            </tbody>
          </table>
        </div>
      </section>
      ${certificatePreview(rows[0])}
    </div>
  `;
}

function certificatePreview(item) {
  const works = item?.works.filter(isConfirmedWork) || [];
  const template = state.certificateTemplate || {};
  const imageTemplate = String(template.mimeType || "").includes("image") && template.dataUrl;
  return `
    <section class="certificate-preview ${imageTemplate ? "with-template" : ""}">
      ${imageTemplate ? `<img class="template-preview-image" src="${template.dataUrl}" alt="${template.name}" />` : ""}
      <div class="certificate-text-layer">
        <span>제 2602 호</span>
        <div class="logo">29</div>
        <h2>활동확인서</h2>
        <p><b>학교:</b> ${item?.school || "학교명"}</p>
        <p><b>작품명:</b> ${works.map((work) => work.title).filter(Boolean).join(", ") || "작품명"}</p>
        <p><b>이름:</b> ${works.map((work) => work.student).filter(Boolean).join(", ") || "학생명"}</p>
        <p>위 학생은 2026년 4월 8일부터 2026년 5월 21일까지<br />영상 꿈나무 양성 프로젝트에서 성실히 활동하였기에 이 증서를 수여합니다.</p>
        <strong>2026. 7. 1.</strong>
      </div>
    </section>
  `;
}

const baseHandleAction = handleAction;
handleAction = function enhancedHandleAction(action) {
  if (action === "upload-coupons") {
    const file = document.querySelector("#couponExcelInput")?.files?.[0];
    if (!file) {
      const nextA = `ABC-${String(state.coupons.length + 1).padStart(4, "0")}`;
      const nextB = `ABC-${String(state.coupons.length + 2).padStart(4, "0")}`;
      state.coupons.push({ code: nextA, status: "미사용", school: "" }, { code: nextB, status: "미사용", school: "" });
      audit("쿠폰 엑셀 업로드", `샘플 2개 인식 · 총 ${state.coupons.length}개`);
      toast("샘플 쿠폰 2개가 추가되었습니다.");
      saveState();
      render();
      return;
    }
    parseCouponFile(file).then((codes) => {
      const existing = new Set(state.coupons.map((coupon) => coupon.code));
      const newCodes = codes.filter((code) => !existing.has(code));
      newCodes.forEach((code) => state.coupons.push({ code, status: "미사용", school: "" }));
      audit("쿠폰 엑셀 업로드", `${newCodes.length}개 인식 · 총 ${state.coupons.length}개`);
      toast(file ? `쿠폰 번호 ${newCodes.length}개를 인식했습니다.` : "샘플 쿠폰 2개가 추가되었습니다.");
      saveState();
      render();
    }).catch((error) => toast(error.message || "쿠폰 파일 분석 중 오류가 발생했습니다."));
    return;
  }
  if (action === "upload-template") {
    const file = document.querySelector("#certificateTemplateInput")?.files?.[0];
    if (!file) {
      state.certificateTemplate = {
        name: "샘플 활동확인서 레퍼런스",
        status: "분석 완료",
        updatedAt: new Date().toLocaleDateString("ko-KR"),
        mimeType: "sample",
        dataUrl: ""
      };
      audit("확인서 레퍼런스 업로드", state.certificateTemplate.name);
      toast("샘플 활동확인서 레퍼런스를 적용했습니다.");
      saveState();
      render();
      return;
    }
    readTemplateReference(file).then((template) => {
      state.certificateTemplate = template;
      audit("확인서 레퍼런스 업로드", template.name);
      toast(file ? "활동확인서 레퍼런스를 적용했습니다." : "샘플 활동확인서 레퍼런스를 적용했습니다.");
      saveState();
      render();
    }).catch((error) => toast(error.message || "확인서 레퍼런스 적용 중 오류가 발생했습니다."));
    return;
  }
  return baseHandleAction(action);
};

normalizeSampleContent();
render();
