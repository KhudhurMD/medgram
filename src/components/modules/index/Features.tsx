import MedGramTime from '../../../../public/Medgram time.png';
import FigmaTime from '../../../../public/Figma.png';
import CreateFeature from '../../../../public/Create.png';
import ShareFeature from '../../../../public/Share.png';
import CommunityFeature from '../../../../public/community.png';
import Image from 'next/image';
import { Pen, PenNib, Person, PersonSimple, Share, Users } from '@phosphor-icons/react';
import Profile from '../../../pages/profile';
import { Button } from '../../elements/Button';
import { FaDiscord, FaTwitter } from 'react-icons/fa';
import Link from 'next/link';

// export function FeaturesSection() {
//   return (
//     <div className='w-full bg-gray-50 pb-8'>
//       <div className='max-w-4xl mx-auto p-4 rounded-md'>
//         <div className='flex flex-col items-center'>
//           <h2 className='text-3xl font-bold text-gray-800 mb-4'>Features</h2>
//           <p className='text-gray-600 text-center text-lg'>MedGram is a free community-based platform that will allow you to:</p>
//           <div className='flex flex-col md:flex-row justify-center items-center w-full mt-8'>
//             <div className='flex flex-col items-start justify-center w-full md:w-1/3 space-y-2 px-4 py-2'>
//               <div className='mr-0.5 border border-gray-200 rounded-md px-4 py-3 space-y-2 flex-row'>
//                 <PenNib size={32} className='text-gray-400' />
//                 <h2 className='text-xl font-semibold text-gray-800'>Create</h2>
//                 <p className='text-gray-600 '>
//                   Create medical algorithms using an advanced text editor, which will take you minutes instead of hours.
//                 </p>
//               </div>
//             </div>
//
//             <div className='flex flex-col items-start justify-center w-full md:w-1/3 space-y-2 px-4 py-2'>
//               <div className='mr-0.5 border border-gray-200 rounded-md px-4 py-3 space-y-2 flex-row'>
//                 <Share size={32} className='text-gray-400' />
//                 <h2 className='text-xl font-semibold text-gray-800'>Share</h2>
//                 <p className='text-gray-600 '>Share your algorithms with the community and get feedback from other medical professionals.</p>
//               </div>
//             </div>
//
//             <div className='flex flex-col items-start justify-center w-full md:w-1/3 space-y-2 px-4 py-2'>
//               <div className='mr-0.5 border border-gray-200 rounded-md px-4 py-3 space-y-2 flex-row'>
//                 <Users size={32} className='text-gray-400' />
//                 <h2 className='text-xl font-semibold text-gray-800'>Collaborate</h2>
//                 <p className='text-gray-600 '>Collaborate with other medical professionals to create the best algorithms for your patients.</p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

export function FeaturesSection() {
  return (
    <>
      <div className="p-3 bg-gray-50">
        <div className="w-full pb-8 pt-10 border-t border-gray-200">
          <div className="max-w-4xl mx-auto p-4 rounded-md">
            <div className="md:flex-row flex flex-col items-center">
              <div className="md:w-1/2">
                <PenNib size={32} className="text-gray-400 mb-3" />
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">Create Algorithms in Minutes</h2>
                <p className="text-gray-600 text-lg mb-4">
                  Say goodbye to hours of tedious design work. MedGram allows you to create algorithms on the fly with its advanced  editor
                  feature, no more dragging and dropping!
                </p>
                <div className="flex space-x-2 mb-6">
                  <Link href="/edit/">
                    <Button> Editor →</Button>
                  </Link>
                  <Link href="/graphs/">
                    <Button variant="secondary"> My Graphs →</Button>
                  </Link>
                </div>
              </div>
              <div className="md:w-1/2 md:ml-12">
                <Image src={CreateFeature} className="rounded-md border border-gray-200" alt="Create" />
              </div>
            </div>
          </div>
        </div>
        <div className="w-full bg-gray-50 md:pb-8 md:pt-10 pb-4 pt-4">
          <div className="max-w-4xl mx-auto p-4 rounded-md">
            <div className="md:flex-row flex flex-col items-center">
              <div className="md:w-1/2">
                <Share size={32} className="text-gray-400 mb-3" />
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">Share your Creations</h2>
                <p className="text-gray-600 text-lg mb-4">
                  You may also share your creations with your colleagues and collaborate with them using the "copy" link feature, which will allow
                  them to edit / re-iterate on the algorithm.
                </p>
              </div>
              <div className="md:w-1/2 md:ml-12">
                <Image src={ShareFeature} className="rounded-md border border-gray-200" alt="Create" />
              </div>
            </div>
          </div>
        </div>
        <div className="w-full bg-gray-50 md:pb-8 md:pt-10 pb-4 pt-4">
          <div className="max-w-4xl mx-auto p-4 rounded-md">
            <div className="md:flex-row flex flex-col items-center">
              <div className="md:w-1/2">
                <Users size={32} className="text-gray-400 mb-3" />
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">Join our Vibrant Community</h2>
                <p className="text-gray-600 text-lg mb-4">
                  We believe in community and teamwork, that's why we created a space where you can connect with other professionals, view and request
                  algorithms and get help creating your own!
                </p>
                <div className="flex space-x-2 mb-6">
                  <Link href="https://discord.gg/EZsSg4ZVEw">
                    <Button icon={<FaDiscord />} href="https://discord.gg/EZsSg4ZVEw">
                      Discord
                    </Button>
                  </Link>
                  <Link href="https://twitter.com/medgramnet">
                    <Button icon={<FaTwitter />} variant="secondary">
                      Twitter
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="md:w-1/2 md:ml-12">
                <Image src={CommunityFeature} className="rounded-md border border-gray-200" alt="Create" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
