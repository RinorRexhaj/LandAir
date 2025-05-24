import { Request, Response } from "express";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

export const signUp = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    res.status(400).json({ error: error.message });
    return;
  }

  res.status(200).json({ user: data.user });
};

export const signIn = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.session) {
    res.status(401).json({ error: error?.message || "Login failed" });
    return;
  }

  res.status(200).json({
    access_token: data.session.access_token,
    user: data.user,
  });
};
