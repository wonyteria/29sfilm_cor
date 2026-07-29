import { NextResponse } from "next/server";
import { addApplication, updateApplicationStatus } from "@/lib/server-store";
import { requireAdmin, requireUser } from "@/lib/auth";
import { scopeDashboardForTeacher } from "@/lib/dashboard-scope";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const user = await requireUser();
    const body = await request.json();
    const dashboard = await addApplication({
      eventId: String(body.eventId || ""),
      schoolName: String(body.schoolName || "").trim(),
      teacherName: String(body.teacherName || user.name).trim(),
      email: user.email,
      phone: String(body.phone || "").trim(),
      affiliationName: String(body.affiliationName || "").trim(),
      expectedSubmissionCount: Number(body.expectedSubmissionCount || 1),
      plannedSubmissionDate: String(body.plannedSubmissionDate || ""),
      usagePlan: String(body.usagePlan || "").trim(),
      memo: String(body.memo || "").trim()
    });
    return NextResponse.json(scopeDashboardForTeacher(dashboard, user));
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "신청을 저장하지 못했습니다." },
      { status: 400 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    await requireAdmin();
    const body = await request.json();
    const dashboard = await updateApplicationStatus(
      String(body.applicationId || ""),
      body.status === "WAITLISTED" || body.status === "NOT_SELECTED" ? body.status : "SELECTED"
    );
    return NextResponse.json(dashboard);
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "신청 상태를 변경하지 못했습니다." },
      { status: 400 }
    );
  }
}
