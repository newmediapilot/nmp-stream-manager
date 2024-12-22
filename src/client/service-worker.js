const htmlFixture = `<!DOCTYPE html>
<html lang="en">
<head>
    <title>Welcome</title>
    <meta charset="UTF-8">
    <meta name="description" content="This is a description.">
    <meta name="keywords" content="keyword">
    <meta name="viewport" content="width=device-width">
    <meta name="mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black">
    <link rel="manifest" href="./manifest.json?">
    <link rel="icon" href="./icon512_rounded.png?" type="image/png">
</head>
<body>
<script defer>
    document.addEventListener("DOMContentLoaded", () => {
        if (!document.location.hash) return;
        fetch(\`https://192.168.0.${document.location.hash.slice(1)}\`)
            .then(response => {
                if (!response.ok) throw new Error('');
                return response.text();
            }).then(data => {
            document.documentElement.innerHTML = \`${data}\`
        }).catch(error => console.error(error));
    });
</script>
</body>
</html>`

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open('sw-cache').then((cache) => {
            cache.put('/offline.html', new Response(htmlFixture, {
                headers: {'Content-Type': 'text/html'}
            }));
        })
    );
});
self.addEventListener('fetch', (event) => {
    event.respondWith(
        fetch(event.request)
            .then((response) => {
                // If the response is 404, return the custom 404 page from cache
                if (response.status === 404) {
                    return caches.match('/404.html');
                }
                return response;
            })
            .catch(() => {
                // If the network is down or the request fails, serve the cached 404 page
                return caches.match('/offline.html');
            })
    );
});