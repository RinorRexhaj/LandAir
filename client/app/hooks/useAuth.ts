import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../utils/Supabase";
import { User } from "@supabase/supabase-js";

const useAuth = () => {
  const router = useRouter();
  const [user, setUser] = useState<User>();
  const [loading, setLoading] = useState(true);

  const getUser = useCallback(async () => {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (!error && session?.user) {
      setUser(session.user);
      router.push("/dashboard");
    }

    setTimeout(() => {
      setLoading(false);
    }, 300);
  }, [router]);

  useEffect(() => {
    getUser();
  }, [getUser]);

  return { user, loading, setLoading, getUser };
};

export default useAuth;
