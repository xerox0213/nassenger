import React from 'react';
import ReactDOM from 'react-dom/client';
import Layout from './Layout';
import './global.css';
import AuthContextProvider from '@context/AuthContext';
import ToastContextProvider from '@context/ToastContext';
import WindowContextProvider from '@context/WindowContext';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <ToastContextProvider>
    <AuthContextProvider>
      <WindowContextProvider>
        <Layout />
      </WindowContextProvider>
    </AuthContextProvider>
  </ToastContextProvider>
);
