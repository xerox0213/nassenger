import styles from './Avatar.module.css';

type Props = {
  width: number;
  photoURL: string | null;
};

function Avatar({ width, photoURL }: Props) {
  return (
    <img
      className={styles.avatar}
      style={{ width }}
      src={photoURL ? photoURL : ''}
      alt='Photo de profil'
    />
  );
}

export default Avatar;
