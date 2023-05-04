import styles from './AvatarSkeleton.module.css';

type Props = {
  width: number;
  height: number;
};

function AvatarSkeleton({ width, height }: Props) {
  return <div style={{ width, height }} className={styles.avatarSkeleton}></div>;
}

export default AvatarSkeleton;
