import { IoLogoGoogle } from 'react-icons/io5';
import styles from './BtnSignIn.module.css';
import { useContext, useState } from 'react';
import { AuthContext } from '@context/AuthContext';

function BtnSignIn() {
  const [isDisabled, setIsDisabled] = useState(false);
  const context = useContext(AuthContext);

  return (
    <button onClick={context?.logIn} className={styles.btn}>
      <IoLogoGoogle />
      S'identifier
    </button>
  );
}

export default BtnSignIn;
