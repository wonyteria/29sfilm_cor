import { AdminDashboardPreview } from "@/features/admin/admin-dashboard-preview";
import { TeacherDashboardPreview } from "@/features/teacher/teacher-dashboard-preview";

const categories = ["All", "Dream Project", "Supporters", "Ambassadors", "Partners"];

export default function HomePage() {
  return (
    <main className="app-shell">
      <aside className="side-nav" aria-label="29 WITH navigation">
        <div className="brand-box">
          <span>29</span>
          <div>
            <strong>29 WITH</strong>
            <small>Collaboration ops</small>
          </div>
        </div>
        <nav>
          <a className="active">Overview</a>
          <a>Projects</a>
          <a>Workbox</a>
          <a>Mail Templates</a>
          <a>History</a>
        </nav>
      </aside>

      <section className="content-area">
        <header className="top-bar">
          <div>
            <p>29 Platform collaboration management system</p>
            <h1>29 WITH</h1>
          </div>
          <div className="top-actions">
            <button className="ghost-button">Teacher View</button>
            <button className="ghost-button">Admin View</button>
            <button className="primary-button">Sync</button>
          </div>
        </header>

        <div className="category-tabs" aria-label="Program categories">
          {categories.map((category) => (
            <button className={category === "Dream Project" ? "active" : ""} key={category}>
              {category}
            </button>
          ))}
        </div>

        <div className="intro-grid">
          <article>
            <span>Current build scope</span>
            <strong>Dream Project</strong>
            <p>
              Applications, selection, coupons, submission Excel matching, certificates, score reports,
              and closing history are managed as one connected workflow.
            </p>
          </article>
          <article>
            <span>GitHub repository</span>
            <strong>wonyteria/29sfilm_cor</strong>
            <p>The static prototype is available through GitHub Pages for external testing.</p>
          </article>
        </div>

        <div className="dashboard-grid">
          <AdminDashboardPreview />
          <TeacherDashboardPreview />
        </div>
      </section>
    </main>
  );
}
