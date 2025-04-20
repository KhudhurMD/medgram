import { useEffect, useState } from 'react';
import { ContactDialog } from '../elements/ContactDialog';

import Link from 'next/link';
import { Menu, Package2 } from 'lucide-react';

import Logo from '@/public/logo_v2_full.svg';

import { Button } from '@/src/components/ui/button';

import { Sheet, SheetClose, SheetContent, SheetTrigger } from '@/src/components/ui/sheet';
import { moreMenuComponents, Navigation } from './NavigationMenu';
import LogoMarkOnly from '@/public/logo_v2_mark_only.svg';
import Image from 'next/image';
import { cn } from '@/src/utils/shadcn';

export const Navbar = ({ active }: { active?: 'home' | 'about' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <>
      <ContactDialog type="Message" isOpen={isOpen} setIsOpen={setIsOpen} />
      <header
        className={cn(
          'sticky top-0 flex h-16 items-center transition gap-4 backdrop-blur-md bg-white/70 px-4 md:px-6 w-full z-10',
          scrollY > 0 ? 'border-b border-gray-100' : 'border-b border-transparent'
        )}
      >
        <nav className="hidden md:w-full px-6 flex-col gap-6 text-lg font-medium md:flex max-w-5xl mx-auto md:flex-row justify-center md:items-center md:gap-5 md:text-sm lg:gap-6 md:justify-between">
          <Link href="/" className="flex items-center gap-2 w-[125px] text-lg font-semibold md:text-base">
            <Image src={Logo} alt="Medgram" width={500} />
            <span className="sr-only">Medgram</span>
          </Link>
          <div className="flex gap-8 items-center">
            <Link href="/" className={cn('transition-colors hover:text-foreground', active === 'home' ? 'text-foreground' : 'text-muted-foreground')}>
              Home
            </Link>
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                className="text-muted-foreground hover:text-foreground px-2 border-transparent hover:bg-transparent"
                onClick={() => setIsOpen(true)}
              >
                Contact
              </Button>
              <Navigation />
            </div>
          </div>

          <div>
            <Link href="/edit">
              <Button variant="default">Editor</Button>
            </Link>
          </div>
        </nav>
        <div className="flex items-center gap-4 md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="shrink-0 md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <nav className="grid gap-6 text-lg font-medium">
                <Link href="/" className="flex items-center gap-2 text-lg font-semibold w-7">
                  <Image src={LogoMarkOnly} alt="toggle menu" />
                  <span className="sr-only">Acme Inc</span>
                </Link>
                <Link href="/" className="text-muted-foreground hover:text-foreground">
                  Home
                </Link>
                <SheetClose className="w-fit">
                  <Button
                    variant="ghost"
                    className="text-muted-foreground hover:text-foreground text-left text-lg w-fit px-0 border-transparent hover:bg-transparent"
                    onClick={() => setIsOpen(true)}
                  >
                    Contact
                  </Button>
                </SheetClose>
                {moreMenuComponents.map((component, index) => (
                  <Link key={index} href={component.href} className="text-muted-foreground hover:text-foreground">
                    {component.title}
                  </Link>
                ))}
                <Link href="/edit" className="text-white bg-gray-900 rounded-xl px-5 py-2.5 hover:bg-gray-800 ml-[-10px]">
                  Editor
                </Link>
              </nav>
            </SheetContent>
          </Sheet>

          <Link href="/" className="flex items-center gap-2 text-lg font-semibold w-[120px]">
            <Image src={Logo} alt="hello" />
          </Link>
        </div>
      </header>
    </>
  );
};
