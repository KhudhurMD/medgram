import * as React from 'react';

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/src/components/ui/navigation-menu';
import { cn } from '@/src/utils/shadcn';
import Link from 'next/link';

export const moreMenuComponents: { title: string; href: string; description: string }[] = [
  {
    title: 'About',
    href: '/about',
    description: 'Learn more about Medgram and our mission.',
  },
  {
    title: 'Contribute',
    href: '/contribute',
    description: 'Learn how you can contribute to Medgram.',
  },
  {
    title: 'Policies',
    href: '/policies',
    description: 'Learn about our policies and terms of service.',
  },
  {
    title: 'Follow us on X',
    href: 'https://x.com/MedgramNet',
    description: 'Stay up to date with our latest news and updates.',
  },
];

export function Navigation() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="text-gray-500 px-2.5 bg-transparent">More</NavigationMenuTrigger>

          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
              {moreMenuComponents.map((component) => (
                <Link href={component.href} key={component.title}>
                  <ListItem key={component.title} title={component.title}>
                    {component.description}
                  </ListItem>
                </Link>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

const ListItem = React.forwardRef<React.ElementRef<'a'>, React.ComponentPropsWithoutRef<'a'>>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">{children}</p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = 'ListItem';
