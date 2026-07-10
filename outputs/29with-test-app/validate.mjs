import fs from "node:fs/promises";
import vm from "node:vm";

const source = await fs.readFile(new URL("./app.js", import.meta.url), "utf8");
const styles = await fs.readFile(new URL("./styles.css", import.meta.url), "utf8");

class StubElement {
  constructor(selector) {
    this.selector = selector;
    this.innerHTML = "";
    this.textContent = "";
    this.value = "";
    this.dataset = {};
    this.listeners = {};
    this.classList = {
      values: new Set(),
      add: (name) => this.classList.values.add(name),
      remove: (name) => this.classList.values.delete(name),
      toggle: (name, force) => {
        if (force) this.classList.values.add(name);
        else this.classList.values.delete(name);
      }
    };
  }

  addEventListener(name, handler) {
    this.listeners[name] = handler;
  }

  showModal() {
    this.open = true;
  }

  close() {
    this.open = false;
  }
}

const elements = new Map();
const byData = new Map();

function element(selector) {
  if (!elements.has(selector)) elements.set(selector, new StubElement(selector));
  return elements.get(selector);
}

function parseRenderedDataElements() {
  byData.clear();
  const html = [...elements.values()].map((item) => item.innerHTML).join("\n");
  const regex = /data-([a-z-]+)="([^"]*)"/g;
  let match;
  while ((match = regex.exec(html))) {
    const [, key, value] = match;
    const selector = `[data-${key}]`;
    if (!byData.has(selector)) byData.set(selector, []);
    const stub = new StubElement(selector);
    const prop = key.replace(/-([a-z])/g, (_, char) => char.toUpperCase());
    stub.dataset[prop] = value;
    byData.get(selector).push(stub);
  }
}

const storage = new Map();
const context = {
  console,
  Date,
  Math,
  Number,
  String,
  Array,
  Object,
  localStorage: {
    getItem: (key) => storage.get(key) || null,
    setItem: (key, value) => storage.set(key, String(value)),
    removeItem: (key) => storage.delete(key)
  },
  setTimeout: (handler) => {
    if (typeof handler === "function") handler();
    return 1;
  },
  document: {
    querySelector(selector) {
      return element(selector);
    },
    querySelectorAll(selector) {
      parseRenderedDataElements();
      return byData.get(selector) || [];
    }
  }
};

vm.createContext(context);
vm.runInContext(`${source}
globalThis.__getState = () => state;
`, context, { filename: "app.js" });

const requiredPages = [
  "adminDashboard",
  "workbox",
  "eventOps",
  "members",
  "applications",
  "submissions",
  "benefits",
  "certificates",
  "scores",
  "mails",
  "requests",
  "settings",
  "history",
  "qaChecklist",
  "teacherDashboard",
  "availableEvents",
  "teacherWorks",
  "teacherBenefits",
  "teacherInbox",
  "teacherDocs",
  "teacherHistory",
  "teacherProfile"
];

const pageResults = requiredPages.map((page) => {
  context.setPage(page);
  return {
    page,
    title: element("#pageTitle").textContent,
    appLength: element("#app").innerHTML.length
  };
});

const actionNames = [...source.matchAll(/data-action="([^"]+)"/g)].map((match) => match[1]);
const handledNames = [...source.matchAll(/action === "([^"]+)"/g)].map((match) => match[1]);
const missingHandlers = [...new Set(actionNames.filter((name) => !handledNames.includes(name)))];
const emptyPages = pageResults.filter((item) => item.appLength < 50);
const flowErrors = [];
const styleErrors = [];
const unboundStaticButtons = [...source.matchAll(/<button(?![^>]*(data-action|data-page|data-role|data-select-event|data-select-application|data-wait-application|data-open-participation|data-request-participation|data-approve-submission|data-snack|data-certificate-approve|data-certificate-preview|data-mail-edit|data-mail-send|data-request-done|data-request-reply|data-apply-event|data-event-detail|data-input-work|data-teacher-project|data-school-memo|data-template-edit|data-admin-toggle|data-history-download|data-teacher-doc-detail|data-teacher-doc-request|id=|data-modal-action|value=))[^>]*type="button"[^>]*>([^<]+)<\/button>/g)].map((match) => match[2].trim());

