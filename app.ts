import express from "express";
import twilio from "twilio";
import log from "./log.ts";
import message from "./message.ts";
import voice from "./voice.ts";
import health from "./health.ts";

const app = express();

const validate = !!process.env.TWILIO_AUTH_TOKEN;

app.use(express.urlencoded({ extended: false }));

app.post("/voice", twilio.webhook({ validate }), voice);

app.post("/message", twilio.webhook({ validate }), message);

app.get("/health", health);

const port: number = parseInt(process.env.PORT || "3000", 10);

app.listen(port, (): void => log("INFO", "Server started", { port }));
