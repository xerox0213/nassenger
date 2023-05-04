import { db } from '@services/configuration/firebase-config';
import { doc, updateDoc } from 'firebase/firestore';

export async function removeMessage(path: string) {
  try {
    const docRef = doc(db, path);
    await updateDoc(docRef, {
      type: 'removed',
      content: '',
      reply: null,
    });
    return 'Message supprimé';
  } catch (error) {
    return Promise.reject(error);
  }
}
