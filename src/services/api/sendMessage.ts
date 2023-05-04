import { TReply } from '@pages/[id]/[id]';
import { db } from '@services/configuration/firebase-config';
import { serverTimestamp, writeBatch, doc, collection, FieldValue } from 'firebase/firestore';

export async function sendMessage(
  type: string,
  conversationID: string,
  content: string,
  userID: string,
  reply: TReply | null
) {
  try {
    const batch = writeBatch(db);
    const timestamp = serverTimestamp();

    const conversationDocRef = doc(db, 'Conversations', conversationID);
    const messageDocRef = doc(collection(db, `Conversations/${conversationID}/Messages`));

    type Data = {
      type: string;
      content: string;
      userID: string;
      messageID: string;
      sentAt: FieldValue;
      reply: string | null;
    };

    const data: Data = {
      type,
      content,
      userID,
      messageID: messageDocRef.id,
      sentAt: serverTimestamp(),
      reply: reply && reply.messageID,
    };

    batch.update(conversationDocRef, { lastUpdated: timestamp });
    batch.set(messageDocRef, data);
    await batch.commit();

    return 'Message envoyé';
  } catch (error) {
    return Promise.reject(error);
  }
}
