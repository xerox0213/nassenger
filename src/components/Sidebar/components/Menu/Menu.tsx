import styles from './Menu.module.css';
import { Link } from 'react-router-dom';
import {
  IoChatboxEllipsesOutline,
  IoLogOutOutline,
  IoCreateOutline,
  IoGridOutline,
} from 'react-icons/io5';
import Avatar from '@components/Avatar/Avatar';
import { AuthContext } from '@context/AuthContext';
import { useContext, Dispatch, SetStateAction } from 'react';
import { firebaseUser } from '@services/types/types';
import { auth } from '@services/configuration/firebase-config';
import { useSignOut } from 'react-firebase-hooks/auth';

type Props = {
  setOpenModal: Dispatch<SetStateAction<boolean>>;
};

function Menu({ setOpenModal }: Props) {
  const [signOut, loading, error] = useSignOut(auth);
  const user = useContext(AuthContext) as firebaseUser;
  const openModal = () => setOpenModal(true);

  return (
    <div className={styles.menu}>
      <div>
        <Link to='/'>
          <IoChatboxEllipsesOutline /> Nassenger
        </Link>
      </div>
      <div>
        <button onClick={openModal}>
          <IoCreateOutline />
        </button>
        <button
          onClick={() => {
            signOut();
          }}
        >
          <IoLogOutOutline />
        </button>
        <Avatar width={35} photoURL={user.photoURL} />
      </div>
    </div>
  );
}

export default Menu;
