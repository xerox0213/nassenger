import { createContext, useEffect, useState, ReactNode } from 'react';
import firebase, { signInWithPopup, onAuthStateChanged, signOut } from 'firebase/auth';
import { provider, auth, db } from '@services/configuration/firebase-config';
import { doc, setDoc, getDoc } from 'firebase/firestore';

type InitialContext = {
  logIn: () => Promise<void>;
  logOut: () => Promise<void>;
  user: null | firebase.User;
} | null;

export type ConnectedContext = {
  logIn: () => Promise<void>;
  logOut: () => Promise<void>;
  user: firebase.User;
};

type Props = {
  children: ReactNode;
};

export const AuthContext = createContext<InitialContext>(null);

function AuthContextProvider({ children }: Props) {
  const [user, setUser] = useState<null | firebase.User>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }

      setIsLoaded(true);
    });

    return unsub;
  }, []);

  const logIn = async () => {
    try {
      const { user } = await signInWithPopup(auth, provider);
      console.log('Connexion effectué avec succès', user);
      const docRef = doc(db, 'Users', user.uid);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        await setDoc(doc(db, 'Users', user.uid), {
          displayName: user.displayName,
          photoURL: user.photoURL,
          conversationList: [],
        });
      } else {
        console.log('Utilisateur déjà dans la BDD');
      }
    } catch (error) {
      console.dir(error);
    }
  };

  const logOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <AuthContext.Provider value={{ logIn, logOut, user }}>
      {isLoaded && children}
    </AuthContext.Provider>
  );
}

export default AuthContextProvider;
