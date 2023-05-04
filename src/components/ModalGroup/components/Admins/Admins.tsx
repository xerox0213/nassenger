import { UserData } from '@services/types/types';
import styles from './Admins.module.css';
import { DocumentSnapshot, DocumentData, doc, updateDoc, arrayRemove } from 'firebase/firestore';
import Avatar from '@components/Avatar/Avatar';
import { IoEllipsisHorizontal, IoPersonRemoveOutline } from 'react-icons/io5';
import { useContext, useRef, MouseEvent } from 'react';
import { AuthContext } from '@context/AuthContext';
import { firebaseUser } from '@services/types/types';
import { db } from '@services/configuration/firebase-config';
import { useParams } from 'react-router-dom';

type Props = {
  userDocs: DocumentSnapshot<DocumentData>[] | null;
  admins: string[] | undefined;
  error: boolean;
};

function Admins({ userDocs, admins, error }: Props) {
  const params = useParams();
  const conversationID = params.conversationID as string;
  const user = useContext(AuthContext) as firebaseUser;
  const refBtns = useRef<HTMLButtonElement[]>([]);

  const handleControls = (e: MouseEvent) => {
    const btnToAddActive = e.currentTarget as HTMLButtonElement;
    const btnToRemoveActive = refBtns.current.find((btn) => btn.classList.contains(styles.active));
    if (btnToAddActive === btnToRemoveActive) {
      btnToAddActive.classList.remove(styles.active);
    } else {
      btnToAddActive.classList.add(styles.active);
      btnToRemoveActive?.classList.remove(styles.active);
    }
  };

  const addBtnToRef = (btn: HTMLButtonElement) => {
    if (btn && !refBtns.current.includes(btn)) {
      refBtns.current.push(btn);
    }
  };

  const handleRemoveAdmin = async (memberID: string) => {
    const docRef = doc(db, `Conversations/${conversationID}`);
    try {
      await updateDoc(docRef, {
        'groupInfo.admins': arrayRemove(memberID),
      });
    } catch (error) {
      console.dir(error);
    }
  };

  if (error) {
    return (
      <div className={styles.adminsList}>
        <p className={styles.error}>❌ Une erreur est survenue</p>
      </div>
    );
  }

  return (
    <div className={styles.adminsList}>
      {admins &&
        admins.map((adminID) => {
          const adminDoc = userDocs?.find((userDoc) => userDoc.id === adminID);
          const adminData = adminDoc?.data() as UserData | undefined;
          return (
            <div key={adminID} className={styles.item}>
              <div className={styles.userInfo}>
                <Avatar width={40} photoURL={adminData?.photoURL} />
                <p>{adminData?.displayName}</p>
              </div>
              {admins.includes(user.uid) && adminID !== user.uid && (
                <>
                  <button ref={addBtnToRef} onClick={handleControls}>
                    <IoEllipsisHorizontal size={25} />
                  </button>
                  <div className={styles.controls}>
                    <button onClick={() => handleRemoveAdmin(adminID)}>
                      <IoPersonRemoveOutline size={22} />
                      Retirer l'admin
                    </button>
                  </div>
                </>
              )}
            </div>
          );
        })}
    </div>
  );
}

export default Admins;