function assertFlow(name, condition, details = "") {
  if (!condition) flowErrors.push({ name, details });
}

function confirmModal(index = 1) {
  const actions = byData.get("[data-modal-action]") || [];
  const target = actions[index];
  if (!target?.listeners?.click) {
    flowErrors.push({ name: "modal confirm", details: `No modal action at index ${index}` });
    return;
  }
  target.listeners.click();
}

function state() {
  return context.__getState();
}

function eventById(id) {
  return state().events.find((event) => event.id === id);
}

function participationById(id) {
  return state().submissions.find((item) => item.id === id);
}

function assertStyle(name, condition) {
  if (!condition) styleErrors.push(name);
}

assertStyle("desktop shell layout", styles.includes("grid-template-columns: 260px minmax(0, 1fr)"));
assertStyle("tablet breakpoint", styles.includes("@media (max-width: 980px)"));
assertStyle("mobile breakpoint", styles.includes("@media (max-width: 640px)"));
assertStyle("mobile stacked actions", styles.includes(".top-actions,\n  .toolbar,\n  .modal-actions"));
assertStyle("table horizontal scroll", styles.includes(".table-wrap") && styles.includes("overflow-x: auto"));
assertStyle("disabled button affordance", styles.includes("button:disabled"));
assertStyle("target overrun notice", styles.includes(".notice-panel") && styles.includes("var(--warn-soft)"));
assertStyle("qa checklist layout", styles.includes(".qa-item") && styles.includes(".qa-list"));
assertStyle("selected history row", styles.includes(".selected-row"));
assertStyle("event poster detail layout", styles.includes(".event-detail-layout") && styles.includes(".event-mini-poster"));
assertStyle("equal height cards", styles.includes(".equal-card") && styles.includes("margin-top: auto"));

