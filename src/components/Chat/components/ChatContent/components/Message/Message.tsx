import styles from './Message.module.css';
import { MessageData, SetState } from '@services/types/types';
import { TReply } from '@pages/[id]/[id]';
import Vocal from './Vocal/Vocal';
import { doc } from 'firebase/firestore';
import { db, storage } from '@services/configuration/firebase-config';
import useDocument from '@hooks/useDocument';
import { useParams } from 'react-router-dom';
import { GoReply } from 'react-icons/go';
import { convertDateToString } from '@utils/convertDateToString';
import { IoTrash } from 'react-icons/io5';
import { removeMessage } from '@services/api/removeMessage';
import useUserDocs from '@hooks/useUserDocs';
import Avatar from '@components/Avatar/Avatar';
import { deleteObject, ref } from 'firebase/storage';

type Props = {
  messageData: MessageData;
  comeFromMe: boolean;
  setReply: SetState<TReply | null>;
  haveToAddAvatar: boolean;
  haveToAddSpace: boolean;
  haveToAddName: boolean;
};

function Message({
  messageData,
  comeFromMe,
  setReply,
  haveToAddAvatar,
  haveToAddSpace,
  haveToAddName,
}: Props) {
  const params = useParams();
  const conversationID = params.conversationID as string;
  const { type, reply, sentAt, content, messageID } = messageData;
  const docRef = doc(db, `Conversations/${conversationID}/Messages/${reply}`);
  const [replydata, loadingReply] = useDocument(docRef, []);
  const [userDocs, loadingUser] = useUserDocs([messageData.userID], [messageData.userID]);

  const handleReply = () => {
    setReply({ messageID, content, type });
  };

  const handleDelete = async () => {
    try {
      await removeMessage(`Conversations/${conversationID}/Messages/${messageID}`);
      if (type === 'audio') {
        const audioRef = ref(storage, content);
        await deleteObject(audioRef);
      }
    } catch (error) {
      console.dir(error);
    }
  };

  return (
    <div
      className={`${styles.Message} ${comeFromMe ? styles.msgCameFromMe : styles.msgNotCameFromMe}`}
    >
      {haveToAddName && (
        <p className={styles.name}>{!loadingUser && userDocs && userDocs[0].data()?.displayName}</p>
      )}
      {replydata && (
        <div className={styles.repliedMessage}>
          {haveToAddSpace && <div style={{ width: 35, height: 35 }}></div>}
          {!loadingReply && (
            <>
              <div style={{ width: 35, height: 35 }}></div>
              <a href={`#${replydata.messageID}`}>
                {replydata.type === 'removed'
                  ? 'Message supprimé'
                  : replydata.type === 'text'
                  ? replydata.content.length > 60
                    ? replydata.content.slice(0, 60) + '...'
                    : replydata.content
                  : 'Pièce jointe'}
              </a>
            </>
          )}
        </div>
      )}

      <div className={styles.content}>
        {haveToAddSpace && <div style={{ width: 35, height: 35 }}></div>}
        {haveToAddAvatar && (
          <Avatar width={35} photoURL={userDocs && userDocs[0].data()?.photoURL} />
        )}
        <div
          className={styles.typeOfMsgContainer}
          title={`${convertDateToString(sentAt ? sentAt?.toDate() : new Date(Date.now()))}`}
        >
          {type === 'removed' && (
            <span className={styles.msgRemoved}>Le message a été supprimé</span>
          )}
          {type === 'text' && (
            <span
              className={`${styles.txtMsg} ${comeFromMe ? styles.blueMsg : styles.redMsg}`}
              id={messageID}
            >
              {content}
            </span>
          )}
          {type === 'audio' && <Vocal comeFromMe={comeFromMe} messageData={messageData} />}
        </div>
        {type !== 'removed' && (
          <div className={styles.controls}>
            <button onClick={handleReply}>
              <GoReply />
            </button>
            {comeFromMe && (
              <button onClick={handleDelete}>
                <IoTrash />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Message;
