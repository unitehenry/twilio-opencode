# Twilio Opencode

A lightweight express server to handle twilio voice and messaging webhooks for prompting opencode.

## Usage

1. [Start an opencode server](https://opencode.ai/docs/server/)
2. [Start the twilio opencode server](#start-server)
3. [Configure twilio](#configure-twilio)

### Start server

```bash
docker run twilio-opencode \
    -e OPENCODE_BASE_URL="http://127.0.0.1:4096" \
    -p 3000:3000
```

### Configure twilio

Use the `/configure` endpoint to programatically update Twilio phone number settings.

```bash
TWILIO_ACCOUNT_SID="ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" \
TWILIO_PHONE_NUMBER_SID="PNxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" \
TWILIO_AUTH_TOKEN="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" \
curl -X POST \
  "http://localhost:3000/configure" \
  -d "twilioAccountSid=$TWILIO_ACCOUNT_SID&twilioPhoneNumberSid=$TWILIO_PHONE_NUMBER_SID&twilioAuthToken=$TWILIO_AUTH_TOKEN"
```

## Environment variables

| Variable | Description | Default |
|----------|-------------|---------|
| `OPENCODE_BASE_URL` | Base URL for the opencode client to connect to. | None |
| `PORT` | Port on which the express server listens. | 3000 |
| `FROM_WHITELIST` | Comma-separated list of whitelisted phone numbers for incoming requests. (Ex: `+1234567891,+13456789201`) If not set, all numbers will be able to prompt opencode. | None |
| `TWILIO_AUTH_TOKEN` | Twilio Auth Token for webhook validation. If not set, webhooks will not be validated. | None |

## Local Proxy

There is a `ngrok` script to make local development easy.

```bash
TWILIO_ACCOUNT_SID="ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" \
TWILIO_PHONE_NUMBER_SID="PNxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" \
TWILIO_AUTH_TOKEN="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" \
OPENCODE_BASE_URL="http://127.0.0.1:4096" \
scripts/ngrok.sh
```

## Build an image

```bash
scripts/build.sh
```
