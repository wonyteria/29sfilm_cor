const events = [
  ["제13회 박카스 29초영화제", "29초영화제", "28교", "104/122편", "21건", "대기", "출품 확인"],
  ["제1회 동반성장 29역숏폼왕", "29역숏폼왕", "14교", "47/64편", "8건", "미공개", "출품 진행"],
  ["간단요리사 29역숏폼왕", "29역숏폼왕", "9교", "31/36편", "0건", "완료", "심사 반영"],
];

const applications = [
  ["방학중학교", "김하늘", "5편", "2026.05.18", "신청 4 · 완료 3", "선정"],
  ["서울고등학교", "박민수", "3편", "2026.05.19", "신청 2 · 완료 2", "선정"],
  ["한빛고등학교", "정유진", "8편", "2026.05.21", "신청 1 · 미이행 0", "예비"],
  ["푸른중학교", "이소라", "2편", "2026.05.14", "신규", "신청접수"],
  ["동문여고", "최지연", "4편", "2026.05.20", "신청 3 · 미이행 1", "미선정"],
];

const members = [
  ["방학중학교", "김하늘", "teacher@school.kr", "중학교", "신청 4 · 선정 3 · 완료 3", "출품 확인중", "응답 빠름"],
  ["서울고등학교", "박민수", "park@school.kr", "고등학교", "신청 2 · 선정 2 · 완료 1", "수동확인필요", "학교명 공백 확인"],
  ["한빛고등학교", "정유진", "jung@school.kr", "고등학교", "신청 1 · 선정 1 · 완료 1", "선정", "학생 이름 보완 필요"],
  ["푸른중학교", "이소라", "lee@school.kr", "중학교", "신규", "프로필 미작성", "가입 후 신청 전"],
  ["동문여고", "최지연", "choi@school.kr", "고등학교", "신청 3 · 미이행 1", "미선정", "지난 행사 미이행"],
];

const submissionSchools = [
  {
    school: "방학중학교",
    externalName: "방학중학교",
    requested: 6,
    confirmed: 6,
    auto: 5,
    manual: 1,
    missing: 0,
    status: "전체확인",
    syncedAt: "2026.05.16 09:30",
    works: [
      ["똑같은 고민, 달라진 속도", "강하은, 김희야", "자동", "보기"],
      ["달라진 교실", "노유림", "자동", "보기"],
      ["내일의 속도", "이다은", "자동", "보기"],
      ["비 오는 운동장", "김도윤", "자동", "보기"],
      ["작은 카메라", "최유진", "자동", "보기"],
      ["우리의 컷", "박서준", "수동", "보기"],
    ],
  },
  {
    school: "서울고등학교",
    externalName: "서울 고등학교",
    requested: 5,
    confirmed: 4,
    auto: 3,
    manual: 1,
    missing: 1,
    status: "수동확인필요",
    syncedAt: "2026.05.16 09:30",
    works: [
      ["우리들의 여름", "최도윤", "수동", "보기"],
      ["골목 끝에서", "윤지후", "자동", "보기"],
      ["종례 후", "김민재", "자동", "보기"],
      ["다시 쓰는 장면", "이현", "자동", "보기"],
    ],
  },
  {
    school: "한빛고등학교",
    externalName: "한빛고등학교",
    requested: 8,
    confirmed: 8,
    auto: 8,
    manual: 0,
    missing: 0,
    status: "전체확인",
    syncedAt: "2026.05.16 09:28",
    works: [
      ["시작의 온도", "김서윤", "자동", "보기"],
      ["창문 밖", "이주연", "자동", "보기"],
      ["한 걸음", "박도현", "자동", "보기"],
      ["점심시간", "정하린", "자동", "보기"],
      ["불 꺼진 교실", "서민규", "자동", "보기"],
      ["편지", "오지후", "자동", "보기"],
      ["마지막 컷", "문채원", "자동", "보기"],
      ["리허설", "강유나", "자동", "보기"],
    ],
  },
  {
    school: "푸른중학교",
    externalName: "-",
    requested: 5,
    confirmed: 0,
    auto: 0,
    manual: 0,
    missing: 5,
    status: "연동실패",
    syncedAt: "-",
    works: [],
  },
  {
    school: "동문여고",
    externalName: "동문여고",
    requested: 5,
    confirmed: 5,
    auto: 5,
    manual: 0,
    missing: 0,
    status: "전체확인",
    syncedAt: "2026.05.16 09:25",
    works: [
      ["내일에게", "박지우", "자동", "보기"],
      ["너에게 가는 길", "이수민", "자동", "보기"],
      ["방과 후", "한예림", "자동", "보기"],
      ["열아홉", "정다인", "자동", "보기"],
      ["프레임", "최서아", "자동", "보기"],
    ],
  },
];

