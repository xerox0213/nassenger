import { useRef, useState } from 'react';
import styles from './AudioPlayer.module.css';
import { IoPlayCircle, IoPauseCircle } from 'react-icons/io5';

type Props = {
  blobURL: string;
  width: string | number;
  backgroundColor: string;
  loading?: boolean;
  error?: boolean;
};

function AudioPlayer({ blobURL, width, backgroundColor, loading = false, error = false }: Props) {
  const [isPaused, setIsPaused] = useState(true);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handleEnded = () => setIsPaused(true);

  const handlePlayAndPause = () => {
    const audio = audioRef.current as HTMLAudioElement;
    if (isPaused) {
      audio.play();
      setIsPaused(false);
    } else {
      audio.pause();
      setIsPaused(true);
    }
  };

  const style = { width, backgroundColor };

  if (error) {
    return (
      <div style={style} className={styles.audioPlayer}>
        <audio ref={audioRef} onEnded={handleEnded} src={blobURL} />
        <button type='button'>
          <IoPlayCircle size={35} />
          Une erreur est survenue
        </button>
      </div>
    );
  }

  return (
    <div style={style} className={styles.audioPlayer}>
      <audio ref={audioRef} onEnded={handleEnded} src={blobURL} />
      <button type='button' onClick={handlePlayAndPause}>
        {loading && <div className={styles.loader}></div>}
        {!loading ? isPaused ? <IoPlayCircle size={35} /> : <IoPauseCircle size={35} /> : null}
      </button>
    </div>
  );
}

export default AudioPlayer;
