import Avatar from '@components/Avatar/Avatar';
import styles from './ConversationItem.module.css';
import { ConversationData, UserData, firebaseUser } from '@services/types/types';
import { doc, collection, query, limit, orderBy, updateDoc } from 'firebase/firestore';
import { db } from '@services/configuration/firebase-config';
import { useContext, useEffect } from 'react';
import { AuthContext } from '@context/AuthContext';
import { NavLink, useParams } from 'react-router-dom';
import useLastMessage from '@hooks/useLastMessage';
import { convertLastUpdatedToString } from '@utils/convertLastUpdatedToString';
import AvatarSkeleton from '@components/Skeleton/components/AvatarSkeleton/AvatarSkeleton';
import TextSkeleton from '@components/Skeleton/components/TextSkeleton/TextSkeleton';
import AvatarGroup from '@components/AvatarGroup/AvatarGroup';
import useUserDocs from '@hooks/useUserDocs';

type Props = {
  conversationID: string;
  data: ConversationData;
};

function ConversationItem({ data, conversationID }: Props) {
  const user = useContext(AuthContext) as firebaseUser;
  const collectionRef = collection(db, `Conversations/${conversationID}/Messages`);
  const q = query(collectionRef, orderBy('sentAt', 'desc'), limit(1));
  const [userDocs, loadingUserData, errorUserData] = useUserDocs(data.participants, conversationID);
  const [lastMsgData, loadingLastMsgData, errorLastMsgData] = useLastMessage(q);
  const { conversationID: slug } = useParams();
  const filteredUserDocs = userDocs?.filter((userDoc) => userDoc.id !== user.uid);

  const notSeen =
    !data.seen &&
    (!slug || slug !== conversationID) &&
    lastMsgData &&
    lastMsgData.userID !== user.uid;

  useEffect(() => {
    if (
      slug &&
      slug === conversationID &&
      data.seen === false &&
      lastMsgData &&
      lastMsgData.userID !== user.uid
    ) {
      const convDocRef = doc(db, 'Conversations', conversationID);
      updateDoc(convDocRef, {
        seen: true,
      })
        .then((res) => console.log('UPDATE'))
        .catch((error) => console.dir(error));
    }
  }, [data.lastUpdated]);

  const handleClick = async () => {
    if (!data.seen && lastMsgData && lastMsgData.userID !== user.uid) {
      try {
        const convDocRef = doc(db, 'Conversations', conversationID);
        await updateDoc(convDocRef, {
          seen: true,
        });
      } catch (error) {
        console.dir(error);
      }
    }
  };

  if (errorUserData || errorLastMsgData) {
    return (
      <NavLink to='/' style={{ pointerEvents: 'none' }}>
        <AvatarSkeleton width={55} height={55} />
        <TextSkeleton width={150} height={12} />
        <TextSkeleton width={100} height={12} />
      </NavLink>
    );
  }

  return (
    <NavLink
      onClick={handleClick}
      to={conversationID}
      className={({ isActive }) => {
        return isActive
          ? `${styles.activeLink} ${styles.conversationItem}`
          : styles.conversationItem;
      }}
    >
      {loadingUserData ? (
        <AvatarSkeleton width={55} height={55} />
      ) : filteredUserDocs ? (
        filteredUserDocs.length > 1 ? (
          <AvatarGroup
            width={55}
            photoURL={filteredUserDocs?.slice(0, 2).map((userDoc) => {
              const data = userDoc.data() as UserData | undefined;
              return data?.photoURL;
            })}
          />
        ) : (
          <Avatar width={55} photoURL={filteredUserDocs[0]?.data()?.photoURL} />
        )
      ) : null}
      <div>
        {loadingUserData ? (
          <TextSkeleton width={150} height={12} />
        ) : (
          filteredUserDocs && (
            <p>
              {filteredUserDocs.length > 1
                ? filteredUserDocs
                    .slice(0, 3)
                    .reduce((a, v, index) => {
                      if (index === 0) {
                        return a + v?.data()?.displayName;
                      } else {
                        return a + ', ' + v?.data()?.displayName;
                      }
                    }, '')
                    .slice(0, 27) + '...'
                : filteredUserDocs[0]?.data()?.displayName}
            </p>
          )
        )}

        {loadingLastMsgData ? (
          <TextSkeleton width={100} height={12} />
        ) : lastMsgData ? (
          lastMsgData.type === 'text' ? (
            lastMsgData.content.length < 30 ? (
              <p>
                {`${lastMsgData.content} • ${convertLastUpdatedToString(
                  data.lastUpdated ? data.lastUpdated.toDate() : new Date(Date.now())
                )}`}
              </p>
            ) : (
              <p>
                {`${lastMsgData.content.slice(0, 20)}... • ${convertLastUpdatedToString(
                  data.lastUpdated ? data.lastUpdated.toDate() : new Date(Date.now())
                )}`}
              </p>
            )
          ) : (
            <p>{`Pièce jointe • ${convertLastUpdatedToString(
              data.lastUpdated ? data.lastUpdated.toDate() : new Date(Date.now())
            )}`}</p>
          )
        ) : (
          <p>Aucun message</p>
        )}
      </div>
      {notSeen && <div className={styles.stickerNotif}></div>}
    </NavLink>
  );
}

export default ConversationItem;
