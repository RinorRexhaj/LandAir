import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../utils/Supabase";

const useAuth = () => {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUser();
  }, [router]);

  const getUser = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (session?.user) {
      setUser(session.user);
      router.push("/dashboard");
    }
    setTimeout(() => {
      setLoading(false);
    }, 300);
  };

  return { user, loading, getUser };
};

export default useAuth;
