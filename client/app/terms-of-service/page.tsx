import React from "react";
import Navbar from "../components/Navbar";

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
        <h1 className="text-3xl font-bold mb-2">Terms of Service</h1>
        <p className="mb-8 text-sm text-gray-400">Last updated: 18 June 2026</p>

        {/* 1. Acceptance */}
        <h2 className="text-xl font-semibold mb-2 mt-8">
          1. Acceptance of Terms
        </h2>
        <p className="mb-4">
          By accessing or using the LandAir website or application (the
          &ldquo;Service&rdquo;), you agree to be bound by these Terms of Service
          (&ldquo;Terms&rdquo;). If you do not agree, please do not use the
          Service.
        </p>
        <p className="mb-6">
          These Terms constitute a legally binding agreement between you and
          LandAir (&ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;).
          They apply to all users of the Service, whether accessing as a guest,
          registered user, or paying subscriber.
        </p>

        {/* 2. About */}
        <h2 className="text-xl font-semibold mb-2 mt-8">2. About LandAir</h2>
        <p className="mb-4">
          LandAir is a video creation and editing platform that allows users to
          create, edit, and publish video content directly to TikTok via
          TikTok&apos;s official Content Posting API.
        </p>
        <p className="mb-6">
          Contact:{" "}
          <a
            href="mailto:rinorrexhaj10@gmail.com"
            className="text-blue-400 hover:text-blue-300 underline"
          >
            rinorrexhaj10@gmail.com
          </a>
        </p>

        {/* 3. Eligibility */}
        <h2 className="text-xl font-semibold mb-2 mt-8">3. Eligibility</h2>
        <p className="mb-4">
          You must be at least <strong>13 years old</strong> (or 16 years old if
          you are located in a jurisdiction where 16 is the minimum age for
          digital services) to use LandAir. By using the Service, you represent
          that you meet this age requirement.
        </p>
        <p className="mb-6">
          If you are using LandAir on behalf of a company or organisation, you
          represent that you have the authority to bind that entity to these
          Terms.
        </p>

        {/* 4. Account Registration */}
        <h2 className="text-xl font-semibold mb-2 mt-8">
          4. Account Registration
        </h2>
        <p className="mb-2">
          To access the full features of LandAir, you must create an account. You
          agree to:
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li>Provide accurate and complete information during registration</li>
          <li>Keep your account credentials confidential</li>
          <li>
            Notify us immediately of any unauthorised use of your account at{" "}
            <a
              href="mailto:rinorrexhaj10@gmail.com"
              className="text-blue-400 hover:text-blue-300 underline"
            >
              rinorrexhaj10@gmail.com
            </a>
          </li>
          <li>Be responsible for all activity that occurs under your account</li>
        </ul>
        <p className="mb-6">
          We reserve the right to suspend or terminate accounts that provide
          false information or violate these Terms.
        </p>

        {/* 5. TikTok Integration */}
        <h2 className="text-xl font-semibold mb-2 mt-8">
          5. TikTok Integration
        </h2>

        <h3 className="text-lg font-semibold mb-2">5.1 Authorization</h3>
        <p className="mb-2">
          LandAir integrates with TikTok&apos;s Content Posting API. By
          connecting your TikTok account, you:
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li>
            Grant LandAir permission to post video content to TikTok on your
            behalf, as authorized through TikTok&apos;s official OAuth flow
          </li>
          <li>
            Confirm that you are the rightful owner of the TikTok account being
            connected, or that you have authority to act on behalf of the account
            holder
          </li>
        </ul>

        <h3 className="text-lg font-semibold mb-2">
          5.2 Your Responsibility for Posted Content
        </h3>
        <p className="mb-2">
          You are solely responsible for all content you create, upload, and
          publish through LandAir. This includes ensuring that your content
          complies with:
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li>
            TikTok&apos;s{" "}
            <a
              href="https://www.tiktok.com/community-guidelines"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 underline"
            >
              Community Guidelines
            </a>
          </li>
          <li>
            TikTok&apos;s{" "}
            <a
              href="https://www.tiktok.com/legal/terms-of-service"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 underline"
            >
              Terms of Service
            </a>
          </li>
          <li>All applicable laws and regulations in your jurisdiction</li>
        </ul>
        <p className="mb-4">
          LandAir does not review, endorse, or take responsibility for content
          you post to TikTok.
        </p>

        <h3 className="text-lg font-semibold mb-2">5.3 Revocation of Access</h3>
        <p className="mb-6">
          You may disconnect your TikTok account from LandAir at any time through
          your account settings. You may also revoke access directly from
          TikTok&apos;s app permissions settings. Upon revocation, LandAir will
          no longer post to your TikTok account and will delete any stored tokens
          associated with your TikTok integration.
        </p>

        {/* 6. Acceptable Use */}
        <h2 className="text-xl font-semibold mb-2 mt-8">6. Acceptable Use</h2>
        <p className="mb-2">You agree not to use LandAir to:</p>
        <ul className="list-disc pl-6 mb-4">
          <li>
            Post content that is illegal, defamatory, obscene, harassing, or
            infringes any third party&apos;s rights
          </li>
          <li>Upload content containing malware, viruses, or malicious code</li>
          <li>
            Attempt to gain unauthorised access to our systems or other
            users&apos; accounts
          </li>
          <li>
            Reverse engineer, decompile, or attempt to extract the source code of
            the Service
          </li>
          <li>
            Scrape, crawl, or extract data from the Service in an automated manner
            without our written permission
          </li>
          <li>
            Impersonate any person or entity, or misrepresent your affiliation
            with any person or entity
          </li>
          <li>
            Use the Service in any way that violates TikTok&apos;s Terms of
            Service or Developer Policies
          </li>
        </ul>
        <p className="mb-6">
          We reserve the right to suspend or terminate your access if we
          determine, in our sole discretion, that you have violated these rules.
        </p>

        {/* 7. Intellectual Property */}
        <h2 className="text-xl font-semibold mb-2 mt-8">
          7. Intellectual Property
        </h2>

        <h3 className="text-lg font-semibold mb-2">7.1 Your Content</h3>
        <p className="mb-4">
          You retain all ownership rights in the videos and content you create
          using LandAir. By using the Service to post content to TikTok, you grant
          LandAir a limited, non-exclusive, royalty-free licence to process,
          store, and transmit your content solely as necessary to provide the
          Service.
        </p>

        <h3 className="text-lg font-semibold mb-2">
          7.2 LandAir&apos;s Intellectual Property
        </h3>
        <p className="mb-4">
          All elements of the LandAir Service — including but not limited to
          software, design, trademarks, logos, templates, and text — are owned by
          LandAir or its licensors. You may not copy, reproduce, distribute, or
          create derivative works from any part of the Service without our written
          permission.
        </p>

        <h3 className="text-lg font-semibold mb-2">7.3 Third-Party Content</h3>
        <p className="mb-6">
          If you incorporate third-party material (music, images, footage) into
          your videos, you are responsible for ensuring you have the necessary
          rights or licences to use and publish that material.
        </p>

        {/* 8. Subscriptions */}
        <h2 className="text-xl font-semibold mb-2 mt-8">
          8. Subscriptions and Payments
        </h2>

        <h3 className="text-lg font-semibold mb-2">8.1 Free and Paid Plans</h3>
        <p className="mb-4">
          LandAir may offer both a free tier and paid subscription plans. Features
          available on each plan will be described on our pricing page.
        </p>

        <h3 className="text-lg font-semibold mb-2">8.2 Billing</h3>
        <p className="mb-4">
          Paid subscriptions are billed on a recurring basis (monthly or
          annually, as selected). By subscribing, you authorise us to charge your
          payment method on each renewal date.
        </p>

        <h3 className="text-lg font-semibold mb-2">8.3 Cancellation</h3>
        <p className="mb-4">
          You may cancel your subscription at any time from your account settings.
          Cancellation takes effect at the end of the current billing period. You
          will retain access to paid features until the period ends.
        </p>

        <h3 className="text-lg font-semibold mb-2">8.4 Refunds</h3>
        <p className="mb-4">
          If you are an EU consumer, you have a statutory right of withdrawal of
          14 days from the date of purchase for digital services, provided you
          have not yet started using the service. Once you have accessed the paid
          features of the Service, the right of withdrawal may not apply. To
          request a refund under this right, contact us at{" "}
          <a
            href="mailto:rinorrexhaj10@gmail.com"
            className="text-blue-400 hover:text-blue-300 underline"
          >
            rinorrexhaj10@gmail.com
          </a>{" "}
          within 14 days.
        </p>

        <h3 className="text-lg font-semibold mb-2">8.5 Price Changes</h3>
        <p className="mb-6">
          We may change subscription prices with at least 30 days&apos; notice.
          Continued use after the effective date constitutes acceptance of the new
          prices.
        </p>

        {/* 9. Disclaimers */}
        <h2 className="text-xl font-semibold mb-2 mt-8">9. Disclaimers</h2>
        <p className="mb-4">
          THE SERVICE IS PROVIDED &ldquo;AS IS&rdquo; AND &ldquo;AS
          AVAILABLE&rdquo; WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR
          IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY,
          FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
        </p>
        <p className="mb-2">We do not warrant that:</p>
        <ul className="list-disc pl-6 mb-6">
          <li>The Service will be uninterrupted, error-free, or free of viruses</li>
          <li>
            Content posted via the TikTok API will always be published
            successfully (TikTok&apos;s platform, availability, and policies are
            outside our control)
          </li>
          <li>
            Results obtained from use of the Service will meet your expectations
          </li>
        </ul>

        {/* 10. Limitation of Liability */}
        <h2 className="text-xl font-semibold mb-2 mt-8">
          10. Limitation of Liability
        </h2>
        <p className="mb-4">
          To the maximum extent permitted by applicable law, LandAir shall not be
          liable for any indirect, incidental, special, consequential, or
          punitive damages, including but not limited to loss of profits, data,
          goodwill, or business opportunities, arising out of or in connection
          with your use of the Service.
        </p>
        <p className="mb-4">
          Nothing in these Terms limits or excludes liability for death or
          personal injury caused by negligence, fraud or fraudulent
          misrepresentation, or any other liability that cannot be excluded under
          applicable law (including EU consumer law).
        </p>
        <p className="mb-6">
          If you are an EU consumer, you retain any statutory rights that cannot
          be waived by contract under EU or national law.
        </p>

        {/* 11. Indemnification */}
        <h2 className="text-xl font-semibold mb-2 mt-8">11. Indemnification</h2>
        <p className="mb-2">
          You agree to indemnify and hold harmless LandAir and its directors,
          employees, and agents from any claims, damages, losses, liabilities,
          and expenses (including reasonable legal fees) arising from:
        </p>
        <ul className="list-disc pl-6 mb-6">
          <li>Your use of the Service</li>
          <li>Your violation of these Terms</li>
          <li>
            Your violation of any third-party rights, including intellectual
            property rights
          </li>
          <li>Content you post to TikTok via LandAir</li>
        </ul>

        {/* 12. Third-Party Services */}
        <h2 className="text-xl font-semibold mb-2 mt-8">
          12. Third-Party Services
        </h2>
        <p className="mb-6">
          The Service integrates with TikTok and may link to or integrate with
          other third-party services. We are not responsible for the content,
          privacy practices, or terms of any third-party service. Your use of
          third-party services is governed solely by their respective terms and
          policies.
        </p>

        {/* 13. Modifications to the Service */}
        <h2 className="text-xl font-semibold mb-2 mt-8">
          13. Modifications to the Service
        </h2>
        <p className="mb-6">
          We reserve the right to modify, suspend, or discontinue the Service (or
          any part of it) at any time, with or without notice. We will make
          reasonable efforts to provide advance notice of significant changes. We
          are not liable to you or any third party for any modification,
          suspension, or discontinuation of the Service.
        </p>

        {/* 14. Changes to These Terms */}
        <h2 className="text-xl font-semibold mb-2 mt-8">
          14. Changes to These Terms
        </h2>
        <p className="mb-4">
          We may update these Terms from time to time. When we do, we will update
          the &ldquo;Last updated&rdquo; date and notify you via email or in-app
          notification for material changes. Your continued use of the Service
          after the effective date of updated Terms constitutes acceptance of the
          changes.
        </p>
        <p className="mb-6">
          If you do not agree to the updated Terms, you must stop using the
          Service and may delete your account.
        </p>

        {/* 15. Governing Law */}
        <h2 className="text-xl font-semibold mb-2 mt-8">
          15. Governing Law and Dispute Resolution
        </h2>
        <p className="mb-4">
          These Terms are governed by and construed in accordance with the laws of
          the <strong>European Union</strong> and applicable member state law.
        </p>
        <p className="mb-4">
          If you are an EU consumer, you also benefit from any mandatory
          provisions of the consumer protection law in the country where you
          reside.
        </p>
        <p className="mb-6">
          We encourage you to contact us first at{" "}
          <a
            href="mailto:rinorrexhaj10@gmail.com"
            className="text-blue-400 hover:text-blue-300 underline"
          >
            rinorrexhaj10@gmail.com
          </a>{" "}
          to resolve any dispute informally. EU consumers may also use the
          European Commission&apos;s Online Dispute Resolution (ODR) platform:{" "}
          <a
            href="https://ec.europa.eu/consumers/odr"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 underline"
          >
            https://ec.europa.eu/consumers/odr
          </a>
          .
        </p>

        {/* 16. Termination */}
        <h2 className="text-xl font-semibold mb-2 mt-8">16. Termination</h2>

        <h3 className="text-lg font-semibold mb-2">16.1 By You</h3>
        <p className="mb-4">
          You may delete your account at any time through your account settings.
          Deletion terminates these Terms, except for provisions that by their
          nature should survive.
        </p>

        <h3 className="text-lg font-semibold mb-2">16.2 By Us</h3>
        <p className="mb-4">
          We reserve the right to suspend or terminate your account if you breach
          these Terms, without prior notice in cases of serious breach. We will
          provide notice where reasonably possible.
        </p>

        <h3 className="text-lg font-semibold mb-2">16.3 Effect of Termination</h3>
        <p className="mb-6">
          Upon termination, your right to use the Service ceases immediately. We
          will delete your personal data in accordance with our{" "}
          <a
            href="/privacy-policy"
            className="text-blue-400 hover:text-blue-300 underline"
          >
            Privacy Policy
          </a>
          .
        </p>

        {/* 17. Miscellaneous */}
        <h2 className="text-xl font-semibold mb-2 mt-8">17. Miscellaneous</h2>
        <ul className="list-disc pl-6 mb-6">
          <li>
            <strong>Entire Agreement:</strong> These Terms, together with our
            Privacy Policy, constitute the entire agreement between you and
            LandAir regarding the Service.
          </li>
          <li>
            <strong>Severability:</strong> If any provision of these Terms is
            found unenforceable, the remaining provisions remain in full force.
          </li>
          <li>
            <strong>No Waiver:</strong> Our failure to enforce any right or
            provision does not constitute a waiver of that right.
          </li>
          <li>
            <strong>Assignment:</strong> You may not assign your rights or
            obligations under these Terms without our prior written consent. We
            may assign our rights without restriction.
          </li>
        </ul>

        {/* 18. Contact */}
        <h2 className="text-xl font-semibold mb-2 mt-8">18. Contact</h2>
        <p>
          For questions about these Terms:
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

export default Terms;
