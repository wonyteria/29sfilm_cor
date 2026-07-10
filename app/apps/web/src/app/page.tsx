import { AdminDashboardPreview } from "@/features/admin/admin-dashboard-preview";
import { TeacherDashboardPreview } from "@/features/teacher/teacher-dashboard-preview";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-surface text-ink">
      <section className="mx-auto flex w-full max-w-[1440px] flex-col gap-6 px-6 py-6">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm text-muted">29 Platform 대외협력 관리 시스템</p>
            <h1 className="mt-1 text-3xl font-bold tracking-normal">29 WITH</h1>
          </div>
          <div className="flex gap-2">
            <button className="rounded-card border border-line bg-white px-4 py-2 text-sm font-semibold">
              영화제 관리자
            </button>
            <button className="rounded-card bg-brand px-4 py-2 text-sm font-semibold text-white">
              꿈프 보기
            </button>
          </div>
        </header>

        <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <AdminDashboardPreview />
          <TeacherDashboardPreview />
        </div>
      </section>
    </main>
  );
}