context.setEvent("e1");
context.setPage("workbox");
assertFlow("workbox renders pending tasks", element("#app").innerHTML.includes("관리자 작업함") && element("#app").innerHTML.includes("출품 확인"));
context.setPage("applications");
context.setFilter("applications", "푸른중학교");
assertFlow("application search filters rows", element("#app").innerHTML.includes("푸른중학교") && !element("#app").innerHTML.includes("서울고등학교"));
context.setFilter("applications", "");
context.setPage("applications");
assertFlow("application selection guidance renders", element("#app").innerHTML.includes("목표 작품 수") && element("#app").innerHTML.includes("성실 참여 우선") && element("#app").innerHTML.includes("미이행 이력 후순위"));
context.handleAction("select-recommended");
assertFlow("recommended selection respects target capacity", state().selectedApplicationIds.includes("a4") && !state().selectedApplicationIds.includes("a3"));
context.setFilter("applications", "푸른중학교");
context.handleAction("select-visible-applications");
assertFlow("visible application selection stores ids", state().selectedApplicationIds.includes("a4") && state().selectedApplicationIds.length === 1);
context.handleAction("bulk-reject");
confirmModal();
assertFlow("bulk reject updates status", state().applications.find((item) => item.id === "a4")?.status === "미선정");
context.setFilter("applications", "");
context.setPage("applications");
context.toggleApplicationSelection("a3", true);
context.handleAction("bulk-wait");
confirmModal();
assertFlow("bulk wait updates status", state().applications.find((item) => item.id === "a3")?.status === "예비");
context.toggleApplicationSelection("a4", true);
const beforeBulkSelectionCount = state().submissions.length;
context.handleAction("bulk-select");
confirmModal();
assertFlow("bulk select creates participation", state().submissions.length === beforeBulkSelectionCount + 1 && state().applications.find((item) => item.id === "a4")?.status === "선정");
const selectedParticipation = state().submissions.find((item) => item.applicationId === "a4");
assertFlow("selection assigns newspaper coupon", Boolean(selectedParticipation?.couponCode) && state().coupons.some((coupon) => coupon.code === selectedParticipation.couponCode && coupon.status === "지급완료"));
context.toggleApplicationSelection("a3", true);
context.handleAction("bulk-resend");
assertFlow("bulk resend creates reserved mail", state().mails.some((mail) => mail.type === "선택 메일 재발송"));
context.handleAction("bulk-export");
assertFlow("bulk export records audit", state().audit.some((item) => item.action === "선택 신청자 엑셀 다운로드"));
context.setPage("members");
context.setFilter("members", "공백 차이");
assertFlow("member search filters memo text", element("#app").innerHTML.includes("서울고등학교") && !element("#app").innerHTML.includes("방학중학교"));
context.setFilter("members", "");
context.setPage("submissions");
context.setFilter("submissions", "검색없음");
assertFlow("submission search shows empty state", element("#app").innerHTML.includes("검색 결과가 없습니다."));
context.setFilter("submissions", "");
context.handleAction("export-members");
assertFlow("member export records audit", state().audit.some((item) => item.action === "회원/참여 학교 다운로드"));
context.handleAction("download-pdf");
assertFlow("document download records audit", state().audit.some((item) => item.action === "PDF 다운로드"));
context.setPage("qaChecklist");
assertFlow("qa checklist links core test flows", element("#app").innerHTML.includes("테스트 체크리스트") && element("#app").innerHTML.includes("출품 확인") && element("#app").innerHTML.includes("선생님 화면"));
context.setPage("history");
assertFlow("history shows selected event target", element("#app").innerHTML.includes("종료 대상") && !element("#app").innerHTML.includes("선택 꿈프 종료 테스트"));
context.setEvent("e2");
context.downloadHistory("e1");
assertFlow("history download uses row event", state().audit[0]?.action === "운영 기록 다운로드" && state().audit[0]?.entity === "제13회 박카스 29초영화제");

context.setEvent("e1");
context.setPage("settings");
element("#settingExternalKeyInput").value = "festival_verify_settings";
element("#settingEventTypeInput").value = "29초영화제";
element("#settingDbTypeInput").value = "29초영화제 엑셀";
element("#settingAccessStatusInput").value = "엑셀 업로드 사용";
element("#settingHostInput").value = "관리자 출품작 목록 검증";
element("#settingRequiredFieldsInput").value = "소속, 작품제목, 감독, 예심평점";
element("#prefSenderNameInput").value = "검증 운영팀";
element("#prefSenderEmailInput").value = "verify@29with.kr";
element("#prefSignupNoticeInput").value = "검증 업무용 이메일 안내";
context.handleAction("save-settings");
assertFlow("excel settings save persists values", eventById("e1")?.externalKey === "festival_verify_settings" && state().integrationSettings.e1?.host === "관리자 출품작 목록 검증" && state().adminPreferences.senderEmail === "verify@29with.kr");
context.handleAction("test-connection");
assertFlow("excel format check stores status", state().integrationSettings.e1?.accessStatus === "양식 점검 완료" && state().integrationSettings.e1?.lastTest !== "미실행");

