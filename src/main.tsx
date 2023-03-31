import React from 'react';
import ReactDOM from 'react-dom/client';
import Layout from './Layout';
import './global.css';
import AuthContextProvider from '@context/AuthContext';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <AuthContextProvider>
    <Layout />
  </AuthContextProvider>
);
