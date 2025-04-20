import type { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import { getCsrfToken, signIn } from 'next-auth/react';
import { ArrowLeft, WarningCircle } from '@phosphor-icons/react';
import { FaGoogle } from 'react-icons/fa';
import MinLogo from '../../../public/logo_v2_mark_only.svg';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

const providers = [
  {
    id: 'google',
    label: 'Google',
    icon: FaGoogle,
    color: '#DB4437',
    action: handleGoogleSignIn,
  },
];
const emailLoginProvider = {
  id: 'email',
  label: 'Email Address',
  buttonLabel: 'Send link to email',
};
export default function SignIn({ csrfToken }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const errMessage = useRouter().query.error;
  const redirectUrl = useRouter().query.redirect;

  return (
    <>
      <div className="flex min-h-screen flex-col justify-center bg-gray-50 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-center sm:mx-auto sm:w-full sm:max-w-md">
          <Image className="h-10 w-auto text-center" src={MinLogo} alt="MedGram Logo" />
          <h2 className="mt-4 text-center text-3xl font-bold text-gray-900">Login or Register</h2>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="border-2 border-gray-200 bg-white py-8 px-4 sm:rounded-lg sm:px-10">
            {errMessage && (
              <div className="mb-4 flex flex-row items-center gap-2 bg-red-50 p-2">
                <WarningCircle weight="fill" className="text-red-600" size={20} />
                <p className="text-base text-red-600">{errMessage}</p>
              </div>
            )}
            <div className="space-y-3">
              {providers.map((provider) => (
                <div key={provider.id}>
                  <button
                    onClick={() => provider.action()}
                    className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-gray-200 bg-white py-2 px-4 font-medium text-gray-500 hover:border-gray-300"
                  >
                    <provider.icon size={20} color={provider.color} />
                    <span>Continue with {provider.label}</span>
                  </button>
                </div>
              ))}
              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="bg-white px-2 text-gray-500">Or continue with</span>
                  </div>
                </div>
              </div>
              <form method="post" action="/api/auth/signin/email">
                <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
                <label htmlFor="email" className="text-md block font-medium text-gray-600">
                  {emailLoginProvider.label}
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="block w-full appearance-none rounded-md border-2 border-gray-200 px-3 py-2 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <button
                    type="submit"
                    className="mt-4 flex w-full justify-center rounded-md border border-gray-300 py-2 px-4 font-medium text-gray-500 hover:bg-gray-50"
                  >
                    {emailLoginProvider.buttonLabel}
                  </button>
                </div>
              </form>
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
      </div>
    </>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const csrfToken = await getCsrfToken(context);
  return {
    props: { csrfToken },
  };
}
function handleGoogleSignIn() {
  signIn('google', { callbackUrl: 'http://localhost:3000' });
}
