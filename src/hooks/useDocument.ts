import { DocumentData, DocumentReference, onSnapshot } from 'firebase/firestore';
import { useEffect, useState } from 'react';

type R = [TState, boolean, boolean];

type TState = DocumentData | undefined | null;

function useDocument(docRef: DocumentReference<DocumentData>, dep: string[]): R {
  const [state, setState] = useState<TState>(null);
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
      () => {
        setError(true);
        setLoading(false);
      }
    );

    return unsub;
  }, dep);

  return [state, loading, error];
}

export default useDocument;
