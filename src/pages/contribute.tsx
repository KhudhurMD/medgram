import { NextPage } from 'next';
import { Navbar } from '../components/layouts/Navbar';
import Link from 'next/link';
import { Button } from '../components/ui/button';
import { CommonHead } from '../components/elements/CommonHead';

const Contribute: NextPage = () => {
  return (
    <>
      <Navbar />
      <CommonHead title="Contribute to Medgram" />
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="mt-12" />

        <h3 className="text-3xl font-semibold tracking-[-0.20px]">Contribute</h3>
        <div className="mt-8" />
        <article className="prose prose-base prose-h1:text-lg prose-h1:font-semibold prose-h2:text-base prose-h2:font-semibold prose-h3:text-base prose-h3:font-normal prose-h3:text-gray-600 prose-a:decoration-transparent prose-p:mt-4">
          <p>
            Thanks for considering contributing to Medgram! I'm always looking for ways to expand our small but growing library of medical algorithms.
          </p>

          <p>
            To get started, you can use Medgram's editor to create an algorithm then email me the link to your algorithm. I'll then thoroughly review
            it and if it meets the criteria, I'll publish it under your name.
          </p>

          <p> If you're interested, please reach out to me at khudhur [at] medgram.net or simply schedule a 15-min meeting. </p>
        </article>
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

export default Contribute;
