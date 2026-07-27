import { NextResponse } from "next/server";
import { addCoupons } from "@/lib/server-store";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const body = await request.json();
  const coupons = Array.isArray(body.couponNumbers) ? body.couponNumbers : [];
  const dashboard = await addCoupons(coupons.map(String));
  return NextResponse.json(dashboard);
}
