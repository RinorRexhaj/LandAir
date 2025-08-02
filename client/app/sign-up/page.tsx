"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { useVanta } from "../hooks/useVanta";
import Image from "next/image";
import { supabase } from "../utils/Supabase";

const SignInPage = () => {
  const vantaRef = useVanta<HTMLDivElement>({
    baseColor: 0x0ff,
    backgroundColor: 0x000000,
  });

  // const [isSignUp, setIsSignUp] = useState(true);
  // const [email, setEmail] = useState("");
  // const [password, setPassword] = useState("");
  // const [error, setError] = useState<string | null>(null);
  // const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    });

    if (error) {
      console.error("Google login error:", error.message);
    }
  };

  // const handleEmailSignIn = async () => {
  //   setLoading(true);
  //   setError(null);
  //   const { error } = await supabase.auth.signInWithPassword({
  //     email,
  //     password,
  //   });
  //   setLoading(false);
  //   if (error) {
  //     setError(error.message);
  //   } else {
  //     // Optionally redirect or show success
  //     window.location.href = "/dashboard";
  //   }
  // };

  return (
    <div ref={vantaRef} className="h-dvh w-full relative overflow-hidden">
      <div className="absolute inset-0 backdrop-blur-sm bg-black/20" />
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <div className="w-full max-w-md bg-white/5 backdrop-blur-md border border-white/20 shadow-xl rounded-2xl p-8 text-white">
          {/* Toggle Sign Up / Log In */}
          {/* <div className="flex justify-center mb-6">
            <button
              className={`px-4 py-2 rounded-l-lg font-semibold transition-colors ${
                isSignUp
                  ? "bg-white/20 text-white"
                  : "bg-transparent text-gray-300"
              }`}
              onClick={() => setIsSignUp(true)}
              type="button"
            >
              Sign Up
            </button>
            <button
              className={`px-4 py-2 rounded-r-lg font-semibold transition-colors ${
                !isSignUp
                  ? "bg-white/20 text-white"
                  : "bg-transparent text-gray-300"
              }`}
              onClick={() => setIsSignUp(false)}
              type="button"
            >
              Log In
            </button>
          </div> */}

          {/* Header */}
          <div className="relative text-center mb-6">
            <div className="flex gap-2 items-center justify-center">
              <Link href="/" className="absolute left-0">
                <FontAwesomeIcon icon={faArrowLeft} className="h-5" />
              </Link>
              <h2 className="text-3xl md:text-2xl font-bold">
                {"Welcome to LandAir"}
              </h2>
            </div>
            <p className="mt-2 text-gray-300">
              {
                <>
                  Join <span className="font-semibold text-white">LandAir</span>{" "}
                  and start building amazing pages.
                </>
              }
            </p>
          </div>

          {/* Google Sign In */}
          <button
            className="w-full flex items-center justify-center gap-2 py-1 px-3 border border-white/20 rounded-lg shadow-sm text-sm font-medium text-white bg-white/10 hover:bg-white/20 transition-colors"
            onClick={handleGoogleSignIn}
            type="button"
          >
            <Image
              src={"/img/google.webp"}
              alt="Google"
              height={32}
              width={32}
            />
            <span>{"Sign up with Google"}</span>
          </button>

          {/* Email/Password Log In
          {!isSignUp && (
            <form className="mt-6 flex flex-col gap-3">
              <input
                type="email"
                placeholder="Email"
                className="w-full px-3 py-2 rounded bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
              <input
                type="password"
                placeholder="Password"
                className="w-full px-3 py-2 rounded bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
              <button
                className="w-full py-2 rounded bg-blue-500 hover:bg-blue-600 text-white font-semibold transition-colors disabled:opacity-60"
                onClick={handleEmailSignIn}
                disabled={loading || !email || !password}
                type="submit"
              >
                {loading ? "Signing in..." : "Sign in with Email"}
              </button>
              {error && (
                <p className="text-red-400 text-sm text-center">{error}</p>
              )}
            </form>
          )} */}

          <p className="text-center text-sm mt-4 text-white/50">
            By signing up you agree to our{" "}
            <a
              href="/terms-of-service"
              className="text-blue-400 hover:underline"
            >
              terms of service
            </a>{" "}
            and{" "}
            <a href="/privacy-policy" className="text-blue-400 hover:underline">
              privacy policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
