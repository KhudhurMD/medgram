import { Resend } from 'resend';

export const ResendInstance = new Resend(process.env.RESEND_API_KEY);
