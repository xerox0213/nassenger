import { useContext, useState } from 'react';
import { AuthContext, ConnectedContext } from '@context/AuthContext';
import { Navigate } from 'react-router-dom';
import styles from './Home.module.css';
import Sidebar from '@components/Sidebar/components/Sidebar/Sidebar';
import Modal from '@components/Modal/components/Modal/Modal';

function Home() {
  const [openModal, setOpenModal] = useState(false);
  const context = useContext(AuthContext) as ConnectedContext;

  if (context?.user) {
    return (
      <div className={styles.home}>
        {openModal && <Modal setOpenModal={setOpenModal} />}
        <Sidebar setOpenModal={setOpenModal} />
      </div>
    );
  } else {
    return <Navigate to='/sign-in' />;
  }
}

export default Home;
