import styles from './ModalGroup.module.css';
import { IoCloseOutline } from 'react-icons/io5';
import { MouseEvent, useState } from 'react';
import { SetState, ConversationData } from '@services/types/types';
import Members from '../Members/Members';
import useUserDocs from '@hooks/useUserDocs';
import Admins from '../Admins/Admins';
import AddMembers from '../AddMembers/AddMembers';

type Props = {
  setIsOpened: SetState<boolean>;
  conversationData: ConversationData;
};

function ModalGroup({ setIsOpened, conversationData }: Props) {
  const [activeTab, setActiveTab] = useState('members');
  const [userDocs, loading, error] = useUserDocs(
    conversationData.participants,
    conversationData.participants
  );
  const handleTabs = (e: MouseEvent) => {
    const btn = e.target as HTMLButtonElement;
    const tabName = btn.dataset.name as string;
    setActiveTab(tabName);
  };

  const handleModal = () => {
    setIsOpened(false);
  };

  if (error) {
    <div className={styles.modal}>
      <div onClick={handleModal} className={styles.background}></div>
      <div className={styles.header}>
        <h1>Group members</h1>
        <button onClick={handleModal}>
          <IoCloseOutline />
        </button>
      </div>
      <div className={styles.navbar}>
        <button
          onClick={handleTabs}
          className={activeTab === 'members' ? styles.active : undefined}
          data-name='members'
        >
          Membres
        </button>
        <button
          onClick={handleTabs}
          className={activeTab === 'admins' ? styles.active : undefined}
          data-name='admins'
        >
          Admins
        </button>
        <button
          onClick={handleTabs}
          className={activeTab === 'addMembers' ? styles.active : undefined}
          data-name='addMembers'
        >
          Add members
        </button>
      </div>

      <div className={styles.error}>Une erreur s'est produite</div>
    </div>;
  }

  const { groupInfo, participants } = conversationData;

  return (
    <div className={styles.modal}>
      <div onClick={handleModal} className={styles.background}></div>
      <div className={styles.content}>
        <div className={styles.header}>
          <h1>Membres du groupe</h1>
          <button onClick={handleModal}>
            <IoCloseOutline />
          </button>
        </div>
        <div className={styles.navbar}>
          <button
            onClick={handleTabs}
            className={activeTab === 'members' ? styles.active : undefined}
            data-name='members'
          >
            Membres
          </button>
          <button
            onClick={handleTabs}
            className={activeTab === 'admins' ? styles.active : undefined}
            data-name='admins'
          >
            Administrateurs
          </button>
          <button
            onClick={handleTabs}
            className={activeTab === 'addMembers' ? styles.active : undefined}
            data-name='addMembers'
          >
            Ajouter un membre
          </button>
        </div>
        {activeTab === 'members' && !loading && (
          <Members
            error={error}
            userDocs={userDocs}
            admins={groupInfo?.admins}
            participants={participants}
          />
        )}
        {activeTab === 'admins' && !loading && (
          <Admins error={error} userDocs={userDocs} admins={groupInfo?.admins} />
        )}
        {activeTab === 'addMembers' && !loading && <AddMembers participants={participants} />}
      </div>
    </div>
  );
}

export default ModalGroup;
