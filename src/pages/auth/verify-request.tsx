import { NextPage } from 'next';
import Link from 'next/link';
import { ArrowLeft, CheckCircle } from '@phosphor-icons/react';

export const VerifyRequest: NextPage = () => {
  return (
    <>
      <div className="flex min-h-screen flex-col justify-center bg-gray-50 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-center sm:mx-auto sm:w-full sm:max-w-md">
          <div className="border-2 border-gray-200 bg-white py-8 px-4 sm:rounded-lg sm:px-10">
            <div className="flex flex-col items-center gap-3 py-3">
              <CheckCircle weight="regular" size={64} className="text-green-500" />
              <h2 className="text-center text-2xl font-bold text-gray-900">Check your email</h2>
              <p className="text-center text-gray-500">We&apos;ve sent you a link to login or register. It will expire in 60 minutes.</p>
            </div>
          </div>
        </div>
        <div>
          <Link
            href="/edit"
            className="mt-5 flex flex-row items-center justify-center gap-2 text-center text-lg text-primary-500 hover:text-primary-400"
          >
            <ArrowLeft weight="bold" />
            <span>Back to home</span>
          </Link>
        </div>
      </div>
    </>
  );
};

export default VerifyRequest;
