import { Transition } from '@headlessui/react';
import { X } from '@phosphor-icons/react';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/storeHooks';
import { Button } from '../Button';
import { alertSlice } from './slice';

export const Alert = () => {
  const { message: alertMessage, visible: isVisible } = useAppSelector((state) => state.alert);
  const dispatch = useAppDispatch();
  const [progress, setProgress] = useState(0);
  const autoHideTime = 8000;

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        dispatch(alertSlice.actions.hideAlert());
      }, autoHideTime);

      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev < 100) {
            return prev + 1;
          }
          return 100;
        });
      }, autoHideTime / 100);

      return () => {
        clearTimeout(timer);
        clearInterval(progressInterval);
      };
    }
    if (!isVisible) {
      setTimeout(() => {
        setProgress(0);
      }, 300);
    }
  }, [isVisible]);

  return (
    <>
      <Transition
        show={isVisible}
        enter="transition-opacity duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-300"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="absolute bottom-4 left-0 w-full px-5 z-30">
          <div className="flex justify-between flex-col rounded-md overflow-hidden">
            <div className="flex justify-between items-center w-full bg-primary-900 text-white shadow-md px-4 py-2">
              <div>{alertMessage}</div>
              <Button
                variant="tertiary"
                icon={<X />}
                className="text-white hover:bg-primary-800"
                onClick={() => {
                  dispatch(alertSlice.actions.hideAlert());
                }}
              />
            </div>
            <div className="h-1 bg-primary-500 shadow-primary-500 shadow-md" style={{ width: `${progress}%`, transition: 'width 0.3s linear' }}></div>
          </div>
        </div>
      </Transition>
    </>
  );
};
