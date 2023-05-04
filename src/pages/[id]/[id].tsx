import ChatHeader from '@components/Chat/components/ChatHeader/ChatHeader';
import { useParams } from 'react-router-dom';
import styles from './Chat.module.css';
import ChatContent from '@components/Chat/components/ChatContent/components/ChatContent/ChatContent';
import ChatInput from '@components/Chat/components/ChatInput/ChatInput';
import { doc } from 'firebase/firestore';
import { db } from '@services/configuration/firebase-config';
import useDocument from '@hooks/useDocument';
import { ConversationData } from '@services/types/types';
import { useState } from 'react';
import ModalGroup from '@components/ModalGroup/components/ModalGroup/ModalGroup';

export type TReply = {
  messageID: string;
  content: string;
  type: string;
};

function Chat() {
  const params = useParams();
  const conversationID = params.conversationID as string;
  const conversationDocRef = doc(db, 'Conversations', conversationID);
  const [state, loading, error] = useDocument(conversationDocRef, conversationID);
  const conversationData = state as ConversationData | undefined | null;
  const [reply, setReply] = useState<TReply | null>(null);
  const [isOpened, setIsOpened] = useState(false);

  if (error) {
    return (
      <div className={`${styles.container}`}>
        <h1>Une erreur s'est produite</h1>
      </div>
    );
  }

  if (!loading && !conversationData) {
    return (
      <div className={styles.container}>
        <h1>La conversation n'existe pas</h1>
      </div>
    );
  }

  if (!loading && conversationData) {
    return (
      <div className={styles.container}>
        {isOpened && <ModalGroup conversationData={conversationData} setIsOpened={setIsOpened} />}
        <ChatHeader conversationData={conversationData} setIsOpened={setIsOpened} />
        <ChatContent
          key={conversationID}
          conversationData={conversationData}
          reply={reply}
          setReply={setReply}
        />
        <ChatInput reply={reply} setReply={setReply} />
      </div>
    );
  }
}

export default Chat;
