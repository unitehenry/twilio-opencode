import { type Request, type Response } from "express";
import prompt from './prompt.ts';
import log from './log.ts';

function buildResponse(message: string): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
    <Response>
      <Message>
        <Body>${message}</Body>
      </Message>
    </Response>
  `;
}

export default async (req: Request, res: Response): Promise<void> => {
  const messageId: string = req.body.MessageSid;

  log("INFO", `Message webhook received`, { messageId });

  const messageResult: string = req.body.Body;

  if (!messageResult) return;

  log("INFO", "User message received", { messageResult });

  const { sessionId, text } = await prompt({ message: messageResult });

  log("INFO", "Agent responded", { sessionId, text });

  const message = buildResponse(text);

  res.set("Content-Type", "text/xml");

  res.send(message);
}
