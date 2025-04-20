import axios from 'axios'
import Image from 'next/image'
import { MouseEventHandler, useRef, useState } from 'react'
import { api } from '../../utils/api'
import { Button } from './Button'

interface FilePickerProps {
  userId: string
}

export function FilePicker({ userId }: FilePickerProps) {
  const getPresignedUrl = api.user.createPresignedUploadUrl.useQuery()
  const updateProfilePicture = api.user.updateProfilePicture.useMutation()

  const fileInput = useRef<HTMLInputElement>(null)
  const [uploadedFile, setUploadedFile] = useState<string | ArrayBuffer | null>(null)
  const [isImageUploading, setIsImageUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  const fileInputName = fileInput.current?.files?.[0]?.name

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsImageUploading(true)
    const file = e.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    const presignedUrl = getPresignedUrl.data
    if (!presignedUrl) return
    const url = presignedUrl.url
    const params = {
      ...presignedUrl.fields,
      file: file,
    }

    for (const key in params) {
      // @ts-ignore
      formData.append(key, params[key])
    }

    const res = await axios.request({
      url,
      method: 'POST',
      data: formData,
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
        setUploadProgress(percentCompleted)
        console.log(percentCompleted, progressEvent.loaded, progressEvent.total)
      },
    })
    if (res.status != 200 && res.status != 204) return
    updateProfilePicture.mutate({ key: presignedUrl.fields.key! })
    const fr = new FileReader()
    fr.readAsDataURL(file)
    fr.onload = () => {
      setUploadedFile(fr.result)
      setUploadProgress(0)
    }
    setIsImageUploading(false)
  }

  return (
    <>
      <input type='file' ref={fileInput} onChange={handleFileChange} className='hidden' />
      <div className='flex flex-row items-center justify-between'>
        <div className='flex flex-row items-center gap-4'>
          {!isImageUploading && uploadedFile && (
            <Image
              src={uploadedFile as string}
              width={56}
              height={56}
              className='rounded-full w-14 h-14 object-cover border border-gray-300 transition-all duration-300'
              alt='profile picture'
            />
          )}
          {(isImageUploading || !uploadedFile) && (
            <div className={`w-14 h-14 rounded-full bg-gray-200 ${isImageUploading && 'bg-loading bg-gradient-gray'}`}></div>
          )}
          <Button
            label='Upload File'
            variant='secondary'
            size='sm'
            extraProps={{
              onClick: (e) => {
                e.preventDefault()
                fileInput.current?.click()
              },
            }}
          />
        </div>
        {isImageUploading && (
          <div className='w-32 bg-gray-200 rounded-full h-2 dark:bg-gray-700'>
            <div className={`bg-loading bg-gradient-primary h-2 rounded-full`} style={{ width: `${uploadProgress}%` }}></div>
          </div>
        )}
      </div>
    </>
  )
}
