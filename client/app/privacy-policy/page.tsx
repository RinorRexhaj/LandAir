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
        <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
        <p className="mb-8 text-sm text-gray-400">Last updated: 18 June 2026</p>

        {/* 1. Introduction */}
        <h2 className="text-xl font-semibold mb-2 mt-8">1. Introduction</h2>
        <p className="mb-4">
          LandAir (&ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;) is
          committed to protecting your personal data and respecting your privacy.
          This Privacy Policy explains what personal data we collect, how we use
          it, with whom we share it, and what rights you have under the{" "}
          <strong>
            General Data Protection Regulation (EU) 2016/679 (GDPR)
          </strong>
          .
        </p>
        <p className="mb-4">
          This policy applies to all users of the LandAir website and
          application (the &ldquo;Service&rdquo;).
        </p>
        <p className="mb-6">
          If you have questions about this policy, contact us at:{" "}
          <a
            href="mailto:rinorrexhaj10@gmail.com"
            className="text-blue-400 hover:text-blue-300 underline"
          >
            rinorrexhaj10@gmail.com
          </a>
        </p>

        {/* 2. Who We Are */}
        <h2 className="text-xl font-semibold mb-2 mt-8">
          2. Who We Are (Data Controller)
        </h2>
        <p className="mb-4">
          LandAir is the data controller for personal data collected through the
          Service. If you are located in the European Union, your data is
          processed in accordance with GDPR.
        </p>
        <p className="mb-6">
          Contact:
          <br />
          <strong>LandAir</strong>
          <br />
          Email:{" "}
          <a
            href="mailto:rinorrexhaj10@gmail.com"
            className="text-blue-400 hover:text-blue-300 underline"
          >
            rinorrexhaj10@gmail.com
          </a>
        </p>

        {/* 3. What Personal Data We Collect */}
        <h2 className="text-xl font-semibold mb-2 mt-8">
          3. What Personal Data We Collect
        </h2>
        <p className="mb-4">
          We collect the following categories of personal data:
        </p>

        <h3 className="text-lg font-semibold mb-2">3.1 Account Data</h3>
        <ul className="list-disc pl-6 mb-4">
          <li>Name and email address (when you register)</li>
          <li>
            Password (stored in hashed form — we never store plaintext
            passwords)
          </li>
          <li>Profile preferences and settings</li>
        </ul>

        <h3 className="text-lg font-semibold mb-2">
          3.2 TikTok Integration Data
        </h3>
        <p className="mb-2">
          When you connect your TikTok account to LandAir, we access and process
          the following through TikTok&apos;s official Content Posting API:
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li>Your TikTok username and display name</li>
          <li>OAuth access tokens required to post content on your behalf</li>
          <li>
            Video files and metadata (captions, hashtags, privacy settings) that
            you explicitly choose to submit for posting
          </li>
          <li>Post status and confirmation data returned by TikTok</li>
        </ul>
        <p className="mb-4">
          We do <strong>not</strong> collect your TikTok password. Authorization
          is handled exclusively via TikTok&apos;s official OAuth 2.0 flow.
        </p>

        <h3 className="text-lg font-semibold mb-2">3.3 Usage Data</h3>
        <ul className="list-disc pl-6 mb-4">
          <li>Log data (IP address, browser type, pages visited, timestamps)</li>
          <li>Device and platform information</li>
          <li>Feature usage patterns (e.g., which editing tools you use)</li>
        </ul>

        <h3 className="text-lg font-semibold mb-2">3.4 Payment Data</h3>
        <p className="mb-4">
          If you subscribe to a paid plan, payment is handled by a third-party
          payment processor (e.g., Stripe). We do not store your full card number
          or banking details.
        </p>

        <h3 className="text-lg font-semibold mb-2">3.5 Communications</h3>
        <p className="mb-6">
          If you contact us by email or support form, we retain those
          communications to handle your request.
        </p>

        {/* 4. How We Use Your Data */}
        <h2 className="text-xl font-semibold mb-2 mt-8">
          4. How We Use Your Data
        </h2>
        <p className="mb-4">
          We process your personal data for the following purposes and on the
          following legal bases under GDPR:
        </p>
        <div className="overflow-x-auto mb-4">
          <table className="w-full text-left text-sm border border-white/15">
            <thead className="bg-white/5">
              <tr>
                <th className="border border-white/15 px-4 py-2 font-semibold">
                  Purpose
                </th>
                <th className="border border-white/15 px-4 py-2 font-semibold">
                  Legal Basis
                </th>
              </tr>
            </thead>
            <tbody className="text-gray-300/90">
              {[
                [
                  "Providing and operating the Service",
                  "Performance of a contract (Art. 6(1)(b))",
                ],
                [
                  "Posting content to TikTok on your behalf",
                  "Performance of a contract / your explicit consent (Art. 6(1)(a)(b))",
                ],
                [
                  "Managing your account",
                  "Performance of a contract (Art. 6(1)(b))",
                ],
                [
                  "Sending service-related notifications",
                  "Performance of a contract (Art. 6(1)(b))",
                ],
                [
                  "Improving the Service through usage analytics",
                  "Legitimate interests (Art. 6(1)(f))",
                ],
                [
                  "Complying with legal obligations",
                  "Legal obligation (Art. 6(1)(c))",
                ],
                [
                  "Sending marketing emails (if you opt in)",
                  "Consent (Art. 6(1)(a))",
                ],
              ].map(([purpose, basis], i) => (
                <tr key={i}>
                  <td className="border border-white/15 px-4 py-2 align-top">
                    {purpose}
                  </td>
                  <td className="border border-white/15 px-4 py-2 align-top">
                    {basis}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mb-6">
          We do not use your data for automated decision-making or profiling that
          produces legal or similarly significant effects.
        </p>

        {/* 5. TikTok API */}
        <h2 className="text-xl font-semibold mb-2 mt-8">
          5. TikTok API — Special Notice
        </h2>
        <p className="mb-2">
          LandAir uses the <strong>TikTok Content Posting API</strong> to allow
          you to publish videos to TikTok directly from our platform. This means:
        </p>
        <ul className="list-disc pl-6 mb-6">
          <li>
            We send your video content and post settings to TikTok&apos;s servers
            on your instruction.
          </li>
          <li>
            TikTok processes that data in accordance with TikTok&apos;s own
            Privacy Policy, which we encourage you to review at{" "}
            <a
              href="https://www.tiktok.com/legal/privacy-policy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 underline"
            >
              https://www.tiktok.com/legal/privacy-policy
            </a>
            .
          </li>
          <li>
            We store TikTok OAuth tokens securely and only for as long as your
            TikTok integration is active. You can revoke access at any time from
            your LandAir account settings or directly from TikTok&apos;s
            &ldquo;Manage App Permissions&rdquo; settings.
          </li>
          <li>
            We do not sell or share your TikTok data with any party other than
            TikTok itself for the purpose of fulfilling your posting requests.
          </li>
        </ul>

        {/* 6. Data Sharing */}
        <h2 className="text-xl font-semibold mb-2 mt-8">
          6. Data Sharing and Third Parties
        </h2>
        <p className="mb-2">
          We do not sell your personal data. We share data only in the following
          circumstances:
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li>
            <strong>TikTok (ByteDance Ltd.):</strong> To post content on your
            behalf via the Content Posting API.
          </li>
          <li>
            <strong>Cloud infrastructure providers:</strong> We use trusted
            hosting providers (e.g., AWS, Google Cloud, or similar) to store and
            process data securely.
          </li>
          <li>
            <strong>Payment processors:</strong> If you pay for a subscription,
            your payment details are handled by our payment processor (e.g.,
            Stripe) under their own privacy policy.
          </li>
          <li>
            <strong>Legal requirements:</strong> We may disclose your data if
            required by law, court order, or to protect the rights, property, or
            safety of LandAir or others.
          </li>
        </ul>
        <p className="mb-6">
          All third-party processors are bound by data processing agreements and
          are only permitted to process your data on our instructions.
        </p>

        {/* 7. International Transfers */}
        <h2 className="text-xl font-semibold mb-2 mt-8">
          7. International Data Transfers
        </h2>
        <p className="mb-2">
          Some of our service providers may be located outside the European
          Economic Area (EEA). Where this is the case, we ensure adequate
          safeguards are in place, such as:
        </p>
        <ul className="list-disc pl-6 mb-6">
          <li>EU Standard Contractual Clauses (SCCs), or</li>
          <li>Adequacy decisions issued by the European Commission.</li>
        </ul>

        {/* 8. Data Retention */}
        <h2 className="text-xl font-semibold mb-2 mt-8">8. Data Retention</h2>
        <p className="mb-2">
          We retain your personal data for as long as your account is active or
          as necessary to provide the Service. Specifically:
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li>
            <strong>Account data:</strong> Retained until you delete your
            account, plus up to 30 days for backup purposes.
          </li>
          <li>
            <strong>TikTok tokens:</strong> Deleted immediately upon
            disconnecting your TikTok integration or deleting your account.
          </li>
          <li>
            <strong>Usage logs:</strong> Retained for up to 12 months.
          </li>
          <li>
            <strong>Support communications:</strong> Retained for up to 3 years.
          </li>
        </ul>
        <p className="mb-6">
          After the retention period, data is securely deleted or anonymised.
        </p>

        {/* 9. Your Rights */}
        <h2 className="text-xl font-semibold mb-2 mt-8">
          9. Your Rights Under GDPR
        </h2>
        <p className="mb-2">
          As a data subject in the EU, you have the following rights:
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li>
            <strong>Right of access (Art. 15):</strong> Request a copy of the
            personal data we hold about you.
          </li>
          <li>
            <strong>Right to rectification (Art. 16):</strong> Request correction
            of inaccurate or incomplete data.
          </li>
          <li>
            <strong>Right to erasure (Art. 17):</strong> Request deletion of your
            personal data (&ldquo;right to be forgotten&rdquo;).
          </li>
          <li>
            <strong>Right to restriction (Art. 18):</strong> Request that we
            restrict processing of your data.
          </li>
          <li>
            <strong>Right to data portability (Art. 20):</strong> Receive your
            data in a structured, machine-readable format.
          </li>
          <li>
            <strong>Right to object (Art. 21):</strong> Object to processing
            based on legitimate interests or for direct marketing.
          </li>
          <li>
            <strong>Right to withdraw consent (Art. 7(3)):</strong> Where
            processing is based on consent, you may withdraw it at any time
            without affecting the lawfulness of prior processing.
          </li>
        </ul>
        <p className="mb-4">
          To exercise any of these rights, email us at{" "}
          <a
            href="mailto:rinorrexhaj10@gmail.com"
            className="text-blue-400 hover:text-blue-300 underline"
          >
            rinorrexhaj10@gmail.com
          </a>
          . We will respond within 30 days.
        </p>
        <p className="mb-6">
          You also have the right to lodge a complaint with your local data
          protection authority. In the EU, you can find your national authority
          at{" "}
          <a
            href="https://edpb.europa.eu/about-edpb/about-edpb/members_en"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 underline"
          >
            edpb.europa.eu
          </a>
          .
        </p>

        {/* 10. Security */}
        <h2 className="text-xl font-semibold mb-2 mt-8">10. Security</h2>
        <p className="mb-2">
          We implement appropriate technical and organisational measures to
          protect your personal data against unauthorised access, loss, or
          disclosure, including:
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li>Encryption of data in transit (TLS/HTTPS)</li>
          <li>Encrypted storage of OAuth tokens</li>
          <li>Hashed and salted passwords</li>
          <li>Access controls and audit logging</li>
        </ul>
        <p className="mb-6">
          No method of transmission over the internet is 100% secure. If you
          suspect a security issue, please notify us immediately at{" "}
          <a
            href="mailto:rinorrexhaj10@gmail.com"
            className="text-blue-400 hover:text-blue-300 underline"
          >
            rinorrexhaj10@gmail.com
          </a>
          .
        </p>

        {/* 11. Cookies */}
        <h2 className="text-xl font-semibold mb-2 mt-8">11. Cookies</h2>
        <p className="mb-6">
          LandAir uses cookies and similar tracking technologies to operate and
          improve the Service. You can control cookie preferences through your
          browser settings.
        </p>

        {/* 12. Children's Privacy */}
        <h2 className="text-xl font-semibold mb-2 mt-8">
          12. Children&apos;s Privacy
        </h2>
        <p className="mb-6">
          LandAir is not directed at children under the age of 13 (or 16 where
          required by local law). We do not knowingly collect personal data from
          children. If you believe a child has provided us with personal data,
          please contact us and we will delete it promptly.
        </p>

        {/* 13. Changes */}
        <h2 className="text-xl font-semibold mb-2 mt-8">
          13. Changes to This Policy
        </h2>
        <p className="mb-6">
          We may update this Privacy Policy from time to time. When we do, we
          will revise the &ldquo;Last updated&rdquo; date at the top and, where
          changes are material, notify you by email or in-app notice. Your
          continued use of the Service after changes are posted constitutes
          acceptance of the updated policy.
        </p>

        {/* 14. Contact */}
        <h2 className="text-xl font-semibold mb-2 mt-8">14. Contact Us</h2>
        <p>
          For any privacy-related questions or requests:
          <br />
          <strong>LandAir</strong>
          <br />
          Email:{" "}
          <a
            href="mailto:rinorrexhaj10@gmail.com"
            className="text-blue-400 hover:text-blue-300 underline"
          >
            rinorrexhaj10@gmail.com
          </a>
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
