import styles from './ConversationList.module.css';
import ConversationItem from '../ConversationItem/ConversationItem';
import { useEffect, useContext } from 'react';
import { AuthContext, ConnectedContext } from '@context/AuthContext';

function ConversationList() {
  const context = useContext(AuthContext) as ConnectedContext;
  return <ul className={styles.conversationList}></ul>;
}

export default ConversationList;
