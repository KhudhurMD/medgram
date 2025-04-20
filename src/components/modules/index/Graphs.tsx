import { Search } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { Input } from '../../ui/input';
import Image from 'next/image';
import { LinkSimple } from '@phosphor-icons/react/dist/ssr';
import { PublicGraph } from '@prisma/client';
import React from 'react';
import { posthog } from 'posthog-js';
import { Button } from '../../elements/Button';

export default function HeroSection({ initialGraphs }: { initialGraphs: PublicGraph[] }) {
  const [input, setInput] = useState('');
  const [graphs, setGraphs] = useState(initialGraphs);
  const [selectedGraphId, setSelectedGraphId] = useState<number | null>(null);

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    posthog.capture('search', { query: e.target.value });
    setGraphs(searchGraphs(e.target.value, initialGraphs));
  };

  const searchGraphs = (query: string, graphs: PublicGraph[]) => {
    const lowerCaseQuery = query.toLowerCase();
    return graphs
      .filter((graph) => graph.title.toLowerCase().includes(lowerCaseQuery) || graph.description.toLowerCase().includes(lowerCaseQuery))
      .sort((a, b) => {
        const titleA = a.title.toLowerCase();
        const titleB = b.title.toLowerCase();
        if (titleA.includes(lowerCaseQuery) && !titleB.includes(lowerCaseQuery)) {
          return -1;
        }
        return 0;
      });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6">
      <div className="mt-8 md:mt-12" />

      <h1 className="text-3xl font-semibold tracking-[-0.20px]">Free Medical Algorithms</h1>
      <p className="leading-[1.6] mt-4 max-w-md text-gray-500 tracking-[0.1px]">
        Medgram is a free, small library of medical algorithms.{' '}
        <a href="mailto:khudhur@medgram.net?subject=Request%20new%20algorithm" className="text-black underline hover:opacity-70">
          Request a new one
        </a>
        .
      </p>
      
      <div className="mt-4" />
      <Link href="/algorithm/create" passHref>
        <Button 
          variant="primary" 
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition-colors"
        >
          Create New Algorithm
        </Button>
      </Link>

      <div className="mt-5" />

      {/* Search */}
      <form className="ml-auto flex-1 sm:flex-initial">
        <div className="relative">
          <Search className="absolute left-2.5 top-3 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Search algorithms..." className="pl-8 w-full sm:w-[400px]" value={input} onChange={onInputChange} />
        </div>
      </form>

      <div className="mt-14" />

      {/* Graphs */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {graphs.map((graph) => (
          <Link
            key={graph.id}
            href={`/algorithm/${graph.slug}`}
            className={selectedGraphId === null || selectedGraphId === graph.id ? 'opacity-100 transition-opacity' : 'opacity-60 transition-opacity'}
          >
            <div
              className="bg-white text-left rounded-xl h-full cursor-pointer border border-gray-200 hover:shadow-lg hover:shadow-gray-100 hover:border-gray-800 transition w-full"
              onMouseEnter={() => setSelectedGraphId(graph.id)}
              onMouseLeave={() => setSelectedGraphId(null)}
              role="button"
              tabIndex={0}
            >
              <Image
                src={`/graphs/${graph.imageUrl}`}
                alt={graph.title}
                width={400}
                height={200}
                className="rounded-lg h-[250px] p-1 w-full  bg-top bg-cover object-cover object-top"
              />
              <div className="px-4 pt-3 pb-4">
                <h4 className="text-lg font-medium leading-[1.4]">{graph.title}</h4>
                <div className="flex items-center gap-1 mt-2">
                  <LinkSimple className="h-4.5 w-4.5 text-gray-400" weight="bold" />
                  <p className="text-gray-500">{graph.authorName}</p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {graphs.length === 0 && (
        <div className="mt-2 bg-gray-50 py-3 px-5 rounded-lg">
          <p className="text-gray-500">No algorithms found. Request a new algorithm or create a new one.</p>
        </div>
      )}
    </div>
  );
}
