import { DocumentData, Query, QueryDocumentSnapshot, onSnapshot } from 'firebase/firestore';
import { useState, useEffect } from 'react';

type R = [QueryDocumentSnapshot<DocumentData>[] | null, boolean, boolean];

type TState = QueryDocumentSnapshot<DocumentData>[] | null;

function useCollection<T>(query: Query<DocumentData>, dependencies: T[] = []): R {
  const [state, setState] = useState<TState>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const unsub = onSnapshot(
      query,
      (querySnapshot) => {
        const documentsData: QueryDocumentSnapshot<DocumentData>[] = [];
        querySnapshot.forEach((doc) => {
          documentsData.push(doc);
        });
        setState(documentsData);
        setLoading(false);
        setError(false);
      },
      (error) => {
        console.log(error);
        setError(true);
        setLoading(false);
      }
    );
    return unsub;
  }, dependencies);

  return [state, loading, error];
}

export default useCollection;
