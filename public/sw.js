// Service Worker for PWA functionality - NO CACHING VERSION
// This service worker provides PWA functionality without caching to avoid testing issues

// Install event - minimal setup
self.addEventListener('install', (event) => {
  console.log('Service Worker installing (no caching)...');
  self.skipWaiting();
});

// Activate event - clear all caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating (clearing all caches)...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          console.log('Deleting cache:', cacheName);
          return caches.delete(cacheName);
        })
      );
    }).then(() => {
      console.log('All caches cleared');
    })
  );
  self.clients.claim();
});

// Fetch event - always fetch fresh, no caching
self.addEventListener('fetch', (event) => {
  // Always fetch from network, never cache
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        console.log('Fresh fetch from network:', event.request.url);
        return response;
      })
      .catch((error) => {
        console.log('Network fetch failed:', event.request.url, error);
        // For navigation requests, return a basic offline page
        if (event.request.mode === 'navigate') {
          return new Response(
            '<html><body><h1>Offline</h1><p>Please check your internet connection.</p></body></html>',
            { headers: { 'Content-Type': 'text/html' } }
          );
        }
        throw error;
      })
  );
});

// Background sync for offline form submissions
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    console.log('Background sync triggered');
    event.waitUntil(
      // Handle offline form submissions here
      handleOfflineSubmissions()
    );
  }
});

// Push notifications
self.addEventListener('push', (event) => {
  console.log('Push message received');
  
  const options = {
    body: event.data ? event.data.text() : 'New notification',
    icon: '/images/icon-192.png',
    badge: '/images/icon-192.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'View',
        icon: '/images/icon-192.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/images/icon-192.png'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('Access Mobile', options)
  );
});

// Handle offline form submissions
async function handleOfflineSubmissions() {
  try {
    // Get stored offline submissions from IndexedDB
    const submissions = await getOfflineSubmissions();
    
    for (const submission of submissions) {
      try {
        // Attempt to sync with server
        const response = await fetch('/api/submit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(submission.data)
        });
        
        if (response.ok) {
          // Remove from offline storage
          await removeOfflineSubmission(submission.id);
          console.log('Offline submission synced:', submission.id);
        }
      } catch (error) {
        console.log('Failed to sync submission:', submission.id, error);
      }
    }
  } catch (error) {
    console.log('Error handling offline submissions:', error);
  }
}

// IndexedDB helpers for offline storage
async function getOfflineSubmissions() {
  // Implementation would depend on your data structure
  return [];
}

async function removeOfflineSubmission(id) {
  // Implementation would depend on your data structure
  console.log('Removing offline submission:', id);
}
