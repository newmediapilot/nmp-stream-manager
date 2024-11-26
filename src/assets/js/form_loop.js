// npms namespace is required
const nmps = (document.nmps = document.nmps || {});

nmps.form_loop = async function form_loop({ event, ctx }) {
    event.preventDefault()

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

    // Use the decorator element if it exists, otherwise fallback to ctx
    const decoratorEl = ctx.parentElement || ctx;

    // Add loading class and disable button
    decoratorEl.classList.add('loading');
    ctx.disabled = true;

    // Remove warn, error, and success classes at the start
    decoratorEl.classList.remove('warn', 'error', 'success');

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
            decoratorEl.classList.add('success')
        } else {
            decoratorEl.classList.add('warn')
            console.log(`Command failed: ${result.message}`);
        }
    } catch (error) {
        // Handle errors and append error class
        decoratorEl.classList.add('error')
        console.log('Error sending command:', error);
    } finally {
        // Always remove the loading class and re-enable the button
        decoratorEl.classList.remove('loading');
        ctx.disabled = false;
    }
};
