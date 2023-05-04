import { ReactNode, createContext, useEffect, useState } from 'react';
import { useContext } from 'react';
import { ToastContext } from './ToastContext';

export const WindowContext = createContext(window.innerWidth <= 850);

type Props = {
  children: ReactNode;
};

function WindowContextProvider({ children }: Props) {
  const [state, setState] = useState(window.innerWidth <= 850);
  const addNotification = useContext(ToastContext);
  useEffect(() => {
    window.addEventListener('resize', resize);
    function resize() {
      setState(window.innerWidth <= 850);
    }

    window.addEventListener('online', online);
    function online() {
      if (addNotification) addNotification('✔️ Vous êtes connecté à internet');
    }

    window.addEventListener('offline', offline);
    function offline() {
      if (addNotification) addNotification("❌ Vous n'êtes pas connecté à internet");
    }

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('online', online);
      window.removeEventListener('offline', offline);
    };
  }, []);

  return <WindowContext.Provider value={state}>{children}</WindowContext.Provider>;
}

export default WindowContextProvider;
