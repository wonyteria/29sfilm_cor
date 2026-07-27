import { Bell, FileCheck2, MessageSquare, ReceiptText } from "lucide-react";
import { teacherParticipations } from "@/lib/dream-sample-data";
import { eventTypeLabels } from "@29with/shared";

export function TeacherDashboardPreview() {
  return (
    <section className="panel">
      <div className="section-head">
        <div>
          <p className="eyebrow">Teacher</p>
          <h2>My Dream Projects</h2>
        </div>
        <button className="ghost-button">
          <MessageSquare size={16} />
          Ask
        </button>
      </div>

      <div className="notice-card">
        <Bell size={18} />
        <div>
          <strong>Banghak Middle School currently has priority selection benefit.</strong>
          <p>Good participation history is reflected in future first-come selection.</p>
        </div>
      </div>

      <div className="teacher-projects">
        {teacherParticipations.map((project) => {
          const missing = project.expectedSubmissionCount - project.confirmedSubmissionCount;

          return (
            <article className="teacher-project-card" key={project.id}>
              <div className="project-card-head">
                <div>
                  <h3>{project.eventTitle}</h3>
                  <p>
                    {eventTypeLabels[project.eventType]} | Affiliation: {project.affiliationName}
                  </p>
                </div>
                <span className={missing > 0 ? "status-pill warning" : "status-pill success"}>
                  {missing > 0 ? `${missing} to review` : "Confirmed"}
                </span>
              </div>

              <div className="metric-grid compact">
                <Metric label="Expected" value={`${project.expectedSubmissionCount}`} />
                <Metric label="Confirmed" value={`${project.confirmedSubmissionCount}`} />
                <Metric label="Snack Support" value={project.snackSupportLabel} />
              </div>

              <p className="next-action">{project.nextAction}</p>

              <div className="work-list">
                {project.works.map((work) => (
                  <div className="work-row" key={work.id}>
                    <div>
                      <strong>{work.title}</strong>
                      <small>
                        {work.directorOrEntrant} | {work.affiliationName}
                      </small>
                    </div>
                    <span className={`match-badge ${work.matchStatus.toLowerCase()}`}>
                      {work.matchStatus === "MATCHED" ? "Matched" : "Review"}
                    </span>
                  </div>
                ))}
              </div>

              <div className="document-row">
                <DocumentButton label="Certificate" ready={project.certificateStatus !== "NOT_READY"} />
                <DocumentButton label="Score Report" ready={project.scoreReportStatus !== "NOT_READY"} />
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="metric-card">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function DocumentButton({ label, ready }: { label: string; ready: boolean }) {
  return (
    <button className={ready ? "primary-button" : "ghost-button"}>
      {label === "Certificate" ? <FileCheck2 size={16} /> : <ReceiptText size={16} />}
      {ready ? `Open ${label}` : `${label} Pending`}
    </button>
  );
}
