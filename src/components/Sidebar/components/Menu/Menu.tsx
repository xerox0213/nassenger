import styles from './Menu.module.css';
import { Link } from 'react-router-dom';
import {
  IoChatboxEllipsesOutline,
  IoLogOutOutline,
  IoCreateOutline,
  IoGridOutline,
} from 'react-icons/io5';
import Avatar from '@components/Avatar/Avatar';
import { AuthContext, ConnectedContext } from '@context/AuthContext';
import { useContext, Dispatch, SetStateAction } from 'react';

type Props = {
  setOpenModal: Dispatch<SetStateAction<boolean>>;
};

function Menu({ setOpenModal }: Props) {
  const context = useContext(AuthContext) as ConnectedContext;
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
        <button onClick={context.logOut}>
          <IoLogOutOutline />
        </button>
        <Avatar width={35} photoURL={context.user.photoURL} />
      </div>
    </div>
  );
}

export default Menu;
