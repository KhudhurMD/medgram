import { X } from '@phosphor-icons/react';
import { useEffect, useState } from 'react';

export const Banner = () => {
  const [show, setShow] = useState<boolean | null>(null);

  useEffect(() => {
    const isBannerShown = localStorage.getItem('isBannerShown');
    if (!isBannerShown || isBannerShown === 'true') {
      setShow(true);
      localStorage.setItem('isBannerShown', 'true');
    }
  }, []);

  if (!show) return null;

  return (
    <>
      <div className="absolute bottom-4 left-0 w-full px-5 z-30">
        <div className="flex justify-between flex-col overflow-hidden">
          <div className="flex justify-between items-center rounded-xl w-full bg-primary-50 border border-dashed border-primary-600  shadow-md px-4 py-2">
            <div>
              <p className="font-medium">The Visual Editor is here 🥳</p>
              <p className="text-sm text-gray-600">Please try it, and let me know your feedback!</p>
            </div>
            <div className="flex items-center space-x-4">
              <a className="bg-white text-primary-900 px-3 py-1 rounded-lg font-medium hover:opacity-80" href="/v1/edit">
                Old Editor
              </a>
              <X
                className="cursor-pointer hover:opacity-70"
                size={24}
                onClick={() => {
                  setShow(false);
                  localStorage.setItem('isBannerShown', 'false');
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
