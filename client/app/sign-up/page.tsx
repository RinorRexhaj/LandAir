"use client";
import React, { useState, useEffect } from "react";
import {
  checkPasswordStrength,
  generateStrongPassword,
  validateEmail,
} from "../utils/Validation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faSpinner } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import useApi from "../hooks/useApi";
import Confirmation from "./Confirmation";
import { supabase } from "../utils/Supabase";
import { useRouter } from "next/navigation";
import useAuth from "../hooks/useAuth";
import Loading from "../components/Loading";

interface FormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface ValidationErrors {
  fullName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

const SignUp = () => {
  const [isLogin, setIsLogin] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    feedback: "",
  });
  const { loading, setLoading } = useApi();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [router, user]);

  const handleGeneratePassword = async () => {
    const newPassword = generateStrongPassword();
    const updatedFormData = {
      ...formData,
      password: newPassword,
      confirmPassword: newPassword,
    };
    setFormData(updatedFormData);

    // Delay to ensure form fields visually update (if needed)
    setTimeout(async () => {
      if ("credentials" in navigator && "PasswordCredential" in window) {
        try {
          const cred = new PasswordCredential({
            id: formData.email,
            password: newPassword,
            name: "password",
          });
          await navigator.credentials.store(cred);
        } catch (err) {
          console.warn("Credential store failed:", err);
        }
      }
    }, 500);
  };

  const validateForm = () => {
    const newErrors: ValidationErrors = {};

    if (!isLogin && !formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (!isLogin && formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long";
    }

    if (!isLogin && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      let success = false;
      setLoading(true);
      if (isLogin) {
        success = await signIn();
      } else {
        success = await signUp();
      }
      setLoading(false);
      if (success) {
        if (isLogin) {
          router.push("/dashboard");
        } else {
          setConfirm(true);
        }
      }
    }
  };

  const signIn = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email: formData.email,
      password: formData.password,
    });

    if (error) {
      const newErrors: ValidationErrors = {};
      newErrors.password = error.message;
      newErrors.email = " ";
      setErrors(newErrors);
      return false;
    } else return true;
  };

  const signUp = async () => {
    const { error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: { name: formData.fullName, full_name: formData.fullName },
      },
    });

    if (error) {
      const newErrors: ValidationErrors = {};
      newErrors.password = error.message;
      newErrors.email = "";
      setErrors(newErrors);
      return false;
    } else return true;
  };

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

  useEffect(() => {
    if (formData.password) {
      setPasswordStrength(checkPasswordStrength(formData.password));
    }
  }, [formData.password]);

  if (authLoading) return <Loading />;

  return confirm ? (
    <Confirmation email={formData.email} />
  ) : (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gray-900">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="relative text-center">
          <h2 className="text-3xl font-bold text-white">
            {isLogin ? "Welcome Back" : "Create Your Account"}
          </h2>
          <Link href={"/"} className="absolute left-0">
            <FontAwesomeIcon icon={faArrowLeft} className="h-6" />
          </Link>
          <p className="mt-4 text-gray-400">
            {isLogin ? (
              "Sign in to your account to continue"
            ) : (
              <span>
                Join <span className="font-semibold text-white">LandAir</span>
                and start creating amazing pages
              </span>
            )}
          </p>
        </div>

        {/* Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {!isLogin && (
              <div>
                <label
                  htmlFor="fullName"
                  className="block text-sm font-medium text-gray-300"
                >
                  Full Name
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  autoComplete="name"
                  required
                  className={`mt-1 block w-full px-4 py-3 bg-gray-800 border ${
                    errors.fullName ? "border-red-500" : "border-gray-700"
                  } rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                />
                {errors.fullName && (
                  <p className="mt-1 text-sm text-red-500">{errors.fullName}</p>
                )}
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-300"
              >
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className={`mt-1 block w-full px-4 py-3 bg-gray-800 border ${
                  errors.email ? "border-red-500" : "border-gray-700"
                } rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            <div>
              <div className="flex justify-between items-center">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-300"
                >
                  Password
                </label>
                {!isLogin && (
                  <button
                    type="button"
                    onClick={handleGeneratePassword}
                    className="text-sm text-blue-500 hover:text-blue-400 transition-colors"
                  >
                    Generate Strong Password
                  </button>
                )}
              </div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className={`mt-1 block w-full px-4 py-3 bg-gray-800 border ${
                  errors.password ? "border-red-500" : "border-gray-700"
                } rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">{errors.password}</p>
              )}
              {!isLogin && formData.password && (
                <div className="mt-2">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${
                          passwordStrength.score >= 4
                            ? "bg-green-500"
                            : passwordStrength.score >= 3
                            ? "bg-yellow-500"
                            : "bg-red-500"
                        }`}
                        style={{
                          width: `${(passwordStrength.score / 5) * 100}%`,
                        }}
                      />
                    </div>
                    <span
                      className={`text-sm ${
                        passwordStrength.score >= 4
                          ? "text-green-500"
                          : passwordStrength.score >= 3
                          ? "text-yellow-500"
                          : "text-red-500"
                      }`}
                    >
                      {passwordStrength.score >= 4
                        ? "Strong"
                        : passwordStrength.score >= 3
                        ? "Medium"
                        : "Weak"}
                    </span>
                  </div>
                  {passwordStrength.feedback && (
                    <p className="mt-1 text-sm text-gray-400">
                      {passwordStrength.feedback}
                    </p>
                  )}
                </div>
              )}
            </div>

            {!isLogin && (
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-300"
                >
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  className={`mt-1 block w-full px-4 py-3 bg-gray-800 border ${
                    errors.confirmPassword
                      ? "border-red-500"
                      : "border-gray-700"
                  } rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      confirmPassword: e.target.value,
                    })
                  }
                />
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            )}
          </div>

          <div>
            <button
              type="submit"
              className="w-full h-12 flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              {loading ? (
                <FontAwesomeIcon icon={faSpinner} spin className="h-4 w-4" />
              ) : isLogin ? (
                "Sign In"
              ) : (
                "Create Account"
              )}
            </button>
          </div>
        </form>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-700"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-gray-900 text-gray-400">
              Or continue with
            </span>
          </div>
        </div>

        {/* Google Sign In */}
        <div>
          <button
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-gray-700 rounded-lg shadow-sm text-sm font-medium text-white bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span>Sign in with Google</span>
          </button>
        </div>

        {/* Toggle Login/Signup */}
        <div className="text-center">
          <button
            type="button"
            className="text-sm text-blue-500 hover:text-blue-400"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin
              ? "Don't have an account? Sign up"
              : "Already have an account? Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
