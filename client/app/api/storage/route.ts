import { NextRequest, NextResponse } from "next/server";
import { validateRequest } from "../validateRequest";
import { getFile, uploadFile, deleteFile } from "./storage";

export async function GET(req: NextRequest) {
  const validation = await validateRequest(req);
  if (validation instanceof NextResponse) {
    return validation;
  }

  const { searchParams } = new URL(req.url);
  const project_name = searchParams.get("project_name");

  if (!project_name) {
    return NextResponse.json(
      { error: "Missing project_name" },
      { status: 400 }
    );
  }

  const path = `${validation.user.id}/${project_name}`;
  const publicUrl = await getFile(path);
  return NextResponse.json(publicUrl);
}

export async function POST(req: NextRequest) {
  const validation = await validateRequest(req);
  if (validation instanceof NextResponse) {
    return validation;
  }

  const { content, filePath } = await req.json();

  if (!content || !filePath) {
    return NextResponse.json(
      { error: "Missing content or filePath" },
      { status: 400 }
    );
  }

  try {
    await uploadFile(content, `${validation.user.id}/${filePath}`);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Upload failed:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const validation = await validateRequest(req);
  if (validation instanceof NextResponse) {
    return validation;
  }

  const { filePath } = await req.json();

  if (!filePath) {
    return NextResponse.json({ error: "Missing filePath" }, { status: 400 });
  }

  try {
    const success = await deleteFile(`${validation.user.id}/${filePath}`);
    return NextResponse.json({ success });
  } catch (error) {
    console.error("Delete failed:", error);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
