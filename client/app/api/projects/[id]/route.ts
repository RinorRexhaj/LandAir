import { NextRequest, NextResponse } from "next/server";
import { deleteProject, updateProject } from "../projects";
import { validateRequest } from "../../validateRequest";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const validation = await validateRequest(req);
  if (validation instanceof NextResponse) {
    return validation;
  }

  const { new_name } = await req.json();
  const updated = await updateProject(
    validation.user.id,
    (
      await params
    ).id,
    new_name
  );
  return NextResponse.json(updated);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const validation = await validateRequest(req);
  if (validation instanceof NextResponse) {
    return validation;
  }

  const success = await deleteProject((await params).id, validation.user.id);
  return NextResponse.json({ success });
}
