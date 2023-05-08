import { getDoc, doc } from 'firebase/firestore';
import { db } from '@services/configuration/firebase-config';
import { useEffect, useState } from 'react';
import { DocumentData, DocumentSnapshot } from 'firebase/firestore';

type R = [TState, boolean, boolean];
type TState = DocumentSnapshot<DocumentData>[] | null;
type TBackup = {
  [key: string]: DocumentSnapshot<DocumentData>;
};
const backup: TBackup = {};

function useUserDocs(participants: string[], dep: any[]): R {
  const [state, setState] = useState<TState>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const alreadyInCache = participants.filter((participant) => participant in backup);
    if (alreadyInCache.length === participants.length) {
      const userData = participants.map((participant) => backup[participant]);
      setState(userData);
      setError(false);
      setLoading(false);
    } else {
      const missingUserDoc = participants.filter((participant) => !(participant in backup));
      Promise.all(
        missingUserDoc.map((userID) => {
          const userDocRef = doc(db, 'Users', userID);
          return getDoc(userDocRef);
        })
      )
        .then((docs) => {
          docs.forEach((doc) => {
            backup[doc.id] = doc;
          });
          alreadyInCache.forEach((id) => docs.push(backup[id]));
          setState(docs);
          setError(false);
        })
        .catch(() => setError(true))
        .finally(() => setLoading(false));
    }
  }, dep);

  return [state, loading, error];
}

export default useUserDocs;
