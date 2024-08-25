#!/bin/bash

# Navigate to the directory containing the HTML file
cd docs

# Start the Python HTTP server in the background
python3 -m http.server 8000 &

# Wait for a moment to ensure the server starts
sleep 2

# Launch Chromium in kiosk mode (fullscreen) to the served page
chromium-browser --kiosk http://localhost:8000/index.html