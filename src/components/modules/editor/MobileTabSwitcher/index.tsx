import { GitFork, List, Pen } from '@phosphor-icons/react';
import { useState } from 'react';
import { classNames } from '../../../../utils/tailwind';

const tabs = [
  { name: 'Text View', icon: List, current: true, value: 'text' },
  { name: 'Graph View', icon: GitFork, current: false, value: 'graph' },
];

interface MobileTabSwitcherProps {
  handleTabChange: (tab: string) => void;
}
export default function MobileTabSwitcher({ handleTabChange }: MobileTabSwitcherProps) {
  const [selectedTab, setSelectedTab] = useState('text');
  return (
    <div>
      <div className="border-b border-gray-100 px-4 w-full mb-1">
        <nav className="-mb-px flex pb-2" aria-label="Tabs">
          {tabs.map((tab) => (
            <a
              key={tab.name}
              onClick={(e) => {
                setSelectedTab(tab.value);
                handleTabChange(tab.value);
              }}
              className={classNames(
                selectedTab == tab.value
                  ? 'bg-primary-50 text-primary-500'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                'group inline-flex items-center py-2 px-4 font-medium text-sm rounded-full'
              )}
              aria-current={selectedTab == tab.value ? 'page' : undefined}
            >
              <tab.icon
                className={classNames(
                  selectedTab == tab.value ? 'text-primary-500' : 'text-gray-400 group-hover:text-gray-500',
                  '-ml-0.5 mr-2 h-5 w-5'
                )}
                aria-hidden="true"
              />
              <span>{tab.name}</span>
            </a>
          ))}
        </nav>
      </div>
    </div>
  );
}
