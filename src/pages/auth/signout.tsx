import { signOut } from 'next-auth/react'
import { redirect } from 'next/dist/server/api-utils'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

const SignOut = () => {
  const router = useRouter()

  useEffect(() => {
    signOut({ redirect: false })
    router.push('/')
  }, [])
}

export default SignOut