let selectedSubmissionSchool = submissionSchools[0];

const certificates = [
  ["방학중학교", "5편", "강하은, 김희야, 노유림, 이다은", "승인완료", "다운로드"],
  ["서울고등학교", "2편", "최도윤, 윤지후", "승인대기", "대기"],
  ["한빛고등학교", "8편", "김서윤 외 5명", "생성실패", "재생성"],
  ["동문여고", "4편", "박지우, 이수민", "승인완료", "다운로드"],
];

const scores = [
  ["방학중학교", "똑같은 고민, 달라진 속도", "강하은", "다운로드", "1위", "진출", "PDF"],
  ["방학중학교", "달라진 교실", "김희야", "다운로드", "2위", "미진출", "PDF"],
  ["서울고등학교", "우리들의 여름", "최도윤", "대기", "결과 준비중", "결과 미등록", "대기"],
  ["한빛고등학교", "시작의 온도", "김서윤", "다운로드", "1위", "해당 없음", "PDF"],
];

const exceptions = [
  {
    type: "매칭실패",
    school: "서울고등학교",
    level: "주의",
    text: "꿈프 학교명은 서울고등학교, 외부 소속명은 서울 고등학교로 공백 차이가 있습니다.",
    actions: ["후보 비교", "수동 매칭", "정정 요청"],
  },
  {
    type: "연동실패",
    school: "푸른중학교",
    level: "위험",
    text: "관리자 페이지 세션이 만료되어 자동 조회에 실패했습니다.",
    actions: ["재로그인 테스트", "재동기화", "엑셀 업로드"],
  },
  {
    type: "이름정보누락",
    school: "한빛고등학교",
    level: "주의",
    text: "활동확인서에 들어갈 감독/출품자 이름 일부가 비어 있습니다.",
    actions: ["이름 입력", "다시 조회", "확인 요청"],
  },
  {
    type: "메일 발송실패",
    school: "동문여고",
    level: "보통",
    text: "심사 결과 반영 안내 메일 발송이 실패했습니다.",
    actions: ["이메일 수정", "재발송", "연락처 확인"],
  },
  {
    type: "페이지구조변경",
    school: "제1회 동반성장 29역숏폼왕",
    level: "위험",
    text: "팀명 컬럼을 찾을 수 없어 자동 매칭을 중단했습니다.",
    actions: ["컬럼 매핑", "엑셀 대체", "연동 중지"],
  },
  {
    type: "PDF 생성실패",
    school: "한빛고등학교",
    level: "주의",
    text: "활동확인서 템플릿 위치 설정 중 이름 필드가 누락되었습니다.",
    actions: ["템플릿 설정", "누락 필드", "재생성"],
  },
];

