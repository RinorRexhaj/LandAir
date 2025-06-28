import { NextRequest, NextResponse } from "next/server";
import { validateRequest } from "../validateRequest";
import { getFile, uploadFile, deleteFile, uploadImage } from "./storage";

export async function GET(req: NextRequest) {
  const validation = await validateRequest(req);
  if (validation instanceof NextResponse) {
    return validation;
  }

  const { searchParams } = new URL(req.url);
  const project_id = searchParams.get("project_id");

  if (!project_id) {
    return NextResponse.json({ error: "Missing project_id" }, { status: 400 });
  }

  const path = `${validation.user.id}/${project_id}/index.html`;
  const publicUrl = await getFile(path);
  return NextResponse.json(publicUrl);
}

export async function POST(req: NextRequest) {
  const validation = await validateRequest(req);
  if (validation instanceof NextResponse) {
    return validation;
  }

  const formData = await req.formData();
  const filePath = formData.get("filePath") as string;
  const type = formData.get("type") as string;
  const content = formData.get("content");

  if (!content || !filePath) {
    return NextResponse.json(
      { error: "Missing content or filePath" },
      { status: 400 }
    );
  }

  try {
    if (type === "html") {
      await uploadFile(
        content as string,
        `${validation.user.id}/${filePath}/index.html`
      );
      return NextResponse.json({ success: true });
    } else if (type === "image") {
      const url = await uploadImage(
        content as File,
        `${validation.user.id}/${filePath}`
      );
      return NextResponse.json({ success: true, url });
    }
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

  const filePath = req.nextUrl.searchParams.get("filePath");

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
