import { Transition, Dialog } from '@headlessui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSession } from 'next-auth/react';
import { ArrowRight, CheckCircle, Spinner, WarningCircle, X } from '@phosphor-icons/react';
import { Fragment, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { TicketFormSchema } from '../../types/forms';
import { api } from '../../utils/api';
import { Button } from './Button';
import { Input } from './Input';
import { PURCHASE_THING } from '../modules/index/Graphs';

interface ContactDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  type: 'Feedback' | 'Message';
}

export const getPurchaseThing = (type: string) => {
  if (type === 'Feedback') {
    return PURCHASE_THING;
  }
  return 'Message';
};

export function ContactDialog({ isOpen = false, type = 'Message', setIsOpen }: ContactDialogProps) {
  const session = useSession();
  const userEmail = session?.data?.user?.email;
  const sendTicket = api.utils.createTicket.useMutation();
  const [showMessage, setShowMessage] = useState(false);

  const {
    register,
    handleSubmit,
    setFocus,
    setValue,
    formState: { errors },
  } = useForm({ resolver: yupResolver(TicketFormSchema) });

  useEffect(() => {
    if (userEmail) {
      setValue('email', userEmail);
      setFocus('message', { shouldSelect: true });
    }
  }, [userEmail]);

  const onSubmit = (data: unknown) => {
    TicketFormSchema.validate(data)
      .then((data) => {
        sendTicket.mutate({
          type,
          ...data,
        });
      })
      .catch((err) => {
        console.error(err);
      });
    setShowMessage(true);
  };

  useEffect(() => {
    !isOpen && setShowMessage(false);
    !isOpen && setValue('message', '');
  }, [isOpen]);

  return (
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
            <div className="fixed inset-0 bg-black bg-opacity-60" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-start mt-10 justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-100"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-100"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                    <div className="flex justify-between items-center">
                      <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                        Send {type}
                      </Dialog.Title>
                      <Button icon={<X width={20} height={20} />} size="icon" variant="tertiary" onClick={() => setIsOpen(false)} />
                    </div>
                  </Dialog.Title>
                  <div className="mt-2 mb-3">
                    <p className="text-sm text-gray-500">Please fill out the form below to send your {type.toLowerCase()}.</p>
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

                    {/* Message */}
                    <div>
                      <label htmlFor="email" className="text-md block font-medium text-gray-600">
                        Message
                      </label>

                      <div className="mt-1 mb-3">
                        <textarea
                          className={`block w-full appearance-none rounded-md border-2 border-gray-200 px-3 py-2 placeholder-gray-400 focus:border-primary-500 focus:outline-none focus:ring-primary-500`}
                          {...register('message', { required: true })}
                        />
                        {errors.message?.message && <div className="text-sm text-red-500">{errors.message?.message.toString()}</div>}
                      </div>
                    </div>
                    <Button
                      label={`Send ${type}`}
                      className="mt-6"
                      icon={sendTicket.isLoading ? <Spinner className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                      extraProps={{ type: 'submit', disabled: sendTicket.isLoading || showMessage }}
                    />

                    {showMessage && (
                      <>
                        {sendTicket.isSuccess && (
                          <div className="flex space-x-2 justify-start items-center mt-4 bg-green-100 p-2 rounded-md text-green-600">
                            <CheckCircle size={24} className="text-green-600" />
                            <p>Thanks for your message!</p>
                          </div>
                        )}

                        {sendTicket.isError && (
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
  );
}
