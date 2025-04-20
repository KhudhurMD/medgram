import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { Shell } from '../components/layouts/Shell'
import { api } from '../utils/api'
import Image from 'next/image'
import { titleCase } from '../utils/text'
import { useSession } from 'next-auth/react'
import { Spinner } from '../components/elements/Spinner'
import { getServerAuthSession } from '../server/auth'
import { PostHog } from 'posthog-node'
import { redirectIfNoAlphaAccess } from '../utils/featureflags'

const Profile = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const sessionStatus = useSession().status
  const user = api.user.getUser.useQuery().data
  const uploadedImage = api.user.getProfilePicture.useQuery().data

  return (
    <Shell>
      {sessionStatus == 'authenticated' && (
        <div className='p-4'>
          <h1 className='text-2xl text-gray-800'>My Profile</h1>
          {user && (
            <div className='mt-4 border-2 border-gray-200 rounded-lg p-4 w-1/2'>
              <p className='text-gray-400'>Name</p>
              <p className='text-gray-800 text-lg font-medium mb-2'>{titleCase(user?.name || '')}</p>
              <p className='text-gray-400'>Email</p>
              <p className='text-gray-800 text-lg font-medium mb-2'>{titleCase(user?.email || '')}</p>
              <p className='text-gray-400'>Workplace</p>
              <p className='text-gray-800 text-lg font-medium mb-2'>{titleCase(user?.workplace || '')}</p>
              <p className='text-gray-400'>Specialty</p>
              <p className='text-gray-800 text-lg font-medium mb-2'>{titleCase(user?.specialty || '')}</p>
              {uploadedImage && <Image src={uploadedImage} className='rounded-lg mt-4 border-2' width={128} height={128} alt='profile picture' />}
              {props.AlphaAccess && (
                <div>
                  <p className='text-gray-400'>Alpha Access</p>
                  <p className='text-gray-800 text-lg font-medium mb-2'>You have access to the alpha version of the app</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
      {sessionStatus == 'loading' && (
        <div className='p-4'>
          <Spinner />
        </div>
      )}
    </Shell>
  )
}

// export const getServerSideProps: GetServerSideProps = async (context) => {
//   return await redirectIfNoAlphaAccess(context)
// }

export default Profile
