import React from "react";
import Navbar from "../components/Navbar";

const PrivacyPolicy = () => {
  return (
    <div>
      <Navbar />
      <div
        className="max-w-3xl mt-20 mx-auto px-4 py-12 text-white animate-fade [animation-fill-mode:backwards]"
        style={{
          animationDelay: "0.5s",
        }}
      >
        <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
        <p className="mb-4 text-sm text-gray-500">
          Effective Date: [Insert Date]
        </p>

        <p className="mb-6">
          This Privacy Policy explains how <strong>LandAir</strong> (“we,” “us,”
          or “our”) collects, uses, and protects your information when you use
          our platform located at{" "}
          <a href="https://landair.app" className="text-blue-600 underline">
            landair.app
          </a>{" "}
          (the “Service”).
        </p>

        <h2 className="text-xl font-semibold mb-2">
          1. Information We Collect
        </h2>
        <ul className="list-disc pl-6 mb-6">
          <li>
            <strong>Account Information:</strong> When you sign up or log in, we
            collect your email address and assign you a unique user ID through
            our authentication provider, Supabase.
          </li>
          <li>
            <strong>Prompt Data:</strong> We collect the text prompts you submit
            to generate landing pages.
          </li>
          <li>
            <strong>Generated Content:</strong> We store the HTML, CSS, and any
            other output from your prompts to power your live website.
          </li>
          <li>
            <strong>Usage Data:</strong> We may collect metadata like
            timestamps, feature usage, and deployment activity.
          </li>
          <li>
            <strong>Optional OAuth Info:</strong> If you log in using Google, we
            may receive your name and profile picture.
          </li>
        </ul>

        <h2 className="text-xl font-semibold mb-2">
          2. How We Use Your Information
        </h2>
        <ul className="list-disc pl-6 mb-6">
          <li>To provide and operate the Service</li>
          <li>To deploy and serve your generated pages</li>
          <li>To manage your account and projects</li>
          <li>To improve the platform experience and performance</li>
          <li>
            To enforce our{" "}
            <a
              href="/terms-of-service"
              className="text-blue-500 hover:underline"
            >
              Terms of Service
            </a>{" "}
            and ensure security
          </li>
        </ul>

        <h2 className="text-xl font-semibold mb-2">
          3. How We Share Your Information
        </h2>
        <p className="mb-2">
          We do not sell your personal data. However, we may share data with:
        </p>
        <ul className="list-disc pl-6 mb-6">
          <li>
            <strong>Supabase</strong> – for authentication and database storage
          </li>
          <li>
            <strong>Vercel</strong> – for hosting your deployed landing pages
          </li>
          <li>
            Service providers that support our infrastructure (e.g., analytics
            or error tracking tools, if used)
          </li>
          <li>Authorities if required by law or legal process</li>
        </ul>

        <h2 className="text-xl font-semibold mb-2">4. Cookies & Analytics</h2>
        <p className="mb-6">
          We may use cookies and third-party analytics tools (like Vercel
          Analytics or Google Analytics) to understand usage and improve the
          platform. You can disable cookies in your browser settings.
        </p>

        <h2 className="text-xl font-semibold mb-2">5. Data Retention</h2>
        <p className="mb-6">
          We retain your data as long as necessary to provide the Service and
          comply with legal obligations. You may request deletion of your
          account and associated data by contacting us.
        </p>

        <h2 className="text-xl font-semibold mb-2">6. Your Rights</h2>
        <p className="mb-6">
          Depending on your location, you may have rights under data protection
          laws (e.g., GDPR or CCPA), including the right to access, update, or
          delete your personal information.
        </p>

        <h2 className="text-xl font-semibold mb-2">7. Security</h2>
        <p className="mb-6">
          We implement reasonable safeguards to protect your data. However, no
          system is 100% secure, so we cannot guarantee absolute security.
        </p>

        <h2 className="text-xl font-semibold mb-2">
          8. Children&apos;s Privacy
        </h2>
        <p className="mb-6">
          LandAir is not intended for use by children under 13 (or 16 in the
          EU). We do not knowingly collect personal information from children.
        </p>

        <h2 className="text-xl font-semibold mb-2">
          9. Changes to This Policy
        </h2>
        <p className="mb-6">
          We may update this Privacy Policy periodically. We will notify you of
          significant changes by posting them on the site or emailing you.
        </p>

        <h2 className="text-xl font-semibold mb-2">10. Contact Us</h2>
        <p>
          If you have any questions or requests regarding your data, contact us
          at: <br />
          📧{" "}
          <a href="mailto:info@landair.app" className="text-blue-600 underline">
            info@landair.app
          </a>
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