const projectMeta = {
  dream: {
    label: "영상 꿈나무 양성 프로젝트",
    short: "꿈프",
    description: "접수, 선발, 출품 확인, 활동확인서, 심사표를 관리합니다.",
    menu: ["행사 운영", "회원/참여 학교", "신청/선정", "출품 현황", "활동확인서", "심사 결과", "연동 설정"],
  },
  supporters: {
    label: "29 서포터즈",
    short: "서포터즈",
    description: "서포터즈 모집, 활동 미션, 출품 의무, 패쓰권을 관리합니다.",
    menu: ["모집 관리", "지원자 관리", "활동 미션", "출품 의무", "패쓰권", "활동 리포트", "설정"],
  },
  ambassador: {
    label: "명예홍보대사",
    short: "홍보대사",
    description: "섭외 후보, 위촉, 콘텐츠 활동, 성과 리포트를 관리합니다.",
    menu: ["섭외 후보", "위촉 관리", "활동 콘텐츠", "성과 리포트", "커뮤니케이션", "리포트", "설정"],
  },
  partners: {
    label: "파트너사",
    short: "파트너",
    description: "협약, 노출 관리, 정산, 파트너 리포트를 관리합니다.",
    menu: ["파트너 목록", "계약/협약", "노출 관리", "정산/리포트", "커뮤니케이션", "리포트", "설정"],
  },
};

let selectedProject = null;
let selectedEventName = "제13회 박카스 29초영화제";

const statusClass = (value) => {
  if (["선정", "매칭완료", "승인완료", "완료", "진출", "다운로드", "PDF", "출품 확인", "운영중", "전체확인", "자동"].includes(value)) return "ok";
  if (["예비", "승인대기", "대기", "결과 준비중", "수동확인필요", "미공개", "출품 진행", "출품 확인중", "프로필 미작성", "설계 예정", "수동"].includes(value)) return "wait";
  if (["미선정", "연동실패", "생성실패", "위험"].includes(value)) return "bad";
  return "info";
};

const pill = (value) => `<span class="status ${statusClass(value)}">${value}</span>`;

const renderRows = () => {
  document.querySelector("#eventRows").innerHTML = events
    .map(
      (row) => `
        <tr>
          <td><strong>${row[0]}</strong><small>외부 행사 ID 연결됨</small></td>
          <td>${row[1]}</td>
          <td>${row[2]}</td>
          <td>${row[3]}</td>
          <td>${row[4]}</td>
          <td>${pill(row[5])}</td>
          <td>${pill(row[6])}</td>
        </tr>`
    )
    .join("");

  document.querySelector("#applicationRows").innerHTML = applications
    .map(
      (row) => `
        <tr>
          <td><input type="checkbox" /></td>
          <td><strong>${row[0]}</strong><small>학교명 동일 입력 확인 완료</small></td>
          <td>${row[1]}</td>
          <td>${row[2]}</td>
          <td>${row[3]}</td>
          <td>${row[4]}</td>
          <td>${pill(row[5])}</td>
        </tr>`
    )
    .join("");

  document.querySelector("#memberRows").innerHTML = members
    .map(
      (row) => `
        <tr>
          <td><strong>${row[0]}</strong><small>학교명 기준 매칭</small></td>
          <td>${row[1]}</td>
          <td>${row[2]}</td>
          <td>${row[3]}</td>
          <td>${row[4]}</td>
          <td>${pill(row[5])}</td>
          <td>${row[6]}</td>
          <td><button class="ghost-btn table-action" type="button">상세</button></td>
        </tr>`
    )
    .join("");

  document.querySelector("#submissionSchoolRows").innerHTML = submissionSchools
    .map(
      (row) => `
        <tr class="selectable-row ${row.school === selectedSubmissionSchool.school ? "selected" : ""}" data-school="${row.school}">
          <td><strong>${row.school}</strong><small>외부명: ${row.externalName}</small></td>
          <td>${row.requested} / ${row.confirmed}편</td>
          <td>${row.auto}편</td>
          <td>${row.manual}편</td>
          <td>${row.missing}편</td>
          <td>${pill(row.status)}</td>
          <td><button class="ghost-btn table-action" type="button">상세</button></td>
        </tr>`
    )
    .join("");

  document.querySelectorAll("[data-school]").forEach((row) => {
    row.addEventListener("click", () => {
      selectedSubmissionSchool = submissionSchools.find((item) => item.school === row.dataset.school) || submissionSchools[0];
      renderRows();
    });
  });

  renderSubmissionDetail();

  document.querySelector("#certificateRows").innerHTML = certificates
    .map(
      (row) => `
        <tr>
          <td><strong>${row[0]}</strong></td>
          <td>${row[1]}</td>
          <td>${row[2]}</td>
          <td>${pill(row[3])}</td>
          <td><button class="ghost-btn table-action" type="button">${row[4]}</button></td>
        </tr>`
    )
    .join("");

  document.querySelector("#scoreRows").innerHTML = scores
    .map(
      (row) => `
        <tr>
          <td><strong>${row[0]}</strong></td>
          <td>${row[1]}</td>
          <td>${row[2]}</td>
          <td>${pill(row[3])}</td>
          <td>${pill(row[4])}</td>
          <td>${pill(row[5])}</td>
          <td><button class="ghost-btn table-action" type="button">${row[6]}</button></td>
        </tr>`
    )
    .join("");

  document.querySelector("#exceptionCards").innerHTML = exceptions
    .map(
      (item) => `
        <article class="exception-card">
          <header>
            <strong>${item.type}</strong>
            ${pill(item.level)}
          </header>
          <div>
            <strong>${item.school}</strong>
            <p>${item.text}</p>
          </div>
          <div class="card-actions">
            ${item.actions.map((action) => `<button type="button">${action}</button>`).join("")}
          </div>
        </article>`
    )
    .join("");
};

