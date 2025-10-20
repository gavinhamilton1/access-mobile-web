import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

// Register service worker for PWA functionality
// DISABLED FOR TESTING - Uncomment when ready for production
/*
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('SW registered: ', registration);
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}
*/

// Unregister any existing service workers for testing
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    for (let registration of registrations) {
      console.log('Unregistering service worker:', registration);
      registration.unregister();
    }
  });
}

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);