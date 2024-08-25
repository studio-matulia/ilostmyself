#!/bin/bash
# Give some time for the server to start
sleep 10
# Launch Chromium in kiosk mode
chromium-browser --kiosk http://localhost:8000