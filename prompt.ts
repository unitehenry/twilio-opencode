import { createOpencodeClient, type Part } from "@opencode-ai/sdk";
import log from "./log.ts";

interface PromptResult {
  sessionId: string;
  text: string;
}

interface PromptParams {
  message: string;
  sessionId?: string;
}

function logPart(part: Part): Part {
  log("INFO", "Agent part", { part });
  return part;
}

export default async (params: PromptParams): Promise<PromptResult> => {
  const baseUrl = process.env.OPENCODE_BASE_URL || undefined;

  const { message, sessionId } = params;

  log("INFO", "Prompting agent", { sessionId, baseUrl, message });

  const client = createOpencodeClient({ baseUrl });

  const id: string = await (async (): Promise<string> => {
    if (sessionId) {
      return sessionId;
    }

    log("INFO", "Creating opencode session");

    const sessionResult = await client.session.create();

    return sessionResult.data.id;
  })();

  log("INFO", "Session connected", { sessionId: id });

  const result = await client.session.prompt({
    path: { id },
    body: {
      parts: [{ type: "text", text: message }],
    },
  });

  const text: string = result.data.parts
    .map(logPart)
    .filter((part) => part.type === "text")
    .reduce((response: string, part) => response + " " + part.text, "");

  return { sessionId: id, text };
};
