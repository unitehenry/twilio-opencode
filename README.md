# Twilio Opencode

A lightweight express server to handle twilio voice and messaging webhooks for prompting opencode.

## Usage

1. [Start an opencode server](https://opencode.ai/docs/server/)
2. [Start the twilio opencode server](#start-server)
3. [Configure twilio](#configure-twilio)

## Environment variables

| Variable | Description | Default |
|----------|-------------|---------|
| `OPENCODE_BASE_URL` | Base URL for the opencode server to connect to. | None |
| `PORT` | Port on which the express server listens. | 3000 |
| `FROM_WHITELIST` | Comma-separated list of whitelisted phone numbers for incoming requests. (Ex: `+1234567891,+134567892`) | None |
| `TWILIO_AUTH_TOKEN` | Twilio Auth Token for webhook validation. If not set, webhooks will not be validated. | None |

### Start server

```bash
docker run twilio-opencode \
    -e OPENCODE_BASE_URL="http://127.0.0.1:36967" \
    -p 3000:3000
```

### Configure twilio

*todo: twilio settings*

## Build an image

```bash
sh scripts/build.sh
```
