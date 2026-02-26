import express from "express";
import twilio from "twilio";
import log from "./log.ts";
import message from "./message.ts";
import voice from "./voice.ts";
import health from "./health.ts";

const app = express();

const validate = !!process.env.TWILIO_AUTH_TOKEN;

app.set("trust proxy", true);

app.use(express.urlencoded({ extended: false }));

app.post("/voice", twilio.webhook({ validate }), voice);

app.post("/message", twilio.webhook({ validate }), message);

app.get("/health", health);

const port: number = parseInt(process.env.PORT || "3000", 10);

const server = app.listen(port, (): void =>
  log("INFO", "Server started", { port }),
);

process.on("SIGINT", () => {
  log("INFO", "Received SIGINT, shutting down gracefully");
  server.close(() => {
    log("INFO", "Server closed");
    process.exit(0);
  });
});

process.on("SIGTERM", () => {
  log("INFO", "Received SIGTERM, shutting down gracefully");
  server.close(() => {
    log("INFO", "Server closed");
    process.exit(0);
  });
});
