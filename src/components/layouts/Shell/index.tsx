import { Dialog, Transition } from '@headlessui/react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { List, Plus, X } from '@phosphor-icons/react';
import { Fragment, useEffect, useState } from 'react';

import Logo from '../../../../public/logo_v2_full.svg';
import MinLogo from '../../../../public/logo_v2_mark_only_filled.svg';
import NoSSRWrapper from '../../utility/NoSSRWrapper';
import { useMediaQuery } from 'usehooks-ts';
import { Button } from '../../elements/Button';
import posthog from 'posthog-js';
import * as Tooltip from '@radix-ui/react-tooltip';
import { ArrowLeftFromLine, ArrowRightFromLine, Folder, GitMerge, Home, LogIn, LogOut } from 'lucide-react';
import { cn } from '@/src/utils/shadcn';
import { colors } from '@/src/utils/theme';

function classNames(...classes: any) {
  return classes.filter(Boolean).join(' ');
}

interface ShellProps {
  children: React.ReactNode;
  overflow?: 'auto' | 'hidden' | 'scroll';
  padding?: boolean;
}

export const Shell = (props: ShellProps) => {
  const { children, overflow = 'hidden' } = props;
  const localStorageSidebar = getLocalStorageSidebar() == 1;
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useRouter().pathname;
  const sessionData = useSession().data;
  const sessionStatus = useSession().status;
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(localStorageSidebar);

  useEffect(() => {
    localStorage.setItem('sidebar_expanded', isSidebarExpanded ? '1' : '0');
  }, [isSidebarExpanded]);

  function getLocalStorageSidebar() {
    if (typeof window == 'undefined') return 1;
    const localStorageSidebar = parseInt(localStorage.getItem('sidebar_expanded') || '1', 10);
    return localStorageSidebar;
  }

  const navigation = [
    {
      name: 'Home',
      icon: Home,
      href: '//',
    },
    {
      name: 'Editor',
      icon: GitMerge,
      href: `/edit/`,
    },
    {
      name: 'My Graphs',
      icon: Folder,
      href: '/graphs',
    },
    {
      name: 'Sign In',
      icon: LogIn,
      href: '/auth/signin',
      hideIfLoggedIn: true,
    },
    {
      name: 'Sign Out',
      icon: LogOut,
      href: '/auth/signout',
      hideIfLoggedOut: true,
    },
  ].filter((item) => {
    if (item.hideIfLoggedIn && (sessionData || sessionStatus == 'loading')) {
      return false;
    }
    if (item.hideIfLoggedOut && (!sessionData || sessionStatus == 'loading')) {
      return false;
    }
    return true;
  });

  const primaryCTA = { name: 'New Graph', icon: Plus, href: '/edit/new/' };

  const user = sessionData?.user;
  const userId = user?.id;
  const userEmail = user?.email;

  useEffect(() => {
    if (userId && !userEmail) {
      // ampli.identify(userId)
      posthog.identify(userId, { Email: userEmail });
    }
    if (userId && userEmail) {
      // ampli.identify(userId, { Email: userEmail })
      posthog.identify(userId, { Email: userEmail });
    }
  }, [userId, userEmail]);

  return (
    <NoSSRWrapper>
      {/*
        This example requires updating your template:

        ```
        <html class="h-full bg-gray-100">
        <body class="h-full">
        ```
      */}
      <style>
        {`
          body {
            background-color: ${colors.gray['50']};
          }
        `}
      </style>
      {isMobile && (
        <div className="flex fixed z-20 bg-white w-full justify-between p-1 px-4 border-b border-b-gray-100 items-center">
          <Image src={MinLogo} alt="Medgram Logo" width={24} height={24} />
          <Button size="icon" variant="tertiary" icon={<List width={18} height={18} />} extraProps={{ onClick: () => setSidebarOpen(true) }} />
        </div>
      )}
      <div>
        <Transition.Root show={sidebarOpen} as={Fragment}>
          <Dialog as="div" className="fixed inset-0 z-40 flex md:hidden" onClose={setSidebarOpen}>
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-75" />
            </Transition.Child>
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <div className="relative flex w-full max-w-xs flex-1 flex-col pt-5 pb-4 bg-gray-50">
                <Transition.Child
                  as={Fragment}
                  enter="ease-in-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="absolute top-0 right-0 -mr-12 pt-2">
                    <button
                      type="button"
                      className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                      onClick={() => setSidebarOpen(false)}
                    >
                      <span className="sr-only">Close sidebar</span>
                      <X className="h-6 w-6 text-white" aria-hidden="true" />
                    </button>
                  </div>
                </Transition.Child>
                <div className="flex flex-shrink-0 items-center px-4">
                  <Image className="h-8 w-auto" src={Logo} alt="MedGram Logo" />
                </div>
                <div className="mt-5 h-0 flex-1 overflow-y-auto">
                  <nav className="space-y-1 px-2">
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={classNames(
                          location.includes(item.href) ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900',
                          'group flex items-center rounded-md px-2 py-2 text-base font-medium'
                        )}
                      >
                        <item.icon
                          className={classNames(
                            location.includes(item.href) ? 'text-gray-900' : 'text-gray-400 group-hover:text-gray-900',
                            'mr-4 h-6 w-6 flex-shrink-0'
                          )}
                          aria-hidden="true"
                        />
                        {item.name}
                      </Link>
                    ))}
                    <Link
                      key={primaryCTA.name}
                      href={primaryCTA.href}
                      className={classNames(
                        location.includes(primaryCTA.href)
                          ? 'bg-primary-500 text-white'
                          : 'text-white bg-gray-900 hover:bg-gray-800 hover:text-white',
                        'group flex items-center rounded-md px-2 py-2 text-base font-medium'
                      )}
                    >
                      <primaryCTA.icon
                        className={classNames(
                          location.includes(primaryCTA.href) ? 'text-gray-300' : 'text-gray-400 group-hover:text-gray-300',
                          'mr-4 h-6 w-6 flex-shrink-0'
                        )}
                        aria-hidden="true"
                      />
                      <span>{primaryCTA.name}</span>
                    </Link>
                  </nav>
                </div>
              </div>
            </Transition.Child>
            <div className="w-14 flex-shrink-0" aria-hidden="true">
              {/* Dummy element to force sidebar to shrink to fit close icon */}
            </div>
          </Dialog>
        </Transition.Root>

        {/* Static sidebar for desktop */}
        <div
          className={`hidden md:fixed px-1 md:inset-y-0 md:flex  md:flex-col bg-gray-50 z-20`}
          style={{ width: isSidebarExpanded && !isMobile ? '256px' : '60px' }}
        >
          <div className="flex min-h-0 flex-1 flex-col pt-4">
            {/* Logo */}
            <div className={classNames('flex justify-between items-center', !isSidebarExpanded ? 'flex-col' : 'pr-2')}>
              <Link href="/">
                <div className={classNames('flex h-16 flex-shrink-0 items-center', isSidebarExpanded ? 'px-4' : 'ml-2')}>
                  <Image className="h-7 w-auto" src={isSidebarExpanded ? Logo : MinLogo} alt="MedGram Logo" />
                </div>
              </Link>
              <ShellTooltipButton label={isSidebarExpanded ? 'Collapse' : 'Expand'}>
                <Link href="#">
                  <Button
                    className={classNames('h-fit text-gray-900 hover:bg-transparent hover:opacity-80', !isSidebarExpanded && 'ml-2')}
                    variant="tertiary"
                    size="icon"
                    icon={!isSidebarExpanded ? <ArrowRightFromLine size={22} /> : <ArrowLeftFromLine size={20} />}
                    onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}
                  ></Button>
                </Link>
              </ShellTooltipButton>
            </div>

            <div className="flex flex-1 flex-col overflow-y-auto mr-[-10px] z-20">
              <nav className="flex-1 space-y-1.5 px-2 py-3">
                {navigation.map((item) => (
                  <ShellTooltipButton label={item.name} disabled={isSidebarExpanded} key={item.name}>
                    <Link
                      key={item.name}
                      href={item.href}
                      className={classNames(
                        location.includes(item.href) ? 'text-black bg-gray-100' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900',
                        'group space-x-2 flex items-center rounded-md px-3.5 py-2 transition-all duration-200 font-medium'
                      )}
                    >
                      <item.icon
                        className={classNames(
                          location.includes(item.href) ? 'text-black' : 'text-gray-500 group-hover:text-gray-900',
                          'flex-shrink-0'
                        )}
                        aria-hidden="true"
                        size={22}
                      />
                      <span>{isSidebarExpanded && item.name}</span>
                    </Link>
                  </ShellTooltipButton>
                ))}
                <ShellTooltipButton label={primaryCTA.name} disabled={isSidebarExpanded}>
                  <Link
                    href={primaryCTA.href}
                    className="mt-6 flex flex-row space-x-2 items-center justify-start rounded-lg bg-gray-900 px-3 p-2 transition-all duration-200 text-gray-100 hover:opacity-95"
                  >
                    <primaryCTA.icon className="h-6 w-6" aria-hidden="true" />
                    {isSidebarExpanded && <p className="font-medium">{primaryCTA.name}</p>}
                  </Link>
                </ShellTooltipButton>
              </nav>
            </div>
          </div>
        </div>
        <div className="flex flex-col" style={{ paddingLeft: isMobile ? '0px' : isSidebarExpanded ? '256px' : '60px' }}>
          <main className="flex-1">
            <div>
              <div className={cn('md:p-3 z-10 md:rounded-lg border-gray-50 bg-gray-50')}>
                <div
                  className={cn(
                    'h-full bg-white md:rounded-xl md:shadow-gray-200 md:shadow-lg w-full overflow-hidden pt-10 md:pt-0',
                    `overflow-${overflow}`,
                    overflow !== 'scroll' && 'md:h-[calc(100vh-1.5rem)]'
                  )}
                >
                  {children}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </NoSSRWrapper>
  );
};

export function useLocalStorage<T>(key: string, fallbackValue: T) {
  const [value, setValue] = useState(fallbackValue);
  useEffect(() => {
    const stored = localStorage.getItem(key);
    setValue(stored ? JSON.parse(stored) : fallbackValue);
  }, [fallbackValue, key]);

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue] as const;
}

interface TooltipButtonProps {
  children: React.ReactNode;
  label: string;
  disabled?: boolean;
}
const ShellTooltipButton = ({ children, label, disabled }: TooltipButtonProps) => {
  if (disabled == true) return <>{children}</>;
  return (
    <Tooltip.Provider>
      <Tooltip.Root delayDuration={100}>
        <Tooltip.Trigger asChild>{children}</Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content className="TooltipContent" side="right" sideOffset={5}>
            {label}
            <Tooltip.Arrow className="TooltipArrow" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
};
