import { NextRequest, NextResponse } from "next/server";
import { addProject, fetchProjects } from "./projects";
import { validateRequest } from "../validateRequest";

export async function GET(req: NextRequest) {
  const validation = await validateRequest(req);
  if (validation instanceof NextResponse) {
    return validation;
  }

  const projects = await fetchProjects(validation.user.id);

  if ("error" in projects) {
    return NextResponse.json({ error: projects.error }, { status: 500 });
  }
  return NextResponse.json(projects);
}

export async function POST(req: NextRequest) {
  const validation = await validateRequest(req);
  if (validation instanceof NextResponse) {
    return validation;
  }
  const result = await addProject(validation.user.id);
  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }
  return NextResponse.json(result);
}
