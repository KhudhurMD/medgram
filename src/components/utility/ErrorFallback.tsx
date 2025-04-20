import Link from 'next/link';
import { XCircle } from '@phosphor-icons/react';

export function ErrorFallback() {
  return (
    <div className="h-screen w-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md flex flex-col items-center">
        <div className="mb-3 w-10"></div>
        <div className="flex flex-col border-2 border-gray-200 bg-white rounded-lg p-5 mb-3 items-start">
          <XCircle className="text-red-500 w-12 h-12 mb-2" />
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Something went wrong! </h1>

          <p className="text-gray-500 text-lg">
            Khudhur has been notified about this and will be trying to fix it as soon as possible! Please help by sending more info{' '}
            <Link href="mailto:khudher.nexi@gmail.com" className="text-primary-500">
              here
            </Link>
            .
          </p>
        </div>
        <Link href="/" className="text-gray-400 hover:text-primary-500 text-lg">
          Go back home →
        </Link>
      </div>
    </div>
  );
}
