import styles from './Modal.module.css';
import { IoCloseOutline } from 'react-icons/io5';
import { useState, useContext } from 'react';
import ModalItem from '../ModalItem/ModalItem';
import { AuthContext } from '@context/AuthContext';
import { SetState, UserData, firebaseUser } from '@services/types/types';
import { db } from '@services/configuration/firebase-config';
import { collection } from 'firebase/firestore';
import Loader from '@components/Loader/Loader';
import { startConversation } from '@services/api/startConversation';
import { useNavigate } from 'react-router-dom';
import useCollection from '@hooks/useCollection';

type Props = {
  setOpenModal: SetState<boolean>;
};

function Modal({ setOpenModal }: Props) {
  const navigate = useNavigate();
  const [value, loading, error] = useCollection(collection(db, 'Users'));
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const user = useContext(AuthContext) as firebaseUser;
  const closeModal = () => setOpenModal(false);

  const handleClick = async () => {
    try {
      const res = await startConversation(user.uid, selectedUsers);
      if (res === 'Conversation existe déjà') {
        navigate('/');
      }
    } catch (error: any) {
      // Exécute un contexte pour afficher l'erreur
      console.log(error);
      if (error.message === 'Conversation existe déjà') {
        navigate(`/${error.id}`);
      }
    } finally {
      closeModal();
    }
  };

  if (error) {
    return (
      <div className={styles.modal}>
        <div onClick={closeModal} className={styles.background}></div>
        <div className={styles.content}>
          <div className={styles.header}>
            <button onClick={closeModal}>
              <IoCloseOutline />
            </button>
            <h1>Nouvelle conversation</h1>
          </div>
          <div className={styles.listUsers}>
            <p>❌ Une erreur est survenue</p>
          </div>
          <div className={styles.footer}>
            <button
              onClick={handleClick}
              className={selectedUsers.length === 0 ? 'disabled' : undefined}
            >
              Lancer une conversation
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.modal}>
      <div onClick={closeModal} className={styles.background}></div>
      <div className={styles.content}>
        <div className={styles.header}>
          <button onClick={closeModal}>
            <IoCloseOutline />
          </button>
          <h1>Nouvelle conversation</h1>
        </div>
        <div className={styles.listUsers}>
          {loading ? (
            <Loader />
          ) : (
            value &&
            value
              .filter((doc) => doc.id !== user.uid)
              .map((doc) => {
                const data = doc.data() as UserData;
                return (
                  <ModalItem
                    key={doc.id}
                    id={doc.id}
                    setSelectedUsers={setSelectedUsers}
                    user={data}
                  />
                );
              })
          )}
        </div>
        <div className={styles.footer}>
          <button
            onClick={handleClick}
            className={selectedUsers.length === 0 ? 'disabled' : undefined}
          >
            Lancer une conversation
          </button>
        </div>
      </div>
    </div>
  );
}

export default Modal;
