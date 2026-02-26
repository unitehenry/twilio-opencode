# Twilio Opencode

A lightweight express server to handle twilio voice and messaging webhooks and prompt opencode.

## Usage

1. Start an opencode server
2. [Start the twilio opencode server](#start-server)

### Start server

```bash
docker run twilio-opencode \
    -e OPENCODE_BASE_URL="http://127.0.0.1:36967" \
    -p 3000:3000
```

## Build an image

```bash
sh scripts/build.sh
```
