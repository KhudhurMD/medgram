import * as yup from 'yup'

export const ProfileFormSchema = yup.object().shape({
  fullname: yup.string().required('Full name is required'),
  profession: yup.object({ value: yup.string().required('Profession is required') }).required('Profession is required'),
  specialty: yup.array().required('Specialty is required'),
  // workplace: yup.object({ value: yup.string().required('Workspace is required') }).required('Workspace is required'),
  profilePicture: yup.mixed(),
})

export const TicketFormSchema = yup.object().shape({
  email: yup.string().required('Your email is required for us to contact you again!'),
  message: yup.string().required('Please write your feedback!'),
})

export const PublishFormSchema = yup.object().shape({
  email: yup.string().required('Your email is required for us to contact you!'),
  canClone: yup.boolean().required('Please select if you want to allow copying'),
  references: yup.string().required('Please write your references'),
})

export const TicketInput = yup.object().shape({
  email: yup.string().required('Your email is required for us to contact you again!'),
  type: yup.string().required('Please write a title for your ticket!'),
  message: yup.string().required('Please write your feedback!'),
})

export const PublishInput = yup.object().shape({
  email: yup.string().required('Your email is required for us to contact you!'),
  canClone: yup.boolean().required('Please select if you want to allow copying'),
  references: yup.string().required('Please write your references'),
  graphId: yup.string().required('Graph ID is required'),
  communityGraphId: yup.string().required('Community Graph ID is required'),
})

export const CompleteProfileFormSchema = ProfileFormSchema.shape({
  userId: yup.string().required('User ID is required'),
})

export type SelectOption = {
  label: string
  value: string
}

export type SelectOptionArr = SelectOption[]
