
// Contains all functions that help to get and set parameters in the URL

export function getParametersFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);

    const a = ((urlParams.get('a')) / 255).toFixed(2); // Normalize to 0-1 range
    const b = ((urlParams.get('b')) / 255).toFixed(2);
    const c = ((urlParams.get('c')) / 255).toFixed(2);
    const d = ((urlParams.get('d')) / 255).toFixed(2);

    console.log(`Extracted parameters: a: ${a}, b: ${b}, c: ${c}, d: ${d}`);

    return { a, b, c, d };
}

export function setParametersInUrlAndReload() {
        // Generate random values for the parameters (0 to 255, normalized later by /255)
        const randomA = Math.floor(Math.random() * 256); // 0 to 255
        const randomB = Math.floor(Math.random() * 256);
        const randomC = Math.floor(Math.random() * 256);
        const randomD = Math.floor(Math.random() * 256);

        // Construct the new URL with the random parameters
        const newUrl = `${window.location.origin}${window.location.pathname}?a=${randomA}&b=${randomB}&c=${randomC}&d=${randomD}`;

        // Reload the website with the new URL
        window.location.href = newUrl;
}

export function createIdfromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    const a = urlParams.get('a');
    const b = urlParams.get('b');
    const c = urlParams.get('c');
    const d = urlParams.get('d');

    const id = encodeId([a, b, c, d])  + '-' + (a % 80);
    console.log(`Generated ID: ${id}`);
    return id;
}

function encodeId(values) {
    // Converts an array of integers to a base64 string
    const byteArray = new Uint8Array(values);
    const base64String = btoa(String.fromCharCode(...byteArray));
    return base64String.replace(/=+$/, '');  // Remove trailing '=' characters
}

function decodeId(base64) {
    // Converts a base64 string to an array of integers
    const binaryString = atob(base64 + '==');  // Add trailing '=' characters
    const byteArray = new Uint8Array([...binaryString].map(char => char.charCodeAt(0)));
    return [...byteArray];
}
