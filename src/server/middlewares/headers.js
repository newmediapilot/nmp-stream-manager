const headers = (res, path) => {
    if (
        path.includes('.css')
    ) {
        res.set('Content-Type', 'text/css');
    } else if (
        path.endsWith('.js')
    ) {
        res.set('Content-Type', 'application/javascript');
    } else if (
        path.endsWith('.jpg') ||
        path.endsWith('.jpeg')
    ) {
        res.set('Content-Type', 'image/jpeg');
    } else if (path.endsWith('.png')) {
        res.set('Content-Type', 'image/png');
    } else if (path.endsWith('.gif')) {
        res.set('Content-Type', 'image/gif');
    } else if (path.endsWith('.webp')) {
        res.set('Content-Type', 'image/webp');
    } else if (path.endsWith('.svg')) {
        res.set('Content-Type', 'image/svg+xml');
    } else if (path.endsWith('.bmp')) {
        res.set('Content-Type', 'image/bmp');
    } else if (path.endsWith('.ico')) {
        res.set('Content-Type', 'image/x-icon');
    } else if (path.endsWith('.mp3')) {
        res.set('Content-Type', 'audio/mpeg');
    } else if (path.endsWith('.ogg')) {
        res.set('Content-Type', 'audio/ogg');
    } else if (path.endsWith('.wav')) {
        res.set('Content-Type', 'audio/wav');
    } else if (path.endsWith('.m4a')) {
        res.set('Content-Type', 'audio/mp4');
    } else if (path.endsWith('.mp4')) {
        res.set('Content-Type', 'video/mp4');
    } else if (path.endsWith('.webm')) {
        res.set('Content-Type', 'video/webm');
    } else if (path.endsWith('.ogg')) {
        res.set('Content-Type', 'video/ogg');
    }
}