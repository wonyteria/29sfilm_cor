import { NextResponse } from "next/server";
import { buildDashboard, readState } from "@/lib/server-store";
import { requireUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await requireUser();
    const state = await readState();
    if (user.userType === "ADMIN") return NextResponse.json(buildDashboard(state));

    const profiles = state.teachers.filter((teacher) => teacher.email.toLowerCase() === user.email.toLowerCase());
    const profileIds = new Set(profiles.map((profile) => profile.id));
    const applications = state.applications.filter((application) => profileIds.has(application.teacherProfileId));
    const applicationIds = new Set(applications.map((application) => application.id));
    const appliedEventIds = new Set(applications.map((application) => application.eventId));
    const scoped = {
      ...state,
      events: state.events.filter((event) => event.status === "RECRUITING" || appliedEventIds.has(event.id)),
      registeredTeachers: state.registeredTeachers.filter((teacher) => teacher.email.toLowerCase() === user.email.toLowerCase()),
      teachers: profiles,
      applications,
      submissions: state.submissions.filter((submission) => submission.applicationId && applicationIds.has(submission.applicationId)),
      coupons: state.coupons.filter((coupon) => coupon.assignedApplicationId && applicationIds.has(coupon.assignedApplicationId)),
      certificateTemplates: [],
      notices: []
    };
    return NextResponse.json(buildDashboard(scoped));
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error ? error.message : "로그인이 필요합니다." }, { status: 401 });
  }
}
