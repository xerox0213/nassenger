import { MessageData } from '@services/types/types';
import { DocumentData, Query, QueryDocumentSnapshot, onSnapshot } from 'firebase/firestore';
import { useEffect, useState } from 'react';

type R = [TState, boolean, boolean];

type TState = MessageData | null;

function useLastMessage(query: Query<DocumentData>): R {
  const [state, setState] = useState<TState>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const unsub = onSnapshot(
      query,
      (querySnapshot) => {
        if (querySnapshot.empty) {
          setState(null);
        } else {
          const doc = querySnapshot.docs[0];
          const data = doc.data() as MessageData;
          setState(data);
        }
        setLoading(false);
        setError(false);
      },
      (error) => {
        setError(true);
        setLoading(false);
      }
    );

    return unsub;
  }, []);

  return [state, loading, error];
}

export default useLastMessage;
