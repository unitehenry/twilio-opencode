# Twilio Opencode

A lightweight express server to handle twilio voice and messaging webhooks and prompt opencode.

## Usage

1. [Start an opencode server](https://opencode.ai/docs/server/)
2. [Start the twilio opencode server](#start-server)
3. [Configure Twilio](#configure-twilio)

### Start server

```bash
docker run twilio-opencode \
    -e OPENCODE_BASE_URL="http://127.0.0.1:36967" \
    -p 3000:3000
```

### Configure Twilio

*todo: twilio settings*

## Build an image

```bash
sh scripts/build.sh
```
