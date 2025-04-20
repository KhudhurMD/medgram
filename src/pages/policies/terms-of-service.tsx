import { CommonHead } from '@/src/components/elements/CommonHead';
import { Navbar } from '@/src/components/layouts/Navbar';
import { CaretLeft } from '@phosphor-icons/react';

export default function TermsOfServicePage() {
  return (
    <>
      <Navbar />
      <CommonHead title="Terms of Use" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="mt-8" />

        <div className="flex space-x-1 items-center mb-4 group text-sm">
          <CaretLeft size={14} weight="bold" className="text-gray-400 group-hover:text-primary-500" />
          <a href="/policies" className="text-gray-500 group-hover:text-primary-500">
            Policies
          </a>
        </div>
        <h3 className="text-3xl font-semibold tracking-[-0.20px]">Terms of Use</h3>

        <div className="mt-4" />
        <article className="prose prose-base prose-h1:text-lg prose-h1:font-semibold prose-h2:text-base prose-h2:font-semibold ">
          <p>Last updated: 22 March 2023</p>
          <p>
            Welcome to MedGram, a community-based platform for creating, viewing, and sharing medical algorithms. By accessing or using our services,
            you agree to these Terms of Service ("Terms") and all applicable laws and regulations. If you do not agree with any of these terms, you
            are prohibited from using or accessing this site. The materials contained in this website are protected by applicable copyright and
            trademark law.
          </p>

          <h2>1. Content and Usage Restrictions</h2>
          <p>
            <span className="font-semibold">1.1 </span>
            Individual users, hereinafter referred to as "Users," retain all rights to their creations, including the right to use such creations for
            commercial purposes.
          </p>
          <p>
            <span className="font-semibold">1.2 </span>
            Users shall not remove the watermark present at the bottom of MedGram content. For special permission to remove or modify the watermark,
            please send a request to watermarks@medgram.net.
          </p>
          <p>
            <span className="font-semibold">1.3 </span>
            Business entities, including but not limited to corporations, partnerships, and limited liability companies, with an annual revenue of
            $100,000 or more, are prohibited from using MedGram for internal or external purposes without obtaining a special license. To obtain a
            license, please send a request to license@medgram.net.
          </p>
          <p>
            <span className="font-semibold">1.4 </span>
            Business entities with an annual revenue of $100,000 or more are required to obtain both written consent from the creator and a special
            license from MedGram before sharing any other Users' creations on their websites, social media accounts, or any other channels.
          </p>
          <p>
            <span className="font-semibold">1.5 </span>
            Notwithstanding the restrictions set forth in Section 1.3, educational institutions may use MedGram without obtaining a special license,
            provided that they publicly share their creations on MedGram's platform and social accounts. If an educational institution intends to use
            MedGram for internal purposes without sharing their creations as set forth herein, they must obtain a special license in accordance with
            Section 1.3.
          </p>

          <h2>2. Disclaimer</h2>
          <p>
            <span className="font-semibold">2.1 </span>
            The information provided on MedGram is for general informational purposes only and does not constitute medical advice. MedGram is not
            responsible for any damage or consequences resulting from the use or reliance on any content, material, or information available on or
            through MedGram.
          </p>
          <p>
            <span className="font-semibold">2.2 </span>
            MedGram does not warrant the accuracy, completeness, or usefulness of any information provided on the platform. Users are encouraged to
            consult with a qualified healthcare professional for advice regarding specific medical conditions or treatment options.
          </p>
          <h2>3. Limitations of Liability</h2>
          <p>
            <span className="font-semibold">3.1 </span>
            In no event shall MedGram, its affiliates, or their respective directors, officers, employees, or agents be liable for any direct,
            indirect, incidental, special, consequential, or punitive damages (including, without limitation, damages for loss of data, information,
            or profits) arising out of or in connection with the use or inability to use the services, content, or information provided on or through
            MedGram, whether based on warranty, contract, tort, or any other legal theory, and whether or not MedGram has been advised of the
            possibility of such damages.
          </p>
          <h2>4. Changes to Terms of Service</h2>
          <p>
            <span className="font-semibold">4.1 </span>
            MedGram reserves the right to update or modify these Terms at any time without prior notice. Your continued use of the MedGram platform
            following the posting of any changes to these Terms constitutes acceptance of those changes. We encourage users to periodically review
            this page to stay informed of any changes to our Terms of Service.
          </p>

          <p>By using this website, you are agreeing to be bound by the current version of these Terms of Service.</p>
          <p>If you have any questions or concerns about these Terms, please contact us at support@medgram.net.</p>
        </article>
      </div>
    </>
  );
}
