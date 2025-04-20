import { CommonHead } from '@/src/components/elements/CommonHead';
import { Navbar } from '@/src/components/layouts/Navbar';
import { CaretLeft } from '@phosphor-icons/react';
import Link from 'next/link';
import { Shell } from '../../components/layouts/Shell';

export const PrivacyPolicy = () => {
  return (
    <>
      <Navbar />
      <CommonHead title="Privacy Policy" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="mt-8" />

        <div className="flex space-x-1 items-center mb-4 group text-sm">
          <CaretLeft size={14} weight="bold" className="text-gray-400 group-hover:text-primary-500" />
          <Link href="/policies" className="text-gray-500 group-hover:text-primary-500">
            Policies
          </Link>
        </div>
        <h3 className="text-3xl font-semibold tracking-[-0.20px]">Privacy Policy</h3>

        <div className="mt-4" />

        <article className="prose prose-base prose-h1:text-lg prose-h1:font-semibold prose-h2:text-base prose-h2:font-semibold ">
          <p className="text-gray-500">Last updated: 22 March 2023</p>
          <p>
            MedGram ("we," "us," or "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and
            protect your personal information when you access or use our website, mobile application, or any other online service (collectively, the
            "Services"). By accessing or using the Services, you agree to this Privacy Policy.
          </p>
          <h2>1. Information We Collect</h2>
          <p>
            <span className="font-semibold">1.1 </span>
            Personal Information: We collect personal information you provide to us when you access or use the Services, such as your name and email
            address. We may also collect additional information you choose to provide, such as demographic information or information related to your
            preferences and interests.
          </p>
          <p>
            <span className="font-semibold">1.2 </span>
            Usage Data: We collect information about your usage of the Services, including but not limited to the pages you view, the time spent on
            the Services, the links you click, and other actions you take while using the Services.
          </p>
          <p>
            <span className="font-semibold">1.3 </span>
            Device and Log Data: We may collect information about the device you use to access the Services, including but not limited to your IP
            address, browser type, operating system, and device identifiers. We may also collect log data, which includes information such as the date
            and time of your visit, the features you used, and any errors or crashes you may have encountered.
          </p>
          <h2>2. How We Use Your Information</h2>
          <p>
            <span className="font-semibold">2.1 </span>
            We use your information to provide, maintain, and improve the Services, as well as to monitor and analyze usage patterns and trends.
          </p>
          <p>
            <span className="font-semibold">2.2 </span>
            We use your information to communicate with you, including sending you service-related messages, responding to your inquiries, and
            providing information about updates or changes to the Services.
          </p>
          <p>
            <span className="font-semibold">2.3 </span>
            We may use your information to personalize your experience with the Services, such as displaying content that may be of interest to you
            based on your preferences and usage history.
          </p>
          <p>
            <span className="font-semibold">2.4 </span>
            We may use your information to enforce our Terms of Service, protect the security and integrity of the Services, and comply with legal
            requirements.
          </p>
          <h2>Information Sharing and Disclosure</h2>
          <p>
            <span className="font-semibold">3.1 </span>
            Service Providers: We may share your information with third-party service providers who perform services on our behalf, such as hosting
            providers, analytics providers, and data storage providers. We use a platform called PostHog to collect and process your information.
          </p>
          <p>
            <span className="font-semibold">3.2 </span>
            Legal Requirements: We may disclose your information if required to do so by law or in the good faith belief that such action is necessary
            to comply with legal obligations, protect our rights and property, or the safety of our users or the public.
          </p>
          <p>
            <span className="font-semibold">3.3 </span>
            Business Transfers: In the event of a merger, acquisition, bankruptcy, or other sale of all or a portion of our assets, your information
            may be transferred as part of the transaction.
          </p>
          <h2>4. Data Security and Retention</h2>
          <p>
            <span className="font-semibold">4.1 </span>
            We implement reasonable administrative, technical, and physical safeguards designed to protect your information from unauthorized access,
            use, or disclosure.
          </p>
          <p>
            <span className="font-semibold">4.2 </span>
            Despite our efforts, no security measure is perfect or impenetrable, and we cannot guarantee the absolute security of your information. We
            encourage you to protect your account credentials and to promptly report any suspected unauthorized access to your account.
          </p>
          <p>
            <span className="font-semibold">4.3 </span>
            We retain your information for as long as necessary to provide the Services, comply with legal requirements, and resolve disputes.
          </p>
          <h2>5. Your Rights and Choices</h2>
          <p>
            <span className="font-semibold">5.1 </span>
            You may access, correct, or update your personal information at any time by logging into your account or contacting us at
            support@medgram.net.
          </p>
          <p>
            <span className="font-semibold">5.2 </span>
            You may request the deletion of your personal information by contacting us at support@medgram.net. Please note that we may retain certain
            information as required by law or for legitimate business purposes.
          </p>
          <p>
            <span className="font-semibold">5.3 </span>
            You may opt out of receiving promotional communications from us by following the instructions provided in those communications or by
            contacting us at support@medgram.net. Please note that even if you opt out of receiving promotional communications, we may still send you
            non-promotional, service-related messages.
          </p>
          <h2>6. Third-Party Links and Services</h2>
          <p>
            <span className="font-semibold">6.1 </span>
            Our Services may contain links to third-party websites or services that are not owned or controlled by us. We are not responsible for the
            privacy practices or content of these third-party sites. We encourage you to review the privacy policies of any third-party websites or
            services you visit.
          </p>
          <h2>7. International Data Transfers</h2>
          <p>
            <span className="font-semibold">7.1 </span>
            We are based in the Iraq, and your information may be transferred to, stored, or processed in the United States or other countries that
            may not have the same data protection laws as your country of residence. By accessing or using the Services, you consent to the transfer,
            storage, and processing of your information in these countries.
          </p>
          <h2>8. Children's Privacy</h2>
          <p>
            <span className="font-semibold">8.1 </span>
            Our Services are not directed to children under the age of 13, and we do not knowingly collect personal information from children under
            13. If we learn that we have inadvertently collected personal information from a child under 13, we will promptly delete that information.
            If you believe we may have collected personal information from a child under 13, please contact us at support@medgram.net.
          </p>
          <h2>9. Changes to This Privacy Policy</h2>
          <p>
            <span className="font-semibold">9.1 </span>
            We may update this Privacy Policy from time to time to reflect changes in our privacy practices or applicable laws. We will notify you of
            any material changes to this Privacy Policy by posting the updated policy on our website or mobile application. Your continued use of the
            Services following the posting of any changes to this Privacy Policy constitutes acceptance of those changes. We encourage you to
            periodically review this page to stay informed about our privacy practices.
          </p>
          <h2>10. Contact Us</h2>
          <p>
            <span className="font-semibold">10.1 </span>
            If you have any questions or concerns about this Privacy Policy or our privacy practices, please contact us at support@medgram.net.
          </p>
        </article>
      </div>
    </>
  );
};

export default PrivacyPolicy;
