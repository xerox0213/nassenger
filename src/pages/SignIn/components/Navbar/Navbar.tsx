import styles from './Navbar.module.css';
import { Link } from 'react-router-dom';
import { IoChatboxEllipsesOutline, IoLogoGithub } from 'react-icons/io5';

function Navbar() {
  return (
    <nav className={styles.navbar}>
      <Link to='/sign-in'>
        <IoChatboxEllipsesOutline />
        Nassenger
      </Link>
      <Link to='https://github.com/xerox0213'>
        <IoLogoGithub />
        Mon Github
      </Link>
    </nav>
  );
}

export default Navbar;
