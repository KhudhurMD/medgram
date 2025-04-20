import { NextPage } from 'next';
import { Navbar } from '../components/layouts/Navbar';
import Khudhur from '@/public/khudhur.png';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '../components/ui/button';
import { XLogo } from '@phosphor-icons/react';
import { CommonHead } from '../components/elements/CommonHead';

const AboutPage: NextPage = () => {
  return (
    <>
      <Navbar active="about" />
      <CommonHead title="About" />
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="mt-12" />

        <h3 className="text-3xl font-semibold tracking-[-0.20px]">About</h3>
        <div className="mt-8" />
        <article className="prose prose-base prose-h1:text-lg prose-h1:font-semibold prose-h2:text-base prose-h2:font-semibold prose-h3:text-base prose-h3:font-normal prose-h3:text-gray-600 prose-a:decoration-transparent prose-p:mt-4">
          <p>
            Medgram is a library of ever-growing free medical algorithms. As a resident physician, I was often surprised by how different some of our
            medical approaches were. And let's be real, they're not always ideal. I wanted to unify how we approach a problem and then iterate.
          </p>
          <p>
            That being said, there is often no single correct way to approach a problem. This is why Medgram has a built-in visual editor to help you
            edit existing algorithms and create your own.
          </p>
          <p> I'm hoping to see Medgram grow into a platform where we can share our approaches, learn from each other, and iterate together.</p>
          <p>
            If you have ideas on how to improve Medgram, want to collaborate, or just want to chat feel free to reach out to me at khudhur [at]
            medgram.net or simply schedule a 15-min meeting!
          </p>
        </article>
        <div className="mt-8" />

        <Link href="https://x.com/khudhur_moh" target="_blank">
          <div className="flex p-4 px-5 border border-gray-200 rounded-2xl w-fit hover:shadow-lg hover:shadow-gray-200 cursor-pointer transition-shadow">
            <Image src={Khudhur} alt="Khudhur" className="w-14 h-14 rounded-full grayscale brightness-120" />
            <div className="ml-4">
              <div className="flex items-center gap-2">
                <h4 className="text-lg font-semibold">Khudhur M.</h4>
                <div className="bg-black rounded-md p-0.5">
                  <XLogo size={16} className="text-white" />
                </div>
              </div>
              <p className="text-gray-500">@khudhur_moh</p>
            </div>
          </div>
        </Link>
        <div className="mt-4" />

        <div className="flex gap-4">
          <Link href="mailto:khudhur@medgram.net" className="mt-4">
            <Button variant="outline">Email me</Button>
          </Link>

          <Link href="https://cal.com/khudhur/15min" className="mt-4" target="_blank">
            <Button variant="default">Schedule a meeting</Button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default AboutPage;
