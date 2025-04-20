import { CaretRight } from '@phosphor-icons/react';
import Link from 'next/link';
import { CommonHead } from '../components/elements/CommonHead';
import { Navbar } from '../components/layouts/Navbar';

export default function PoliciesPage() {
  const policies = [
    {
      title: 'Fair Use Policy',
      description: 'Please make sure to read this one.',
      link: '/policies/fair-use',
    },
    {
      title: 'Terms of Service',
      description: 'A bunch of legal stuff that you need to know.',
      link: '/policies/terms-of-service',
    },
    {
      title: 'Privacy Policy',
      description: 'A whole lot of legal stuff about your privacy.',
      link: '/policies/privacy-policy',
    },
  ];

  return (
    <>
      <Navbar />
      <CommonHead title="Policies" />
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="mt-12" />

        <h3 className="text-3xl font-semibold tracking-[-0.20px]">Policies</h3>
        <p className="leading-[1.6] mt-4 max-w-md text-gray-500 tracking-[0.1px]">Here we list all the policies that you need to know about.</p>

        <div className="mt-8" />

        {policies.map((policy) => (
          <Link href={policy.link} key={policy.title}>
            <div key={policy.title} className="mt-4 p-4 bg-white rounded-xl border border-gray-200 hover:shadow-lg hover:shadow-gray-100 transition">
              <div className="flex items-center gap-1">
                <h4 className="text-lg font-medium leading-[1.4]">{policy.title}</h4>
                <CaretRight size={16} weight="bold" className="text-gray-400" />
              </div>
              <p className="text-gray-500 mt-2">{policy.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
