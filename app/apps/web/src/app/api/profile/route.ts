import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { requestProfileChange, reviewProfileChange, saveTeacherProfile } from "@/lib/server-store";
import { scopeDashboardForTeacher } from "@/lib/dashboard-scope";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const user = await requireUser();
    if (user.userType !== "TEACHER") throw new Error("선생님 계정으로 이용해 주세요.");
    const body = await request.json();
    const schoolName = String(body.schoolName || "").trim();
    const phone = String(body.phone || "").trim();
    const affiliationName = String(body.affiliationName || "").trim();
    if (!schoolName || !phone || !affiliationName) throw new Error("학교명, 연락처, 출품 소속명을 모두 입력해 주세요.");
    if (!body.profileId && (!body.verificationFileName || !body.verificationDataUrl)) {
      throw new Error("처음 프로필 작성 시 교사 증빙자료를 첨부해 주세요.");
    }
    const dashboard = await saveTeacherProfile({
      email: user.email,
      teacherName: user.name,
      schoolName,
      phone,
      affiliationName,
      verificationFileName: String(body.verificationFileName || ""),
      verificationDataUrl: String(body.verificationDataUrl || "")
    });
    return NextResponse.json(scopeDashboardForTeacher(dashboard, user));
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "프로필을 저장하지 못했습니다." },
      { status: 400 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const user = await requireUser();
    if (user.userType !== "TEACHER") throw new Error("선생님 계정으로 이용해 주세요.");
    const body = await request.json();
    const requestedSchoolName = String(body.requestedSchoolName || "").trim();
    const requestedAffiliationName = String(body.requestedAffiliationName || "").trim();
    const reason = String(body.reason || "").trim();
    if (!requestedSchoolName || !requestedAffiliationName || !reason) {
      throw new Error("변경할 학교명, 출품 소속명, 변경 사유를 모두 입력해 주세요.");
    }
    const dashboard = await requestProfileChange({
      email: user.email,
      requestedSchoolName,
      requestedAffiliationName,
      reason,
      teacherConfirmed: body.teacherConfirmed === true
    });
    return NextResponse.json(scopeDashboardForTeacher(dashboard, user));
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "변경 요청을 저장하지 못했습니다." },
      { status: 400 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const user = await requireUser();
    if (user.userType !== "ADMIN") throw new Error("관리자 권한이 필요합니다.");
    const body = await request.json();
    const status = body.status === "APPROVED" ? "APPROVED" : "REJECTED";
    const dashboard = await reviewProfileChange({
      requestId: String(body.requestId || ""),
      status,
      adminReply: String(body.adminReply || "").trim(),
      handledBy: user.id
    });
    return NextResponse.json(dashboard);
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "변경 요청을 처리하지 못했습니다." },
      { status: 400 }
    );
  }
}
