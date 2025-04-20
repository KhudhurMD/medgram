import { Popover, Transition } from '@headlessui/react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { CaretDown, Cloud, CloudFog, Hamburger, List } from '@phosphor-icons/react';
import { Fragment, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { graphMetadataSlice } from './slice';
import { useAppSelector } from '../../../../store/storeHooks';
import { AppDispatch } from '../../../../store/store';
import { Toolbar } from '@radix-ui/react-toolbar';
import { Button } from '../../../elements/Button';
import { FaCloud, FaEnvelope, FaQuestion, FaQuestionCircle } from 'react-icons/fa';
import { Sync } from '../Sync';
import { ExportDialog } from '../ExportDialog/ExportDialog';
import { useMediaQuery } from 'usehooks-ts';
import posthog from 'posthog-js';
import { FeedbackDialog } from '../FeedbackDialog';
import { PublishDialog } from '../PublishDialog';

dayjs.extend(relativeTime);

function dispatchChanges(dispatch: AppDispatch, name: string, author: string, date: string) {
  dispatch(graphMetadataSlice.actions.graphMetadataChanged({ name, author, date }));
}

export default function GraphMetadata() {
  const graphMetadata = useAppSelector((state) => state.graphmetadata);
  const dispatch = useDispatch();
  const [name, setName] = useState(graphMetadata.name);
  const [date, setDate] = useState(graphMetadata.date);
  const [author, setAuthor] = useState(graphMetadata.author);
  const isNotMobile = useMediaQuery('(min-width: 768px)');
  const isMobile = !isNotMobile;

  useEffect(() => {
    setName(graphMetadata.name);
    setDate(graphMetadata.date);
    setAuthor(graphMetadata.author);
  }, [JSON.stringify(graphMetadata)]);

  const graphMetaDataInputs = [
    {
      label: 'Name',
      name: 'name',
      value: name,
      setValue: setName,
      placeholder: 'E.g. Approach to Jaundice',
    },
    {
      label: 'Author',
      name: 'author',
      value: author,
      setValue: setAuthor,
      placeholder: 'E.g. Dr. John Doe',
    },
  ];
  return (
    <div className="w-full bg-white px-3 py-2 md:border-b border-b-gray-200">
      <Popover className="relative">
        {({ open, close }) => (
          <>
            <div className="flex flex-row justify-between ">
              <div className="flex space-x-4 justify-center items-center">
                <Popover.Button
                  className={`
                ${open ? '' : 'text-opacity-90'}
                flex flex-row items-center rounded-md px-1 md:px-2 py-1 text-lg text-primary-800 text-opacity-90 outline-none hover:text-opacity-100`}
                >
                  <span>{graphMetadata.name}</span>
                  <CaretDown
                    weight="bold"
                    className={`${open ? '' : 'text-opacity-70'}
                  ml-2 rounded-full bg-gray-100 p-[2px] text-gray-500 transition duration-150 ease-in-out hover:translate-y-[2px] hover:bg-primary-50 hover:text-primary-500 group-hover:text-opacity-80`}
                    size={17}
                    aria-hidden="true"
                  />
                </Popover.Button>
                <FeedbackDialog />
              </div>

              <div className="flex flex-row gap-2">
                <Sync />
                <PublishDialog />
                <ExportDialog />
              </div>
            </div>

            <Transition
              as={Fragment}
              enter="transition ease-out duration-200"
              enterFrom="opacity-0 translate-y-1"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-1"
            >
              <Popover.Panel className="absolute z-30 transform rounded-lg border bg-white p-1 w-96 shadow-xl">
                <div className="p-2 w-full pt-4">
                  {graphMetaDataInputs.map((input, index) => (
                    <div key={index}>
                      <label htmlFor={input.name} className="block text-sm font-medium text-gray-700">
                        {input.label}
                      </label>
                      <div className="mt-1 mb-2">
                        <input
                          name={input.name}
                          id={input.name}
                          className="block w-full rounded-md border border-gray-300 p-2 text-sm placeholder-gray-400 shadow-sm"
                          placeholder={input.placeholder}
                          value={input.value}
                          onChange={(e) => input.setValue(e.target.value)}
                        />
                      </div>
                    </div>
                  ))}
                  <div className="my-1 text-gray-400">Last updated {dayjs(graphMetadata.date).toNow()}</div>
                  <button
                    type="button"
                    className="mt-2 rounded-lg border bg-primary-500 py-2 px-3 text-sm font-medium leading-4 text-gray-100 opacity-95 shadow-sm outline-none hover:opacity-100"
                    onClick={() => {
                      dispatchChanges(dispatch, name, author, date);
                      close();
                    }}
                  >
                    Save
                  </button>
                </div>
              </Popover.Panel>
            </Transition>
          </>
        )}
      </Popover>
    </div>
  );
}
