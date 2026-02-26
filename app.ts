import express, { type Request, type Response } from "express";
import log from "./log.ts";
import message from './message.ts';
import voice from './voice.ts';
import health from './health.ts';
import { prompt } from "./prompt.ts";

const app = express();

app.use(express.urlencoded());

app.post("/voice", voice);

app.post("/message", message);

app.get("/health", health);

const port: number = parseInt(process.env.PORT || "3000", 10);

app.listen(port, (): void => log("INFO", "Server started", { port }));
