const dreamEvents = [
  {
    title: "제13회 박카스 29초영화제",
    type: "29초영화제",
    status: "모집중",
    deadline: "D-5",
    selectedSchools: 2,
    confirmed: 7,
    expected: 10,
    actionCount: 3
  },
  {
    title: "제1회 동반성장 29역숏폼왕",
    type: "29역숏폼왕",
    status: "모집중",
    deadline: "D-12",
    selectedSchools: 1,
    confirmed: 0,
    expected: 3,
    actionCount: 3
  }
];

export function AdminDashboardPreview() {
  return (
    <section className="rounded-card border border-line bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-muted">관리자</p>
          <h2 className="mt-1 text-xl font-bold">꿈프 대시보드</h2>
        </div>
        <span className="rounded-full bg-red-50 px-3 py-1 text-sm font-semibold text-red-700">
          처리 필요 6건
        </span>
      </div>

      <div className="mt-5 grid gap-3">
        {dreamEvents.map((event) => (
          <article key={event.title} className="rounded-card border border-line p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold">{event.title}</h3>
                <p className="mt-1 text-sm text-muted">
                  {event.type} · {event.status} · 출품 마감 {event.deadline}
                </p>
              </div>
              <button className="rounded-card bg-brand px-3 py-2 text-sm font-semibold text-white">
                출품 확인
              </button>
            </div>
            <dl className="mt-4 grid grid-cols-3 gap-3 text-sm">
              <div>
                <dt className="text-muted">선정 학교</dt>
                <dd className="mt-1 text-xl font-bold">{event.selectedSchools}교</dd>
              </div>
              <div>
                <dt className="text-muted">출품 확인</dt>
                <dd className="mt-1 text-xl font-bold">
                  {event.confirmed}/{event.expected}
                </dd>
              </div>
              <div>
                <dt className="text-muted">처리 필요</dt>
                <dd className="mt-1 text-xl font-bold text-danger">{event.actionCount}건</dd>
              </div>
            </dl>
          </article>
        ))}
      </div>
    </section>
  );
}
