import { NextRequest, NextResponse } from "next/server";
import { deleteProject, updateProject } from "../projects";
import { validateRequest } from "../../validateRequest";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const validation = await validateRequest(req);
  if (validation instanceof NextResponse) {
    return validation;
  }

  const { new_name } = await req.json();
  const updated = await updateProject(
    validation.user.id,
    parseInt(params.id),
    new_name
  );
  return NextResponse.json(updated);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const validation = await validateRequest(req);
  if (validation instanceof NextResponse) {
    return validation;
  }

  const success = await deleteProject(parseInt(params.id), validation.user.id);
  return NextResponse.json({ success });
}
