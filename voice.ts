import { type Request, type Response } from "express";
import twilio from "twilio";
import prompt from "./prompt.ts";
import whitelist from "./whitelist.ts";
import log from "./log.ts";

const HOLD_MUSIC_URL =
  "http://com.twilio.sounds.music.s3.amazonaws.com/MARKOVICHAMP-Borghestral.mp3";

function buildResponse(message: string): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
    <Response>
      <Gather input="speech" action="/voice" method="POST">
        <Say>${message}</Say>
      </Gather>
    </Response>
  `;
}

function hangup(res: Response, message: string = ""): void {
  const responseXml = `<?xml version="1.0" encoding="UTF-8"?>
      <Response>
        <Say>${message}</Say>
        <Hangup />
      </Response>
    `;

  res.set("Content-Type", "text/xml");

  res.send(responseXml);
}

function hold(res: Response): void {
  const responseXml = `<?xml version="1.0" encoding="UTF-8"?>
    <Response>
      <Say>Let me work on that for you...</Say>
      <Play loop="0">${HOLD_MUSIC_URL}</Play>
    </Response>`;

  res.set("Content-Type", "text/xml");

  res.send(responseXml);
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

    const response = buildResponse("What can I do for you?");

    res.set("Content-Type", "text/xml");

    res.send(response);

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

  const response = buildResponse(text);

  if (!twilioAuthToken) {
    res.set("Content-Type", "text/xml");

    res.send(response);

    return;
  }

  const accountSid: string = req.body.AccountSid;

  const twilioClient = twilio(accountSid, twilioAuthToken);

  twilioClient.calls(callSid).update({ twiml: response });
};
