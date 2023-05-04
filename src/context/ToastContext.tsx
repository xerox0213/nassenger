import Toast from '@components/Toast/Toast';
import { createContext, useState, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';

type addNotif = (message: string) => void;

export const ToastContext = createContext<addNotif | null>(null);

type Props = {
  children: ReactNode;
};

type notification = { message: string; id: string };

function ToastContextProvider({ children }: Props) {
  const [notifications, setNotifications] = useState<notification[]>([]);

  const addNotification = (message: string) => {
    const newNotification = { message, id: uuidv4() };
    const newNotifications = [...notifications, newNotification];
    setNotifications(newNotifications);
  };

  return (
    <>
      {notifications.length > 0 && (
        <div className='toastContainer'>
          {notifications.map((notification) => {
            return (
              <Toast
                key={notification.id}
                notification={notification}
                setNotifications={setNotifications}
              />
            );
          })}
        </div>
      )}

      <ToastContext.Provider value={addNotification}>{children}</ToastContext.Provider>
    </>
  );
}

export default ToastContextProvider;
