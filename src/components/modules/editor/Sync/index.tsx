import _ from 'lodash';
import { useSession } from 'next-auth/react';
import { Check, CheckCircle } from '@phosphor-icons/react';
import { useEffect, useState } from 'react';
import { useDebounce } from 'usehooks-ts';
import { useAppSelector } from '../../../../store/storeHooks';
import { api } from '../../../../utils/api';
import { Button } from '../../../elements/Button';
import { Spinner } from '../../../elements/Spinner';

export const Sync = () => {
  const updateGraph = api.graph.updateGraph.useMutation();
  const graphState = useAppSelector((state) => state);
  const graphMetadataState = useAppSelector((state) => state.graphmetadata);
  const userId = useSession()?.data?.user?.id;
  const [isSyncing, setIsSyncing] = useState(false);
  const [isSynced, setIsSynced] = useState(false);
  const debouncedGraphState = useDebounce(graphState, 3000);
  const shouldSync = useAppSelector((state) => state.sync.shouldSync);

  useEffect(() => {
    if (updateGraph.status === 'loading') {
      setIsSyncing(true);
    }
    if (updateGraph.status === 'success') {
      setIsSynced(true);
      setIsSyncing(false);
    }
  }, [updateGraph.status]);

  function handleSync() {
    if (!userId || !graphMetadataState.id) {
      return;
    }
    if (shouldSync == false) return;
    const response = updateGraph.mutate({
      id: graphMetadataState.id,
      name: graphMetadataState.name,
      updatedAt: new Date().toISOString(),
      userId: userId,
      graphData: JSON.stringify(graphState),
    });
  }

  useEffect(() => {
    setIsSynced(false);
    handleSync();
  }, [debouncedGraphState, shouldSync]);

  return (
    <>
      {userId && (
        <div className="h-8 flex items-center">
          {isSyncing && <Spinner className="w-5 h-5 mt-1 m-0" />}
          {isSynced && !isSyncing && <CheckCircle className="w-6 h-6 mt-1 text-primary-500 cursor-pointer" onClick={() => handleSync()} />}
        </div>
      )}
    </>
  );
};
