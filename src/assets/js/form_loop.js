async function form_loop({event, ctx}) {
    event.preventDefault(); // Prevent default action

    // Extract data-onclick-* attributes
    const attributes = Array.from(ctx.attributes);
    const dataAttributes = attributes
        .filter(attr => attr.name.startsWith('data-onclick-'))
        .reduce((acc, attr) => {
            const key = attr.name.replace('data-onclick-', '');
            acc[key] = attr.value;
            return acc;
        }, {});

    const command = dataAttributes.command;
    const decorator = dataAttributes.decorator;

    // Use the decorator element if it exists, otherwise fallback to ctx
    const decoratorEl = document.querySelector(decorator) || ctx;

    // Remove both classes when the AJAX call starts
    decoratorEl.classList.remove('warn', 'error');

    try {
        // Send a POST request to the command URL
        const response = await fetch(command, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({}),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        console.log('result', result);

        // Add class based on the AJAX response
        if (result.success) {
            console.log(`Command successful: ${result.message}`);
        } else {
            decoratorEl.classList.add('warn');
            console.log(`Command failed: ${result.message}`);
        }
    } catch (error) {
        // Handle errors and append error class
        decoratorEl.classList.add('error');
        console.error('Error sending command:', error);
    }
}