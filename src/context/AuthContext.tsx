import { createContext, ReactNode } from 'react';
import { auth } from '@services/configuration/firebase-config';
import { useAuthState } from 'react-firebase-hooks/auth';
import { firebaseUser } from '@services/types/types';

type Context = firebaseUser | null | undefined;

type Props = {
  children: ReactNode;
};

export const AuthContext = createContext<Context>(null);

function AuthContextProvider({ children }: Props) {
  const [user, loading] = useAuthState(auth);

  return <AuthContext.Provider value={user}>{!loading && children}</AuthContext.Provider>;
}

export default AuthContextProvider;
