// Function to build the success page after Twitch login
function publicTwitchSuccess() {
    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Twitch Login Success</title>
        </head>
        <body>
            <h1>Twitch Login Success</h1>
            <p>This window will close automatically...</p>
            <script>
                // Automatically close the window after a short delay
                setTimeout(function() {
                    window.close();
                }, 3000); // Adjust the time (3000ms = 3 seconds) as needed
            </script>
        </body>
        </html>
    `;
}

module.exports = { publicTwitchSuccess };