const renderSubmissionDetail = () => {
  const school = selectedSubmissionSchool;
  document.querySelector("#selectedSchoolTitle").textContent = school.school;
  document.querySelector("#selectedSchoolSummary").textContent =
    `신청 ${school.requested}편 · 확인 ${school.confirmed}편 · 자동 ${school.auto}편 · 수동 ${school.manual}편`;

  const matchCard = document.querySelector(".school-match-card");
  matchCard.innerHTML = `
    <div>
      <span>꿈프 학교명</span>
      <strong>${school.school}</strong>
    </div>
    <div>
      <span>외부 소속/팀명</span>
      <strong>${school.externalName}</strong>
    </div>
    <div>
      <span>마지막 동기화</span>
      <strong>${school.syncedAt}</strong>
    </div>
  `;

  const list = document.querySelector("#submissionWorkList");
  if (!school.works.length) {
    list.innerHTML = `
      <div class="empty-state">
        <strong>확인된 출품작이 없습니다</strong>
        <span>외부 연동을 재시도하거나 엑셀 업로드로 보완하세요.</span>
      </div>
    `;
    return;
  }

  list.innerHTML = school.works
    .map(
      (work, index) => `
        <article class="work-item">
          <span class="work-index">${index + 1}</span>
          <div>
            <strong>${work[0]}</strong>
            <small>${work[1]}</small>
          </div>
          ${pill(work[2])}
          <button class="text-btn" type="button">${work[3]}</button>
        </article>`
    )
    .join("");
};

const setView = (viewId) => {
  document.querySelectorAll(".view").forEach((view) => view.classList.toggle("active", view.id === viewId));
  document.querySelectorAll(".nav-item").forEach((item) => item.classList.toggle("active", item.dataset.view === viewId));
  const navLabel = document.querySelector(`.nav-item[data-view="${viewId}"]`)?.textContent || "대시보드";
  const meta = selectedProject ? projectMeta[selectedProject] : null;
  document.querySelector("#pageTitle").textContent = viewId === "dashboard" && meta ? `${meta.short} 대시보드` : navLabel;
};

