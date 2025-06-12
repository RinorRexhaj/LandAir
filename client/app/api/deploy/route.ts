import { NextResponse, NextRequest } from "next/server";
import { validateRequest } from "../validateRequest";
import { deploy } from "./deploy";

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
