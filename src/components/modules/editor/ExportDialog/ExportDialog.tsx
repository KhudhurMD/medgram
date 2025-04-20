import { Fragment, useEffect, useRef, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { toJpeg } from 'html-to-image';
import { saveAs } from 'file-saver';
import Logo from '../../../../../public/logo.png';
import { useAppDispatch, useAppSelector } from '../../../../store/storeHooks';
import { PreviewGraphProvider } from './components/PreviewGraph';
import { api } from '../../../../utils/api';
import { useSession } from 'next-auth/react';
import { Warning, X } from '@phosphor-icons/react';
import { Button } from '../../../elements/Button';
import posthog from 'posthog-js';
import { clientEnv } from '../../../../env/schema.mjs';
import { syncSlice } from '../Sync/slice';

function downloadJPEG(graphElement: HTMLDivElement | null, highRes = false) {
  if (graphElement) {
    // ampli.downloadedJpeg()
    const pixelRatio = highRes ? 16 : 4;
    posthog.capture('downloaded jpeg');
    toJpeg(graphElement, { pixelRatio }).then((imgValue) => {
      saveAs(imgValue, `medgram.jpg`);
    });
  }
}

export function ExportDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const graphElement = useRef<HTMLDivElement>(null);
  const graphMetadata = useAppSelector((state) => state.graphmetadata);
  const parsedNodes = useAppSelector((state) => state.graphv2.nodes ?? state.graph.nodes);
  const parsedEdges = useAppSelector((state) => state.graphv2.edges ?? state.graph.edges);
  const userId = useSession().data?.user?.id;
  const dispatch = useAppDispatch();
  const [canClone, setCanClone] = useState(false);
  const graphId = useAppSelector((state) => state.graphmetadata.id);
  const generateLink = api.graphlink.createLink.useQuery({ graphId: graphId!, canClone }, { enabled: graphId != undefined && isOpen });
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const link = `${baseUrl ?? clientEnv.NEXT_PUBLIC_BASE_URL}/${canClone ? 'copy' : 'view'}/${generateLink.data?.id}`;

  useEffect(() => {
    if (isOpen) {
      posthog.capture('opened export dialog');
    }
  }, [isOpen]);

  return (
    <>
      <button
        type="button"
        onClick={() => {
          dispatch(syncSlice.actions.resumeSync());
          setIsOpen(true);
        }}
        className="bg-primary-500 rounded-lg px-3 py-1 font-medium text-white hover:bg-primary-700"
      >
        Export
      </button>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-20" onClose={() => setIsOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-100"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-100"
              >
                <Dialog.Panel className="w-full max-w-xs max-h-[75vh] md:max-h-screen md:max-w-md overflow-y-scroll md:scrollbar-hide transform md:overflow-hidden rounded-lg bg-white py-3 px-6 text-left align-middle shadow-xl transition-all">
                  <div className="flex justify-between items-center">
                    <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                      Export / Share
                    </Dialog.Title>
                    <Button icon={<X width={20} height={20} />} size="icon" variant="tertiary" onClick={() => setIsOpen(false)} />
                  </div>
                  <div className="mt-1 mb-2">
                    <p className="text-sm text-gray-500">You have successfully exported your graph. You can now download it as a PNG or JPEG.</p>
                  </div>

                  <div className="exported-graph h-full w-full border border-gray-200 bg-white text-center" ref={graphElement}>
                    <div className="border-b border-dashed border-gray-300 pt-2">
                      {graphMetadata.author && <p className="text-xs font-semibold text-orange-500">By {graphMetadata.author}</p>}
                      <p className="pb-2 text-lg font-semibold">{graphMetadata.name}</p>
                    </div>
                    <div className="md:h-80 h-60">
                      <PreviewGraphProvider parsedNodes={parsedNodes} parsedEdges={parsedEdges} shouldLayout={false} />
                    </div>
                    <div className="flex flex-row tracking-[-0.08px] items-end justify-center pr-2 gap-2 py-1 bg-gray-50 border-t border-dashed border-gray-300">
                      <p className="text-[10px] text-gray-400">
                        Made with <span className="text-gray-600">www.medgram.net</span>
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-row gap-2">
                    <button
                      type="button"
                      className="rounded-md bg-primary-50 px-4 py-2 text-sm font-medium text-primary-600 hover:bg-primary-100"
                      onClick={() => downloadJPEG(graphElement.current)}
                    >
                      Download JPEG
                    </button>
                    <button
                      type="button"
                      className="rounded-md bg-primary-50 px-4 py-2 text-sm font-medium text-primary-600 hover:bg-primary-100"
                      onClick={() => downloadJPEG(graphElement.current, true)}
                    >
                      Download JPEG (High Res)
                    </button>
                  </div>

                  <div className="w-full border-t border-gray-200 my-4"></div>
                  <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                    Share Link
                  </Dialog.Title>

                  {userId ? (
                    <>
                      <div className="mt-2 mb-3">
                        <p className="text-sm text-gray-500">Please copy the link below and share sharing right away!</p>
                      </div>
                      <div className="mb-3">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={canClone}
                            onChange={(e) => {
                              posthog.capture('toggled allow cloning', { canClone: e.target.checked });
                              setCanClone(e.target.checked);
                            }}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 rounded-y-4l peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border rounded-full after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600 duration-300"></div>
                          <span className="ml-3 font-medium text-sm text-gray-600">Allow Cloning</span>
                        </label>
                      </div>
                      <div className="flex flex-row gap-2">
                        <div className="p-2 flex-grow bg-gray-100 overflow-hidden rounded-md">
                          <div className="overflow-clip">
                            <p className="text-gray-500">{generateLink.status == 'success' ? link : 'Loading...'}</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          className="rounded-md whitespace-nowrap bg-primary-50 px-4 py-2 text-sm font-medium text-primary-600 hover:bg-primary-100"
                          disabled={generateLink.status != 'success'}
                          onClick={() => {
                            navigator.clipboard.writeText(link);
                            posthog.capture('copied share link', { canClone });
                          }}
                        >
                          Copy Link
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="mt-2 mb-3 bg-orange-50 border border-orange-400 p-2 px-3 flex flex-row rounded-md gap-2 items-center">
                      <Warning className="text-orange-500" size={20} weight="fill" />
                      <p className="text-sm text-orange-700">Please login to share your graph.</p>
                    </div>
                  )}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
