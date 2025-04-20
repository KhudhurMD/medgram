import { GetObjectCommand, PutObjectCommand, PutObjectCommandInput, S3Client } from '@aws-sdk/client-s3'
import { Stream } from 'stream'
import { env } from '../env/server.mjs'
import { v4 as uuidv4 } from 'uuid'
import { createPresignedPost, PresignedPostOptions } from '@aws-sdk/s3-presigned-post'
import { Upload } from '@aws-sdk/lib-storage'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

export const S3 = new S3Client({
  region: env.NOT_AWS_S3_REGION,
  credentials: {
    accessKeyId: env.NOT_AWS_ACCESS_KEY,
    secretAccessKey: env.NOT_AWS_S_ACCESS_KEY,
  },
  useAccelerateEndpoint: true,
})

export const uploadFile = async (file: File, userId: string) => {
  const uuid = uuidv4()
  const key = `${userId}/${uuid}`
  const uploadParams: PutObjectCommandInput = {
    Bucket: env.NOT_AWS_S3_BUCKET,
    Key: key,
    Body: file,
    ContentLength: file.size,
  }
  try {
    const upload = await new Upload({
      client: S3,
      params: uploadParams,
    })
    upload.on('httpUploadProgress', (progress) => {
      console.log(progress)
    })
    const data = await upload.done()
    console.log(data)
    return key
  } catch (e) {
    console.error('Upload failed:')
    console.error(e)
  }
}

export const createPresignedUploadURL = async (key: string) => {
  const params = {
    Bucket: env.NOT_AWS_S3_UNCOMPRESSED_BUCKET,
    Key: key,
  }
  const url = await createPresignedPost(S3, params)
  return url
}

export const getPresignedDownloadURL = async (key: string) => {
  const params = {
    Bucket: env.NOT_AWS_S3_BUCKET,
    Key: key,
  }

  const url = await getSignedUrl(S3, new GetObjectCommand(params))
  return url
}

export const isAWSKey = (url: string) => {
  const providers = ['google', 'facebook', 'twitter']
  return providers.every((provider) => !url.includes(provider))
}
