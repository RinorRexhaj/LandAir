import { createClient, User } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

interface Validation {
  user: User;
}

const createSupabaseWithToken = (accessToken: string) => {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    }
  );
};

export const validateRequest = async (
  req: NextRequest
): Promise<NextResponse | Validation> => {
  const token = req.headers.get("authorization")?.replace("Bearer ", "");

  if (!token) {
    return NextResponse.json({ error: "Missing token" }, { status: 401 });
  }

  const supabase = createSupabaseWithToken(token);
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return { user };
};
