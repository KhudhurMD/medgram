import { yupResolver } from '@hookform/resolvers/yup';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { ArrowRight, Spinner } from '@phosphor-icons/react';
import { Dispatch, SetStateAction, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaSpinner } from 'react-icons/fa';
import { InputActionMeta } from 'react-select';
import { professionOptions, specialtyOptions } from '../../../../data/constants/graph';
import { useQueryLocation } from '../../../../data/hooks/useQueryLocation';
import { ProfileFormSchema } from '../../../../types/forms';
import { api } from '../../../../utils/api';
import { Button } from '../../../elements/Button';
import { FilePicker } from '../../../elements/FilePicker';
import { Input } from '../../../elements/Input';
import { Select } from '../../../elements/Select';

export function CompleteProfile() {
  const [inputValue, setInputValue] = useState('');
  const [locationOptions, isLocationLoading] = useQueryLocation(inputValue);
  const userId = useSession().data?.user?.id;
  const updateUserInfo = api.user.completeInfo.useMutation();
  const [isImageUploading, setIsImageUploading] = useState(false);
  const push = useRouter().push;

  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = useForm({ resolver: yupResolver(ProfileFormSchema) });

  const onSubmit = (data: unknown) => {
    ProfileFormSchema.validate(data)
      .then((data) => {
        userId && updateUserInfo.mutate({ userId, ...data });
        push('/edit/');
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <>
      <div className="flex flex-col items-center gap-3 py-3">
        {/* Form Start */}
        <form onSubmit={handleSubmit(onSubmit)} className="w-full">
          {/* Full Name*/}
          <Input
            label="Full Name"
            name="fullname"
            error={errors.fullname?.message}
            inputProps={{
              ...register('fullname', { required: true }),
              placeholder: 'Enter your full name',
            }}
          />

          {/* Profession */}
          <Select name="profession" label="Profession" control={control} placeholder="Select Your Profession" options={professionOptions} />

          {/* Specialty */}
          <Select
            name="specialty"
            label="Specialty"
            control={control}
            placeholder="Select Your / Favorite Specialty"
            options={specialtyOptions.map((specialty) => ({ value: specialty.value, label: specialty.value }))}
            extraProps={{ isMulti: true }}
          />

          {/* Workplace */}

          {/* Profile Picture */}
          <label htmlFor="profile" className="text-md mb-1 block font-medium text-gray-600">
            Profile Picture
          </label>

          {userId && <FilePicker userId={userId} />}

          <div className="w-full mt-4">
            <Button label="Continue" icon={<ArrowRight />} extraProps={{ type: 'submit' }} />
          </div>
        </form>
      </div>
    </>
  );
}

const handleInputChange = (inputValue: string, setInputValue: Dispatch<SetStateAction<string>>, meta: InputActionMeta) => {
  if (meta.action !== 'input-blur' && meta.action !== 'menu-close') {
    setInputValue(inputValue);
  }
};

export default CompleteProfile;
