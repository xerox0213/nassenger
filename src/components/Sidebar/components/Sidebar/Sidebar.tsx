import styles from './Sidebar.module.css';
import Menu from '../Menu/Menu';
import ConversationList from '../ConversationList/components/ConversationList/ConversationList';
import { Dispatch, SetStateAction } from 'react';

type Props = {
  setOpenModal: Dispatch<SetStateAction<boolean>>;
};

function Sidebar({ setOpenModal }: Props) {
  return (
    <div className={styles.sidebar}>
      <Menu setOpenModal={setOpenModal} />
      <ConversationList />
    </div>
  );
}

export default Sidebar;
