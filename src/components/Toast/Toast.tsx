import { useEffect, useState } from 'react';
import { SetState } from '@services/types/types';

type Notification = { message: string; id: string };
type Props = {
  notification: Notification;
  setNotifications: SetState<Notification[]>;
};

function Toast({ notification, setNotifications }: Props) {
  const [disappear, setDisappear] = useState(false);
  useEffect(() => {
    const disappearTimeout = setTimeout(() => {
      setDisappear(true);
    }, 4000);

    const unmountTimeout = setTimeout(() => {
      setNotifications((curr) => {
        const copyCurr = [...curr];
        return copyCurr.filter((elem) => elem.id !== notification.id);
      });
    }, 4200);

    return () => {
      clearTimeout(disappearTimeout);
      clearTimeout(unmountTimeout);
    };
  }, []);
  return (
    <div className={`toast ${disappear ? 'disappear' : null}`}>
      <p>{notification.message}</p>
      <div className='timer'></div>
    </div>
  );
}

export default Toast;
