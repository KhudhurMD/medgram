import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import { v4 } from 'uuid'
import { GetServerSidePropsContext } from 'next'
import { Shell } from '../../../components/layouts/Shell'
import { graphSlice } from '../../../components/modules/editor/Graph/slice'
import { createTRPCServer } from '../../../server/api/root'
import { getServerAuthSession } from '../../../server/auth'
import { loadGraphAction } from '../../../store/store'
import { useAppDispatch, useAppSelector } from '../../../store/storeHooks'
import { api } from '../../../utils/api'

export const LinkPage = () => {
  // Get graph and write it to local storage if can be cloned then redirect
  const router = useRouter()
  const routerQuery = router.query
  const dispatch = useAppDispatch()
  const graphId = routerQuery.params?.toString()
  const userId = useSession().data?.user?.id
  const currentGraphId = useAppSelector((state: any) => state.graphmetadata.id)
  const [isGraphFound, setIsGraphFound] = React.useState(true)
  const [loadedGraph, setLoadedGraph] = React.useState()

  const cloudGraph = api.admin.getAdminGraph.useQuery({ id: graphId! }, { enabled: graphId != undefined }).data

  useEffect(() => {
    if (!router.isReady) return

    if (graphId && cloudGraph) {
      const cloudGraphData = JSON.parse(cloudGraph.graphData || '{}')
      const newGraphId = v4()
      cloudGraphData.graphmetadata.id = newGraphId
      dispatch(loadGraphAction(cloudGraphData))
      setIsGraphFound(true)
      setTimeout(() => {
        dispatch(graphSlice.actions.resizingTriggered())
      }, 50)
      setTimeout(() => {
        router.push(`/edit/${newGraphId}`)
      }, 1000)
    }
  }, [router.isReady, graphId?.toString(), JSON.stringify(cloudGraph)])

  return (
    <Shell>
      <div className='p-3'>Loading Cloud Graph...</div>
    </Shell>
  )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerAuthSession(context)
  if (!session) {
    return {
      redirect: {
        destination: '/auth/signin',
        permanent: false,
      },
    }
  }

  const sessionUser = session.user?.id
  const user = await createTRPCServer(session).user.getUser()
  const isAdmin = user?.isAdmin == true

  if (!isAdmin) {
    return {
      redirect: {
        destination: '/auth/signin',
        permanent: false,
      },
    }
  }

  return {
    props: {
      session,
    },
  }
}

export default LinkPage