context.handleAction("create-event");
element("#newEventTitleInput").value = "검증 신규 꿈프";
element("#newEventTypeInput").value = "29초영화제";
element("#newEventStatusInput").value = "예정";
element("#newEventDeadlineInput").value = "D-30";
element("#newEventTargetWorksInput").value = "100";
element("#newEventExternalKeyInput").value = "verify_new_event";
element("#newEventContestPeriodInput").value = "2026.08.01 - 2026.08.31";
element("#newEventTotalPrizeInput").value = "총상금 300만원";
element("#newEventThemeInput").value = "검증 주제";
element("#newEventPosterUrlInput").value = "https://dummyimage.com/420x594/edf2ff/24315f&text=Verify";
element("#newEventHomepageUrlInput").value = "https://verify.example/home-new";
element("#newEventSubmissionUrlInput").value = "https://verify.example/submit-new";
element("#newEventOrganizerNoticeInput").value = "검증 행사 안내";
element("#newEventAdminUrlInput").value = "검증 신규 엑셀";
confirmModal();
const createdEventId = state().selectedEventId;
context.setPage("eventOps");
element("#eventTitleInput").value = "검증 수정 29초영화제";
element("#eventTypeInput").value = "29역숏폼왕";
element("#eventDeadlineInput").value = "D-20";
element("#eventExternalKeyInput").value = "verify_external_event";
element("#eventContestPeriodInput").value = "2026.09.01 - 2026.09.30";
element("#eventTotalPrizeInput").value = "총상금 700만원";
element("#eventThemeInput").value = "검증 수정 주제";
element("#eventPosterUrlInput").value = "https://dummyimage.com/420x594/eafaf0/145c36&text=Updated";
element("#eventHomepageUrlInput").value = "https://verify.example/home";
element("#eventSubmissionUrlInput").value = "https://verify.example/submit";
element("#eventOrganizerNoticeInput").value = "검증 수정 안내";
element("#eventAdminUrlInput").value = "검증 출품작 엑셀";
element("#eventTargetWorksInput").value = "77";
context.handleAction("save-event");
assertFlow("event save updates editable fields", eventById(createdEventId)?.title === "검증 수정 29초영화제" && eventById(createdEventId)?.targetWorks === 77 && eventById(createdEventId)?.adminUrl === "검증 출품작 엑셀" && eventById(createdEventId)?.theme === "검증 수정 주제" && eventById(createdEventId)?.totalPrize === "총상금 700만원");
context.handleAction("deactivate-event");
confirmModal();
assertFlow("event deactivate keeps history state", eventById(createdEventId)?.closed === true && eventById(createdEventId)?.status === "비활성" && Boolean(eventById(createdEventId)?.closedAt));

context.setEvent("e2");
context.setPage("submissions");
const beforeExcel = eventById("e2").confirmedWorks;
context.handleAction("upload-submission-excel");
confirmModal();
assertFlow("excel upload analyzes school affiliation matches", eventById("e2").confirmedWorks > beforeExcel && state().excelImports.e2?.autoMatched > 0 && state().excelImports.e2?.needsReview > 0, `before=${beforeExcel}, after=${eventById("e2").confirmedWorks}`);
assertFlow("similar excel matches require admin review", participationById("p3")?.works.some((work) => work.status === "확인필요" && work.issueReason.includes("유사 일치")));

const beforeSelectionCount = state().submissions.length;
context.selectApplication("a4", "선정");
confirmModal();
assertFlow("selection keeps participation unique", state().submissions.length === beforeSelectionCount, `before=${beforeSelectionCount}, after=${state().submissions.length}`);
assertFlow("selection updates application status", state().applications.find((item) => item.id === "a4")?.status === "선정");

context.setEvent("e2");
context.setPage("submissions");
assertFlow("submission page shows excel match guidance", element("#app").innerHTML.includes("엑셀 소속") && element("#app").innerHTML.includes("확인 필요"));
const beforeMatchRequests = state().requests.length;
context.requestParticipationCheck("p3");
assertFlow("participation check request targets school", state().requests.length === beforeMatchRequests + 1 && state().requests[0].school === "방학중학교" && state().requests[0].message.includes("미확인"));
const beforeManual = eventById("e2").confirmedWorks;
context.openParticipation("p3");
confirmModal(2);
assertFlow("manual match updates event stats", eventById("e2").confirmedWorks > beforeManual && participationById("p3")?.works.some((work) => work.issueReason === "관리자 수동 매칭 완료"), `before=${beforeManual}, after=${eventById("e2").confirmedWorks}`);

