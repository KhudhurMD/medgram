import { CommonHead } from '@/src/components/elements/CommonHead';
import { Navbar } from '@/src/components/layouts/Navbar';
import { CaretLeft } from '@phosphor-icons/react';
import Link from 'next/link';
import { Shell } from '../../components/layouts/Shell';

export default function FairUse() {
  return (
    <>
      <Navbar />
      <CommonHead title="Fair Use Policy" />
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="mt-8" />

        <div className="flex space-x-1 items-center mb-4 group text-sm">
          <CaretLeft size={14} weight="bold" className="text-gray-400 group-hover:text-primary-500" />
          <Link href="/policies" className="text-gray-500 group-hover:text-primary-500">
            Policies
          </Link>
        </div>
        <h3 className="text-3xl font-semibold tracking-[-0.20px]">Fair Use Policy</h3>
        <p className="leading-[1.6] mt-4 max-w-md text-gray-500 tracking-[0.1px]">Here we list all the policies that you need to know about.</p>

        <div className="mt-8" />
        <article className="prose prose-base prose-h1:text-lg prose-h1:font-semibold prose-h2:text-base prose-h2:font-semibold prose-h3:text-base prose-h3:font-normal prose-h3:text-gray-600 prose-a:decoration-transparent">
          {' '}
          <p>
            We understand that Terms of Service can be overwhelming, so we've prepared this brief summary to help you understand the key points.
            Please keep in mind that this summary is not a substitute for the full MedGram Terms of Service, and we encourage you to read the{' '}
            <a href="/resources/terms-of-service/" className="text-primary-500">
              complete terms
            </a>
            &nbsp;to ensure you are fully aware of your rights and obligations.
          </p>
          <h2>For individual users:</h2>
          <h3>What you can do:</h3>
          <ul>
            <li>Enjoy creating, viewing, and sharing medical algorithms on MedGram for free.</li>
            <li>Use your creations for commercial purposes.</li>
          </ul>
          <h3>What you can't do:</h3>
          <ul>
            <li>
              Remove the watermark present at the bottom of MedGram content. If you find them annoying, just send to{' '}
              <a href="mailto:watermarks@medgram.net" className="text-primary-500 font-semibold">
                watermarks@medgram.net
              </a>{' '}
              to remove it!
            </li>
            <li>Rely on MedGram or MedGram-generated content for medical advice.</li>
          </ul>
          <h2>For business entities:</h2>
          <p>
            If your business has an annual revenue of $100,000 or more, you are required to obtain a special license to use MedGram for internal or
            external purposes. Additionally, you must not share another user's content without obtaining written consent from the creator and a
            special license from MedGram at{' '}
            <a className="text-primary-500 font-semibold" href="mailto:license@medgram.net">
              license@medgram.net
            </a>
          </p>
          <h2>For educational institutions:</h2>
          <p>
            You may use MedGram for internal or external purposes as long you share your creations on MedGram's platform and social accounts. If you
            intend to use MedGram without sharing your creations, you must obtain a special license at{' '}
            <a className="text-primary-500 font-semibold" href="mailto:license@medgram.net">
              license@medgram.net
            </a>
          </p>
          <h2>Why these limitations?</h2>
          <p>You might be wondering why we've established certain limitations for using MedGram, particularly for businesses. </p>
          <p>
            The primary reason for these limitations is to maintain MedGram as a free and accessible platform for individual users and educational
            institutions. By requiring businesses with an annual revenue of $100,000 or more to obtain a special license, we generate the necessary
            funds to support the platform's ongoing maintenance, improvement, and accessibility for all users. This approach enables us to strike a
            balance between offering a free resource for individuals and educational institutions and ensuring the platform's long-term sustainability
            and growth.
          </p>
          <p>
            As for watermarks, they serve a vital purpose in raising awareness about MedGram. By keeping the watermark on content, it's easier for
            users and viewers to identify the source of the medical algorithms, which in turn helps grow the community, fostering a diverse and
            knowledgeable user base that benefits us all.{' '}
          </p>
          <p>
            We appreciate your understanding and cooperation as we work together to build a thriving and accessible MedGram community. If you have any
            questions or concerns, please don't hesitate to contact us at{' '}
            <a className="text-primary-500" href="mailto:support@medgram.net">
              support@medgram.net
            </a>
          </p>
        </article>
      </div>
    </>
  );
}
