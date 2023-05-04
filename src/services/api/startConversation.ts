import { db } from '@services/configuration/firebase-config';
import {
  collection,
  serverTimestamp,
  query,
  where,
  getDocs,
  addDoc,
  FieldValue,
} from 'firebase/firestore';

export async function startConversation(currentUserID: string, selectedUsersID: string[]) {
  try {
    const allParticipants = [currentUserID, ...selectedUsersID].sort();
    let q = null;

    if (allParticipants.length === 2) {
      q = query(collection(db, 'Conversations'), where('participants', '==', allParticipants));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        throw { message: 'Conversation existe déjà', id: querySnapshot.docs[0].id };
      }
    }

    type Data = {
      participants: string[];
      lastUpdated: FieldValue;
      lastMessage: 'Aucun message';
      groupInfo: null | { admins: string[] };
    };

    const data: Data = {
      participants: allParticipants,
      lastUpdated: serverTimestamp(),
      lastMessage: 'Aucun message',
      groupInfo:
        allParticipants.length > 2
          ? {
              admins: [currentUserID],
            }
          : null,
    };

    await addDoc(collection(db, 'Conversations'), data);

    return 'Conversation a été créé';
  } catch (error) {
    return Promise.reject(error);
  }
}
