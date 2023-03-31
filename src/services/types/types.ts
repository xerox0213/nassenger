import { Dispatch, SetStateAction } from 'react';

export type User = {
  displayName: string;
  photoURL: string;
  conversationList: string[];
};

export type Conversation = {
  messageList: Message[];
  usersID: string[];
  tag: string;
};

export type Message = {
  text: string;
  messageID: string;
  userID: string;
  timestamp: number;
};

export type SetState<T> = Dispatch<SetStateAction<T>>;
