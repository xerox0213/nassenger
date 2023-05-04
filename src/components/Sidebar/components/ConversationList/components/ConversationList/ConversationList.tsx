import styles from './ConversationList.module.css';
import ConversationItem from '../ConversationItem/ConversationItem';
import { collection, orderBy, query, where } from 'firebase/firestore';
import { db } from '@services/configuration/firebase-config';
import { useContext } from 'react';
import { AuthContext } from '@context/AuthContext';
import { ConversationData, firebaseUser } from '@services/types/types';
import useCollection from '@hooks/useCollection';

function ConversationList() {
  const user = useContext(AuthContext) as firebaseUser;
  const q = query(
    collection(db, 'Conversations'),
    where('participants', 'array-contains', user.uid),
    orderBy('lastUpdated', 'desc')
  );
  const [snapshot, loading, error] = useCollection(q);

  if (error) {
    return (
      <div className={styles.conversationList}>
        <p className={styles.error}>❌ Une erreur est survenue</p>
      </div>
    );
  }

  return (
    <div className={styles.conversationList}>
      {loading
        ? null
        : snapshot?.map((doc) => {
            const data = doc.data() as ConversationData;
            return <ConversationItem key={doc.id} conversationID={doc.id} data={data} />;
          })}
    </div>
  );
}

export default ConversationList;
