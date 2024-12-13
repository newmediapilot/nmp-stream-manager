const initServiceWorker = () => {
    if ('serviceWorker' in navigator) {
        // Register the service worker
        navigator.serviceWorker.register('/service-worker.js').then(() => {
            console.log('Service Worker registered');
        }).catch((error) => {
            console.error('Service Worker registration failed:', error);
        });
    }

    // Check if the user is online or offline
    if (!navigator.onLine) {
        alert('No internet connection detected');
    }

    // Listen for online and offline events
    window.addEventListener('offline', () => {
        alert('You are offline');
    });

    window.addEventListener('online', () => {
        alert('You are back online');
    });
};
