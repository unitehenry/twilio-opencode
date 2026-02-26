import { type Request, type Response } from "express";
import prompt from "./prompt.ts";
import log from "./log.ts";

function buildResponse(message: string): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
    <Response>
      <Gather input="speech" action="/" method="POST">
        <Say>${message}</Say>
      </Gather>
    </Response>
  `;
}

export default async (req: Request, res: Response): Promise<void> => {
  const app = req.app;

  const callId: string = req.body.CallSid;

  const from: string = req.body.From;

  log("INFO", `Call webhook received`, { callId, from });

  const speechResult: string = req.body.SpeechResult;

  if (!speechResult) {
    log("INFO", "No speech result received");

    const response = buildResponse("Please say something.");

    res.set("Content-Type", "text/xml");

    res.send(response);

    return;
  }

  log("INFO", "Caller message received", { callId, speechResult });

  const { sessionId, text } = await prompt({
    message: speechResult,
    sessionId: app.get(callId) as string | null,
  });

  log("INFO", "Agent responded", { callId, sessionId, text });

  app.set(callId, sessionId);

  log("INFO", "Session cached", { callId, sessionId });

  const response = buildResponse(text);

  res.set("Content-Type", "text/xml");

  res.send(response);
};
