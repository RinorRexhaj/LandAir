import { redirect } from "next/navigation";

// Sign-up / login is temporarily disabled. Any visit to /sign-up is sent
// back to the home page. Re-enable by restoring the previous implementation
// from version control.
const SignUpPage = () => {
  redirect("/");
};

export default SignUpPage;
