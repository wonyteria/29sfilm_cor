import { AlertTriangle, CheckCircle2, FileSpreadsheet, Mail, Plus, Settings } from "lucide-react";
import { dreamEvents } from "@/lib/dream-sample-data";
import { eventTypeLabels, operationStatusLabels } from "@29with/shared";

const selectedEvent = dreamEvents[0];

const actionItems = [
  {
    title: "Review Matches",
    count: selectedEvent.reviewRequiredCount,
    detail: "Spacing differences, school name typos, and team suffixes require admin review.",
    action: "Review"
  },
  {
    title: "Scheduled Mail",
    count: selectedEvent.mailQueueCount,
    detail: "Deadline reminders, certificate notices, and score report notices are queued.",
    action: "Open Mail"
  },
  {
    title: "Final Approval",
    count: 1,
    detail: "Approve the final submission list before certificates are generated.",
    action: "Prepare"
  }
];

export function AdminDashboardPreview() {
  return (
    <section className="panel">
      <div className="section-head">
        <div>
          <p className="eyebrow">Admin</p>
          <h2>Dream Project Dashboard</h2>
        </div>
        <button className="primary-button">
          <Plus size={16} />
          New Event
        </button>
      </div>

      <div className="event-list" aria-label="Active Dream Project events">
        {dreamEvents.map((event) => (
          <button className={`event-row ${event.id === selectedEvent.id ? "is-active" : ""}`} key={event.id}>
            <span>
              <strong>{event.title}</strong>
              <small>
                {eventTypeLabels[event.eventType]} | {operationStatusLabels[event.status]} |{" "}
                {event.submissionDeadlineLabel}
              </small>
            </span>
            <span className={event.reviewRequiredCount > 0 ? "danger-text" : "success-text"}>
              {event.reviewRequiredCount > 0 ? `${event.reviewRequiredCount} tasks` : "Clear"}
            </span>
          </button>
        ))}
      </div>

      <div className="selected-event">
        <div>
          <p className="eyebrow">Selected Event</p>
          <h3>{selectedEvent.title}</h3>
          <p>
            {selectedEvent.topic} | {selectedEvent.prize} | {selectedEvent.contestPeriod}
          </p>
        </div>
        <div className="button-row">
          <button className="ghost-button">
            <Settings size={16} />
            Settings
          </button>
          <button className="primary-button">
            <FileSpreadsheet size={16} />
            Upload Excel
          </button>
        </div>
      </div>

      <div className="metric-grid">
        <Metric label="Selected Schools" value={`${selectedEvent.selectedSchoolCount}`} />
        <Metric
          label="Confirmed Works"
          value={`${selectedEvent.confirmedSubmissionCount}/${selectedEvent.expectedSubmissionCount}`}
        />
        <Metric label="Needs Review" value={`${selectedEvent.reviewRequiredCount}`} danger />
        <Metric label="Queued Mail" value={`${selectedEvent.mailQueueCount}`} />
      </div>

      <div className="action-grid">
        {actionItems.map((item) => (
          <article className="action-card" key={item.title}>
            <div className="action-icon">
              {item.count > 0 ? <AlertTriangle size={18} /> : <CheckCircle2 size={18} />}
            </div>
            <div>
              <strong>{item.title}</strong>
              <p>{item.detail}</p>
              <button className="inline-action">{item.action}</button>
            </div>
          </article>
        ))}
      </div>

      <div className="workflow-strip">
        <WorkflowStep done label="Event" />
        <WorkflowStep done label="Selection" />
        <WorkflowStep active label="Submission Check" />
        <WorkflowStep label="Certificates" />
        <WorkflowStep label="Scores" />
        <WorkflowStep label="Close" />
      </div>
    </section>
  );
}

function Metric({ label, value, danger = false }: { label: string; value: string; danger?: boolean }) {
  return (
    <div className="metric-card">
      <span>{label}</span>
      <strong className={danger ? "danger-text" : ""}>{value}</strong>
    </div>
  );
}

function WorkflowStep({ label, done = false, active = false }: { label: string; done?: boolean; active?: boolean }) {
  return (
    <div className={`workflow-step ${done ? "is-done" : ""} ${active ? "is-active" : ""}`}>
      <span>{done ? <CheckCircle2 size={14} /> : active ? <Mail size={14} /> : null}</span>
      {label}
    </div>
  );
}
