import useCollection from '@hooks/useCollection';
import styles from './AddMembers.module.css';
import Avatar from '@components/Avatar/Avatar';
import { UserData } from '@services/types/types';
import { IoAdd } from 'react-icons/io5';
import { useParams } from 'react-router-dom';
import { db } from '@services/configuration/firebase-config';
import { updateDoc, doc, arrayUnion, collection } from 'firebase/firestore';

type Props = {
  participants: string[];
};

function AddMembers({ participants }: Props) {
  const params = useParams();
  const conversationID = params.conversationID as string;
  const [allUsers, loading, error] = useCollection(collection(db, 'Users'));
  const handleAddMember = async (memberID: string) => {
    const docRef = doc(db, `Conversations/${conversationID}`);
    try {
      await updateDoc(docRef, {
        participants: arrayUnion(memberID),
      });
    } catch (error) {
      console.dir(error);
    }
  };

  if (error) {
    return (
      <div className={styles.usersList}>
        <p className={styles.error}>❌ Oups, une erreur est survenue</p>
      </div>
    );
  }

  return (
    <div className={styles.usersList}>
      {!loading &&
        allUsers
          ?.filter((userDoc) => !participants.includes(userDoc.id))
          .map((userDoc) => {
            const userData = userDoc.data() as UserData | undefined;
            return (
              <div key={userDoc.id} className={styles.item}>
                <div className={styles.userInfo}>
                  <Avatar width={40} photoURL={userData?.photoURL} />
                  <p>{userData?.displayName}</p>
                </div>
                <button onClick={() => handleAddMember(userDoc.id)}>
                  <IoAdd size={25} />
                </button>
              </div>
            );
          })}
    </div>
  );
}

export default AddMembers;
