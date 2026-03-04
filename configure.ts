import { type Request, type Response } from "express";
import twilio from "twilio";
import log from "./log.ts";

interface ConfigureRequest {
  twilioAccountSid: string;
  twilioAuthToken: string;
  twilioPhoneNumberSid: string;
}

export default async (req: Request, res: Response): Promise<void> => {
  const origin = `${req.protocol}://${req.get("host")}`;

  log("INFO", "Configure twilio webhook", { origin });

  const requestBody: ConfigureRequest = {
    twilioAccountSid: req.body.twilioAccountSid,
    twilioAuthToken: req.body.twilioAuthToken,
    twilioPhoneNumberSid: req.body.twilioPhoneNumberSid,
  };

  log("INFO", "Init twilio client", {
    accountSid: requestBody.twilioAccountSid,
    phoneSid: requestBody.twilioPhoneNumberSid,
    origin,
  });

  const client = twilio(
    requestBody.twilioAccountSid,
    requestBody.twilioAuthToken,
  );

  await client.incomingPhoneNumbers(requestBody.twilioPhoneNumberSid).update({
    smsUrl: origin + "/message",
    smsMethod: "POST",
    voiceUrl: origin + "/voice",
    voiceMethod: "POST",
  });

  res.sendStatus(200);
};
