import styles from './Sidebar.module.css';
import Menu from '../Menu/Menu';
import ConversationList from '../ConversationList/components/ConversationList/ConversationList';
import { Dispatch, SetStateAction } from 'react';
import { useContext } from 'react';
import { useParams } from 'react-router-dom';
import { WindowContext } from '@context/WindowContext';

type Props = {
  setOpenModal: Dispatch<SetStateAction<boolean>>;
};

function Sidebar({ setOpenModal }: Props) {
  const params = useParams();
  const conversationID = params.conversationID as string;
  const isInSmallScreen = useContext(WindowContext);

  const display = isInSmallScreen && conversationID ? 'none' : 'flex';
  return (
    <div className={styles.sidebar} style={{ display }}>
      <Menu setOpenModal={setOpenModal} />
      <ConversationList />
    </div>
  );
}

export default Sidebar;