context.setEvent("e1");
context.setPage("certificates");
assertFlow("certificate page shows approval prerequisites", element("#app").innerHTML.includes("출품 리스트") && element("#app").innerHTML.includes("승인 대기") && element("#app").innerHTML.includes("출품 리스트 최종 승인 대기"));
context.approveSubmissionList("p1");
confirmModal();
assertFlow("submission final approval unlocks certificate step", participationById("p1")?.finalApproved === true && state().mails.some((mail) => mail.type === "출품 확인 완료"));
context.setPage("certificates");
assertFlow("certificate page shows final approval state", element("#app").innerHTML.includes("최종 승인") && element("#app").innerHTML.includes("활동확인서 PDF 생성 대기"));
context.approveCertificate("p1");
confirmModal();
assertFlow("certificate approval updates status", participationById("p1")?.certificate === "발급 완료");

context.handleAction("sync-scores");
context.handleAction("publish-scores");
assertFlow("score publication updates teacher status", participationById("p1")?.score === "공개 완료");
context.setPage("scores");
assertFlow("score page shows publication summary", element("#app").innerHTML.includes("심사표 공개") && element("#app").innerHTML.includes("본심 표시"));

context.setRole("teacher");
context.setEvent("e1");
context.setPage("teacherDocs");
assertFlow("teacher docs show document work list", element("#app").innerHTML.includes("작품별 문서 준비 상태") && element("#app").innerHTML.includes("자세히") && element("#app").innerHTML.includes("수정 요청"));
context.showTeacherDocDetail("p1:0");
assertFlow("teacher doc detail opens work modal", element("#modalBody").innerHTML.includes("작품별 문서 상세") || element("#modalTitle").textContent.includes("작품별 문서 상세"));
context.openTeacherProject("p3");
context.teacherInputWork(1);
element("#teacherWorkTitle").value = "선생님 직접 확인 작품";
element("#teacherWorkStudent").value = "학생 테스트";
element("#teacherWorkUrl").value = "https://submit.example/test";
confirmModal();
assertFlow("teacher work input is scoped to selected project", participationById("p3")?.works[1]?.status === "관리자확인중");
assertFlow("teacher project selection follows event", state().selectedEventId === "e2");
assertFlow("teacher project switcher appears on project pages", element("#app").innerHTML.includes("project-switcher") && element("#app").innerHTML.includes("제1회 동반성장 29역숏폼왕"));

context.setPage("teacherProfile");
assertFlow("teacher profile starts readonly", element("#app").innerHTML.includes("학교명 변경 요청") && !element("#app").innerHTML.includes("profileTeacherInput"));
context.handleAction("edit-profile");
assertFlow("teacher profile edit mode exposes save fields", element("#app").innerHTML.includes("profileTeacherInput") && element("#app").innerHTML.includes("profilePhoneInput"));
element("#profileTeacherInput").value = "김하늘 검증";
element("#profileEmailInput").value = "teacher-verify@school.kr";
element("#profilePhoneInput").value = "010-9999-0000";
element("#profileVerificationInput").value = "검증 교직원 확인증.pdf";
context.handleAction("save-profile");
assertFlow("teacher profile save updates editable fields", state().teacherProfile.teacherName === "김하늘 검증" && state().teacherProfile.phone === "010-9999-0000" && state().teacherProfile.verificationDoc.includes("확인증") && state().teacherProfile.schoolName === "방학중학교" && state().teacherProfile.editMode === false);
context.handleAction("profile-change");
element("#schoolChangeNewNameInput").value = "방학중학교 변경";
element("#schoolChangeReasonInput").value = "검증 변경 요청";
confirmModal();
assertFlow("school name change request uses modal and preserves profile school", state().teacherProfile.schoolName === "방학중학교" && state().requests[0]?.type === "학교명 변경" && state().requests[0]?.message.includes("방학중학교 변경"));
context.setEvent("e1");
context.setPage("teacherBenefits");
assertFlow("teacher benefits show assigned coupon", element("#app").innerHTML.includes("ABC-0001"));

