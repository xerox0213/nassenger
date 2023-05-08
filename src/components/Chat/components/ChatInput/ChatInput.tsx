import { FormEvent, useContext, useRef, useState } from 'react';
import styles from './ChatInput.module.css';
import { sendMessage } from '@services/api/sendMessage';
import { useParams } from 'react-router-dom';
import { AuthContext } from '@context/AuthContext';
import { SetState, firebaseUser } from '@services/types/types';
import { IoSend, IoCloseCircle, IoMic, IoHappy } from 'react-icons/io5';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { updateDoc, doc } from 'firebase/firestore';
import { db } from '@services/configuration/firebase-config';
import { TReply } from '@pages/[id]/[id]';
import Recorder from '@components/Recorder/Recorder';
import AudioPlayer from '@components/AudioPlayer/AudioPlayer';
import { useReactMediaRecorder } from 'react-media-recorder';
import addFile from '@services/api/addFile';

type Props = {
  reply: TReply | null;
  setReply: SetState<TReply | null>;
};

function ChatInput({ reply, setReply }: Props) {
  const [emojiPickerShown, setEmojiPickerShown] = useState(false);
  const ref = useRef<HTMLInputElement>(null);
  const params = useParams();
  const conversationID = params.conversationID as string;
  const user = useContext(AuthContext) as firebaseUser;
  const { status, startRecording, stopRecording, mediaBlobUrl, clearBlobUrl } =
    useReactMediaRecorder({
      audio: true,
    });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const input = ref.current as HTMLInputElement;
    const text = input.value;
    if (text || mediaBlobUrl) {
      form.reset();
      try {
        if (mediaBlobUrl) {
          const audioBlob = await fetch(mediaBlobUrl).then((r) => r.blob());
          const filePath = (await addFile(audioBlob)) as string;
          clearBlobUrl();
          await sendMessage('audio', conversationID, filePath, user.uid, reply);
        } else {
          setReply(null);
          await sendMessage('text', conversationID, text, user.uid, reply);
        }
      } catch (error) {
        console.dir(error);
      }
    }
  };

  const handleClick = () => {
    setEmojiPickerShown(!emojiPickerShown);
  };

  const handleSelectEmoji = (emoji: any) => {
    const input = ref.current;
    if (input) {
      input.value += emoji.native;
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit}>
        {status === 'recording' && <Recorder stopRecording={stopRecording} />}
        {status === 'stopped' && mediaBlobUrl && (
          <>
            <button type='button' onClick={clearBlobUrl}>
              <IoCloseCircle size={25} />
            </button>
            <AudioPlayer width='100%' backgroundColor={'#674be0'} blobURL={mediaBlobUrl} />
          </>
        )}
        <input
          style={{ display: status === 'recording' || status === 'stopped' ? 'none' : 'block' }}
          ref={ref}
          placeholder='Message...'
          type='text'
        />
        {status === 'idle' && (
          <>
            <button onClick={startRecording} type='button'>
              <IoMic size={25} />
            </button>
            <button type='button' onClick={handleClick}>
              <IoHappy size={25} />
            </button>
          </>
        )}
        {emojiPickerShown && (
          <div className={styles.emoji} style={{ position: 'absolute' }}>
            <Picker data={data} onEmojiSelect={handleSelectEmoji} locale='fr' />
          </div>
        )}

        {(status === 'idle' || status === 'stopped') && (
          <button>
            <IoSend size={25} />
          </button>
        )}
      </form>
    </div>
  );
}

export default ChatInput;
