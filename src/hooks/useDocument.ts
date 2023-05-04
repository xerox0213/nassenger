import { DocumentData, DocumentReference, onSnapshot } from 'firebase/firestore';
import { useEffect, useState } from 'react';

type R = [DocumentData | undefined | null, boolean, boolean];

function useDocument(docRef: DocumentReference<DocumentData>, dep: string | null): R {
  const [state, setState] = useState<DocumentData | undefined | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const unsub = onSnapshot(
      docRef,
      (snapshot) => {
        if (snapshot.exists()) {
          setState(snapshot.data());
        } else {
          setState(null);
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
  }, [dep]);

  return [state, loading, error];
}

export default useDocument;
