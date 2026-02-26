import express, { type Request, type Response } from "express";
import log from "./log.ts";
import { prompt } from "./prompt.ts";

const app = express();

app.use(express.urlencoded());

function agentResponse(res: Response, message: string): void {
  res.set("Content-Type", "text/xml");

  res.send(`<?xml version="1.0" encoding="UTF-8"?>
    <Response>
      <Gather input="speech" action="/" method="POST">
        <Say>${message}</Say>
      </Gather>
    </Response>
  `);
}

function smsResponse(res: Response, message: string): void {
  res.set("Content-Type", "text/xml");

  res.send(`<?xml version="1.0" encoding="UTF-8"?>
    <Response>
      <Message>
        <Body>${message}</Body>
      </Message>
    </Response>
  `);
}

function hangup(res: Response): void {
  res.set("Content-Type", "text/xml");

  res.send(
    '<?xml version="1.0" encoding="UTF-8"?><Response><Hangup/></Response>',
  );
}

app.post("/voice", async (req: Request, res: Response): Promise<void> => {
  const callId: string = req.body.CallSid;

  console.log(`Call ID: ${callId}`);

  const speechResult: string = req.body.SpeechResult;

  if (speechResult) {
    console.log("User message:", speechResult);

    const { sessionId, text } = await prompt(
      speechResult,
      app.get(callId) as string | null,
    );

    app.set(callId, sessionId);

    console.log(text);

    agentResponse(res, text);
  } else {
    agentResponse(res, "Please say something.");
  }
});

app.post("/message", async (req: Request, res: Response): Promise<void> => {
  const messageId: string = req.body.MessageSid;

  console.log(`Message ID: ${messageId}`);

  const messageResult: string = req.body.Body;

  if (!messageResult) return;

  console.log("User message:", messageResult);

  const { text } = await prompt(messageResult, null);

  console.log(text);

  smsResponse(res, text);
});

app.get("/health", (req, res) => res.sendStatus(200));

const port: number = parseInt(process.env.PORT || "3000", 10);

app.listen(port, (): void => {
  log('INFO', `Server running on port ${port}`);
});
