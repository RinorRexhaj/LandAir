import { NextRequest, NextResponse } from "next/server";
import { addProject, fetchProjects } from "./projects";
import { validateRequest } from "../validateRequest";

export async function GET(req: NextRequest) {
  const validation = await validateRequest(req);
  if (validation instanceof NextResponse) {
    return validation;
  }

  const projects = await fetchProjects(validation.user.id);
  return NextResponse.json(projects);
}

export async function POST(req: NextRequest) {
  const validation = await validateRequest(req);
  if (validation instanceof NextResponse) {
    return validation;
  }
  const result = await addProject(validation.user.id);
  return NextResponse.json(result);
}
