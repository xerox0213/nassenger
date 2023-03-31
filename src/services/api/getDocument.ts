import { db } from '@services/configuration/firebase-config';
import { collection, getDocs, doc, getDoc, DocumentData } from 'firebase/firestore';

async function getByID(collectionName: string, listDocID: string[]) {
  try {
    const listDocRef = listDocID.map((docID) => doc(db, collectionName, docID));
    const listRequest = listDocRef.map((docRef) => getDoc(docRef));
    const listDocSnap = await Promise.all(listRequest);
    let documentData: DocumentData[] = [];

    listDocSnap.forEach((docSnap) => {
      if (docSnap.exists()) {
        console.log('Données du document', docSnap.data());
        documentData.push(docSnap.data());
      } else {
        console.log('Aucun document existe');
      }
    });

    return documentData;
  } catch (error) {
    console.dir(error);
    return Promise.reject(error);
  }
}

async function getByCollection(collectionName: string, excludedDocID: string | null = null) {
  try {
    const querySnapshot = await getDocs(collection(db, collectionName));
    let documentData: DocumentData[] = [];
    querySnapshot.forEach((doc) => {
      if (!excludedDocID || (excludedDocID && doc.id !== excludedDocID)) {
        documentData.push(doc.data());
      }
    });

    return documentData;
  } catch (error) {
    console.dir(error);
    return Promise.reject(error);
  }
}

export { getByID, getByCollection };
