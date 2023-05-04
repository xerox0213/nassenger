import { useContext, useState } from 'react';
import { AuthContext } from '@context/AuthContext';
import { Navigate } from 'react-router-dom';
import styles from './Home.module.css';
import Sidebar from '@components/Sidebar/components/Sidebar/Sidebar';
import Modal from '@components/Modal/components/Modal/Modal';
import { Outlet } from 'react-router-dom';

function Home() {
  const [openModal, setOpenModal] = useState(false);
  const user = useContext(AuthContext);

  if (user) {
    return (
      <div className={styles.home}>
        {openModal && <Modal setOpenModal={setOpenModal} />}
        <Sidebar setOpenModal={setOpenModal} />
        <Outlet />
      </div>
    );
  } else {
    return <Navigate to='/sign-in' />;
  }
}

export default Home;
