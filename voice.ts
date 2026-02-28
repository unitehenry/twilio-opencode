import { type Request, type Response } from "express";
import twilio from "twilio";
import prompt from "./prompt.ts";
import whitelist from "./whitelist.ts";
import log from "./log.ts";

const DEFAULT_GREETING = "Hello";

const HOLD_MUSIC_URL =
  "http://com.twilio.sounds.music.s3.amazonaws.com/MARKOVICHAMP-Borghestral.mp3";

function buildResponseXml(req: Request, message: string): string {
  const origin = `${req.protocol}://${req.get("host")}`;

  return `<?xml version="1.0" encoding="UTF-8"?>
    <Response>
      <Gather input="speech" action="${origin}/voice" method="POST">
        <Say>${message}</Say>
      </Gather>
    </Response>
  `;
}

function respond(req: Request, res: Response, message: string): void {
  const responseXml = buildResponseXml(req, message);

  res.set("Content-Type", "text/xml");

  res.send(responseXml);
}

function buildHangupXml(message: string) {
  return `<?xml version="1.0" encoding="UTF-8"?>
      <Response>
        <Say>${message}</Say>
        <Hangup />
      </Response>
    `;
}

function hangup(res: Response, message: string = ""): void {
  const hangupXml = buildHangupXml(message);

  res.set("Content-Type", "text/xml");

  res.send(hangupXml);
}

function buildHoldXml(holdMusicUrl: string) {
  return `<?xml version="1.0" encoding="UTF-8"?>
    <Response>
      <Play loop="0">${holdMusicUrl}</Play>
    </Response>`;
}

function hold(res: Response): void {
  const holdXml = buildHoldXml(HOLD_MUSIC_URL);

  res.set("Content-Type", "text/xml");

  res.send(holdXml);
}

interface UpdateCallParams {
  request: Request;
  accountSid: string;
  callSid: string;
  message: string;
  twilioAuthToken: string;
}

async function updateCall(params: UpdateCallParams): Promise<void> {
  const twilioClient = twilio(params.accountSid, params.twilioAuthToken);

  const twiml = buildResponseXml(params.request, params.message);

  try {
    log("INFO", "Updating twilio call", { callSid: params.callSid });

    await twilioClient.calls(params.callSid).update({ twiml });
  } catch (error) {
    log("ERROR", "Failed to update call", { error });
  }
}

export default async (req: Request, res: Response): Promise<void> => {
  const app = req.app;

  const callSid: string = req.body.CallSid;

  const from: string = req.body.From;

  log("INFO", `Call webhook received`, { callSid, from });

  if (!whitelist(from)) {
    log("WARN", "Phone number not whitelisted", { callSid, from });

    hangup(res);

    return;
  }

  const speechResult: string = req.body.SpeechResult;

  if (!speechResult) {
    log("INFO", "No speech result received");

    respond(req, res, DEFAULT_GREETING);

    return;
  }

  log("INFO", "Caller message received", { callSid, speechResult });

  const twilioAuthToken: string | undefined = process.env.TWILIO_AUTH_TOKEN;

  if (twilioAuthToken) {
    hold(res);
  }

  const { sessionId, text } = await prompt({
    message: speechResult,
    sessionId: app.get(callSid) as string | null,
  });

  log("INFO", "Agent responded", { callSid, sessionId, text });

  app.set(callSid, sessionId);

  log("INFO", "Session cached", { callSid, sessionId });

  if (!twilioAuthToken) {
    log("INFO", "No auth token, responding to webhook");

    respond(req, res, text);

    return;
  }

  const accountSid: string = req.body.AccountSid;

  log("INFO", "Creating twilio client", { accountSid });

  await updateCall({
    accountSid,
    callSid,
    twilioAuthToken,
    request: req,
    message: text,
  });
};
