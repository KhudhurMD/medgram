import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft } from '@phosphor-icons/react';
import MinimalLogo from '../../../public/logo_v2_mark_only.svg';

interface MinimalShellProps {
  title?: string;
  children: React.ReactNode;
}

export function MinimalShell({ title, children }: MinimalShellProps) {
  return (
    <>
      <div className="flex min-h-screen flex-col justify-center bg-gray-50 py-12 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col justify-center sm:mx-auto sm:w-full sm:max-w-md">
          <Image className="h-10 w-auto text-center" src={MinimalLogo} alt="MedGram Logo" />
          {title && <h2 className="mt-4 text-center text-3xl font-semibold text-gray-900">{title}</h2>}
        </div>

        <div className="flex flex-col justify-center sm:mx-auto sm:w-full sm:max-w-md">
          <div className="border-2 border-gray-200 bg-white py-8 px-4 sm:rounded-lg sm:px-10">{children}</div>
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
}
