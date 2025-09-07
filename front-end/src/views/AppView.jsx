// View for rendering the UI
import React from 'react';

export const AppView = ({ iframeSource }) => (
  <div style={{ height: '100vh', margin: 0 }}>
    <iframe
      src={iframeSource}
      title="My Project"
      style={{ width: '100%', height: '100%', border: 0 }}
    ></iframe>
  </div>
);
