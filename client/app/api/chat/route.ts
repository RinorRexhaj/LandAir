import { NextRequest, NextResponse } from "next/server";
import { validateRequest } from "../validateRequest";
import { supabase } from "../supabase";

export async function GET(req: NextRequest) {
  const validation = await validateRequest(req);
  if (validation instanceof NextResponse) {
    return validation;
  }

  const { searchParams } = new URL(req.url);
  const projectId = searchParams.get("projectId");
  if (!projectId) {
    return NextResponse.json({ error: "Missing projectId" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("Chats")
    .select("id, sender, message, project_id")
    .eq("project_id", projectId)
    .order("id", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const validation = await validateRequest(req);
  if (validation instanceof NextResponse) {
    return validation;
  }
  const body = await req.json();
  const { sender, message, projectId } = body;
  if (
    typeof sender !== "boolean" ||
    typeof message !== "string" ||
    typeof projectId !== "string"
  ) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }
  const { data, error } = await supabase
    .from("Chats")
    .insert([{ sender, message, project_id: projectId }])
    .select();
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data[0]);
}
