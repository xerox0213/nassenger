import styles from './AvatarGroup.module.css';

type Props = {
  width: number;
  photoURL: (string | undefined)[];
};

function AvatarGroup({ width, photoURL }: Props) {
  return (
    <div className={styles.AvatarGroup} style={{ width, height: width }}>
      <img
        className={`${styles.img} ${styles.firstImg}`}
        style={{
          width: width / 1.375,
        }}
        src={photoURL[0]}
        alt='Photo de profil'
      />
      <img
        className={`${styles.img} ${styles.secondImg}`}
        style={{
          width: width / 1.375,
        }}
        src={photoURL[1]}
        alt='Photo de profil'
      />
    </div>
  );
}

export default AvatarGroup;
