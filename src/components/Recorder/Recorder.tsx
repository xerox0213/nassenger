import { useEffect, useState } from 'react';
import styles from './Recorder.module.css';
import { IoStopCircle } from 'react-icons/io5';

type Props = {
  stopRecording: () => void;
};

function Recorder({ stopRecording }: Props) {
  const [timeRecording, setTimeRecording] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(stopRecording, 60000);
    const interval = setInterval(() => setTimeRecording((curr) => curr + 1000), 1000);

    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, []);

  function milisToTiming(milis: number) {
    const seconds = Math.floor(milis / 1000);
    return `0 : ${seconds < 10 ? ` 0${seconds}` : seconds}`;
  }

  return (
    <div className={styles.recorder}>
      <button onClick={stopRecording} type='button'>
        <IoStopCircle size={35} />
      </button>
      <div className={styles.timerRecorder}>{milisToTiming(timeRecording)}</div>
    </div>
  );
}

export default Recorder;
