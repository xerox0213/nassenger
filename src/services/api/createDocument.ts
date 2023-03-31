import { db } from '@services/configuration/firebase-config';
import { doc, setDoc, addDoc, collection } from 'firebase/firestore';
import { User } from '@services/types/types';

async function createWithSpecifiedID(collectionName: 'Users', ID: string, data: User) {
  const docRef = await setDoc(doc(db, collectionName, ID), data);
}

async function createWithGeneratedID(collectionName: 'Conversations', data: User) {
  const docRef = await addDoc(collection(db, collectionName), data);
}

export { createWithSpecifiedID, createWithGeneratedID };
