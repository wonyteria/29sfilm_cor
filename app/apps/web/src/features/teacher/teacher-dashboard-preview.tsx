const projects = [
  {
    title: "제13회 박카스 29초영화제",
    status: "선정 완료",
    deadline: "D-5",
    expected: 5,
    confirmed: 4,
    todo: "미확인 작품 1편 확인"
  },
  {
    title: "제1회 동반성장 29역숏폼왕",
    status: "선정 완료",
    deadline: "D-12",
    expected: 3,
    confirmed: 0,
    todo: "출품 소속명/팀명 확인"
  }
];

export function TeacherDashboardPreview() {
  return (
    <section className="rounded-card border border-line bg-white p-5 shadow-sm">
      <div>
        <p className="text-sm text-muted">선생님</p>
        <h2 className="mt-1 text-xl font-bold">내 대시보드</h2>
      </div>

      <div className="mt-5 grid gap-3">
        {projects.map((project) => {
          const missing = project.expected - project.confirmed;

          return (
            <article key={project.title} className="rounded-card border border-line p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-bold">{project.title}</h3>
                  <p className="mt-1 text-sm text-muted">
                    {project.status} · 출품 마감 {project.deadline}
                  </p>
                </div>
                <button className="rounded-card border border-line bg-white px-3 py-2 text-sm font-semibold">
                  작품 상태 보기
                </button>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
                <Status label="신청" value={`${project.expected}편`} />
                <Status label="확인" value={`${project.confirmed}편`} />
                <Status label="미확인" value={`${missing}편`} danger={missing > 0} />
              </div>

              <p className="mt-4 rounded-card bg-surface px-3 py-2 text-sm font-semibold">
                {project.todo}
              </p>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function Status({ label, value, danger = false }: { label: string; value: string; danger?: boolean }) {
  return (
    <div>
      <p className="text-muted">{label}</p>
      <p className={`mt-1 text-xl font-bold ${danger ? "text-danger" : ""}`}>{value}</p>
    </div>
  );
}
