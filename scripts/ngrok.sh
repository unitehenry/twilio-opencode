#!/usr/bin/env bash

# Start ngrok in background
ngrok http 3000 &
NGROK_PID=$!

# Wait for ngrok to be ready
sleep 2

# Start serve in background
scripts/serve.sh &
SERVE_PID=$!

# Configure via the tunnel
curl -X POST \
  "$(curl -s http://127.0.0.1:4040/api/tunnels | grep -oE 'https://[^"]+')/configure" \
  -d "{
    \"twilioAccountSid\": \"$TWILIO_ACCOUNT_SID\",
    \"twilioPhoneNumberSid\": \"$TWILIO_PHONE_NUMBER_SID\",
    \"twilioAuthToken\": \"$TWILIO_AUTH_TOKEN\"}
  "

# Trap to kill background processes on script exit
trap "kill $NGROK_PID $SERVE_PID" EXIT

# Wait for background processes
wait $NGROK_PID $SERVE_PID
