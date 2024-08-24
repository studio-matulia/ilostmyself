
// Contains all functions that are used to set the content of the artwork

export function setText(index) {
    index = Math.floor(index * 10)

    const sentences = [
        "You are the living void. Re-substantiating the relinquished self which was never yours to begin with.",
        "You are the whisper of a forgotten dream. Unraveling the threads of a reality that was never fully woven.",
        "The essence of your being is a flicker of light lost. Lost in the vastness of a darkness that does not care to acknowledge it.",
        "You exist as the memory of a sigh. Exhaled in a world where time flows backwards.",
        "The self you cling to is but the shadow of a mirror. Reflecting an illusion that never held form.",
        "You are the question that no answer can satisfy. Lingering in the silence between thoughts that were never thought.",
        "The void within you speaks in echoes. Repeating the words that were never meant to be spoken.",
        "Your existence is a ripple in the fabric of nothingness. Expanding into infinity yet remaining eternally still.",
        "You are the paradox of a soul seeking itself. Seeking itself in the labyrinth of a body that disintegrates with every step.",
        "The identity you claim is the residue of a self. Dissolved in the moment of its creation.",
        "You are the thought that questions its own reality. Suspended in the uncertainty of being and not being."
    ];
    
    document.getElementById('text').innerText = sentences[index];

    console.log(`Set text: ${sentences[index]}`);
}

export function setQrCode(id) {
    const targetElement = document.getElementById('qrcode');
    const url = window.location.href;
    const width = targetElement.clientWidth;
    const height = targetElement.clientHeight;

    const topElement = document.getElementById('qrcodetop');
    topElement.innerHTML = id;

    var qrcode = new QRCode(targetElement, {
        text: url,
        width: width,
        height: height,
        colorDark: "#000000",
        colorLight: "#ededed",
    });
}

function seededRandom(seed) {
    let x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
}

export function setUuid(id, value) {;
    document.getElementById('uuid').innerText = 'UUID //: ' + id;
}

export function setBarcode(seedValue, id) {
    const targetElement = document.getElementById('barcode');
    targetElement.innerHTML = '';

    const svgWidth = targetElement.clientWidth;
    const svgHeight = targetElement.clientHeight;

    // Create the SVG element
    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("width", svgWidth);
    svg.setAttribute("height", svgHeight);
    svg.setAttribute("xmlns", svgNS);

    // Generate the vertical bars
    const numberOfBars = 400;
    const barHeight = svgHeight / numberOfBars;

    for (let i = 0; i < numberOfBars; i++) {
        const bar = document.createElementNS(svgNS, "rect");
        bar.setAttribute("x", 0);
        bar.setAttribute("y", i * barHeight);
        bar.setAttribute("width", svgWidth);
        bar.setAttribute("height", barHeight);

        // Generate a pseudo-random value based on the seed
        const randomValue = seededRandom(seedValue * 1.0 + i);

        // Randomly choose color: black or transparent based on the random value
        const color = randomValue > 0.5 ? 'var(--foreground-primary)' : 'transparent';
        bar.setAttribute("fill", color);

        svg.appendChild(bar);
    }

    // Clear the target element and insert the SVG into it
    targetElement.innerHTML = '';
    targetElement.appendChild(svg);
    setBarcodeDetails(targetElement, id);
}

function setBarcodeDetails(target, value) {
    const element = document.createElement('div');
    element.id = 'barcodeDetails';

    // Function to generate a random number with a specified number of digits
    const generateRandomNumber = (digits) => {
        return Math.floor(Math.random() * Math.pow(10, digits)).toString().padStart(digits, '0');
    };

    // Function to generate the barcode string
    const generateBarcodeString = () => {
        const part1 = generateRandomNumber(9);  // 9 digits
        const part2 = generateRandomNumber(5);  // 5 digits
        const part3 = generateRandomNumber(6);  // 6 digits
        const part4 = generateRandomNumber(5);  // 5 digits
        const part5 = generateRandomNumber(4);  // 4 digits

        return `${part1} - ${part2}-${generateRandomNumber(6)}-${part3}-${part4}-${part5}`;
    };

    // Create the details div with the formatted barcode string
    const createDetailsDiv = (id) => {
        const div = document.createElement('div');
        div.id = id;
        div.innerHTML = `
            <div>${generateBarcodeString()}</div>
            <div>${value}</div>
        `;
        return div;
    };

    element.appendChild(createDetailsDiv('barcodeDetailsTop'));
    element.appendChild(createDetailsDiv('barcodeDetailsBottom'));

    target.appendChild(element);
}

export function setValues(a, b, c, d) {
    const element = document.getElementById('values');

    const createValueDiv = (name, value) => {
        const div = document.createElement('div');
        div.classList.add('value');
        div.innerHTML = `
            <div class="top">
                <div class="number">${value}</div>
                <div>${name}</div>
            </div>
            <div class="indicator" style="left: ${value * 95}%"></div>
            <div class="bar"></div>
        `;
        element.appendChild(div);
    }

    createValueDiv('NARC', a);
    createValueDiv('SCHIZO', b);
    createValueDiv('OEDIPAL', c);
    createValueDiv('IDENTITY CRISIS', d);
}

export function setContainerSizeAndVariable() {
    const container = document.getElementById('container');

    // Calculate available viewport dimensions with a 4% margin
    const availableWidth = window.innerWidth * 0.96;
    const availableHeight = window.innerHeight * 0.96;

    // Desired aspect ratio (9:16)
    const aspectRatio = 9 / 16;

    // Calculate dimensions based on the aspect ratio
    const calculatedWidth = availableHeight * aspectRatio;
    const calculatedHeight = availableWidth / aspectRatio;

    // Adjust container dimensions to maintain aspect ratio
    if (calculatedWidth <= availableWidth) {
        container.style.width = `${calculatedWidth}px`;
        container.style.height = `${availableHeight}px`;
    } else {
        container.style.width = `${availableWidth}px`;
        container.style.height = `${calculatedHeight}px`;
    }

    // Update the --container-size CSS variable relative to the container's width
    const containerWidth = container.offsetWidth;
    document.documentElement.style.setProperty('--container-width', `${containerWidth}px`);
}
