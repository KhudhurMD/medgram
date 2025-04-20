import { yupResolver } from '@hookform/resolvers/yup';
import { useSession } from 'next-auth/react';
import { type } from 'os';
import { X, ArrowRight, CheckCircle, WarningCircle } from '@phosphor-icons/react';
import { Fragment, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaQuestionCircle } from 'react-icons/fa';
import { useMediaQuery } from 'usehooks-ts';
import { PublishFormSchema, TicketFormSchema } from '../../../../types/forms';
import { api } from '../../../../utils/api';
import { Input } from '../../../elements/Input';
import { Transition, Dialog } from '@headlessui/react';
import { Button } from '../../../elements/Button';
import { useAppSelector } from '../../../../store/storeHooks';
import { communityGraphRouter } from '../../../../server/api/routers/communityGraphRouter';
import { Spinner } from '../../../elements/Spinner';

export function PublishDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const isNotMobile = useMediaQuery('(min-width: 768px)');
  const session = useSession();
  const userEmail = session?.data?.user?.email;
  const graphId = useAppSelector((state) => state.graphmetadata.id);
  const graphData = JSON.stringify(useAppSelector((state) => state));
  const sendSubmission = api.utils.createSubmission.useMutation();
  const [showMessage, setShowMessage] = useState(false);
  const createCommunityGraphMutation = api.communityGraph.createGraph.useMutation();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({ resolver: yupResolver(PublishFormSchema) });

  useEffect(() => {
    if (userEmail) {
      setValue('email', userEmail);
    }
  }, [userEmail]);

  useEffect(() => {
    setValue('canClone', true);
  }, []);

  const onSubmit = async (data: unknown) => {
    if (!graphId) {
      console.error('No graph id');
      return;
    }

    const isFormValid = PublishFormSchema.isValidSync(data);

    if (!isFormValid) {
      console.error('Form is not valid');
      return;
    }

    console.log(graphId);

    const communityGraph = await createCommunityGraphMutation.mutateAsync({
      graphId,
      graphData,
    });
    const communityGraphId = communityGraph.id;

    console.log(communityGraph);

    sendSubmission.mutate({
      graphId,
      communityGraphId,
      ...data,
    });
    setShowMessage(true);
  };

  useEffect(() => {
    !isOpen && setShowMessage(false);
    !isOpen && setValue('message', '');
  }, [isOpen]);

  return (
    <>
      <button className="rounded-md bg-gray-100 px-3 py-1 font-medium text-gray-700 hover:bg-gray-200" onClick={() => setIsOpen(true)}>
        Publish
      </button>
      <>
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
                  <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all">
                    <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                      <div className="flex justify-between items-center">
                        <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                          Publish to MedGram's Twitter
                        </Dialog.Title>
                        <Button icon={<X width={20} height={20} />} size="icon" variant="tertiary" onClick={() => setIsOpen(false)} />
                      </div>
                    </Dialog.Title>
                    <div className="mt-2 mb-3">
                      <p className="text-base text-gray-500">
                        I encourage you to submit your graph to be posted in our community account, so others can benefit from your expertise!
                      </p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="w-full">
                      {/* Email Address */}
                      <Input
                        label="Email"
                        name="email"
                        error={errors.email?.message}
                        inputProps={{
                          ...register('email', { required: true }),
                          placeholder: 'Enter your email',
                        }}
                      />

                      {/* References */}
                      <div>
                        <label htmlFor="email" className="text-md block font-medium text-gray-600">
                          References
                        </label>

                        <div className="mt-1 mb-3">
                          <textarea
                            className={`block w-full appearance-none rounded-md border-2 border-gray-200 px-3 py-2 placeholder-gray-400 focus:border-primary-500 focus:outline-none focus:ring-primary-500`}
                            placeholder="Please write the references"
                            {...register('references', { required: true })}
                          />
                          {errors.message?.message && <div className="text-sm text-red-500">{errors.message?.message.toString()}</div>}
                        </div>

                        <div className="mt-1 mb-3">
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" {...register('canClone', { required: true })} />
                            <div className="w-11 h-6 bg-gray-200 rounded-y-4l peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border rounded-full after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600 duration-300"></div>
                            <span className="ml-3 font-medium text-sm text-gray-600">Allow others to copy it and make their own versions.</span>
                          </label>
                        </div>
                        {errors.message?.message && <div className="text-sm text-red-500">{errors.message?.message.toString()}</div>}
                      </div>
                      <Button
                        label={`Submit`}
                        className="mt-6"
                        icon={
                          sendSubmission.isLoading || createCommunityGraphMutation.isLoading ? (
                            <Spinner className="w-5 h-5" />
                          ) : (
                            <ArrowRight className="w-5 h-5" />
                          )
                        }
                        extraProps={{ type: 'submit', disabled: sendSubmission.isLoading || createCommunityGraphMutation.isLoading || showMessage }}
                      />

                      {showMessage && (
                        <>
                          {sendSubmission.isSuccess && (
                            <div className="flex space-x-2 justify-start items-center mt-4 bg-green-100 p-2 rounded-md text-green-600">
                              <CheckCircle size={24} className="text-green-600" />
                              <p>Thanks for your submission!</p>
                            </div>
                          )}

                          {sendSubmission.isError && (
                            <div className="flex space-x-2 justify-start items-center mt-4 bg-red-100 p-2 rounded-md text-red-500">
                              <WarningCircle size={20} className="text-red-600" />
                              <p>Something went wrong, please try again later.</p>
                            </div>
                          )}
                        </>
                      )}
                    </form>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>
      </>
    </>
  );
}
