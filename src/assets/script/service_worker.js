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
    const noInternetMessage = document.createElement('p');
    noInternetMessage.id = 'no-internet-message';
    noInternetMessage.style.position = 'fixed';
    noInternetMessage.style.top = '0';
    noInternetMessage.style.left = '0';
    noInternetMessage.style.right = '0';
    noInternetMessage.style.backgroundColor = 'red';
    noInternetMessage.style.color = 'white';
    noInternetMessage.style.textAlign = 'center';
    noInternetMessage.style.padding = '10px';
    noInternetMessage.style.fontSize = '18px';

    if (!navigator.onLine) {
        noInternetMessage.textContent = 'No internet connection';
        document.body.appendChild(noInternetMessage);
    }

    // Listen for online and offline events
    window.addEventListener('offline', () => {
        noInternetMessage.textContent = 'No internet connection';
        document.body.appendChild(noInternetMessage);
    });

    window.addEventListener('online', () => {
        const message = document.getElementById('no-internet-message');
        if (message) {
            message.remove();
        }
    });
};