const beforeBadApply = state().applications.length;
context.applyEvent("e3");
element("#applySchoolInput").value = "방학중학교";
element("#applyAffiliationInput").value = "방학중학교 A";
element("#applyAffiliationConfirmInput").value = "방학중학교 B";
confirmModal();
assertFlow("application blocks mismatched affiliation confirmation", state().applications.length === beforeBadApply);

context.applyEvent("e3");
element("#applySchoolInput").value = "방학중학교";
element("#applyAffiliationInput").value = "방학중학교 A";
element("#applyAffiliationConfirmInput").value = "방학중학교 A";
element("#applyCountInput").value = "4";
confirmModal();
assertFlow("application with matching affiliation is accepted", state().applications.length === beforeBadApply + 1);
context.setPage("teacherDashboard");
assertFlow("teacher dashboard shows application status list", element("#app").innerHTML.includes("내 신청 현황") && element("#app").innerHTML.includes("방학중학교 A"));
context.setPage("availableEvents");
assertFlow("available events show existing application status", element("#app").innerHTML.includes("신청접수") && element("#app").innerHTML.includes("4편 신청"));
assertFlow("available events show rich festival info", element("#app").innerHTML.includes("총상금") && element("#app").innerHTML.includes("주제") && element("#app").innerHTML.includes("공모기간"));
context.showEventDetail("e1");
assertFlow("teacher event detail shows poster prize theme notice", element("#modalBody").innerHTML.includes("총상금") && element("#modalBody").innerHTML.includes("주제") && element("#modalBody").innerHTML.includes("포스터") && element("#modalBody").innerHTML.includes("출품 소속명/팀명 주의"));

context.setRole("admin");
context.setEvent("e1");
const beforeCoupons = state().coupons.length;
context.handleAction("upload-coupons");
assertFlow("coupon upload adds inventory", state().coupons.length === beforeCoupons + 2);
context.handleAction("upload-template");
assertFlow("certificate template upload updates status", state().certificateTemplate.status === "분석 완료");
const beforeAdmins = state().admins.length;
context.handleAction("add-admin");
assertFlow("admin add creates account", state().admins.length === beforeAdmins + 1);
const addedAdmin = state().admins[state().admins.length - 1];
context.toggleAdmin(addedAdmin.id);
assertFlow("admin toggle changes status", state().admins.find((item) => item.id === addedAdmin.id)?.status === "비활성");
const beforeTemplates = state().mailTemplates.length;
context.handleAction("add-template");
assertFlow("mail template add creates template", state().mailTemplates.length === beforeTemplates + 1);
const template = state().mailTemplates[0];
context.editTemplate(template.id);
element("#templateNameInput").value = "검증 템플릿";
element("#templateSenderInput").value = "29 WITH <verify@29with.kr>";
element("#templateSubjectInput").value = "[검증] 템플릿";
element("#templateBodyInput").value = "검증 본문";
confirmModal();
assertFlow("mail template edit updates content", state().mailTemplates.find((item) => item.id === template.id)?.subject === "[검증] 템플릿");
context.openSchoolMemo("방학중학교");
element("#schoolMemoInput").value = "검증용 관리자 메모";
confirmModal();
assertFlow("school memo is saved", state().schools.find((item) => item.school === "방학중학교")?.memo === "검증용 관리자 메모");

context.setEvent("e1");
context.openSnackModal("p1");
element("#snackDateInput").value = "2026-07-20";
confirmModal();
assertFlow("snack date updates teacher benefit", participationById("p1")?.snackDate === "2026-07-20");

const editableMail = state().mails.find((mail) => mail.eventId === "e1");
context.editMail(editableMail.id);
element("#mailSubjectInput").value = "[29 WITH] 수정된 테스트 메일";
element("#mailSenderInput").value = "29 WITH <test@29with.kr>";
element("#mailDateInput").value = "2026-07-20 10:30";
element("#mailRecipientsInput").value = "33";
element("#mailRecipientNoteInput").value = "검증 수신자 메모";
element("#mailBodyInput").value = "검증 메일 본문";
confirmModal();
assertFlow("mail edit updates message fields", state().mails.find((mail) => mail.id === editableMail.id)?.subject === "[29 WITH] 수정된 테스트 메일" && state().mails.find((mail) => mail.id === editableMail.id)?.recipients === 33 && state().mails.find((mail) => mail.id === editableMail.id)?.body === "검증 메일 본문");
context.sendMail(editableMail.id);
confirmModal();
assertFlow("mail send updates status", state().mails.find((mail) => mail.id === editableMail.id)?.status === "발송완료");

