import type { SessionUser } from "./auth";
import { buildDashboard } from "./server-store";
import type { AppState } from "./with-types";

export function scopeDashboardForTeacher(state: AppState, user: SessionUser) {
  const profiles = state.teachers.filter((teacher) => teacher.email.toLowerCase() === user.email.toLowerCase());
  const profileIds = new Set(profiles.map((profile) => profile.id));
  const applications = state.applications.filter((application) => profileIds.has(application.teacherProfileId));
  const applicationIds = new Set(applications.map((application) => application.id));
  const appliedEventIds = new Set(applications.map((application) => application.eventId));
  return buildDashboard({
    ...state,
    events: state.events.filter((event) => event.status === "RECRUITING" || appliedEventIds.has(event.id)),
    registeredTeachers: state.registeredTeachers.filter((teacher) => teacher.email.toLowerCase() === user.email.toLowerCase()),
    teachers: profiles,
    applications,
    submissions: state.submissions.filter((submission) => submission.applicationId && applicationIds.has(submission.applicationId)),
    coupons: state.coupons.filter((coupon) => coupon.assignedApplicationId && applicationIds.has(coupon.assignedApplicationId)),
    certificateTemplates: [],
    notices: [],
    profileChangeRequests: state.profileChangeRequests.filter((request) => profileIds.has(request.teacherProfileId))
  });
}
