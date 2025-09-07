import React from 'react';
import { AppController } from './controllers/AppController';
import { AppView } from './views/AppView';

export default function App() {
  const iframeSource = AppController.getIframeSource();
  return <AppView iframeSource={iframeSource} />;
}