import { z } from 'zod';
import { PublishInput, TicketInput } from '../../../types/forms';
import { createTRPCRouter, publicProcedure } from '../trpc';
import { env } from '../../../env/server.mjs';
import { ResendInstance } from '../../../utils/resend';

export const utilsRouter = createTRPCRouter({
  addToWishlist: publicProcedure.input(z.object({ email: z.string() })).mutation(async ({ input, ctx }) => {
    // if not, create a new link
    const { email } = input;
    await ctx.prisma.wishlistEmails
      .create({
        data: {
          email,
        },
      })
      .catch((err) => {
        if (err.code === 'P2002') {
          console.log('Email already exists');
        }
      });
  }),

  createTicket: publicProcedure.input(TicketInput).mutation(async ({ input, ctx }) => {
    const { email, type, message } = input;
    ctx.prisma.ticket.create({
      data: {
        email,
        type,
        message,
      },
    });

    ResendInstance.emails.send({
      from: `MedGram ${type || 'Message'} <${env.EMAIL_FROM}>`,
      to: env.EMAIL_FROM,
      subject: type || 'Message',
      text: message,
    });
  }),

  createSubmission: publicProcedure.input(PublishInput).mutation(async ({ input, ctx }) => {
    const { email, references, canClone, graphId, communityGraphId } = input;
    const type = 'Submission';
    const message = `
<p>Graph ID: ${graphId}</p>
<p>Community Graph ID: ${communityGraphId}</p>
<p>References:</p>
<p>${references}</p>
<p>Can Clone: ${canClone}</p>

<p>Copy Revision:</p>
<a href='https://medgram.net/admin/clone/${communityGraphId}'>https://medgram.net/admin/clone/${communityGraphId}</a>

<p>Copy Graph:</p>
<a href='https://medgram.net/admin/clone/${graphId}'>https://medgram.net/admin/clone/${graphId}</a>
`;
    ctx.prisma.ticket.create({
      data: {
        email,
        type,
        message,
      },
    });

    ResendInstance.emails.send({
      from: `MedGram ${type || 'Message'} <${env.EMAIL_FROM}>`,
      to: env.EMAIL_FROM,
      subject: type || 'Message',
      html: message,
    });
  }),
});
