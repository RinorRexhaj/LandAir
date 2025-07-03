import React from "react";
import Navbar from "../components/Navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faGlobe } from "@fortawesome/free-solid-svg-icons";

const Terms = () => {
  return (
    <div>
      <Navbar />
      <div
        className="max-w-3xl mt-20 mx-auto px-4 py-12 text-white animate-fade [animation-fill-mode:backwards]"
        style={{
          animationDelay: "0.5s",
        }}
      >
        <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
        <p className="mb-4 text-sm">Effective Date: [Insert Date]</p>

        <p className="mb-6">
          Welcome to <strong>LandAir</strong> (“we,” “us,” or “our”). These
          Terms of Service (“Terms”) govern your use of our website and platform
          located at{" "}
          <a href="https://landair.app" className="text-blue-600 underline">
            landair.app
          </a>{" "}
          (the “Service”), which allows users to generate and deploy landing
          pages using AI.
        </p>

        <p className="mb-6">
          By using LandAir, you agree to be bound by these Terms. If you do not
          agree, do not use the Service.
        </p>

        <h2 className="text-xl font-semibold mb-2">1. Eligibility</h2>
        <p className="mb-6">
          You must be at least 13 years old (or 16 in the EU) to use LandAir. By
          using the Service, you confirm that you meet this requirement and have
          the legal authority to enter into this agreement.
        </p>

        <h2 className="text-xl font-semibold mb-2">2. Use of the Service</h2>
        <p className="mb-2">You may use the Service to:</p>
        <ul className="list-disc pl-6 mb-4">
          <li>Generate landing pages using AI by providing text prompts.</li>
          <li>Deploy landing pages to a live subdomain.</li>
          <li>Modify or delete your own generated content.</li>
        </ul>
        <p className="mb-2">You agree not to:</p>
        <ul className="list-disc pl-6 mb-6">
          <li>
            Use the platform to create or distribute harmful, illegal, or
            infringing content.
          </li>
          <li>
            Attempt to access, modify, or damage any part of the Service or its
            infrastructure.
          </li>
          <li>
            Reverse-engineer or misuse the AI systems powering the platform.
          </li>
        </ul>
        <p className="mb-6">
          We reserve the right to suspend or terminate accounts that violate
          these Terms.
        </p>

        <h2 className="text-xl font-semibold mb-2">3. User Content</h2>
        <p className="mb-6">
          You are solely responsible for the content you create using LandAir,
          including any text, prompts, images, or generated pages (“User
          Content”). By using the Service, you grant us a non-exclusive,
          worldwide license to host, display, and serve your User Content as
          part of the platform’s normal operation. You retain all ownership of
          your original input and generated output, unless it violates these
          Terms. We reserve the right to remove content that we deem offensive,
          harmful, illegal, or in violation of these Terms.
        </p>

        <h2 className="text-xl font-semibold mb-2">
          4. AI-Generated Content Disclaimer
        </h2>
        <p className="mb-2">
          LandAir uses artificial intelligence to generate content based on your
          prompts. While we strive for quality and accuracy, AI-generated
          content may be:
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li>Inaccurate or misleading</li>
          <li>Biased or inappropriate</li>
          <li>Not legally or ethically suitable for all use cases</li>
        </ul>
        <p className="mb-6">
          Use AI-generated content at your own risk. We are not liable for how
          it is used, distributed, or interpreted.
        </p>

        <h2 className="text-xl font-semibold mb-2">
          5. Deployments and Subdomains
        </h2>
        <p className="mb-2">
          LandAir may deploy your landing page to a unique subdomain (e.g.,{" "}
          <code>yourproject.landair.app</code>). You agree not to use these
          subdomains for:
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li>Phishing or scam websites</li>
          <li>Adult, violent, or discriminatory content</li>
          <li>Any illegal or malicious purpose</li>
        </ul>
        <p className="mb-6">
          We may remove or reclaim subdomains at our discretion.
        </p>

        <h2 className="text-xl font-semibold mb-2">6. Fees and Payments</h2>
        <p className="mb-6">
          Some features may be offered on a paid basis. You agree to pay all
          applicable fees, taxes, and charges for any subscription or one-time
          purchase. Prices and features are subject to change with notice. No
          refunds are provided except as required by law or explicitly stated.
        </p>

        <h2 className="text-xl font-semibold mb-2">7. Account and Data</h2>
        <p className="mb-6">
          You are responsible for maintaining the security of your account. Do
          not share your credentials. You agree that we may store and process
          your prompts, generated content, and usage data to provide and improve
          the Service, as outlined in our{" "}
          <a href="/privacy-policy" className="text-blue-500 hover:underline">
            Privacy Policy
          </a>
          .
        </p>

        <h2 className="text-xl font-semibold mb-2">8. Termination</h2>
        <p className="mb-6">
          We may suspend or terminate your access to the Service at any time if:
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li>You violate these Terms.</li>
          <li>We discontinue the Service.</li>
          <li>We are required to do so by law.</li>
        </ul>
        <p className="mb-6">
          Upon termination, your generated content and deployments may be
          deleted.
        </p>

        <h2 className="text-xl font-semibold mb-2">
          9. Limitation of Liability
        </h2>
        <p className="mb-6">
          To the maximum extent permitted by law, LandAir and its operators are
          not liable for:
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li>Any indirect, incidental, or consequential damages</li>
          <li>Loss of data, revenue, or business opportunities</li>
          <li>Issues caused by AI-generated content or user misuse</li>
        </ul>
        <p className="mb-6">
          Our total liability will not exceed the amount you paid to us in the
          last 12 months.
        </p>

        <h2 className="text-xl font-semibold mb-2">
          10. Changes to These Terms
        </h2>
        <p className="mb-6">
          We may update these Terms from time to time. We’ll notify you of
          significant changes via the website or email. Continued use of the
          Service means you accept the new terms.
        </p>

        <h2 className="text-xl font-semibold mb-2">11. Contact</h2>
        <p className="mb-6">
          If you have any questions, contact us at: <br />
          <FontAwesomeIcon icon={faEnvelope} />{" "}
          <a href="mailto:info@landair.app" className="text-blue-600 underline">
            info@landair.app
          </a>{" "}
          <br />
          <FontAwesomeIcon icon={faGlobe} />{" "}
          <a href="https://landair.app" className="text-blue-600 underline">
            https://landair.app
          </a>
        </p>
      </div>
    </div>
  );
};

export default Terms;
