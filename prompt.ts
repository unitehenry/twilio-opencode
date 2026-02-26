import { createOpencodeClient } from "@opencode-ai/sdk";
import log from "./log.ts";

interface PromptResult {
  sessionId: string;
  text: string;
}

export async function prompt(
  message: string,
  sessionId: string | null,
): Promise<PromptResult> {
  const baseUrl = "http://127.0.0.1:36967";

  log("INFO", 'Prompting agent', { sessionId, baseUrl, message });

  const client = createOpencodeClient({ baseUrl });

  const id: string = await (async (): Promise<string> => {
    if (sessionId) {
      return sessionId;
    }

    log('INFO', 'Creating opencode session');

    const sessionResult = await client.session.create();

    return sessionResult.data.id;
  })();

  log("INFO", 'Session connected', { sessionId: id });

  const result = await client.session.prompt({
    path: { id },
    body: {
      parts: [{ type: "text", text: message }],
    },
  });

  const text: string = result.data.parts
    .filter((part) => part.type === "text")
    .reduce((response: string, part) => response + " " + part.text, "");

  return { sessionId: id, text };
}
