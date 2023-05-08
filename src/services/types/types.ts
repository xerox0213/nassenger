import { Dispatch, SetStateAction } from 'react';
import firebase from 'firebase/auth';
import { Timestamp } from 'firebase/firestore';

export type firebaseUser = firebase.User;

export type UserData = {
  displayName: string;
  photoURL: string;
};

export type ConversationData = {
  tag: string;
  participants: string[];
  lastUpdated: Timestamp | undefined;
  seen: string[];
  groupInfo: { admins: string[] } | null;
};

export type MessageData = {
  type: string;
  content: string;
  userID: string;
  sentAt?: Timestamp | undefined;
  messageID: string;
  reply: string | null;
};

export type SetState<T> = Dispatch<SetStateAction<T>>;
