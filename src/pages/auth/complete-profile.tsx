import { NextPage } from 'next'
import { MinimalShell } from '../../components/layouts/MinimalShell'
import CompleteProfile from '../../components/modules/auth/CompleteProfile'

export const CompleteProfilePage: NextPage = () => {
  return (
    <MinimalShell title='Complete Your Profile'>
      <CompleteProfile />
    </MinimalShell>
  )
}

export default CompleteProfilePage
