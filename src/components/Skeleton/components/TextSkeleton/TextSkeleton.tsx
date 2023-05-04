import styles from './TextSkeleton.module.css';

type Props = {
  width: number;
  height: number;
};
function TextSkeleton({ width, height }: Props) {
  return <p style={{ width, height }} className={styles.textSkeleton}></p>;
}

export default TextSkeleton;
