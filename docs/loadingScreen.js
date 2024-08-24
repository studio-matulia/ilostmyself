
import { setParametersInUrlAndReload } from './utils.js';

export function initLoadingAnimation() {
    const duration = 5000;  // Total time for the animation (in milliseconds)
    let animationRunning = false;  // Flag to track if the animation is running
    let isOverlayVisible = false;  // Flag to track if the overlay is visible
    let loadingProgress = 0;  // Track loading progress
    let isAnalysisStarted = false;  // Flag to track if analysis has started

    const overlay = document.getElementById('overlay');
    const progressBar = document.getElementById('loadingBar');
    const logsElement = document.getElementById('logs');
    const analyzeElement = document.getElementById('analyze');
    const instructionElement = document.createElement('div');
    instructionElement.id = 'instruction';
    analyzeElement.appendChild(instructionElement);

    if (!overlay || !progressBar || !logsElement || !analyzeElement) {
        console.error('Required elements not found.');
        return;
    }

    const showOverlay = () => {
        overlay.style.display = 'flex';
        analyzeElement.style.display = 'flex';
        logsElement.style.display = 'none';
        overlay.style.opacity = '1';
        isOverlayVisible = true;
        updateInstruction();
    };

    const hideOverlay = () => {
        overlay.style.opacity = '0';
        setTimeout(() => {
            overlay.style.display = 'none';
            isOverlayVisible = false;
            // Reset for next use
            analyzeElement.style.display = 'flex';
            logsElement.style.display = 'none';
            progressBar.style.width = '0';
            loadingProgress = 0;
            isAnalysisStarted = false;
            updateInstruction();
        }, 500);  // Matches transition duration
    };

    const updateInstruction = () => {
        if (!isOverlayVisible) {
            instructionElement.textContent = '';
        } else if (loadingProgress < 1) {
            instructionElement.textContent = 'Press sample for at least 5 seconds';
        } else {
            instructionElement.textContent = 'Lift the sample for analysis';
        }
    };

    const startAnimation = () => {
        if (animationRunning) return;

        console.log('Started loading animation');
        animationRunning = true;
        let startTime = null;

        const updateWidth = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const elapsed = timestamp - startTime;
            loadingProgress = Math.min(elapsed / duration, 1);
            console.log(`Progress: ${loadingProgress}`);
            progressBar.style.width = `${loadingProgress * 100}%`;
            updateInstruction();

            if (loadingProgress < 1 && animationRunning) {
                requestAnimationFrame(updateWidth);
            } else {
                animationRunning = false;
                console.log('Loading complete');
                updateInstruction();
            }
        };

        requestAnimationFrame(updateWidth);
    };

    const stopAnimation = () => {
        if (!animationRunning) return;

        console.log('Stopped loading animation');
        animationRunning = false;
    };

    const fillLogs = () => {
        console.log('Filling logs');
        analyzeElement.style.display = 'none';
        logsElement.style.display = 'block';
        logsElement.innerHTML = '';  // Clear existing logs
        let logCount = 0;
        const maxLogs = 20;

        const generateLogEntry = () => {
            const timestamp = new Date().toISOString().replace('T', ' ').substr(0, 19);
            const indicators = [
   
                // Family psychology concepts
                `Family cohesion index: ${(Math.random() * 100).toFixed(2)}%`,
                `Parental attachment score: ${(Math.random() * 10).toFixed(1)}/10`,
                `Sibling rivalry factor: ${(Math.random() * 5).toFixed(1)}`,
                `Emotional intelligence quotient: ${Math.floor(Math.random() * 50) + 100}`,
                
                // Star signs and astrological concepts
                `Mercury retrograde intensity: ${(Math.random() * 10).toFixed(1)}`,
                `Zodiac alignment: ${['Strong', 'Moderate', 'Weak'][Math.floor(Math.random() * 3)]}`,
                `Astrological compatibility: ${(Math.random() * 100).toFixed(2)}%`,
                `Lunar phase influence: ${(Math.random() * 10).toFixed(1)}/10`,
                
                // Pseudomedical indicators
                `Chakra balance level: ${(Math.random() * 100).toFixed(2)}%`,
                `Aura vibrancy: ${(Math.random() * 1000).toFixed(0)} Hz`,
                `Bio-resonance frequency: ${(Math.random() * 100 + 400).toFixed(1)} THz`,
                `Tachyon particle density: ${(Math.random() * 1000).toFixed(0)} ppm`,
                
                // Mix of all
                `Psychosomatic resonance with ${['Mars', 'Venus', 'Jupiter', 'Saturn'][Math.floor(Math.random() * 4)]}: ${(Math.random() * 100).toFixed(2)}%`,
                `Quantum entanglement with family members: ${['Strong', 'Moderate', 'Weak'][Math.floor(Math.random() * 3)]}`,
                `Karmic debt accumulation rate: ${(Math.random() * 10).toFixed(2)} units/day`,
                `Holistic wellness index: ${(Math.random() * 100).toFixed(2)}%`
            ];

            const randomIndicator = indicators[Math.floor(Math.random() * indicators.length)];
            return `${timestamp} - ${randomIndicator}`;
        };

        const addLog = () => {
            if (logCount < maxLogs) {
                const log = document.createElement('div');
                log.textContent = generateLogEntry();
                logsElement.appendChild(log);
                logCount++;
                setTimeout(addLog, 1000);  // Add a new log every 1 second
            } else {
                // All logs added, hide overlay
                setTimeout(hideOverlay, 1000);  // Hide overlay 1 second after the last log
                setParametersInUrlAndReload();
            }
        };

        addLog();
    };

    window.addEventListener('keydown', function (event) {
        if (event.key === 'S' && !isOverlayVisible && !isAnalysisStarted) {
            showOverlay();
            startAnimation();
        } else if (event.key === 'U' && !isAnalysisStarted) {
            stopAnimation();
            if (loadingProgress === 1) {  // Only proceed if loading is 100% complete
                isAnalysisStarted = true;
                fillLogs();
            } else {
                console.log('Loading not complete. Returning to original state.');
                hideOverlay();  // Hide overlay without showing logs
            }
        }
    });
}