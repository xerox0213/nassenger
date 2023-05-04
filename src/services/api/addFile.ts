import { ref, uploadBytes } from 'firebase/storage';
import { storage } from '@services/configuration/firebase-config';
import { v4 as uuidv4 } from 'uuid';

async function addFile(blob: Blob) {
  const audioRef = ref(storage, `Audio/${uuidv4()}.wav`);
  try {
    const snapshot = await uploadBytes(audioRef, blob);
    return snapshot.metadata.fullPath;
  } catch (error) {
    return Promise.reject(error);
  }
}

export default addFile;
