import styles from './Modal.module.css';
import { IoCloseOutline } from 'react-icons/io5';
import { useState, useEffect, useContext } from 'react';
import ModalItem from '../ModalItem/ModalItem';
import { getByCollection } from '@services/api/getDocument';
import { AuthContext, ConnectedContext } from '@context/AuthContext';
import { SetState, User } from '@services/types/types';

type Props = {
  setOpenModal: SetState<boolean>;
};

function Modal({ setOpenModal }: Props) {
  const [users, setUsers] = useState<User[] | []>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const context = useContext(AuthContext) as ConnectedContext;
  useEffect(() => {
    getByCollection('Users', context.user.uid)
      .then((data) => {
        let users = data as User[] | [];
        setUsers(users);
      })
      .catch((error) => console.dir(error));
  }, []);

  const closeModal = () => setOpenModal(false);
  const startConversation = () => {
    
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
          {users.map((user, index) => (
            <ModalItem key={index} id={`${index}`} setSelectedUsers={setSelectedUsers} user={user} />
          ))}
        </div>
        <div className={styles.footer}>
          <button onClick={startConversation} className={selectedUsers.length === 0 ? styles.disabled : undefined}>
            Lancer une conversation
          </button>
        </div>
      </div>
    </div>
  );
}

export default Modal;
