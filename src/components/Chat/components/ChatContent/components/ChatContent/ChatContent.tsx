import { arrayUnion, collection, limit, orderBy, query, updateDoc } from 'firebase/firestore';
import { doc } from 'firebase/firestore';
import styles from './ChatContent.module.css';
import { db } from '@services/configuration/firebase-config';
import { useParams } from 'react-router-dom';
import { ConversationData, MessageData, SetState, firebaseUser } from '@services/types/types';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '@context/AuthContext';
import Message from '../Message/Message';
import useCollection from '@hooks/useCollection';
import Loader from '@components/Loader/Loader';
import { Waypoint } from 'react-waypoint';
import { IoCloseOutline } from 'react-icons/io5';
import { GoReply } from 'react-icons/go';
import { TReply } from '@pages/[id]/[id]';

type Props = {
  reply: TReply | null;
  setReply: SetState<TReply | null>;
  conversationData: ConversationData;
};

function ChatContent({ reply, setReply, conversationData }: Props) {
  const [count, setCount] = useState(1);
  const user = useContext(AuthContext) as firebaseUser;
  const params = useParams();
  const conversationID = params.conversationID as string;
  const collectionRef = collection(db, `Conversations/${conversationID}/Messages`);
  const q = query(collectionRef, orderBy('sentAt', 'desc'), limit(count * 15));
  const [state, loading, error] = useCollection<number>(q, [count]);

  useEffect(() => {
    updateDoc;
    if (!conversationData.seen.includes(user.uid)) {
      const convDocRef = doc(db, 'Conversations', conversationID);
      updateDoc(convDocRef, {
        seen: arrayUnion(user.uid),
      })
        .then((res) => console.log(res))
        .catch(() => console.dir(error));
    }
  }, [conversationData.lastUpdated]);

  const handleEnter = () => {
    setCount((curr) => curr + 1);
  };

  const handleClick = () => {
    setReply(null);
  };

  if (loading) {
    return (
      <div className={styles.content}>
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.content}>
        <p className={styles.infoContent}>❌ Une erreur est survenue</p>
      </div>
    );
  }

  if (state && state.length === 0) {
    return (
      <div className={styles.content}>
        <p className={styles.infoContent}>La conversation est vide.</p>
      </div>
    );
  }

  return (
    <div className={styles.content}>
      <div className={styles.view}>
        {state?.map((doc, index) => {
          const messageData = doc.data() as MessageData;
          let comeFromMe = messageData.userID === user.uid;
          let nextMessage = null;
          let prevMessage = null;
          let haveToAddAvatar = false;
          let haveToAddName = false;
          let haveToAddSpace = false;

          if (conversationData.participants.length >= 3) {
            nextMessage =
              index < state.length - 1 ? (state[index + 1].data() as MessageData) : null;
            prevMessage = index > 0 ? (state[index - 1].data() as MessageData) : null;

            if (index === 0 && !comeFromMe) {
              haveToAddAvatar = true;
            } else if (!comeFromMe && messageData.userID !== prevMessage?.userID) {
              haveToAddAvatar = true;
            } else if (!comeFromMe && messageData.userID === prevMessage?.userID) {
              haveToAddSpace = true;
            }

            if (!comeFromMe && nextMessage?.userID !== messageData.userID) {
              haveToAddName = true;
            }
          }

          return (
            <Message
              key={messageData.messageID}
              messageData={messageData}
              comeFromMe={comeFromMe}
              haveToAddAvatar={haveToAddAvatar}
              haveToAddSpace={haveToAddSpace}
              haveToAddName={haveToAddName}
              setReply={setReply}
            />
          );
        })}
        {state?.length === count * 15 && <Waypoint onEnter={handleEnter} topOffset={-1} />}
      </div>
      {reply && (
        <div className={styles.reply}>
          <button onClick={handleClick}>
            <IoCloseOutline />
          </button>
          <p>
            <GoReply /> Réponse à
          </p>
          <p>
            {reply.type !== 'text'
              ? 'Pièce jointe'
              : reply && reply.content.length > 30
              ? reply.content.slice(0, 30) + '...'
              : reply?.content}
          </p>
        </div>
      )}
    </div>
  );
}

export default ChatContent;
