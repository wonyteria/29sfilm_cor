import type { SessionUser } from "./auth";
import { buildDashboard } from "./server-store";
import type { AppState } from "./with-types";

export function scopeDashboardForTeacher(state: AppState, user: SessionUser) {
  if (user.programType === "FRIENDS_2026") {
    const profiles = state.friendsProfiles.filter((profile) => profile.email.toLowerCase() === user.email.toLowerCase());
    const userIds = new Set(profiles.map((profile) => profile.userId).concat(user.id));
    const participations = state.friendsParticipations.filter((participation) => userIds.has(participation.userId));
    const participationIds = new Set(participations.map((participation) => participation.id));
    const joinedEventIds = new Set(participations.map((participation) => participation.eventId));
    return buildDashboard({
      ...state,
      events: state.events.filter((event) => event.status === "RECRUITING" || joinedEventIds.has(event.id)),
      registeredTeachers: [],
      registeredFriends: state.registeredFriends.filter((member) => member.email.toLowerCase() === user.email.toLowerCase()),
      teachers: [],
      applications: [],
      submissions: [],
      coupons: [],
      certificateTemplates: [],
      notices: [],
      profileChangeRequests: [],
      friendsProfiles: profiles,
      friendsParticipations: participations,
      friendsActivityLinks: state.friendsActivityLinks.filter((link) => participationIds.has(link.participationId)),
      friendsWarnings: state.friendsWarnings.filter((warning) => participationIds.has(warning.participationId))
    });
  }
  const profiles = state.teachers.filter((teacher) => teacher.email.toLowerCase() === user.email.toLowerCase());
  const profileIds = new Set(profiles.map((profile) => profile.id));
  const applications = state.applications.filter((application) => profileIds.has(application.teacherProfileId));
  const applicationIds = new Set(applications.map((application) => application.id));
  const appliedEventIds = new Set(applications.map((application) => application.eventId));
  return buildDashboard({
    ...state,
    events: state.events.filter((event) => event.status === "RECRUITING" || appliedEventIds.has(event.id)),
    registeredTeachers: state.registeredTeachers.filter((teacher) => teacher.email.toLowerCase() === user.email.toLowerCase()),
    registeredFriends: [],
    teachers: profiles,
    applications,
    submissions: state.submissions.filter((submission) => submission.applicationId && applicationIds.has(submission.applicationId)),
    coupons: state.coupons.filter((coupon) => coupon.assignedApplicationId && applicationIds.has(coupon.assignedApplicationId)),
    certificateTemplates: [],
    notices: [],
    profileChangeRequests: state.profileChangeRequests.filter((request) => profileIds.has(request.teacherProfileId)),
    friendsProfiles: [],
    friendsParticipations: [],
    friendsActivityLinks: [],
    friendsWarnings: []
  });
}
