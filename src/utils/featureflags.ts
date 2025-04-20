import { GetServerSidePropsContext } from 'next'
import { PostHog } from 'posthog-node'
import { getServerAuthSession } from '../server/auth'

export async function redirectIfNoAlphaAccess(context: GetServerSidePropsContext) {
  const session = await getServerAuthSession(context)
  const userId = session?.user?.id
  const client = new PostHog('phc_8oPy3L3XtZBBgPQw1KJ9omZugBZrX2ZofZlnMo0YqwB')
  const alphaAccess = userId && (await client.getFeatureFlag('AlphaAccess', userId))
  if (!alphaAccess) {
    return {
      redirect: {
        destination: '/edit/',
        permanent: false,
      },
    }
  } else {
    return {
      props: {
        AlphaAccess: true,
      },
    }
  }
}