const beforeDocRequests = state().requests.length;
context.setRole("teacher");
context.setEvent("e1");
context.handleAction("request-doc-change");
element("#teacherRequestMessageInput").value = "활동확인서 학생 이름 수정 요청";
confirmModal();
assertFlow("teacher document request creates admin request", state().requests.length === beforeDocRequests + 1);
const createdRequest = state().requests[0];
const beforeQuestionRequests = state().requests.length;
context.handleAction("teacher-question");
element("#teacherRequestMessageInput").value = "심사표 점수 문의입니다.";
confirmModal();
assertFlow("teacher question creates typed request", state().requests.length === beforeQuestionRequests + 1 && state().requests[0]?.type === "문서/심사표 문의");
context.setRole("admin");
context.setEvent(createdRequest.eventId);
context.replyRequest(createdRequest.id);
element("#replyInput").value = "검증 답변입니다.";
confirmModal();
assertFlow("admin request reply is saved", state().requests.find((request) => request.id === createdRequest.id)?.reply === "검증 답변입니다.");
context.completeRequest(createdRequest.id);
assertFlow("admin request completion updates status", state().requests.find((request) => request.id === createdRequest.id)?.status === "완료");
context.setRole("teacher");
context.setPage("teacherInbox");
assertFlow("teacher inbox shows request reply", element("#app").innerHTML.includes("검증 답변입니다."));

context.setRole("admin");
context.setEvent("e1");
context.handleAction("close-event");
confirmModal();
assertFlow("event close moves event to history status", eventById("e1")?.closed === true && eventById("e1")?.status === "종료" && Boolean(eventById("e1")?.closedSummary));

if (unboundStaticButtons.length) {
  flowErrors.push({ name: "unbound static buttons", details: unboundStaticButtons.join(", ") });
}

if (missingHandlers.length || emptyPages.length || flowErrors.length || styleErrors.length) {
  console.error(JSON.stringify({ missingHandlers, emptyPages, flowErrors, styleErrors, unboundStaticButtons }, null, 2));
  process.exit(1);
}

console.log(JSON.stringify({
  ok: true,
  checkedPages: pageResults.length,
  actions: [...new Set(actionNames)].sort(),
  checkedFlows: [
    "excel upload matching",
    "selection",
    "coupon assignment",
    "manual matching",
    "match failure request handling",
    "submission final approval",
    "certificate approval",
    "score publication",
    "document availability messaging",
    "teacher scoped work input",
    "teacher project switcher/application status",
    "teacher rich event detail",
    "teacher profile edit/request modal",
    "teacher document list/detail/request modal",
    "teacher profile save",
    "affiliation confirmation",
    "snack date",
    "mail edit/send",
    "excel settings save/format check",
    "teacher document/question request/reply",
    "history event selection/download",
    "event close",
    "coupon upload",
    "certificate template upload",
    "admin add/toggle",
    "mail template add/edit",
    "school memo",
    "workbox",
    "in-app QA checklist",
    "mock downloads",
    "search filters",
    "bulk application actions",
    "selection recommendation guidance",
    "event create/edit/deactivate with rich fields"
  ],
  checkedStyles: [
    "desktop shell layout",
    "tablet breakpoint",
    "mobile breakpoint",
    "mobile stacked actions",
    "table horizontal scroll",
    "disabled button affordance"
    ,"target overrun notice",
    "qa checklist layout",
    "selected history row",
    "event poster detail layout",
    "equal height cards"
  ]
}, null, 2));
