import { z } from 'zod'
import { CompleteProfileFormSchema, ProfileFormSchema } from '../../../types/forms'
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3'

import { createTRPCRouter, publicProcedure, protectedProcedure } from '../trpc'
import { createPresignedUploadURL as createPresignedUploadURL, getPresignedDownloadURL, uploadFile } from '../../../utils/aws'
import { v4 } from 'uuid'

export const userRouter = createTRPCRouter({
  completeInfo: protectedProcedure.input(CompleteProfileFormSchema).mutation(async ({ input, ctx }) => {
    // handle file upload
    const user = await ctx.prisma.user.update({
      where: { id: input.userId },
      data: {
        name: input.fullname,
        profession: input.profession.value,
        specialty: input.specialty.map((s) => s.value).join(','),
        workplace: input.workplace.value,
      },
    })
    return user
  }),
  createPresignedUploadUrl: protectedProcedure.query(async ({ input, ctx }) => {
    const userId = ctx.session.user.id
    const key = `${userId}/${v4()}`
    const url = await createPresignedUploadURL(key)
    return url
  }),
  getProfilePicture: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id
    const user = await ctx.prisma.user.findUnique({ where: { id: userId } })
    if (!user || !user.uploadedImage) return null
    const url = `https://medgram-images-1293914.s3.eu-west-1.amazonaws.com/${user.uploadedImage}`
    return url
  }),
  getUser: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.prisma.user.findUnique({ where: { id: ctx.session.user.id } })
    return user
  }),
  updateProfilePicture: protectedProcedure.input(z.object({ key: z.string() })).mutation(async ({ input, ctx }) => {
    const userId = ctx.session.user.id
    const user = await ctx.prisma.user.update({
      where: { id: userId },
      data: {
        uploadedImage: input.key,
      },
    })
    return user
  }),
})