const updateContext = () => {
  const projectValue = selectedProject;
  const eventValue = selectedEventName;
  const meta = projectValue ? projectMeta[projectValue] : null;

  document.body.classList.toggle("no-project", !meta);

  if (!meta) {
    document.querySelector("#sideContextLabel").textContent = "전체";
    document.querySelector("#sideProjectName").textContent = "29 WITH";
    document.querySelector("#sideEventName").textContent = "총괄 대시보드";
    document.querySelectorAll("[data-project-card]").forEach((card) => card.classList.remove("selected"));
    document.querySelectorAll("[data-category]").forEach((button) => {
      button.classList.toggle("active", button.dataset.category === "all");
    });
    document.querySelectorAll(".project-menu").forEach((item) => {
      item.disabled = true;
      item.classList.add("disabled");
    });
    return;
  }

  document.querySelector("#sideContextLabel").textContent = "선택 카테고리";
  document.querySelector("#sideProjectName").textContent = meta.label;
  document.querySelector("#sideEventName").textContent = eventValue;

  document.querySelectorAll("[data-project-card]").forEach((card) => {
    card.classList.toggle("selected", card.dataset.projectCard === projectValue);
  });

  document.querySelectorAll("[data-category]").forEach((button) => {
    button.classList.toggle("active", button.dataset.category === projectValue);
  });

  document.querySelectorAll(".project-menu").forEach((item, index) => {
    item.textContent = meta.menu[index] || item.textContent;
    item.disabled = projectValue !== "dream";
    item.classList.toggle("disabled", projectValue !== "dream");
  });
};

const updateEventSelection = (eventName) => {
  selectedEventName = eventName;
  document.querySelectorAll("[data-event-name]").forEach((item) => {
    item.classList.toggle("active", item.dataset.eventName === eventName);
    item.classList.toggle("selected", item.dataset.eventName === eventName);
  });
  const eventSelect = document.querySelector("#eventSelect");
  if (eventSelect) eventSelect.value = eventName;
  updateContext();
};

document.querySelectorAll(".nav-item").forEach((button) => {
  button.addEventListener("click", () => setView(button.dataset.view));
});

document.querySelectorAll("[data-view-link]").forEach((button) => {
  button.addEventListener("click", () => setView(button.dataset.viewLink));
});

document.querySelectorAll("[data-project-card]").forEach((card) => {
  card.addEventListener("click", () => {
    selectedProject = card.dataset.projectCard;
    updateContext();
  });
});

document.querySelectorAll("[data-project-jump]").forEach((button) => {
  button.addEventListener("click", () => {
    selectedProject = button.dataset.projectJump;
    updateContext();
    setView("dashboard");
  });
});

document.querySelectorAll("[data-category-jump]").forEach((button) => {
  button.addEventListener("click", () => {
    selectedProject = button.dataset.categoryJump;
    updateContext();
    setView("dashboard");
  });
});

document.querySelectorAll("[data-category]").forEach((button) => {
  button.addEventListener("click", () => {
    selectedProject = button.dataset.category === "all" ? null : button.dataset.category;
    updateContext();
    setView("dashboard");
  });
});

document.querySelectorAll("[data-event-name]").forEach((button) => {
  button.addEventListener("click", () => updateEventSelection(button.dataset.eventName));
});

const eventSelect = document.querySelector("#eventSelect");
if (eventSelect) eventSelect.addEventListener("change", (event) => updateEventSelection(event.target.value));

const guideDialog = document.querySelector("#guideDialog");
const actionDialog = document.querySelector("#actionDialog");

document.querySelector("#showGuideBtn").addEventListener("click", () => guideDialog.showModal());
document.querySelector("#openExceptionBtn").addEventListener("click", () => setView("exceptions"));
document.querySelector("#aiHelpBtn").addEventListener("click", () => actionDialog.showModal());

document.querySelectorAll("[data-close-dialog]").forEach((button) => {
  button.addEventListener("click", () => button.closest("dialog").close());
});

document.querySelector("#syncBtn").addEventListener("click", (event) => {
  event.currentTarget.textContent = "동기화 완료";
  setTimeout(() => {
    event.currentTarget.textContent = "동기화";
  }, 1400);
});

renderRows();
updateContext();
