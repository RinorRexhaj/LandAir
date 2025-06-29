import { NextResponse, NextRequest } from "next/server";
import { validateRequest } from "../validateRequest";
import { deploy, checkDomainAvailability } from "./deploy";

export async function POST(req: NextRequest) {
  const validation = await validateRequest(req);
  if (validation instanceof NextResponse) return validation;

  const { project_name, content, project_id } = await req.json();
  const result = await deploy(
    project_name,
    project_id,
    content,
    validation.user.id
  );

  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }

  return NextResponse.json({ url: result.url });
}

export async function GET(req: NextRequest) {
  const validation = await validateRequest(req);
  if (validation instanceof NextResponse) return validation;

  const { searchParams } = new URL(req.url);
  const subdomain = searchParams.get("subdomain");

  if (!subdomain) {
    return NextResponse.json(
      { error: "Subdomain parameter is required" },
      { status: 400 }
    );
  }

  const result = await checkDomainAvailability(subdomain);

  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json({ available: result.available });
}
