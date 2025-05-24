import { Request, Response, NextFunction } from "express";
import supabase from "../lib/supabaseClient";

export async function verifySupabaseUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Missing token" });
  }

  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data.user) {
    return res.status(401).json({ error: "Invalid token" });
  }

  // Attach user to request object
  (req as any).user = data.user;
  next();
}
