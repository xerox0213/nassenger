import Avatar from '@components/Avatar/Avatar';
import { AuthContext, ConnectedContext } from '@context/AuthContext';
import { useContext } from 'react';
import styles from './ConversationItem.module.css';

function ConversationItem() {
  const context = useContext(AuthContext) as ConnectedContext;
  return (
    <li className={styles.conversationItem}>
      <Avatar width={55} photoURL={context.user.photoURL} />
      <div>
        <p>Nasreddine Boutouil</p>
        <p>Salut tu vas bien </p>
      </div>
    </li>
  );
}

export default ConversationItem;
