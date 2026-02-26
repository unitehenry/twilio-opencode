import { type Request, type Response } from "express";
import twilio from 'twilio';
import whitelist from "./whitelist.ts";
import prompt from "./prompt.ts";
import log from "./log.ts";

function buildResponse(message: string): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
    <Response>
      <Message>
        <Body>${message}</Body>
      </Message>
    </Response>
  `;
}

interface SendMessageParams {
  twilioAccountSid : string;
  twilioAuthToken : string;
  fromNumber : string;
  toNumber : string;
  message : string;
}

async function sendMessage(params : SendMessageParams) : Promise<void> {
  const client = twilio(params.twilioAccountSid, params.twilioAuthToken);

  try {
    const message = await client.messages.create({
      body: params.message,
      from: params.fromNumber,
      to: params.toNumber
    });

    log('INFO', 'Twilio message sent', { message });
  } catch(error) {
    log('ERROR', 'Failed to send twilio message', { error });
  }
}

export default async (req: Request, res: Response): Promise<void> => {
  const messageId: string = req.body.MessageSid;

  const from: string = req.body.From;

  log("INFO", "Message webhook received", { messageId, from });

  if (!whitelist(from)) {
    log("WARN", "Phone number not whitelisted", { messageId, from });

    return;
  }

  const messageResult: string = req.body.Body;

  if (!messageResult) return;

  log("INFO", "User message received", { messageResult });

  const { sessionId, text } = await prompt({ message: messageResult });

  log("INFO", "Agent responded", { sessionId, text });

  const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;

  if (!twilioAuthToken) {
    log('INFO', "Replying via webhook response");

    const message = buildResponse(text);

    res.set("Content-Type", "text/xml");

    res.send(message);

    return;
  }

  const twilioAccountSid: string = req.body.AccountSid;

  const sendMessageParams = {
    twilioAccountSid,
    twilioAuthToken,
    fromNumber: req.body.to,
    toNumber: from,
    message: text
  };

  log('INFO', 'Sending message via twilio client', { twilioAccountSid, fromNumber: sendMessageParams.fromNumber, toNumber: sendMessageParams.toNumber });

  await sendMessage(sendMessageParams);

  res.sendStatus(200);
};
