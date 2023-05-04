import AudioPlayer from '@components/AudioPlayer/AudioPlayer';
import { useEffect, useState } from 'react';
import { getDownloadURL, ref } from 'firebase/storage';
import { storage } from '@services/configuration/firebase-config';
import { MessageData } from '@services/types/types';

type Props = {
  messageData: MessageData;
  comeFromMe: boolean;
};

function Vocal({ messageData, comeFromMe }: Props) {
  const [URL, setURL] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const { content: path } = messageData;

  useEffect(() => {
    const audioRef = ref(storage, path);
    getDownloadURL(audioRef)
      .then((url) => {
        setURL(url);
        setError(false);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  return (
    <AudioPlayer
      loading={loading}
      error={error}
      backgroundColor={comeFromMe ? '#674be0' : 'crimson'}
      width={250}
      blobURL={URL}
    />
  );
}

export default Vocal;
