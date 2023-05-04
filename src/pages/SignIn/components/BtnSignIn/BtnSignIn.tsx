import { IoLogoGoogle } from 'react-icons/io5';
import styles from './BtnSignIn.module.css';
import { auth, db } from '@services/configuration/firebase-config';
import { useSignInWithGoogle } from 'react-firebase-hooks/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { useContext } from 'react';
import { ToastContext } from '@context/ToastContext';

function BtnSignIn() {
  const addNotification = useContext(ToastContext);
  const [signInWithGoogle, , loading, error] = useSignInWithGoogle(auth);
  const signIn = async () => {
    try {
      const credentials = await signInWithGoogle();
      if (!credentials) {
        throw new Error('Aucun utilisateur');
      }
      if (credentials && credentials.user) {
        const docRef = doc(db, 'Users', credentials.user.uid);
        const docSnap = await getDoc(docRef);
        if (!docSnap.exists()) {
          await setDoc(doc(db, 'Users', credentials.user.uid), {
            displayName: credentials.user.displayName,
            photoURL: credentials.user.photoURL,
            conversationList: [],
          });
        }
      }
    } catch (error) {
      if (addNotification) addNotification("❌ Une erreur s'est produite");
    }
  };

  return (
    <button onClick={signIn} className={loading ? `${styles.btn} disabled` : styles.btn}>
      <IoLogoGoogle />
      S'identifier
    </button>
  );
}

export default BtnSignIn;
