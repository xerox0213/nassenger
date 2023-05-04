import styles from './Members.module.css';
import Avatar from '@components/Avatar/Avatar';
import { IoEllipsisHorizontal, IoPersonRemoveOutline, IoPersonAddOutline } from 'react-icons/io5';
import { MouseEvent, useContext, useRef } from 'react';
import { AuthContext } from '@context/AuthContext';
import { UserData, firebaseUser } from '@services/types/types';
import {
  DocumentSnapshot,
  DocumentData,
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from 'firebase/firestore';
import { db } from '@services/configuration/firebase-config';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

type Props = {
  userDocs: DocumentSnapshot<DocumentData>[] | null;
  admins: string[] | undefined;
  participants: string[];
  error: boolean;
};

function Members({ userDocs, admins, participants, error }: Props) {
  const navigate = useNavigate();
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

  const handleAddAdmin = async (memberID: string) => {
    const docRef = doc(db, `Conversations/${conversationID}`);
    try {
      await updateDoc(docRef, {
        'groupInfo.admins': arrayUnion(memberID),
      });
    } catch (error) {
      console.dir(error);
    }
  };

  const handleKickMember = async (memberID: string) => {
    const docRef = doc(db, `Conversations/${conversationID}`);
    try {
      await updateDoc(docRef, {
        'groupInfo.admins': arrayUnion(memberID),
        participants: arrayRemove(memberID),
      });
    } catch (error) {}
  };

  const handleLeaveGroup = async () => {
    if (admins && admins.length > 1) {
      const docRef = doc(db, `Conversations/${conversationID}`);
      try {
        await updateDoc(docRef, {
          'groupInfo.admins': arrayRemove(user.uid),
          participants: arrayRemove(user.uid),
        });
        navigate('/');
      } catch (error) {
        console.dir(error);
      }
      console.log('Je quitte le groupe');
    } else {
      console.log("Je dois d'abord définir un admin");
    }
  };

  if (error) {
    return (
      <div className={styles.membersList}>
        <p className={styles.error}>❌ Une erreur est survenue</p>
      </div>
    );
  }

  return (
    <div className={styles.membersList}>
      {userDocs?.map((userDoc) => {
        const userData = userDoc.data() as UserData | undefined;
        return (
          <div key={userDoc.id} className={styles.item}>
            <div className={styles.memberInfo}>
              <Avatar width={40} photoURL={userData?.photoURL} />
              <p>{userData?.displayName}</p>
            </div>

            {(userDoc.id === user.uid || (admins && admins.includes(user.uid))) && (
              <>
                <button ref={addBtnToRef} onClick={handleControls}>
                  <IoEllipsisHorizontal size={25} />
                </button>
                <div className={styles.controls}>
                  {userDoc.id === user.uid && participants.length > 3 && (
                    <button onClick={handleLeaveGroup}>
                      <IoPersonRemoveOutline size={22} />
                      Quitter le groupe
                    </button>
                  )}

                  {admins &&
                    admins.includes(user.uid) &&
                    userDoc.id !== user.uid &&
                    participants.length > 3 && (
                      <button onClick={() => handleKickMember(userDoc.id)}>
                        <IoPersonRemoveOutline size={22} />
                        Retirer du groupe
                      </button>
                    )}

                  {admins &&
                    admins.includes(user.uid) &&
                    userDoc.id !== user.uid &&
                    !admins.includes(userDoc.id) && (
                      <button onClick={() => handleAddAdmin(userDoc.id)}>
                        <IoPersonAddOutline size={22} />
                        Ajouter en admin
                      </button>
                    )}
                </div>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default Members;
