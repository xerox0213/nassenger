import Avatar from '@components/Avatar/Avatar';
import { FormEvent, useState } from 'react';
import styles from './ModalItem.module.css';
import { SetState, UserData } from '@services/types/types';

type Props = {
  id: string;
  user: UserData;
  setSelectedUsers: SetState<string[]>;
};

function ModalItem({ id, setSelectedUsers, user }: Props) {
  const [isChecked, setIsChecked] = useState(false);

  const handleClick = () => {
    addOrRemoveUser();
    setIsChecked((isChecked) => !isChecked);
  };

  const handleChange = (e: FormEvent<HTMLInputElement>) => {
    const input = e.target as HTMLInputElement;
    addOrRemoveUser();
    setIsChecked(input.checked);
  };

  const addOrRemoveUser = () => {
    setSelectedUsers((selectedUsers) => {
      if (!isChecked) {
        const copySelectedUsers = [...selectedUsers];
        copySelectedUsers.push(id);
        return copySelectedUsers;
      } else {
        const copySelectedUsers = [...selectedUsers].filter((user) => user !== id);
        return copySelectedUsers;
      }
    });
  };

  return (
    <div onClick={handleClick} className={styles.modalItem}>
      <input onChange={handleChange} checked={isChecked} type='checkbox' />
      <Avatar width={32} photoURL={user.photoURL} />
      <p>{user.displayName}</p>
    </div>
  );
}

export default ModalItem;
