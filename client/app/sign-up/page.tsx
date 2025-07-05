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

  return (
    <div
      ref={vantaRef}
      className="min-h-screen w-full relative overflow-hidden"
    >
      <div className="absolute inset-0 backdrop-blur-sm bg-black/40" />
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <div className="w-full max-w-md bg-white/5 backdrop-blur-md border border-white/20 shadow-xl rounded-2xl p-8 text-white">
          {/* Header */}
          <div className="relative text-center mb-6">
            <div className="flex gap-2 items-center justify-center">
              <Link href="/" className="absolute left-0">
                <FontAwesomeIcon icon={faArrowLeft} className="h-5" />
              </Link>
              <h2 className="text-3xl md:text-2xl font-bold">
                Welcome to LandAir
              </h2>
            </div>
            <p className="mt-2 text-gray-300">
              Join <span className="font-semibold text-white">LandAir</span> and
              start building amazing pages.
            </p>
          </div>

          {/* Google Sign In */}
          <button
            className="w-full flex items-center justify-center gap-2 py-1 px-3 border border-white/20 rounded-lg shadow-sm text-sm font-medium text-white bg-white/10 hover:bg-white/20 transition-colors"
            onClick={handleGoogleSignIn}
          >
            <Image
              src={"/img/google.webp"}
              alt="Google"
              height={32}
              width={32}
            />
            <span>Sign in with Google</span>
          </button>

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
