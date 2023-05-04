import styles from './ChatHeader.module.css';
import { ConversationData, SetState } from '@services/types/types';
import { useNavigate, useParams } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '@context/AuthContext';
import { firebaseUser } from '@services/types/types';
import Avatar from '@components/Avatar/Avatar';
import AvatarSkeleton from '@components/Skeleton/components/AvatarSkeleton/AvatarSkeleton';
import TextSkeleton from '@components/Skeleton/components/TextSkeleton/TextSkeleton';
import { IoPeople, IoChevronBack } from 'react-icons/io5';
import AvatarGroup from '@components/AvatarGroup/AvatarGroup';
import useUserDocs from '@hooks/useUserDocs';
import { UserData } from '@services/types/types';
import { WindowContext } from '@context/WindowContext';

type Props = {
  conversationData: ConversationData;
  setIsOpened: SetState<boolean>;
};

function ChatHeader({ conversationData, setIsOpened }: Props) {
  const user = useContext(AuthContext) as firebaseUser;
  const isInSmallScreen = useContext(WindowContext);
  const navigate = useNavigate();
  const [userDocs, loading, error] = useUserDocs(
    conversationData.participants,
    conversationData.participants
  );
  const filteredUserDocs = userDocs?.filter((userDoc) => userDoc.id !== user.uid);

  if (error) {
    return (
      <div className={styles.header}>
        <AvatarSkeleton width={40} height={40} />
        <TextSkeleton width={150} height={12} />
      </div>
    );
  }

  const handleModal = () => {
    setIsOpened(true);
  };

  const handleBackToRoot = () => {
    navigate('/');
  };

  return (
    <div className={styles.header}>
      {isInSmallScreen && (
        <button className={styles.backBtn} onClick={handleBackToRoot}>
          <IoChevronBack size={22.5} />
        </button>
      )}
      {loading ? (
        <AvatarSkeleton width={40} height={40} />
      ) : filteredUserDocs ? (
        filteredUserDocs.length > 1 ? (
          <AvatarGroup
            width={40}
            photoURL={filteredUserDocs?.slice(0, 2).map((userDoc) => {
              const data = userDoc.data() as UserData | undefined;
              return data?.photoURL;
            })}
          />
        ) : (
          <Avatar width={40} photoURL={filteredUserDocs[0]?.data()?.photoURL} />
        )
      ) : null}
      {loading ? (
        <TextSkeleton width={150} height={12} />
      ) : (
        filteredUserDocs && (
          <p className={styles.conversationName}>
            {filteredUserDocs.length > 1
              ? filteredUserDocs.slice(0, 3).reduce((a, v, index) => {
                  if (index === 0) {
                    return a + v?.data()?.displayName;
                  } else {
                    return a + ', ' + v?.data()?.displayName;
                  }
                }, '')
              : filteredUserDocs[0]?.data()?.displayName}
          </p>
        )
      )}
      {conversationData.participants.length > 2 && (
        <button
          onClick={handleModal}
          style={{
            marginLeft: 'auto',
            color: '#674be0',
            cursor: 'pointer',
            background: 'none',
            border: 'none',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <IoPeople size={25} />
        </button>
      )}
    </div>
  );
}

export default ChatHeader;
